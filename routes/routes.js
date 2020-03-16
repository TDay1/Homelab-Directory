var exports = module.exports

var fs = require('fs');

exports.serveRoot = function (req, res, labName) {
    // Read the JSON database into memory
    try {
        var rawReadData = fs.readFileSync('data.json', 'utf8');

        // Parse raw JSON into an object
        var readData = JSON.parse(rawReadData);
        // Render the main page in ejs and then send to client. 
        res.render('pages/index', {
            //homelabApps: homelabApps.rootArr,
            homelabApps: readData.rootArr,
            labName: labName,
            currentYear: new Date().getFullYear() // currently not being used, will be used later (probably)
        });
    } catch (error) {
        res.send("error: " + error);
    }
}

exports.addApp = function (req, res) {

    // get app data from request body (JSON)
    var AppData = {
        appName: req.body.appName,
        appDesc: req.body.appDesc,
        appURL: req.body.appURL,
        customIMG: req.body.customIMG,
        customIMGName: req.body.customIMGName,
        customIMGFormat: req.body.customIMGFormat,
        customIMGFile: req.body.customIMGFile
    }

    // Make sure url is prefixed with "http" otherwise the link will not work.
    if (!AppData.appURL.includes("http")) {
        AppData.appURL = "http://" + AppData.appURL;
    }

    console.log("Adding an app to the database: " + AppData.appName + ":" + AppData.appURL);

    //read database from JSON file 
    var rawReadData = fs.readFileSync('data.json', 'utf8');
    var readData = JSON.parse(rawReadData);


    if (AppData.customIMG) {
        //Convert base64 string back into image
        var dataURLImgage = AppData.customIMGFile;
        var imgBuffer = Buffer.from(dataURLImgage.split(",")[1], 'base64');


        var Readable = require('stream').Readable;
        var s = new Readable();

        s.push(imgBuffer);
        s.push(null);


        var imgPath = ("./static/img/" + AppData.appName + ".png");

        s.pipe(fs.createWriteStream(imgPath));
    } else {
        imgPath = ("./static/placeholders/placeholder.png");
    }

    //object to add to the JSON database
    var writeObj = {
        appUUID: generateUUIDv4(),
        appName: AppData.appName,
        appDesc: AppData.appDesc,
        appURL: AppData.appURL,
        imgURL: imgPath
    };

    // Add object to in-memory object 
    readData.rootArr.push(writeObj);
    // write in-memeory object to disk, therefore adding the new records to the JSON db
    let data = JSON.stringify(readData);

    try {
        fs.writeFileSync('data.json', data);
        // Send responce to the client.
        res.json(JSON.stringify({
            error: false
        }));
    } catch (error) {
        res.json(JSON.stringify({
            error: true
        }));
    }

}

//returns a conpletely random uuid
function generateUUIDv4() {
    return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function (c) {
        var r = Math.random() * 16 | 0,
            v = c == 'x' ? r : (r & 0x3 | 0x8);
        return v.toString(16);
    });
}

//function to remove an app with a specified UUID
exports.deleteApp = function (req, res) {

    //read database from JSON file 
    var rawReadData = fs.readFileSync('data.json', 'utf8');
    var readData = JSON.parse(rawReadData);

    //iterate through apps and remove those with a matching UUID
    readData.rootArr.forEach(function (value, i) {
        if (readData.rootArr[i].appUUID == req.body.appUUID) {
            console.log(readData.rootArr[i]);
            readData.rootArr.splice(i, 1);
        }
    });

    let data = JSON.stringify(readData);

    try {
        fs.writeFileSync('data.json', data);

        res.json(JSON.stringify({
            error: false
        }));
    } catch (error) {
        res.json(JSON.stringify({
            error: true
        }));
    }
}

exports.serve404 = function (req, res) {
    res.render('pages/404');
}