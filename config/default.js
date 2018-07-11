module.exports = {
    "DB": {
        "Type":"postgres",
        "User":"",
        "Password":"1234",
        "Port":5432,
        "Host":"",
        "Database":"" 
    },



    "Redis":
    {
        "ip": "",
        "port": 6389,
        "user": "",
        "password": "",
        "mode":"sentinel",
        "sentinels":{
            "hosts": "",
            "port":16389,
            "name":"redis-cluster"
        }

    },


    "Security":
    {
        "ip" : "",
        "port": 6389,
        "user": "",
        "password": "",
        "mode":"sentinel",
        "sentinels":{
            "hosts": "",
            "port":16389,
            "name":"redis-cluster"
        }
    },

    "Host":
    {
        "vdomain": "localhost",
        "domain": "localhost",
        "port": "4445",
        "version": "1.0"
    },

    "LBServer" : {

        "ip": "localhost",
        "port": "4445"

    }
};
