const nodemailer = require("nodemailer");

module.exports = nodemailer.createTransport({
  host: 'smtppro.zoho.com',
  port: '465',
  secure: true, // true for 465, false for other ports
  auth: {
    user: process.env.ADMIN_EMAIL,
    pass: process.env.ADMIN_PASS,
  },
});