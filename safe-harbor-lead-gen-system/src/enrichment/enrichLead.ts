import supabase from '../database/supabaseClient';
import { validateEmail, validatePhone, estimateKidsServed } from './validation';

export interface EnrichedData {
    priority_score: number;
    facility_fee_potential: number;
    monthly_revenue_potential: number;
    kids_served: number;
    valid_email: boolean;
    valid_phone: boolean;
}

export function calculatePriorityScore(organization: any): number {
    let score = 0;

    // Base Logic from Prompt
    // + 2: If nonprofit (inferred from name or category)
    if (isNonProfit(organization)) score += 2;

    // + 1: If valid email
    if (validateEmail(organization.email || '')) score += 1;

    // + 1: If valid phone
    if (validatePhone(organization.phone || '')) score += 1;

    // + 1: If has website
    if (organization.website) score += 1;

    // + 2: If 12+ hours/week with kids (Estimated)
    if (organization.hours_weekly >= 12) score += 2;
    else if (['Daycare', 'Head Start Program'].includes(organization.category)) score += 2; // High hours naturally

    // + 2: If accepts Medicaid (Placeholder logic)
    if (organization.medicaid_accepted) score += 2;

    // + 1: If seeking funding (Placeholder)
    if (organization.seeking_funding) score += 1;

    // + 1: If has 50+ reviews
    if ((organization.reviews_count || 0) >= 50) score += 1;

    return Math.min(score, 10); // Start at 0, max 10
}

function isNonProfit(org: any): boolean {
    const lowercaseName = org.name.toLowerCase();
    return lowercaseName.includes('foundation') ||
        lowercaseName.includes('nonprofit') ||
        lowercaseName.includes('association') ||
        lowercaseName.includes('church') ||
        ['Boys & Girls Club', 'Head Start Program', 'Community Center'].includes(org.category);
}

export function calculateFinancials(category: string, kids: number) {
    let dailyRate = 200; // Default low end

    // Range heuristics from prompt
    if (category.includes('Daycare')) dailyRate = 400; // $400-500
    if (category.includes('After School')) dailyRate = 250; // $250-300
    if (category.includes('Sports')) dailyRate = 150; // $150-200
    if (category.includes('Community')) dailyRate = 300; // $300-400
    if (category.includes('Head Start')) dailyRate = 400; // $400-500
    if (category.includes('Boys & Girls')) dailyRate = 300; // $300-400
    if (category.includes('Camp')) dailyRate = 400; // $400-500

    // Facility fee is daily. Monthly revenue potential (revenue for Safe Harbor)
    // Prompt says: $225-500/day for 9+ kids.
    // The 'Monthly Revenue Potential' in prompt examples is Organization revenue or Safe Harbor? 
    // Ex 1: "Facility Fee Potential: $400-500/day... Monthly Revenue Potential: $8,000-10,000"
    // Assuming 20 days a month: 400 * 20 = 8000. So "Monthly Revenue Potential" here refers to the PARTNER's revenue.

    const monthlyRevenue = dailyRate * 20; // Approx 4 weeks * 5 days

    return { dailyRate, monthlyRevenue };
}

export async function runDailyEnrichment() {
    console.log('Running daily enrichment...');

    // Fetch unprocessed organizations (e.g. priority_score is null)
    const { data: leads, error } = await supabase
        .from('organizations')
        .select('*')
        .is('priority_score', null)
        .limit(50);

    if (error) {
        console.error('Error fetching leads for enrichment:', error);
        return;
    }

    if (!leads || leads.length === 0) {
        console.log('No leads needing enrichment.');
        return;
    }

    console.log(`Enriching ${leads.length} leads...`);

    for (const lead of leads) {
        const kids = estimateKidsServed(lead.category);
        const { dailyRate, monthlyRevenue } = calculateFinancials(lead.category, kids);
        const score = calculatePriorityScore(lead);

        const updates = {
            kids_served: kids,
            facility_fee_potential: dailyRate,
            monthly_revenue_potential: monthlyRevenue,
            priority_score: score,
            valid_email: validateEmail(lead.email || ''), // field might need "email" column sync from scraper
            valid_phone: validatePhone(lead.phone || ''),
            updated_at: new Date()
        };

        const { error: updateError } = await supabase
            .from('organizations')
            .update(updates)
            .eq('id', lead.id);

        if (updateError) console.error(`Failed to enrich lead ${lead.id}:`, updateError);
    }

    console.log('Enrichment complete.');
}
