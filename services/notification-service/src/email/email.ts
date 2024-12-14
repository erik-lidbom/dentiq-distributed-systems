const nodemailer = require("nodemailer");
import dotenv from "dotenv";

dotenv.config();

type SendEmail = {
  receivers: string[];
  subject: string;
  text: string;
};

const transporter = nodemailer.createTransport({
  service: "gmail",
  host: "smtp.gmail.email",
  port: 587,
  secure: true,
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_APP_PASSWORD,
  },
});

export const sendEmail = (email: SendEmail) => {
  const mailOptions = {
    to: email.receivers,
    subject: email.subject,
    text: email.text,
  };

  transporter.sendMail(mailOptions, (error: any, info: any) => {
    if (error) {
      return console.log("Error sending email:", error);
    }
    console.log("Message sent: %s", info.messageId);
  });
};
