<?php

use Illuminate\Foundation\Inspiring;
use Illuminate\Support\Facades\Artisan;

Artisan::command('inspire', function () {
    $this->comment(Inspiring::quote());
})->purpose('Display an inspiring quote');

Artisan::command('queue:inspect', function () {
    $pending = \Illuminate\Support\Facades\DB::table('jobs')->get();
    $failed = \Illuminate\Support\Facades\DB::table('failed_jobs')->get();

    $this->info("=== PENDING JOBS (" . $pending->count() . ") ===");
    if ($pending->isEmpty()) {
        $this->line("No pending jobs.");
    } else {
        $rows = [];
        foreach ($pending as $job) {
            $data = json_decode($job->payload, true);
            $cmd = $data['data']['command'] ?? '';
            preg_match_all('/[a-zA-Z0-9._%+\-]+@[a-zA-Z0-9.\-]+\.[a-zA-Z]{2,}/', $cmd, $matches);
            $emails = array_unique(array_filter($matches[0] ?? [], fn($e) => !str_contains($e, 'titecautomation.lk')));
            $rows[] = [
                'ID' => $job->id,
                'Queue' => $job->queue,
                'Attempts' => $job->attempts,
                'Recipients' => implode(', ', $emails) ?: 'N/A',
            ];
        }
        $this->table(['ID', 'Queue', 'Attempts', 'Recipients'], $rows);
    }

    $this->info("\n=== FAILED JOBS (" . $failed->count() . ") ===");
    if ($failed->isEmpty()) {
        $this->line("No failed jobs.");
    } else {
        $rows = [];
        foreach ($failed as $job) {
            $data = json_decode($job->payload, true);
            $cmd = $data['data']['command'] ?? '';
            preg_match_all('/[a-zA-Z0-9._%+\-]+@[a-zA-Z0-9.\-]+\.[a-zA-Z]{2,}/', $cmd, $matches);
            $emails = array_unique(array_filter($matches[0] ?? [], fn($e) => !str_contains($e, 'titecautomation.lk')));
            $rows[] = [
                'ID' => $job->id,
                'UUID' => substr($job->uuid, 0, 8) . '...',
                'Queue' => $job->queue,
                'Failed At' => $job->failed_at,
                'Recipients' => implode(', ', $emails) ?: 'N/A',
            ];
        }
        $this->table(['ID', 'UUID', 'Queue', 'Failed At', 'Recipients'], $rows);
    }
})->purpose('Inspect pending and failed queue jobs with recipient emails');

