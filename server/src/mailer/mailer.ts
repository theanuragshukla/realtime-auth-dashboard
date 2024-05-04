import nodemailer from "nodemailer";

class Mailer {
  private static transporter: nodemailer.Transporter;
  constructor() {
    Mailer.transporter = nodemailer.createTransport({
      service: "gmail",
      auth: {
        user: process.env.MAILER_USERNAME,
        pass: process.env.MAILER_PASSWORD,
      },
    });
  }

  public static sendMail(to: string, subject: string, html: string) {
    const mailOptions = {
      from: process.env.MAILER_USERNAME,
      to: to,
      subject: subject,
      html: html,
    };
    if (!Mailer.transporter) {
      new Mailer();
    }
    Mailer.transporter.sendMail(mailOptions, (error, info) => {
      if (error) {
        console.log(error);
      } else {
        console.log("Email sent: " + info.response);
      }
    });
  }
}
export default Mailer;
