import nodemailer from 'nodemailer';
import 'dotenv/config';

const { SMTP_HOST, SMTP_PORT, SMTP_USER, SMTP_PASSWORD, SMTP_FROM} = process.env;

const transporter = nodemailer.createTransport({
  host: SMTP_HOST,
  port: Number(SMTP_PORT),
  secure: false, // для TLS
  auth: {
    user: SMTP_USER,
    pass: SMTP_PASSWORD,
  }
});

export const sendResetPasswordEmail = async (to, resetToken) => {
    const { APP_DOMAIN } = process.env;
    const resetLink = `${APP_DOMAIN}/reset-password?token=${resetToken}`;
    
    const mailOptions = {
      from: process.env.SMTP_FROM,
      to,
      subject: 'Password Reset Request',
      html: `
        <h1>Password Reset</h1>
        <p>You requested a password reset. Click the link below to reset your password:</p>
        <a href="${resetLink}">Reset Password</a>
        <p>This link will expire in 5 minutes.</p>
        <p>If you did not request a password reset, please ignore this email.</p>
      `,
    };
  
    try {
      console.log(`Спроба відправлення email на ${to}`);
      const info = await transporter.sendMail(mailOptions);
      console.log(`Email відправлений, ID: ${info.messageId}`);
      return true;
    } catch (error) {
      console.error('Error sending email:', error);
      return false;
    }
  };