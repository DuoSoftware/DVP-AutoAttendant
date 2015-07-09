var dbmodel = require('DVP-DBModels');
var logger = require('DVP-Common/LogHandler/CommonLogHandler.js').logger;
var msg = require('DVP-Common/CommonMessageGenerator/ClientMessageJsonFormatter.js');



function CreateAutoAttendant(req, res, next) {


    logger.debug("DVP-AutoAttendant.CreateAutoAttendant HTTP");

    var model = 0;
    var status = false;
    var returnerror= undefined;

    if(req.body){


        var aaData=req.body;


        var aaMaster = dbmodel.AutoAttendant.build({
            Name: aaData.Name,
            Code: aaData.Code,
            Extention: aaData.Extention,
            DayGreeting: aaData.DayGreeting,
            NightGreeting: aaData.NightGreeting,
            MenuSound: aaData.Menu,
            Tries: aaData.LoopCount,
            TimeOut: aaData.TimeOut,
            EnableExtention: aaData.EnableExtention,
            Company: aaData.Company,
            Tenant: aaData.Tenant
        })


        aaMaster
            .save()
            .complete(function(err) {
                if (!!err) {
                    logger.error("DVP-AutoAttendant.CreateAutoAttendant PGSQL save failed ",err);
                    returnerror = err;
                } else {
                    logger.debug('DVP-AutoAttendant.CreateAutoAttendant PGSQL AutoAttendant object saved successful');
                    status = true;
                }


                try {


                    var instance = msg.FormatMessage(returnerror,"AutoAttendant creation", status,undefined);
                    res.write(instance);
                    res.end();


                }
                catch(exp){

                    logger.error('DVP-AutoAttendant.CreateAutoAttendant Service failed ', exp);

                }
            })



    }
    else{

        logger.error("DVP-AutoAttendant.CreateAutoAttendant request.body is null");

        var instance = msg.FormatMessage(undefined,"AutoAttendant creation", false,undefined);
        res.write(instance);
        res.end();

    }

    return next();

}


function GetAttendants(req, res, next) {

    logger.debug("DVP-AutoAttendant.GetAttendants HTTP");


    dbmodel.AutoAttendant.findAll({include: [{model: dbmodel.Action, as: "Actions"}]}).complete(function (err, aaData) {


        if (!err) {

            try {

                var instance = msg.FormatMessage(undefined,"Auto Attendant Found", true,aaData);

                logger.debug("DVP-AutoAttendant.GetAttendants PGSQL  found");
                res.write(instance);
                res.end();

            } catch(exp) {

                logger.error("DVP-AutoAttendant.GetAttendants stringify json failed",  exp);
                var instance = msg.FormatMessage(exp,"Auto Attendant Error", false,undefined);
                res.write(instance);
                res.end();

            }
        } else {


            logger.error("DVP-AutoAttendant.GetAttendants PGSQL failed",  err);
            res.write(msg.FormatMessage(err,"Auto Attendant NotFound", false,undefined));
            res.end();
        }



    })

    return next();


}


function GetAttendantByName(req, res, next) {

    logger.debug("DVP-AutoAttendant.GetAttendantByName HTTP byID ");


    dbmodel.AutoAttendant.find({where: [{Name: req.params.name }], include: [{model: dbmodel.Action, as: "Actions"}]}).complete(function (err, aaData) {


        if (!err) {

            try {



                var instance = msg.FormatMessage(undefined,"Auto Attendant Found", true,aaData);

                logger.debug("DVP-AutoAttendant.GetAttendantByName PGSQL  found");
                res.write(instance);
                res.end();
            } catch(exp) {

                logger.error("DVP-AutoAttendant.GetAttendantByName stringify json failed",  exp);
                var instance = msg.FormatMessage(exp,"Auto Attendant Error", false,undefined);
                res.write("");
                res.end();

            }
        } else {


            logger.error("DVP-AutoAttendant.GetAttendantByName PGSQL failed",  err);
            res.write(msg.FormatMessage(err,"Auto Attendant NotFound", false,undefined));
            res.end();
        }



    })
    return next();



}


function SetDayGreetingFile(req, res, next) {


    var name = req.params.name;
    var outerror = undefined;

    logger.debug("DVP-AutoAttendant.SetDayGreetingFile HTTP %s ", name);

    var status = false;
    dbmodel.AutoAttendant.find({where: [{ Name: req.params.name }]}).complete(function(err, aaData) {
        if(!err && aaData) {

            logger.debug("DVP-AutoAttendant.SetDayGreetingFile PGSQL CallServer Found", aaData);

            aaData.updateAttributes({

                DayGreeting: req.params.file

            }).complete(function (err) {
                if (err) {
                    logger.error("DVP-AutoAttendant.SetDayGreetingFile PGSQL Set Greeting Failed ", err);
                    outerror = err;
                } else {
                    status = true;
                    logger.debug("DVP-AutoAttendant.SetDayGreetingFile PGSQL Set Greeting Succeed");
                }


                try {

                    var instance = msg.FormatMessage(outerror, "Auto Attendant Set Greeting", status, undefined);
                    res.write(instance);
                    res.end();

                }
                catch (exp) {

                    logger.debug("DVP-AutoAttendant.SetDayGreetingFile Auto Attendant Set Greeting Error ", exp);

                }

            })
        }
        else
        {
            logger.debug("DVP-AutoAttendant.SetDayGreetingFile PGSQL AutoAttendant NotFound ", err);
            var instance = msg.FormatMessage(undefined, "Auto Attendant Set Greeting", status, undefined);
            res.write(instance);
            res.end();

        }
    });

    return next();


}


function SetNightGreetingFile(req, res, next) {



    var name = req.params.name;

    var outerror = undefined;

    logger.debug("DVP-AutoAttendant.SetNightGreetingFile HTTP %s ", name);

    var status = false;
    dbmodel.AutoAttendant.find({where: [{ Name: req.params.name }]}).complete(function(err, aaData) {
        if(!err && aaData) {

            logger.debug("DVP-AutoAttendant.SetNightGreetingFile PGSQL CallServer Found");

            aaData.updateAttributes({

                NightGreeting: req.params.file

            }).complete(function (err) {
                if (err) {
                    logger.error("DVP-AutoAttendant.SetNightGreetingFile PGSQL Set Greeting Failed ", err);
                    outerror = err;
                } else {
                    status = true;
                    logger.debug("DVP-AutoAttendant.SetNightGreetingFile PGSQL Set Greeting Succeed");
                }


                try {

                    var instance = msg.FormatMessage(outerror, "Auto Attendant Set Greeting", status, undefined);
                    res.write(instance);
                    res.end();

                }
                catch (exp) {

                    logger.debug("DVP-AutoAttendant.SetNightGreetingFile Auto Attendant Set Greeting Error ", exp);

                }

            })
        }
        else
        {
            logger.debug("DVP-AutoAttendant.SetNightGreetingFile PGSQL AutoAttendant NotFound ", err);
            var instance = msg.FormatMessage(undefined, "Auto Attendant Set Greeting", status, undefined);
            res.write(instance);
            res.end();

        }
    });

    return next();


}


function SetMenue(req, res, next) {




    var name = req.params.name;

    var outerror = undefined;

    logger.debug("DVP-AutoAttendant.SetMenue HTTP %s ", name);

    var status = false;
    dbmodel.AutoAttendant.find({where: [{ Name: req.params.name }]}).complete(function(err, aaData) {
        if(!err && aaData) {

            logger.debug("DVP-AutoAttendant.SetMenue PGSQL Auto Attendant Found");

            aaData.updateAttributes({

                MenuSound: req.params.file

            }).complete(function (err) {
                if (err) {
                    logger.error("DVP-AutoAttendant.SetMenue PGSQL Set Menu Failed ", err);
                    outerror = err;
                } else {
                    status = true;
                    logger.debug("DVP-AutoAttendant.SetMenue PGSQL Set Menu Succeed");
                }


                try {

                    var instance = msg.FormatMessage(outerror, "Auto Attendant Set Menu", status, undefined);
                    res.write(instance);
                    res.end();

                }
                catch (exp) {

                    logger.debug("DVP-AutoAttendant.SetMenue Auto Attendant Set Menu Error ", exp);

                }

            })
        }
        else
        {
            logger.debug("DVP-AutoAttendant.SetMenue PGSQL AutoAttendant NotFound ", err);
            var instance = msg.FormatMessage(undefined, "Auto Attendant Set Menu", status, undefined);
            res.write(instance);
            res.end();

        }
    });

    return next();


}


function SetLoopCount(req, res, next) {


    var name = req.params.name;

    var outerror = undefined;

    logger.debug("DVP-AutoAttendant.SetLoopCount HTTP %s ", name);

    var status = false;
    dbmodel.AutoAttendant.find({where: [{ Name: req.params.name }]}).complete(function(err, aaData) {
        if(!err && aaData) {

            logger.debug("DVP-AutoAttendant.SetLoopCount PGSQL Auto Attendant Found");

            aaData.updateAttributes({

                Tries: int.parse( req.params.count)

            }).complete(function (err) {
                if (err) {
                    logger.error("DVP-AutoAttendant.SetLoopCount PGSQL Set Loop Failed ", err);
                    outerror = err;
                } else {
                    status = true;
                    logger.debug("DVP-AutoAttendant.SetLoopCount PGSQL Set Loop Succeed");
                }


                try {

                    var instance = msg.FormatMessage(outerror, "Auto Attendant Set Loop", status, undefined);
                    res.write(instance);
                    res.end();

                }
                catch (exp) {

                    logger.debug("DVP-AutoAttendant.SetLoopCount Auto Attendant Set Loop Error ", exp);

                }

            })
        }
        else
        {
            logger.debug("DVP-AutoAttendant.SetLoopCount PGSQL AutoAttendant NotFound ", err);
            var instance = msg.FormatMessage(undefined, "Auto Attendant Set Loop", status, undefined);
            res.write(instance);
            res.end();

        }
    });

    return next();

}


function SetTimeout(req, res, next) {

    var name = req.params.name;

    var outerror = undefined;

    logger.debug("DVP-AutoAttendant.SetLoopCount HTTP %s ", name);

    var status = false;
    dbmodel.AutoAttendant.find({where: [{ Name: req.params.name }]}).complete(function(err, aaData) {
        if(!err && aaData) {

            logger.debug("DVP-AutoAttendant.SetLoopCount PGSQL Auto Attendant Found");

            aaData.updateAttributes({

                TimeOut: int.parse( req.params.sec)

            }).complete(function (err) {
                if (err) {
                    logger.error("DVP-AutoAttendant.SetLoopCount PGSQL Set Loop Failed ", err);
                    outerror = err;
                } else {
                    status = true;
                    logger.debug("DVP-AutoAttendant.SetLoopCount PGSQL Set Loop Succeed");
                }


                try {

                    var instance = msg.FormatMessage(outerror, "Auto Attendant Set Loop", status, undefined);
                    res.write(instance);
                    res.end();

                }
                catch (exp) {

                    logger.debug("DVP-AutoAttendant.SetLoopCount Auto Attendant Set Loop Error ", exp);

                }

            })
        }
        else
        {
            logger.debug("DVP-AutoAttendant.SetLoopCount PGSQL AutoAttendant NotFound ", err);
            var instance = msg.FormatMessage(undefined, "Auto Attendant Set Loop", status, undefined);
            res.write(instance);
            res.end();

        }
    });

    return next();

}


function SetExtensionDialing(req, res, next) {

    var name = req.params.name;

    var outerror = undefined;

    logger.debug("DVP-AutoAttendant.SetExtensionDialing HTTP %s ", name);

    var status = false;
    dbmodel.AutoAttendant.find({where: [{ Name: req.params.name }]}).complete(function(err, aaData) {
        if(!err && aaData) {

            logger.debug("DVP-AutoAttendant.SetExtensionDialing PGSQL Auto Attendant Found");

            aaData.updateAttributes({

                EnableExtention: bool.parse( req.params.status)

            }).complete(function (err) {
                if (err) {
                    logger.error("DVP-AutoAttendant.SetExtensionDialing PGSQL Set ExtDialing Failed ", err);
                    outerror = err;
                } else {
                    status = true;
                    logger.debug("DVP-AutoAttendant.SetExtensionDialing PGSQL Set ExtDialing Succeed");
                }


                try {

                    var instance = msg.FormatMessage(outerror, "Auto Attendant Set ExtDialing", status, undefined);
                    res.write(instance);
                    res.end();

                }
                catch (exp) {

                    logger.debug("DVP-AutoAttendant.SetLoopCount Auto Attendant Set ExtDialing Error ", exp);

                }

            })
        }
        else
        {
            logger.debug("DVP-AutoAttendant.SetLoopCount PGSQL AutoAttendant NotFound ", err);
            var instance = msg.FormatMessage(undefined, "Auto Attendant Enable ExtDialing", status, undefined);
            res.write(instance);
            res.end();

        }
    });

    return next();



}


function RemoveAction(req, res, next) {



    logger.debug("DVP-AutoAttendant.RemoveAction HTTP byID ");


    dbmodel.AutoAttendant.find({where: [{Name: req.params.name }], include: [{model: dbmodel.Action, as: "Actions"}]}).complete(function (err, aaData) {


        if (!err) {

            try {

                logger.debug("DVP-AutoAttendant.RemoveAction PGSQL  found");


                aaData.destroy().complete(function (errx, result)
                {
                    if(!errx)
                    {
                        logger.info("DVP-AutoAttendant.RemoveAction PGSQL  Removed");
                        var instance = msg.FormatMessage(undefined,"Action Deleted", true,undefined);

                    }
                    else
                    {
                        logger.error("DVP-AutoAttendant.RemoveAction PGSQL  failed", errx);
                        var instance = msg.FormatMessage(errx,"Action delete failed", false,undefined);


                    }
                });




                res.write(instance);
                res.end();
            } catch(exp) {

                logger.error("DVP-AutoAttendant.RemoveAction stringify json failed",  exp);
                var instance = msg.FormatMessage(exp,"Action delete failed", false,undefined);
                res.write(instance);
                res.end();

            }
        } else {


            logger.error("DVP-AutoAttendant.RemoveAction PGSQL failed",  err);
            res.write(msg.FormatMessage(err,"Action NotFound", false,undefined));
            res.end();
        }



    })
    return next();
}


function RemoveAutoAttendent(req, res, next) {




    logger.debug("DVP-AutoAttendant.RemoveAutoAttendent HTTP byID ");


    dbmodel.AutoAttendant.find({where: [{Name: req.params.name }], include: [{model: dbmodel.Action, as: "Actions"}]}).complete(function (err, aaData) {


        if (!err) {

            try {

                logger.debug("DVP-AutoAttendant.RemoveAutoAttendent PGSQL  found");


                var instance;
                aaData.destroy().complete(function (errx, result)
                {
                    if(!errx)
                    {
                        logger.info("DVP-AutoAttendant.RemoveAutoAttendent PGSQL  Removed");
                        instance = msg.FormatMessage(undefined,"Auto Attendant Deleted", true,undefined);
                        res.write(instance);
                        res.end();

                    }
                    else
                    {
                        logger.error("DVP-AutoAttendant.RemoveAutoAttendent PGSQL  failed", errx);
                        instance = msg.FormatMessage(errx,"Auto Attendant delete failed", true,undefined);
                        res.write(instance);
                        res.end();


                    }
                });





            } catch(exp) {

                logger.error("DVP-AutoAttendant.RemoveAutoAttendent stringify json failed",  exp);
                instance = msg.FormatMessage(exp,"Auto Attendant delete failed", false,undefined);
                res.write(instance);
                res.end();

            }
        } else {


            logger.error("DVP-AutoAttendant.RemoveAutoAttendent PGSQL failed",  err);
            res.write(msg.FormatMessage(err,"Auto Attendant NotFound", false,undefined));
            res.end();
        }



    })
    return next();

}


function SetAction(req, res, next) {

    logger.debug("DVP-AutoAttendant.SetAction HTTP");

    var Action=req.body;
    var status = false;

    var actionItem = req.body;

    if(actionItem){

        dbmodel.AutoAttendant.find({where: [{ Name: req.params.name }]}).complete(function(err, aaData) {
            if(!err && aaData) {
                logger.debug("DVP-AutoAttendant.SetAction Attendant Found ");

                var actionObj = dbmodel.Action.build(
                    {
                        Name: actionItem.Name,
                        Action: actionItem.Action,
                        OnEvent: req.params.on,
                        Data: actionItem.Data
                    }
                );


                actionObj
                    .save()
                    .complete(function (err) {

                        if (!err) {


                            logger.debug("DVP-AutoAttendant.SetAction Action Saved ",actionObj);

                            aaData.addActions(actionObj).complete(function (errx, aaData) {

                                logger.debug("DVP-AutoAttendant.SetAction Action Set Attendant");

                                status = true;

                                var instance = msg.FormatMessage(undefined, "Add Action", status, undefined);
                                res.write(instance);
                                res.end();


                            });


                        } else {

                            var instance = msg.FormatMessage(err, "Add Action", status, undefined);
                            res.write(instance);
                            res.end();

                            logger.error("DVP-AutoAttendant.SetAction Action Save Failed ",err);

                        }
                    }
                )
            }
            else
            {
                logger.error("DVP-AutoAttendant.SetAction Attendant NotFound ");
                var instance = msg.FormatMessage(undefined, "Add Action", status, undefined);
                res.write(instance);
                res.end();

            }

        })


    }
    else{

        var instance = msg.FormatMessage(undefined, "Add Action", status, undefined);
        res.write(instance);
        res.end();
        logger.debug("DVP-AutoAttendant.SetAction Object Validation Failed ");

    }


    return next();


}


module.exports.CreateAutoAttendant = CreateAutoAttendant;
module.exports.GetAttendants = GetAttendants;
module.exports.GetAttendantByName = GetAttendantByName;
module.exports.SetDayGreetingFile = SetDayGreetingFile;
module.exports.SetNightGreetingFile = SetNightGreetingFile;
module.exports.SetMenue = SetMenue;
module.exports.SetLoopCount = SetLoopCount;
module.exports.SetTimeout = SetTimeout;
module.exports.SetExtensionDialing = SetExtensionDialing;
module.exports.SetAction = SetAction;
module.exports.RemoveAction = RemoveAction;
module.exports.RemoveAutoAttendent = RemoveAutoAttendent;

//////////////////////////////Cloud API/////////////////////////////////////////////////////
/*
server.post('/DVP/API/:version/AuttoAttendant', aa.CreateAutoAttendant);
server.get('/DVP/API/:version/AuttoAttendants', aa.GetAttendants);
server.get('/DVP/API/:version/AuttoAttendant/:name', aa.GetAttendantByName);
server.post('/DVP/API/:version/AuttoAttendant/:name/Greeting/:file/:isday', aa.SetGreetingFile);
server.post('/DVP/API/:version/AuttoAttendant/:name/Menue/:file', aa.SetMenue);
server.post('/DVP/API/:version/AuttoAttendant/:name/Loop/:count', aa.SetLoopCount);
server.post('/DVP/API/:version/AuttoAttendant/:name/Timeout/:sec', aa.SetTimeout);
server.post('/DVP/API/:version/AuttoAttendant/:name/EnableExtention/:status', aa.SetExtensionDialing);
server.post('/DVP/API/:version/AuttoAttendant/:name/Action/:on', aa.SetAction);
*/