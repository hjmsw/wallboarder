var Db = require('mongodb').Db;
var Connection = require('mongodb').Connection;
var Server = require('mongodb').Server;
var BSON = require('mongodb').BSON;
var ObjectID = require('mongodb').ObjectID;

WallboardProvider = function(host, port) {
  this.db= new Db('node-mongo-wallboarder', new Server(host, port, {auto_reconnect: true}, {}));
  this.db.open(function(){});
};

WallboardProvider.prototype.getCollection= function(callback) {
  this.db.collection('wallboards', function(error, wallboard_collection) {
    if( error ) callback(error);
    else callback(null, wallboard_collection);
  });
};

WallboardProvider.prototype.save = function(wallboard, callback) {
    this.getCollection(function(error, wallboard_collection) {
      if( error ) callback(error)
      else {
        wallboard.created_at = new Date();

        wallboard_collection.save(wallboard, function() {
           callback(null, wallboard);
        });
      }
    });
};

WallboardProvider.prototype.findOne = function(callback ) {
  this.getCollection(function(error, wallboard_collection) {
    if( error ) callback(error)
    else {
      wallboard_collection.findOne(function(error, result) {
        if(error) callback(error)
        else callback(null, result)
      });
    }
  });
};

WallboardProvider.prototype.findById = function(id, callback) {
    this.getCollection(function(error, wallboard_collection) {
      if( error ) callback(error)
      else {
        wallboard_collection.findOne({_id: wallboard_collection.db.bson_serializer.ObjectID.createFromHexString(id)}, function(error, result) {
          if( error ) callback(error)
          else callback(null, result)
        });
      }
    });
};

exports.WallboardProvider = WallboardProvider;
