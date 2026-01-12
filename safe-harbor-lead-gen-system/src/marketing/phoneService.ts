import twilio from 'twilio';
import config from '../config';
import supabase from '../database/supabaseClient';

// Lazy initialization - only create client when needed and credentials exist
let twilioWarningLogged = false;
function getTwilioClient() {
    const sid = config.twilioAccountSid;
    const token = config.twilioAuthToken;

    // Check if missing OR if it still has the placeholder brackets from .env.example
    const isConfigured = sid && token && !sid.includes('[') && !token.includes('[');

    if (!isConfigured) {
        if (!twilioWarningLogged) {
            console.warn('Twilio credentials not configured - SMS/call features disabled');
            twilioWarningLogged = true;
        }
        return null;
    }
    return twilio(sid, token);
}

export async function sendSMS(lead: any, day: number) {
    const client = getTwilioClient();
    if (!client || !config.twilioPhoneNumber || !lead.phone) return;

    // A2P 10DLC Check - Set this to true once your Twilio Brand/Campaign is approved
    const A2P_APPROVED = false;

    if (!A2P_APPROVED) {
        console.log(`[A2P Skip] SMS to ${lead.name} (Day ${day}) skipped - Waiting for A2P 10DLC approval.`);
        return;
    }

    let message = '';
    if (day === 3) {
        message = `Hi ${lead.decision_maker_name || 'there'}, we sent an email about expanding ${lead.name}'s youth programs. Interested in a quick chat? Reply YES.`;
    } else if (day === 7) {
        message = `${lead.name}, we've helped many OK nonprofits add mental health services. Want to learn how? Reply YES or call us.`;
    } else if (day === 14) {
        message = `Last attempt: We're partnering with orgs to expand youth services. Interested? Reply YES.`;
    }

    try {
        const result = await client.messages.create({
            body: message,
            from: config.twilioPhoneNumber,
            to: lead.phone
        });
        console.log(`SMS sent to ${lead.name} (Day ${day}): ${result.sid}`);

        // Log
        await supabase.from('campaigns').insert({
            organization_id: lead.id,
            campaign_type: `SMS Day ${day}`,
            status: 'Sent',
            sent_at: new Date()
        });
    } catch (error) {
        console.error(`Error sending SMS to ${lead.name}:`, error);
    }
}

export async function makeAutomatedCall(lead: any) {
    const client = getTwilioClient();
    if (!client || !config.twilioPhoneNumber || !lead.phone) return;

    // TwiML Bin URL or a serverless function URL that hosts the TwiML script
    // <Response><Say>Hi, this is ...</Say><Record/></Response>
    const url = 'http://demo.twilio.com/docs/voice.xml'; // Placeholder

    try {
        const call = await client.calls.create({
            url: url,
            to: lead.phone,
            from: config.twilioPhoneNumber
        });
        console.log(`Call initiated to ${lead.name}: ${call.sid}`);
    } catch (error) {
        console.error(`Error calling ${lead.name}:`, error);
    }
}

export async function runDailyPhoneCampaign() {
    console.log('Running daily phone campaign...');
    // Logic: Find leads that were emailed 3, 7, or 14 days ago and haven't replied.
    // This requires complex date queries on the 'campaigns' table.

    // Simplified: Just log intent.
    console.log('SMS/Call logic would query campaigns table here.');
}
