const fs = require('fs');
const Promise = require('promise');

async function readFromFile(path) {
    return new Promise((resolve) => {
        const data = JSON.parse(fs.readFileSync(path, 'utf8'));
        resolve(data);
    });
}

module.exports = {
    readFromFile
}