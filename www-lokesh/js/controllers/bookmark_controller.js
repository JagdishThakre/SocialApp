//Bookmark controller 
ctrl.controller('bookmarkCtrl', function ($scope, $state, $ionicPopup,
    $ionicLoading, $localStorage, $rootScope,
    dataManager, CONFIG, $cordovaSocialSharing,
    toastService, $stateParams) {
    $scope.userid = localStorage.getItem('UserId');
    $scope.bookmarks = [];
    $scope.bookmarksData = {};
    $scope.bookmarksData.user_auth_token = $localStorage.User.user_auth_token;
    $scope.bookmarksData.user_id = $localStorage.User.id;
    /**Update profile function */
    $scope.bookmarksList = function () {
        $ionicLoading.show();
        dataManager.post(CONFIG.HTTP_HOSTStaging + 'bookmarkList.php', $scope.bookmarksData).then(function (response) {
            if (response.status == 'true') {
                $ionicLoading.hide();
                $scope.bookmarks = response.data;
            } else {
                $ionicLoading.hide();
                toastService.showToast(response.message);
            }
        }, function (error) {
            $ionicLoading.hide();
            toastService.showToast(CONFIG.connerrmsg);
        });
    }
    $scope.bookmarksList();
    $scope.likeData = {};
    $scope.likeData.user_id = $localStorage.User.id;
    $scope.likeData.user_auth_token = $localStorage.User.user_auth_token;
    $scope.likeUnlike = function(type, post_id) {
        $scope.likeData.like_type = type;
        $scope.likeData.post_id = post_id;
        $ionicLoading.show({
            template: "Loading.."
        });
        dataManager.post(CONFIG.HTTP_HOSTStaging +'like_unlike.php', $scope.likeData).then(function (response) {
            if (response.status == 'true') {
                $scope.bookmarksList();
                $ionicLoading.hide();
            } else {
                $ionicLoading.hide();
                // toastService.sho wToast(response.message);
            }
        }, function 
        (error) {
            $ionicLoading.hide();
            toastService.showToast(CONFIG.connerrmsg);
        });
    }

    $scope.shareLink = function() {
        var message = "Please check this post";
        var subject = "Subject";
        var file = "www/img/logo.png";
        var link = "https://www.thepolyglotdeveloper.com";
        $cordovaSocialSharing
        .share(message, subject, file, link) // Share via native share sheet
        .then(function(result) {
          // Success!
        }, function(err) {
          // An error occured. Show a message to the user
        });
    }

    $scope.detail = function(id) {
        $state.go("app.postDetail", {post_id: id});
    }
});
