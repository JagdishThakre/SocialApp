//Profile controller 
ctrl.controller('profileCtrl', function ($scope, $rootScope, $state, $ionicPopup,$cordovaFileTransfer,
            $ionicLoading, $localStorage, $cordovaImagePicker,$cordovaCamera,
            dataManager, CONFIG, sessionService, $cordovaActionSheet,
            toastService, $cordovaDevice, $cordovaFile) {
    $scope.showMe = '';
    $scope.dobClass = '';
    $scope.profileData = $localStorage.User;
    $scope.profileData.user_phone = parseInt($localStorage.User.user_phone);
    if($localStorage.User.user_dob != null) {
        $scope.profileData.user_dob = new Date($localStorage.User.user_dob);
        $scope.dobClass = "has-value";
    }
    $scope.profileData.user_auth_token = $localStorage.User.user_auth_token;
    /**Update profile function */
    $scope.updateProfile = function (isValid) {
        if (isValid) {
            $ionicLoading.show();
            dataManager.post(CONFIG.HTTP_HOSTStaging +'update_profile.php', $scope.profileData).then(function (response) {
                console.log(JSON.stringify(response))
                if (response.status == 'true') {
                    $localStorage.User.user_fullname = response.data.user_fullname;
                    $localStorage.User.user_dob = response.data.user_dob;
                    $localStorage.User.user_gender = response.data.user_gender;
                    $localStorage.User.user_phone = response.data.user_phone;
                    $rootScope.user_fullname = response.data.user_fullname;
                    $rootScope.user_email = response.data.user_email;
                    $ionicLoading.hide();
                    toastService.showToast(response.message);
                } else {
                    $ionicLoading.hide();
                    toastService.showToast(response.message);
                }
            }, function 
            (error) {
                $ionicLoading.hide();
                console.log(error);
                toastService.showToast(CONFIG.connerrmsg);
            });
        }
    }

    $scope.picData = {};
    $scope.picData.user_id = $localStorage.User.id;

    /*Image picker actionshit function*/               

    $scope.getImage = function() {  
        var options = {
            title: 'Select Image Source',
            buttonLabels: ['Load from Library', 'Use Camera'],
            addCancelButtonWithLabel: 'Cancel',
            androidEnableCancelButton : true,
            };
            $cordovaActionSheet.show(options).then(function(btnIndex) {
            var type = null;
            if (btnIndex === 1) {
                type = Camera.PictureSourceType.PHOTOLIBRARY;
            } else if (btnIndex === 2) {
                type = Camera.PictureSourceType.CAMERA;
            }
            if (type !== null) {
                $scope.selectPicture(type);
            }
            });
        
    }

    /**Open camera or gallery for updload profile picture */
    $scope.selectPicture = function(sourceType) {
        var options = {
            targetWidth: 600,
            targetHeight: 400,
            quality: 70,
            allowEdit:true,
            destinationType: Camera.DestinationType.FILE_URI,
            sourceType: sourceType,
            saveToPhotoAlbum: false
        };
        
        $cordovaCamera.getPicture(options).then(function(imagePath) {
            // Grab the file name of the photo in the temporary directory
            var currentName = imagePath.replace(/^.*[\\\/]/, '');
        
            //Create a new name for the photo
            var d = new Date(),
            n = d.getTime(),
            newFileName =  n + ".jpg";
        
            // If you are trying to load image from the gallery on Android we need special treatment!
            if ($cordovaDevice.getPlatform() == 'Android' && sourceType === Camera.PictureSourceType.PHOTOLIBRARY) {
            window.FilePath.resolveNativePath(imagePath, function(entry) {
                window.resolveLocalFileSystemURL(entry, success, fail);
                function fail(e) {
                console.error('Error: ', e);
                }
        
                function success(fileEntry) {
                var namePath = fileEntry.nativeURL.substr(0, fileEntry.nativeURL.lastIndexOf('/') + 1);
                // Only copy because of access rights
                $cordovaFile.copyFile(namePath, fileEntry.name, cordova.file.dataDirectory, newFileName).then(function(success){
                    $scope.image = newFileName;
                    console.log("imagepath",$scope.pathForImage($scope.image))
                    $scope.showMe = 'show';
                    $scope.profileData.user_profile = '';
                    $scope.uploadProfile();
                }, function(error){
                    toastService.showToast(error.exception);
                });
                };
            }
            );
            } else {
            var namePath = imagePath.substr(0, imagePath.lastIndexOf('/') + 1);
            // Move the file to permanent storage
            $cordovaFile.moveFile(namePath, currentName, cordova.file.dataDirectory, newFileName).then(function(success){
                $scope.image = newFileName;
                console.log("camera imagepath",$scope.pathForImage($scope.image))
                $scope.showMe = 'show';
                $scope.profileData.user_profile = '';
                $scope.uploadProfile();
            }, function(error){
                toastService.showToast(error.exception);
                
            });
            }
        },
        function(err){
            // Not always an error, maybe cancel was pressed...
        })
        };

    /**take the image temp path from sd directory */
    $scope.pathForImage = function(image) {
        if (image === null) {
            return '';
        } else {
            return cordova.file.dataDirectory + image;
        }
    };
    
    /**Upload profile picture on server*/
    $scope.uploadProfile = function() {
        
        $ionicLoading.show({
            template: 'Profile uploading..'
        });
        var url = CONFIG.HTTP_HOSTStaging+'uploadprofile.php';
        
        // File for Upload
        var targetPath = $scope.pathForImage($scope.image);

        // File name only
        var filename = $scope.image;
        var options = {
            fileKey: "user_profile",
            fileName: filename,
            chunkedMode: false,
            mimeType: "multipart/form-data",
            params: {fileName: filename, user_id: $scope.picData.user_id}
        };
        console.log("upload profile", options);
        $cordovaFileTransfer.upload(url, targetPath, options).then(function (result) {
            if(result) {
                    result = JSON.parse(result.response);
                    if(result.status == 'true') {
                        console.log("result", result);
                        $localStorage.User.user_profile = result.data.user_profile;
                        $rootScope.userProfile = (result.data.user_profile != "") ? result.data.user_profile : 'img/default_user.png';
                        // sessionService.User(result);
                        $ionicLoading.hide();
                        toastService.showToast("Updated successfully.");
                    } else {
                        $ionicLoading.hide();
                        $scope.profileData.user_profile = '';
                        toastService.showToast("Failed");
                    }
                
            } else {
                $ionicLoading.hide();
                toastService.showToast("Failed");    
            }
        }, function(error) {
            console.log("Error", error)
            $ionicLoading.hide();
            toastService.showToast("Failed");
        });
        
    }
})

/**Change password controller */
.controller("changePwdCtrl", function($scope, $state, $ionicPopup,
            $ionicLoading, $localStorage,
            dataManager, CONFIG, sessionService, toastService) {
        $scope.changePwdData = {};
                
        $scope.changePwd = function(isValid) {
            console.log("$localStorage.User.id", $localStorage.User.id);
            if (isValid) {
                $scope.changePwdData.user_id  = $localStorage.User.id;
                $scope.changePwdData.user_auth_token = $localStorage.User.user_auth_token;
                $ionicLoading.show();
                dataManager.post(CONFIG.HTTP_HOSTStaging +'changepwd.php', $scope.changePwdData).then(function (response) {
                    console.log(JSON.stringify(response))
                    if (response.status == 'true') {
                        $ionicLoading.hide();
                        toastService.showToast(response.message);
                    } else {
                        $ionicLoading.hide();
                        toastService.showToast(response.message);
                    }
                }, function 
                (error) {
                    $ionicLoading.hide();
                    console.log(error);
                    toastService.showToast(CONFIG.connerrmsg);
                });
            }
        }
})
;
