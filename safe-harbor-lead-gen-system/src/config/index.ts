import dotenv from 'dotenv';
dotenv.config();

const config = {
    supabaseUrl: process.env.SUPABASE_URL,
    supabaseKey: process.env.SUPABASE_KEY,
    supabaseServiceRoleKey: process.env.SUPABASE_SERVICE_ROLE_KEY,
    googleMapsApiKey: process.env.GOOGLE_MAPS_API_KEY,
    gmailUser: process.env.GMAIL_USER,
    gmailAppPassword: process.env.GMAIL_APP_PASSWORD,
    twilioAccountSid: process.env.TWILIO_ACCOUNT_SID,
    twilioAuthToken: process.env.TWILIO_AUTH_TOKEN,
    twilioPhoneNumber: process.env.TWILIO_PHONE_NUMBER,
    ghlApiKey: process.env.GHL_API_KEY,
    ghlLocationId: process.env.GHL_LOCATION_ID,
};

export default config;
