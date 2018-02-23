//Bookmark controller 
ctrl.controller('queProfileCtrl', function ($scope, $state, $ionicPopup,
    $ionicLoading, $localStorage, $rootScope, $ionicModal,
    dataManager, CONFIG, $cordovaSocialSharing,
    toastService, $stateParams) {
    $scope.userid = localStorage.getItem('UserId');
    $scope.bookmarks = [];
    $scope.post_quetions = [];
    $scope.ans_question = [];
    $scope.profileData = {};
    $scope.showMe = '';
    $scope.profile = $localStorage.User;
    $scope.profileData.user_auth_token = $localStorage.User.user_auth_token;
    $scope.profileData.user_id = $localStorage.User.id;
    $scope.activeTab = 1;
    $ionicModal.fromTemplateUrl('image-modal.html', {
        scope: $scope,
        animation: 'slide-in-up'
    }).then(function (modal) {
        $scope.modal = modal;
    });

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
    $scope.closeModal = function () {
        $scope.modal.hide();
    };

    $scope.bookmarksList = function () {
        $ionicLoading.show();
        dataManager.post(CONFIG.HTTP_HOSTStaging + 'profileList.php', $scope.profileData).then(function (response) {
            if (response.status == 'true') {
                $ionicLoading.hide();
                $scope.bookmarks = response.bookmarks;
                $scope.post_quetions = response.post_quetions;
                $scope.ans_question = response.ans_question;
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

    $scope.detail = function(id, type) {
        $state.go("app.postDetail", {post_id: id, type: type});
    }

    $scope.setTab = function(tab) {
        $scope.activeTab = tab;
    }

    $scope.bookmark = function (type, post_id) {
        $scope.likeData.is_bookmark = type;
        $scope.likeData.post_id = post_id;
        $ionicLoading.show({
            template: "Loading.."
        });
        dataManager.post(CONFIG.HTTP_HOSTStaging + 'postBookmark.php', $scope.likeData).then(function (response) {
            if (response.status == 'true') {
                $scope.profileData.pageno = 0;
                $scope.bookmarksList();
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
});
