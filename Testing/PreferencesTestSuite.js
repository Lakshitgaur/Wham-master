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


describe('Preferences Test Suite', function() {



    it('should Update or insert preferences', function (done) {

        var email='asha@gmail.com';
        chai.request(UserModule)
            .post('/updatePreferences')
            .send({'username': email, 'preference': ['food','sports']})

            .end(function (err, res)
            {
                expect(err).to.eql(null)
                res.should.have.status(200);
                res.text.should.equal('success');
                done();
            });
    });

    it('should retrieve preferences based on user', function (done) {

        var email='asha@gmail.com';
        var pref = [ 'food', 'sports' ]
        chai.request(UserModule)
            .post('/getPreferences')
            .send({'username': email})
            .end(function (err, res)
            {
                expect(err).to.eql(null);
                res.should.have.status(200);
                res.body.should.have.property('preferences');
                res.body.preferences.should.deep.equal(pref);

                done();
            });
    });


    it('Prefernce Flag of logged in user should be True', function (done) {

        var email='asha@gmail.com';
        chai.request(UserModule)
            .post('/getPreferences')
            .send({'username': email})

            .end(function (err, res)
            {
                expect(err).to.eql(null);
                res.should.have.status(200);
                res.body.should.have.property('prefFlag');
                res.body.prefFlag.should.equal(true);

                done();
            });
    });

});
