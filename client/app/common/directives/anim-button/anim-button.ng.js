angular.module('entraide').directive('animButton', function(){

    return {
        restrict: 'AEC',
        replace: true,
        transclude: true,
        scope: {
            animButtonIcon: '@',
            animButtonType: '@',
            animButtonCallback: '&'
        },
        templateUrl: 'client/app/common/directives/anim-button/anim-button.ng.html',
        controller: function($scope){

        },
        link: function (scope, element) {
            var cbutton = element[0].querySelector('.animButton');
            scope.animButtonCallback();
            
            scope.$on("$destroy", function () {});
        }
    };

});