
ctrl.controller('referCtrl', function ($scope, $state, $ionicPopup,
            $ionicLoading, $localStorage, $ionicPlatform,
            dataManager, CONFIG, sessionService,
            toastService, $cordovaSocialSharing) {
              console.log("refer controller")
        $scope.refer = function(via) {
          console.log("share via facebook")
            var message = "Please check this post";
            var subject = "Subject";
            var file = "www/img/logo.png";
            var link = "https://www.thepolyglotdeveloper.com";
            if(via == 'fb') {
              $cordovaSocialSharing
              .shareViaFacebook(message, file, link) // Share via native share sheet
              .then(function(result) {
                  console.log("Result", result);
                // Success!
              }, function(err) {
                console.log("error", err)
                toastService.showToast("You can't share!");
                // An error occured. Show a message to the user
              });
            } else {
              $cordovaSocialSharing
              .shareViaWhatsApp(message, file, link) // Share via native share sheet
              .then(function(result) {
                  console.log("Result", result);
                // Success!
              }, function(err) {
                console.log("error", err);
                toastService.showToast("You can't share!");
                // An error occured. Show a message to the user
              });
            }            
        }

})
;