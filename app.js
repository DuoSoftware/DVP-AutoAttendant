
var restify = require('restify');
var sre = require('swagger-restify-express');
var logger = require('DVP-Common/LogHandler/CommonLogHandler.js').logger;
var aa = requre("./AutoAttendantHandler.js");

var port = config.Host.port || 3000;
var host = config.Host.vdomain || 'localhost';


var server = restify.createServer({
    name: "DVP Auto Attendant Service"
});

server.pre(restify.pre.userAgentConnection());
server.use(restify.bodyParser({ mapParams: false }));


//////////////////////////////Cloud API/////////////////////////////////////////////////////

server.post('/DVP/API/:version/AuttoAttendant', aa.CreateAutoAttendant);
server.get('/DVP/API/:version/AuttoAttendants', aa.CreateAutoAttendant);
server.get('/DVP/API/:version/AuttoAttendant/:name', aa.CreateAutoAttendant);
server.post('/DVP/API/:version/AuttoAttendant/:name/Greeting/:file', aa.AddGreeting);
server.post('/DVP/API/:version/AuttoAttendant/:name/Menue/:file', aa.AddGreeting);
server.post('/DVP/API/:version/AuttoAttendant/:name/Loop/:count', aa.AddGreeting);
server.post('/DVP/API/:version/AuttoAttendant/:name/Timeout/:sec', aa.AddGreeting);
server.post('/DVP/API/:version/AuttoAttendant/:name/EnableExtention/:status', aa.AddGreeting);
server.post('/DVP/API/:version/AuttoAttendant/:name/Action/:on', aa.AddGreeting);


var basepath = 'http://'+ host;
//var basepath = 'http://'+ "localhost"+":"+port;
//var basepath = 'http://duosoftware-dvp-clusterconfigu.104.131.90.110.xip.io';

sre.init(server, {
        resourceName : 'AutoAttendantService',
        server : 'restify', // or express
        httpMethods : ['GET', 'POST', 'PUT', 'DELETE'],
        basePath : basepath,
        ignorePaths : {
            GET : ['path1', 'path2'],
            POST : ['path1']
        }
    }
)

server.listen(port, function () {



    logger.info("DVP-AutoAttendantService.main Server %s listening at %s", server.name, server.url);
    //console.log('%s listening at %s', server.name, server.url);
});


