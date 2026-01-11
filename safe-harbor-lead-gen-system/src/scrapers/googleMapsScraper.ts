import puppeteer from 'puppeteer';
import supabase from '../database/supabaseClient';
import { oklahomaCounties, organizationTypes } from './counties';

interface ScrapedLead {
    name: string;
    address: string | null;
    phone: string | null;
    website: string | null;
    reviews_count: number | null;
    rating: number | null;
    category: string | null;
    county: string;
}

export async function scrapeGoogleMaps(county: string, orgType: string): Promise<ScrapedLead[]> {
    console.log(`Starting scrape for ${orgType} in ${county} County, OK...`);

    // NOTE: For production, consider using a residential proxy or an official API if scraping is blocked.
    // This is a basic Puppeteer implementation.

    const browser = await puppeteer.launch({
        headless: "new",
        args: ['--no-sandbox', '--disable-setuid-sandbox']
    });
    const page = await browser.newPage();

    const searchQuery = `${orgType} in ${county} County, Oklahoma`;

    try {
        await page.goto(`https://www.google.com/maps/search/${encodeURIComponent(searchQuery)}`);
        await page.waitForSelector('div[role="feed"]', { timeout: 10000 }); // Wait for results feed

        // Auto-scroll to load more results
        await autoScroll(page);

        const leads = await page.evaluate((currentCounty, currentType) => {
            const items = document.querySelectorAll('div[role="article"]');
            const results: any[] = [];

            items.forEach((item) => {
                const wrapper = item.parentElement;
                if (!wrapper) return;

                // Extract basic data (Note: Selectors on Google Maps change frequently)
                // This relies on aria-labels and structure which is slightly more stable but still fragile.
                const name = item.ariaLabel || '';
                if (!name) return;

                const textContent = wrapper.innerText || '';
                const lines = textContent.split('\n');

                let rating = null;
                let reviews_count = null;
                let phone = null;
                let website = null;
                let address = null;

                // Basic heuristic parsing of the text content
                // Example text: "4.8(45) · Daycare center · 123 Main St · (555) 123-4567"

                // We would need more robust selectors here for a real production scraper, 
                // often iterating through specific child nodes.

                // Placeholder extraction logic
                results.push({
                    name: name,
                    address: lines.find(l => l.includes(' OK ')) || null, // Basic address finder
                    category: currentType,
                    county: currentCounty,
                    phone: lines.find(l => /\(\d{3}\)/.test(l)) || null,
                    website: null, // Hard to get without clicking
                    rating: null,
                    reviews_count: null
                });
            });
            return results;
        }, county, orgType);

        console.log(`Found ${leads.length} leads for ${searchQuery}`);
        return leads;

    } catch (error) {
        console.error(`Error scraping ${searchQuery}:`, error);
        return [];
    } finally {
        await browser.close();
    }
}

async function autoScroll(page: any) {
    await page.evaluate(async () => {
        const wrapper = document.querySelector('div[role="feed"]');
        if (!wrapper) return;

        await new Promise<void>((resolve) => {
            let totalHeight = 0;
            let distance = 1000;
            let timer = setInterval(() => {
                const scrollHeight = wrapper.scrollHeight;
                wrapper.scrollBy(0, distance);
                totalHeight += distance;

                if (totalHeight >= scrollHeight) {
                    clearInterval(timer);
                    resolve();
                }
            }, 2000);
        });
    });
}

export async function runDailyScrape() {
    // Randomly select 5 counties per day to avoid rate limits and keep it manageable
    const countiesToScrape = oklahomaCounties.sort(() => 0.5 - Math.random()).slice(0, 5);

    for (const county of countiesToScrape) {
        for (const orgType of organizationTypes) {
            const leads = await scrapeGoogleMaps(county, orgType);

            // Save to Supabase
            if (leads.length > 0) {
                const { error } = await supabase
                    .from('organizations')
                    .upsert(leads.map(lead => ({
                        name: lead.name,
                        address: lead.address,
                        phone: lead.phone,
                        county: lead.county,
                        category: lead.category,
                        // Use name+address as unique key constraint ideally, or handle duplicates
                        updated_at: new Date()
                    })), { onConflict: 'name, address' }); // Assuming a constraint exists or we handle it

                if (error) console.error('Error saving leads:', error);
                else console.log(`Saved ${leads.length} leads to DB.`);
            }

            // Gentle pause
            await new Promise(r => setTimeout(r, 5000));
        }
    }
}
