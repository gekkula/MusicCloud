/**
 * Created by kishoregekkula on 24/08/18.
 */

var BroadCaster = function () {
    var sender;
    var listener;
    this.registerSender = function (s) {
        sender = s;
    }
    this.registerListener = function (l) {
        listener = l;
    }
    this.on = function () {
        listener.on();
    }

}
var broadCaster = new BroadCaster();
var App = angular.module('App', ['ngFileUpload']);
App.controller('MyCtrl', ['$scope', 'Upload', '$window', function ($scope, Upload, $window, refresh) {
    var vm = this;

    broadCaster.registerSender($scope);
    vm.submit = function () {
        var dateTimeStamp = Date.now();
        if (vm.upload_form.mp3.$valid && vm.mp3) {
            vm.uploadMp3(vm.mp3, dateTimeStamp, vm.title);

        }
        if (vm.upload_form.coverImage.$valid && vm.coverImage) {
            vm.uploadCoverImage(vm.coverImage, dateTimeStamp, vm.title);

        }


    }
    vm.uploadMp3 = function (file, dateTimeStamp, title) {

        Upload.upload({
            url: 'http://musiccloud.herokuapp.com/create/' + dateTimeStamp + "/" + title,
            fields: {
                name: "music",
                fieldname: "music",
                title: "title"
            },
            data: {music: file, 'title': "title"}
        }).then(function (resp) {
            if (resp.data.status) { //validate success
                $window.alert('Success ' + file.name + 'uploaded. ');
            } else {

            }
            console.log(resp.data);
            vm.refresh()
        }, function (resp) { //catch error

            $window.alert('Error status: ' + resp);
        }, function (evt) {

            var progressPercentage = parseInt(100.0 * evt.loaded / evt.total);
            vm.progress = 'progress: ' + progressPercentage + '% ';
        });
    };
    vm.refresh = function () {
        broadCaster.on();
        vm.title = null;
        vm.mp3 = null;
        vm.coverImage = null;
        vm.progress = null;
    }
    vm.uploadCoverImage = function (file, dateTimeStamp, title) {

        Upload.upload({
            url: 'http://musiccloud.herokuapp.com/create/' + dateTimeStamp + "/" + title, //webAPI exposed to upload the file
            fields: {
                name: "coverImage",
                fieldname: "coverImage",
                title: "title"
            },
            data: {coverImage: file, 'title': "title"} //pass file as data, should be user ng-model
        }).then(function (resp) { //upload function returns a promise
            if (resp.data.status) { //validate success
                $window.alert('Success ' + file.name + 'uploaded.  ');
                //  alert(resp);
            } else {
                // $window.alert('an error occured');
            }
            console.log(resp.data);
            ;

            vm.refresh()

        }, function (resp) { //catch error

            $window.alert('Error status: ' + resp);
        }, function (evt) {

            var progressPercentage = parseInt(100.0 * evt.loaded / evt.total);
            vm.progress = 'progress: ' + progressPercentage + '% '; // capture upload progress
        });
    };

}]);


//var App = angular.module('App', []);

App.controller('MyCtrl2', function ($scope, $http) {
    $scope.records = {};
    var audio = new Audio();
    broadCaster.registerListener($scope)
    $http.get('https://musiccloud.herokuapp.com/readAll/')
        .then(function (res) {
            var data = JSON.parse(res.data["data"]);

            for (var i in data) {
                data[i]["coverImage"] = "https://musiccloud.herokuapp.com/images/" + data[i]["coverImage"]
                data[i]["mp3"] = "https://musiccloud.herokuapp.com/audio/" + data[i]["mp3"]
            }
            $scope.records = data;


        });

    $scope.on = function () {

        $http.get('https://musiccloud.herokuapp.com/readAll/')
            .then(function (res) {
                var data = JSON.parse(res.data["data"]);

                for (var i in data) {
                    data[i]["coverImage"] = "https://musiccloud.herokuapp.com/images/" + data[i]["coverImage"]
                    data[i]["mp3"] = "https://musiccloud.herokuapp.com/audio/" + data[i]["mp3"]
                }
                $scope.records = data;


            });
    }

    $scope.deleteRow = function (i) {

        console.log($scope.records[i].id);
        $scope.stop(i);
        $http.get('https://musiccloud.herokuapp.com/delete/' + $scope.records[i].id)
            .then(function (res) {
                console.log(res);
                $scope.on();

            });
    };
    $scope.play = function (i) {

        console.log($scope.records[i].id);

        try {
            audio.stop();
        } catch (e) {

        }
        audio.src = $scope.records[i].mp3
        audio.load();
        audio.play();

    };
    $scope.stop = function (i) {
        try {
            audio.src = $scope.records[i].mp3
            audio.stop();
        } catch (e) {

        }

    };
});




