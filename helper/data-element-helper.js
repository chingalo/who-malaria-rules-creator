const request = require('request');
const Promise = require('promise');
const _ = require('lodash');

async function getAllDataElements(headers, serverAddress) {
    const url = serverAddress + "/api/dataElements.json?fields=id,name,description"
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
                        dataElements
                    } = body;
                    resolve(dataElements)
                } else {
                    resolve([]);
                }
            }
        );
    })
}

module.exports = {
    getAllDataElements
}