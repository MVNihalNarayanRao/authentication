import { getDb } from '../../../index';
const bcrypt = require('bcryptjs');
const emailService = require('../util/email');

// schema
// body = {
//   'otp': '1234',
//   'email': 'laudekebal@gandu.com'
// }

export async function verifyEmail(ctx) {

    try {
        const db = await getDb();
        const verifCol = db.collection('verifications');
        const usersCol = db.collection('users');

        const body = await ctx.req.json();
        const otp = body.otp;
        const email = body.email;

        const verif = await verifCol.findOne({ email: email });
        if (!verif) {
            throw Error('Invalid Session or Code Expired');
        }

        const otpMatch = bcrypt.compare(otp, verif.otp);
        if (!otpMatch) {
            throw Error('Invalid OTP');
        }

        // update user
        await usersCol.updateOne({ email: email }, { $set: { emailVerified: true } });

        await verifCol.deleteOne({ email: email });

        ctx.json({ message: 'Verification Success', statuscode: 200 }, 200);

    } catch (error) {
        ctx.json({ 'error': error.message, statuscode: 400 }, 400);
    }

};

// if user decides to change email we got it covered
// body = {
//     prevEmail: 'gandu',
//     email: 'la',
// }

export async function sendVerificationEmail(ctx) {

    try {
        const db = await getDb();
        const verifDbCon = db.collection('verifications');
        const usersCol = db.collection('users');

        const body = await ctx.req.json();
        const prevEmail = body.prevEmail;
        const email = body.email;

        // if email has changed update it
        if (prevEmail != email) {
            await usersCol.updateOne({ email: prevEmail }, { $set: { email: email } });
        }

        const user = await usersCol.findOne({ email: email });
        if (!user) {
            throw Error('User does not exist');
        } else if (user.emailVerified) {
            throw Error('Email is already verified');
        }

        const otp = 1000 + Math.floor(Math.random() * 9000);
        const emailTemplate = emailService.generateOtpMailTemplate(otp);

        await emailService.sendEmail('verification@easytravel.com', email, 'Easy Travel Email Verification', emailTemplate);

        const salt = await bcrypt.genSalt(8);
        const hashOtp = await bcrypt.hash(otp.toString(), salt);

        // store it for verification
        await verifDbCon.insertOne({
            email: email,
            otp: hashOtp,
            createdAt: Date.now()
        });

        ctx.json({ message: 'Verification Email Sent', otp: otp }, 200);

    } catch (error) {
        ctx.json({ 'error': error.message, statuscode: res.statusCode }, 400);
    }
};