const Q           = require('q');
const config      = require('../../config');

// MongoDB connection information
var mongodbUrl = 'mongodb://' + config.mongodbHost.host + ':80/data';
var MongoClient = require('mongodb').MongoClient;

console.log(mongodbUrl);
var collectionNameIssues  = "issues";
var collectionNameMachines  = "machines";


exports.getIssueInfo = function (issueId, res,req) {
    MongoClient.connect(mongodbUrl, function (err, db) {
        var collection = db.collection(collectionNameIssues);
        collection.findOne({'issueId' : issueId})
            .then(function (result) {
                if (null != result) {
                    res.render('issueInfo',
                        {
                            "issueId": issueId,
                            "info": result
                        });
                }
            });
    });
};
exports.addIssueProblemInfo = function ( issueId, problemInformation, res,req) {
    var deferred = Q.defer();

    MongoClient.connect(mongodbUrl, function (err, db) {
        var collection = db.collection(collectionNameIssues);

        //check if username is already assigned in our database
        collection.findOne({'issueId' : issueId})
            .then(function (result) {
                if (null != result) {
                    console.log("issueId ALREADY EXISTS:", result.issueId);
                    deferred.resolve(false); // username exists
                }
                else  {
                    var issueInformation = {
                        "issueId": issueId,
                        "info": problemInformation,
                        "status": "OPEN"
                    }

                    console.log("CREATING problem:", issueId);
                    collection.insert(issueInformation)
                        .then(function () {
                            db.close();
                            deferred.resolve(issueInformation);
                        });
                }
            });
    });

    return deferred.promise;
};
exports.addIssueSolutionInfo = function (issueId, solutionInformation, res,req) {
    var deferred = Q.defer();

    MongoClient.connect(mongodbUrl, function (err, db) {
        var collection = db.collection(collectionNameIssues);

        //check if username is already assigned in our database
        collection.findOne({'issueId' : issueId})
            .then(function (result) {
                if (null != result)
                {
                    console.log("issueId  EXISTS:", result.issueId);

                    collection.update({'issueId' : issueId},
                        {$set : {
                            "info.solution": solutionInformation
                        }
                        },
                        {upsert:false})

                    deferred.resolve(true); // username exists
                }
                else
                {

                    console.log("issueId Not exists:", issueId);
                    deferred.resolve(false); // username not exists
                }
            });
    });

    return deferred.promise;
};
exports.updateIssueStatus = function ( issueId, status, res,req) {
    var deferred = Q.defer();

    MongoClient.connect(mongodbUrl, function (err, db) {
        var collection = db.collection(collectionNameIssues);

        //check if username is already assigned in our database
        collection.findOne({'issueId' : issueId})
            .then(function (result) {
                if (null != result)
                {
                    console.log("issueId  EXISTS:", result.issueId);

                    collection.update({'issueId' : issueId},
                        {$set : {
                            "status": status
                        }
                        },
                        {upsert:false})

                    deferred.resolve(true); // username exists
                }
                else
                {

                    console.log("issueId Not exists:", issueId);
                    deferred.resolve(false); // username not exists
                }
            });
    });

    return deferred.promise;
};
exports.getMachineInfo = function (machineId, res,req) {
    MongoClient.connect(mongodbUrl, function (err, db) {
        var collection = db.collection(collectionNameMachines);
        collection.findOne({'machineId' : machineId})
            .then(function (result) {
                if (null != result) {
                    res.render('issueInfo',
                        {
                            "machineId": machineId,
                            "info": result
                        });
                }
            });
    });
};
exports.getIssuesList = function (res,req) {
    var deferred = Q.defer();
    var dataAll = [];
    MongoClient.connect(mongodbUrl, function (err, db) {
        if(err)
        {
            console.log(err);
            deferred.resolve(false);
        }
        else {
            var collection = db.collection(collectionNameIssues);
            collection.find({}).toArray(function (err, issues) {
                deferred.resolve(issues);
            });
        }
    });
    return deferred.promise;
};