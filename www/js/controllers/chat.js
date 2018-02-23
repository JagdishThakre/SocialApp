//Chat controller 
ctrl.controller('chatCtrl', function ($scope, $timeout, $ionicScrollDelegate, $localStorage,
  $ionicPopup, $ionicLoading, $localStorage, $stateParams, $state,
  dataManager, CONFIG, sessionService, $timeout,
  toastService, $rootScope
) {
  $scope.userData = {};
  $scope.users = [];
  $scope.messages = [];
  $scope.userData.user_auth_token = $localStorage.User.user_auth_token;
  $scope.userData.user_id = $localStorage.User.id;
  $scope.hideTime = true;
  $scope.lastMsgId = '';
  var alternate,
    isIOS = ionic.Platform.isWebView() && ionic.Platform.isIOS();

  $scope.sendMessage = function () {
    if ($scope.data.message) {
      // $ionicLoading.show();
      $scope.userData.from_user_id = $scope.userData.user_id;
      $scope.userData.to_user_id = $stateParams.to_user_id;
      $scope.userData.msg = $scope.data.message;
      dataManager.post(CONFIG.HTTP_HOSTStaging + 'sendmsg.php', $scope.userData).then(function (response) {
        console.log("response ", response)
        if (response.status == 'true') {
          // $ionicLoading.hide();
          // $scope.messages = response.data;
          $scope.messages.push(response.data);
          $scope.lastMsgId = response.data.id;
          $scope.data.message = '';
          $ionicScrollDelegate.scrollBottom(true);
        } else {
          // $ionicLoading.hide();
          toastService.showToast(response.message);
        }
      }, function (error) {
        $ionicLoading.hide();
        console.log(error);
        toastService.showToast(CONFIG.connerrmsg);
      });
    } else { }
  };

  $scope.inputUp = function () {
    if (isIOS) $scope.data.keyboardHeight = 216;
    $timeout(function () {
     // $ionicScrollDelegate.scrollBottom(true);
    }, 300);
  };

  $scope.inputDown = function () {
    if (isIOS) $scope.data.keyboardHeight = 0;
    $ionicScrollDelegate.resize();
  };

  $scope.closeKeyboard = function () {
    // cordova.plugins.Keyboard.close();
  };

  $scope.data = {};

  $scope.chatUsers = function () {
    $ionicLoading.show();
    dataManager.post(CONFIG.HTTP_HOSTStaging + 'chatlist.php', $scope.userData).then(function (response) {
      console.log("response ", response)
      if (response.status == 'true') {
        $ionicLoading.hide();
        $scope.users = response.data;
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

  $scope.chatDetail = function () {
    // $ionicLoading.show();
    $scope.userData.from_user_id = $scope.userData.user_id;
    $scope.userData.to_user_id = $stateParams.to_user_id;
    if ($scope.lastMsgId != '') {
      $scope.userData.lastMsgId = $scope.lastMsgId;
    }
    dataManager.post(CONFIG.HTTP_HOSTStaging + 'chatdetail.php', $scope.userData).then(function (response) {
      console.log("response ", response)
      if (response.status == 'true') {
        // $ionicLoading.hide();
        if ($scope.lastMsgId == '') {
          $scope.messages = response.data;
          if (response.data.length != 0) {
            $scope.lastMsgId = $scope.messages[response.data.length - 1].id;
          }
          $ionicScrollDelegate.scrollBottom(true);
        } else {
          if (response.data.length != 0) {
            angular.forEach(response.data, function (value, key) {
              $scope.messages.push(value);
            });
            // $scope.messages.push(response.data);
            $scope.lastMsgId = response.data[response.data.length - 1].id;
            $ionicScrollDelegate.scrollBottom(true);
            console.log("$scope.lastMsgId ", $scope.lastMsgId);
          }
        }
      } else {
        // $ionicLoading.hide();
        toastService.showToast(response.message);
      }
    }, function (error) {
      // $ionicLoading.hide();
      console.log(error);
      toastService.showToast(CONFIG.connerrmsg);
    });
  }
  if ($state.current.name == 'app.chatdetail') {
    $scope.username = $stateParams.username;
    $scope.chattype = $stateParams.chats;
    // $scope.chatUsers(); 
    var chatInterval = setInterval(function () {
      $scope.chatDetail();
    }, 5000)
    $scope.$on('$destroy',function(){
      clearInterval(chatInterval);
    });
  }
  
});
