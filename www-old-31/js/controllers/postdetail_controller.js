//Profile controller 
ctrl.controller('postDeatilCtrl', function ($scope, $state, $ionicPopup,
    $ionicLoading, $localStorage, $rootScope, $cordovaSocialSharing,
    dataManager, CONFIG, UserRetriever, $timeout,
    toastService, $stateParams, $ionicModal) {
    $scope.userid = localStorage.getItem('UserId');
    $scope.categories = [];
    $scope.postData = {};
    $scope.postData.user_auth_token = $localStorage.User.user_auth_token;
    $scope.postData.user_id = $localStorage.User.id;
    $scope.postData.post_id = $stateParams.post_id;
    $scope.postData.type = $stateParams.type;

    $scope.names = [];
    $scope.localData = {
        id: []
    };
    $scope.settings = {
        data: $scope.names,
        filter: true,
        placeholder: 'Please select',
        // theme: "ios-dark",
        // animate: "slideup",
        // display: "top",
        select: "multiple",
        // layout: "liquid"
    };
    $scope.saveHelp = function () {
        console.log("localdata ", $scope.localData);
        $ionicLoading.show();
        $scope.postData.help_by_userid = "'" + $scope.localData.id + "'";
        dataManager.post(CONFIG.HTTP_HOSTStaging + 'add_help.php', $scope.postData).then(function (response) {
            // console.log(JSON.stringify(response))
            if (response.status == 'true') {
                $ionicLoading.hide();
                $scope.modal.hide();
                $rootScope.goBack("rightmenu.dashboard");
                // $scope.postDetail();
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

    $scope.removeUser = function(index){
        $scope.selectedUser.splice(index, 1);
        $scope.localData.id.splice(index, 1)
    }

    // Load the modal from the given template URL
    $ionicModal.fromTemplateUrl('modal.html', {
        scope: $scope,
        animation: 'slide-in-up'
    }).then(function (modal) { $scope.modal = modal; });

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
        }, function (error) {
            $ionicLoading.hide();
            console.log(error);
            toastService.showToast(CONFIG.connerrmsg);
        });

        dataManager.post(CONFIG.HTTP_HOSTStaging + 'help_users_list.php', $scope.postData).then(function (response) {
            console.log(JSON.stringify(response))
            if (response.status == 'true') {
                angular.forEach(response.data, function (value, key) {
                    $scope.names.push(value);
                });
                // setTimeout(function(){
                //     console.log("Users");
                //     angular.forEach(response.users, function (value, key) {
                //         console.log("Users", key);
                //         $scope.$apply(function() {
                //         $scope.localData.id.push(value);
                //     });
                //     });
                // },1000)
                $scope.localData.id = response.users;
                console.log($scope.names);
                // $scope.names = response.data;
            }
        }, function (error) {
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
                $rootScope.goBack('rightmenu.dashboard');
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
    /**Remove Comment*/
    $scope.removeCmnt = function (id) {
        $ionicLoading.show();
        $scope.postData.comment_id = id
        dataManager.post(CONFIG.HTTP_HOSTStaging + 'delete_comment.php', $scope.postData).then(function (response) {
            console.log(JSON.stringify(response))
            if (response.status == 'true') {
                $ionicLoading.hide();
                $scope.postDetail();
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
    /**Remove Reply*/
    $scope.removeReply = function (id) {
        $ionicLoading.show();
        $scope.postData.reply_id = id;
        dataManager.post(CONFIG.HTTP_HOSTStaging + 'delete_cmnt_reply.php', $scope.postData).then(function (response) {
            console.log(JSON.stringify(response))
            if (response.status == 'true') {
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
    $scope.deletePost = function () {
        $ionicPopup.confirm({
            title: 'Post',
            template: 'Are you sure you want to remove this question?'
        }).then(function (result) {
            if (result) {
                $scope.removePost();
            }
        });
    }
    $scope.deleteCmnt = function (id) {
        $ionicPopup.confirm({
            title: 'Comment',
            template: 'Are you sure you want to remove this comment?'
        }).then(function (result) {
            if (result) {
                $scope.removeCmnt(id);
            }
        });
    }
    $scope.deleteReply = function (id) {
        $ionicPopup.confirm({
            title: 'Reply',
            template: 'Are you sure you want to remove this reply?'
        })
            .then(function (result) {
                if (result) {
                    $scope.removeReply(id);
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
                //toastService.showToast(response.message);
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
            template: '<input type = "text" ng-model = "postData.reply"> ',
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
        }, function (error) {
            $ionicLoading.hide();
            console.log(error);
            toastService.showToast(CONFIG.connerrmsg);
        });
    }
    /**Report popup */
    $scope.reportPopUp = function () {
        var template = '<div class="report-box-main"><input type = "radio" value="abuse" name="report_type" ng-model = "postData.report_type" class="report-radio"><span class="report-text">Abuse</span></div>';
        template += '<div class="report-box-main"><input type = "radio" value="other" name="report_type" ng-model = "postData.report_type" class="report-radio"><span class="report-text">Other</span><div>';
        $ionicPopup.show({
            template: template,
            title: 'Report',
            subTitle: '',
            scope: $scope,

            buttons: [
                { text: 'Cancel' }, {
                    text: '<b>Done</b>',
                    type: 'button-positive',
                    onTap: function (e) {
                        if (!$scope.postData.report_type) {
                            //don't allow the user to close unless he enters model...
                            e.preventDefault();
                        } else {
                            $scope.postData.report_comment = $scope.postData.report_type;
                            console.log("post_report", $scope.postData.report_type);
                            $scope.post_report();
                            // return $scope.postData.model;
                        }
                    }
                }
            ]
        });
    }

    /**Reply on comment */
    $scope.post_report = function () {
        $ionicLoading.show({
            template: "Loading.."
        });
        dataManager.post(CONFIG.HTTP_HOSTStaging + 'postreport.php', $scope.postData).then(function (response) {
            console.log(JSON.stringify(response))
            if (response.status == 'true') {
                $scope.postData.post_report = '';
                // $scope.postDetail();
                $ionicLoading.hide();
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
    $scope.users = UserRetriever.getusers("...");
    $scope.users.then(function (data) {
        $scope.users = data;
    });

    $scope.getusers = function () {
        return $scope.users;
    }

    $scope.doSomething = function (typedthings) {
        console.log("Do something like reload data with this: " + typedthings);
        $scope.newusers = UserRetriever.getusers(typedthings);
        $scope.newusers.then(function (data) {
            $scope.users = data;
        });
    }

    $scope.doSomethingElse = function (suggestion) {
        console.log("Suggestion selected: " + suggestion);
    }
    $scope.bookmark = function (type) {
        $scope.postData.is_bookmark = type;
        $ionicLoading.show({
            template: "Loading.."
        });
        dataManager.post(CONFIG.HTTP_HOSTStaging + 'postBookmark.php', $scope.postData).then(function (response) {
            if (response.status == 'true') {
                $scope.postDetail();
                $ionicLoading.hide();
                toastService.showToast(response.message);
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

    $scope.$watch('localData.id', function () {
        var start = 0;
        $scope.selectedUser = [];
        console.log("names", $scope.names);
        console.log("localData", $scope.localData.id);
        if ($scope.localData.id.length > 0) {
            for (f = 0; f < $scope.names.length; f++) {
                if ($scope.localData.id.indexOf($scope.names[f].value) != '-1') {
                    $scope.selectedUser.push($scope.names[f]);
                }
            }
        }
    });

});
