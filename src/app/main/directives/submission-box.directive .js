/**
 * @author v.lugovksy
 * created on 16.12.2015
 */
(function () {
    'use strict';

    angular.module('app.home')
        .directive('submissionBox', submissionBox);

    /** @ngInject */
    function submissionBox() {

        return {
            restrict: 'AE',
            scope: {
                data: '=',
            },
            controller: function ($scope, $state, $rootScope) {
                var stateName = $state.current.name;
                $scope.isShowCheckbox = false;
                if (stateName == 'app.myAccountUser.submissions.draft'
                    || stateName == 'app.myAccountUser.submissions.pendingValidation'
                    || stateName == 'app.myAccountUser.submissions.validated') {
                    $scope.isShowCheckbox = true;
                }

                function _getStatus(record) {
                    switch (stateName) {
                        case 'app.myAccountUser.submissions.pendingValidation':
                        case 'app.myAccountUser.submissions.validated':
                        case 'app.myAccountUser.submissions.amend':
                        case 'app.myAccountUser.submissions.rejected':
                            return record.status;
                        case 'app.myAccountUser.submissions.pendingEndorserment':
                        case 'app.myAccountUser.submissions.endorsed':
                        case 'app.myAccountUser.submissions.endorsermentAmend':
                        case 'app.myAccountUser.submissions.endorsermentRejected':
                            return record.endorsermentStatus;
                        default:
                            return record.status;
                    }
                };

                $scope.getStatus = _getStatus;

                $scope.selectChange = function (data) {
                    $rootScope.$broadcast("submissionSelectedChange", data);
                }
            },
            templateUrl: 'app/main/directives/submission-box.html',
        };
    }
})();
