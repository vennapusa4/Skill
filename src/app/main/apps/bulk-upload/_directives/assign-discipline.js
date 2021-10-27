/**
 * @author v.lugovksy
 * created on 16.12.2015
 */
(function () {
    'use strict';

    angular.module('app.bulkUpload')
        .directive('assignDiscipline', assignDiscipline);

    /** @ngInject */
    function assignDiscipline(KnowledgeDiscoveryApi, Utils, Message) {
        return {
            restrict: 'AE',
            scope: {
                idx: '@',
                isvalid: '=',
                type: '@',
                getAssign: '&',
                isMultiline: '=',
            },
            controller: function ($scope, $timeout) {
                $scope.dataDisciplines = [];
                $scope.dataExpert = null;
                $scope.dataAttachments = [];
                $scope.mdDiscipline = null;
                $scope.mdSubDiscipline = {};
                $scope.paraNew = false;
                $scope.paraParentId = null;
                $scope.ctrlSubDiscipline = {};

                var assignData = $scope.getAssign();
                if (!_.isEmpty(assignData)) {
                    $scope.dataDisciplines = assignData.discipline || [];
                    _.forEach($scope.dataDisciplines, function (o, idx) {
                        if (idx === 0) {
                            o.isExpand = true;
                        } else {
                            o.isExpand = false;
                        }
                        o.isNew = false;
                        _RegClick(o.Id);
                    });
                    $scope.dataAttachments = assignData.dataAttachments || [];
                }

                if (!$scope.isvalid) {
                    $timeout(function () {
                        $scope.Validator.validate();
                    });
                }

                $scope.optDiscipline = {
                    dataTextField: "Text",
                    dataValueField: "Id",
                    minLength: 1,
                    delay: 500,
                    dataSource: {
                        serverFiltering: true,
                        transport: {
                            read: function (options) {
                                var filters = [];
                                if (_.isEmpty($scope.paraParentId)) {
                                    filters = _.map($scope.dataDisciplines, 'Id');
                                } else {
                                    filters = _.map(_.head(_.filter($scope.dataDisciplines, ['Id', parseInt($scope.paraParentId)])).subs, 'Id');
                                }
                                
                                return KnowledgeDiscoveryApi.getDiscipline(options, $scope.paraParentId, filters,"en");
                            }
                        }
                    },
                    open: function (e) {
                        $timeout(function () {
                            e.sender.list.closest('.k-animation-container').find('.k-list-container').addClass('multiselect_panel no_grouping');
                        });
                    },
                    filtering: function (e) {
                        $scope.paraParentId = e.sender.element.attr('parent');
                    },
                    select: function (e) {
                        if (e.dataItem.ParentId == null) {
                            $scope.dataDisciplines.push({
                                Id: e.dataItem.Id,
                                Text: e.dataItem.Text,
                                isExpand: false,
                                isPrimary: false,
                                isNew: false,
                                subs: []
                            });
                            $timeout(function () {
                                $scope.mdDiscipline = "";
                                var last = $scope.dataDisciplines.length;
                                _Toggle(last - 1);
                                $scope.dataDisciplines[last - 1].isNew = true;
                                $scope.Validator.validateInput($("input[name=Discipline]"));
                            });
                            _RegClick(e.dataItem.Id);
                        } else {
                            var idx = _.indexOf(_.map($scope.dataDisciplines, function (o, idx) { return o.Id; }), e.dataItem.ParentId);
                            var current = _.get($scope.dataDisciplines, '[' + idx + '].subs');
                            current.push({
                                Text: e.dataItem.Text,
                                Id: e.dataItem.Id
                            });
                            _.set($scope.dataDisciplines, '[' + idx + '].subs', current);
                            $timeout(function () {
                                var parent = _.get($scope.dataDisciplines, '[' + idx + ']');
                                $scope.mdSubDiscipline[parent.Id] = "";
                                $scope.Validator.validateInput($("input[name=Discipline]"));
                            });
                        }
                    }
                };

                $scope.optExpert = {
                    dataTextField: "ExpertName",
                    dataValueField: "ExpertID",
                    valueTemplate: '<span class="dd_expert_list"><img data-ng-src="{{dataItem.ExpertPhoto?dataItem.ExpertPhoto:\'/assets/images/NoAvatar.jpg\'}}" alt="{{dataItem.ExpertName}}" onerror="this.src=\'/assets/images/NoAvatar.jpg\'"><strong>{{dataItem.ExpertName}}</strong><small>{{dataItem.Position}}</small></span>',
                    template: '<span class="dd_expert_list"><img data-ng-src="{{dataItem.ExpertPhoto?dataItem.ExpertPhoto:\'/assets/images/NoAvatar.jpg\'}}" alt="{{dataItem.ExpertName}}" onerror="this.src=\'/assets/images/NoAvatar.jpg\'"><strong>{{dataItem.ExpertName}}</strong><small>{{dataItem.Position}}</small></span>',
                    optionLabelTemplate: '<span class="dd_expert_list"><strong>Assign approver</strong></span>',
                    dataSource: new kendo.data.DataSource({
                        data: {
                            'experts': []
                        },
                        schema: {
                            data: 'experts'
                        }
                    }),
                    open: function (e) {
                        setTimeout(function () {
                            e.sender.list.closest('.k-animation-container').addClass('dd_expert_container');
                        });
                    },
                    height: 300
                };

                $scope.$watchCollection('dataDisciplines', function (next, prev) {
                    if (_.size(next) > 0) {
                        if (!_.some(next, ['isPrimary', true])) $scope.dataDisciplines[0].isPrimary = true;
                        if ($scope.type !== 'Publications') {
                            KnowledgeDiscoveryApi.api.GetSmeUser.save(JSON.stringify(_.map(_.filter(next, function (o) { return o.isPrimary }), 'Id'))).$promise.then(function (res) {
                                $scope.ctrlExpert.setDataSource(new kendo.data.DataSource({
                                    data: {
                                        'experts': _.map(res, function (o, idx) { return { ExpertID: o.id, ExpertName: _.isEmpty(o.displayName) ? o.userName : o.displayName, Position: o.disciplineName, ExpertPhoto: Utils.getImage('avatar', o.id) } })
                                    },
                                    schema: {
                                        data: 'experts'
                                    }
                                }));
                                if (_.size(res) > 0) {
                                    if (!_.isEmpty(assignData) && !_.isEmpty(assignData.expert)) $scope.dataExpert = { ExpertID: assignData.expert.ExpertID, ExpertName: assignData.expert.ExpertName };
                                    if (_.isEmpty($scope.dataExpert) || _.findIndex(res, ['id', $scope.dataExpert.ExpertID]) === -1) {
                                        $scope.dataExpert = { ExpertID: _.head(res).id, ExpertName: _.head(res).displayName };
                                    }
                                    $timeout(function () { $scope.Validator.validateInput($("select[name=Expert]")); });
                                }
                            });
                        }
                    } else {
                        $scope.ctrlExpert.setDataSource(new kendo.data.DataSource({
                            data: {
                                'experts': []
                            },
                            schema: {
                                data: 'experts'
                            }
                        }));
                        $scope.dataExpert = null;
                    }
                });

                $scope.Validation = {
                    rules: {
                        collection: function (input) {
                            if (input.is("[data-collection-msg]")) {
                                if (_.size($scope.dataDisciplines) === 0) return false;
                            }
                            return true;
                        },
                        subcollection: function (input) {
                            if (input.is("[data-collection-msg]")) {
                                var flag = true;
                                _.forEach(_.filter($scope.dataDisciplines, 'isPrimary'), function (o) {
                                    if (_.size(o.subs) === 0) flag = false;
                                });
                                return flag;
                            }
                            return true;
                        }
                    },
                    messages: {
                        required: Message.Msg1,
                        collection: Message.Msg1,
                        subcollection: Message.Msg3
                    }
                };

                if ($scope.isMultiline) {
                    $scope.$on('AssignList', function (event, data) {
                        var oldValue = data.get();
                        if (oldValue) {
                            oldValue.discipline = angular.copy($scope.dataDisciplines);
                            oldValue.expert = angular.copy($scope.dataExpert);
                            oldValue.dataAttachments = angular.copy($scope.dataAttachments);
                        } else {
                            oldValue = {
                                discipline: angular.copy($scope.dataDisciplines),
                                expert: angular.copy($scope.dataExpert),
                                dataAttachments: angular.copy($scope.dataAttachments)
                            }
                        }
                        data.set(oldValue);
                    });
                    $scope.$on('AssignValidate', function (event, data) {
                        $timeout(function () {
                            $scope.Validator.validate();
                        });
                    });
                } else {
                    $scope.$on('Assign', function (event, data) {
                        var oldValue = data.get($scope.idx);
                        if (oldValue) {
                            oldValue.discipline = angular.copy($scope.dataDisciplines);
                            oldValue.expert = angular.copy($scope.dataExpert);
                            oldValue.dataAttachments = angular.copy($scope.dataAttachments);
                        } else {
                            oldValue = {
                                discipline: angular.copy($scope.dataDisciplines),
                                expert: angular.copy($scope.dataExpert),
                                dataAttachments: angular.copy($scope.dataAttachments)
                            }
                        }
                        data.set($scope.idx, oldValue);
                    });
                }

                function _Toggle(idx) {
                    _.forEach($scope.dataDisciplines, function (o) {
                        o.isExpand = false;
                    });
                    _.set($scope.dataDisciplines, '[' + idx + '].isExpand', true);
                    _.set($scope.dataDisciplines, '[' + idx + '].isNew', false);
                    $scope.paraNew = false;
                };

                function _MakePrimary(event, idx) {
                    event.stopPropagation();
                    var currentPrimary = _.findIndex($scope.dataDisciplines, ['isPrimary', true]);
                    _.forEach($scope.dataDisciplines, function (o) {
                        o.isPrimary = false;
                    });
                    _.set($scope.dataDisciplines, '[' + idx + '].isPrimary', true);
                    if (currentPrimary !== idx) {
                        if ($scope.type !== 'Publications') {
                            KnowledgeDiscoveryApi.api.GetSmeUser.save(JSON.stringify(_.map(_.filter($scope.dataDisciplines, function (o) {
                                return o.isPrimary
                            }), 'Id'))).$promise.then(function (res) {
                                $scope.ctrlExpert.setDataSource(new kendo.data.DataSource({
                                    data: {
                                        'experts': _.map(res, function (o, idx) {
                                            return {
                                                ExpertID: o.id, ExpertName: _.isEmpty(o.displayName) ? o.userName : o.displayName, Position: o.disciplineName, ExpertPhoto: Utils.getImage('avatar', o.id)
                                            }
                                        })
                                    },
                                    schema: {
                                        data: 'experts'
                                    }
                                }));
                                if (_.size(res) > 0) {
                                    if (!_.isEmpty(assignData) && !_.isEmpty(assignData.expert)) $scope.dataExpert = {
                                        ExpertID: assignData.expert.ExpertID, ExpertName: assignData.expert.ExpertName
                                    };
                                    if (_.isEmpty($scope.dataExpert) || _.findIndex(res, ['id', $scope.dataExpert.ExpertID]) === -1) {
                                        $scope.dataExpert = {
                                            ExpertID: _.head(res).id, ExpertName: _.head(res).displayName
                                        };
                                    }
                                    $timeout(function () {
                                        $scope.Validator.validateInput($("select[name=Expert]"));
                                    });
                                }
                            });
                        }
                    }
                };

                function _Remove(idx, rootId) {
                    if (rootId === null) {
                        $scope.dataDisciplines.splice(idx, 1);
                    }
                    else {
                        _.forEach($scope.dataDisciplines, function (o) {
                            _.remove(o.subs, function (o1, index) {
                                return index == idx;
                            })
                        });
                    }
                };

                function _RegClick(parentId) {
                    $timeout(function () {
                        var subControl = $scope.ctrlSubDiscipline[parentId];
                        var autocompleteInput = subControl.element;

                        autocompleteInput.on('click', function (e) {
                            var value = autocompleteInput.val();
                            subControl.search(value);
                        });
                    }, 1000);
                };

                $scope.funcToggle = _Toggle;
                $scope.funcMakePrimary = _MakePrimary;
                $scope.funcRemove = _Remove;
            },
            templateUrl: 'app/main/apps/bulk-upload/_directives/assign-discipline.html',
        };
    }
})();
