<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Employee extends Model
{
    use HasFactory;

    protected $fillable = [
        'user_id',
        'employee_id',
        'first_name',
        'last_name',
        'department',
        'designation',
        'personal_email',
        'phone',
        'nic',
        'date_of_birth',
        'date_joined',
        'address',
        'emergency_contact_name',
        'emergency_contact_phone',
        'employment_status',
        'email_provisioning_status',
        'provisioning_token',
        'notes',
        'avatar_path',
    ];

    protected $casts = [
        'date_of_birth' => 'date',
        'date_joined' => 'date',
    ];

    protected static function booted()
    {
        static::creating(function ($employee) {
            if (empty($employee->employee_id)) {
                $lastEmployee = self::orderBy('id', 'desc')->first();
                $lastId = $lastEmployee ? intval(substr($lastEmployee->employee_id, 4)) : 0;
                $employee->employee_id = 'EMP-' . str_pad($lastId + 1, 3, '0', STR_PAD_LEFT);
            }
        });
    }

    public function user()
    {
        return $this->belongsTo(User::class);
    }
}
