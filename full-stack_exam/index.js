'use strict';
/* Module dependencies */
require('dotenv').config();
var express = require('express');
var path = require('path');
var mysql = require('mysql');
exports = module.exports;
/* Exposing konzola */
exports.konzola = function (input) {
    console.log(input);
};
/* Exposing server initialization */
exports.serverInit = function (portNumber, staticFolder, expressApp, express) {
    expressApp.use("/" + staticFolder, express.static("" + staticFolder));
    expressApp.use(express.json());
    expressApp.use(express.urlencoded({ extended: true }));
    expressApp.listen(portNumber, function () {
        var welcomeMessages = ["What is thy bidding, my master?", "Haile Selassie!", "And The Lord said, let there be light\n    and there was light.", "Do or do not! There is no try.", "Blahblahblahblahblah", "Hello, Boss!", "FATAL ERROR!", "3,14"];
        var randomMessage = Math.floor(Math.random() * welcomeMessages.length);
        console.log("Server at localhost:" + portNumber);
        console.log("Initialized JSON and urlencoded parsers, static folder set to '/" + staticFolder + "'");
        console.log("" + welcomeMessages[randomMessage]);
    });
};
/* Exposing MySQL DB initializer, connector and error handler */
var MySQL = /** @class */ (function () {
    function MySQL(dbName) {
        this.dbName = dbName;
        this.okPacket = undefined;
        this.uniqueID = undefined;
        this.db = mysql.createConnection({
            host: process.env.DB_HOST,
            user: process.env.DB_USER,
            password: process.env.DB_PW,
            database: process.env.DB_NAME,
            rowsData: undefined
        });
    }
    MySQL.prototype.connect = function () {
        var _this = this;
        this.db.connect(function (error) {
            error ? console.log("Something prevents connection to " + _this.dbName + " DB :'(") :
                console.log("Connected to " + _this.dbName + " DB with great success! Keep it up, Boss!");
        });
    };
    MySQL.prototype.errorHandling = function (error, response) {
        error && error.errno === 1062 ?
            response.status(400).send("The ID is already taken, please provide another one!") :
            error ?
                (console.log(error),
                    response.status(500).send("The data query was unsuccessful due to internal server connection error. :'(")) :
                null;
    };
    ;
    MySQL.prototype.select = function (response, table, column) {
        var _this = this;
        this.db.query("SELECT " + column.join(',') + " FROM " + table, function (error, rows) {
            _this.errorHandling(error, response);
            _this.db.rowsData = rows;
        });
    };
    ;
    MySQL.prototype.insertAndReceive = function (response, targetTable, insertToColumns, selectColumns) {
        var _this = this;
        var valuesToInsert = [];
        for (var _i = 4; _i < arguments.length; _i++) {
            valuesToInsert[_i - 4] = arguments[_i];
        }
        valuesToInsert = valuesToInsert.map(function (value) { return value = "\"" + value + "\""; });
        this.db.query("INSERT INTO " + targetTable + " (" + insertToColumns.join(",") + ") VALUES (" + valuesToInsert.join(',') + ");", function (error, okPacket) {
            _this.okPacket = okPacket;
            _this.errorHandling(error, response);
            _this.okPacket !== undefined ?
                _this.db.query("SELECT COLUMN_NAME FROM INFORMATION_SCHEMA.COLUMNS WHERE TABLE_SCHEMA = \"" + _this.dbName + "\" AND TABLE_NAME = \"" + targetTable + "\" AND EXTRA = \"auto_increment\";", function (error, rows) {
                    _this.errorHandling(error, response);
                    _this.uniqueID = rows[0].COLUMN_NAME;
                    _this.db.query("SELECT " + selectColumns.join(',') + " FROM " + targetTable + " WHERE " + _this.uniqueID + " = \"" + _this.okPacket.insertId + "\";", function (error, rows) {
                        _this.errorHandling(error, response);
                        response.status(200).json(rows);
                    });
                }) : null;
        });
    };
    ;
    return MySQL;
}());
;
exports.mysqlPlus = MySQL;
