var fs = require('fs');
var process = require('process');
var path = require('path');
var _ = require('lodash');
global.fileName = '';
global.argIdxToRemove = -1;
let token = '--file:';

var colorsArr = [];

global.argIdxToRemove;
process.argv.forEach(function (val, index, array) {
    global.argIdxToRemove = val.indexOf(token);
    if (global.argIdxToRemove > -1) {
        global.fileName = val.replace(token, '');
    }


});
if (global.fileName) {
    var stringToProcess = fs.readFileSync(path.resolve(fileName)).toString();
    var strClone = stringToProcess.toString();
    stringToProcess = stringToProcess.split('\n');
    stringToProcess.forEach((strLine) => {
        var regexp = /#[A-Fa-f0-9].+;/gi;
        var matches_array = strLine.match(regexp);
        colorsArr.push(matches_array);
    });
    colorsArr = _.map(_.uniq(_.compact(_.flatten(colorsArr))), (obj, idx) => {
        return {
            num: idx,
            color: obj
        }
    });

    var resultString = '';

    colorsArr.forEach((colorObj) => {
        resultString += '@color-' + colorObj.num + ': ' + colorObj.color + ' \n';
    });

    colorsArr.forEach((colorObj) => {
        strClone = replaceAll(strClone, colorObj.color, '@color-' + colorObj.num+';');
    });

    console.log(resultString + strClone);
}

function escapeRegExp(str) {
    return str.replace(/([.*+?^=!:${}()|\[\]\/\\])/g, "\\$1");
}

function replaceAll(str, find, replace) {
    return str.replace(new RegExp(escapeRegExp(find), 'g'), replace);
}