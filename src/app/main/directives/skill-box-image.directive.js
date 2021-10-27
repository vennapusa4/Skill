/**
 * @author v.lugovksy
 * created on 16.12.2015
 */
(function () {
    'use strict';

    angular.module('app.home')
        .directive('skillBoxImage', skillBoxImage);

    /** @ngInject */
    function skillBoxImage(CommentApi) {

        return {
            restrict: 'AE',
            scope: {
                data: '=',
            },
            controller: function () {

            },
            templateUrl: 'app/main/directives/skill-box-image.html',
            link: function ($scope, $element) {

                var $scope = $scope;
                var $data = $scope.data;
                var $element = $($element);

                // Toggle class checked after clicking button. LIBRARY
                $element.find('.i_btn a.library-count').click(function (e) {

                    var _this = this;
                    if ($(this).hasClass('checked')) {

                        CommentApi.like($data.KDId, false).then(function () {
                            $data.SaveLibraryCount--;
                            $(_this).toggleClass('checked');
                        });
                    }
                    else {

                        CommentApi.like($data.KDId, true).then(function () {
                            $data.SaveLibraryCount++;
                            $(_this).toggleClass('checked');
                        });
                    }
                    e.preventDefault();
                });
            }
        };
    }
})();