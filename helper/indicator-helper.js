const request = require('request');
const Promise = require('promise');
const _ = require('lodash');

async function getAllIndicators(headers, serverAddress) {
    console.log("Discovering available template indicators")
    const url = serverAddress + "/api/indicators.json?fields=id,name,description,denominator,numerator,indicatorType[factor]&pagin=false"
    return new Promise(resolve => {
        request({
                headers: headers,
                uri: url,
                method: 'GET'
            },
            (error, response, body) => {
                if (!error && response && response.statusCode === 200) {
                    body = JSON.parse(body);
                    const {
                        indicators
                    } = body;
                    resolve(indicators)
                } else {
                    resolve([]);
                }
            }
        );
    })
}

module.exports = {
    getAllIndicators
}