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
            /**Sidemenu state */
            .state('rightmenu', {
                url: '/rightmenu',
                abstract: true,
                templateUrl: 'templates/menu-right.html',
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
            /**premium page state */
            .state('app.premium', {
                url: '/premium',
                views: {
                    'menuContent': {
                        templateUrl: 'templates/premium.html',
                        controller: 'premiumCtrl'
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

            /**chat state */
            .state('app.chat', {
                url: '/chat',
                views: {
                    'menuContent': {
                        templateUrl: 'templates/chat.html',
                        controller: 'chatCtrl'
                    }
                }
            })

            /**chat  detail state */
            .state('app.chatdetail', {
                url: '/chatdetail/:to_user_id/:username/:chats',
                views: {
                    'menuContent': {
                        templateUrl: 'templates/chatdetail.html',
                        controller: 'chatCtrl'
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
            /**Profile page state */
            .state('app.profile', {
                url: '/profile',
                views: {
                    'menuContent': {
                        templateUrl: 'templates/profile.html',
                        controller: 'queProfileCtrl'
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
            .state('rightmenu.dashboard', {
                url: '/dashboard',
                views: {
                    'menuContent': {
                        templateUrl: 'templates/dashboard/dashboard.html',
                        controller: 'dashCtrl'
                    }
                }
            })
            /**Bookmark page state */
            .state('app.bookmark', {
                url: '/bookmark',
                views: {
                    'menuContent': {
                        templateUrl: 'templates/bookmark.html',
                        controller: 'bookmarkCtrl'
                    }
                }
            })
            .state('app.postDetail', {
                url: '/postDetail/:post_id/:type',
                views: {
                    'menuContent': {
                        templateUrl: 'templates/dashboard/question_detail.html',
                        controller: 'postDeatilCtrl'
                    }
                }
            });
    /* if none of the above states are matched, use this as the fallback*/
    /**If user not logged in, then login state otherwise dashboard state */
    var local = localStorage.getItem("UserId");
    if(local && local != null && local != undefined && local != '') {
        $urlRouterProvider.otherwise('/rightmenu/dashboard');
    } else {
        $urlRouterProvider.otherwise('/login');
    }
});
