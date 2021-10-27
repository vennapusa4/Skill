/**
 * @author v.lugovksy
 * created on 16.12.2015
 */
(function () {
    'use strict';

    angular.module('app.collection')
        .directive('kdCollection', kdCollection);

    /** @ngInject */
    function kdCollection(CollectionApi, $log, logger) {
        return {
            restrict: 'AE',
            scope: {
                idForm: "=",
                ngModel: '=data',
                onSaved: "&onSaved"
            },
            controller: function ($scope, $rootScope) {
                try { $scope.isAdmin = $rootScope.userInfo.isAdmin } catch (ex) { }

                $scope.ngModel = $scope.ngModel || { recents: [], collections: [] };
                $scope.idForm = $scope.idForm || "";
                $scope.approve = function () {
                    var datapost = {
                        isAdmin: $scope.ngModel.isAdmin,
                        recents: $scope.ngModel.recents,
                        collections: $scope.ngModel.collections
                    }
                    CollectionApi.addKdToCollections({ kd_id: $scope.ngModel.kd_id, data: datapost }, function (response) {
                        $log.info('Added collections to knowledge successfully.');
                        $scope.onSaved({ data: true });
                    },
                        function (response) {
                            logger.error(response.data.errorMessage);
                        });

                }
            },
            templateUrl: 'app/main/apps/collection/_directives/kd-collection.html',
        };
    }
})();
