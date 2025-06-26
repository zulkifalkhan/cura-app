// resendEmailService.js
import { RESEND_API_KEY } from '@/config/emailConfig';
import axios from 'axios';

const RESEND_API = RESEND_API_KEY; // keep this safe
const RESEND_URL = 'https://api.resend.com/emails';

export const sendEmergencyEmailResend = async ({ to, subject, html }) => {
  try {
    const res = await axios.post(
      RESEND_URL,
      {
        from: 'Cura App <onboarding@resend.dev>',
        to,
        subject,
        html,
      },
      {
        headers: {
          Authorization: `Bearer ${RESEND_API}`,
          'Content-Type': 'application/json',
        },
      }
    );

    console.log('✅ Email sent via Resend:', res.data);
    return { success: true };
  } catch (err) {
    console.error('❌ Resend Error:', err.response?.data || err.message);
    return { success: false, error: err.message };
  }
};
