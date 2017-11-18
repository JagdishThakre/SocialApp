app.config(function ($stateProvider, $urlRouterProvider) {
    /**Application routing defined here*/
    $stateProvider
            /**Sidemenu state */
            .state('app', {
                url: '/app',
                abstract: true,
                templateUrl: 'templates/menu.html',
                controller: 'AppCtrl'
            })
            /**Login page state */
            .state('login', {
                url: '/login',
                templateUrl: 'templates/auth/login.html',
                controller: 'loginCtrl'
            })
            /**Registration state */
            .state('signup', {
                url: '/signup',
                templateUrl: 'templates/auth/signup.html',
                controller: 'signupCtrl'
            })
            /**Forgot password state */
            .state('forgot_pwd', {
                url: '/forgot_pwd',
                templateUrl: 'templates/auth/forgot_pwd.html',
                controller: 'forgotPwdCtrl'
            })
            /**faq page state */
            .state('app.faq', {
                url: '/faq',
                views: {
                    'menuContent': {
                        templateUrl: 'templates/faq.html',
                        controller: 'faqCtrl'
                    }
                }
            })
            /**Refer application to friend state */
            .state('app.refer_friends', {
                url: '/refer_friends',
                views: {
                    'menuContent': {
                        templateUrl: 'templates/refer_friends.html',
                        controller: 'referCtrl'
                    }
                }
            })
            /**Change password state*/
            .state('app.change_password', {
                url: '/change_password',
                views: {
                    'menuContent': {
                        templateUrl: 'templates/change_password.html',
                        controller: "changePwdCtrl"
                    }
                }
            })
            /**add question page state */
            .state('app.addquestion', {
                url: '/addquestion',
                views: {
                    'menuContent': {
                        templateUrl: 'templates/dashboard/addquestion.html',
                        controller: 'queCtrl'
                    }
                }
            })
            /**User profile page state */
            .state('app.my_profile', {
                url: '/my_profile',
                views: {
                    'menuContent': {
                        templateUrl: 'templates/my_profile.html',
                        controller: 'profileCtrl'
                    }
                }
            })
            /**Application dashboard state */
            .state('app.dashboard', {
                url: '/dashboard',
                views: {
                    'menuContent': {
                        templateUrl: 'templates/dashboard/dashboard.html',
                        controller: 'dashCtrl'
                    }
                }
            })
            .state('app.postDetail', {
                url: '/postDetail/:post_id',
                views: {
                    'menuContent': {
                        templateUrl: 'templates/dashboard/question_detail.html',
                        controller: 'postDeatilCtrl'
                    }
                }
            });
    /* if none of the above states are matched, use this as the fallback*/
    /**If user not logged in, then login state otherwise dashboard state */
    if(localStorage.UserId) {
        $urlRouterProvider.otherwise('/app/dashboard');
    } else {
        $urlRouterProvider.otherwise('/login');
    }
});