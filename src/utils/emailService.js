import nodemailer from 'nodemailer';
import 'dotenv/config';

export const sendResetPasswordEmail = async (to, resetToken) => {
    // Логируем все переменные окружения, связанные с SMTP
    console.log('SMTP_HOST:', process.env.SMTP_HOST);
    console.log('SMTP_PORT:', process.env.SMTP_PORT);
    console.log('SMTP_USER:', process.env.SMTP_USER);
    console.log('SMTP_FROM:', process.env.SMTP_FROM);
    console.log('APP_DOMAIN:', process.env.APP_DOMAIN);
    
    const { SMTP_HOST, SMTP_PORT, SMTP_USER, SMTP_PASSWORD, SMTP_FROM } = process.env;
    const { APP_DOMAIN } = process.env;
    const resetLink = `${APP_DOMAIN}/reset-password?token=${resetToken}`;
    
    // Проверяем, что все необходимые переменные определены
    if (!SMTP_HOST || !SMTP_PORT || !SMTP_USER || !SMTP_PASSWORD || !SMTP_FROM || !APP_DOMAIN) {
      console.error('Missing required environment variables for email service');
      return false;
    }
    
    console.log('Creating transporter with config:', {
      host: SMTP_HOST,
      port: Number(SMTP_PORT),
      secure: false,
      auth: {
        user: SMTP_USER,
        // Не логируем пароль
      }
    });
    
    const transporter = nodemailer.createTransport({
      host: SMTP_HOST,
      port: Number(SMTP_PORT),
      secure: false, // для TLS
      auth: {
        user: SMTP_USER,
        pass: SMTP_PASSWORD,
      }
    });
    
    const mailOptions = {
      from: SMTP_FROM,
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
  
    console.log('Mail options:', { ...mailOptions, html: '(HTML content)' });
    
    try {
      console.log(`Attempting to send email to ${to}`);
      // Проверяем подключение к SMTP серверу
      console.log('Verifying SMTP connection...');
      await transporter.verify();
      console.log('SMTP connection verified');
      
      const info = await transporter.sendMail(mailOptions);
      console.log(`Email sent, ID: ${info.messageId}`);
      return true;
    } catch (error) {
      console.error('Error sending email:', error);
      console.error('Error details:', JSON.stringify(error, null, 2));
      return false;
    }
  };