var ctrl = angular.module('starter.controllers', ['ngCordova', 'ngStorage', 'ngCordovaOauth'])
    /**Confirm password match directive */
    .directive('validPasswordC', function () {
        return {
            require: 'ngModel',
            scope: {
                reference: '=validPasswordC'
            },
            link: function (scope, elm, attrs, ctrl) {
                ctrl.$parsers.unshift(function (viewValue, $scope) {
                    var noMatch = viewValue != scope.reference
                    ctrl.$setValidity('noMatch', !noMatch);
                    return (noMatch) ? noMatch : !noMatch;
                });

                scope.$watch("reference", function (value) {
                    ctrl.$setValidity('noMatch', value === ctrl.$viewValue);
                });
            }
        }
    })
    .service('LocationService', function ($q) {
        var autocompleteService = new google.maps.places.AutocompleteService();
        var detailsService = new google.maps.places.PlacesService(document.createElement("input"));
        return {
            searchAddress: function (input) {
                var deferred = $q.defer();

                autocompleteService.getPlacePredictions({
                    input: input
                }, function (result, status) {
                    if (status == google.maps.places.PlacesServiceStatus.OK) {
                        console.log(status);
                        deferred.resolve(result);
                    } else {
                        deferred.reject(status)
                    }
                });

                return deferred.promise;
            },
            getDetails: function (placeId) {
                var deferred = $q.defer();
                detailsService.getDetails({ placeId: placeId }, function (result) {
                    deferred.resolve(result);
                });
                return deferred.promise;
            }
        };
    })
    .directive('mhSelect', [
        '$ionicModal',
        function ($ionicModal) {
            return {
                restrict: 'E',
                template: '<ion-list>' +
                    '<ion-item class="item-text-wrap" ng-click="showItems($event)">' +
                    '{{text}}' +
                    '<span class="item-note">' +
                    '{{noteText}}' +
                    '</span>' +
                    '</ion-item>' +
                    ' </ion-list>',
                scope: {
                    'items': '=',
                    'text': '=',
                    'value': '=',

                    'callback': '&'
                },

                link: function (scope, element, attrs) {

                    /* Default values */
                    scope.multiSelect = attrs.multiSelect === 'true' ? true : false;
                    scope.allowEmpty = attrs.allowEmpty === 'false' ? false : true;

                    /* Header used in ion-header-bar */
                    scope.headerText = attrs.headerText || '';

                    /* Text displayed on label */
                    // scope.text          = attrs.text || '';
                    scope.defaultText = scope.text || '';

                    /* Notes in the right side of the label */
                    scope.noteText = attrs.noteText || '';
                    scope.noteImg = attrs.noteImg || '';
                    scope.noteImgClass = attrs.noteImgClass || '';

                    /* Optionnal callback function */
                    // scope.callback = attrs.callback || null;

                    /* Instanciate ionic modal view and set params */

                    /* Some additionnal notes here :
                     *
                     * In previous version of the directive,
                     * we were using attrs.parentSelector
                     * to open the modal box within a selector.
                     *
                     * This is handy in particular when opening
                     * the "fancy select" from the right pane of
                     * a side view.
                     *
                     * But the problem is that I had to edit ionic.bundle.js
                     * and the modal component each time ionic team
                     * make an update of the FW.
                     *
                     * Also, seems that animations do not work
                     * anymore.
                     *
                     */
                    $ionicModal.fromTemplateUrl(
                        'mh-select-items.html', {
                            'scope': scope
                        }
                    ).then(function (modal) {
                        scope.modal = modal;
                    });

                    /* Validate selection from header bar */
                    scope.validate = function (event) {
                        // Construct selected values and selected text
                        if (scope.multiSelect == true) {

                            // Clear values
                            scope.value = '';
                            scope.text = '';

                            // Loop on items
                            angular.forEach(scope.items, function (value, key) {
                                if (value.checked) {
                                    scope.value = scope.value + value.id + ';';
                                    scope.text = scope.text + value.text + ', ';
                                }
                            });


                            // Remove trailing comma
                            scope.value = scope.value.substr(0, scope.value.length - 1);
                            scope.text = scope.text.substr(0, scope.text.length - 2);
                        }

                        // Select first value if not nullable
                        if (typeof scope.value == 'undefined' || scope.value == '' || scope.value == null) {
                            if (scope.allowEmpty == false) {
                                scope.value = scope.items[0].id;
                                scope.text = scope.items[0].text;

                                // Check for multi select
                                scope.items[0].checked = true;
                            } else {
                                scope.text = scope.defaultText;
                            }
                        }

                        // Hide modal
                        scope.hideItems();

                        // Execute callback function
                        if (typeof scope.callback == 'function') {
                            scope.callback(scope.value);
                        }
                    }

                    /* Show list */
                    scope.showItems = function (event) {
                        event.preventDefault();
                        scope.modal.show();
                    }

                    /* Hide list */
                    scope.hideItems = function () {
                        scope.modal.hide();
                    }

                    /* Destroy modal */
                    scope.$on('$destroy', function () {
                        scope.modal.remove();
                    });

                    /* Validate single with data */
                    scope.validateSingle = function (item) {

                        // Set selected text
                        scope.text = item.text;

                        // Set selected value
                        scope.value = item.id;

                        // Hide items
                        scope.hideItems();

                        // Execute callback function
                        if (typeof scope.callback == 'function') {
                            scope.callback(scope.value);
                        }
                    }
                }
            };
        }
    ])

    .directive('locationSuggestion', function ($ionicModal, LocationService) {
        return {
            restrict: 'A',
            scope: {
                location: '='
            },
            link: function ($scope, element) {
                console.log('locationSuggestion started!');
                $scope.search = {};
                $scope.search.suggestions = [];
                $scope.search.query = "";
                $ionicModal.fromTemplateUrl('location.html', {
                    scope: $scope,
                    focusFirstInput: true
                }).then(function (modal) {
                    $scope.modal = modal;
                });
                element[0].addEventListener('focus', function (event) {
                    $scope.open();
                });
                $scope.$watch('search.query', function (newValue) {
                    if (newValue) {
                        LocationService.searchAddress(newValue).then(function (result) {
                            $scope.search.error = null;
                            $scope.search.suggestions = result;
                        }, function (status) {
                            $scope.search.error = "There was an error :( " + status;
                        });
                    };
                    $scope.open = function () {
                        $scope.modal.show();
                    };
                    $scope.close = function () {
                        $scope.modal.hide();
                    };
                    $scope.choosePlace = function (place) {
                        console.log(place.place_id);
                        LocationService.getDetails(place.place_id).then(function (location) {
                            $scope.location = location;
                            $scope.close();
                        });
                    };
                });
            }
        }
    })

    .directive('input', function ($timeout) {
        return {
            restrict: 'E',
            scope: {
                'returnClose': '=',
                'onReturn': '&',
                'onFocus': '&',
                'onBlur': '&'
            },
            link: function (scope, element, attr) {
                element.bind('focus', function (e) {
                    if (scope.onFocus) {
                        $timeout(function () {
                            scope.onFocus();
                        });
                    }
                });
                element.bind('blur', function (e) {
                    if (scope.onBlur) {
                        $timeout(function () {
                            scope.onBlur();
                        });
                    }
                });
                element.bind('keydown', function (e) {
                    if (e.which == 13) {
                        if (scope.returnClose) element[0].blur();
                        if (scope.onReturn) {
                            $timeout(function () {
                                scope.onReturn();
                            });
                        }
                    }
                });
            }
        }
    })

    /**side menu handling controller */
    .controller('AppCtrl', function ($scope, $localStorage, $state, $ionicLoading, $ionicPopup,
        $rootScope, $ionicSideMenuDelegate, $localStorage, dataManager, CONFIG, toastService,
        $ionicHistory, $ionicConfig) {

        $rootScope.goback = function (val) {
            window.history.back(-1);
        };
        $rootScope.logout = function () {
            $logoutData = { "device_uuid": $rootScope.deviceInfo.device_uuid, "user_auth_token": $localStorage.User.user_auth_token };
            $ionicPopup.confirm({
                title: 'Logout',
                template: 'Are you sure you want to logout?'
            }).then(function (result) {
                if (result) {
                    localStorage.clear();
                    $localStorage.$reset();
                    $ionicLoading.hide()
                    $state.go('login');
                }
            });
        }
        $rootScope.userProfile = "img/default_user.png";
        if ($localStorage.User) {
            $rootScope.userProfile = ($localStorage.User.user_profile != "") ? $localStorage.User.user_profile : 'img/default_user.png';
            $rootScope.user_fullname = $localStorage.User.user_fullname;
            $rootScope.user_email = $localStorage.User.user_email;
        }
        if ($localStorage.User) {
            $rootScope.changePwd = $localStorage.User.user_reg_type;
        }
        /**handling menu fadin and fadeout*/
        $rootScope.menuCollapsed = 'ion-navicon';
        $scope.$watch(function () {
            return $ionicSideMenuDelegate.isOpenLeft();
        }, function (isOpen) {
            if (isOpen) {
                $rootScope.menuCollapsed = 'ion-close';
            } else {
                $rootScope.menuCollapsed = 'ion-navicon';
            }
        });
    })

    //login controller 
    .controller('loginCtrl', function ($scope, $state, $location, $ionicPopup, toastService,
        $ionicLoading, $localStorage, $rootScope, $cordovaOauth, $http, dataManager, CONFIG, sessionService) {
        $scope.loginData = {};

        /**Login by application credential */
        $scope.login = function (isValid) {
            if (isValid) {
                $ionicLoading.show({
                    template: 'Signing In..'
                });
                $scope.loginData.deviceinfo = $rootScope.deviceInfo;

                dataManager.post(CONFIG.HTTP_HOSTStaging + 'login.php', $scope.loginData).then(function (response) {
                    console.log(JSON.stringify(response))
                    if (response.status == 'true') {
                        $ionicLoading.hide();
                        sessionService.User(response);
                        $rootScope.userProfile = (response.data.user_profile != "") ? response.data.user_profile : 'img/default_user.png';
                        $rootScope.user_fullname = response.data.user_fullname;
                        $rootScope.user_email = response.data.user_email;
                        $location.path("/rightmenu/dashboard");
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

        /**Login by facebook using*/
        $scope.facebooklogin = function () {
            $cordovaOauth.facebook("1614759508837273", ["email", "read_stream", "user_website", "user_location", "user_relationships"]).then(function (result) {
                // alert("yes"+result.access_token);
                $localStorage.accessToken = result.access_token;
                $scope.init();
                //$location.path("/profile");
            }, function (error) {
                //alert("There was a problem signing in!  See the console for logs");
                console.log(error);
                toastService.showToast(CONFIG.connerrmsg);
            });
        };

        /**Login by google plus */
        $scope.googlelogin = function () {
            $cordovaOauth.google("71890307147-7lv7nq1rukp9i0vuq8dtdeqfpp2vqqmr.apps.googleusercontent.com", ["email", "profile"]).then(function (result) {
                // alert("yes"+result.access_token);
                $localStorage.accessToken = result.access_token;
                $scope.googleinit();
                //$location.path("/profile");
            }, function (error) {
                //alert("There was a problem signing in!  See the console for logs");
                console.log(error);
                toastService.showToast(CONFIG.connerrmsg);
            });
        };

        /**Authenticating facebook auth token */
        $scope.init = function () {
            $ionicLoading.show();
            if ($localStorage.hasOwnProperty("accessToken") === true) {
                $http.get("https://graph.facebook.com/v2.2/me", { params: { access_token: $localStorage.accessToken, fields: "id,name,email,gender,location,website,picture,relationship_status,birthday", format: "json" } }).then(function (result) {
                    console.log("Facebook result**********", JSON.stringify(result.data));
                    //alert(JSON.stringify(result.data));
                    //alert(JSON.stringify(result.data.id));
                    $scope.profileData = {};
                    $scope.profileData.user_fullname = result.data.name;
                    $scope.profileData.user_email = result.data.email;
                    $scope.profileData.user_dob = result.data.birthday;
                    $scope.profileData.user_gender = (result.data.gender == 'male') ? 1 : 2;
                    $scope.profileData.user_reg_type = 2;
                    $scope.profileData.user_social_id = result.data.id;
                    $scope.profileData.social_login_json = result.data;
                    $scope.profileData.deviceinfo = $rootScope.deviceInfo;
                    dataManager.post(CONFIG.HTTP_HOSTStaging + 'social_login.php', $scope.profileData).then(function (response) {
                        //==================Session=====================
                        var status = response.status;
                        if (status == 'true') {
                            $ionicLoading.hide();
                            sessionService.User(response);
                            $rootScope.userProfile = (response.data.user_profile != "") ? response.data.user_profile : 'img/default_user.png';
                            $rootScope.user_fullname = response.data.user_fullname;
                            $rootScope.user_email = response.data.user_email;
                            sessionService.User(response);
                            $state.go("rightmenu.dashboard");
                        } else {
                            $ionicLoading.hide();
                            toastService.showToast(response.message);
                        }
                        //==================Session=====================

                    }, function (error) {
                        //alert(JSON.stringify(error));
                        $ionicLoading.hide();
                        toastService.showToast(JSON.stringify(error));
                    });
                }, function (error) {
                    //alert("There was a problem getting your profile.  Check the logs for details.");
                    $ionicLoading.hide();
                    console.log(error);
                    toastService.showToast(CONFIG.connerrmsg);
                });
            } else {
                $ionicLoading.hide();
                console.log("Not signed in");
                $location.path("/login");
            }
        };

        /**authenticating google auth token */
        $scope.googleinit = function () {
            if ($localStorage.hasOwnProperty("accessToken") === true) {
                $http.get("https://www.googleapis.com/plus/v1/people/me", { params: { access_token: $localStorage.accessToken } }).then(function (result) {
                    alert(JSON.stringify(result.data));
                    //alert(JSON.stringify(result.data.id));
                    $scope.profileData = {};
                    $scope.profileData.user_fullname = result.data.name;
                    $scope.profileData.user_email = result.data.email;
                    $scope.profileData.user_reg_type = 2;
                    $scope.profileData.user_social_id = result.data.id;
                    $scope.profileData.social_login_json = result.data;
                    $scope.profileData.deviceinfo = $rootScope.deviceInfo;
                    dataManager.post(CONFIG.HTTP_HOSTStaging + 'social_login.php', $scope.profileData).then(function (response) {
                        //==================Session=====================
                        var status = response.status;
                        if (status == 'true') {
                            sessionService.User(response);
                            $state.go("rightmenu.dashboard");
                        } else {
                            toastService.showToast(response.message);
                        }
                        //==================Session=====================

                    }, function (error) {
                        //alert(JSON.stringify(error));
                        toastService.showToast(JSON.stringify(error));
                    });
                }, function (error) {
                    //alert("There was a problem getting your profile.  Check the logs for details.");
                    console.log(error);
                    toastService.showToast(CONFIG.connerrmsg);
                });
            } else {
                console.log("Not signed in");
                $location.path("/login");
            }
        };
    })

    /**User registration controller */
    .controller('signupCtrl', function ($scope, $state, $location, $ionicPopup, toastService,
        $ionicLoading, $localStorage, $rootScope, dataManager, CONFIG, sessionService
        , $cordovaFileTransfer, $cordovaImagePicker, $cordovaCamera, $cordovaActionSheet, $cordovaDevice, $cordovaFile
    ) {
        $scope.signupData = {};
        $scope.signupData.user_dob = new Date($scope.signupData.user_dob);
        /*Image picker actionshit function*/
        $scope.getImage = function () {
            var options = {
                title: 'Select Image Source',
                buttonLabels: ['Load from Library', 'Use Camera'],
                addCancelButtonWithLabel: 'Cancel',
                androidEnableCancelButton: true,
            };
            $cordovaActionSheet.show(options).then(function (btnIndex) {
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
        $scope.selectPicture = function (sourceType) {
            var options = {
                targetWidth: 600,
                targetHeight: 400,
                quality: 70,
                allowEdit: true,
                destinationType: Camera.DestinationType.FILE_URI,
                sourceType: sourceType,
                saveToPhotoAlbum: false
            };

            $cordovaCamera.getPicture(options).then(function (imagePath) {
                // Grab the file name of the photo in the temporary directory
                var currentName = imagePath.replace(/^.*[\\\/]/, '');

                //Create a new name for the photo
                var d = new Date(),
                    n = d.getTime(),
                    newFileName = n + ".jpg";

                // If you are trying to load image from the gallery on Android we need special treatment!
                if ($cordovaDevice.getPlatform() == 'Android' && sourceType === Camera.PictureSourceType.PHOTOLIBRARY) {
                    window.FilePath.resolveNativePath(imagePath, function (entry) {
                        window.resolveLocalFileSystemURL(entry, success, fail);
                        function fail(e) {
                            console.error('Error: ', e);
                        }

                        function success(fileEntry) {
                            var namePath = fileEntry.nativeURL.substr(0, fileEntry.nativeURL.lastIndexOf('/') + 1);
                            // Only copy because of access rights
                            $cordovaFile.copyFile(namePath, fileEntry.name, cordova.file.dataDirectory, newFileName).then(function (success) {
                                $scope.image = newFileName;
                                console.log("imagepath", $scope.pathForImage($scope.image))
                                $scope.uploadProfile();
                            }, function (error) {
                                toastService.showToast(error.exception);
                            });
                        };
                    }
                    );
                } else {
                    var namePath = imagePath.substr(0, imagePath.lastIndexOf('/') + 1);
                    // Move the file to permanent storage
                    $cordovaFile.moveFile(namePath, currentName, cordova.file.dataDirectory, newFileName).then(function (success) {
                        $scope.image = newFileName;
                        console.log("camera imagepath", $scope.pathForImage($scope.image))
                        $scope.uploadProfile();
                    }, function (error) {
                        toastService.showToast(error.exception);

                    });
                }
            },
                function (err) {
                    // Not always an error, maybe cancel was pressed...
                })
        };

        /**take the image temp path from sd directory */
        $scope.pathForImage = function (image) {
            if (image === null) {
                return '';
            } else {
                return cordova.file.dataDirectory + image;
            }
        };

        /**Upload profile picture on server*/
        $scope.uploadProfile = function () {

            // $ionicLoading.show({
            //     template: 'Profile uploading..'
            // });
            var url = CONFIG.HTTP_HOSTStaging + 'tempProfileUpload.php';

            // File for Upload
            var targetPath = $scope.pathForImage($scope.image);

            // File name only
            var filename = $scope.image;
            var options = {
                fileKey: "user_profile",
                fileName: filename,
                chunkedMode: false,
                mimeType: "multipart/form-data",
                params: { fileName: filename }
            };
            console.log("upload profile", options);
            $cordovaFileTransfer.upload(url, targetPath, options).then(function (result) {
                if (result) {
                    result = JSON.parse(result.response);
                    if (result.status == 'true') {
                        console.log("result", result);
                        $scope.signupData.user_profile = result.user_profile;
                        // sessionService.User(result);
                        // $ionicLoading.hide();
                    } else {
                        // $ionicLoading.hide();
                        // toastService.showToast("Failed");
                    }

                } else {
                    // $ionicLoading.hide();
                    toastService.showToast("Failed");
                }
            }, function (error) {
                console.log("Error", error)
                // $ionicLoading.hide();
                toastService.showToast("Failed");
            });

        }

        $scope.signupData.user_gender = 1;
        /**user registration function */
        $scope.signup = function (isValid) {
            console.log("first", $scope.signupData);
            if (isValid) {
                $ionicLoading.show();
                console.log("Valid");
                $scope.signupData.deviceinfo = $rootScope.deviceInfo;
                dataManager.post(CONFIG.HTTP_HOSTStaging + 'registration.php', $scope.signupData).then(function (response) {
                    console.log(JSON.stringify(response))
                    if (response.status == 'true') {
                        $location.path("/login");
                        $ionicLoading.hide();
                        toastService.showToast(response.message);
                    } else {
                        $ionicLoading.hide();
                        toastService.showToast(response.message);
                    }
                }, function (error) {
                    $ionicLoading.hide();
                    toastService.showToast(CONFIG.connerrmsg);
                });
            }
        }
    })

    /**Forgot password controller */
    .controller('forgotPwdCtrl', function ($scope, $state, $location, $ionicPopup, toastService,
        $ionicLoading, $localStorage, $rootScope, dataManager, CONFIG, sessionService) {
        $scope.forgotData = {};
        $scope.forgot = function (isValid) {

            if (isValid) {
                console.log("Valid");
                $ionicLoading.show();
                $scope.forgotData.deviceinfo = $rootScope.deviceInfo;

                dataManager.post(CONFIG.HTTP_HOSTStaging + 'forgot_pwd.php', $scope.forgotData).then(function (response) {
                    console.log(JSON.stringify(response))
                    if (response.status == 'true') {
                        $ionicLoading.hide();
                        toastService.showToast(response.message);
                        $location.path("/login");
                        // $ionicPopup.alert({
                        //     title: CONFIG.successtitle,
                        //     template: response.message
                        // }).then(function(){
                        //     $location.path("/login");
                        // });

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

    /**Faq controller */
    .controller('faqCtrl', function ($scope) {
        $scope.groups = [];
        for (var i = 0; i < 10; i++) {
            $scope.groups[i] = {
                name: i,
                items: [],
                show: false
            };
            for (var j = 0; j < 1; j++) {
                $scope.groups[i].items.push(i + '-' + j);
            }
        }

        /*
         * if given group is the selected group, deselect it
         * else, select the given group
         */
        $scope.toggleGroup = function (group) {
            group.show = !group.show;
        };
        $scope.isGroupShown = function (group) {
            return group.show;
        };

    })

    ;
