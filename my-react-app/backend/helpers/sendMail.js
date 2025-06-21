import nodemailer from 'nodemailer';

const SMTP_MAIL = 'clinic.queue.management@gmail.com';
const SMTP_PASSWORD = 'jnmy vkwy pxnl nojq';

const sendMail = async (email, mailSubject, content) => {
  console.log('[SENDMAIL] Preparing to send email...');
  console.log('[SENDMAIL] To:', email);
  console.log('[SENDMAIL] Subject:', mailSubject);

  try {
    const transport = nodemailer.createTransport({
      host: 'smtp.gmail.com',
      port: 587,
      secure: false,
      requireTLS: true,
      auth: {
        user: SMTP_MAIL,
        pass: SMTP_PASSWORD
      }
    });

    console.log('[SENDMAIL] Transporter created successfully.');

    const mailOptions = {
      from: SMTP_MAIL,
      to: email,
      subject: mailSubject,
      html: content
    };

    console.log('[SENDMAIL] Mail options ready. Attempting to send...');

    transport.sendMail(mailOptions, (error, info) => {
      if (error) {
        console.error('[SENDMAIL] Email sending failed:', error.message);
        console.error('[SENDMAIL] Full error:', error);
      } else {
        console.log('[SENDMAIL] Email sent successfully!');
        console.log('[SENDMAIL] Server response:', info.response);
        console.log('[SENDMAIL] Message ID:', info.messageId);
      }
    });

  } catch (error) {
    console.error('[SENDMAIL] Unexpected exception while sending email:', error.message);
    console.error('[SENDMAIL] Full error:', error);
  }
};

export default sendMail;
