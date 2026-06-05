import { getAccessToken, createFolder, createSheet } from '../../lib/zoho';
import nodemailer from 'nodemailer';

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const formData = req.body;

  try {
    // 1. Get Zoho access token
    const accessToken = await getAccessToken();

    // 2. Create folder name based on entity
    const folderName = formData.orgName
      ? formData.orgName
      : `${formData.firstName} ${formData.lastName}`;

    // 3. Create subfolder inside RoC Onboarding folder
    const folderId = await createFolder(
      accessToken,
      process.env.ZOHO_WORKDRIVE_PARENT_FOLDER_ID,
      folderName
    );

    // 4. Upload CSV sheet inside the new folder
    await createSheet(accessToken, folderId, 'Onboarding_Απαντήσεις', formData);

    // 5. Send email notification via Zoho SMTP
    const transporter = nodemailer.createTransport({
      host: 'smtp.zoho.eu',
      port: 465,
      secure: true,
      auth: {
        user: process.env.ZOHO_SMTP_USER,
        pass: process.env.ZOHO_SMTP_PASS,
      },
    });

    const equipmentList = (formData.equipment || []).join(', ') || '—';
    const cropsList = (formData.crops || []).join(', ') || '—';

    await transporter.sendMail({
      from: `"RoC Onboarding" <${process.env.ZOHO_SMTP_USER}>`,
      to: process.env.NOTIFICATION_EMAIL,
      subject: `🌱 Νέα εγγραφή: ${folderName}`,
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <div style="background: #1a3d2b; padding: 24px; border-radius: 8px 8px 0 0;">
            <h1 style="color: white; margin: 0; font-size: 20px;">Roots of Carbon</h1>
            <p style="color: rgba(255,255,255,0.7); margin: 4px 0 0; font-size: 14px;">Νέα συμπλήρωση onboarding</p>
          </div>
          <div style="border: 1px solid #e0e0e0; border-top: none; padding: 24px; border-radius: 0 0 8px 8px;">
            <table style="width: 100%; border-collapse: collapse; font-size: 14px;">
              <tr style="border-bottom: 1px solid #f0f0f0;">
                <td style="padding: 10px 0; color: #666; width: 40%;">Τύπος</td>
                <td style="padding: 10px 0; font-weight: bold;">${formData.type || '—'}</td>
              </tr>
              <tr style="border-bottom: 1px solid #f0f0f0;">
                <td style="padding: 10px 0; color: #666;">Όνομα</td>
                <td style="padding: 10px 0; font-weight: bold;">${folderName}</td>
              </tr>
              <tr style="border-bottom: 1px solid #f0f0f0;">
                <td style="padding: 10px 0; color: #666;">Email</td>
                <td style="padding: 10px 0;"><a href="mailto:${formData.email}" style="color: #4a8c2a;">${formData.email || '—'}</a></td>
              </tr>
              <tr style="border-bottom: 1px solid #f0f0f0;">
                <td style="padding: 10px 0; color: #666;">Τηλέφωνο</td>
                <td style="padding: 10px 0;">${formData.phone || '—'}</td>
              </tr>
              <tr style="border-bottom: 1px solid #f0f0f0;">
                <td style="padding: 10px 0; color: #666;">Περιοχή</td>
                <td style="padding: 10px 0;">${formData.region || '—'}</td>
              </tr>
              <tr style="border-bottom: 1px solid #f0f0f0;">
                <td style="padding: 10px 0; color: #666;">Έκταση</td>
                <td style="padding: 10px 0;">${formData.hectares || '—'} ha · ${formData.plots || '—'} τεμάχια</td>
              </tr>
              <tr style="border-bottom: 1px solid #f0f0f0;">
                <td style="padding: 10px 0; color: #666;">Καλλιέργειες</td>
                <td style="padding: 10px 0;">${cropsList}</td>
              </tr>
              <tr style="border-bottom: 1px solid #f0f0f0;">
                <td style="padding: 10px 0; color: #666;">Εξοπλισμός</td>
                <td style="padding: 10px 0;">${equipmentList}</td>
              </tr>
              <tr style="border-bottom: 1px solid #f0f0f0;">
                <td style="padding: 10px 0; color: #666;">Γεωπόνος</td>
                <td style="padding: 10px 0;">${formData.agronomist || '—'}</td>
              </tr>
              <tr style="border-bottom: 1px solid #f0f0f0;">
                <td style="padding: 10px 0; color: #666;">Πηγή</td>
                <td style="padding: 10px 0;">${formData.source || '—'}</td>
              </tr>
              ${formData.comments ? `
              <tr>
                <td style="padding: 10px 0; color: #666;">Σχόλια</td>
                <td style="padding: 10px 0;">${formData.comments}</td>
              </tr>` : ''}
            </table>
            <div style="margin-top: 20px; padding: 12px; background: #f0f7ec; border-radius: 6px; font-size: 13px; color: #1a3d2b;">
              📁 Τα στοιχεία αποθηκεύτηκαν στο WorkDrive → RoC Onboarding → ${folderName}
            </div>
          </div>
        </div>
      `,
    });

    return res.status(200).json({ success: true });
  } catch (error) {
    console.error('Submission error:', error?.response?.data || error.message);
    return res.status(500).json({ error: 'Submission failed', details: error.message });
  }
}
