//Profile controller 
ctrl.controller('postDeatilCtrl', function ($scope, $state, $ionicPopup,
    $ionicLoading, $localStorage, $rootScope,
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
        dataManager.post(CONFIG.HTTP_HOSTStaging + 'post_detail.php', $scope.postData).then(function (response) {
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
    $scope.addComment = function () {
        if ($scope.postData.comment) {
            $ionicLoading.show();
            dataManager.post(CONFIG.HTTP_HOSTStaging + 'post_comment.php', $scope.postData).then(function (response) {
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
    $scope.removePost = function () {
        $ionicLoading.show();
        dataManager.post(CONFIG.HTTP_HOSTStaging + 'deletepost.php', $scope.postData).then(function (response) {
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

    $scope.deletePost = function () {
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

    /**Like comment */
    $scope.likeCmnt = function (id, type) {
        $scope.postData.comment_id = id;
        $scope.postData.type = type;
        $ionicLoading.show();
        dataManager.post(CONFIG.HTTP_HOSTStaging + 'comment_like_unlike.php', $scope.postData).then(function (response) {
            console.log(JSON.stringify(response))
            if (response.status == 'true') {
                $scope.postData.comment_id = '';
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
    }

    /**Post Like unlike */
    $scope.likeUnlike = function (type) {
        $scope.postData.like_type = type;
        $ionicLoading.show({
            template: "Loading.."
        });
        dataManager.post(CONFIG.HTTP_HOSTStaging + 'like_unlike.php', $scope.postData).then(function (response) {
            console.log(JSON.stringify(response))
            if (response.status == 'true') {
                $scope.postDetail();
                $ionicLoading.hide();
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

    /**Reply on comment */
    $scope.reply = function (id) {
        $ionicPopup.show({
            template: '<input type = "text" ng-model = "postData.reply">',
            title: 'Reply',
            subTitle: '',
            scope: $scope,

            buttons: [
                { text: 'Cancel' }, {
                    text: '<b>Done</b>',
                    type: 'button-positive',
                    onTap: function (e) {

                        if (!$scope.postData.reply) {
                            //don't allow the user to close unless he enters model...
                            e.preventDefault();
                        } else {
                            $scope.postData.comment_id = id;
                            $scope.comment_reply();
                            // return $scope.postData.model;
                        }
                    }
                }
            ]
        });
    }

    /**Reply on comment */
    $scope.comment_reply = function () {
        $ionicLoading.show({
            template: "Loading.."
        });
        dataManager.post(CONFIG.HTTP_HOSTStaging + 'post_reply.php', $scope.postData).then(function (response) {
            console.log(JSON.stringify(response))
            if (response.status == 'true') {
                $scope.postData.reply = '';
                $scope.postDetail();
                $ionicLoading.hide();
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

    /**Report popup */
    $scope.reportPopUp = function() {
        $ionicPopup.show({
            template: '<input type = "text" ng-model = "postData.reply">',
            title: 'Reply',
            subTitle: '',
            scope: $scope,

            buttons: [
                { text: 'Cancel' }, {
                    text: '<b>Done</b>',
                    type: 'button-positive',
                    onTap: function (e) {

                        if (!$scope.postData.reply) {
                            //don't allow the user to close unless he enters model...
                            e.preventDefault();
                        } else {
                            $scope.postData.comment_id = id;
                            $scope.comment_reply();
                            // return $scope.postData.model;
                        }
                    }
                }
            ]
        });
    }
});
