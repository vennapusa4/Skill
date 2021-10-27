/**
 * @author v.lugovksy
 * created on 16.12.2015
 */
(function () {
    'use strict';

    angular.module('app.home')
        .directive('skillSlider', skillSlider);

    /** @ngInject */
    function skillSlider() {

        return {
            restrict: 'AE',
            scope: {
                data: '=',
            },
            controller: function () {

            },
            templateUrl: 'app/main/apps/home/directives/skill-slider.html',
            link: function ($scope, $element) {
                var $scope = $scope;
                var $element = $($element);
                $element.find('#Slider').hover(function () {
                    $(this).carousel('pause');
                }, function () {
                    $(this).carousel('cycle');
                });
            }
        };
    }
})();