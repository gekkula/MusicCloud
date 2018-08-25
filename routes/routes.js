/**
 * Created by kishoregekkula on 24/08/18.
 */

var AppController = require('../controllers/appController.js');
var fs = require('fs');
var appRouter = function (app) {


    app.get("/", function (req, res) {
        //res.sendfile('./client/index.html');
        res.sendFile('index.html', { root: "./client/" });
    });

    app.post("/create/:token/:title", function (req, res) {

        var id = req.params.token+"-"+req.params.title;
        var responseData = AppController.saveCoverImage(req, res);
        var record = AppController.read(id);
        res.status(200).send(responseData);
    });
    app.get("/delete/:id", function (req, res) {
        var id = req.params.id;
        console.log(req.params.id)
        var responseData = AppController.delete(id);
        res.status(200).send(responseData);
    });
    app.get("/read/:id", function (req, res) {
        var id = req.params.id;
        var responseData = AppController.read(id);
        res.status(200).send(responseData);
    });
    app.get("/readAll", function (req, res) {
        var responseData = AppController.readAll();
        res.status(200).send(responseData);
    });
    app.get("/images/:id", function (req, res) {
        var id = req.params.id;
        console.log(id);
        if(id==null){
            return ({status: false, message: "Image not found ! No image specified", data: JSON.stringify({id: id})});
        }
        try {
            var img = fs.readFileSync("./uploads/cover-image/" + id + "");
            res.writeHead(200, {'Content-Type': 'image/gif'});
            res.end(img, 'binary');
        } catch (e) {
            console.log(e);
            res.status(400);
        }
    });
    // app.get("*", function (req, res) {
    //     res.status(400).send({message: 'Unknown Request'});
    // });
}

module.exports = appRouter;