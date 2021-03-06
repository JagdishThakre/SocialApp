//Profile controller 
ctrl.controller('queCtrl', function ($scope, $state, $ionicPopup,
    $ionicLoading, $localStorage, $cordovaGeolocation,
    dataManager, CONFIG, sessionService, $timeout,
    toastService, $rootScope) {
    $scope.categories = [];
    $scope.addQueData = {};
    $scope.location = {};
    $scope.addQueData.user_auth_token = $localStorage.User.user_auth_token;
    $scope.addQueData.user_id = $localStorage.User.id;
    $scope.addQueData.lat = '';
    $scope.addQueData.long = '';
    var que = localStorage.getItem('question');
    if (que) {
        $scope.addQueData = JSON.parse(que);
    }
    $scope.locationtype = 'enter';
    function showResult(result) {
        console.log("lat: " + result.geometry.location.lat() + ' lng:' + result.geometry.location.lng());
        $scope.addQueData.lat = result.geometry.location.lat();
        $scope.addQueData.long = result.geometry.location.lng();
    }

    function getLatitudeLongitude(callback, address) {
        // If adress is not supplied, use default value 'Ferrol, Galicia, Spain'
        address = address || 'Ferrol, Galicia, Spain';
        // Initialize the Geocoder
        geocoder = new google.maps.Geocoder();
        if (geocoder) {
            geocoder.geocode({
                'address': address
            }, function (results, status) {
                if (status == google.maps.GeocoderStatus.OK) {
                    console.log("results ", results);
                    callback(results[0]);
                }
            });
        }
    }

    function successCallback(res) {
        console.log("Location is " + (res ? "Enabled" : "not Enabled"));
        if (!res) {
            var myPopup = $ionicPopup.show({
                template: 'Your device location GPS not enabled!',
                title: 'Location',
                // subTitle: 'Your device location GPS not enabled!',
                scope: $scope,
                buttons: [
                    {
                        text: '<b>Deny</b>',
                        type: 'button-positive',
                        onTap: function (e) {
                            $state.go("rightmenu.dashboard");
                        }
                    },
                    {
                        text: '<b>Allow</b>',
                        type: 'button-positive',
                        onTap: function (e) {
                            cordova.plugins.diagnostic.switchToLocationSettings();
                        }
                    }
                ]
            });

            // myPopup.then(function (res) {
            //     console.log('Tapped!', res);
            // });
        } else { }
        //   !res ? cordova.plugins.diagnostic.switchToLocationSettings() : '';
    }
    function errorCallback(err) {
        console.log("Error: " + JSON.stringify(err));
    }
    $scope.lookupLatLng = function () {
        var posOptions = { timeout: 10000, enableHighAccuracy: false };
        cordova.plugins.diagnostic.isLocationEnabled(successCallback, errorCallback);
        $cordovaGeolocation
            .getCurrentPosition(posOptions)
            .then(function (position) {
                console.log("Position ", position)
                $scope.addQueData.lat = position.coords.latitude;
                $scope.addQueData.long = position.coords.longitude;

                var geocoder = new google.maps.Geocoder();
                var latlng = new google.maps.LatLng($scope.addQueData.lat, $scope.addQueData.long);
                var request = {
                    latLng: latlng
                };
                geocoder.geocode(request, function (data, status) {
                    if (status == google.maps.GeocoderStatus.OK) {
                        if (data[0] != null) {
                            console.log("data[0].formatted_address ", data[0].formatted_address);
                            $scope.addQueData.post_location = data[0].formatted_address;
                            $scope.location.current_location = data[0].formatted_address;
                            // alert("address is: " + data[0].formatted_address);
                        } else {
                            $scope.addQueData.post_location = '';
                            console.log("error No address available")
                            // alert("No address available");
                        }
                    }
                })
            }, function (err) {
                console.log("Error ", err);
                // error
            });
    }

    $scope.lookupLatLng();
    /**Update profile function */
    $scope.addQue = function (isValid) {
        console.log("$scope.locationtype", $scope.locationtype);
        if (isValid) {
            if ($scope.locationtype == 'enter') {
                $scope.addQueData.post_location = document.getElementById('pac-input').value;
            } else {
                $scope.addQueData.post_location = document.getElementById('cur-input').value;
            }
            if ($scope.addQueData.post_location != '') {
                // if ($scope.locationtype == 'enter') {
                getLatitudeLongitude(showResult, $scope.addQueData.post_location);
                // }
                $ionicLoading.show();
                $timeout(function () {
                    dataManager.post(CONFIG.HTTP_HOSTStaging + 'addque.php', $scope.addQueData).then(function (response) {
                        console.log(JSON.stringify(response))
                        if (response.code == 200) {
                            $ionicLoading.hide();
                            localStorage.setItem('question', '');
                            toastService.showToast(response.message);
                            $rootScope.goBack('rightmenu.dashboard');
                        } else if (response.code == 201) {
                            localStorage.setItem('question', JSON.stringify($scope.addQueData));
                            $state.go('app.premium');
                        } else {
                            $ionicLoading.hide();
                            toastService.showToast(response.message);
                        }
                    }, function (error) {
                        $ionicLoading.hide();
                        console.log(error);
                        toastService.showToast(CONFIG.connerrmsg);
                    });
                }, 500);
            } else {
                toastService.showToast("Please enter location");
            }
        }
    }

    $scope.selectCategory = function () {
        $ionicLoading.show();
        dataManager.post(CONFIG.HTTP_HOSTStaging + 'post_categories_list.php', $scope.addQueData).then(function (response) {
            console.log("response ", response)
            if (response.status == 'true') {
                $ionicLoading.hide();
                $scope.categories = response.data;
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

    $scope.selectCategory();
    $scope.checkLocation = function (location) {
        if (location === 'current') {
            $scope.lookupLatLng();
        }
        $scope.locationtype = location;
    }

    $scope.getLocation = function () {
        console.log("get location");
        $scope.addQueData.post_location = document.getElementById('pac-input').value;
        getLatitudeLongitude(showResult, $scope.addQueData.post_location);
    }

})
    ;
