const sgMail = require('@sendgrid/mail');
const config = require('../config');
sgMail.setApiKey(config.sendGridKey);            

module.exports = {
    sendGridMail(data,mailTo){ 
        data = new Buffer(data).toString('base64');
        const msg = {
            to: mailTo,
            from: 'reports@getmyparking.com',
            text: 'Please find the attached Report for Revenue',
            subject: 'Revenue Report',
            attachments: [
                {
                  content: data,
                  filename: 'report.csv',
                  type: 'text/csv',
                  disposition: 'attachment',
                  contentId: 'revenueReport'
                },
              ],
        };
        sgMail.send(msg)
        .then(() => {
            console.log("Email Sent Successfully");
          })
        .catch(error => {
            //Log friendly error
            console.error(error.toString());
            //Extract error msg
            const {message, code, response} = error;
            //Extract response msg
            const {headers, body} = response;
        });;
    }
};