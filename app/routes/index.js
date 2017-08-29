const express                  = require('express');
const router                   = express.Router();
const request                   = require('request-promise');
const UAAClient                 = require('predix-uaa-client');
const functions                 = require('../functions');
//===============ROUTES=================
//displays our homepage



// TODO: Set these values
const UAA_URL = process.env.uaaUrl || 'https://6a1e5ff3-ab32-45b4-bf67-4548a9c2efdb.predix-uaa.run.aws-usw02-pr.ice.predix.io/oauth/token';
const CLIENT_ID = process.env.clientId || 'timeseries_client_readonly';
const CLIENT_SECRET = 'secret';
const TS_ZONE_ID = process.env.zoneId ||'067e39c4-de83-40e2-b966-2f83ea5fc292';



/*
if (process.env.https_proxy) {
    const proxy = url.parse(process.env.https_proxy);
    const tunnelingAgent = require('tunnel').httpsOverHttp({
        proxy: {
            host: proxy.hostname,
            port: proxy.port
        }
    });

    console.log('Using proxy', proxy);
    requestOptions.agent = tunnelingAgent;
}
*/

router.get('/getform', function(req, res){
    res.render('form', { layout: 'temp' });
});
router.get('/', function(req, res){
    res.send("inside router");
});
router.get('/getTopTags',function(req,res){

    const rawBody = {
        "start": 1427463525000,
        "end": Date.now(),
        "tags": [{
            "name": "unternehmer-3dprinters-IRMSA",
            "limit": 20,
            "order": "desc"

        }]
    };

    UAAClient.getToken(UAA_URL, CLIENT_ID, CLIENT_SECRET).then(token => {
        request({
                    headers: {
                        'Content-Type': 'application/json',
                        'Authorization': 'Bearer ' + token.access_token,
                        'Predix-Zone-Id': TS_ZONE_ID
                        },
                    uri: 'https://time-series-store-predix.run.aws-usw02-pr.ice.predix.io/v1/datapoints',
                    body: rawBody,
                    method: 'POST',
                    json: true
                }).then(data => {
        console.log(JSON.stringify(data));
                    res.send(data);
}).catch(err => {
        console.log('Error:', err);
});

}).catch((err) => {
    console.error('Error getting token', err);
});});

router.get('/getAllTags',function(req,res){

    UAAClient.getToken(UAA_URL, CLIENT_ID, CLIENT_SECRET).then(token => {
        request({
                    headers: {
                        'Content-Type': 'application/json',
                        'Authorization': 'Bearer ' + token.access_token,
        'Predix-Zone-Id': TS_ZONE_ID
},
    uri:  'https://time-series-store-predix.run.aws-usw02-pr.ice.predix.io/v1/'+ 'tags',
        method: 'get',
        json: true
}).then(data => {
    console.log(data);
    res.send(data);
}).catch(err => {
        console.log('Error:', err);
});

}).catch((err) => {
        console.error('Error getting token', err);
});});

router.post('/getTopTagspost',function(req,res){

    const rawBody = {
        "start": ""+req.body.time,
        "end": Date.now(),
        "tags": [{
            "name": req.body.tag,
            "limit": req.body.num
            //"order": "desc",
            /*"aggregations": [
                {
                    "type": "avg",
                    "sampling": {
                        "unit": "d",
                        "value": "1"
                    }
                }
            ]*/
        }]
    };

    UAAClient.getToken(UAA_URL, CLIENT_ID, CLIENT_SECRET).then(token => {
        request({
                    headers: {
                        'Content-Type': 'application/json',
                        'Authorization': 'Bearer ' + token.access_token,
        'Predix-Zone-Id': TS_ZONE_ID
},
    uri: 'https://time-series-store-predix.run.aws-usw02-pr.ice.predix.io/v1/' + 'datapoints',
        body: rawBody,
        method: 'POST',
        json: true
}).then(data => {
        /* var arr =[];
         var time = [];
             console.log(JSON.stringify(data));
             for(i=0;i<data.tags[0].results[0].values.length; i++)
             {
                 arr.push(data.tags[0].results[0].values[i][1]);
                 time.push(data.tags[0].results[0].values[i][0])
             }

             console.log(arr);
         data.tags[0].results[0].values2 = [];
         var forecast = require('nostradamus')
             , alpha = 0.4  // overall smoothing component
             , beta = 0.4   // trend smoothing component
             , gamma = 0.6  // seasonal smoothing component
             , period = 5   // # of observations per season
             , m = 5        // # of future observations to forecast
             , predictions = []
             , pred = [];

         predictions= forecast(arr, alpha, beta, gamma, period, m);
         pred= forecast(time, alpha, beta, gamma, period, m)

         console.log(predictions);
         console.log(pred);
         var values = [];
         for(i=0;i<data.tags[0].results[0].values.length; i++)
         {
             if(pred[i] == 0) continue;
             var set = [pred[i], predictions[i] ];
             values.push(set);
         }
         data.tags[0].results[0].values2 = values;*/
        res.send(data);
}).catch(err => {
        console.log('Error:', err);
});

}).catch((err) => {
        console.error('Error getting token', err);
});});

router.post('/getCurrentData3DPrinter',function(req,res){


    const rawBody = {
        "start": ""+req.body.time,
        "end": Date.now(),
        "tags": [{
            "name": "unternehmer-3dprinters-"+ 'PF' + req.body.printerNumber,
            "limit": "1",
            "order": "desc"
            // "aggregations":[{"type":"interpolate","interval":"1h"}]
        },
            {
                "name": "unternehmer-3dprinters-"+ 'IRMS' + req.body.printerNumber,
                "limit": "1",
                "order": "desc"
                // "aggregations":[{"type":"interpolate","interval":"1h"}]
            },
            {
                "name": "unternehmer-3dprinters-"+ 'VAR' + req.body.printerNumber,
                "limit": "1",
                "order": "desc"
                // "aggregations":[{"type":"interpolate","interval":"1h"}]
            }]
    };
    console.log(rawBody);
    UAAClient.getToken(UAA_URL, CLIENT_ID, CLIENT_SECRET).then(token => {
        request({
                    headers: {
                        'Content-Type': 'application/json',
                        'Authorization': 'Bearer ' + token.access_token,
        'Predix-Zone-Id': TS_ZONE_ID
},
    uri: 'https://time-series-store-predix.run.aws-usw02-pr.ice.predix.io/v1/' + 'datapoints',
        body: rawBody,
        method: 'POST',
        json: true
}).then(data => {
        console.log(JSON.stringify(data));
    res.send(data);
}).catch(err => {
        console.log('Error:', err);
});

}).catch((err) => {
        console.error('Error getting token', err);
});});
router.post('/get3dPrinterData',function(req,res){

    var unit="";
    var value="";
    if(req.body.time == '1d-ago')
    {
        unit="h";
        value="1";
    }
    else if(req.body.time == '1w-ago')
    {
        unit="d";
        value="1";
    }
    else
    {
        unit="d";
        value="1";
    }
    const rawBody = {
        "start": ""+req.body.time,
        //"end": Date.now(),
        "tags": [{
            "name": "unternehmer-3dprinters-"+ 'PF' + req.body.printerNumber,
            //"limit": "10",
            //"order": "desc"
            "aggregations": [
                {
                    "type": "avg",
                    "sampling": {
                        "unit": unit,
                        "value": value
                    }
                }
            ]
        },
            {
                "name": "unternehmer-3dprinters-"+ 'IRMS' + req.body.printerNumber,
                //"limit": "10",
                //"order": "desc"
                "aggregations": [
                    {
                        "type": "avg",
                        "sampling": {
                            "unit": unit,
                            "value": value
                        }
                    }
                ]
            },
            {
                "name": "unternehmer-3dprinters-"+ 'VAR' + req.body.printerNumber,
                //"limit": "10",
                "aggregations": [
                    {
                        "type": "avg",
                        "sampling": {
                            "unit": unit,
                            "value": value
                        }
                    }
                ]
                // "aggregations":[{"type":"interpolate","interval":"1h"}]
            },
            {
                "name": "unternehmer-3dprinters-"+ 'WATT' + req.body.printerNumber,
                //"limit": "10",
                //"order": "desc"
                "aggregations": [
                    {
                        "type": "avg",
                        "sampling": {
                            "unit": unit,
                            "value": value
                        }
                    }
                ]
            },
            {
                "name": "unternehmer-3dprinters-"+ 'VA' + req.body.printerNumber,
                //"limit": "10",
                //"order": "desc"
                "aggregations": [
                    {
                        "type": "avg",
                        "sampling": {
                            "unit": unit,
                            "value": value
                        }
                    }
                ]
            },
            {
                "name": "unternehmer-3dprinters-"+ 'WATTHR' + req.body.printerNumber,
                //"limit": "10",
                //"order": "desc"
                "aggregations": [
                    {
                        "type": "avg",
                        "sampling": {
                            "unit": unit,
                            "value": value
                        }
                    }
                ]
            },
            {
                "name": "unternehmer-3dprinters-"+ 'VAHR' + req.body.printerNumber,
                //"limit": "10",
                //"order": "desc"
                "aggregations": [
                    {
                        "type": "avg",
                        "sampling": {
                            "unit": unit,
                            "value": value
                        }
                    }
                ]
            }]
    };
    console.log(rawBody);
    UAAClient.getToken(UAA_URL, CLIENT_ID, CLIENT_SECRET).then(token => {
        request({
                    headers: {
                        'Content-Type': 'application/json',
                        'Authorization': 'Bearer ' + token.access_token,
        'Predix-Zone-Id': TS_ZONE_ID
},
    uri: 'https://time-series-store-predix.run.aws-usw02-pr.ice.predix.io/v1/' + 'datapoints',
        body: rawBody,
        method: 'POST',
        json: true
}).then(data => {
        console.log(JSON.stringify(data));
    res.send(data);
}).catch(err => {
        console.log('Error:', err);
});

}).catch((err) => {
        console.error('Error getting token', err);
});});

router.post('/addIssueProblemInformation', function(req, res) {
    var uniqueId = Math.floor((Math.random() * 100000) + 1) + "machine";

    functions.addIssueProblemInfo(uniqueId, req.body, res,req)
        .then(function (issueInformation) {
            if(issueInformation) {
                res.send(true);
            }
            else {
                res.send(false);
            }
        });
});
router.post('/addIssueSolutionInformation', function(req, res) {
    functions.addIssueSolutionInfo(req.body.issueId, req.body.solution, res,req)
        .then(function (added) {
            if(added)
            {
                res.send("Added solution Information");
            }
            else
            {
                res.send("some error while adding solution");
            }
        });
});
router.post('/updateIssueStatusInformation', function(req, res) {
    functions.updateIssueStatus(req.body.issueId, req.body.status, res,req)
        .then(function (added) {
            if(added)
            {
                res.send("updated status Information");
            }
            else
            {
                res.send("some error while updating status Information");
            }
        });
});
router.post('/getIssueInformation', function(req, res) {
    //console.log("post query "+ req.body.name);
    var issueId = req.body.issueId;
    functions.getIssueInfo(issueId, res,req)
        .then(function (issueInfo) {
            if(issueInfo) {
                res.send(issueInfo);
            }
            else {
                res.send("some error while getting issue Information");
            }
        });
});
router.post('/getMachineInformation', function(req, res) {
    //console.log("post query "+ req.body.name);
    var machineId = req.body.machineId;
    functions.getMachineInfo(machineId, res,req)
        .then(function (machineInfo) {
            if(issueInfo) {
                res.send(machineInfo);
            }
            else {
                res.send("some error while getting machine Information");
            }
        });
});
router.get('/allIssuesList', function(req, res) {
    var issueId = req.body.issueId;
    functions.getIssuesList(res,req)
        .then(function (issues) {
            if(issues) {
                res.send(issues);
            }
            else {
                res.send("some error while getting issues list");
            }
        });
});
module.exports = router;