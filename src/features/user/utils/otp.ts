import otpGenerator from 'otp-generator';
import fs from 'fs';
import path from 'path';

const otpHtmlPath = path.join(__dirname, 'templates/otp.html');

export const generateOTP = (): string => {
  return otpGenerator.generate(6, {
    digits: true,
    upperCaseAlphabets: false,
    lowerCaseAlphabets: false,
    specialChars: false,
  });
};

export const getOtpEmailHtml = (
  firstName: string,
  lastName: string,
  otp: string,
  otpExpiresAt: Date,
) => {
  let html = fs.readFileSync(otpHtmlPath, 'utf8');

  html = html
    .replace(/{{firstName}}/g, firstName)
    .replace(/{{lastName}}/g, lastName)
    .replace(/{{otp}}/g, otp)
    .replace(
      /{{expiresAt}}/g,
      otpExpiresAt.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    );

  return html;
};
