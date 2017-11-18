angular.module('starter.daf', [])
        .factory('dataAccessFactory', ['$http', function ($http) {

                "use strict";
                return {
                    post: post,
                    get: get,
                    delete_data: delete_data
                }
                function post(url, data) {

                    return $http({
                        method: 'POST',
                        url: url,
                        data: data, //forms user object
                        headers: {'Content-Type': 'application/x-www-form-urlencoded'}
                    });

                }
                function get(url, data) {

                }
                function delete_data(url, data) {

                }

            }]);





