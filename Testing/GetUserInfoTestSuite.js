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



describe('Get User Info Test Suite', function() {
    it('Should retrieve user info based on his email', function (done) {

        var email='lucky005@gmail.com';
        chai.request(UserModule)
            .get('/getUserInfo/'+email)
            .end(function (err, res)
            {

                expect(err).to.eql(null);
                res.should.have.status(200);
                res.body.should.have.property('firstName');
                res.body.should.have.property('lastName');
                res.body.should.have.property('email');
                res.body.should.have.property('yob');
                res.body.email.should.equal('lucky005@gmail.com');

                done();
            });
    });

    it('Should display an error if there is no account registered with that email', function (done) {

        var email='luckaaay005@gmail.com';
        chai.request(UserModule)
            .get('/getUserInfo/'+email)
            .end(function (err, res)
            {
                expect(err).to.eql(null);
                res.text.should.equal('error');
                done();
            });
    });


});



