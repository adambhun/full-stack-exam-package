'use strict';
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : new P(function (resolve) { resolve(result.value); }).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
    return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (_) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
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
exports.HeadSetter = HeaderSettings;
/* Exposing MySQL DB initializer, connector, error handler and queries*/
var MySqlPlus = /** @class */ (function () {
    function MySqlPlus(dbName) {
        this.dbName = dbName;
        this.insertId = undefined;
        this.uniqueID = undefined;
        this.rowsData = undefined;
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
                                (console.error(error),
                                    response.status(500).send("The data query was unsuccessful due to internal server connection error. :'(")) :
                                null;
    };
    ;
    MySqlPlus.prototype.findUniqueID = function (response, targetTable) {
        var _this = this;
        this.db.query("SELECT COLUMN_NAME FROM INFORMATION_SCHEMA.COLUMNS WHERE TABLE_SCHEMA = \"" + this.dbName + "\" \n      AND TABLE_NAME = \"" + targetTable + "\" AND EXTRA = \"auto_increment\";", function (error, rows) {
            _this.errorHandling(error, response);
            _this.uniqueID = rows[0].COLUMN_NAME;
        });
    };
    ;
    MySqlPlus.prototype.select = function (response, targetColumns, targetTable) {
        var _this = this;
        this.db.query("SELECT " + targetColumns.join(',') + " FROM " + targetTable, function (error, rows) {
            _this.errorHandling(error, response);
            response.status(200).json(rows);
        });
    };
    ;
    MySqlPlus.prototype.selectFilter = function (response, targetTable, targetColumns, columnToFilter, valueToFilter) {
        var _this = this;
        this.db.query("SELECT " + targetColumns.join(',') + " FROM " + targetTable + "\n      WHERE " + columnToFilter + " = " + valueToFilter + ";", function (error, rows) {
            _this.errorHandling(error, response);
            response.status(200).json(rows);
        });
    };
    ;
    MySqlPlus.prototype.insert = function (response, targetTable, insertToColumns, valuesToInsert) {
        return __awaiter(this, void 0, void 0, function () {
            var getId;
            var _this = this;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        valuesToInsert = valuesToInsert.map(function (value) { return value = "\"" + value + "\""; });
                        getId = new Promise(function (resolve, reject) {
                            _this.db.query("INSERT INTO " + targetTable + " (" + insertToColumns.join(",") + ") VALUES (" + valuesToInsert.join(',') + ");", function (error, okPacket) {
                                error ?
                                    _this.errorHandling(error, response) :
                                    _this.db.insertId = okPacket.insertId;
                                /* this.findUniqueID(response, targetTable); */
                                resolve(_this.db.insertId);
                            });
                        });
                        return [4 /*yield*/, getId];
                    case 1:
                        _a.sent();
                        return [2 /*return*/];
                }
            });
        });
    };
    ;
    MySqlPlus.prototype.deleteRows = function (response, targetTable, columnToFilter, statementToFilter) {
        var _this = this;
        this.db.query("DELETE FROM " + targetTable + " WHERE " + columnToFilter + " = \"" + statementToFilter + "\";", function (error, okPacket) {
            _this.errorHandling(error, response);
            response.end();
        });
    };
    ;
    MySqlPlus.prototype.update = function (response, targetTable, columnToUpdate, newValueOrExpression, columnToFilter, valueToFilter) {
        var _this = this;
        this.db.query("UPDATE " + targetTable + " SET " + columnToUpdate + " = \"" + newValueOrExpression + "\"\n      WHERE " + columnToFilter + " = " + valueToFilter + ";", function (error, okPacket) {
            _this.errorHandling(error, response);
            response.end();
        });
    };
    ;
    return MySqlPlus;
}());
;
exports.MySqlPlus = MySqlPlus;
