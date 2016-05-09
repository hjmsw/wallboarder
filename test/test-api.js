/**
 * Created by james on 21/04/2016.
 */

var chai = require('chai');
var chaiHttp = require('chai-http');
var server = require('../server');
var should = chai.should();

chai.use(chaiHttp);

describe('API', function() {

    before(function() {
        var wb = require('./files/wb-test.json');

        chai.request(server)
            .post('/api/v1/upsert')
            .send(wb)
            .end(function(err, res) {
               res.should.have.status(200);
            });

    });

    after(function() {
        // runs after all tests in this block
    });


    describe('GET /wb', function() {
        it('should list ALL wallboards on /wb GET', function(done) {
            chai.request(server)
                .get('/api/v1/wb')
                .end(function(err, res) {
                    res.should.have.status(200);
                    res.should.be.json;
                    res.body[0].should.have.key._id;
                    res.body[0].should.have.key.created_at;
                    res.body[0].should.have.key.title;
                    res.body[0].should.have.key.url_slug;
                    done();
                });
        });
    });

    describe('GET /wb/:url_slug', function() {
        it('should get mocha test wallboard on /wb/mocha GET', function(done) {
            chai.request(server)
                .get('/api/v1/wb/mocha')
                .end(function(err, res) {
                    res.should.have.status(200);
                    res.should.be.json;
                    res.body.should.have.key.elems;
                    res.body.title.should.equal('Unit Testing Wallboard');
                    done();
                });
        });

        it('should fail on getting mocha2 test wallboard on /wb/mocha2 GET', function(done) {
            chai.request(server)
                .get('/api/v1/wb/mocha2')
                .end(function(err, res) {
                    // res.should.have.status(404);
                    // res.should.be.json;
                    done();
                });
        });
    });


});
