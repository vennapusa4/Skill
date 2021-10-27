/**
 * @author v.lugovksy
 * created on 16.12.2015
 */
(function () {
  'use strict';

  angular.module('app.home')
    .directive('skillDateRangePicker', skillDateRangePicker);

  /** @ngInject */
  function skillDateRangePicker($timeout) {

    return {
      restrict: 'AE',
      scope: {
        startDate: '=',
        endDate: '=',
        periodDefault: '=',
        callback: '&',
        //period: '='
      },
      controller: function () {

      },
      templateUrl: 'app/main/directives/skill-date-range-picker.html',
      link: function ($scope, $element) {

        var $scope = $scope;
        var $element = $($element);

        if ($scope.period == null || $scope.period == '') $scope.period = 'year';
        if ($scope.periodDefault != undefined && $scope.periodDefault != null) $scope.period = $scope.periodDefault;
        //Date range filter
        $element.find(".range_filter").daterangepicker({
          minDate: moment().subtract(10, 'years'),
          maxDate: moment(),//.endOf('year')
          startDate: moment(),
          endDate: $scope.endDate,
          period: $scope.period,
          single: true,
          standalone: true,
          periods: ['month', 'quarter', 'year'],
          callback: function (startDate, endDate, period) {
            if ($scope.callback != null) {
              $scope.callback({ startDate: startDate, endDate: endDate, period: period });
            }
          }
        });

        $timeout(function () {
          $(".range_filter").find('.start-date:first').removeClass('start-date');
        }, 1000);

        $scope.$on('Clear', function (event, data) {
          $(".range_filter").find('.start-date:first').removeClass('start-date');
        });

      }
    };
  }
})();
