//Profile controller 
ctrl.controller('queCtrl', function ($scope, $state, $ionicPopup,$cordovaFileTransfer,
            $ionicLoading, $localStorage, $cordovaImagePicker,$cordovaCamera,
            dataManager, CONFIG, sessionService, $cordovaActionSheet,
            toastService, $cordovaDevice, $cordovaFile) {
    $scope.categories = [];
    $scope.addQueData = {};
    $scope.addQueData.user_auth_token = $localStorage.User.user_auth_token;
    $scope.addQueData.user_id = $localStorage.User.id;
    /**Update profile function */
    $scope.addQue = function (isValid) {
        if (isValid) {
            console.log("Valid");
            $ionicLoading.show();
           dataManager.post(CONFIG.HTTP_HOSTStaging +'addque.php', $scope.addQueData).then(function (response) {
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

    $scope.selectCategory = function () {
        $ionicLoading.show();
        dataManager.post(CONFIG.HTTP_HOSTStaging +'post_categories_list.php', $scope.addQueData).then(function (response) {
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
})
;
