// Ionic Starter App

// angular.module is a global place for creating, registering and retrieving Angular modules
// 'starter' is the name of this angular module example (also set in a <body> attribute in index.html)
// the 2nd parameter is an array of 'requires'
// 'starter.controllers' is found in controllers.js
mobiscroll.settings = {
  theme: 'ios',
  display: 'bottom'
};
var app = angular.module('starter', ['ionic', 'starter.controllers', 'starter.services', 'starter.dnf', 'starter.daf',
  'starter.dmf', 'ngCordova', 'autocomplete', 'mobiscroll-select', 'mobiscroll-form']);

app.run(function ($ionicPlatform, $rootScope, $cordovaDevice, $localStorage, $ionicHistory, $state) {
  $ionicPlatform.ready(function () {
    $ionicPlatform.registerBackButtonAction(function (event) {
      event.preventDefault();
      if ($state.current.name == "app.my_profile" || $state.current.name == "app.change_password"
        || $state.current.name == "app.refer_friends" || $state.current.name == "app.faq"
        || $state.current.name == "app.addquestion" || $state.current.name == "app.profile" || $state.current.name == "app.postDetail"
      ) {
        $localStorage.goDetail = "";
        $rootScope.goBack("rightmenu.dashboard");
      }
      else {
        navigator.app.exitApp();
        // $ionicHistory.goBack();
      }
    }, 100);
    // Hide the accessory bar by default (remove this to show the accessory bar above the keyboard
    // for form inputs)
    if (window.cordova && window.cordova.plugins.Keyboard) {
      cordova.plugins.Keyboard.hideKeyboardAccessoryBar(true);
      cordova.plugins.Keyboard.disableScroll(true);

    }
    if (window.StatusBar) {
      // org.apache.cordova.statusbar required
      StatusBar.styleDefault();
    }

    // cordova.plugins.diagnostic.isLocationEnabled(successCallback, errorCallback);
    // function successCallback(res) {
    //   console.log("Location is " + (res ? "Enabled" : "not Enabled"));
    //   !res ? cordova.plugins.diagnostic.switchToLocationSettings() : '';
    // }
    // function errorCallback(err) {
    //   console.log("Error: " + JSON.stringify(err));
    // }

    var device_uuid = "6549874321321";
    var device_type = 3;
    // if(ionic.Platform.isAndroid()) {
    //   var device_type = 1;
    // } else if(ionic.Platform.isIOS() || ionic.Platform.isIPad()) {
    //   var device_type = 2;
    // } else {
    //   var device_type = 3;
    // }
    // if(device_type != 3) {
    //   var device_uuid = $cordovaDevice.getUUID();
    // }
    var device_name = "Windows 7";
    // if(device_type != 3) {
    //   var device_name = $cordovaDevice.getModel();
    // }
    $rootScope.deviceInfo = {
      device_type: device_type,
      device_uuid: device_uuid,
      device_token: 'skfhjdsfdsjflhsdfkh',
      device_name: device_name
    };
    $rootScope.goBack = function (state) {
      $ionicHistory.nextViewOptions({
        disableBack: true
      });
      $state.go(state);
    }
  });
});
