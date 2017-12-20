const jwt = require('jsonwebtoken');

module.exports = {
    authenticate:function(req, res, next){
        // check header or url parameters or post parameters for token
        let token = "";
        if (req.headers && req.headers.authorization) {
          var parts = req.headers.authorization.split(' ');
          if (parts.length === 2 && parts[0] === 'Bearer') {
            if (token) {
              error = true;
            }
            token = parts[1];
          }
        }
        // decode token
        if (token) {
          // verifies secret and checks exp
          jwt.verify(token,Buffer.from('aWp3zPX15752kIa1e37DX27mztA8JnVK', 'base64'), function(err, decoded) {      
            if (err) {
              return res.json({ success: false, message: 'Failed to authenticate token.'});    
            } else {
              // if everything is good, save to request for use in other routes
              req.decoded = decoded;  
              next();
            }
          });
        } else {
          return res.status(403).send({ 
            success: false, 
            message: 'No token provided.'
          });
        }
    },
    login(){
      (req,res)=>{
        // get base64 encoded login credentials
        let loginCredentials = req.body.credentials;
        let words = crypto.enc.Base64.parse(loginCredentials);
        let textString = crypto.enc.Utf8.stringify(words);
        // create string as username:password
        let connection =mysql.createConnection({
          user: 'root',
          password: 'root',
          server: '127.0.0.1',
          database: 'get_my_parking_v3',
        });
      
        let userDetails = textString.split(':');
        let user = userDetails[0];
        let pwd = userDetails[1];
      
        let sqlQuery = `Select * from user_b2b where username= "${user}" AND password="${pwd}"`;
        connection.connect();
        connection.query(sqlQuery, function (error, results, fields){
          if (error) throw error;
          if(results.length === 0){
            res.json({"mesage":"Username Or Password does not exists"});    
          }else{
          //  getUserAccesses(userName);
            res.json(results);
          }
        });
        connection.end();
      }
    }   
  };