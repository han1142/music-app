const _ = require('lodash')
const nodeMailer = require('nodemailer')
const { google } = require('googleapis')

const CLIENT_ID = process.env.CLIENT_ID
const CLIENT_SECRET = process.env.CLIENT_SECRET
const REFRESH_TOKEN = process.env.REFRESH_TOKEN
const REDIRECT_URI = process.env.REDIRECT_URI

const oAuth2Client = new google.auth.OAuth2(CLIENT_ID, CLIENT_SECRET, REDIRECT_URI);
oAuth2Client.setCredentials({refresh_token: REFRESH_TOKEN});

const sendMailCtrl = async () => {
    try {
        const accessToken = await oAuth2Client.getAccessToken()
        
    let transport = nodeMailer.createTransport({
        service: "gmail",
        auth: {
            type: 'OAuth2',
            user: 'lamtruongson137216@gmail.com',
            clientId: CLIENT_ID,
            clientSecret: CLIENT_SECRET,
            refreshToken: REFRESH_TOKEN,
            accessToken: accessToken
        },
    });


    const info = await transport.sendMail({
        from: '"Fred Foo 👻" <lamtruongson137216@gmail.com>', // sender address
        to: "19522133@gm.uit.edu.vn", // list of receivers
        subject: "Hello ✔", // Subject line
        text: "Hello world?", // plain text body
        html: "<b>Hello world?</b>", // html body
      }, (error) => {
        if(error) {
            return {
                success: false,
                message: "Send mail error!"
            }
        }
      });

      console.log('info', info)

      return {
        success: true,
        message: "sent mail"
      }
    } catch (error) {
        console.log(error)
        return {
            success: false,
            message: "Send mail failed"
        }
    }

}

module.exports = sendMailCtrl