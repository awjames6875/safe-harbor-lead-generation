import axios from 'axios';
import config from '../config';
import supabase from '../database/supabaseClient';

export async function createGHLContact(lead: any) {
    if (!config.ghlApiKey || !config.ghlLocationId) {
        console.warn('GHL Credentials missing. Skipping GHL upload.');
        return;
    }

    const endpoint = 'https://rest.gohighlevel.com/v1/contacts/';
    const headers = {
        'Authorization': `Bearer ${config.ghlApiKey}`,
        'Content-Type': 'application/json'
    };

    const payload = {
        firstName: lead.decision_maker_name?.split(' ')[0] || '',
        lastName: lead.decision_maker_name?.split(' ')[1] || '',
        name: lead.name,
        email: lead.decision_maker_email || '', // fallback to generic email if needed
        phone: lead.phone,
        address1: lead.address,
        city: lead.city || '',
        state: 'OK',
        postalCode: lead.zip_code || '',
        companyName: lead.name,
        tags: [
            "Partnership Inquiry",
            lead.category,
            lead.county,
            lead.priority_score >= 8 ? "High Priority" : "Standard Priority"
        ],
        customField: {
            // You generally need to map Custom Field IDs here, which requires GHL setup.
            // For now, we simulate this structure.
            "org_type": lead.category,
            "priority_score": lead.priority_score,
            "facility_fee_potential": lead.facility_fee_potential,
            "monthly_revenue_potential": lead.monthly_revenue_potential
            // "valid_email": lead.valid_email
        }
    };

    try {
        const response = await axios.post(endpoint, payload, { headers });

        // Update local DB with GHL ID
        if (response.data && response.data.contact && response.data.contact.id) {
            await supabase.from('organizations').update({
                ghl_contact_id: response.data.contact.id
            }).eq('id', lead.id);
            console.log(`Uploaded ${lead.name} to GHL.`);
        }
    } catch (error) {
        console.error(`Error uploading to GHL for ${lead.name}:`, error);
    }
}

export async function syncLeadsToGHL() {
    console.log('Syncing high-value leads to GHL...');
    // Only upload enriched, high(ish) priority leads that haven't been uploaded
    const { data: leads } = await supabase
        .from('organizations')
        .select('*')
        .gt('priority_score', 4) // Filter for decent quality
        .is('ghl_contact_id', null)
        .limit(20);

    if (!leads) return;

    for (const lead of leads) {
        await createGHLContact(lead);
        await new Promise(r => setTimeout(r, 1000)); // Rate limit roughly
    }
}
