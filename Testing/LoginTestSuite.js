/**
 * Created by Sandeep on 12/1/2015.
 */
process.env.NODE_ENV = 'test';

var chai = require('chai');
var chaiHttp = require('chai-http');
var UserModule = require('../server');
var should = chai.should();
var expect = require('expect.js');
var mongoose=require('mongoose');

chai.use(chaiHttp);



describe('Login Test Suite', function() {
    it('User should be logged in with correct username and password combination', function (done) {


        chai.request(UserModule)
            .post('/login')
            .send({'username': 'lucky005@gmail.com', 'password': 'abcd1234'})
            .end(function (err, res) {

                expect(err).to.eql(null)
                res.should.have.status(200);
                done();
            });
    });


    it('Unauthorized users cannot be logged in', function (done) {

        chai.request(UserModule)
            .post('/login')
            .send({'username': 'lucky005aa@gmail.com', 'password': 'abcd1234'})
            .end(function (err, res) {
                console.log(res);
                expect(err).to.eql(null)

                res.should.have.status(401);
                done();
            });
    });
});


