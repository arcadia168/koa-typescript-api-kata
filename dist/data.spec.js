"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var data = require("./data");
var chai = require("chai");
var sqlite3 = require("sqlite3");
var sinon_chai_1 = require("sinon-chai");
var sinon_1 = require("sinon");
chai.use(sinon_chai_1.sinonChai);
var SQLite = sqlite3.verbose();
var expect = chai.expect;
var sampleData = require('../sampleData.json');
describe('data', function () {
    it('initialize should import the data from the sampleData file', function (done) {
        data.initialize();
        data.connection.serialize(function () {
            data.connection.all('SELECT * FROM meter_reads ORDER BY cumulative', function (error, selectResult) {
                expect(error).to.be.null;
                expect(selectResult).to.have.length(sampleData.electricity.length);
                selectResult.forEach(function (row, index) {
                    expect(row.cumulative).to.equal(sampleData.electricity[index].cumulative);
                });
                done();
            });
        });
    });
    describe('When reading meter readings out of the database', function () {
        describe('When an error occurs attempting to read from the database', function () {
            beforeEach(function () {
                sinon_1.sinon.spy(console, 'error');
            });
            it('handles errors gracefully by logging them out', function () {
                sinon_1.sinon.stub(SQLite.Database.prototype, 'all', function (query, callback) {
                    // Immediately invoke the callback and throw an error to test error handling
                    var testReadError = new Error('this is a test .all error');
                    callback(testReadError, null);
                });
                data.getAllMeterReadings();
                sinon_1.sinon.assert.calledOnce(console.error);
            });
        });
        // it('reads all of the meter readings out of the database', done => {
        // data.connection.serialize(() => {
        //   data.connection.all(
        //     'SELECT * FROM meter_reads ORDER BY cumulative',
        //     (error, selectResult) => {
        //       expect(error).to.be.null;
        //       expect(selectResult).to.have.length(sampleData.electricity.length);
        //       selectResult.forEach((row, index) => {
        //         expect(row.cumulative).to.equal(
        //           sampleData.electricity[index].cumulative
        //         );
        //       });
        //       done();
        //     }
        //   );
        // });
        // });
    });
});
