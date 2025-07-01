import emailjs from '@emailjs/browser';

export const sendVerificationEmail = ({ name, email, code }) => {
  const templateParams = {
    to_name: name,
    to_email: email,
    verification_code: code, // <-- this should match your EmailJS template variable
  };

  emailjs.send(
    'service_mdaz1hs',
    'template_y2cxk9i',
    templateParams,
    'JY8it6tTyWm4oNfgF'
  )
  .then((response) => {
    console.log('✅ Verification email sent!', response.status, response.text);
  })
  .catch((error) => {
    console.error('❌ Failed to send email:', error);
  });
};
