"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var Koa = require("koa");
var index_1 = require("./index");
var chai_1 = require("chai");
describe('index', function () {
    it('should create an instance of a Koa server', function () {
        var instance = index_1.default();
        chai_1.expect(instance).to.be.instanceof(Koa);
    });
    it('should retrieve a list of meter readings from the database', function () {
        var instance = index_1.default();
        //Retrieve list of all readings from the databse.
        // Make a GET request to the /readings endpoint.
    });
    // it('should add a new meter reading that gets stored in the database', () => {
    // });
});
