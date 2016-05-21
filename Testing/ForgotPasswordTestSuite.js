/**
 * Created by Sandeep on 12/1/2015.
 */
//process.env.NODE_ENV = 'test';

var chai = require('chai');
var chaiHttp = require('chai-http');
var UserModule = require('../server');
var should = chai.should();
var expect = require('expect.js');
var mongoose=require('mongoose');
chai.use(chaiHttp);


describe('Forgot Password Test Suite', function() {

    this.timeout(5000);


    it('Should give error if there is no profile associated with that account', function (done) {
        chai.request(UserModule)
            .post('/forgetPass')
            .send({lost_email: "random123@gmail.com"})
            .end(function (err, res) {
                expect(err).to.eql(null)
                res.should.have.status(200);
                res.text.should.equal('error');
                done();
            });
    });

    it('Forgot password should work fine for valid user', function (done) {
        chai.request(UserModule)
            .post('/forgetPass')
            .send({lost_email: "lagisetty.s@husky.neu.edu"})
            .end(function (err, res) {
                expect(err).to.eql(null)
                res.should.have.status(200);
                res.body.should.have.property('message');
                res.body.should.have.property('messageId');
                done();
            });
    });

});


