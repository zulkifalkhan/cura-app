import axios from 'axios';



const SENDGRID_API_KEY = 'YOUR_SENDGRID_API_KEY'; // ⚠️ DO NOT do this in production
const SENDGRID_URL = 'https://api.sendgrid.com/v3/mail/send';

export const sendEmail = async ({ to, subject, message }) => {
  const data = {
    personalizations: [
      {
        to: [{ email: to }],
        subject: subject,
      },
    ],
    from: { email: 'your_verified_sender@example.com' },
    content: [
      {
        type: 'text/plain',
        value: message,
      },
    ],
  };

  try {
    const res = await axios.post(SENDGRID_URL, data, {
      headers: {
        Authorization: `Bearer ${SENDGRID_API_KEY}`,
        'Content-Type': 'application/json',
      },
    });

    return { success: true };
  } catch (err) {
    console.error('SendGrid Error:', err.response?.data || err.message);
    return { success: false, error: err.message };
  }
};
