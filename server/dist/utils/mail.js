import nodemailer from "nodemailer";
export async function SendMail(recipient, next) {
    return new Promise(async (resolve, reject) => {
        try {
            let transporter = nodemailer.createTransport({
                host: "smtp-relay.sendinblue.com",
                port: 587,
                auth: {
                    user: "titiloyepaul68@gmail.com",
                    pass: "xsmtpsib-00ef319f237226c080c655bd731862614b03d00c7b839220d22ba37a372209f5-DjYCVGbUs2aP80zZ",
                },
            });
            let mailStatus = await transporter.sendMail({
                from: "titiloyepaul68@gmail.com",
                to: recipient,
                subject: "Email Confirmation",
                text: "Email Confirmation",
                html: `<!DOCTYPE html>
<html>
<head>
  <title>Email Verification</title>
</head>
<body style="margin: 0; padding: 0; font-family: Arial, sans-serif; background-color: #f5f5f5;">
  <table cellpadding="0" cellspacing="0" width="100%" style="border-collapse: collapse;">
    <tr>
      <td align="center" style="padding: 20px;">
        <table cellpadding="0" cellspacing="0" width="400" style="background-color: #fff; border-radius: 5px; box-shadow: 0 2px 5px rgba(0, 0, 0, 0.1);">
          <tr>
            <td style="padding: 20px;">
              <h2 style="text-align: center; margin: 0;">Email Verification</h2>
              <p style="margin-top: 20px; margin-bottom: 30px; text-align: center;">Thank you for signing up in <b>Chat-Sphere</b>! Please click the link below to verify your email address:</p>
              <a href="${next}"></a>
              <p style="text-align: center; margin-bottom: 30px;"><a target="_blank" href="${next}" style="display: inline-block; padding: 10px 20px; background-color: #4CAF50; color: #fff; text-decoration: none; border-radius: 4px;">Verify Email</a></p>
              <p style="margin-top: 30px; margin-bottom: 0; text-align: center;">If you did not sign up for this service, you can safely ignore this email.</p>
            </td>
          </tr>
        </table>
      </td>
    </tr>
  </table>
</body>
</html>`, // plain text
            });
            resolve(true);
        }
        catch (err) {
            reject(false);
        }
    });
}
