(function () {
  'use strict';

  angular
    .module('app.expertInterview')
    .controller('ExpertInterviewAddCompleteController', ExpertInterviewAddCompleteController);

  /** @ngInject */
  function ExpertInterviewAddCompleteController($scope, $stateParams, $log, ExpertInterviewApi) {

    $scope.expertInterviewId = $stateParams.id;
    $scope.expertInterview = {};

    var _getExpertInterviewDetail = function () {
      ExpertInterviewApi.getComplete($scope.expertInterviewId).then(function (res) {
        res.isNew = true;
        $scope.expertInterview = res;
      }, function (res) {
        if (res.status !== 404)
          $log.error(res.data.errorMessage);
      });
    };

    _getExpertInterviewDetail();
    $scope.getExpertInterviewDetail = _getExpertInterviewDetail;
  }
})();
