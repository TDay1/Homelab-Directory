const express = require('express');
const app = express();
const fs = require('fs')

var exports = module.exports

exports.initConfig = function () {
    config = {};

    try {
        var rawConfigData = fs.readFileSync('config.json', 'utf8');
        var configData = JSON.parse(rawConfigData);
    } catch (error) {
        console.log("Error: unable to read config. Make sure \'config.json\' is valid.\nFor more information regarding config files, check the github README");
        process.exit(1);
    }

    return (configData);


}

exports.initDB = function () {
    var templateJson = {
        rootArr: []
    }

    try {
        var rawReadData = fs.readFileSync('data.json', 'utf8');
        var readData = JSON.parse(rawReadData);

    } catch (error) {
        if (error.code == "ENOENT") {
            createDB()
        }
    }
}

function createDB() {
    var templateJson = {
        rootArr: []
    }

    databaseInitString = JSON.stringify(templateJson);

    try {
        fs.writeFileSync('data.json', databaseInitString);
    } catch (error) {
        console.log(error);
        return (false)
    }
}