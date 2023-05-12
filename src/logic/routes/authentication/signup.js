const bcrypt = require('bcryptjs');
const { getDb } = require('../../../index');
const emailService = require('../util/email');

// schema
// {
//   'email' : 'laude@gmail.com',
//   'fullName': 'laude',
//   'password': 'gandu*123'
// }

export async function signup(ctx) {

  try {

    const db = await getDb();
    var usersCol = db.collection('users');
    var verifUsersCol = db.collection('verifications');

    const body = await ctx.req.json();

    const pass = body.password;
    const email = body.email;
    const fullName = body.fullName;

    // check if the user is already in the database
    // check if the user is already in the database
    const user = await usersCol.findOne({ email: email });

    // check if the email exists
    if (user) {
      throw Error("Signup fail: email already exists");
    }

    // hash the password use bcrypt
    const salt = await bcrypt.genSalt(10);
    if (!salt) {
      throw Error('salt generator error');
    }

    const hashedPassword = await bcrypt.hash(pass, salt);
    if (!hashedPassword) {
      throw Error('password hasher error');
    }

    // create an user use the model and fill up the fields
    const newUser = await usersCol.insertOne({
      fullName: fullName,
      password: hashedPassword,
      email: email,
      emailVerified: false,
      registeredOn: Date.now()
    });

    // send email
    const otp = 1000 + Math.floor(Math.random() * 9000);
    const emailTemplate = emailService.generateOtpMailTemplate(otp);

    await emailService.sendEmail('verification@easytravel.com', email, 'Easy Travel Email Verification', emailTemplate);

    const salt2 = await bcrypt.genSalt(8);
    const hashOtp = await bcrypt.hash(otp.toString(), salt2);

    // store it for verification
    await verifUsersCol.insertOne({
      email: email,
      otp: hashOtp,
      createdAt: Date.now()
    })

    return ctx.json({ message: 'Verification Email Sent!', statuscode: 200 }, 200);

  } catch (error) {
    console.log(error);
    return ctx.json({ error: error.message, statuscode: 400 }, 400);
  }
};