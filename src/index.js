// Create a mongo db account -> create app -> get api key and paste here

import * as Realm from 'realm-web';
import { resetPassword, sendPasswordResetEmail } from './logic/routes/authentication/resetPassword';
import { signin } from './logic/routes/authentication/signin';
import { signup } from './logic/routes/authentication/signup';
import { verifyEmail, sendVerificationEmail } from './logic/routes/authentication/verifyEmail';

import { Hono } from 'hono';
import { cors } from 'hono/cors';
const app = new Hono();

app.use('*', cors({ maxAge: 84600 }));

app.post('/resetPassword/', resetPassword);
app.post('/sendPasswordResetEmail/', sendPasswordResetEmail);
app.post('/signin/', signin);
app.post('/signup/', signup);
app.post('/verifyEmail/', verifyEmail);
app.post('/sendVerificationEmail/', sendVerificationEmail);

export async function getDb() {

    const app = new Realm.App({ id:'easy_travel-ipteu' });

    try {
        const credentials = Realm.Credentials.apiKey('Paste_API_Key_Here');
        // Attempt to authenticate
        var user = await app.logIn(credentials);
        var client = user.mongoClient('mongodb-atlas');
    } catch (err) {
        return utils.toError('Could not connect to mongo db', 500);
    }

    return client.db('paste_Database_name_here');

}

export default app;