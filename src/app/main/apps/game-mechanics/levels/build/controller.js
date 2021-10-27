
(function () {
  'use strict';

  angular
    .module('app.gameMechanics')
    .controller('GameMechanicsEditLevelController', GameMechanicsEditLevelController);

  /** @ngInject */
  function GameMechanicsEditLevelController($scope, $timeout, MasterDataGameMechanicsApi, $stateParams, $state, logger, $q, Utils, appConfig, ValidatorService) {
    ValidatorService.Rules($scope);
    $scope.itemId = $stateParams.id;
    $scope.LevelChoices = [];
    $scope.ConditionTypes = [
      { id: 1, name: 'Point' },
      { id: 2, name: 'Rank' }
    ];
    $scope.LevelObject = {
      name: '',
      description: '',
      levelPhoto: null,
      isUpdatePhoto: false,
      levelConditions: [
        {
          id: 0,
          levelId: ($stateParams.id || 0),
          levelConditionTypeId: null,
          levelChoiceId: null,
          value: 0,
          condition: ''
        }
      ]
    };

    // Bind default data
    function _loadData() {
      var lstDefer = [];

      var deferConditionTypes = MasterDataGameMechanicsApi.getAllLevelConditionTypes().then(function (data) {
        $scope.ConditionTypes = data;
      });
      lstDefer.push(deferConditionTypes);

      var deferLevelChoice = MasterDataGameMechanicsApi.getAllLevelChoice().then(function (data) {
        $scope.LevelChoices = data;
      });
      lstDefer.push(deferLevelChoice);

      if ($scope.itemId) {
        $q.all(lstDefer).then(function () {
          MasterDataGameMechanicsApi.getLevelById($scope.itemId).then(function (response) {
            $scope.LevelObject = response;
          }, function (error) {
            logger.error(error.data.message);
          });
        });
      } else {
        $q.all(lstDefer).then(function () {
          $timeout(function () {
            if ($scope.ConditionTypes && $scope.ConditionTypes.length > 0) {
              $scope.LevelObject.levelConditions[0].levelConditionTypeId = $scope.ConditionTypes[0].id;
            }
            if ($scope.LevelChoices && $scope.LevelChoices.length > 0) {
              $scope.LevelObject.levelConditions[0].levelChoiceId = $scope.LevelChoices[0].id;
            }
          }, 100);
        });
      }
    }

    function _newCondition(typeId) { // ToDo
      var defaultLevelConditionTypeId = 0;
      var defaultLevelChoiceId = 0;
      if ($scope.ConditionTypes.length > 0) {
        defaultLevelConditionTypeId = $scope.ConditionTypes[0].id;
      }
      if ($scope.LevelChoices.length > 0) {
        defaultLevelChoiceId = $scope.LevelChoices[0].id;
      }

      $scope.LevelObject.levelConditions.push({
        id: 0,
        levelId: ($stateParams.id || 0),
        levelConditionTypeId: defaultLevelConditionTypeId,
        levelChoiceId: defaultLevelChoiceId,
        value: 0,
        condition: typeId == 0 ? "Or" : "And"
      });
    }

    function _removeCondition(index) { // ToDo
      if ($scope.LevelObject.levelConditions.length <= 1) {
        return;
      }
      $scope.LevelObject.levelConditions.splice(index, 1);
    }

    $scope.optUploadPhoto = {
      multiple: false,
      validation: { allowedExtensions: appConfig.allowImageExtension, maxFileSize: 10485760 },
      async: { saveUrl: 'save', removeUrl: 'remove', autoUpload: false },
      showFileList: false
    };

    // File selected
    $scope.onSelect = function (e) {
      var obj = Utils.validateFile(e.files[0], appConfig.allowImageExtension);
      if (obj.extension && obj.size) {
        _addPreview(e.files[0]);
      } else {
        logger.error('Invalid file.')
      }
    }

    function _addPreview(file) {
      if (file.rawFile) {
        var reader = new FileReader();
        reader.onloadend = function (e) {
          $timeout(function () {
            $scope.LevelObject.levelPhoto = e.target.result;
            $scope.LevelObject.isUpdatePhoto = true;
          });
        };
        reader.readAsDataURL(file.rawFile);
      }
    }

    // Remove file selected
    $scope.onRemove = function (e) {
      $scope.LevelObject.levelPhoto = null;
      $('#levelPhoto').removeAttr('src');
    }

    function _submit(event) {
      event.preventDefault();
      var errors = $scope.Validator.errors();
      if ($scope.Validator.validate()) {
        var postData = $scope.LevelObject;
        MasterDataGameMechanicsApi.saveLevel(postData).then(function (data) {
          if (data.isSuccess) {
            logger.success("Save successfully!");
            _cancel();
          } else {
            logger.error("Save failed!");
          }
        }, function (error) {
          logger.error(error.data.message);
        });
      }
    }

    function _cancel() {
      $state.go('appAdmin.gameMechanicsAdmin.levels');
    }

    $timeout(function () {
      $("#menu-game-mechanics").addClass('current');
    }, 200);

    $scope.loadData = _loadData;
    $scope.newCondition = _newCondition;
    $scope.removeCondition = _removeCondition;
    $scope.submit = _submit;
    $scope.cancel = _cancel;
    $scope.loadData();
  }
})();
