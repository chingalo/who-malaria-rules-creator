const headers = {
    'Content-Type': 'application/json',
    Authorization: 'Basic ' + new Buffer('admin:district').toString('base64')
};

const serverAddress = 'https://hisptz.info/dev';

const config = {
    headers,
    serverAddress
}

module.exports = config;