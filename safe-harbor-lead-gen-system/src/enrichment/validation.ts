export function validateEmail(email: string): boolean {
    // Basic regex validation
    const re = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
    return re.test(email);
}

export function validatePhone(phone: string): boolean {
    // Basic helper to check if it has 10 digits
    // In production, use libphonenumber-js or the Twilio Lookup API
    const cleaned = phone.replace(/\D/g, '');
    return cleaned.length === 10 || (cleaned.length === 11 && cleaned.startsWith('1'));
}

export function estimateKidsServed(category: string): number {
    switch (category) {
        case 'Daycare': return 50;
        case 'Preschool': return 40;
        case 'After School Program': return 80;
        case 'Youth Sports Organization': return 200;
        case 'Community Center': return 100;
        case 'Head Start Program': return 60;
        case 'Boys & Girls Club': return 150;
        case 'Summer Camp': return 120;
        default: return 30; // conservative estimate
    }
}
