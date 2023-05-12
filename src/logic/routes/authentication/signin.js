import { getDb } from '../../../index';
const bcrypt = require('bcryptjs');

// schema
// body = {
//   'userName': 'laude@gandu.com' or '9876543210',
//   'password': 'Gandu*123'
// }

export async function signin(ctx) {

  try {

    const db = await getDb();
    const usersCol = db.collection('users');

    const body = await ctx.req.json();
    const userName = body.userName;
    const pass = body.password;
    // const email = body.email; // username can be username, email or pass

    // check if the user is already in the database
    const user = await usersCol.findOne({ $or: [{ email: userName }, { phone: userName }] });

    // check if the email exists
    if (!user) throw Error("User Doesn't exist, create a new account!");   

    // check if the password is correct
    const pwMatch = await bcrypt.compare(pass, user.password);
    if (!pwMatch) throw Error("Invalid username or password"); 
    
    await usersCol.updateOne({ email: userName }, { $set: { lastLoginOn: Date.now() } });
    
    return ctx.json({user, trip, 'statuscode':200, 'authToken':authToken}, 200);

  } catch (err) {
    console.log(err);
    return ctx.json({ error: err.message,statuscode: 400 }, 400);
  }
};