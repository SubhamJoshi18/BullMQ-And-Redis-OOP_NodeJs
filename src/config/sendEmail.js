import nodemailer from "nodemailer";
import logger from "./logger.js";
import { emailQueue, emailQueuename } from "../jobs/EmailQueue.js";

export const sendEmail = async (to, subject, text, html) => {
  const transport = nodemailer.createTransport({
    service: "gmail",
    host: "smtp.gmail.com",
    port: 456,
    secure: true,
    auth: {
      user: "shubhamrajjoshi69@gmail.com",
      pass: "ulqa tixh kvjm hyht",
    },
  });

  const methodOptions = {
    from: {
      name: "Subham Joshi",
      address: "shubhamrajjoshi69@gmail.com",
    },
    to,
    subject,
    text,
    html,
  };

  await emailQueue.add(emailQueuename, methodOptions);

  try {
    const res = await transport.sendMail(methodOptions);
    logger.info(res);
  } catch (err) {
    logger.error(err);
  }
};
