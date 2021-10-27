/**
 * @author v.lugovksy
 * created on 16.12.2015
 */
(function () {
    'use strict';

    angular.module('app.home')
        .directive('skillTips', skillTips);

    /** @ngInject */
    function skillTips() {

        return {
            restrict: 'AE',
            scope: false,
            templateUrl: 'app/main/directives/skill-tips.html',
            link: function ($scope, $element) {

                var $scope = $scope;
                var $element = $($element);

                $element.find('.dd_tips > a').on('click', function () {
                    $(this).parent().toggleClass('open');
                });
            }
        };
    }
})();