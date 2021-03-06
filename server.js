// server.js
const path = require('path');
const express = require('express');
const app = express();
// Run the app by serving the static files
// in the dist directory
app.use(express.static(__dirname + '/src'));
// Start the app by listening on the default
// Heroku port
app.listen(process.env.PORT || 8080);

// If an incoming request uses
// a protocol other than HTTP,
// redirect that request to the
// same url but with HTTP
const forceHTTP = function () {
    return function (req, res, next) {
        if (req.headers['x-forwarded-proto'] !== 'http') {
            return res.redirect(
             ['http://', req.get('Host'), req.url].join('')
            );
        }
        next();
    }
}

app.use('/node_modules', express.static(__dirname + '/node_modules'));
app.use(forceHTTP);

app.get('/', function (req, res) {
    res.writeHead(200, {
        'Content-type': 'text/html'
    });
    res.end(index);
});
