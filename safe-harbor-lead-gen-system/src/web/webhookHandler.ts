import express, { Request, Response } from 'express';
import { makeAutomatedCall } from '../marketing/phoneService';
import { updatePipelineStage } from '../crm/pipeline';

const app = express();
app.use(express.json());

// This endpoint would be set as the webhook URL in GoHighLevel
app.post('/webhook/lead-qualified', async (req: Request, res: Response) => {
    const leadData = req.body;

    console.log('Received qualified lead from GHL:', leadData.email);

    // 1. Trigger Voice Bot Call Immediately (Part 8)
    // Assuming leadData contains phone
    if (leadData.phone) {
        console.log('Triggering immediate voice bot call...');
        await makeAutomatedCall({
            name: leadData.name,
            phone: leadData.phone
        });
    }

    // 2. Update Pipeline Stage (Part 9)
    // Map GHL ID back to local ID if possible, or just log
    // await updatePipelineStage(localId, 'Qualified');

    res.status(200).send('OK');
});

export function startWebhookServer() {
    const PORT = process.env.PORT || 3000;
    app.listen(PORT, () => {
        console.log(`Webhook server listening on port ${PORT}`);
    });
}
