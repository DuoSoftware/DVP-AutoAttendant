
var restify = require('restify');
var sre = require('swagger-restify-express');
var logger = require('dvp-common/LogHandler/CommonLogHandler.js').logger;
var aa = require("./AutoAttendantHandler.js");
var as = require("./AutoAttendantServer.js");
var config = require('config');
var esl = require('modesl');

var port = config.Host.port || 3000;
var host = config.Host.vdomain || 'localhost';


var server = restify.createServer({
    name: "DVP Auto Attendant Service"
});

server.pre(restify.pre.userAgentConnection());
server.use(restify.bodyParser({ mapParams: false }));


//////////////////////////////Cloud API/////////////////////////////////////////////////////

server.post('/DVP/API/:version/AuttoAttendant', aa.CreateAutoAttendant);
server.get('/DVP/API/:version/AuttoAttendants', aa.GetAttendants);
server.get('/DVP/API/:version/AuttoAttendant/:name', aa.GetAttendantByName);
server.del('/DVP/API/:version/AuttoAttendant/:name', aa.RemoveAutoAttendent);
server.post('/DVP/API/:version/AuttoAttendant/:name/DayGreeting/:file', aa.SetDayGreetingFile);
server.post('/DVP/API/:version/AuttoAttendant/:name/NightGreeting/:file', aa.SetNightGreetingFile);
server.post('/DVP/API/:version/AuttoAttendant/:name/Menue/:file', aa.SetMenue);
server.post('/DVP/API/:version/AuttoAttendant/:name/Loop/:count', aa.SetLoopCount);
server.post('/DVP/API/:version/AuttoAttendant/:name/Timeout/:sec', aa.SetTimeout);
server.post('/DVP/API/:version/AuttoAttendant/:name/EnableExtention/:status', aa.SetExtensionDialing);
server.post('/DVP/API/:version/AuttoAttendant/:name/Action/:on', aa.SetAction);
//server.del('/DVP/API/:version/AuttoAttendant/:name/Action/:on', aa.RemoveAction);


//var basepath = 'http://'+ host;
var basepath = 'http://'+ "localhost"+":"+port;
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



var esl_server = new esl.Server({port: 8084, myevents:true}, function() {
    console.log("esl server is up");
});



esl_server.on('connection::ready', function(conn, id) {
    console.log('new call ' + id);

    var idx = conn.getInfo().getHeader('Unique-ID');
    var from = conn.getInfo().getHeader('Caller-Caller-ID-Number');
    var to = conn.getInfo().getHeader('Caller-Destination-Number');
    var direction = conn.getInfo().getHeader('Call-Direction');
    var channelstatus = conn.getInfo().getHeader('Answer-State');
    var fsid = conn.getInfo().getHeader('Core-UUID');
    var fsHost = conn.getInfo().getHeader('FreeSWITCH-Hostname');
    var fsName = conn.getInfo().getHeader('FreeSWITCH-Switchname');
    var fsIP = conn.getInfo().getHeader('FreeSWITCH-IPv4');





    conn.call_start = new Date().getTime();

    conn.execute('answer');
    conn.execute('echo', function(){
        console.log('echoing');
    });


    conn.on('esl::end', function(evt, body) {
        this.call_end = new Date().getTime();
        var delta = (this.call_end - this.call_start) / 1000;
        console.log("Call duration " + delta + " seconds");
    });
});


server.listen(port, function () {



    logger.info("DVP-AutoAttendantService.main Server %s listening at %s", server.name, server.url);
    //console.log('%s listening at %s', server.name, server.url);
});


as.GetAutoAttendant("1111",1,3,function(data){})
