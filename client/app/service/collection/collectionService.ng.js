angular.module("entraide").factory("CollectionService", function($meteor){

    var collectionService = {
        subscriptions : [{
                name: "Search events by profile",
                id: "search-events",
                started: false
            }, {
                name: "My events",
                id: "my-events",
                started: false
            }, {
                name: "All Events",
                id: "all-events",
                started: false
            }],

        get : function(subscriptionId){
            var subscribtion = _.find(this.subscriptions, {id:subscriptionId});
            if(subscribtion.started){

            } else {
                return $meteor.subscribe(subscriptionId).then(function(handle) {
                    sub.handle = handle;
                });
            }

        }
    };

    return collectionService;
});