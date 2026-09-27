<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        Schema::table('installation_notes', function (Blueprint $table) {
            // ── Note categorisation ──────────────────
            $table->string('type', 30)->default('progress')->after('user_id');
            // type values: progress, completion, extra_cost, defect, additional_parts

            // ── Cost tracking ───────────────────────
            $table->decimal('cost_amount', 10, 2)->nullable()->after('attachments');
            $table->string('cost_description', 255)->nullable()->after('cost_amount');

            // ── Accountant review workflow ───────────
            $table->string('review_status', 20)->nullable()->after('cost_description');
            // review_status values: pending, approved, rejected (NULL for non-financial notes)
            $table->foreignId('reviewed_by')->nullable()->after('review_status')
                  ->constrained('users')->nullOnDelete();
            $table->timestamp('reviewed_at')->nullable()->after('reviewed_by');
            $table->text('rejection_reason')->nullable()->after('reviewed_at');

            // ── Index for accountant queue ───────────
            $table->index(['review_status', 'type'], 'idx_notes_review_queue');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('installation_notes', function (Blueprint $table) {
            $table->dropIndex('idx_notes_review_queue');
            $table->dropForeign(['reviewed_by']);
            $table->dropColumn([
                'type', 'cost_amount', 'cost_description',
                'review_status', 'reviewed_by', 'reviewed_at', 'rejection_reason',
            ]);
        });
    }
};
