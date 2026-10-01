<?php

namespace App\Http\Controllers;

use App\Models\User;
use App\Models\Employee;
use Spatie\Permission\Models\Role;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\Mail;
use Illuminate\Support\Str;
use App\Mail\EmployeeWelcomeMail;
use App\Mail\EmailProvisioningRequest;
use Illuminate\Validation\Rule;

class UserController extends Controller
{
    public function index()
    {
        $users = User::with(['roles', 'employee'])->get();
        return response()->json($users);
    }

    public function roles()
    {
        return response()->json(Role::all());
    }

    public function store(Request $request)
    {
        $validated = $request->validate([
            'name' => 'required|string|max:255',
            'first_name' => 'required|string|max:255',
            'last_name' => 'required|string|max:255',
            'personal_email' => 'required|string|email|max:255',
            'email' => [
                'required',
                'string',
                'email',
                'max:255',
                'unique:users',
                function ($attribute, $value, $fail) {
                    if (!Str::endsWith($value, '@titecautomation.lk')) {
                        $fail('The email must be a @titecautomation.lk address.');
                    }
                },
            ],
            'roles' => 'array',
            'roles.*' => 'exists:roles,id',
            'department' => 'nullable|string',
            'designation' => 'nullable|string',
            'phone' => 'nullable|string',
            'date_joined' => 'nullable|date',
        ]);

        // Generate a complex password to satisfy cPanel requirements (letters, numbers, symbols, no spaces)
        $password = Str::password(16, true, true, true, false);
        $provisioningToken = Str::uuid()->toString();

        $user = DB::transaction(function () use ($validated, $password, $provisioningToken) {
            $user = User::create([
                'name' => $validated['name'],
                'email' => $validated['email'],
                'password' => Hash::make($password),
                'role' => 'admin',
                'force_password_reset' => true,
            ]);

            if (!empty($validated['roles'])) {
                $user->roles()->sync($validated['roles']);
            }

            $user->employee()->create([
                'first_name' => $validated['first_name'],
                'last_name' => $validated['last_name'],
                'personal_email' => $validated['personal_email'],
                'department' => $validated['department'] ?? null,
                'designation' => $validated['designation'] ?? null,
                'phone' => $validated['phone'] ?? null,
                'date_joined' => $validated['date_joined'] ?? now(),
                'email_provisioning_status' => 'pending_email',
                'provisioning_token' => $provisioningToken,
            ]);

            return $user;
        });

        // Send provisioning request to all configured developers
        $confirmUrl = url("/api/email/confirm/{$provisioningToken}");
        $devEmails = array_filter(array_map('trim', explode(',', env('DEV_EMAILS', ''))));

        if (!empty($devEmails)) {
            $user->load('employee');
            foreach ($devEmails as $devEmail) {
                Mail::to($devEmail)->send(new EmailProvisioningRequest($user, $password, $confirmUrl));
            }
        }

        $user->load(['roles', 'employee']);

        return response()->json($user, 201);
    }

    public function update(Request $request, User $user)
    {
        $validated = $request->validate([
            'name' => 'required|string|max:255',
            'first_name' => 'nullable|string|max:255',
            'last_name' => 'nullable|string|max:255',
            'personal_email' => 'nullable|string|email|max:255',
            'email' => [
                'required',
                'string',
                'email',
                'max:255',
                Rule::unique('users')->ignore($user->id),
            ],
            'roles' => 'array',
            'roles.*' => 'exists:roles,id',
            'department' => 'nullable|string',
            'designation' => 'nullable|string',
        ]);

        $user->update([
            'name' => $validated['name'],
            'email' => $validated['email'],
        ]);

        if (isset($validated['roles'])) {
            $user->roles()->sync($validated['roles']);
        }

        // Update or create employee record
        $user->employee()->updateOrCreate(
            ['user_id' => $user->id],
            [
                'first_name' => $validated['first_name'] ?? ($user->employee->first_name ?? explode(' ', $user->name)[0]),
                'last_name' => $validated['last_name'] ?? ($user->employee->last_name ?? ''),
                'personal_email' => $validated['personal_email'] ?? ($user->employee->personal_email ?? null),
                'department' => $validated['department'] ?? null,
                'designation' => $validated['designation'] ?? null,
            ]
        );

        $user->load(['roles', 'employee']);

        return response()->json($user);
    }

    public function destroy(User $user)
    {
        // Delete employee data as well
        if ($user->employee) {
            $user->employee->delete();
        }
        $user->delete();
        return response()->json(null, 204);
    }

    /**
     * Send welcome email to employee (only if email is provisioned).
     */
    public function resendWelcome(User $user)
    {
        // Check that the email has been provisioned before sending credentials
        if ($user->employee && $user->employee->email_provisioning_status === 'pending_email') {
            return response()->json([
                'message' => 'Cannot send welcome email. The company email has not been created yet. Please wait for a developer to confirm email creation.'
            ], 422);
        }

        // Generate a complex password to satisfy cPanel requirements (letters, numbers, symbols, no spaces)
        $password = Str::password(16, true, true, true, false);

        $user->update([
            'password' => Hash::make($password),
            'force_password_reset' => true,
        ]);

        $emailDestination = $user->employee && $user->employee->personal_email
            ? $user->employee->personal_email
            : $user->email;

        Mail::to($emailDestination)->send(new EmployeeWelcomeMail($user, $password));

        // Mark as fully active once welcome email is sent
        if ($user->employee && $user->employee->email_provisioning_status === 'provisioned') {
            $user->employee->update(['email_provisioning_status' => 'active']);
        }

        $user->load(['roles', 'employee']);

        return response()->json([
            'message' => 'Welcome email sent successfully.',
            'user' => $user,
        ]);
    }

    /**
     * Developer confirms that the email account has been created in cPanel.
     * This is a public route (accessed via link in developer notification email).
     */
    public function confirmEmailProvisioned(string $token)
    {
        $employee = Employee::where('provisioning_token', $token)->first();

        if (!$employee) {
            return response()->view('emails.confirm_result', [
                'success' => false,
                'message' => 'Invalid or expired confirmation link. This token may have already been used.',
            ]);
        }

        $employee->update([
            'email_provisioning_status' => 'provisioned',
            'provisioning_token' => null, // Single-use token
        ]);

        $employeeName = trim(($employee->first_name ?? '') . ' ' . ($employee->last_name ?? ''));
        $companyEmail = $employee->user ? $employee->user->email : 'Unknown';

        return response()->view('emails.confirm_result', [
            'success' => true,
            'message' => "Email account for {$employeeName} ({$companyEmail}) has been marked as provisioned. The super admin can now send the welcome email from the ERP dashboard.",
        ]);
    }
}
