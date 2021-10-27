(function () {
  'use strict';

  angular
    .module('app.expertInterview')
    .controller('ExpertInterviewAddController', ExpertInterviewAddController);

  /** @ngInject */
  function ExpertInterviewAddController($scope, ExpertInterviewApi, ValidatorService, logger, UserProfileApi, $state, $rootScope, AutosaveService, $timeout, $stateParams) {

    var vm = this;

    $scope.disablePreview = true;
    ValidatorService.Rules($scope);
    $scope.userInfo = UserProfileApi.getUserInfo();
    $scope.expertInterviewObj = {
      id: $stateParams.id,
      userId: 0,
      title: "",
      content: "",
      coverId: 0,
      asCoverImage: false,
      extensionImage: "",
      attachments: [],
      isPreview: true
    };

    $scope.autoSaveMsg = "";
    $scope.AutoSave = function () {
      $scope.SaveData(false);
    };

    $scope.SaveData = function (isPreview) {
      // Have issue after Save without attachments

      if ($rootScope.idExpertInterviewStep1 != undefined) {
        $state.go('app.expertInterviewAddProfile', { id: decodeURIComponent($rootScope.idExpertInterviewStep1) });
      } else {
        $scope.expertInterviewObj.isPreview = isPreview;
        $scope.expertInterviewObj.userId = $scope.userInfo.userId;
        ExpertInterviewApi.saveExpertInterview($scope.expertInterviewObj).then(function (data) {
          $scope.loading = false;
          logger.success("Save successfully!");
          $rootScope.idExpertInterviewStep1 = data.id;
          $state.go('app.expertInterviewAddProfile', { id: decodeURIComponent(data.id) });
        }, function (error) {
          $scope.loading = false;
          console.log(error);
          logger.error(ValidatorService.ModelState(err.data.modelState));
        });
      }
    }

    $scope.$on('LoadImages', function ($event, attachments) {
      $scope.expertInterviewObj.attachments = [];
      if (attachments != null) {
        for (var i = 0; i < attachments.length; i++) {
          var att = attachments[i];
          $scope.expertInterviewObj.attachments.push(att.id);
          if (att.isCoverImage) {
            var fileName = att.name;
            var temp = fileName.split('.');
            $scope.expertInterviewObj.asCoverImage = true;
            $scope.expertInterviewObj.extensionImage = temp != null ? "." + temp[temp.length - 1] : "";
            $scope.expertInterviewObj.coverId = att.id;
          }
        }
      }
    });

    function _onInit() {
      if ($stateParams.id) {
        // Get ExpertInterview info
        ExpertInterviewApi.buildExpertInterview($stateParams.id).then(function (res) {
          $scope.expertInterviewObj.id = res.id;
          $scope.expertInterviewObj.title = res.title;
          $scope.expertInterviewObj.content = res.content;
          $scope.expertInterviewObj.userId = res.userId;
          $scope.disablePreview = false;

          // ToDo: Binding Attachment to Grid
        });
      }
    }

    function _Preview() {
      window.open('/expert-interview/' + $scope.expertInterviewObj.id, '_blank');
    };

    function _Submit(event) {
      event.preventDefault();
      if ($scope.Validator.validate()) {
        $scope.SaveData(false);
      }
    }

    function _AutoSave() {
      var errors = $scope.Validator.errors();
      //ExpertInterviewApi.saveExpertInterview($scope.expertInterviewObj).then(function (data) {
      //  logger.success('Autosave successfully!');
      //  $rootScope.idExpertInterviewStep1 = data.id;
      //  if ($scope.expertInterviewObj.id == 0) {
      //    $scope.expertInterviewObj.id = data.id;
      //  };
      //  $scope.disablePreview = false;
      //  $state.transitionTo($state.current, { id: data.id }, {
      //    reload: false, inherit: false, notify: false
      //  });
      //}, function (err) {
      //  logger.error(err.data.message);
      //});
    };

    $timeout(function () {
      AutosaveService.register(_AutoSave);
    }, 1000);

    $scope.$on("$destroy", function () {
      AutosaveService.destroy();
    });

    _onInit();
    $scope.OnInit = _onInit;
    $scope.Preview = _Preview;
    $scope.Submit = _Submit;
  }
})();

