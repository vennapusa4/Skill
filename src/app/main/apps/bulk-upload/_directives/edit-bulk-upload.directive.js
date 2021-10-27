/**
 * @author v.lugovksy
 * created on 16.12.2015
 */
(function () {
    'use strict';

    angular.module('app.bulkUpload')
        .directive('editBulkUpload', editBulkUpload);

    /** @ngInject */
    function editBulkUpload() {
        return {
            restrict: 'AE',
            scope: {
                idx: '@',
                kdid: '@', // kdid="{{record.documentId}}"
                type: '@',
                row:'=',
                isedited: '@'
            },
            controller: function ($scope, $filter, $state, $stateParams, $location, $anchorScroll, $timeout, KnowledgeDiscoveryApi, KnowledgeService, SearchApi, AutosaveService, Utils, Message, logger, $rootScope, UserProfileApi, TranslatorApi,KnowledgeDocumentApi,appConfig) {
                
                console.log("Coming In Edit");
                var vm = this;
                $scope.IsNew = false;
                $scope.ParentId = 0;
                $scope.editableContent = true;
                $scope.editableValue = false;
                $scope.Tooltip = [];
                $scope.Field = {
                    documentId: $scope.kdid,
                    beenReplicated: false,
                    submittedAsValidated : false,
                    validationRemarks: "",
                    projectTypeId : "",
                    referenceKdIds: [],
                    isEdit : false,
                    valueCreateds: [],
                    valueCreations: [],
                    valueCreated: 0,
                    userRole: 'CreatedBy',
                    IsSkip: $rootScope.userInfo.userAppConfiguration.skipShareDocumentDialog
                }

                if ($scope.type === 'Pub') $scope.Field['Expert'] = {};


                $scope.SubDiscipline = {};
                $scope.SubDisciplineCtrl = {};
                $scope.Confirm = {};

                $scope.QuestionsEnglish = {};
                $scope.Questions = {};
                $scope.QuestionsEnglish.externalReference = 'PTG / PTS or External Reference (Optional)';
                $scope.QuestionsEnglish.knowledgeBeenReplicate = 'Is this a replication from other knowledge? <strong class="req">*</strong>';
                $scope.QuestionsEnglish.SourceReplicate = 'Replication Source <strong class="req">*</strong>';
                $scope.QuestionsEnglish.disciplineMsg = 'Select a discipline';
                $scope.QuestionsEnglish.tooltipSME = 'Appointed Subject Matter Expert (SME) to validate the contents.';
                $scope.QuestionsEnglish.tooltipEndorser = 'Business Leaders (G4 and above) to endorse the values.';
                $scope.QuestionsEnglish.beenValidated = 'Has this knowledge been validated? <strong style="color:red">*</strong>';
                $scope.QuestionsEnglish.validationRemark = 'Validation Remarks <strong style="color:red">*</strong>';
                $scope.QuestionsEnglish.validationRemark = 'Validation Remarks <strong style="color:red">*</strong>';
                $scope.QuestionsEnglish.disciplinePrimary = 'Primary';
                $scope.QuestionsEnglish.disciplineMPrimary = 'Make Primary';
                $scope.QuestionsEnglish.discipline = 'Discipline (SKG/FSA) <strong style="color:red">*</strong>';
                $scope.QuestionsEnglish.disciplineMsg = 'Select a discipline';
                $scope.QuestionsEnglish.addDisciplineSub = 'Add new sub-discipline<br><small>Search for title of sub-discipline (Press Space to see all available sub disciplines) </small>';
                $scope.QuestionsEnglish.addSubDiscipline = 'Add sub-discipline';
                $scope.QuestionsEnglish.addNewDiscipline = 'Add new discipline<br><small>Search for title of discipline (Press Space to see all available disciplines)</small>';
                $scope.QuestionsEnglish.addDiscipline = 'Add Discipline';
                $scope.QuestionsEnglish.projectStatus = 'Project Status <strong style="color:red">*</strong>';
                $scope.QuestionsEnglish.sme = 'Subject Matter Expert (SME) <strong style="color:red">*</strong>';
                $scope.QuestionsEnglish.smeMsg = 'Choose an expert to validate this experience<br><small>Experts listed will be based on the discipline chosen</small>';
                $scope.QuestionsEnglish.valueCreation = 'Value Creation';
                $scope.QuestionsEnglish.valueCreationType = 'Value Creation Type <strong class="req">*</strong><small>Select the current project status</small>';
                $scope.QuestionsEnglish.ongoingProject = 'Ongoing Project';
                $scope.QuestionsEnglish.completedProject = 'Completed Project';
                $scope.QuestionsEnglish.newValue = 'New Value';
                $scope.QuestionsEnglish.valueType = 'Value Type';
                $scope.QuestionsEnglish.estimationValue = 'Estimation Value';
                $scope.QuestionsEnglish.remarks = 'Remarks';
                $scope.QuestionsEnglish.skr = 'SKILL Knowledge Referenced (REPLICATION) (if any)';
                $scope.QuestionsEnglish.addValue = 'Add Value';
                $scope.QuestionsEnglish.total = 'Total';
                $scope.QuestionsEnglish.addInfoDescription = 'Add project, well, equipment and / or other attribute';
                $scope.QuestionsEnglish.projectStatusDescription = 'Select the current project status';
                $scope.QuestionsEnglish.valueCreationDescription = ' What is the Value Creation (cost saving, cost avoidance,  yield improvement)? Please include basis of calculation';
                $scope.QuestionsEnglish.endorser = 'Endorser <strong style="color:red">*</strong>';
                $scope.QuestionsEnglish.endorserMsg = 'Select an endorser to validate this experience<br><small>Search for name of endorser</small>';
                $scope.Questions = $scope.QuestionsEnglish;
                $scope.Field.projectStatus = null;
                $scope.Field.projectTypeId = '';
                $scope.valueCreation;

                if($scope.row != undefined){
                   // $scope.Field.documentId = _.isNull($scope.row.documentId) ? null : $scope.row.documentId;
                    $scope.Field.endorserUserId = _.isNull($scope.row.endorserUserId) ? null : $scope.row.endorserUserId;
                    $scope.Field.Endorser = _.isNull($scope.row.Endorser) ? null : $scope.row.Endorser;
                    $scope.Field.EndorserName = _.isNull($scope.row.EndorserName) ? null : $scope.row.EndorserName;
                    $scope.Field.disciplines = _.isNull($scope.row.disciplines) ? null : $scope.row.disciplines
                    $scope.Field.smeUserId = _.isNull($scope.row.smeUserId) ? null : $scope.row.smeUserId;
                    $scope.Field.submittedAsValidated = _.isNull($scope.row.submittedAsValidated) ? null : $scope.row.submittedAsValidated
                    $scope.Field.validationRemarks = _.isNull($scope.row.validationRemarks) ? null : $scope.row.validationRemarks
                    $scope.Field.referenceKdIds = _.isNull($scope.row.referenceKdIds) ? null : $scope.row.referenceKdIds;
                    $scope.Field.projectTypeId = _.isNull($scope.row.projectTypeId) ? null : $scope.row.projectTypeId
                    $scope.Field.valueCreationId = _.isNull($scope.row.valueCreationId) ? null : $scope.row.valueCreationId;
                    $scope.Field.valueCreateds = _.isEmpty($scope.row.valueCreateds) ? [] : $scope.row.valueCreateds;
                    $scope.Field.Expert = _.isNull($scope.row.Expert) ? [] : $scope.row.Expert;
                    $scope.Field.valueTypes = _.isNull($scope.row.valueTypes) ? [] : $scope.row.valueTypes;
                }
              
                if($scope.Field.projectTypeId == 1)
                {
                    $scope.Field.projectStatus = "completed";
                }
                else if($scope.Field.projectTypeId == 2){
                    $scope.Field.projectStatus = "ongoing";
                }
                

                if ($scope.Field.valueCreationId == 1) {
                    $scope.isValueRealized = true;
                }

                if ($scope.Field.referenceKdIds != null && $scope.Field.referenceKdIds.length!=0 ) {
                    $scope.Field.beenReplicated = true;
                  }
                  else {
                    $scope.Field.referenceKdIds = [];
                  }

                  function checkReplicated(value) {
                        $scope.Field.beenReplicated = value;
                  }

               

                $scope.Source = {
                    dataTextField: "Text",
                    dataValueField: "Id",
                    minLength: 1,
                    delay: 500,
                    dataSource: {
                        serverFiltering: true,
                        transport: {
                            read: function (options) {
                                var filters = [];
                                if ($scope.ParentId == null) {
                                    filters = _.map($scope.Field.disciplines, 'Id');
                                } else {
                                    filters = _.map(_.head(_.filter($scope.Field.disciplines, ['Id', $scope.ParentId])).subs, 'Id');
                                }
                                return KnowledgeDiscoveryApi.getDiscipline(options, $scope.ParentId, filters, "");
                            }
                        }
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
                                return KnowledgeDiscoveryApi.getSkillTA(options, $scope.Field.documentId)
                            }
                        }
                    }
                };

                $scope.Experts = {
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
                    height: 400
                };

                $scope.Endorsers = {
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
                        $scope.Field.EndorserID = e.dataItem.name;
                        $scope.Field.EndorserName = e.dataItem.displayName;
                    }
                };

                $scope.ValueTypes = {
                    dataTextField: "Text",
                    dataValueField: "Id",
                    optionLabel: 'Select Text...',
                    optionLabelTemplate: '<span>Select Text...</span>',
                    dataSource: new kendo.data.DataSource({
                        transport: {
                            read: function (options) {
                                var result = _.map($scope.Field.valueTypes, function (o) { return { Id: o.id, Text: o.valueTypeName } });
                                return options.success(result);
                            }
                        }
                    }),
                    dataBound: function (e) {

                    },
                    // valueTemplate: '<span><span ng-if="dataItem.Description" kendo-tooltip k-content="dataItem.Description" style="display:block">{{dataItem.Text}}</span><span ng-if="!dataItem.Description">{{dataItem.Text}}</span></span>',
                    // template: '<span><span ng-if="dataItem.Description" kendo-tooltip k-content="dataItem.Description" style="display:block">{{dataItem.Text}}</span><span ng-if="!dataItem.Description">{{dataItem.Text}}</span></span>'
                };

                $scope.Validation = {
                    rules: {
                        collection: function (input) {
                            if (input.is("[data-collection-msg]")) {
                                if (_.size($scope.Field.disciplines) === 0) return false;
                            }
                            return true;
                        },
                        subcollection: function (input) {
                            if (input.is("[data-collection-msg]")) {
                                var flag = true;
                                _.forEach(_.filter($scope.Field.disciplines, 'isPrimary'), function (o) {
                                    if (_.size(o.subs) === 0) flag = false;
                                });
                                return flag;
                            }
                            return true;
                        },
                        invalidReferenceKd: function (input) {
                            if (input.is("[data-invalidReferenceKd-msg]")) {
                                if (_.size($scope.Field.referenceKdIds) === 0) return false;
                            }
                            return true;
                        },
                        username: function (input) {
                            if (input.is("[name='Endorser']") && _getValueCreate() > 0) {
                                return ($scope.Field.Endorser === $scope.Field.EndorserName) && !(_.isNull($scope.Field.Endorser));
                            }
                            return true;
                        },
                        radio: function(input) {
                            if (input.is("[name='projectStatus']")) {
                                return $("#validateForm").find("[type=radio][name=" + input.attr("name") + "]").is(":checked");
                            }
                            return true;
                        }
                    },
                    messages: {
                        required: Message.Msg1,
                        collection: Message.Msg1,
                        subcollection: Message.Msg3,
                        username: 'Invalid User Name.',
                        radio : Message.Msg1,
                        invalidReferenceKd: 'Select Knowledge From List'
                        
                    }
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
                
                var expertProfile = {};

                $scope.getKnowledgeValues = function(){
                    KnowledgeDiscoveryApi.api.Validate.get({ type: _getDocType(), id: $scope.kdid }).$promise.then(function (res) {
                        $scope.Field.disciplines = _.map(_.groupBy(res.disciplines, 'disciplineId'), function (val, key) {
                            return {
                                Id: parseInt(key),
                                Text: _.head(val).disciplineName,
                                isPrimary: _.head(val).isPrimary,
                                isExpand: false,
                                isNew: false,
                                subs: _.map(val, function (o) { return { Id: o.subDisciplineId, Text: o.subDisciplineName } })
                            };
                        });
                        expertProfile = res.userProfile;
                        if (!_.isEmpty(res.endoserProfile)) {
                            $scope.Field.Endorser = res.endoserProfile.displayName;
                            $scope.Field.EndorserID = res.endoserProfile.userName;
                            $scope.Field.EndorserName = res.endoserProfile.displayName;
                        }
    
                        $scope.Field.valueCreationId = res.valueCreationId;
                        if ($scope.Field.valueCreationId == 1) {
                            $scope.isValueRealized = true;
                        }
                        $scope.Field.valueCreations = res.valueCreations;
                        $scope.Field.valueTypes = res.valueTypes;
    
                        _.forEach(res.valueCreateds, function (o, idx) {
                            $scope.Tooltip.push({});
                            if(o.valueCreationTypeId == 1){
                                $scope.isValueRealized = true;
                            }
                            $scope.Field.valueCreateds.push({
                                id: o.id,
                                ValueTypeId: { Id: o.valueTypeId },
                                EstimatedValue: o.estimatedValue,
                                Remarks: o.remarks,
                                KdReference: o.referenced ? o.referenced.title : null,
                                KdReferenceId: o.referenced ? o.referenced.id : null,
                               // valueCreationTypeId : o.valueCreationTypeId
                            });
                        });
    
                        if ($stateParams.shareId != undefined && $stateParams.shareId != 0 && $stateParams.shareId != '0') {
                            $scope.Tooltip.push({});
                            if(o.valueCreationTypeId == 1){
                                $scope.isValueRealized = true;
                            }
                            $scope.Field.valueCreateds.push({
                                id: null,
                                ValueTypeId: { Id: 0 },
                                EstimatedValue: 0,
                                Remarks: '',
                                KdReference: $stateParams.shareTitle,
                                KdReferenceId: $stateParams.shareId,
                               // valueCreationTypeId : o.valueCreationTypeId
                            });
                        }
    
                        $scope.Field.userRole = res.userRole;
    
                        _.forEach($scope.Field.disciplines, function (o) {
                            _RegClick(o.Id);
                        });
    
                        var statuses = ['Review', 'Amend', 'Approve', 'Reject', 'Endorse'];
                        console.log(_.map(KnowledgeService.getBuild('cops'), function (o) { return o }));
                        console.log(_.indexOf(statuses, res.smeStatus) > -1 && _.indexOf(statuses, res.endorseStatus) > -1);
    
                        if (_.indexOf(statuses, res.smeStatus) > -1 && _.indexOf(statuses, res.endorseStatus) > -1) {
                            // $scope.editableContent = _.isEqual(res.smeStatus, 'Amend') && (_.indexOf(['Amend', 'Endorse', 'Reject'], res.endorseStatus) > -1);
                            $scope.editableValue = _.isEqual(res.endorseStatus, 'Amend');
                        }
                        $scope.status = res.smeStatus;
                        $scope.endorserStatus = res.endorseStatus;
    
                        $scope.Field.submittedAsValidated = res.submittedAsValidated;
                        $scope.Field.validationRemarks = res.validationRemarks;
                        $scope.Field.projectTypeId = res.projectTypeId;
          
                        if($scope.Field.projectTypeId == 1)
                        {
                            $scope.Field.projectStatus = "completed";
                        }
                        else if($scope.Field.projectTypeId == 2){
                            $scope.Field.projectStatus = "ongoing";
                        }
    
    
                        console.log("Status:" + $scope.status)
    
                        $scope.CopOptions = res.cops;
                        $scope.replicateEmails = res.replicateEmails;
                        console.log($scope.replicateEmails);
                        $scope.Field.copId = res.copId;
    
                    }, function (err) {
                        logger.error(err.data.message);
                    });
                }
                   
                
               if($scope.isedited != "true" ){
                $scope.getKnowledgeValues();
               }else{
                $scope.expertProfile = $scope.Field.Expert;
                
                
               }
               
             

                $scope.checkValidated = function (value) {
                    if (value == false) {
                        if ($stateParams.type !== 'Pub') {
                            KnowledgeDiscoveryApi.api.GetSmeUser.save(JSON.stringify(_.map(_.filter($scope.Field.disciplines, function (o) { return o.isPrimary }), 'Id'))).$promise.then(function (res) {
                                
                                var KExpertsDropdownList = $("#KExpertsDropdownList").data("kendoDropDownList");
                                KExpertsDropdownList.setDataSource(new kendo.data.DataSource({
                                    data: {
                                        'experts': _.map(res, function (o, idx) { return { ExpertID: o.id, ExpertName: _.isEmpty(o.displayName) ? o.userName : o.displayName, Position: o.disciplineName, ExpertPhoto: Utils.getImage('avatar', o.id) } })
                                    },
                                    schema: {
                                        data: 'experts'
                                    }
                                }));
                                if (_.size(res) > 0) $scope.Field.Expert = { ExpertID: _.head(res).id };
                                if (!_.isEmpty(expertProfile)) {
                                    $scope.Field.Expert = { ExpertID: expertProfile.id };
                                    expertProfile = {};
                                }
                                $timeout(function () { $scope.Validator.validateInput($("select[name=Expert]")); });
                            });
                        }
                    }
                    else {
                        if ($stateParams.type !== 'Pub') {
                            KnowledgeDiscoveryApi.api.GetSmeUser.save(JSON.stringify(_.map(_.filter($scope.Field.disciplines, function (o) { return o.isPrimary }), 'Id'))).$promise.then(function (res) {
                                var KExpertsDropdownList = $("#KExpertsDropdownList").data("kendoDropDownList");
                                KExpertsDropdownList.setDataSource(new kendo.data.DataSource({
                                    data: {
                                        'experts': ''
                                    },
                                    schema: {
                                        data: ''
                                    }
                                }));
                                $scope.Field.Expert = "";

                            });
                        }
                    }
                    $scope.Field.submittedAsValidated = value;
                }

                $scope.checkProjectStatus = function(status){
                    if(status == true){
                        $scope.Field.projectTypeId = 1;
                    }
                    else {
                        $scope.Field.projectTypeId = 2;
                    }
                    $timeout(function () { $scope.Validator.validateInput($("input[name=projectStatus]")); });
                }

                
                $scope.$watchCollection('Field.disciplines', function (next, prev) {
                    if (_.size(next) > 0) {
                        if (!_.some(next, ['isPrimary', true])) $scope.Field.disciplines[0].isPrimary = true;
                        if ($stateParams.type !== 'Pub') {
                            KnowledgeDiscoveryApi.api.GetSmeUser.save(JSON.stringify(_.map(_.filter(next, function (o) { return o.isPrimary }), 'Id'))).$promise.then(function (res) {
                                var KExpertsDropdownList = $("#KExpertsDropdownList").data("kendoDropDownList");
                                KExpertsDropdownList.setDataSource(new kendo.data.DataSource({
                                    data: {
                                        'experts': _.map(res, function (o, idx) { return { ExpertID: o.id, ExpertName: _.isEmpty(o.displayName) ? o.userName : o.displayName, Position: o.disciplineName, ExpertPhoto: Utils.getImage('avatar', o.id) } })
                                    },
                                    schema: {
                                        data: 'experts'
                                    }
                                }));
                                if (_.size(res) > 0) $scope.Field.Expert = { ExpertID: _.head(res).id };
                                if (!_.isEmpty($scope.expertProfile)) {
                                    $scope.Field.Expert = { ExpertID: $scope.expertProfile.ExpertID };
                                    $scope.expertProfile = {};
                                }
                                $timeout(function () { $scope.Validator.validateInput($("select[name=Expert]")); });
                            });
                        }
                    } else {
                        // if ($stateParams.type !== 'Pub') {
                        //     $scope.KExperts.setDataSource(new kendo.data.DataSource({
                        //         data: {
                        //             'experts': []
                        //         },
                        //         schema: {
                        //             data: 'experts'
                        //         }
                        //     }));
                        // }
                    }
                });


                $scope.getSlectedValue = function(item , index){
                    $scope.Field.valueCreateds[index].Remarks =  _getValueTooltip(item.ValueTypeId.Id, 'description');
                    $scope.Tooltip[index].toolTip = _getValueTooltip(item.ValueTypeId.Id, 'toolTip');
                    $scope.Validator.validateInput($("input[name=Remarks]"));
                }

                function _NewAddValue(data) {
                    var newValue = { EstimatedValue: 0 };
                    //newValue['ValueTypeId'] = { Id: data };
        
                    if(data == 2) {
                        newValue['clicked'] = 'Potential Value';
                        newValue['valueCreationTypeId'] = 2;
                    } else if(data == 1) {
                        $scope.isValueRealized = true;
                        newValue['clicked'] = 'Value Realized';
                        newValue['valueCreationTypeId'] = 1;
                    }
                    
                    $scope.Field.valueCreateds.push(newValue);
                    $scope.Tooltip.push({
                        description: null,
                        baseCalculationDescription: null
                    });
                };

                //to check if there is no value realized then delete endorser
                $scope.checkValueCreation = 0;
                function _RemoveValue(idx) {
                    $scope.Field.valueCreateds.splice(idx, 1);
                    _.forEach($scope.Field.valueCreateds, function (o, idx) {
             
                        if(o.valueCreationTypeId == 1){
                            $scope.isValueRealized = true;
                            $scope.checkValueCreation= $scope.checkValueCreation + 1;
                        }
                    });

                    if($scope.checkValueCreation == 0){
                          $scope.Field.Endorser = "";
                    $scope.Field.EndorserID = "";
                    $scope.Field.EndorserName = "";
                    }
                };
                var _Skill = [];
                function _onSelectSkill(e) {
                    _Skill.push({
                        Id: e.dataItem.Id,
                        Text: e.dataItem.Text
                    });
                };

                function _MakePrimary(event, idx) {
                    event.stopPropagation();
                    var currentPrimary = _.findIndex($scope.Field.disciplines, ['isPrimary', true]);
                    if ($scope.editableContent) {
                        _.forEach($scope.Field.disciplines, function (o) {
                            o.isPrimary = false;
                        });
                        _.set($scope.Field.disciplines, '[' + idx + '].isPrimary', true);
                    }
                    if (currentPrimary !== idx) {
                        if ($stateParams.type !== 'Pub') {
                            KnowledgeDiscoveryApi.api.GetSmeUser.save(JSON.stringify(_.map(_.filter($scope.Field.disciplines, function (o) { return o.isPrimary }), 'Id'))).$promise.then(function (res) {
                                var KExpertsDropdownList = $("#KExpertsDropdownList").data("kendoDropDownList");
                                KExpertsDropdownList.setDataSource(new kendo.data.DataSource({
                                    data: {
                                        'experts': _.map(res, function (o, idx) { return { ExpertID: o.id, ExpertName: _.isEmpty(o.displayName) ? o.userName : o.displayName, Position: o.disciplineName, ExpertPhoto: Utils.getImage('avatar', o.id) } })
                                    },
                                    schema: {
                                        data: 'experts'
                                    }
                                }));
                                if (_.size(res) > 0) $scope.Field.Expert = { ExpertID: _.head(res).id };
                                if (!_.isEmpty(expertProfile)) {
                                    $scope.Field.Expert = { ExpertID: expertProfile.id };
                                    expertProfile = {};
                                }
                                $timeout(function () { $scope.Validator.validateInput($("select[name=Expert]")); });
                            });
                        }
                    }
                };


                function _Remove(idx, rootId) {
                    if ($scope.disableField == false && $scope.editableValue == false) {
                        if (rootId === null) {
                            $scope.Field.disciplines.splice(idx, 1);
                        }
                        else {
                            _.forEach($scope.Field.disciplines, function (o) {
                                _.remove(o.subs, function (o1, index) {
                                    return index == idx;
                                })
                            });
                        }
                        $timeout(function () { $scope.Validator.validateInput($("input[name=Discipline]")); });
                    }

                };

                function _Toggle(idx) {

                        _.forEach($scope.Field.disciplines, function (o) {
                            o.isExpand = false;
                        });
                        _.set($scope.Field.disciplines, '[' + idx + '].isExpand', true);
                        _.set($scope.Field.disciplines, '[' + idx + '].isNew', false);
                        $scope.IsNew = false;
                        $scope.ParentId = _.get($scope.Field.disciplines, '[' + idx + '].Id');
                };

                function _onOpen(e) {
                    $timeout(function () {
                        e.sender.list.closest('.k-animation-container').find('.k-list-container').addClass('multiselect_panel no_grouping');
                    });
                };

                function _onSelect(e) {
                    if (e.dataItem.ParentId == null) {
                        $scope.Field.disciplines.push({
                            Id: e.dataItem.Id,
                            Text: e.dataItem.Text,
                            isExpand: false,
                            isPrimary: false,
                            isNew: false,
                            subs: []
                        });
                        $timeout(function () {
                            $scope.NewDiscipline = "";
                            var last = $scope.Field.disciplines.length;
                            _Toggle(last - 1);
                            $scope.Field.disciplines[last - 1].isNew = true;
                            $scope.Validator.validateInput($("input[name=Discipline]"));
                        });

                        _RegClick(e.dataItem.Id);

                    } else {
                        var idx = _.indexOf(_.map($scope.Field.disciplines, function (o, idx) { return o.Id; }), e.dataItem.ParentId);
                        var current = _.get($scope.Field.disciplines, '[' + idx + '].subs');
                        current.push({
                            Text: e.dataItem.Text,
                            Id: e.dataItem.Id
                        });
                        _.set($scope.Field.disciplines, '[' + idx + '].subs', current);
                        $timeout(function () {
                            var parent = _.get($scope.Field.disciplines, '[' + idx + ']');
                            $scope.SubDiscipline[parent.Id] = "";
                            $scope.Validator.validateInput($("input[name=Discipline]"));
                        });
                    }
                };

        

                function _RegClick(parentId) {
                    $timeout(function () {
                        var subControl = $scope.SubDisciplineCtrl[parentId];
                        var autocompleteInput = subControl.element;

                        autocompleteInput.on('click', function (e) {
                            var value = autocompleteInput.val();
                            subControl.search(value);
                        });
                    }, 1000);
                };

                function _getValueCreate() {
                    return (_.reduce($scope.Field.valueCreateds, function (sum, o) {
                        var tmp = parseInt(o.EstimatedValue);
                        return sum + (_.isNaN(tmp) ? 0 : tmp);
                    }, 0));
                };
                function _getValueCreateFormattedString() {
                    return $filter('number')(_.reduce($scope.Field.valueCreateds, function (sum, o) {
                        var tmp = parseInt(o.EstimatedValue);
                        return sum + (_.isNaN(tmp) ? 0 : tmp);
                    }, 0));
                };

                function _getValueTooltip(valueId, field) {
                    var tmp = _.filter($scope.Field.valueTypes, function (o) { return o.id == valueId });
                    if (!_.isEmpty(tmp)) {
                        return _.head(tmp)[field];
                    }
                    return null;
                };
                $scope.knowledge = [];
                $scope.knowledgeScope = {
                    placeholder: "Select Knowledge Document for replication.",
                    dataTextField: "knowledgeDocumentTitle",
                    dataValueField: "knowledgeDocumentId",
                    filter: "contains",
                    minLength: 2,
                    delay: 500,
                    dataSource: {
                        serverFiltering: true,
                        transport: {
                            read: function (options) {
                                return KnowledgeDiscoveryApi.SearchKnowledgeReplication(options, $scope.knowledge);
                                // return AdminSettingCoPApi.GetAllUsers(options, $scope.modelValue);
                            }
                        },
                    },
                    open: function (e) {
                        $timeout(function () {
                            e.sender.list.closest('.k-animation-container').find('.k-list-container').addClass('multiselect_panel no_grouping');
                        });
                    },
                };

                function _onKnowledgeOpen(e) {
                    $timeout(function () {
                        e.sender.list.closest('.k-animation-container').find('.k-list-container').addClass('multiselect_panel no_grouping');
                    });
                };

                function _onKnowledgeSelect(e) {
                    var index = _.findIndex($scope.Field.referenceKdIds, function (obj) { return obj.kdId == e.dataItem.knowledgeDocumentId });
                    if (index == -1) {
                        $scope.Field.referenceKdIds.push({ "kdId": e.dataItem.knowledgeDocumentId, "kdTitle": e.dataItem.knowledgeDocumentTitle });
                    }

                    $timeout(function () {
                        $('#knowledge-list').parents("span").children(".k-clear-value").trigger('click');
                        $scope.knowledge = "";
                    }, 500);
                };

                function _RemoveKnowledge(idx) {
                    $scope.knowledge.splice(idx, 1);
                };

                $scope.onKnowledgeOpen = _onKnowledgeOpen;
                $scope.onKnowledgeSelect = _onKnowledgeSelect;
                $scope.Toggle = _Toggle;
                $scope.MakePrimary = _MakePrimary;
                $scope.Remove = _Remove;
                $scope.NewAddValue = _NewAddValue;
                $scope.RemoveValue = _RemoveValue;
                $scope.getValueCreate = _getValueCreate;
                $scope.getValueCreateFormattedString = _getValueCreateFormattedString;
                $scope.onSelectSkill = _onSelectSkill;
                $scope.onOpen = _onOpen;
                $scope.onSelect = _onSelect;
                $scope._RemoveKnowledge = _RemoveKnowledge;

                $scope.Save = function(){

                    if ($scope.Validator.validate()) {
                        $scope.Field.isEdit = true;
                        $scope.Field.isValid = true;
                        
                        $scope.$emit('onSave', {idx: $scope.idx, data:$scope.Field});
                    }
                  
                }

                $scope.Cancel = function(){


                    $scope.$emit('onCancel', {idx: $scope.idx, data:$scope.row});
                }

            },
            
            templateUrl: 'app/main/apps/bulk-upload/_directives/edit-bulk-upload.html',
        };
    }
})();
