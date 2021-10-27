(function () {
    'use strict';

    angular
        .module('app.gameMechanics')
        .controller('GameMechanicsEditChallengeController', GameMechanicsEditChallengeController);

    /** @ngInject */
    function GameMechanicsEditChallengeController($scope, $timeout, MasterDataGameMechanicsApi, $state, ValidatorService, $stateParams, $q, Utils, appConfig) {
        $('#menu-game-mechanics').addClass('current');

        $scope.UserTypes = [];
        $scope.ChallengeTypes = [];
        $scope.CommunityTypes = [];
        $scope.ConditionTypes = [];
        $scope.ChallengeDifficultyLevels = [];
        $scope.AllCommunitys = [];
        $scope.logicalOperators = [];

        $scope.quantityConditionNewModel = {};
        $scope.RewardTypes = [];
        ValidatorService.Rules($scope);
        $scope.storedChallengeName = '';
        $scope.itemId = $stateParams.id;
        $scope.showKDType = true;
        $scope.challengeIsExists = false;
        $scope.challengeNameIsExists = false;
        $scope.isShowAddNewCondition = true;

        $scope.ChallengeObject = {
            challengeName: null,
            userTypeId: null,
            challengeTypeId: null,
            challengeType: 'Individual',
            communityTypeId: null,
            communityName: null,
            communityIds: [],
            startDate: null,
            endDate: null,
            isNoExpiry: false,
            quantityCondition: null,
            challengeConditions: [],
            rewardBadge: null,
            points: 0,
            challengeDifficultyLevelId: null
        };

        $scope.startDateOpt = {
            change: function () {
                //var startDate = $scope.ChallengeObject.startDate;
                //var endDate = $scope.ChallengeObject.endDate;
                //if (startDate) {
                //    if (endDate && startDate >= endDate) {
                //        $scope.ChallengeObject.endDate = null;
                //    }

                //    var endDateControl = $('#txtEndDate').data("kendoDatePicker");
                //    endDateControl.min(startDate);
                //}
            },
        }

        function _init() {
            var lstDefer = [];

            var deferFeedUserTypes = MasterDataGameMechanicsApi.feedUserTypes().then(function (data) {
                $scope.UserTypes = data;
            });
            lstDefer.push(deferFeedUserTypes);

            var deferFeedChallengeTypes = MasterDataGameMechanicsApi.feedChallengeTypes().then(function (data) {
                $scope.ChallengeTypes = data;
            });
            lstDefer.push(deferFeedChallengeTypes);

            var deferFeedCommunityTypes = MasterDataGameMechanicsApi.feedCommunityTypes().then(function (data) {
                $scope.CommunityTypes = data;
            });
            lstDefer.push(deferFeedCommunityTypes);

            var deferFeedConditions = MasterDataGameMechanicsApi.feedChallengeConditions().then(function (data) {
                _.each(data, function (x, xIndex) {
                    if (x.name == 'Quantity') {
                        $scope.quantityConditionNewModel = x;
                        $scope.quantityConditionNewModel.conditionTypeId = x.id;
                        $scope.quantityConditionNewModel.conditionTypeName = x.name;
                        var defaultConditionQuantity = _.find(x.conditions, function (o) { return o.name == 'EqualToAndGreaterThan' });
                        if (defaultConditionQuantity) {
                            $scope.quantityConditionNewModel.conditionId = defaultConditionQuantity.id;
                        } else {
                            $scope.quantityConditionNewModel.conditionId = x.conditions[0].id;
                        }
                        $scope.quantityConditionNewModel.value = 1;
                    } else {
                        $scope.ConditionTypes.push(x);
                    }
                });
            });
            lstDefer.push(deferFeedConditions);

            var deferFeedRewardTypes = MasterDataGameMechanicsApi.feedRewardTypes().then(function (data) {
                $scope.RewardTypes = data;
            });
            lstDefer.push(deferFeedRewardTypes);

            var deferFeedLogicalOperators = MasterDataGameMechanicsApi.feedLogicalOperators().then(function (data) {
                $scope.logicalOperators = data;
            });
            lstDefer.push(deferFeedLogicalOperators);

            var deferFeedChallengeDifficultyLevels = MasterDataGameMechanicsApi.feedChallengeDifficultyLevels().then(function (data) {
                $scope.ChallengeDifficultyLevels = data;
            });
            lstDefer.push(deferFeedChallengeDifficultyLevels);

            if ($scope.itemId) {
                $q.all(lstDefer).then(function () {
                    // Edit item
                    MasterDataGameMechanicsApi.getChallengeById($scope.itemId).then(function (res) {
                        // Prepair data
                        res.isNoExpiry = (res.endDate == null);

                        function bindingDataCallback() {
                            $scope.ChallengeObject = res;
                            $scope.ChallengeObject.rewardBadge = res.badgeImageUrl;

                            // Mapping for show additional textbox
                            _.each($scope.ChallengeObject.challengeConditions, function (x, xIndex) {
                                x.isShowAdditionalTextBox = _getIsShowAdditionalTextBoxByType(x.conditionTypeId);
                                _.each(x.challengeConditions, function (y, xIndex) {
                                    y.isShowAdditionalTextBox = _getIsShowAdditionalTextBoxByType(y.conditionTypeId);
                                    _.each(y.challengeConditions, function (z, zIndex) {
                                        z.isShowAdditionalTextBox = _getIsShowAdditionalTextBoxByType(z.conditionTypeId);
                                    });
                                });
                            });

                            var challengeConditions = $scope.ChallengeObject.challengeConditions;
                            if ($scope.ChallengeObject.challengeConditions == null
                                || $scope.ChallengeObject.challengeConditions.length == 0) {
                                $scope.ChallengeObject.challengeConditions = [];
                                var newConditionDetails = _newChallengeConditionDetails();
                                $scope.ChallengeObject.challengeConditions.push(newConditionDetails);
                            } else {
                                _addConditionTypesConditionsToConditions(challengeConditions);
                            }

                            if (res.quantityCondition) {
                                $scope.ChallengeObject.quantityCondition = res.quantityCondition;
                                $scope.ChallengeObject.quantityCondition.conditions = $scope.quantityConditionNewModel.conditions;
                                $scope.ChallengeObject.quantityCondition.value = res.quantityCondition.quantityValue;
                            } else {
                                $scope.ChallengeObject.quantityCondition = $scope.quantityConditionNewModel;
                            }



                            $timeout(function () {
                                var startDateControl = $('#txtStartDate').data("kendoDatePicker");
                                startDateControl.trigger('change');
                            }, 200);
                        }

                        if (res.communityType) {
                            MasterDataGameMechanicsApi.getCommunitysByType(res.communityType).then(function (data) {
                                $scope.AllCommunitys = data;
                                bindingDataCallback();
                            });
                        } else {
                            bindingDataCallback();
                        }
                    }, function (error) {
                        logger.error(error.data.message);
                    });
                });
            } else {
                // New
                $q.all(lstDefer).then(function () {
                    $timeout(function () {
                        if ($scope.UserTypes && $scope.UserTypes.length > 0) {
                            $scope.ChallengeObject.userTypeId = $scope.UserTypes[0].id;
                        }
                        if ($scope.ConditionTypes && $scope.ConditionTypes.length > 0) {
                            $scope.ChallengeObject.challengeConditions.conditionTypeId = $scope.ConditionTypes[0].id;
                        }
                        if ($scope.ChallengeTypes && $scope.ChallengeTypes.length > 0) {
                            $scope.ChallengeObject.challengeTypeId = $scope.ChallengeTypes[0].id;
                        }
                        if ($scope.CommunityTypes && $scope.CommunityTypes.length > 0) {
                            $scope.ChallengeObject.communityTypeId = $scope.CommunityTypes[0].id || 0;
                            _loadComunityNameSource();
                        }
                        if ($scope.ChallengeDifficultyLevels && $scope.ChallengeDifficultyLevels.length > 0) {
                            $scope.ChallengeObject.challengeDifficultyLevelId = $scope.ChallengeDifficultyLevels[0].id || 0;
                        }

                        var newConditionDetails = _newChallengeConditionDetails();
                        $scope.ChallengeObject.challengeConditions.push(newConditionDetails);

                        $scope.ChallengeObject.quantityCondition = $scope.quantityConditionNewModel;

                        $timeout(function () {
                            $('#ddlConditionType').trigger('change');
                        }, 200);
                    }, 100);
                });
            }
        }

        function _loadComunityNameSource() {
            var comunityName = getCommunityTypeNameById($scope.ChallengeObject.communityTypeId);
            MasterDataGameMechanicsApi.getCommunitysByType(comunityName).then(function (data) {
                $scope.AllCommunitys = data;
            });

            $scope.ChallengeObject.communityIds = [];
        }

        function _onChangeChallengeType(challengeTypeId) {
            var challengeType = _.find($scope.ChallengeTypes, function (o) {
                return o.id == challengeTypeId;
            });
            if (challengeType) {
                $scope.ChallengeObject.challengeType = challengeType.name;
            }
        }

        $scope.optUploadPhoto = {
            multiple: false,
            validation: { allowedExtensions: appConfig.allowImageExtension, maxFileSize: 10485760 },
            async: { saveUrl: 'save', removeUrl: 'remove', autoUpload: false },
            showFileList: false
        };

        // File selected
        function _onSelect(e) {
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
                        $scope.ChallengeObject.rewardBadge = e.target.result;
                    });
                };
                reader.readAsDataURL(file.rawFile);
            }
        }

        // Remove file selected
        function _onRemove(e) {
            $scope.ChallengeObject.rewardBadge = null;
            $('#rewardBadge').removeAttr('src');
        }

        function getCommunityTypeNameById(id) {
            var exists = _.find($scope.CommunityTypes, function (x, xIndex) {
                return x.id == id;
            });
            return exists != null ? exists.name : '';
        }

        function _submit(event) {
            event.preventDefault();
            var errors = $scope.Validator.errors();
            if ($scope.Validator.validate()) {
                if ($scope.ChallengeObject.isNoExpiry) {
                    $scope.ChallengeObject.endDate = null;
                }
                var postData = {
                    id: $scope.itemId || 0,
                    name: $scope.ChallengeObject.challengeName,
                    description: $scope.ChallengeObject.description,
                    userTypeId: $scope.ChallengeObject.userTypeId,
                    challengeTypeId: $scope.ChallengeObject.challengeTypeId,
                    challengeDifficultyLevelId: $scope.ChallengeObject.challengeDifficultyLevelId,
                    startDate: kendo.parseDate($scope.ChallengeObject.startDate, "dd/MM/yyyy"),
                    endDate: kendo.parseDate($scope.ChallengeObject.endDate, "dd/MM/yyyy"),
                    rewardPoints: $scope.ChallengeObject.points,
                    rewardBadge: $scope.ChallengeObject.rewardBadge,
                    isUploadBadge: $scope.ChallengeObject.rewardBadge != null,
                    quantityCondition: $scope.ChallengeObject.quantityCondition,
                    challengeConditions: $scope.ChallengeObject.challengeConditions
                };

                // Validate StartDate, End Date
                var currentDate = new Date();
                currentDate.setHours(0, 0, 0, 0);

                if (postData.id==0 && postData.startDate < kendo.parseDate(currentDate, "dd/MM/yyyy")) {
                    logger.error('Start Date could not be less than Current Date.');
                    return;
                }
                if (postData.endDate != null && postData.endDate < postData.startDate) {
                    logger.error('Start Date could not be later than End Date.');
                    return;
                }

                // Fix issue date time
                postData.startDate = kendo.toString(postData.startDate, 'yyyy-MM-dd');
                postData.endDate = kendo.toString(postData.endDate, 'yyyy-MM-dd');

                var challengeType = _.find($scope.ChallengeTypes, function (o) {
                    return o.id == $scope.ChallengeObject.challengeTypeId;
                });
                if (challengeType && challengeType.name != 'Individual') {
                    postData.communityTypeId = $scope.ChallengeObject.communityTypeId;
                    postData.communityIds = $scope.ChallengeObject.communityIds;
                } else {
                    postData.communityTypeId = null;
                    postData.communityIds = [];
                }

                if ($scope.quantityCondition) {
                    $scope.quantityCondition.quantityValue = $scope.quantityCondition.value;
                    var quantityCondition = _.find($scope.quantityCondition.conditions, function (o) { return o.id == $scope.quantityCondition.conditionId });
                    if ((quantityCondition && quantityCondition.name != 'EqualToAndGreaterThan') || $scope.quantityCondition.quantityValue > 1) {
                        postData.quantityCondition = $scope.quantityCondition;
                    }
                }
                if ($scope.itemId) {
                    MasterDataGameMechanicsApi.updateChallenge(postData).then(function (data) {
                        if (data.result) {
                            logger.success('Saved successfully!');
                            $state.go('appAdmin.gameMechanicsAdmin.challenges');
                        } else {
                            logger.error('Save failed!');
                        }
                    }, function (error) {
                        logger.error(error.data.message);
                    });
                } else {
                    MasterDataGameMechanicsApi.addNewChallenge(postData).then(function (data) {
                        if (data.result) {
                            logger.success('Added successfully!');
                            $state.go('appAdmin.gameMechanicsAdmin.challenges');
                        } else {
                            logger.error('Save failed!');
                        }
                    }, function (error) {
                        logger.error(error.data.message);
                    });
                }
            }
        }

        function _newCondition(logicalOperatorName) {
            var logicalOperatorItem = _.find($scope.logicalOperators, function (o) { return o.name == logicalOperatorName });
            if (logicalOperatorItem) {
                var newConditionDetails = _newChallengeConditionDetails(logicalOperatorItem);
                newConditionDetails = _remapNewCondition(newConditionDetails, false);
                $scope.ChallengeObject.challengeConditions.push(newConditionDetails);
            }
            $scope.isShowAddNewCondition = true;
            if ($scope.ChallengeObject.challengeConditions.length == 4) {
                $scope.isShowAddNewCondition = false;
            }

            // Rebuild condition types
            _rebuildConditionType();
        }

        function _remapNewCondition(newConditionDetails, isSubCondition) {
            if ($scope.ChallengeObject.challengeConditions.length > 0) {
                var conditionTypesSelected = _getConditionTypeSelected();

                var allTypes = _getChallengeConditionTypes();
                var newArr = [];
                _.each(allTypes, function (x, xIndex) {
                    var exists = _.findIndex(conditionTypesSelected, function (y, yIndex) {
                        return x.id == y;
                    });
                    if (isSubCondition || exists == -1) {
                        newArr.push(x);
                    }
                });
                newConditionDetails.conditionTypes = newArr;
                newConditionDetails.conditionTypeId = newArr[0].id || null;
            }
            return newConditionDetails;
        }

        function _newSubCondition(item, logicalOperatorName, index) {
            var logicalOperatorItem = _.find($scope.logicalOperators, function (o) { return o.name == logicalOperatorName });
            if (logicalOperatorItem) {
                var newConditionDetails = _newChallengeConditionDetails(logicalOperatorItem);
                newConditionDetails = _remapNewCondition(newConditionDetails, true);
                item.challengeConditions.push(newConditionDetails);
            }
        }

        function _removeCondition(item, index) { // Root Level
            if (item.challengeConditions.length <= 1) {
                logger.error('Cannot remove last condition');
                return;
            }
            if (index == 0) {
                logger.error('Cannot remove first condition');
                return;
            }
            item.challengeConditions.splice(index, 1);
            $scope.isShowAddNewCondition = true;
            if ($scope.ChallengeObject.challengeConditions.length == 4) {
                $scope.isShowAddNewCondition = false;
            }
            _rebuildConditionType();
        }

        function _removeAllCondition() {
            $scope.ChallengeObject.challengeConditions = [];
            var newConditionDetails = _newChallengeConditionDetails();
            $scope.ChallengeObject.challengeConditions.push(newConditionDetails);
        }

        function _removeSubCondition(item, index) {
            item.challengeConditions.splice(index, 1);
        }

        function _bindConditions(id, item) {
            var result = [];
            _.each($scope.ConditionTypes, function (x, xIndex) {
                if (x.id == id) {
                    result = x.conditions;
                }
            });
            item.conditions = result;
            item.conditionId = result.length > 0 ? result[0].id : null;
            _rebuildConditionType();

            item.isShowAdditionalTextBox = _getIsShowAdditionalTextBoxByType(item.conditionTypeId);
        }

        function _getIsShowAdditionalTextBoxByType(conditionTypeSelectedId) {
            var conditionTypeSelectedName = _getChallengeConditionTypeNameById(conditionTypeSelectedId);
            if (conditionTypeSelectedName == appConfig.HappeningAttributesType ||
                conditionTypeSelectedName == appConfig.ConferencePaperAttributes ||
                conditionTypeSelectedName == appConfig.SuccessStoryAttributes ||
                conditionTypeSelectedName == appConfig.SuccessStoryIsBoldStory ||
                conditionTypeSelectedName == appConfig.KnowledgeKeyword ||
                conditionTypeSelectedName == appConfig.LessonLearntType ||
                conditionTypeSelectedName == appConfig.AdditionalInfo) {
                return true;
            }
            return false;
        }

        function _newChallengeConditionDetails(logicalOperatorItem) {
            return {
                logicalOperatorId: logicalOperatorItem ? logicalOperatorItem.id : null,
                logicalOperatorName: logicalOperatorItem ? logicalOperatorItem.name : 'Condition',
                conditionTypeId: $scope.ConditionTypes[0].id || null,
                conditionTypes: $scope.ConditionTypes,
                conditionId: $scope.ConditionTypes[0].conditions[0].id || null,
                conditions: $scope.ConditionTypes != null && $scope.ConditionTypes.length > 0 ? $scope.ConditionTypes[0].conditions : [],
                bridgeId: null,
                quantityValue: 0,

                challengeConditions: [],
            };
        }

        function _addConditionTypesConditionsToConditions(challengeConditions) {
            if (challengeConditions && challengeConditions.length > 0) {
                for (var i = 0; i < challengeConditions.length; i++) {
                    var item = challengeConditions[i];

                    item.conditionTypes = $scope.ConditionTypes;
                    if (item.conditionTypeId) {
                        var arrConditions = [];
                        _.each($scope.ConditionTypes, function (x, xIndex) {
                            if (x.id == item.conditionTypeId) {
                                arrConditions = x.conditions;
                            }
                        });
                        item.conditions = arrConditions;
                    }

                    _addConditionTypesConditionsToConditions(item.challengeConditions);
                }
            }
        }

        function _getChallengeConditionTypes() {
            var result = [];
            var mainConditionTypeId = $scope.ChallengeObject.challengeConditions[0].conditionTypeId;
            var mainConditionTypeName = _getChallengeConditionTypeNameById(mainConditionTypeId);

            _.each($scope.ConditionTypes, function (x, xIndex) {
                if (
                    (_conditionTypeIsActivity(x.name) && _conditionTypeIsActivity(mainConditionTypeName)) ||
                    (!_conditionTypeIsActivity(x.name) && !_conditionTypeIsActivity(mainConditionTypeName))
                ) {
                    result.push(x);
                }
            });
            return result;
        }

        function _conditionTypeIsActivity(name) {
            return name == appConfig.ChallengeConditionActivity.UpdateProfile || name == appConfig.ChallengeConditionActivity.SystemUse || name == appConfig.ChallengeConditionActivity.ActivityBased;
        }

        function _getChallengeConditionTypeNameById(id) {
            var exists = _.find($scope.ConditionTypes, function (x, xIndex) {
                return x.id == id;
            });
            return exists != null ? exists.name : "";
        }

        function _rebuildConditionType() {
            //if ($scope.ChallengeObject.challengeConditions.length == 1) {
            //    return;
            //}
            var conditionTypesSelected = _getConditionTypeSelected();
            _.each($scope.ChallengeObject.challengeConditions, function (x, xIndex) {
                // Re-bind condition types
                var allTypes = _getChallengeConditionTypes();
                var temp = []
                _.each(allTypes, function (y, yIndex) {
                    var exists = _.findIndex(conditionTypesSelected, function (z, zIndex) {
                        return y.id == z;
                    })
                    if (y.id == x.conditionTypeId || exists == -1) {
                        temp.push(y);
                    }
                });
                x.conditionTypes = temp;

                // Re-bind condition type id
                _.each(x.conditionTypes, function (y, yIndex) {
                    if (y.id == x.conditionTypeId) {
                        x.conditionTypeId = y.id;
                    }
                });

                // Check show/hide button new condition
                if (x.conditionTypes.length == 1) {
                    $scope.isShowAddNewCondition = false;
                }
            });

        }

        function _getConditionTypeSelected() {
            var conditionTypesSelected = [];
            _.each($scope.ChallengeObject.challengeConditions, function (x, xIndex) {
                conditionTypesSelected.push(x.conditionTypeId);
            });
            return conditionTypesSelected;
        }

        function _getConditionDescription(conditions, id) {
            var con = _.find(conditions, function (o) {
                return o.id == id;
            });
            if (con != null) {
                return con.description;
            }
            return '';
        }

        $scope.init = _init;
        $scope.loadComunityNameSource = _loadComunityNameSource;
        $scope.onSelect = _onSelect;
        $scope.onRemove = _onRemove;
        $scope.newCondition = _newCondition;
        $scope.newSubCondition = _newSubCondition;
        $scope.removeCondition = _removeCondition;
        $scope.removeAllCondition = _removeAllCondition;
        $scope.removeSubCondition = _removeSubCondition;
        $scope.bindConditions = _bindConditions;
        $scope.onChangeChallengeType = _onChangeChallengeType;
        $scope.submit = _submit;
        $scope.getConditionDescription = _getConditionDescription;
        $scope.init();
    }
})();
