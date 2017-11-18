//Profile controller 
ctrl.controller('postDeatilCtrl', function ($scope, $state, $ionicPopup,
                        $ionicLoading, $localStorage,$rootScope,
                        dataManager, CONFIG,
                        toastService, $stateParams) {
    $scope.userid = localStorage.getItem('UserId');
    $scope.categories = [];
    $scope.postData = {};
    $scope.postData.user_auth_token = $localStorage.User.user_auth_token;
    $scope.postData.user_id = $localStorage.User.id;
    $scope.postData.post_id = $stateParams.post_id;
    /**Update profile function */
    $scope.postDetail = function () {
        $ionicLoading.show();
        dataManager.post(CONFIG.HTTP_HOSTStaging +'post_detail.php', $scope.postData).then(function (response) {
            // console.log(JSON.stringify(response))
            if (response.status == 'true') {
                $ionicLoading.hide();
                $scope.detail = response.data;
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
    /**Add comment on post */
    $scope.addComment = function() {
        if($scope.postData.comment) {
            $ionicLoading.show();
            dataManager.post(CONFIG.HTTP_HOSTStaging +'post_comment.php', $scope.postData).then(function (response) {
                console.log(JSON.stringify(response))
                if (response.status == 'true') {
                    $scope.postData.comment = '';
                    $ionicLoading.hide();
                    $scope.postDetail();
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
        } else {
            toastService.showToast("Please enter comment!");
        }
    }
    /**Remove post*/
    $scope.removePost = function() {
        $ionicLoading.show();
        dataManager.post(CONFIG.HTTP_HOSTStaging +'deletepost.php', $scope.postData).then(function (response) {
            console.log(JSON.stringify(response))
            if (response.status == 'true') {
                $scope.postData.comment = '';
                $ionicLoading.hide();
                $rootScope.goBack('app.dashboard');
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

    $scope.deletePost = function() {
        $ionicPopup.confirm({
            title: 'Post',
            template: 'Are you sure you want to remove this question?'
        })
        .then(function (result) {
            if (result) {
                $scope.removePost();
            }
        });
    }
})
;
