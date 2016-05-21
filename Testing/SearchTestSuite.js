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
var assert = require("assert")

chai.use(chaiHttp);

describe("API Test Suite", function() {
    var res;
    this.timeout(5000);
    it('getting data from API given valid keyword', function (done) {
        chai.request('http://api.eventful.com/jsonp/events/search?keywords=music&location=Boston&app_key=hPRCcBGTQJrVwC6K')
            .get("")
            .end(function (err, res)
            {
               res.should.have.status(200);
               var a = res.text
                a = JSON.parse(a)
                total = parseInt(a.total_items)
                expect(total).to.be.above(1)

                done()

                })

    })

    it('getting data from API given invalid keyword', function (done) {
        chai.request('http://api.eventful.com/jsonp/events/search?keywords=?&location=Boston&app_key=hPRCcBGTQJrVwC6K')
            .get("")
            .end(function (err, res)
            {
                res.should.have.status(200);
                var a = res.text
                a = JSON.parse(a)
                total = parseInt(a.total_items)
                expect(total).to.equal(0)

                done()

            })

    })
    })




