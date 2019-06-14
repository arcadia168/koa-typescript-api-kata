"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var Koa = require("koa");
var bodyParser = require("koa-bodyparser");
var routes_1 = require("./routes");
var config_1 = require("./config");
var data_1 = require("./data");
function createServer() {
    var server = new Koa();
    server.use(bodyParser());
    server.use(routes_1.default.allowedMethods());
    server.use(routes_1.default.routes());
    return server;
}
exports.default = createServer;
if (!module.parent) {
    data_1.initialize();
    var server = createServer();
    server.listen(config_1.config.port, function () {
        console.log("server listening on port " + config_1.config.port);
    });
}
//# sourceMappingURL=server.js.map