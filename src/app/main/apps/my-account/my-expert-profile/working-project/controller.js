(function () {
  'use strict';

  angular
    .module('app.myAccount')
    .controller('MyExpertProfileWorkingProjectController', MyExpertProfileWorkingProjectController);

  /** @ngInject */
  function MyExpertProfileWorkingProjectController($rootScope, $scope, $state, $stateParams, UserProfileApi) {
    $scope.isSkip = $rootScope.userInfo.userAppConfiguration.skipWorkingProjectDialog;
    var userId = $stateParams.id;
    if (userId == null || userId == 0) {
      userId = $rootScope.userInfo.userId;
    }

    $scope.allowCRUD = (userId == $rootScope.userInfo.userId);
    $scope.workingProjects = [];
    $scope.workingProject = {};
    $scope.deleteItemId = null;

    function _search() {
      UserProfileApi.getAllWorkProjectExperience(userId).then(function (data) {
        $scope.workingProjects = data;
      });
    }

    function _resetForm() {
      $scope.workingProject = {
        position: null,
        projectName: null,
        projectLocation: null,
        projectDuration: null,
        solution: null,
        experience: null,

        userProfileId: userId,
      };
    }

    function _editItem(id) {
      UserProfileApi.getWorkProjectExperienceById(id).then(function (data) {
        $scope.workingProject = data;

        $("#ModalNewEditProject").modal('show');
      });
    }

    function _saveItem(item) {
      UserProfileApi.saveWorkProjectExperience(item).then(function (data) {
        $scope.workingProject = data;

        _search();
        _resetForm();
        $("#ModalNewEditProject").modal('hide');
      });
    }

    function _tryDeleteItem(id) {
      if (!$rootScope.userInfo.userAppConfiguration.skipWorkingProjectDialog) {
        $scope.deleteItemId = id;
        $("#ModalRemove").modal('show');
      } else {
        _deleteItem(id, false);
      }
    }

    function _deleteItem(id, needUpdateSkip) {
      if (needUpdateSkip == false) {
        UserProfileApi.deleteWorkProjectExperience(id, false).then(function (data) {
          $scope.workingProject = data;
          $rootScope.userInfo.userAppConfiguration.skipWorkingProjectDialog = $scope.isSkip;
          UserProfileApi.saveUserInfo($rootScope.userInfo);
          _search();
          $("#ModalRemove").modal('hide');
        });
      } else {
        UserProfileApi.deleteWorkProjectExperience(id, $scope.isSkip).then(function (data) {
          $rootScope.userInfo.userAppConfiguration.skipWorkingProjectDialog = $scope.isSkip;
          UserProfileApi.saveUserInfo($rootScope.userInfo);
          $scope.workingProject = data;
          _search();
          $("#ModalRemove").modal('hide');
        });
      }
    }

    $scope.search = _search;
    $scope.resetForm = _resetForm;
    $scope.editItem = _editItem;
    $scope.saveItem = _saveItem;
    $scope.tryDeleteItem = _tryDeleteItem;
    $scope.deleteItem = _deleteItem;
    $scope.search();
  }
})();
