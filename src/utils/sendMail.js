"use strict";
const nodemailer = require("nodemailer");
const asyncHandler = require('express-async-handler');

const sendEmail = asyncHandler(async ({email, html}) => {
      const transporter = nodemailer.createTransport({
            host: "smtp.gmail.com",
            port: 465,
            secure: true,
            auth: {
              // TODO: replace `user` and `pass` values from <https://forwardemail.net>
              user: process.env.EMAIL_NAME,
              pass: process.env.EMAIL_APP_PASSWORD
            }
          });
          
          
            // send mail with defined transport object
            const info = await transporter.sendMail({
              from: '"Garage Minh Đăng" <no-reply@minhdanggarage.com>', // sender address
              to: email, // list of receivers
              subject: "Forgot Password", // Subject line
              text: "Hello world?", // plain text body
              html: html, // html body
            });
          return info
})


module.exports = sendEmail