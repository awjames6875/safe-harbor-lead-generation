import { runDailyScrape } from './scrapers/googleMapsScraper';
import cron from 'node-cron';
import config from './config';

async function main() {
    console.log('Starting Safe Harbor Lead Generation System...');

    // Schedule tasks
    // Part 1: Lead Discovery at 9:00 AM
    cron.schedule('0 9 * * *', async () => {
        console.log('Running daily lead discovery...');
        await runDailyScrape();
    });

    // Part 2: Enrichment at 9:30 AM
    cron.schedule('30 9 * * *', async () => {
        const { runDailyEnrichment } = await import('./enrichment/enrichLead');
        await runDailyEnrichment();
    });

    // Part 3: Upload to GHL at 10:00 AM
    cron.schedule('0 10 * * *', async () => {
        const { syncLeadsToGHL } = await import('./crm/ghl');
        await syncLeadsToGHL();
    });

    // Part 4: Email Campaign at 10:30 AM
    cron.schedule('30 10 * * *', async () => {
        const { runDailyEmailCampaign } = await import('./marketing/emailService');
        await runDailyEmailCampaign();
    });

    // Part 5 & 6: Phone Campaign at 11:00 AM
    cron.schedule('0 11 * * *', async () => {
        const { runDailyPhoneCampaign } = await import('./marketing/phoneService');
        await runDailyPhoneCampaign();
    });

    // Part 10: Analytics at 5:00 PM
    cron.schedule('0 17 * * *', async () => {
        const { generateDailyReport } = await import('./analytics/reporting');
        await generateDailyReport();
    });

    // Start Webhook Handler (Continuous)
    const { startWebhookServer } = await import('./web/webhookHandler');
    startWebhookServer();


    console.log('System is running. Scheduled tasks initialized.');

    // For initial testing, uncomment to run immediately:
    // await runDailyScrape();
}

main().catch(console.error);
