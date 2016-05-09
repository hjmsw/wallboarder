/**
 * Created by james on 21/04/2016.
 */

var chai = require('chai');
var chaiHttp = require('chai-http');
var server = require('../server');
var should = chai.should();

chai.use(chaiHttp);

describe('App', function() {
    
    it('should list ALL wallboards on /wb GET', function(done) {
        chai.request(server)
            .get('/wb')
            .end(function(err, res) {
                res.should.have.status(200);
                res.should.be.html;
                done();
            });
    });
    
    
});