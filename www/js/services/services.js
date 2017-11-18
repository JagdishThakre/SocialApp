angular.module('starter.services', ['ngStorage'])
/**Store session or destroy */
.service('sessionService', ['$localStorage', function ($localStorage) {
    
    this.get = function (name) {
        return getItem(name);
    };
    /**Storing user login session */
    this.User = function(response) {
        $localStorage.User = response.data;
        localStorage.setItem("UserId", response.data.id);
    }

    return this;
}])

/**Toast message service*/
.service("toastService", ['$cordovaToast', function($cordovaToast) {
    this.showToast = function(msg) {
        $cordovaToast.showLongBottom(msg).then(function(success) {
            // success
        }, function (error) {
            // error
        });
    }
    return this;
}]);