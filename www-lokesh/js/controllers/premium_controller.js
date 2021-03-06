//Profile controller 
ctrl.controller('premiumCtrl', function ($scope, $state, $ionicPopup,
    $ionicLoading, $localStorage, $rootScope,
    dataManager, CONFIG,
    toastService, $stateParams) {
    $scope.userid = localStorage.getItem('UserId');
    $scope.packages = [];
    $scope.packagesData = {};
    $scope.packagesData.user_auth_token = $localStorage.User.user_auth_token;
    $scope.packagesData.user_id = $localStorage.User.id;
    $scope.packagesData.post_id = $stateParams.post_id;
    /**Update profile function */
    $scope.packagesList = function () {
        $ionicLoading.show();
        dataManager.post(CONFIG.HTTP_HOSTStaging + 'packages.php', $scope.packagesData).then(function (response) {
            console.log(JSON.stringify(response))
            if (response.status == 'true') {
                $ionicLoading.hide();                
                $scope.packages = response.data;
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
    $scope.packagesList();

    /**Get membership */
    $scope.getMembership = function(id){
        $scope.packagesData.package_id = id;
        $scope.packagesData.tran_id = 5465465;
        $scope.packagesData.pay_status = 1;
        $ionicLoading.show();
        dataManager.post(CONFIG.HTTP_HOSTStaging + 'get_membership.php', $scope.packagesData).then(function (response) {
            console.log(JSON.stringify(response))
            if (response.status == 'true') {
                $ionicLoading.hide();
                $state.go('app.addquestion');
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
});
