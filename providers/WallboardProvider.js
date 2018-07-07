var mongoose = require('mongoose');

var util = require('util');


WallboardProvider = function(uri) {
  mongoose.connect(uri);

  var db = mongoose.connection;
  db.on('error', console.error.bind(console, 'connection error:'));

};

wallboardSchema = mongoose.Schema({
  title: String,
  url_slug: String,
  created_at: Date,
  autoLayout: Boolean,
  classes: String,
  css: {
    attributes: {},
    children: {}
  },
  elems: [
    {
      id: String,
      title: String,
      tagName: String,
      innerText: String,
      src: String,
      decoration: String,
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

WallboardProvider.prototype.findOne = function(slug, projection, callback ) {
  this.wallboard.findOne({ 'url_slug': slug }, projection, { sort: { 'created_at' : -1 } }, function (err, result) {
    //console.log(util.inspect(result, false, null));
    if(err) callback(err);
    else callback(null, result)
  });
};

WallboardProvider.prototype.findOneWithDate = function(slug, datetime, callback ) {

  this.wallboard.findOne({ 'url_slug': slug, 'created_at':  datetime}, function (err, result) {
    //console.log(util.inspect(result, false, null));
    if(err) callback(err);
    else callback(null, result)
  });
};

WallboardProvider.prototype.save = function(wallboard, callback) {
  // console.log(wallboard);
  var self = this;

  var wb = new this.wallboard(wallboard);

  if (!wb.created_at) wb.created_at = new Date();

  wb.save(function(err, wb) {
    if (err) return console.error(err);
    else {
      callback(null, wb);
    }
  });
};


WallboardProvider.prototype.find = function(slug, callback) {
  this.wallboard.find({ 'url_slug': slug }, {}, { sort: { 'created_at' : -1 }, limit: 50}, function (err, wallboards) {
    if (err) return console.error(err);
    else {
      callback(null, wallboards);
    }
  });

};

WallboardProvider.prototype.listWallboards = function(callback) {
  var self = this;

  self.wallboard.count(function(err, result) {
    if (result === 0) {
      callback('Empty collection', null);
    }
  });

  self.wallboard.distinct('url_slug', function(err, result) {
    if (err) {
      callback(err, null);
    } else {

      var wbList = [];

      result.forEach(function(elem) {
        self.findOne(elem, {title: 1, url_slug: 1, created_at: 1}, function(err, wallboard) {
          if (err) console.log(err);
          else {
            wbList.push(wallboard);
            if (result.length === wbList.length) callback(null, wbList);
          }
        });
      });
    }
  });
};

WallboardProvider.prototype.deleteByUrl = function(url_slug, callback) {
  this.wallboard.remove({ url_slug: url_slug }, function(err, result) {
    if (err) callback(err, null);
    else callback(null, result);
  });
};

WallboardProvider.prototype.convertLegacyRoutes = function(callback) {
  this.wallboard.update({ url_slug: '/' }, { $set: { url_slug: 'default' }}, { multi: true }, function(err, numAffected) {
    if (err) callback(err, null);
    else callback(null, numAffected);
  });
};

exports.WallboardProvider = WallboardProvider;



