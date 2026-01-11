import supabase from '../database/supabaseClient';

export async function updatePipelineStage(leadId: number, stage: string) {
    // Update local DB
    await supabase.from('partnerships').upsert({
        organization_id: leadId,
        status: stage,
        updated_at: new Date()
    }, { onConflict: 'organization_id' });

    console.log(`Updated lead ${leadId} to stage: ${stage}`);

    // In a real system, you'd also sync this status back to GHL here
}
