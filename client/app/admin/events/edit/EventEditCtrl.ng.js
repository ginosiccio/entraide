
angular.module('entraide').controller('EventEditCtrl', function ($scope, $meteor, $stateParams, $state, CollectionService) {

    CollectionService.subscribe('all-events').then(function(){
        $scope.event = $meteor.object(Events, $stateParams.eventId, false);
    });

    $scope.update = function(event){
        event.save().then(function(){
            $state.go("app.main.admin.events.all");
        }, function(error){alert(error);});
    }

});

