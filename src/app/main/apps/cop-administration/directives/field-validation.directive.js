/**
 * @author v.lugovksy
 * created on 16.12.2015
 */
(function () {
    'use strict';
  
    angular.module('app.adminSetting')
      .directive('fieldValidation', fieldValidation);
  
    /** @ngInject */
    function fieldValidation() {
      return {
        restrict: 'A',
        require: 'ngModel',
        link: link 
      }

      function link(scope, elem, attrs, ngModel) {
        ngModel.$parsers.push(function(viewValue) {
            var reg = /^[^`~!@#$%\^&\s*()_+={}|[\]\\:';"<>?,/-]*$/;
            // if view values matches regexp, update model value
            if (viewValue.match(reg)) {
              return viewValue;
            }
            // keep the model value as it is
            var transformedValue = ngModel.$modelValue;
            ngModel.$setViewValue(transformedValue);
            ngModel.$render();
            return transformedValue;
          });
    }
        
    }
  })();
  