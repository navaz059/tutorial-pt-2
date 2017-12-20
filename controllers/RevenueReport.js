const request = require('request');
const crypto = require('crypto-js');
const config = require('../config');
const generateExcel = require('../helpers').generateExcel;
const sendEmail = require('../helpers').sendEmail;

module.exports = {
    setHeader:function(request){
        let options = {};
        let date = new Date(Date.now()).toUTCString();
        let signature = "x-date: "+ date + "\n" + "GET /report/v2/event/report HTTP/1.1" + "\n" + "x_gmp_tenant: gmp" ;
        let hash = crypto.HmacSHA256(signature, "JwkJKjOO6fsoMaJzZV1KsJYFZRxHnPIf");
        hash =  crypto.enc.Base64.stringify(hash).toString(); 
        //Don't change this string , even a space fucks up the authentication 
        let authorization = `hmac username="nagpurSkidataHMAC",algorithm="hmac-sha256",headers="x-date request-line x_gmp_tenant",signature="${hash}"`;
        const params = request.url.split("?");
        options.url = config.ReportURL+"?"+params[1];
        options.headers = request.headers;
        options.headers["Accept-Encoding"]="json/application";
        options.headers["Authorization"] = authorization;
        options.headers["x-date"] = date;
        options.headers["x_gmp_tenant"] = "gmp";
        options.rejectUnauthorized = false;
        return options;
    },  
    getReport:function(req,res){
        // For development, comment it in production, dummy user to authenticate when callling from outside of VPC.
        let options = module.exports.setHeader(req);
        request(options, function (error, response, body) {
            // Print the error if one occurred and handle it
            console.log('error:', error); 
            // Print the response status code if a response was received
            console.log('statusCode:', response && response.statusCode); 
            res.send(body);
        });  
    },
    reportAsExcel:function(req,res,mail){
        let options = module.exports.setHeader(req);
        request(options, function (error, response, body) {
            // Print the error if one occurred and handle it
            console.log('error:', error); 
            // Print the response status code if a response was received
            console.log('statusCode:', response && response.statusCode); 

            let promiseExcel = new Promise((resolve,reject)=>{
                if(response.statusCode === 200){
                    resolve(generateExcel.getFile(JSON.parse(body)));
                }else{
                    res.send({'message':"No Data To Excel"});
                }    
            });
            promiseExcel
            .then(body=>{
                res.attachment('revenueReport.csv');
                res.status(200).send(body);    
            })
            .catch((reason)=>{
                res.send({'message':`There was an error generating Excel ${reason}`});
            })
        });  
 
    },
    reportAsMail:function(req,res){
        let options = module.exports.setHeader(req);
        let mailTo = req.query.mailTo;
        if(!mailTo){
            res.status(400).send({'message':`Please Mention The email Addresses`})
        }else{
            mailTo = mailTo.split(",");
        }
        request(options, function (error, response, body) {
            // Print the error if one occurred and handle it
            console.log('error:', error); 
            // Print the response status code if a response was received
            console.log('statusCode:', response && response.statusCode); 

            let promiseMail = new Promise((resolve,reject)=>{
                resolve(generateExcel.getFile(JSON.parse(body)));    
            });

            promiseMail
            .then(data=>{
                sendEmail.sendGridMail(data,mailTo);
                res.send({'message':`Email Sent SuccesFully`})
            },rejected=>{
                console.log(`rejected because of ${rejected}`);
            });
            promiseMail.catch((reason)=>{
                res.send({'message':`Email Not Sent SuccesFully ${reason}`});
            });
        });
    }
}