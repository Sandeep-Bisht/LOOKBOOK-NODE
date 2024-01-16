const nodemailer = require("nodemailer");

module.exports = nodemailer.createTransport({
  service: "smtppro.zoho.com",
  port: 587,
  auth: {
    user: process.env.ADMIN_EMAIL,
    pass: process.env.ADMIN_PASS,
  },
})