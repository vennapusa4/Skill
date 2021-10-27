/**
 * @author v.lugovksy
 * created on 16.12.2015
 */
(function () {
    'use strict';

    angular.module('app.ProfilePage')
        .directive('profilePageEvents', profilePageEvents);

    /** @ngInject */
    function profilePageEvents() {

        return {
            restrict: 'E',
            scope: {
                event: "="
            },
            controller: function ($scope) {      

            },
            templateUrl: 'app/main/apps/profile-page/directives/profile-page-events.html'
            
        };
    }
})();
