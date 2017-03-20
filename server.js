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
// a protocol other than HTTPS,
// redirect that request to the
// same url but with HTTPS
/*const forceSSL = function () {
    return function (req, res, next) {
        if (req.headers['x-forwarded-proto'] !== 'http') {
            return res.redirect(
             ['http://', req.get('Host'), req.url].join('')
            );
        }
        next();
    }
}*/

app.use('/node_modules', express.static(__dirname + '/node_modules'));

app.get('/', function (req, res) {
    res.writeHead(200, {
        'Content-type': 'text/html'
    });
    res.end(index);
});

// For all GET requests, send back index.html
// so that PathLocationStrategy can be used
//app.get('/*', function (req, res) {
//    res.sendFile(path.join(__dirname + '/src/index.html'));
//});