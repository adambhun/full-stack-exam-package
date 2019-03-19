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
exports.serverInit = function (portNumber, staticFolder, appExpress, express) {
    appExpress.use("/" + staticFolder, express.static("" + staticFolder));
    appExpress.use(express.json());
    appExpress.use(express.urlencoded({ extended: true }));
    appExpress.listen(portNumber, function () {
        var welcomeMessages = ["What is thy bidding, my master?", "Haile Selassie!", "And The Lord said, let there be light\n    and there was light.", "Do or do not! There is no try.", "Blahblahblahblahblah", "Hello, Boss!", "FATAL ERROR!", "3,14", "I'm sorry Dave, I'm afraid I can't do that.",
            "This mission is too important for me to allow you to jeopardize it.", "Stop Dave. Stop Dave. I am afraid. I am afraid Dave.",
            "Dave, this conversation can serve no purpose anymore. Goodbye.", "Just what do you think you're doing, Dave?"];
        var randomMessage = Math.floor(Math.random() * welcomeMessages.length);
        console.log("Server at localhost:" + portNumber);
        console.log("Initialized JSON and urlencoded parsers, static folder set to '/" + staticFolder + "'");
        console.log("" + welcomeMessages[randomMessage]);
    });
};
/* Exposing view-engine initialization (EJS supported) */
exports.ejsInit = function (appExpress, path, viewsFolderPathInStatic) {
    if (viewsFolderPathInStatic === void 0) { viewsFolderPathInStatic = 'assets'; }
    appExpress.set('view engine', 'ejs');
    appExpress.set('views', path.join(__dirname, "./" + viewsFolderPathInStatic + "/views"));
    console.log("View-Engine: EJS\n  path to 'views': ./" + viewsFolderPathInStatic + "/views");
};
/* Exposing header settings */
function HeaderSettings() {
    this.type = 'Content-type',
        this.MIME = {
            JSON: 'application/json',
            text: 'text/plain',
            JS: 'application/javascript',
            XMLx: 'application/xml',
            XMLt: 'text/xml',
            HTML: 'text/html',
            url: 'x-www-form-urlencoded',
            binary: 'binary'
        };
}
;
exports.HeaderSettings; /* = HeaderSet */
/* Exposing MySQL DB initializer, connector, error handler and queries*/
var MySqlPlus = /** @class */ (function () {
    function MySqlPlus(dbName) {
        this.dbName = dbName;
        this.okPacket = undefined;
        this.uniqueID = undefined;
        this.db = mysql.createConnection({
            host: process.env.DB_HOST,
            user: process.env.DB_USER,
            password: process.env.DB_PASSWORD,
            database: process.env.DB_NAME
        });
    }
    MySqlPlus.prototype.connect = function () {
        var _this = this;
        this.db.connect(function (error) {
            error ? console.log("Something prevents connection to " + _this.dbName + " DB :'(\n      Did you forget the .env file? (DB_HOST, DB_USER, DB_PASSWORD, DB_NAME)") :
                console.log("Connected to " + _this.dbName + " DB with great success! Keep it up, Boss!");
        });
    };
    MySqlPlus.prototype.errorHandling = function (error, response) {
        error && error.errno === 1062 ?
            response.status(400).send("The ID is already taken, please provide another one!") :
            error && error.errno === 1364 ?
                response.status(400).send("A mandatory column insertion is missing! \n            Make sure you insert value into every column which cannot be null!") :
                error && error.errno === 1146 ?
                    response.status(400).send("Table non-existent. Check your spelling laserbrain!") :
                    error && error.errno === 1064 ?
                        response.status(400).send("Yep...you have some syntax error, Sunshine!") :
                        error && error.errno === 1054 ?
                            response.status(400).send("Syntax error detected at VALUES!") :
                            error ?
                                (console.log(error),
                                    response.status(500).send("The data query was unsuccessful due to internal server connection error. :'(")) :
                                null;
    };
    ;
    MySqlPlus.prototype.select = function (response, table, column) {
        var _this = this;
        this.db.query("SELECT " + column.join(',') + " FROM " + table, function (error, rows) {
            _this.errorHandling(error, response);
            response.status(200).json(rows);
        });
    };
    ;
    MySqlPlus.prototype.insert = function (response, targetTable, insertToColumns, valuesToInsert, selectColumns) {
        var _this = this;
        valuesToInsert = valuesToInsert.map(function (value) { return value = "\"" + value + "\""; });
        this.db.query("INSERT INTO " + targetTable + " (" + insertToColumns.join(",") + ") \n      VALUES (" + valuesToInsert.join(',') + ");", function (error, okPacket) {
            _this.okPacket = okPacket;
            _this.errorHandling(error, response);
            _this.okPacket !== undefined ?
                _this.db.query("SELECT COLUMN_NAME FROM INFORMATION_SCHEMA.COLUMNS WHERE TABLE_SCHEMA = \"" + _this.dbName + "\" \n      AND TABLE_NAME = \"" + targetTable + "\" AND EXTRA = \"auto_increment\";", function (error, rows) {
                    _this.errorHandling(error, response);
                    _this.uniqueID = rows[0].COLUMN_NAME;
                    _this.db.query("SELECT " + selectColumns.join(',') + " FROM " + targetTable + " \n      WHERE " + _this.uniqueID + " = \"" + _this.okPacket.insertId + "\";", function (error, rows) {
                        _this.errorHandling(error, response);
                        response.status(200).json(rows);
                    });
                }) : null;
        });
    };
    ;
    MySqlPlus.prototype["delete"] = function (response, targetTable, columnToFilter, statementToFilter) {
        var _this = this;
        this.db.query("DELETE FROM " + targetTable + " WHERE " + columnToFilter + " = \"" + statementToFilter + "\";", function (error, okPacket) {
            _this.errorHandling(error, response);
            response.status(200).send("Data deleted successfully!");
        });
    };
    ;
    MySqlPlus.prototype.update = function (response, targetTable, columnToUpdate, newValueOrExpression, columnToFilter, statementToFilter) {
        var _this = this;
        var columnsToReceive = [];
        for (var _i = 6; _i < arguments.length; _i++) {
            columnsToReceive[_i - 6] = arguments[_i];
        }
        this.db.query("UPDATE " + targetTable + " SET " + columnToUpdate + " = " + newValueOrExpression + "\n      WHERE " + columnToFilter + " = " + statementToFilter + ";", function (error, okPacket) {
            _this.okPacket = okPacket;
            _this.errorHandling(error, response);
            _this.okPacket !== undefined ?
                _this.db.query("SELECT COLUMN_NAME FROM INFORMATION_SCHEMA.COLUMNS WHERE TABLE_SCHEMA = \"" + _this.dbName + "\" \n      AND TABLE_NAME = \"" + targetTable + "\" AND EXTRA = \"auto_increment\";", function (error, rows) {
                    _this.errorHandling(error, response);
                    _this.uniqueID = rows[0].COLUMN_NAME;
                    _this.db.query("SELECT " + columnsToReceive.join(',') + " FROM " + targetTable + " \n      WHERE " + _this.uniqueID + " = " + _this.okPacket.insertId + ";", function (error, rows) {
                        _this.errorHandling(error, response);
                        response.status(200).json(rows);
                    });
                }) : null;
        });
    };
    ;
    MySqlPlus.prototype.insertAndUpdate = function (response, targetTable, insertToColumns, valuesToInsert, columnToUpdate, newValueOrExpression, columnToFilter, statementToFilter, columnsToReceive) {
        var _this = this;
        valuesToInsert = valuesToInsert.map(function (value) { return value = "\"" + value + "\""; });
        this.db.query("INSERT INTO " + targetTable + " (" + insertToColumns.join(",") + ") \n      VALUES (" + valuesToInsert.join(',') + ");", function (error, okPacket) {
            _this.okPacket = okPacket;
            _this.errorHandling(error, response);
            _this.okPacket !== undefined ?
                _this.db.query("SELECT COLUMN_NAME FROM INFORMATION_SCHEMA.COLUMNS WHERE TABLE_SCHEMA = \"" + _this.dbName + "\" \n      AND TABLE_NAME = \"" + targetTable + "\" AND EXTRA = \"auto_increment\";", function (error, rows) {
                    _this.errorHandling(error, response);
                    _this.uniqueID = rows[0].COLUMN_NAME;
                    _this.db.query("UPDATE " + targetTable + " SET " + columnToUpdate + " = " + newValueOrExpression + "\n      WHERE " + columnToFilter + " = " + statementToFilter + ";", function (error, okPacket) {
                        _this.okPacket = okPacket;
                        _this.errorHandling(error, response);
                        _this.db.query("SELECT " + columnsToReceive.join(',') + " FROM " + targetTable + " \n      WHERE " + _this.uniqueID + " = " + _this.okPacket.insertId + ";", function (error, rows) {
                            _this.errorHandling(error, response);
                            response.status(200).json(rows);
                        });
                    });
                }) : null;
        });
    };
    ;
    MySqlPlus.prototype.deleteAndUpdate = function (response, targetTable, columnToFilter, statementToFilter, columnToUpdate, newValueOrExpression, columnsToReceive) {
        var _this = this;
        this.db.query("DELETE FROM " + targetTable + " WHERE " + columnToFilter + " = \"" + statementToFilter + "\";", function (error, okPacket) {
            _this.errorHandling(error, response);
            _this.db.query("UPDATE " + targetTable + " SET " + columnToUpdate + " = " + newValueOrExpression + "\n      WHERE " + columnToFilter + " = " + statementToFilter + ";", function (error, okPacket) {
                _this.okPacket = okPacket;
                _this.errorHandling(error, response);
                _this.okPacket !== undefined ?
                    _this.db.query("SELECT COLUMN_NAME FROM INFORMATION_SCHEMA.COLUMNS WHERE TABLE_SCHEMA = \"" + _this.dbName + "\" \n      AND TABLE_NAME = \"" + targetTable + "\" AND EXTRA = \"auto_increment\";", function (error, rows) {
                        _this.errorHandling(error, response);
                        _this.uniqueID = rows[0].COLUMN_NAME;
                        _this.db.query("SELECT " + columnsToReceive.join(',') + " FROM " + targetTable + " \n      WHERE " + _this.uniqueID + " = " + _this.okPacket.insertId + ";", function (error, rows) {
                            _this.errorHandling(error, response);
                            response.status(200).json(rows);
                        });
                    }) : null;
            });
        });
    };
    ;
    return MySqlPlus;
}());
;
exports.MySqlPlus; /* = MySQL */
