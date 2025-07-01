import emailjs from '@emailjs/nodejs';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
dotenv.config({ path: path.join(__dirname, '.env') });


const serviceID = process.env.EMAILJS_SERVICE_ID;
const templateID = process.env.EMAILJS_TEMPLATE_ID;
const publicKey = process.env.EMAILJS_PUBLIC_KEY;


export function sendVerificationEmail({ name, email, code }) {
  const templateParams = {
    to_name: name,
    to_email: email,
    verification_code: code,
  };

  return emailjs.send(serviceID, templateID, templateParams, {
    publicKey,
  }).then(() => {
    console.log(`✅ Email sent to ${email}`);
  }).catch((error) => {
    console.error(`❌ Email sending failed:`, error);
  });
}
