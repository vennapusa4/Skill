/**
 * @author v.lugovksy
 * created on 16.12.2015
 */
(function () {
    'use strict';

    angular.module('app.home')
        .directive('skillReplicate', skillReplicate);

    /** @ngInject */
    function skillReplicate(KnowledgeDocumentApi) {

        return {
            restrict: 'AE',
            scope: {
                data: '=',
            },
            controller: function () {

            },
            templateUrl: 'app/main/directives/skill-replicate.html',
            link: function ($scope, $element) {

                var $scope = $scope;
                var $data = $scope.data;
                var $element = $($element);

                // Toggle class checked after clicking button. LIKE
                $element.find('a').click(function (e) {

                    var _this = this;
                    if ($(this).hasClass('checked')) {

                        KnowledgeDocumentApi.replicate($data.KDId, false).then(function () {
                            $data.ReplicatesCount--;
                            $(_this).toggleClass('checked');
                        });
                    }
                    else {

                        KnowledgeDocumentApi.replicate($data.KDId, true).then(function () {
                            $data.ReplicatesCount++;
                            $(_this).toggleClass('checked');
                        });
                    }
                    e.preventDefault();
                });
            }
        };
    }
})();