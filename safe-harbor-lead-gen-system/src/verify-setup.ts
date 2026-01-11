import dotenv from 'dotenv';
import { createClient } from '@supabase/supabase-js';
import nodemailer from 'nodemailer';
import twilio from 'twilio';

// Load env
dotenv.config();

const config = {
    supabaseUrl: process.env.SUPABASE_URL,
    supabaseKey: process.env.SUPABASE_KEY,
    gmailUser: process.env.GMAIL_USER,
    gmailPass: process.env.GMAIL_APP_PASSWORD,
    twilioSid: process.env.TWILIO_ACCOUNT_SID,
    twilioToken: process.env.TWILIO_AUTH_TOKEN,
    ghlKey: process.env.GHL_API_KEY
};

async function verify() {
    console.log('🔍 Starting System Verification...\n');
    let allPassed = true;

    // 1. Supabase Verification
    console.log('1. [Database] Checking Supabase connection...');
    if (!config.supabaseUrl || !config.supabaseKey) {
        console.error('   ❌ Missing SUPABASE_URL or SUPABASE_KEY');
        allPassed = false;
    } else {
        try {
            const supabase = createClient(config.supabaseUrl, config.supabaseKey);
            const { data, error } = await supabase.from('organizations').select('count', { count: 'exact', head: true });
            if (error) throw error;
            console.log('   ✅ Connected to Supabase');
        } catch (err: any) {
            console.error(`   ❌ Failed to connect: ${err.message}`);
            allPassed = false;
        }
    }

    // 2. Gmail Verification
    console.log('\n2. [Email] Checking Gmail credentials...');
    if (!config.gmailUser || !config.gmailPass) {
        console.error('   ❌ Missing GMAIL_USER or GMAIL_APP_PASSWORD');
        allPassed = false;
    } else {
        try {
            const transporter = nodemailer.createTransport({
                service: 'gmail',
                auth: { user: config.gmailUser, pass: config.gmailPass }
            });
            await transporter.verify();
            console.log('   ✅ Gmail credentials accepted');
        } catch (err: any) {
            console.error(`   ❌ Gmail verification failed: ${err.message}`);
            allPassed = false;
        }
    }

    // 3. Twilio Verification
    console.log('\n3. [SMS/Voice] Checking Twilio credentials...');
    if (!config.twilioSid || !config.twilioToken) {
        console.error('   ❌ Missing TWILIO_ACCOUNT_SID or TWILIO_AUTH_TOKEN');
        allPassed = false;
    } else {
        try {
            const client = twilio(config.twilioSid, config.twilioToken);
            await client.api.accounts(config.twilioSid!).fetch();
            console.log('   ✅ Twilio credentials accepted');
        } catch (err: any) {
            console.error(`   ❌ Twilio verification failed: ${err.message}`);
            allPassed = false;
        }
    }

    // 4. GHL Verification (Simple check)
    console.log('\n4. [CRM] Checking GoHighLevel Key...');
    if (!config.ghlKey) {
        console.warn('   ⚠️ Missing GHL_API_KEY (Uploads will skip)');
    } else {
        console.log('   ✅ GHL Key present (Verification requires request)');
    }

    console.log('\n----------------------------------------');
    if (allPassed) {
        console.log('✅✅ SYSTEM READY TO START ✅✅');
    } else {
        console.log('❌ SYSTEM NOT READY. Please fix the errors above in .env');
    }
}

verify().catch(console.error);
