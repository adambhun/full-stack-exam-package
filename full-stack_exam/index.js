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
        var welcomeMessages = ["What is thy bidding, my master?", "Haile Selassie!", "And The Lord said, let there be light\n    and there was light.", "Do or do not! There is no try.", "Blahblahblahblahblah", "Hello, Boss!", "3,14"];
        var randomMessage = Math.floor(Math.random() * welcomeMessages.length - 1);
        console.log("Server at localhost:" + portNumber);
        console.log("Initialized JSON and urlencoded parsers, static folder set to '/" + staticFolder + "'");
        console.log("" + welcomeMessages[randomMessage]);
    });
};
/* Exposing MySQL DB initializer, connector and error handler */
exports.dbInit = function (mysql) {
    mysql.createConnection({
        host: process.env.DB_HOST,
        user: process.env.DB_USER,
        password: process.env.DB_PW,
        database: process.env.DB_NAME
    });
};
exports.dbConnect = function (databaseName) {
    databaseName.connect(function (error) {
        error ? (console.log("Something prevents connection to " + databaseName + " DB :'(\n      Dont't you forget the .env file...(DB_HOST, DB_USER, DB_PW, DB_NAME)")) :
            console.log("Connected to " + databaseName + " DB with great success! Keep it up, Boss!");
    });
};
exports.dbError = function (response, error) {
    error.search('1062') !== -1 ?
        response.send("The ID is already taken, please provide another one!") :
        error ? (console.log(error),
            response.status(500).send("The data query was unsuccessful due to internal server connection error. :'(")) :
            null;
};
