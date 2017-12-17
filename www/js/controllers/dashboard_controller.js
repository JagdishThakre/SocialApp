//Profile controller 
ctrl.controller('dashCtrl', function ($scope, $state, $ionicPopup,
            $ionicLoading, $localStorage, $ionicPlatform,$location,
            dataManager, CONFIG, sessionService,
            toastService, $cordovaSocialSharing) {
        $scope.posts = [];
        $scope.postListData = {};
        $scope.postListData.pageno = 0;
        $scope.postListData.user_id = $localStorage.User.id;
        $scope.postListData.user_auth_token = $localStorage.User.user_auth_token;
        $scope.postList = function () {
            if($scope.postListData.pageno ==0){
                $ionicLoading.show({
                    template: "Loading.."
                });
            }
           dataManager.post(CONFIG.HTTP_HOSTStaging +'postlist.php', $scope.postListData).then(function (response) {
                // console.log(JSON.stringify(response))
                if (response.status == 'true') {
                    if($scope.postListData.pageno ==0){
                        $scope.posts= response.data;
                        $ionicLoading.hide();
                        $scope.postListData.pageno +=1;
                    } else {
                        $scope.postListData.pageno +=1;
                        for(i=0; i<response.data.length;i++) {
                            $scope.posts.push(response.data[i]);
                        }
                        if(response.data.length == 0){
                            $scope.noMoreItemsAvailable = true;
                        }
                        $scope.$broadcast('scroll.infiniteScrollComplete');
                    } 
                    
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
        
        $ionicPlatform.ready(function() {
            $scope.postList();
        });

        $scope.loadMore = function() {
            $scope.postList();
            // $scope.$broadcast('scroll.infiniteScrollComplete');
        }
        $scope.noMoreItemsAvailable = false;
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
                console.log(JSON.stringify(response))
                if (response.status == 'true') {
                    $scope.postList();
                    $ionicLoading.hide();
                } else {
                    $ionicLoading.hide();
                    // toastService.sho wToast(response.message);
                }
            }, function 
            (error) {
                $ionicLoading.hide();
                console.log(error);
                toastService.showToast(CONFIG.connerrmsg);
            });
        }

        $scope.bookmark = function(type, post_id) {
            $scope.likeData.is_bookmark = type;
            $scope.likeData.post_id = post_id;
            $ionicLoading.show({
                template: "Loading.."
            });
            dataManager.post(CONFIG.HTTP_HOSTStaging +'postBookmark.php', $scope.likeData).then(function (response) {
                if (response.status == 'true') {
                    $scope.postList();
                    toastService.showToast(response.message);
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

        $scope.shareLink = function() {
            var message = "Please check this post";
            var subject = "Subject";
            var file = "www/img/logo.png";
            var link = "https://www.thepolyglotdeveloper.com";
            $cordovaSocialSharing
            .share(message, subject, file, link) // Share via native share sheet
            .then(function(result) {
                console.log("Result", result);
              // Success!
            }, function(err) {
              // An error occured. Show a message to the user
            });
        }

        $scope.detail = function(id) {
            console.log("postdeatil")
            $state.go("app.postDetail", {post_id: id});
            // $location.path("/postDetail/"+id);
        }

        /*$scope.goToAddQue = function(){
            $state.go('app.addquestion');
        }*/
})
;
