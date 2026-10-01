# cPanel Queue Worker Setup Instructions

With the application now using queued emails (asynchronous sending) to drastically improve performance, you must configure a queue worker on your cPanel server. Without this, the system will place emails into the `jobs` database table, but they will never be sent.

Because cPanel does not typically allow background daemon managers like Supervisor, the standard approach is to use Cron Jobs to process the queue every minute.

## Step 1: Open Cron Jobs in cPanel
1. Log into your cPanel account.
2. Scroll down to the **Advanced** section and click on **Cron Jobs**.

## Step 2: Configure the Cron Job
You need to add a cron job that runs every minute to process any pending emails.

1. Under **Add New Cron Job**, set the **Common Settings** to `Once Per Minute (* * * * *)`.
2. In the **Command** field, you need to execute Laravel's queue worker. The exact command depends on where your PHP binary and Laravel project are located.

### The Standard cPanel Approach (Recommended)
This runs the queue worker and tells it to process jobs and then stop when the queue is empty. Since it runs every minute, it will wake up, clear out any new emails, and gracefully shut down, avoiding cPanel's long-running process limits.

Copy and paste the following into the **Command** field:

```bash
/usr/local/bin/php /home/your_cpanel_username/path_to_project/backend-laravel/artisan queue:work --stop-when-empty > /dev/null 2>&1
```

**⚠️ Important Adjustments:**
- **PHP Path:** `/usr/local/bin/php` is the most common path on cPanel. Depending on your host, you might need a specific version (e.g., `/usr/local/bin/ea-php82` or `/opt/cpanel/ea-php82/root/usr/bin/php`).
- **Project Path:** Replace `/home/your_cpanel_username/path_to_project/backend-laravel/` with the absolute path to your `backend-laravel` directory in the File Manager.

## Step 3: Deployment Maintenance
Because queue workers load the application code into memory, they need to be told to restart whenever you push new code to production.

Whenever you deploy new code, you should run this command (either via SSH, your deployment script, or a one-time cron):
```bash
php artisan queue:restart
```

## How to Verify It's Working
1. Submit a test quotation request or contact form on the storefront.
2. Notice how the website now responds almost instantly (instead of hanging for 4-5 seconds).
3. If you have phpMyAdmin access, you can briefly see a record pop into the `jobs` table.
4. Within 1 minute, the cron job will run, process the job, remove it from the database, and you will receive the email.
