/**
 * @author v.lugovksy
 * created on 16.12.2015
 */
(function () {
    'use strict';

    angular.module('app.landingPage')
        .directive('workingLoader', workingLoader);

    /** @ngInject */
    function workingLoader() {

        return {
            restrict: 'E',
            scope: {
              pagename: '='
            },
            controller: function ($scope , $element, AdminSettingCoPApi, appConfig , CollectionApi, $log, logger) {
               // $scope.article.description = $scope.article.description.slice(0, 270)+"...";

            

            },
            templateUrl: 'app/main/directives/working-loader.html'
            
        };
    }
})();
