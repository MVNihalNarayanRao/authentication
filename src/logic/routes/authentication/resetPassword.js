import { getDb } from '../../../index';
const bcrypt = require('bcryptjs');
const emailService = require('../util/email');

// schema
// body = {
//   'otp': '1234',
//   'userName': 'laudekebal@gandu.com',
//   'newPassword': 'Gandu*123'
// }

export async function resetPassword(ctx) {

    try {
        const db = await getDb();
        const passResetCol = db.collection('passwordResets');
        const userCol = db.collection('users');

        const body = await ctx.req.json();
        const otp = body.otp;
        const userName = body.userName;
        const newPassword = body.newPassword;

        const verif = await passResetCol.findOne({ userName: userName });
        if (!verif) {
            throw Error('Invalid Session or Code Expired');
        }

        const otpMatch = bcrypt.compare(otp, verif.otp);
        if (!otpMatch) {
            throw Error('Invalid Code');
        }

        // hash new pass
        const salt = await bcrypt.genSalt(10);
        const passHash = await bcrypt.hash(newPassword, salt);

        // update user
        await userCol.updateOne({ userName: userName }, { $set: { password: passHash } });

        await passResetCol.deleteOne({ userName: userName });

        return ctx.json({ message: 'Password Reset Success' }, 200);

    } catch (error) {
        return ctx.json({ error: error.message }, 400);
    }

};

// 
// body = {
//     email: 'la',
// }

export async function sendPasswordResetEmail(ctx) {

    try {
        const db = await getDb();
        const passResetCol = db.collection('passwordResets');
        const userCol = db.collection('users');

        const body = await ctx.req.json();
        const userName = body.userName;

        const user = await userCol.findOne({ userName: userName });
        if (!user) {
            throw Error('User does not exist');
        }

        const otp = 1000 + Math.floor(Math.random() * 9000);
        const emailTemplate = emailService.generateOtpMailTemplate(otp);

        await emailService.sendEmail('verification@easytravel.com', userName, 'Easy Travel Password Reset', emailTemplate);

        const salt = await bcrypt.genSalt(8);
        const hashOtp = await bcrypt.hash(otp.toString(), salt);

        // store it for verification
        await passResetCol.insertOne({
            userName: userName,
            otp: hashOtp,
            createdAt: Date.now()
        })

        return ctx.json({ message: 'Password Reset Email Sent!' }, 200);

    } catch (error) {
        return ctx.json({ error: error.message }, 400);
    }
};