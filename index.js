var express = require('express');
var app = express();

var init = require("./helpers/init")
var routes = require("./routes/routes")

// POST data size limit
// This is necessary because the image is encoded and sent via JSON
app.use(express.json({
    limit: '20mb'
}));

//Allow reverse proxies on this project (reccomended for production)
app.enable('trust proxy');

// Serve the static files in ./static
app.use('/static', express.static('static'));

// set the view engine to ejs
app.set('view engine', 'ejs');

// Validate Save file on launch, if error then resolve.
init.initDB();

//Load config
config = init.initConfig();

/*
    Routes:
*/
// App GET routes
app.get('/', function (req, res) {
    routes.serveRoot(req, res, config.siteName);
});

app.get('*', function (req, res) {
    try {
        routes.serve404(req, res)
    } catch (error) {
        console.log(error)
    }
});

// API POST routes
// Route to add an app
app.post('/api/addapp', function (req, res) {
    try {
        routes.addApp(req, res);
    } catch (error) {
        console.log(error);
    }
});

// Route to delete an app
app.post('/api/deleteapp', function (req, res) {
    try {
        routes.deleteApp(req, res);
    } catch (error) {
        console.log(error);
    }
});

app.listen(config.port);
console.log("Listening on port " + config.port);