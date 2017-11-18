angular.module('starter.dmf', [])
        .factory('dataManager', ['$q', 'dataAccessFactory', 'ConnectivityMonitor', '$ionicPopup', '$ionicPlatform', '$ionicLoading', 'CONFIG', function ($q, dataAccessFactory, ConnectivityMonitor, $ionicPopup, $ionicPlatform, $ionicLoading, CONFIG) {

                return {
                    post: post,
                    get: get
                }

                function post(url, data) {
                    var checkNet = ConnectivityMonitor.isOnline();
                    if(checkNet){
                        var deferred = $q.defer();
                        dataAccessFactory.post(url, data).success(function (data, status, headers, config, statusText) {
                               // alert(status);
                            deferred.resolve(data, status, headers, config, statusText);
                        }).error(function (data, status, headers, config, statusText, err) {
                            //alert(status);
                            deferred.reject(data, status, headers, config, statusText, err);
                        });
                        return deferred.promise;
                    } else {
                        $ionicLoading.hide();
                        var alertPopup = $ionicPopup.alert({
                        title: CONFIG.NTWORKTITLE,
                        template: CONFIG.connerrmsg
                        });

                        alertPopup.then(function(res) {
                        navigator.app.exitApp(); //<-- remove this line to disable the exit
                        });
                    }
                        
                }

                function get(url, data) {

                }

            }]);



