require("dotenv").config();
const nodemailer = require("nodemailer");
const crypto = require("crypto");

// Generate a random 6-digit OTP
const generateOTP = () => {
    return Math.floor(100000 + Math.random() * 900000);
};

// Send OTP via Email
const sendOTP = async (email) => {
    const otp = generateOTP();

    // Create a transporter
    const transporter = nodemailer.createTransport({
        service: "gmail",
        auth: {
            user: process.env.EMAIL_USER,
            pass: process.env.EMAIL_PASS,
        },
    });

    // Email options
    const mailOptions = {
        from: process.env.EMAIL_USER,
        to: email,
        subject: "Your OTP Code",
        text: `Testing OTP from TrustPoint Your One-Time Password (OTP) is: ${otp}\n\nIt will expire in 10 minutes.`,
    };

    try {
        await transporter.sendMail(mailOptions);
        // console.log(`OTP sent successfully to ${email}: ${otp}`);
        return otp;
    } catch (error) {
        console.error("Error sending OTP:", error);
        return null;
    }
};

// Example usage
const userEmail = "deelordpopdy2@gmail.com"; // Replace with user's email
sendOTP(userEmail);

console.log(otp)
