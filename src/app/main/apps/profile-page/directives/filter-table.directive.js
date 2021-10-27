/**
 * @author v.lugovksy
 * created on 16.12.2015
 */
(function () {
    'use strict';

    angular.module('app.ProfilePage')
        .directive('filterTable', filterTable);

    /** @ngInject */
    function filterTable() {

        return {
            restrict: 'E',
            scope: {
                tags:'=',
            },
            controller: function ($scope, appConfig,profileAPI,KnowledgeDiscoveryApi,KnowledgeDocumentApi, $rootScope, $location,UserProfileApi) {
                $scope.changeTag = function(data){
                    $scope.$emit('filterTableEvent',data);
                }
            },
            templateUrl: 'app/main/apps/profile-page/directives/filter-table.html',
        }
    }
})();
