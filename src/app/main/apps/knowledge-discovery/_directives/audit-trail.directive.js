/**
 * @author v.lugovksy
 * created on 16.12.2015
 */
(function () {
    'use strict';

    angular.module('app.knowledgeDiscovery')
        .directive('auditTrail', auditTrail);

    /** @ngInject */
    function auditTrail() {

        return {
            restrict: 'E',
            scope: {
                trail: '=',
                status:'='
            },
            controller: function ($scope, KnowledgeDiscoveryApi) {
                $scope.statusname;
                switch($scope.status)
                {
                    case "Review":$scope.statusname="Reviewed";
                    break;
                    case "Submit":$scope.statusname="Submitted";
                    break;
                    case "Approve":$scope.statusname="Approved";
                    break;
                }
            },
            templateUrl: 'app/main/apps/knowledge-discovery/_directives/audit-trail.html'
            
        };
    }
})();
