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
        from: 'sta26iap@gmail.com',
        to: email,
        subject: 'Верификация аккаунта',
        text: 'Для подтверждения вашей почты, пожадуйста перейдите по ссылке: ' + `http://${host}:5000/verify/` + token,
    };
    transporter.sendMail(mailData, cb);
};

export default sendEmail;