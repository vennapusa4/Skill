(function () {
  'use strict';

  angular
    .module('app.gameMechanics')
    .controller('GameMechanicsEditPointController', GameMechanicsEditPointController);

  /** @ngInject */
  function GameMechanicsEditPointController($scope, $timeout, MasterDataGameMechanicsApi, $stateParams, $state, logger, $q, ValidatorService, SearchApi) {
    ValidatorService.Rules($scope);
    $scope.storedRuleName = "";
    $scope.itemId = $stateParams.id;
    $scope.PointObject = {
      ruleName: null,
      userTypeId: null,
      knowledgeDocumentTypeId: null,
      conditions: [
        {
          condition: 'Condition',
          conditionTypeId: null,
          conditionId: null
        }
      ],
      rewardTypeId: null,
      point: 0
    };

    $scope.UserTypes = [];
    $scope.KnowledgeDocumentTypes = [];
    $scope.ConditionTypes = [];
    $scope.Conditions = [];
    $scope.RewardTypes = [];
    $scope.showKDType = true;
    $scope.ruleIsExists = false;
    $scope.ruleNameIsExists = false;

    function _init() {
      var lstDefer = [];

      var deferFeedUserTypes = MasterDataGameMechanicsApi.feedUserTypes().then(function (data) {
        $scope.UserTypes = data;
      });
      lstDefer.push(deferFeedUserTypes);

      var deferFeedKnowledgeDocumentTypes = MasterDataGameMechanicsApi.feedKnowledgeDocumentTypes().then(function (data) {
        $scope.KnowledgeDocumentTypes = data;
      });
      lstDefer.push(deferFeedKnowledgeDocumentTypes);

      var deferFeedConditions = MasterDataGameMechanicsApi.feedConditions().then(function (data) {
        $scope.ConditionTypes = data;
      });
      lstDefer.push(deferFeedConditions);

      var deferFeedRewardTypes = MasterDataGameMechanicsApi.feedRewardTypes().then(function (data) {
        $scope.RewardTypes = data;
      });
      lstDefer.push(deferFeedRewardTypes);

      if ($scope.itemId) {
        $q.all(lstDefer).then(function () {
          MasterDataGameMechanicsApi.getPointById($scope.itemId).then(function (data) {
            $scope.PointObject = data;
            $scope.storedRuleName = data.ruleName;
            $timeout(function () {
              $('#ddlConditionType').trigger('change');

              // set default condition
              $scope.PointObject.conditionId = {
                id: data.conditions[0].conditionId,
                name: data.conditions[0].conditionName
              };
            }, 200);

          });
        });
      } else { // New
        $q.all(lstDefer).then(function () {
          $timeout(function () {
            if ($scope.UserTypes && $scope.UserTypes.length > 0) {
              $scope.PointObject.userTypeId = $scope.UserTypes[0].id;
            }
            if ($scope.KnowledgeDocumentTypes && $scope.KnowledgeDocumentTypes.length > 0) {
              $scope.PointObject.knowledgeDocumentTypeId = $scope.KnowledgeDocumentTypes[0].id;
            }
            if ($scope.ConditionTypes && $scope.ConditionTypes.length > 0) {
              $scope.PointObject.conditions.conditionTypeId = $scope.ConditionTypes[0].id;
            }
            if ($scope.RewardTypes && $scope.RewardTypes.length > 0) {
              $scope.PointObject.rewardTypeId = $scope.RewardTypes[0].id;
            }

            $timeout(function () {
              $('#ddlConditionType').trigger('change');
            }, 200);
          }, 100);
        });
      }
    }
    function _onChangeConditionType(item, conditionTypeId) {
      $scope.showKDType = true;
      var conditionX = _.find($scope.ConditionTypes, function (x, xIndex) {
        return x.id == item.conditionTypeId;
      });

      if (conditionX != null && (conditionX.name == "Update Profile" || conditionX.name == "Activity-based" || conditionX.name == "System Use")) {
        $scope.showKDType = false;
      }
      var conditionTypeItem = _.find($scope.ConditionTypes, function (o) { return o.id == conditionTypeId; });
      $scope.Conditions = conditionTypeItem.conditions;

      // Select FirstTime for Condition
      //if (conditionTypeItem && conditionTypeItem.conditions) {
      //  item.conditionId = conditionTypeItem.conditions[0].id;
      //}
      //if ($scope.PointObject && $scope.PointObject.conditions) {
      //  item.conditionId = $scope.PointObject.conditions[0];
      //}
      $scope.PointObject.conditionId = $scope.Conditions[0];
      $timeout(function () {
        // $('#ddlCondition').selectpicker();
      }, 500);
    }

    function _newCondition(typeId) { // Not Use
      $scope.PointObject.conditions.push({
        Condition: typeId == 0 ? "Or" : "And",
        ConditionType: 1,
        ConditionId: 1
      });
    }

    function _removeCondition(index) { // Not Use
      if ($scope.PointObject.conditions.length <= 1) {
        return;
      }
      $scope.PointObject.conditions.splice(index, 1);
    }

    function _submit(event) {
      event.preventDefault();
      var errors = $scope.Validator.errors();
      if ($scope.Validator.validate()) {
        if ($scope.ruleIsExists || $scope.ruleNameIsExists) {
          return;
        }
        var postData = $scope.PointObject;
        if (postData != null && postData.conditions != null) {
          _.each(postData.conditions, function (x, xIndex) {
            x.conditionId = postData.conditionId != null ? postData.conditionId.id : null;
          });
        }
        if (postData != null && $scope.showKDType == false) {
          postData.knowledgeDocumentTypeId = null;
        }

        // Add users
        try {
          var userIds = [];
          if ($scope.PointObject.conditionId.name.indexOf('Admin Rights') != -1) {
            _.each($scope.Authors, function (x, xIndex) {
                userIds.push(x.id);
            });
          }
          postData.conditions[0].userIds = userIds;
        } catch (e) {
          postData.conditions[0].userIds = [];
        }
        
        if (!$scope.itemId) {
          MasterDataGameMechanicsApi.addNewPoint(postData).then(function (data) {
            if (data.result) {
              logger.success('Save Points Management success');
              _cancel();
            } else {
              logger.error('Have error when Submit Points Management');
            }
          }, function (err) {
              logger.error('Have error when Submit Points Management');
          });
        } else {
          MasterDataGameMechanicsApi.updatePoint(postData).then(function (data) {
            if (data.result) {
              logger.success('Save Points Management success');
              _cancel();
            } else {
              logger.error('Have error when Submit Points Management');
            }
          }, function (err) {
              logger.error('Have error when Submit Points Management');
          });
        }
      }
    }

    function _cancel() {
      $state.go('appAdmin.gameMechanicsAdmin.points');
    }

    $timeout(function () {
      $("#menu-game-mechanics").addClass('current');
      // $('.selectpicker').selectpicker();
    }, 200);

    function _validateRule() {
      var dataInput = $scope.PointObject;
      var conditionId = null;
      try {
        conditionId = dataInput.conditionId.id;
      } catch (e) {
        conditionId = null;
        console.log(e);
      }
      if ($scope.showKDType == false) {
        dataInput.knowledgeDocumentTypeId = null;
      }
      var postData = {
        Id: $scope.itemId,
        UserTypeId: dataInput.userTypeId,
        KnowledgeDocumentTypeId: dataInput.knowledgeDocumentTypeId,
        ConditionId: conditionId
      };
      MasterDataGameMechanicsApi.validateRule(postData).then(function (data) {
        $scope.ruleIsExists = data.result;
      }, function (err) {
          logger.error('Have error when Validate Rule');
      });
    }

    function onSubmit(event) {
        if ($scope.PointObject.ruleName == null || $scope.PointObject.ruleName.trim().length <= 0) {
            return;
        }
      $scope.ruleIsExists = false;
      $scope.ruleNameIsExists = false;
      if ($scope.storedRuleName != $scope.PointObject.ruleName) {
        var rule = $scope.PointObject.ruleName || "";
        MasterDataGameMechanicsApi.checkRuleName(rule).then(function (data) {
          if (data.result) {
            $scope.ruleNameIsExists = true;
            return;
          } else {
            var dataInput = $scope.PointObject;
            var conditionId = null;
            try {
              conditionId = $scope.PointObject.conditionId.id;
            } catch (e) {
              conditionId = null;
            }
            if ($scope.showKDType == false) {
              dataInput.knowledgeDocumentTypeId = null;
            }
            var postData = {
              Id: $scope.itemId,
              UserTypeId: dataInput.userTypeId,
              KnowledgeDocumentTypeId: dataInput.knowledgeDocumentTypeId,
              ConditionId: conditionId
            };
            MasterDataGameMechanicsApi.validateRule(postData).then(function (data) {
              $scope.ruleIsExists = data.result;
              if (!data.result) {
                _submit(event);
              } else {
                return;
              }
            }, function (err) {
                logger.error('Have error when Validate Rule');
            });
          }
        });
      } else {
        _submit(event);
      }
    }


    $scope.init = _init;
    $scope.onChangeConditionType = _onChangeConditionType;
    $scope.newCondition = _newCondition; // Not Use
    $scope.removeCondition = _removeCondition; // Not Use
    $scope.submit = onSubmit;
    $scope.cancel = _cancel;
    $scope.validateRule = _validateRule;
    $scope.init();


    $scope.newauthor = false;
    $scope.Author = "";
    $scope.Authors = [];
    $scope.toggleNewAuthor = function (isShow) {
      $scope.newauthor = isShow;
      $timeout(function () {
        $('.k-clear-value').trigger('click');
        $scope.Author = "";
      }, 500);
    }
    $scope.Source = {
      dataTextField: "displayName",
      dataValueField: "name",
      filter: "contains",
      minLength: 1,
      delay: 500,
      dataSource: {
        serverFiltering: true,
        transport: {
          read: function (options) {
              return SearchApi.searchUserForPointAdmin(options, $scope.Authors);
          }
        },
      },
      open: function (e) {
        $timeout(function () {
          e.sender.list.closest('.k-animation-container').find('.k-list-container').addClass('multiselect_panel no_grouping');
        });
      },
    };
    function _onOpen(e) {
      $timeout(function () {
        e.sender.list.closest('.k-animation-container').find('.k-list-container').addClass('multiselect_panel no_grouping');
      });
    };

    function _onSelect(e) {
      var index = _.findIndex($scope.Authors, function (obj) { return obj.id == e.dataItem.id });
      if (index == -1) {
        $scope.Authors.push(e.dataItem);
      }

      $timeout(function () {
        $('.k-clear-value').trigger('click');
        $scope.Author = "";
      }, 500);
    };

    function _Remove(idx) {
      $scope.Authors.splice(idx, 1);
    };
    $scope.onOpen = _onOpen;
    $scope.onSelect = _onSelect;
    $scope.Remove = _Remove;
  }
})();
