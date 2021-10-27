/**
 * @author v.lugovksy
 * created on 16.12.2015
 */
(function () {
    'use strict';

    angular.module('app.bulkUpload')
        .directive('valueCreatation', valueCreatation);

    /** @ngInject */
    function valueCreatation(KnowledgeDiscoveryApi, Message, logger, SearchApi) {
        return {
            restrict: 'AE',
            scope: {
                idx: '@',
                kdid: '@',
                type: '@',
                isvalid: '=',
                getValueCreatation: '&',
                vctype: '@',
                arrkdid: '@',
                arrindexs: '@',
                kdrefid: '@',
                kdreftitle: '@',
            },
            controller: function ($scope, $timeout, $filter) {
                $scope.Field = {
                    valueCreateds: [],
                    valueCreations: [],
                    valueCreated: 0,
                    userRole: 'CreatedBy'
                };
                $scope.Tooltip = [];
                $scope.knowledgeReferenced = [];
                $scope.dataExpert = null;
                $scope.dataEndorserId = null;
                $scope.dataEndorserName = null;
                $scope.isLoadFirst = false;

                $scope.optEndorser = {
                    dataTextField: "displayName",
                    dataValueField: "name",
                    filter: "contains",
                    minLength: 1,
                    delay: 500,
                    dataSource: {
                        serverFiltering: true,
                        transport: {
                            read: function (options) {
                                return SearchApi.searchUser(options, []);
                            }
                        },
                    },
                    open: function (e) {
                        $timeout(function () {
                            e.sender.list.closest('.k-animation-container').find('.k-list-container').addClass('multiselect_panel no_grouping');
                        });
                    },
                    select: function (e) {
                        $scope.dataEndorserId = e.dataItem.name;
                        $scope.dataEndorserName = e.dataItem.displayName;
                    }
                };

                $scope.Skill = {
                    dataTextField: "Text",
                    dataValueField: "Id",
                    minLength: 1,
                    delay: 500,
                    dataSource: {
                        serverFiltering: true,
                        transport: {
                            read: function (options) {
                                return KnowledgeDiscoveryApi.getSkill(options)
                            }
                        }
                    }
                };

                $scope.ValueTypes = {
                    dataTextField: "Text",
                    dataValueField: "Id",
                    dataSource: new kendo.data.DataSource({
                        transport: {
                            read: function (options) {
                                var result = _.map($scope.Field.valueTypes, function (o) {
                                    return {
                                        Id: o.id, Text: o.valueTypeName
                                    }
                                });
                                return options.success(result);
                            }
                        }
                    }),
                    dataBound: function (e) {

                    }
                };

                $scope.Validation = {
                    rules: {
                        valuecreation: function (input) {
                            if (input.is('[name="ValueCreationType"]')) {
                                if (!_.isEmpty($scope.Field.valueCreateds)) {
                                    if (_.isEmpty($scope.Field.valueCreationId)) {
                                        return false;
                                    }
                                }
                            }
                            return true;
                        },
                        endorser: function (input) {
                            if (input.is("[name='Endorser']") && $scope.type !== "Publications") {
                                if (!_.isEmpty($scope.Field.valueCreateds) && !_.isEmpty($scope.dataEndorserName)) {
                                    return $scope.dataEndorser === $scope.dataEndorserName;
                                }
                            }
                            return true;
                        },
                        endorserempty: function (input) {
                            if (input.is("[name='Endorser']") && $scope.type !== "Publications") {
                                if (!_.isEmpty($scope.Field.valueCreateds)) {
                                    return !_.isEmpty($scope.dataEndorserName);
                                }
                            }
                            return true;
                        },
                        collection: function (input) {
                            if (input.is("[data-collection-msg]")) {
                                _.each($scope.Field.valueCreateds, function (item) {
                                    if (_.isEmpty(item.ValueTypeId)
                                        || _.isEmpty(item.Remarks)
                                        || _.isEmpty(item.KdReference)) {
                                        return false;
                                    }
                                });
                            }
                            return true;
                        },
                    },
                    messages: {
                        valuecreation: Message.Msg1,
                        collection: Message.Msg1,
                        endorser: 'Invalid endorser name.',
                        endorserempty: Message.Msg1
                    }
                };

                _onInit();
                _onEvent();

                function _onInit() {
                    if ($scope.kdrefid != undefined && $scope.kdrefid != 0 && $scope.kdrefid != '0') {
                        $scope.Tooltip.push({});
                        $scope.Field.valueCreateds.push({
                            id: 0,
                            ValueTypeId: { Id: 0 },
                            EstimatedValue: 0,
                            Remarks: '',
                            KdReference: $scope.kdreftitle,
                            KdReferenceId: $scope.kdrefid
                        });
                    }
                    if ($scope.vctype == 'multi') {
                        // set first item
                        var idInput = 0;
                        if ($scope.arrkdid != null && $scope.arrkdid.length >= 1) {
                            var allIds = $scope.arrkdid.replace('[', '').replace(']', '').split(',')
                            idInput = allIds[0];
                        }

                        KnowledgeDiscoveryApi.api.Validate.get({
                            type: _getDocType(), id: idInput
                        }).$promise.then(function (res) {
                            $scope.Field.valueCreationId = res.valueCreationId;
                            $scope.Field.valueCreations = res.valueCreations;
                            $scope.Field.valueTypes = res.valueTypes;

                            // _.forEach(res.valueCreateds, function (o, idx) {
                            //     $scope.Tooltip.push({});
                            //     $scope.Field.valueCreateds.push({
                            //         id: o.id,
                            //         ValueTypeId: {
                            //             Id: o.valueTypeId
                            //         },
                            //         EstimatedValue: o.estimatedValue,
                            //         Remarks: o.remarks,
                            //         KdReference: o.referenced ? o.referenced.title : null,
                            //         KdReferenceId: o.referenced ? o.referenced.id : null
                            //     });
                            // });
                            // var valueData = $scope.getValueCreatation();
                            // if (valueData) {
                            //     $scope.Field.valueCreationId = valueData.valueCreationId;
                            //     $scope.Field.valueCreateds = valueData.valueCreateds || [];
                            //     if (valueData.endorser) {
                            //         $scope.dataEndorser = valueData.endorser.name;
                            //         $scope.dataEndorserId = valueData.endorser.id;
                            //         $scope.dataEndorserName = valueData.endorser.name;
                            //     }
                            // }
                            // $timeout(function () {
                            //     $scope.Validator.validate();
                            // });
                        }, function (err) {
                            logger.error(err.data.message);
                        });
                    } else {

                        KnowledgeDiscoveryApi.api.Validate.get({
                            type: _getDocType(), id: $scope.kdid
                        }).$promise.then(function (res) {
                            $scope.Field.valueCreationId = res.valueCreationId;
                            $scope.Field.valueCreations = res.valueCreations;
                            $scope.Field.valueTypes = res.valueTypes;

                            _.forEach(res.valueCreateds, function (o, idx) {
                                $scope.Tooltip.push({});
                                $scope.Field.valueCreateds.push({
                                    id: o.id,
                                    ValueTypeId: {
                                        Id: o.valueTypeId
                                    },
                                    EstimatedValue: o.estimatedValue,
                                    Remarks: o.remarks,
                                    KdReference: o.referenced ? o.referenced.title : null,
                                    KdReferenceId: o.referenced ? o.referenced.id : null
                                });
                            });
                            var valueData = $scope.getValueCreatation();
                            if (valueData) {
                                $scope.Field.valueCreationId = valueData.valueCreationId;
                                $scope.Field.valueCreateds = valueData.valueCreateds || [];
                                if (valueData.endorser) {
                                    $scope.dataEndorser = valueData.endorser.name;
                                    $scope.dataEndorserId = valueData.endorser.id;
                                    $scope.dataEndorserName = valueData.endorser.name;
                                }
                            }
                            $timeout(function () {
                                $scope.Validator.validate();
                            });
                        }, function (err) {
                            logger.error(err.data.message);
                        });

                        if (!$scope.isvalid) {
                            $timeout(function () {
                                $scope.Validator.validate();
                            });
                        }
                    }
                }

                function _onEvent() {
                    $scope.$on('ValueCreatation', function (event, data) {
                        var endorser = {
                        };
                        if ($scope.dataEndorser === $scope.dataEndorserName) {
                            endorser['id'] = $scope.dataEndorserId;
                            endorser['name'] = $scope.dataEndorserName;
                        }
                        var oldValue = data.get($scope.idx);
                        if (oldValue) {
                            oldValue.valueCreationId = $scope.Field.valueCreationId;
                            oldValue.valueCreateds = $scope.Field.valueCreateds;
                            oldValue.knowledgeReferenced = $scope.knowledgeReferenced;
                            oldValue.endorser = angular.copy(endorser);
                        } else {
                            oldValue = {
                                valueCreationId: $scope.Field.valueCreationId,
                                valueCreateds: $scope.Field.valueCreateds,
                                knowledgeReferenced: $scope.knowledgeReferenced,
                                endorser: angular.copy(endorser)
                            };
                        }
                        var idxxx = $scope.arrindexs;
                        if (idxxx) {
                            var arrayIndexs = idxxx.split(',');
                            if (arrayIndexs != null) {
                                for (var x = 0; x < arrayIndexs.length; x++) {
                                    data.set(arrayIndexs[x], oldValue);
                                }
                            }
                        }
                    });

                    $scope.$watch('Field.valueCreationId', function (next, prev) {
                        $scope.Validator.validate();
                    }, true);

                    $scope.$watch('Field.valueCreateds', function (next, prev) {
                        if (!_.isEmpty(next)) {
                            _.forEach(next, function (o, idx) {
                                if ($scope.Tooltip[idx]) {
                                    $scope.Tooltip[idx].description = _getValueTooltip(o.ValueTypeId.Id, 'description');
                                    $scope.Tooltip[idx].baseCalculationDescription = _getValueTooltip(o.ValueTypeId.Id, 'baseCalculationDescription');
                                }
                            });
                        }
                        $scope.Validator.validate();
                    }, true);
                }

                function _onOpen(e) {
                    $timeout(function () {
                        e.sender.list.closest('.k-animation-container').find('.k-list-container').addClass('multiselect_panel no_grouping');
                    });
                };

                function _AddValue() {
                    var selected = _.head($scope.Field.valueTypes);
                    var newValue = {
                        EstimatedValue: 0
                    };
                    if (!_.isEmpty(selected)) newValue['ValueTypeId'] = {
                        Id: selected.id
                    };
                    $scope.Field.valueCreateds.push(newValue);
                    $scope.Tooltip.push({
                        description: null,
                        baseCalculationDescription: null
                    });
                };

                function _RemoveValue(idx) {
                    $scope.Field.valueCreateds.splice(idx, 1);
                    $scope.Tooltip.splice(idx, 1);
                };

                function _onSelectSkill(e) {
                    $scope.knowledgeReferenced.push({
                        Id: e.dataItem.Id,
                        Text: e.dataItem.Text
                    });
                };

                function _getValueCreate() {
                    return $filter('number')(_.reduce($scope.Field.valueCreateds, function (sum, o) {
                        var tmp = parseInt(o.EstimatedValue);
                        return sum + (_.isNaN(tmp) ? 0 : tmp);
                    }, 0));
                };

                function _getValueTooltip(valueId, field) {
                    var tmp = _.filter($scope.Field.valueTypes, function (o) {
                        return o.id == valueId
                    });
                    if (!_.isEmpty(tmp)) {
                        return _.head(tmp)[field];
                    }
                    return null;
                };

                function _getDocType() {
                    var result = "";
                    switch ($scope.type) {
                        case "Best Practices":
                            result = "BP";
                            break;
                        case "Lessons Learnt":
                            result = "LL";
                            break;
                        case "Publications":
                            result = "PU";
                            break;
                    }
                    return result;
                }

                function _onSave() {
                    var endorser = {
                  };
                  if (_getValueCreate() > 0) {
                    if ($scope.dataEndorser === $scope.dataEndorserName) {
                      endorser['id'] = $scope.dataEndorserId;
                      endorser['name'] = $scope.dataEndorserName;
                    }
                  }
                    $scope.$emit('SaveValueCreation', {
                        index: $scope.idx,
                        valueCreationId: $scope.Field.valueCreationId,
                        valueCreateds: $scope.Field.valueCreateds,
                        knowledgeReferenced: $scope.knowledgeReferenced,
                        endorser: angular.copy(endorser)
                    });
                }

                $scope.onOpen = _onOpen;
                $scope.AddValue = _AddValue;
                $scope.RemoveValue = _RemoveValue;
                $scope.getValueCreate = _getValueCreate;
                $scope.onSelectSkill = _onSelectSkill;
                $scope.onSave = _onSave;
            },
            templateUrl: 'app/main/apps/bulk-upload/_directives/value-creatation.html',
        };
    }
})();
