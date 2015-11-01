angular.module('entraide', ['angular-meteor', 'ui.router', 'uiGmapgoogle-maps']);

angular.module('entraide').config(function($provide) {
    $provide.decorator('$state', function($delegate, $stateParams) {
        $delegate.forceReload = function() {
            return $delegate.go($delegate.current, $stateParams, {
                reload: true,
                inherit: false,
                notify: true
            });
        };
        return $delegate;
    });
});

angular.module('entraide').config(['$urlRouterProvider', '$stateProvider', '$locationProvider', function ($urlRouterProvider, $stateProvider, $locationProvider) {

    $urlRouterProvider.when("",  "/home");
    $urlRouterProvider.when("/", "/home");
    $urlRouterProvider.otherwise("/home");

    $stateProvider
        .state('home', {
            url: '/home',
            templateUrl: 'client/home/home.ng.html'
        })

        .state('app', {
            templateUrl: 'client/app/app.ng.html'
        })

        .state('app.main', {
            views: {
                'header-view@app': {
                    templateUrl: 'client/app/header/header.ng.html',
                    controller: 'HeaderCtrl'
                },
                'notification-view@app': {
                    templateUrl: 'client/app/notification/notification.ng.html',
                    controller: 'NotificationCtrl'
                },
                'side-left-view@app': {
                    templateUrl: 'client/app/side/left/side-left.ng.html',
                    controller: 'SideLeftCtrl'
                },
                'content-view@app': {
                    templateUrl: 'client/app/map/map.ng.html'
                },
                'footer-view@app': {
                    templateUrl: 'client/app/footer/footer.ng.html',
                    controller: 'FooterCtrl'
                }
            }
        })

        .state('app.main.events', {
            url: '/events',
            abstract: true,
            template: '<ui-view/>',
            'side-left-view@app.main': {
                templateUrl: 'client/app/side/left/side-left.ng.html',
                controller: 'SideLeftCtrl'
            }
        })
        .state('app.main.events.search', {
            url: '/search',
            abstract: true,
            template: '<ui-view/>'
        })

        /*********************************************************/
        /*
        *                   ADMIN STATES
        *
        **********************************************************/

        .state('app.main.admin', {
            url: '/admin',
            abstract: true,
            template: '<ui-view/>',
            views: {
                'notification-view@app': {}
            },
            resolve: {
                "currentUser": ["$meteor", "SecurityService", function($meteor, SecurityService){
                    return $meteor.requireValidUser(function(user) {
                        return SecurityService.isAdmin(user);
                    });
                }]
            }
        })
        .state('app.main.admin.users', {
            url: '/users',
            abstract: true,
            template: '<ui-view/>'
        })
        .state('app.main.admin.events', {
            url: '/events',
            abstract: true,
            template: '<ui-view/>'
        })
        .state('app.main.admin.users.all', {
            url: '/all',
            views: {
                'content-view@app': {
                    templateUrl: 'client/app/admin/users/list/all-users-list.ng.html',
                    controller: 'AllUsersListCtrl'
                }
            }
        })
        .state('app.main.admin.users.edit', {
            url: '/edit/:userId',
            views: {
                'content-view@app': {
                    templateUrl: 'client/app/admin/users/edit/user-edit.ng.html',
                    controller: 'EventEditCtrl'
                }
            }
        })
        .state('app.main.admin.events.all', {
            url: '/all',
            views: {
                'content-view@app': {
                    templateUrl: 'client/app/admin/events/list/all-events-list.ng.html',
                    controller: 'AllEventsListCtrl'
                }
            }
        })
        .state('app.main.admin.events.edit', {
            url: '/edit/:eventId',
            views: {
                'content-view@app': {
                    templateUrl: 'client/app/admin/events/edit/event-edit.ng.html',
                    controller: 'EventEditCtrl'
                }
            }
        })


        /*********************************************************/
        /*
         *               COMMUNITY STATES
         *
         **********************************************************/

        .state('app.main.events.search.byProfile', {
            url: '/byProfile',
            views: {
                'content-view@app': {
                    templateUrl: 'client/app/events/search/byProfile/search-events-list.ng.html',
                    controller: 'SearchEventsListCtrl'
                }
            }
        })
        .state('app.main.events.search.myEvents', {
            url: '/myEvents',
            views: {
                'content-view@app': {
                    templateUrl: 'client/app/events/search/myEvents/my-events-list.ng.html',
                    controller: 'MyEventsListCtrl'
                }
            },
            resolve: {
                "currentUser": ["$meteor", function($meteor){
                    return $meteor.requireUser();
                }]
            }
        })
        .state('app.main.events.detail', {
            url: '/detail/:eventId',
            views: {
                'content-view@app': {
                    templateUrl: 'client/app/events/detail/event-detail.ng.html',
                    controller: 'EventDetailCtrl'
                }
            },
            resolve: {
                "currentUser": ["$meteor", function($meteor){
                    return $meteor.requireUser();
                }]
            }

        })
        .state('app.main.events.create', {
            url: '/create',
            views: {
                'content-view@app': {
                    templateUrl: 'client/app/events/create/event-create.ng.html',
                    controller: 'EventCreateCtrl'
                }
            },
            resolve: {
                "currentUser": ["$meteor", function($meteor){
                    return $meteor.requireUser();
                }]
            }

        })
        .state('app.main.profile', {
            url: '/profile',
            abstract: true,
            template: '<ui-view/>'
        })
        .state('app.main.profile.edit', {
            url: '/edit/:userId',
            views: {
                'side-left-view@app.main': {
                    templateUrl: 'client/app/side/left/side-left.ng.html',
                    controller: 'SideLeftCtrl'
                }
            },
            resolve: {
                "currentUser": ["$meteor", function($meteor){
                    return $meteor.requireUser();
                }]
            }
        })
        .state('app.main.logout', {
            url: '/logout',
            resolve: {
                "logout": ["$meteor", "$state", function($meteor, $state){
                    return $meteor.logout().then(function(){$state.go('home');}, function(){$state.go('app.main.error');});
                }]
            }
        })
        .state('app.main.error', {
            url: '/error',
            abstract: true,
            template: '<ui-view/>'
        })
        .state('app.main.error.required', {
            url: '/required',
            views: {
                'content-view@app': {
                    template: '<div>You must be signed in to access this functionality</div>'
                }
            }
        })
        .state('app.main.error.unauthorized', {
            url: '/unauthorized',
            views: {
                'content-view@app': {
                    template: '<div>You must be authorized in order to access this functionality</div>'
                }
            }
        });
}]);

angular.module('entraide').run(["$rootScope", "$state", function ($rootScope, $state) {
    $rootScope.$on("$stateChangeError", function (event, toState, toParams, fromState, fromParams, error) {
        console.log(error);
        switch(error) {
            case "AUTH_REQUIRED":
                $state.go("app.main.error.required");
                break;
            case "FORBIDDEN":
                $state.go("home");
                break;
            case "UNAUTHORIZED":
                $state.go("app.main.error.unauthorized");
                break;
            default:
                $state.go("app.main.error");
        }
    });
}]);



