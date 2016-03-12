//var Db = require('mongodb').Db;
//var Connection = require('mongodb').Connection;
//var Server = require('mongodb').Server;
//var BSON = require('mongodb').BSON;
//var ObjectID = require('mongodb').ObjectID;
//
//WallboardProvider = function(host, port) {
//  this.db= new Db('node-mongo-wallboarder', new Server(host, port, {auto_reconnect: true}, {}));
//  this.db.open(function(){});
//};
//
//WallboardProvider.prototype.getCollection= function(callback) {
//  this.db.collection('wallboards', function(error, wallboard_collection) {
//    if( error ) callback(error);
//    else callback(null, wallboard_collection);
//  });
//};
//
//WallboardProvider.prototype.save = function(wallboard, callback) {
//    this.getCollection(function(error, wallboard_collection) {
//      if( error ) callback(error)
//      else {
//        wallboard.created_at = new Date();
//
//        wallboard_collection.save(wallboard, function() {
//           callback(null, wallboard);
//        });
//      }
//    });
//};
//
//WallboardProvider.prototype.findOne = function(slug, callback ) {
//  this.getCollection(function(error, wallboard_collection) {
//    if( error ) callback(error);
//    else {
//      wallboard_collection.findOne({url_slug: slug},function(error, result) {
//        if(error) callback(error);
//        else callback(null, result)
//      });
//    }
//  });
//};
//
//WallboardProvider.prototype.findById = function(id, callback) {
//    this.getCollection(function(error, wallboard_collection) {
//      if( error ) callback(error);
//      else {
//        wallboard_collection.findOne({_id: wallboard_collection.db.bson_serializer.ObjectID.createFromHexString(id)}, function(error, result) {
//          if( error ) callback(error);
//          else callback(null, result)
//        });
//      }
//    });
//};
//
//exports.WallboardProvider = WallboardProvider;

var mongoose = require('mongoose');

var util = require('util');


WallboardProvider = function() {
  mongoose.connect('mongodb://localhost/node-mongo-wallboarder');

  var db = mongoose.connection;
  db.on('error', console.error.bind(console, 'connection error:'));
  db.once('open', function() {
    console.log("connect");


  });

};

//WallboardProvider.prototype.wallboardSchema = mongoose.Schema({
wallboardSchema = mongoose.Schema({
  title: String,
  url_slug: String,
  created_at: Date,
  elems: [
    {
      id: String,
      tagName: String,
      innerText: String,
      decoration: String,
      decorationStyle: [],
      contentStyle: [],
      headStyle: [],
      style: [],
      struct: {
        rows: []
      },
      tableEditColumns: {
        identifier: [],
        editable: []
      }
    }
  ]
});

WallboardProvider.prototype.wallboard = mongoose.model('wallboards', wallboardSchema);

WallboardProvider.prototype.findOne = function(slug, callback ) {
  this.wallboard.findOne({ 'url_slug': slug }, {}, { sort: { 'created_at' : -1 } }, function (err, result) {
    //console.log(util.inspect(result, false, null));
    if(err) callback(err);
    else callback(null, result)
  });
};

WallboardProvider.prototype.findOneWithDate = function(slug, datetime, callback ) {

  console.log(datetime);
  this.wallboard.findOne({ 'url_slug': slug, 'created_at':  datetime}, function (err, result) {
    //console.log(util.inspect(result, false, null));
    if(err) callback(err);
    else callback(null, result)
  });
};

WallboardProvider.prototype.save = function(wallboard, callback) {
  var self = this;

  var wb = new this.wallboard(wallboard);

  wb.created_at = new Date();

  wb.save(function(err, wb) {
    if (err) return console.error(err);
    else {
      console.log("save successful: " + wb.created_at);


      callback(null, wb);
    }
  });
};


WallboardProvider.prototype.find = function(slug, callback) {
  this.wallboard.find({ 'url_slug': slug }, function (err, wallboards) {
    if (err) return console.error(err);
    else {
      callback(null, wallboards);
    }
  });

};

exports.WallboardProvider = WallboardProvider;



