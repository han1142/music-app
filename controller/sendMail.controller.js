const _ = require("lodash");
const nodeMailer = require("nodemailer");
const { google } = require("googleapis");

const CLIENT_ID = process.env.CLIENT_ID;
const CLIENT_SECRET = process.env.CLIENT_SECRET;
const REFRESH_TOKEN = process.env.REFRESH_TOKEN;
const REDIRECT_URI = process.env.REDIRECT_URI;

const oAuth2Client = new google.auth.OAuth2(
  CLIENT_ID,
  CLIENT_SECRET,
  REDIRECT_URI
);
oAuth2Client.setCredentials({ refresh_token: REFRESH_TOKEN });

const sendMailCtrl = async (to, action, url, txt) => {
  try {
    const accessToken = await oAuth2Client.getAccessToken();

    let transport = nodeMailer.createTransport({
      service: "gmail",
      auth: {
        type: "OAuth2",
        user: "lamtruongson137216@gmail.com",
        clientId: CLIENT_ID,
        clientSecret: CLIENT_SECRET,
        refreshToken: REFRESH_TOKEN,
        accessToken: accessToken,
      },
    });

    const info = await transport.sendMail(
      {
        from: '"Music App" <lamtruongson137216@gmail.com>', // sender address
        to: to, // list of receivers
        subject: `[Music-app] ${action}`, // Subject line
        html: `
            <div style="max-width: 700px; margin:auto; border: 10px solid #ddd; padding: 50px 20px; font-size: 110%;">
            <h2 style="text-align: center; text-transform: uppercase;color: teal;">Welcome to the music app.</h2>
            <p>Congratulations! You're almost set to start using Music app.
                Just click the button below to validate your email address.
            </p>
            
            <a href=${url} style="background: crimson; text-decoration: none; color: white; padding: 10px 20px; margin: 10px 0; display: inline-block;">${txt}</a>
        
            <p>If the button doesn't work for any reason, you can also click on the link below:</p>
        
            <div>${url}</div>
            </div>
        `,
      },
      (error) => {
        if (error) {
          return {
            success: false,
            message: "Send mail error!",
          };
        }
      }
    );

    return {
      success: true,
      message: "sent mail",
    };
  } catch (error) {
    console.log(error);
    return {
      success: false,
      message: "Send mail failed",
    };
  }
};

module.exports = sendMailCtrl;
