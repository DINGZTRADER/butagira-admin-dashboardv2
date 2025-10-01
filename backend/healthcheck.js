const http = require('http');

const options = {
    hostname: 'localhost',
    port: 3001,
    path: '/health',
    method: 'GET',
    timeout: 2000
};

const request = http.request(options, (response) => {
    console.log(`Health check status: ${response.statusCode}`);
    if (response.statusCode === 200) {
        process.exit(0);
    } else {
        process.exit(1);
    }
});

request.on('error', (error) => {
    console.log(`Health check failed: ${error.message}`);
    process.exit(1);
});

request.on('timeout', () => {
    console.log('Health check timeout');
    request.destroy();
    process.exit(1);
});

request.end();