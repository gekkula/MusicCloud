/**
 * Created by kishoregekkula on 24/08/18.
 */

angular.module('fileUpload', ['ngFileUpload'])
    .controller('MyCtrl',['Upload','$window',function(Upload,$window){
        var vm = this;
        vm.submit = function(){
            if (vm.upload_form.coverImage.$valid && vm.coverImage) {
                vm.upload(vm.coverImage,vm.mp3,vm.title);
            }
        }
        vm.upload = function (file1,file2,title) {
            Upload.upload({
                url: 'http://localhost:3030/create/', //webAPI exposed to upload the file
                data:{coverImage:file1,mp3:file2,title:title} //pass file as data, should be user ng-model
            }).then(function (resp) { //upload function returns a promise
                if(resp.data.error_code === 0){ //validate success
                    $window.alert('Success ' + resp.config.data.file1.name + 'uploaded. Response: ');
                } else {
                    $window.alert('an error occured');
                }
            }, function (resp) { //catch error
                console.log('Error status: ' + resp.status);
                $window.alert('Error status: ' + resp.status);
            }, function (evt) {
                console.log(evt);
                var progressPercentage = parseInt(100.0 * evt.loaded / evt.total);
                console.log('progress: ' + progressPercentage + '% ' + evt.config.data.file1.name);
                vm.progress = 'progress: ' + progressPercentage + '% '; // capture upload progress
            });
        };
    }]);
