//Profile controller 
ctrl.controller('dashCtrl', function ($scope, $ionicScrollDelegate, $state, $ionicPopup,
    $ionicLoading, $localStorage, $ionicPlatform, $location, $rootScope,
    dataManager, CONFIG, sessionService,
    toastService, $cordovaSocialSharing) {
    $rootScope.posts = [];
    $scope.postListData = {};
    $scope.postListData.pageno = 0;
    $scope.postListData.user_id = $localStorage.User.id;
    $scope.postListData.user_auth_token = $localStorage.User.user_auth_token;
    $scope.filters = {};
    $scope.categories = [];
    $scope.priorities = [];
    $scope.showMe = false;

    $scope.cities = [];

    $scope.priorities_text_multiple = 'Select Priority';
    $scope.category_text_multiple = "Select Category";
    $scope.city_text_multiple = "Select Cities";
    $scope.val = { cateory: null, priority: null, city: null };

    if ($localStorage.filterStore) {
        var priorities = $localStorage.filterStore.post_priority;
        if(priorities){
            $scope.postListData.post_category_id = priorities;
            var priority_split = priorities.split(";");
            $scope.priorities = [
                { id: 1, text: 'Normal', checked: (priority_split.indexOf("1") == "-1") ? false :true },
                { id: 2, text: 'High', checked: (priority_split.indexOf("2") == "-1") ? false :true },
                { id: 3, text: 'Critical', checked: (priority_split.indexOf("3") == "-1") ? false :true }];
        } else {
            $scope.priorities = [
                { id: 1, text: 'Normal', checked: false },
                { id: 2, text: 'High', checked: false },
                { id: 3, text: 'Critical', checked: false }];
        }
    } else {
        $scope.priorities = [
            { id: 1, text: 'Normal', checked: false },
            { id: 2, text: 'High', checked: false },
            { id: 3, text: 'Critical', checked: false }];
    }
    $scope.selectCategory = function () {
        $ionicLoading.show();
        if ($localStorage.filterStore) {
            $localStorage.goDetail = '';
            var cat = $localStorage.filterStore.post_category_id;
            if(cat){
                $scope.postListData.post_category_id = cat;
            }
         } 
        dataManager.post(CONFIG.HTTP_HOSTStaging + 'post_categories_list.php', $scope.postListData).then(function (response) {
            if (response.status == 'true') {
                $ionicLoading.hide();
                $scope.categories = response.data;
            } else {
                $ionicLoading.hide();
                toastService.showToast(response.message);
            }
        }, function (error) {
            $ionicLoading.hide();
            console.log(error);
            toastService.showToast(CONFIG.connerrmsg);
        });
    }

    $scope.selectCity = function () {
        $ionicLoading.show();
        if ($localStorage.filterStore) {
            $localStorage.goDetail = '';
            var city = $localStorage.filterStore.city;
            if(city){
                $scope.postListData.city = city;
            }
         } 
        dataManager.post(CONFIG.HTTP_HOSTStaging + 'city_list.php', $scope.postListData).then(function (response) {
            if (response.status == 'true') {
                $ionicLoading.hide();
                $scope.cities = response.data;
            } else {
                $ionicLoading.hide();
                toastService.showToast(response.message);
            }
        }, function (error) {
            $ionicLoading.hide();
            console.log(error);
            toastService.showToast(CONFIG.connerrmsg);
        });
    }

    $scope.postList = function () {
        if ($scope.postListData.pageno == 0) {
            $ionicLoading.show({
                template: "Loading.."
            });
        }
        dataManager.post(CONFIG.HTTP_HOSTStaging + 'postlist.php', $scope.postListData).then(function (response) {
            if (response.status == 'true') {
                if ($scope.postListData.pageno == 0) {
                    $rootScope.posts = response.data;
                    $ionicLoading.hide();
                    if (response.data.length >= 10) {
                        $scope.postListData.pageno += 1;
                    }
                } else {
                    $scope.postListData.pageno += 1;
                    for (i = 0; i < response.data.length; i++) {
                        $rootScope.posts.push(response.data[i]);
                    }
                    if (response.data.length == 0) {
                        $scope.noMoreItemsAvailable = true;
                    }
                    $scope.$broadcast('scroll.infiniteScrollComplete');
                }
                $scope.showMe = true;
            } else {
                $scope.showMe = true;
                $ionicLoading.hide();
                toastService.showToast(response.message);
            }
        }, function (error) {
            $scope.showMe = true;
            $ionicLoading.hide();
            toastService.showToast(CONFIG.connerrmsg);
        });
    }

    $ionicPlatform.ready(function () {
        $scope.selectCategory();
        $scope.postList();
        $scope.selectCity();
        $scope.loadMore = function () {
            $scope.postList();
        }
    });
    
    $scope.filter = function () {
        console.log("selected ", $scope.val);
        $ionicLoading.show({
            template: "Loading.."
        });
        $scope.postListData.post_priority = $scope.val.priority;
        $scope.postListData.post_category_id = $scope.val.cateory;
        $scope.postListData.city = $scope.val.city;
        dataManager.post(CONFIG.HTTP_HOSTStaging + 'postlist.php', $scope.postListData).then(function (response) {
            if (response.status == 'true') {
                $localStorage.filterStore = $scope.postListData;
                $rootScope.posts = response.data;
                $ionicLoading.hide();
            } else {
                $ionicLoading.hide();
                toastService.showToast(response.message);
            }
            // $scope.noMoreItemsAvailable = true;
            // $scope.$broadcast('scroll.infiniteScrollComplete');
        }, function (error) {
            $ionicLoading.hide();
            toastService.showToast(CONFIG.connerrmsg);
        });
    }

    $scope.clearfilter = function() {
        $scope.postListData.post_priority = null;
        console.log("clearfilter")
        angular.forEach($scope.priorities, function (value, key) {
            console.log("valie ", value)
            if ($scope.priorities.indexOf(value) != '-1') {
                console.log("index")
                $scope.priorities.splice($scope.priorities.indexOf(value), 1);
                value.checked = false;
                console.log("value ", value);
                $scope.priorities.push(value);
                console.log("pror", $scope.priorities)
            } 
        });
        $scope.val = { cateory: null, priority: null, city: null };
    }

    $scope.noMoreItemsAvailable = false;
    $scope.likeData = {};
    $scope.likeData.user_id = $localStorage.User.id;
    $scope.likeData.user_auth_token = $localStorage.User.user_auth_token;
    $scope.likeUnlike = function (type, post_id) {
        $scope.likeData.like_type = type;
        $scope.likeData.post_id = post_id;
        $ionicLoading.show({
            template: "Loading.."
        });
        dataManager.post(CONFIG.HTTP_HOSTStaging + 'like_unlike.php', $scope.likeData).then(function (response) {
            if (response.status == 'true') {
                $ionicScrollDelegate.scrollTop();
                $scope.postListData.pageno = 0;
                $scope.postList();
                $ionicLoading.hide();
            } else {
                $ionicLoading.hide();
                // toastService.sho wToast(response.message);
            }
        }, function (error) {
            $ionicLoading.hide();
            toastService.showToast(CONFIG.connerrmsg);
        });
    }

    $scope.bookmark = function (type, post_id) {
        $scope.likeData.is_bookmark = type;
        $scope.likeData.post_id = post_id;
        $ionicLoading.show({
            template: "Loading.."
        });
        dataManager.post(CONFIG.HTTP_HOSTStaging + 'postBookmark.php', $scope.likeData).then(function (response) {
            if (response.status == 'true') {
                $scope.postListData.pageno = 0;
                $scope.postList();
                toastService.showToast(response.message);
                $ionicLoading.hide();
            } else {
                $ionicLoading.hide();
                toastService.showToast(response.message);
            }
        }, function (error) {
            $ionicLoading.hide();
            toastService.showToast(CONFIG.connerrmsg);
        });
    }

    $scope.shareLink = function () {
        var message = "Please check this post";
        var subject = "Subject";
        var file = "www/img/logo.png";
        var link = "https://www.thepolyglotdeveloper.com";
        $cordovaSocialSharing
            .share(message, subject, file, link) // Share via native share sheet
            .then(function (result) {
                // Success!
            }, function (err) {
                // An error occured. Show a message to the user
            });
    }

    $scope.detail = function (id) {
        $localStorage.goDetail = "GoDetail";
        $state.go("app.postDetail", { post_id: id, type: 1 });
    }

    function successCallback(res) {
        if (!res) {
            var myPopup = $ionicPopup.show({
                template: 'Your device location GPS not enabled!',
                title: 'Location',
                // subTitle: 'Your device location GPS not enabled!',
                scope: $scope,
                buttons: [
                    {
                        text: '<b>Deny</b>',
                        type: 'deny',
                        onTap: function (e) {
                            // $state.go("rightmenu.dashboard");
                        }
                    },
                    {
                        text: '<b>Allow</b>',
                        type: 'button-positive',
                        onTap: function (e) {
                            // cordova.plugins.diagnostic.switchToLocationSettings();
                            // cordova.plugins.locationAccuracy.canRequest(function(canRequest){
                            //     if(canRequest){
                            cordova.plugins.locationAccuracy.request(function () {
                                console.log("Request successful");
                            }, function (error) {
                                console.error("Request failed");
                                if (error) {
                                    // Android only
                                    console.error("error code=" + error.code + "; error message=" + error.message);
                                    if (error.code !== cordova.plugins.locationAccuracy.ERROR_USER_DISAGREED) {
                                        if (window.confirm("Failed to automatically set Location Mode to 'High Accuracy'. Would you like to switch to the Location Settings page and do this manually?")) {
                                            cordova.plugins.diagnostic.switchToLocationSettings();
                                        }
                                    }
                                }
                            }, cordova.plugins.locationAccuracy.REQUEST_PRIORITY_HIGH_ACCURACY // iOS will ignore this
                            );
                            // }
                            // });
                        }
                    }
                ]
            });

            myPopup.then(function (res) {
            });
        } else {
            $state.go('app.addquestion');
        }
        //   !res ? cordova.plugins.diagnostic.switchToLocationSettings() : '';
    }

    function errorCallback(err) {
        console.log("Error: " + JSON.stringify(err));
    }

    $scope.goToAddQue = function () {
        // if(ionic.Platform.isAndroid()) {
        cordova.plugins.diagnostic.isLocationEnabled(successCallback, errorCallback);
        // } else {
        //     $state.go('app.addquestion');
        // }
    }

});
