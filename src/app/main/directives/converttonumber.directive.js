/**
 * @author v.lugovksy
 * created on 16.12.2015
 */
(function () {
    'use strict';

    angular.module('app.landingPage')
        .directive('convertToNumber', convertToNumber);

    /** @ngInject */
    function convertToNumber() {

        return {
            require: 'ngModel',
            link: function(scope, element, attrs, ngModel) {
              ngModel.$parsers.push(function(val) {
                return val != null ? parseInt(val, 10) : null;
              });
              ngModel.$formatters.push(function(val) {
                return val != null ? '' + val : null;
              });
            }
        }
    }
})();
