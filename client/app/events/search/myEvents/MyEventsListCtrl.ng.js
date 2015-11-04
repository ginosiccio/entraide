angular.module('entraide').controller('MyEventsListCtrl', function ($rootScope, $scope, $meteor, $state, CollectionService, MapService, SessionService) {

    $scope.loading = true;

    CollectionService.subscribe('my-events'). then(function(events) {
        $scope.events = events;
        $scope.map = MapService.getMap(SessionService.getUserProfile().department.location);
        $scope.loading = false;
    });

    $scope.eventClicked = function(marker, eventName, event){
        $scope.$apply();
        $state.go("app.main.events.search.myEvents.edit", {"event" : event});
        $rootScope.$broadcast('event-edit', event);

    };

    $scope.$on('map-click', function(e, originalEventArgs) {
        $scope.$apply();
        $state.go("app.main.events.search.myEvents.create", {
            "event": {
                location: MapService.getCoord(originalEventArgs),
                department: SessionService.getUserProfile().department,
                owner: {id: SessionService.getUserProfile().user._id}
            }
        });
        $rootScope.$broadcast('event-create', $scope.event);
    });

});

