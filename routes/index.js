var express = require('express');
var router = express.Router();
var assert = require('assert');
const MongoClient = require('mongodb').MongoClient;
const client = new MongoClient(url);
const dbName = 'climbing-app';

var url = 'mongodb://localhost:27017'

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index', { title: 'Express' });
});

//GET Climbing Logs from MongoDB

router.get('/get-log', function(req, res, next){
  var resultArray = [];
  MongoClient.connect(url, function(err, client){
    assert.equal(null, err);
    const db = client.db(dbName);
    var cursor = db.collection('sessions').find();
    cursor.forEach(function(doc, err) {
        assert.equal(null, err);
        resultArray.push(doc);
    }, function(){
      client.close();
      res.send(resultArray)
    });
  });
});

//Post Session to DB
router.post('/insert', function(req, res, next) {
  var item = {
    date: req.body.date,
    routes: req.body.routes
  }
  MongoClient.connect(url, function(err, client){
    assert.equal(null, err);
    const db = client.db(dbName);
    db.collection('sessions').insertOne(item, function(err, result){
      assert.equal(null, err);
      client.close();
    });
  });
  res.send().status(200);
});



module.exports = router;
