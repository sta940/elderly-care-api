const nodemailer = require("nodemailer");

const transporter = nodemailer.createTransport({
    port: 465,
    host: "smtp.gmail.com",
    auth: {
        user: 'sta26iap@gmail.com',
        pass: 'ltirsmuozwflolko',
    },
    secure: true,
});

const sendEmail = (email, token, host, cb) => {
    const mailData = {
        from: 'info@basw-ngo.by',
        to: email,
        subject: 'ElderlyCare - Восстановление пароля',
        text: 'Для восстановления пароля, пожалуйста перейдите по ссылке: ' + `http://${host}/reset?${email}`,
    };
    transporter.sendMail(mailData, cb);
};

export default sendEmail;