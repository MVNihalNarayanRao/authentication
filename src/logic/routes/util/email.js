// Add You Email
// Change email template (it is just html)

exports.sendEmail = async function sendEmail(from, to, subject, body) {

  let send_request = new Request("https://api.mailchannels.net/tx/v1/send", {
      "method": "POST",
      "headers": {
          "content-type": "application/json",
      },
      "body": JSON.stringify({
          "personalizations": [
              { "to": [ { "email": to }]}
          ],
          "from": {
              "email": "Your_Email_Here",
              "name": "Daddy",
          },
          "subject": subject,
          "content": [{
              "type": "text/html",
              "value": body,
          }],
      }),
  });

  const res = await fetch(send_request);

  console.log(await res.text());

  return res;
}

exports.generateOtpMailTemplate = function generateOtpMailTemplate(otp) { 
    return `<div style="font-family: Helvetica,Arial,sans-serif;min-width:1000px;overflow:auto;line-height:2">
    <div style="margin:50px auto;width:70%;padding:20px 0">
      <div style="border-bottom:1px solid #eee">
        <a href="" style="font-size:1.4em;color: #00466a;text-decoration:none;font-weight:600">Easy Travel Verification System</a>
      </div>
      <p style="font-size:1.1em">Hi,</p>
      <p>Namskara Gandu! Valid for 1 hr</p>
      <h2 style="background: #00466a;margin: 0 auto;width: max-content;padding: 0 10px;color: #fff;border-radius: 4px;">${otp}</h2>
      <p style="font-size:0.9em;">Regards,<br />Joe Mama</p>
      <hr style="border:none;border-top:1px solid #eee" />
      <div style="float:right;padding:8px 0;color:#aaa;font-size:0.8em;line-height:1;font-weight:300">
        <p>Easy Travel</p>
      </div>
    </div>
  </div>`;
}

exports.generatePasswordResetMailTemplate = function generatePasswordResetMailTemplate(otp) { 
    return `<div style="font-family: Helvetica,Arial,sans-serif;min-width:1000px;overflow:auto;line-height:2">
    <div style="margin:50px auto;width:70%;padding:20px 0">
      <div style="border-bottom:1px solid #eee">
        <a href="" style="font-size:1.4em;color: #00466a;text-decoration:none;font-weight:600">Easy Travel Security System</a>
      </div>
      <p style="font-size:1.1em">Hi,</p>
      <p>Namskara Gandu! Valid for 1 hr</p>
      <h2 style="background: #00466a;margin: 0 auto;width: max-content;padding: 0 10px;color: #fff;border-radius: 4px;">${otp}</h2>
      <p style="font-size:0.9em;">Regards,<br />Joe Mama</p>
      <hr style="border:none;border-top:1px solid #eee" />
      <div style="float:right;padding:8px 0;color:#aaa;font-size:0.8em;line-height:1;font-weight:300">
        <p>Easy Travel</p>
      </div>
    </div>
  </div>`;
}
