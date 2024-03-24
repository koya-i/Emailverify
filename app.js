const express = require('express');
const nodemailer = require('nodemailer');
const app = express();
require('dotenv').config();
app.set('view engine', 'hbs');
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

let otp;
function generateOtp() {
    otpVal = Math.floor(1000 + Math.random() * 9000);
    return otpVal;
}

app.get('/', (req, res) => {
    res.render('otp');
});

app.post('/send', async (req, res) => {
    otp = generateOtp();
    const recipientEmail = req.body.email;
    const transporter = nodemailer.createTransport({
        service: "gmail",
        auth: {
            user: "riyakumari9209@gmail.com",
            pass: process.env.PASS,
        }
    })

    const mail = {
        to: recipientEmail,
        from: "riyakumari9209@gmail.com",
        subject: "Hey Riya this side",
        text: `${otp}`,
    }

    try {
        await transporter.sendMail(mail);
        res.send(`
            <p>OTP sent successfully :) please check your mail</p>
            <form action="/verify" method="post">
                <label for="otp">Enter OTP:</label>
                <input type="text" id="otp" name="otp">
                <button type="submit">Verify OTP</button>
            </form>
        `);
    } catch (err) {
        res.send("OOPS! OTP not sent. Error :( " + err);
    }
});

app.post('/verify', (req, res) => {
    if (req.body.otp == otp) {
        res.send("You entered correct otp :)");
    } else {
        res.send('oops otp is incorrect hehe');
    }
});

app.listen(3000, () => {
    console.log("http://localhost:3000");
})
