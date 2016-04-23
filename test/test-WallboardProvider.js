var chai = require('chai');
var chaiHttp = require('chai-http');
var server = require('../server');
var should = chai.should();

chai.use(chaiHttp);
chai.use(require('chai-datetime'));

var config = require('../config/config');

var WallboardProvider = require('../providers/WallboardProvider').WallboardProvider;
WallboardProvider = new WallboardProvider(config.db);

describe('Wallboard Provider', function() {

    before(function() {
        var wb = [
            require('./files/wb-test2.json'),
            require('./files/wb-test1.json'),
            require('./files/wb-test.json')
        ];

        wb.forEach(function(i) {
            WallboardProvider.save(i, function(){

            });
        });

    });

    after(function() {
        WallboardProvider.deleteByUrl('mocha', function(error, numAffected) {

        });
    });


    describe('Model', function() {
       it('should return a list with each unique wallboard', function(done) {
           WallboardProvider.listWallboards(function(error, list) {
               should.not.exist(error);
               list[0].should.have.key._id;
               list[0].should.have.key.created_at;
               list[0].should.have.key.title;
               list[0].should.have.key.url_slug;

               done();
           });
       });

       it('should return the latest mocha test wallboard', function(done) {
           WallboardProvider.findOne('mocha', {}, function (error, wallboard) {
               should.not.exist(error);
               wallboard.title.should.equal('Unit Testing Wallboard');
               (Math.floor(new Date(wallboard.created_at).getTime() / 1000)).should.equal(1461274597);
               done();
           });
       });

       it('should return mocha test wallboard with given date', function(done) {

           var datetime = new Date(1461274597000);

           console.log(datetime);

           WallboardProvider.findOneWithDate('mocha', datetime, function (error, wallboard) {
               console.log([error, wallboard]);

               should.not.exist(error);
               wallboard.title.should.equal('Unit Testing Wallboard');



               done();
           });
       })
    });
});
