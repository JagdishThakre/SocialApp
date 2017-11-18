//Profile controller 
ctrl.controller('postDeatilCtrl', function ($scope, $state, $ionicPopup,
                        $ionicLoading, $localStorage,
                        dataManager, CONFIG,
                        toastService, $stateParams) {
    $scope.categories = [];
    $scope.postData = {};
    $scope.postData.user_auth_token = $localStorage.User.user_auth_token;
    $scope.postData.user_id = $localStorage.User.id;
    $scope.postData.post_id = $stateParams.post_id;
    /**Update profile function */
    $scope.postDetail = function () {
        $ionicLoading.show();
        dataManager.post(CONFIG.HTTP_HOSTStaging +'post_detail.php', $scope.postData).then(function (response) {
            console.log(JSON.stringify(response))
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
})
;
