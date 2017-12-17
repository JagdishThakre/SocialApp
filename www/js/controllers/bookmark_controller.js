//Bookmark controller 
ctrl.controller('bookmarkCtrl', function ($scope, $state, $ionicPopup,
    $ionicLoading, $localStorage, $rootScope,
    dataManager, CONFIG,
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
            console.log(JSON.stringify(response))
            if (response.status == 'true') {
                $ionicLoading.hide();
                $scope.bookmarks = response.data;
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
    $scope.bookmarksList();

});
