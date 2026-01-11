import nodemailer from 'nodemailer';
import config from '../config';
import supabase from '../database/supabaseClient';

// Setup Transporter (Gmail)
const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
        user: config.gmailUser,
        pass: config.gmailAppPassword,
    },
});

const templates: Record<string, (name: string, orgName: string, fee: number) => string> = {
    'Daycare': (name, orgName, fee) => `Subject: ${orgName} - Add Mental Health Services + Generate Up to $${fee}/Day

Hi ${name},

We partner with daycares like ${orgName} to add evidence-based mental health services while generating extra revenue.

Here's how it works:
...
Best,
Adam James`
    // Add other templates as needed mapping to the prompt's examples
};

export async function sendOutreachEmail(lead: any) {
    if (!config.gmailUser || !lead.decision_maker_email) return;

    const templateGen = templates[lead.category] || templates['Daycare']; // Fallback
    const content = templateGen(
        lead.decision_maker_name || 'Director',
        lead.name,
        lead.facility_fee_potential || 400
    );

    const subject = content.split('\n')[0].replace('Subject: ', '');
    const body = content.split('\n').slice(1).join('\n').trim();

    const mailOptions = {
        from: config.gmailUser,
        to: lead.decision_maker_email, // In production, be careful!
        subject: subject,
        text: body
    };

    try {
        const info = await transporter.sendMail(mailOptions);
        console.log(`Email sent to ${lead.name}: ${info.response}`);

        // Log to DB
        await supabase.from('campaigns').insert({
            organization_id: lead.id,
            campaign_type: 'Initial Outreach',
            status: 'Sent',
            sent_at: new Date()
        });

    } catch (error) {
        console.error(`Failed to send email to ${lead.name}:`, error);
    }
}

export async function runDailyEmailCampaign() {
    console.log('Running daily email campaign...');
    // Logic: Select leads that are in GHL (or highly qualified), haven't been emailed yet.
    // Limit to warmup protocol counts (start small).

    const { data: leads } = await supabase
        .from('organizations')
        .select('*, campaigns(*)')
        .gt('priority_score', 6)
        .limit(10); // Warmup limit: 10/day

    if (!leads) return;

    for (const lead of leads) {
        // check if already emailed (simplified check, usually done via SQL filtering)
        if (lead.campaigns && lead.campaigns.length > 0) continue;

        await sendOutreachEmail(lead);
        await new Promise(r => setTimeout(r, 45000)); // Throttle: 45s roughly
    }
}
