# Authentication

## How to use?
1. Clone the repo
2. Create Account in mongodb
    -> Create free database using their free tier
    -> After that create an app 
    -> Give read/write access to that app to your database
3. Get you app id, database name from mongodb and paste it in the script
4. Install dependencies using "npm i"
5. Create an account in cloudflare.com and configure a domain (see youtube cloudflare workers)
6. Login to it using "wrangler login"
7. Run test server using "wrangler dev"
8. publish to cloudflare workers
