import nodemailer from 'nodemailer';
import config from '../config';
import AppError from '../error/appError';

const sendMailer = async (email: string, subject?: string, html?: string) => {
  const transporter = nodemailer.createTransport({
    host: config.email.host,
    port: Number(config.email.port),
    secure: Number(config.email.port) === 465,
    auth: {
      user: config.email.address,
      pass: config.email.pass,
    },
  });
  try {
    const info = await transporter.sendMail({
      from: {
        name: 'Analytic Soccer',
        address: config.email.from || config.email.address!,
      },
      to: email,
      subject,
      html,
    });

    console.log('Message sent:', info.messageId);
  } catch (error: any) {
    console.error('Email delivery failed:', error.code, error.responseCode);
    throw new AppError(
      503,
      'Email could not be sent. Please try again later or contact supports.',
    );
  }
};

export default sendMailer;
