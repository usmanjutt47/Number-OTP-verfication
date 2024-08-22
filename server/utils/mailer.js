const nodemailer = require("nodemailer");

const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: "usmanjutt04747@gmail.com",
    pass: "rybyqghhajxlswar",
  },
});

const mailer = async (to, subject, html) => {
  await transporter.sendMail({
    from: "usmanjutt04747@gmail.com",
    to,
    subject,
    html,
  });
};

module.exports = mailer;
