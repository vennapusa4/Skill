(function () {
    'use strict';

    angular
        .module('app.knowledgeDiscovery')
        .controller('KnowledgeCompletedController', KnowledgeCompletedController);

    /** @ngInject */
    function KnowledgeCompletedController($scope, $stateParams, KnowledgeDiscoveryApi, Utils) {

        $scope.Knowledge = {};
        $scope.like = {};
        $scope.bookmark = {};
        $scope.getImage = Utils.getImage;
        $scope.params = $stateParams;

        $scope.getType = function () {
            switch ($stateParams.type) {
                case 'BP':
                    return 'Best Practice';
                case 'LL':
                    return 'Lesson Learnt';
                case 'Pub':
                default:
                    return 'Publication';
            }
        };

        $scope.getNewForm = function () {
            switch ($stateParams.type) {
                case 'BP':
                    return '/knowledge-discovery/best-practices/build';
                case 'LL':
                    return '/knowledge-discovery/lessons-learnt/build';
                case 'Pub':
                default:
                    return '/knowledge-discovery/publications/build';
            }
        };

        KnowledgeDiscoveryApi.api.Complete.get({ type: $stateParams.type, id: $stateParams.id }).$promise.then(function (res) {
            $scope.Knowledge = res;
            $scope.like = { isLiked: _.get(res, 'newDocument.isLiked'), totalLikesCount: _.get(res, 'newDocument.totalLikesCount'), kdId: $stateParams.id };
            $scope.bookmark = { isShared: _.get(res, 'newDocument.isShared'), totalSaveLibraryCount: _.get(res, 'newDocument.totalSaveLibraryCount'), kdId: $stateParams.id };
        });
    }
})();