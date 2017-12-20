const user = require('../controllers/User');
const revenueReport = require('../controllers/RevenueReport');
const express = require('express');
const bearerToken = require('express-bearer-token'); 
const mysql = require('mysql');

module.exports = (app) => {
    let apiRoutes = express.Router();  
    //Set Authentication to get Reports  
    function getUserAccesses(userName){
      let sqlQuery = `Select * from parking_sub_lot_user_access where username= "${user}" AND password="${pwd}"`;
    }
    app.post('/login',user.login);
    // route middleware to authenticate and check token
    apiRoutes.use(user.authenticate);
    apiRoutes.get('/report',revenueReport.getReport);
    apiRoutes.get('/reportAsExcel',revenueReport.reportAsExcel);    
    apiRoutes.get('/reportAsMail',revenueReport.reportAsMail);    
    apiRoutes.get('/valueCard',revenueReport.reportAsExcel);    
    apiRoutes.get('/dataDump',revenueReport.reportAsMail); 
    apiRoutes.get('/currentStatus',revenueReport.reportAsMail);       
    app.use('/dashboard',apiRoutes);
};