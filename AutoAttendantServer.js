var dbmodel = require('dvp-dbmodels');
var logger = require('dvp-common/LogHandler/CommonLogHandler.js').logger;


function GetAutoAttendant(extension, company, tenant, CallBack){


    logger.debug("DVP-AutoAttendant.GetAutoAttendant Internal method ");


    dbmodel.AutoAttendant.find({include: [{model: dbmodel.Action, as: "Actions"}], where: [{Extention: extension, Company: company, Tenant : tenant}]}).complete(function (err, aaData) {


        if (!err && aaData) {

            logger.debug("Got Auto attendant data");

            try {

                CallBack(aaData);

            } catch(exp) {

            }

        } else {



        }

    })


}

module.exports.GetAutoAttendant = GetAutoAttendant;
