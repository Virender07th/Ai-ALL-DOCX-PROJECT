import nodemailer from "nodemailer";

const mailSender = async (email, title, body) => {
  try {
    let transporter = nodemailer.createTransport({
      host: process.env.MAIL_HOST,
      port: 587,
      secure: false,
      auth: {
        user: process.env.MAIL_USER,
        pass: process.env.MAIL_PASS,
      },
    });

    let info = await transporter.sendMail({
      from: `"AI All Docx Project" <${process.env.MAIL_USER}>`,
      to: email,
      subject: title,
      html: body,
    });

    console.log("Mail sent:", info);
    return info;
  } catch (error) {
    console.log("Error occurred:", error.message);
    throw error;
  }
};

export default mailSender;
