/**
 * Created by Sandeep on 12/4/2015.
 */
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


describe('Admin Test Suite', function() {


    it('Should Get All User Profiles', function (done) {


        chai.request(UserModule)
            .post('/getProfiles')
            .send()

            .end(function (err, res) {
                expect(err).to.eql(null)
                res.should.have.status(200);
                temp = res.text;
                count = temp.length
                expect(count).to.be.above(0);

                done();
            });
    });

    it('should delete given user', function (done) {

        var email='asha@gmail.com';

        chai.request(UserModule)
            .post('/deleteUser')
            .send({'email': email})
            .end(function (err, res)
            {
                expect(err).to.eql(null);
                a = res.text;
                a = JSON.parse(a);
                changed = a.ok;
                expect(changed).to.equal(1);

                done();
            });
    });

});



