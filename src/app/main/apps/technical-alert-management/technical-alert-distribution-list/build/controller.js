(function () {
  "use strict";

  angular
    .module("app.email")
    .controller(
      "TechnicalAlertDistributionListBuildController",
      TechnicalAlertDistributionListBuildController
    );
  /** @ngInject */
  function TechnicalAlertDistributionListBuildController(
    $scope,
    $timeout,
    UserProfileApi,
    EmailApi,
    $stateParams,
    $state,
    logger,
    $q,
    ValidatorService,
    CommonApi,
    SearchApi
  ) {

    $scope.formData = {};
    EmailApi.getDistributionListUserTypes().then(function(data) {
        $scope.distributionListUserTypes = data.distributionListUserType;
    });

    $scope.Users = {
        dataTextField: "title",
        dataValueField: "id",
        filter: "contains",
        minLength: 1,
        delay: 500,
        dataSource: {
            serverFiltering: true,
            transport: {
                read: function (options) {
                    return UserProfileApi.getAllUsersBySearchTerm(options);
                }
            },
        },
        open: function (e) {
            $timeout(function () {
                e.sender.list.closest('.k-animation-container').find('.k-list-container').addClass('multiselect_panel no_grouping');
            });
        },
        select: function (e) {
            if(!$scope.formData) $scope.formData = {};
            $scope.formData.id = e.dataItem.id;
            $scope.formData.userEmail = e.dataItem.userEmail;
            $scope.formData.userName = e.dataItem.userName;
            // UserProfileApi.getProfile(e.dataItem.id).then(function(data){
            //     if(data) {
            //         $scope.Field = data;
            //     }
            // });
            $scope.Field.EndorserID = e.dataItem.name;
            $scope.Field.EndorserName = e.dataItem.displayName;
        }
    };
    $scope.businessSectors = [];
    CommonApi.getAllBusinessSectors().then(function (businessSectors) {
        // get list userTypes
       $scope.businessSectors = businessSectors
    });

    
    $scope.userTypeSelected = function(selected) {
        if(!$scope.formData) $scope.formData = {};
        $scope.formData.DistListUserTypeId = selected.id;
    }

    $scope.changeBusinessSectors = function(selected) {
        if(!$scope.formData) $scope.formData = {};
        $scope.formData.businessSectorTypeId = selected.id;
    }

    function _submit(e) {
        e.preventDefault();
        debugger;
        EmailApi.addDistributionListUser($scope.formData).then(function(data){
            if(data.result) {
                logger.success('User successfully added');
                $state.go("appAdmin.technicalAlert.distributions");
            }
        }, function(error) {
            if(error.status === 300) {
                logger.error("User alread exists");
            }
        });
    }
    function _cancel() {
        $state.go("appAdmin.technicalAlert.distributions");
    }

    $scope.cancel = _cancel;
    $scope.submit = _submit;

  }
})();
