const request = require('request');
const Promise = require('promise');
const _ = require('lodash');
const fileHelper = require("./file-helper")

async function getFunctionRules(indicators, dataElements, dataItems) {
    let rules = [];
    return new Promise(resolve => {
        for (dataItem of dataItems) {
            const id = dataItem.id;
            const dimensionItemType = dataItem.dimensionItemType.replace(/_/g, "");
            if (dimensionItemType === "DATAELEMENT") {
                const dataElement = _.find(dataElements, {
                    id: id
                });
                if (dataElement && dataElement.id) {
                    const numerator = "#{" + id + "}";
                    const denominator = 1;
                    const factor = 1;
                    const expression = getJsonExpression(numerator, denominator, factor);
                    const expressionUids = getExpressionUids(expression);
                    const expressionMapping = getJsonExpressionMapping(expressionUids);
                    const namesMapping = getJsonNamesMapping(dataElements, expressionUids);
                    rules.push({
                        id: dataElement.id,
                        name: dataElement.name,
                        description: dataElement.description,
                        json: JSON.stringify({
                            expression,
                            expressionMapping,
                            namesMapping
                        })
                    })
                }
            } else if (dimensionItemType === "INDICATOR") {
                const indicator = _.find(indicators, {
                    id: id
                });
                if (indicator) {
                    const {
                        numerator
                    } = indicator;
                    const {
                        denominator
                    } = indicator;
                    const {
                        factor
                    } = indicator.indicatorType;
                    const expression = getJsonExpression(numerator, denominator, factor);
                    const expressionUids = getExpressionUids(expression);
                    const expressionMapping = getJsonExpressionMapping(expressionUids);
                    const namesMapping = getJsonNamesMapping(dataElements, expressionUids);
                    rules.push({
                        id: indicator.id,
                        name: indicator.name,
                        description: indicator.description,
                        json: JSON.stringify({
                            expression,
                            expressionMapping,
                            namesMapping
                        })
                    })
                }
            }
        };
        resolve(rules);
    })
}

async function getFunctionFromServer(headers, serverAddress) {
    console.log("Discovering available who malaria function's confifuration")
    const url = serverAddress + "/api/dataStore/functions/whoMalariafn";
    const path = "config/default-function.js";
    let defaultFunction = await fileHelper.readFromFile(path);
    defaultFunction["rules"] = [];
    return new Promise((resolve) => {
        request({
                headers: headers,
                uri: url,
                method: 'GET'
            },
            (error, response, body) => {
                if (!error && response && response.statusCode === 200) {
                    resolve(JSON.parse(body));
                } else {
                    request({
                            headers: headers,
                            uri: url,
                            method: 'POST',
                            body: JSON.stringify(defaultFunction)
                        },
                        (error, response, body) => {
                            resolve(defaultFunction);
                        }
                    );
                }
            }
        );
    })
}

async function updateFunction(headers, serverAddress, functionPayload) {
    console.log("Update who malaria function'configuration")
    const url = serverAddress + "/api/dataStore/functions/whoMalariafn";
    return new Promise((resolve) => {
        request({
                headers: headers,
                uri: url,
                method: 'PUT',
                body: JSON.stringify(functionPayload)
            },
            (error, response, body) => {
                resolve();
            }
        );
    })

}

function getJsonExpression(numerator, denominator, factor) {
    return "((" + numerator + "/" + denominator + ")*" + factor + ")";
}

function getExpressionUids(expression) {
    let expressionUids = [];
    const matchRegrex = /(\{.*?\})/gi;
    expression.match(matchRegrex).map((value) => {
        expressionUids = expressionUids.concat(value.replace("{", ':separator:').replace("}", ':separator:').split(':separator:').filter(content => content.length > 0));
    });
    return _.uniq(expressionUids);
}

function getJsonExpressionMapping(expressionUids) {
    const expressionMapping = {};
    for (uid of expressionUids) {
        expressionMapping[uid] = null;
    }
    return expressionMapping;
}

function getJsonNamesMapping(dataElemnts, expressionUids) {
    const nameMapping = {};
    for (uid of expressionUids) {
        const dataElement = _.find(dataElemnts, {
            id: uid
        });
        if (dataElement && dataElement.id) {
            nameMapping[uid] = dataElement.name;
        }
    }
    return nameMapping;
}

module.exports = {
    getFunctionRules,
    getFunctionFromServer,
    updateFunction
}