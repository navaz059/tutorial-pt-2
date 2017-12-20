let json2csv = require('json2csv');
let fields = ['checkInCount', 'checkOutCount', 'autoCheckoutCount','taxiTimeCount','freeOfChargeCount',"Total"];

module.exports = {

    checkNull(value){
        if(!value)
            return 0;
        else
            return value;
    },
    getFile(dataSet){
        dataSet.forEach((element) => {
            element.checkInCount = module.exports.checkNull(element.checkInCount);
            element.checkOutCount = module.exports.checkNull(element.checkOutCount);
            element.autoCheckoutCount = module.exports.checkNull(element.autoCheckoutCount);
            element.taxiTimeCount = module.exports.checkNull(element.taxiTimeCount);
            element.freeOfChargeCount = module.exports.checkNull(element.freeOfChargeCount);
            element.Total = 
                element.checkInCount+
                element.checkOutCount+
                element.autoCheckoutCount+
                element.taxiTimeCount+
                element.freeOfChargeCount
        });
        try {
        //    console.log(dataSet[0]);
            var result = json2csv({ data: dataSet, fields: fields });
            return result;
          } catch (err) {
            // Errors are thrown for bad options, or if the data is empty and no fields are provided.
            // Be sure to provide fields if it is possible that your data array will be empty.
            console.error(err);
          }
    }
};