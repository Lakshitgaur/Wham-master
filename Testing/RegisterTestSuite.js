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


describe('Register Test Suite', function() {
    this.timeout(50000)

    it('New User should be able to register', function (done) {
        chai.request(UserModule)
            .post('/register')
            .send({
                'firstName': 'lucky1',
                'lastName': 'lucky1',
                'email': 'Patrioats@gmail.com',
                'year_of_birth': 1970,
                gender: 'Male',
                password: 'abcd1234',
                prefFlag: false,
                preferences: {type: Array, "default": ['sport']},
            })
            .end(function (err, res) {
                expect(err).to.eql(null)
                res.should.have.status(200);
                res.body.should.have.property('firstName');
                res.body.should.have.property('lastName');
                res.body.should.have.property('email');
                res.body.should.have.property('year_of_birth');
                res.body.email.should.equal('Patrioats@gmail.com');
                done();

            });
    });

    it("Should not add a user who is already present", function (done) {
        chai.request(UserModule)
            .post('/register')
            .send({
                'firstName': 'lucky1',
                'lastName': 'lucky1',
                'email': 'luck5y0050@gmail.com',
                'year_of_birth': 1970,
                gender: 'Male',
                password: 'abcd1234',
                prefFlag: false,
                preferences: {type: Array, "default": []},
            })
            .end(function (err, res) {
                expect(err).to.eql(null)
                res.should.have.status(200);
                res.text.should.equal("\"A user exists with this email id.\"");
                done();

            });

    });

});