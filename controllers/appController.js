/**
 * Created by kishoregekkula on 24/08/18.
 */

var multer = require('multer');
var fs = require('fs');


var AppController = function () {
    this.saveCoverImage = function (req, res) {
        if (req.params.token === undefined || req.params.title === undefined) {
            return ({status: false, message: "Invalid token"});
        } else {
            var dateTimeStamp = req.params.token;
            var title = req.params.title;
            var titleId;
            var mp3Id;
            var coverImageId;
            var coverImageName;
            var mp3Name;

            var storage = multer.diskStorage({
                destination: function (req, file, cb) {
                    if (file.fieldname == "music") {
                        cb(null, './uploads/mp3/')
                    }
                    if (file.fieldname == "coverImage") {
                        cb(null, './uploads/cover-image/')
                    }


                },
                filename: function (req, file, cb) {


                    titleId = dateTimeStamp + "-" + title;
                    mp3Id = titleId + ".mp3";
                    coverImageId = titleId + ".png";


                    if (file.fieldname == "music") {
                        mp3Name = file.originalname;
                        cb(null, mp3Id)

                    }
                    if (file.fieldname == "coverImage") {
                        coverImageName = file.originalname;
                        cb(null, coverImageId)
                    }


                }
            });


            var upload = multer({ //multer settings
                storage: storage
            }).fields([{
                name: 'music', maxCount: 1
            }, {
                name: 'coverImage', maxCount: 1
            }, {
                name: 'title', maxCount: 1
            }]);

             upload(req, res, function (err) {
                if (err) {
                    return ({status: false, message: "Record not created"});
                }
                var rawData = fs.readFileSync('./uploads/title/titles.json');
                var titles = JSON.parse(rawData);

                var newTitle = {};
                newTitle["id"] = titleId;
                newTitle["title"] = title;
                newTitle["mp3"] = mp3Id;
                newTitle["coverImage"] = coverImageId;

                newTitle["coverImageName"] = coverImageName;
                newTitle["mp3Name"] = mp3Name;


                var flag = false;
                for (var i in titles["data"]) {
                    try {
                        if (titles["data"][i]["id"] == titleId) {
                            flag = true;
                            titles["data"][i] = newTitle;
                        }
                    }catch (e){

                    }
                }
                if (!flag) {
                    titles["data"].push(newTitle);
                }


                fs.writeFile("./uploads/title/titles.json", JSON.stringify(titles), function (err) {
                    if (err) {
                        return ({status: false, message: "Record not created"});
                    }
                });
                return ({status: true, message: "Record  created", data: JSON.stringify(newTitle)});
            });

        }
        return ({status: true, message: "Record  created", data: {}});
    }

    this.delete = function (id) {
        var rawData = fs.readFileSync('./uploads/title/titles.json');
        var titles = JSON.parse(rawData);
        if (id == null) {
            return ({
                status: false,
                message: "Record delete failed ! No Record id specified",
                data: JSON.stringify({id: id})
            });
        }
        var flag = false;

        for (var i=0;i<titles["data"].length;i++) {
            try {
                console.log(titles["data"][i]["id"]);
                if (titles["data"][i]["id"] === id) {
                    console.log((titles["data"][i]["id"]+"   Match"));
                    flag = true;
                    try {
                        fs.unlinkSync("./uploads/mp3/" + titles["data"][i]["mp3"] + "");
                        fs.unlinkSync("./uploads/cover-image/" + titles["data"][i]["coverImage"] + "");


                        titles["data"].splice(i, 1);
                        fs.writeFile("./uploads/title/titles.json", JSON.stringify(titles), function (err) {
                            if (err) {
                                return ({
                                    status: false,
                                    message: "Record delete failed",
                                    data: JSON.stringify({id: id})
                                });
                            }
                        });
                        return ({status: true, message: "Record deleted", data: JSON.stringify({id: id})});
                    } catch (e1) {
                        console.log(e1);
                        return ({status: false, message: "Record delete failed", data: JSON.stringify({id: id})});
                    }

                }
            }
            catch (e2) {
                console.log(e2)
                return {status: false, message: "Record does not exist"};
            }

        }
        if (!flag) {
            return ({
                status: false,
                message: "Record delete failed ! No Record id specified",
                data: JSON.stringify({id: id})
            });
        }
    }
    this.read = function (id) {
        if (id === null) {
            return ({
                status: false,
                message: "Record read failed ! No Record id specified",
                data: JSON.stringify({id: id})
            });
        }
        try {
            var flag = false;
            var rawData = fs.readFileSync('./uploads/title/titles.json');
            var titles = JSON.parse(rawData);
            for (var i in titles["data"]) {
                try {
                    if (titles["data"][i]["id"] == id) {
                        flag = true;
                        return ({status: true, message: "Record found", data: JSON.stringify(titles["data"][i])});
                    }
                } catch (e) {
                    return ({status: true, message: "Record not found", data: JSON.stringify("")});
                }
            }
            if (!flag) {
                return ({
                    status: false,
                    message: "Record read failed ! No Record not found",
                    data: JSON.stringify({id: id})
                });
            }
        } catch (e) {
            return {status: false, message: "Error reading records"};
        }

    }
    this.readAll = function () {
        try {
            var rawData = fs.readFileSync('./uploads/title/titles.json');
            var titles = JSON.parse(rawData);
            return ({status: true, message: "Records found", data: JSON.stringify(titles["data"])});
        } catch (e) {
            return ({status: false, message: "Records not found", data: JSON.stringify("")});
        }
    }
    this.hasEnoughMemory = function () {

    }

}
module.exports = new AppController();