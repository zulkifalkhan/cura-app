// resendEmailService.js
import axios from 'axios';

const RESEND_API_KEY = 're_GHC6mY13_FVrYu8mg1YTmNU6tocvvHUZq'; // keep this safe
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
          Authorization: `Bearer ${RESEND_API_KEY}`,
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
