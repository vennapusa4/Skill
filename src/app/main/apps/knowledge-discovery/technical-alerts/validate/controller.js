(function () {
    'use strict';

    angular
        .module('app.knowledgeDiscovery')
      .controller('KnowledgeTechnicalAlertsValidateController', KnowledgeTechnicalAlertsValidateController);

    /** @ngInject */
  function KnowledgeTechnicalAlertsValidateController($scope, $filter, $state, $stateParams, $location, $anchorScroll, $timeout, KnowledgeDiscoveryApi, KnowledgeService, SearchApi, AutosaveService, Utils, Message, logger, $rootScope, UserProfileApi, TranslatorApi,appConfig,KnowledgeDocumentApi ) {
        var vm = this;

        $scope.Field = {
            disciplines: [],
            valueCreateds: [],
            valueCreations: [],
            valueCreated: 0,
            userRole: 'CreatedBy',
            IsSkip: false, 
            copId: 0
        };
        if ($stateParams.type === 'Pub') $scope.Field['Expert'] = {};
        $scope.IsNew = false;
        $scope.IsValidated = false;
        $scope.Dialog = false;
        $scope.editableContent = true;
       // $scope.editableValue = true;
        $scope.SubDiscipline = {};
        $scope.SubDisciplineCtrl = {};
        $scope.Confirm = {};
        $scope.ParentId = 0;
        $scope.Tooltip = [];

        $scope.isValueRealized = false;

        $scope.QuestionsEnglish = {};
        $scope.Questions = {};
        $scope.QuestionsEnglish.discipline = 'Discipline';
        $scope.QuestionsEnglish.disciplineMsg = 'Select a discipline';
        $scope.QuestionsEnglish.disciplinePrimary = 'Primary';
        $scope.QuestionsEnglish.disciplineMPrimary = 'Make Primary';
        $scope.QuestionsEnglish.addDisciplineSub = 'Add new sub-discipline<br><small>Search for title of sub-discipline (Press Space to see all available sub disciplines) </small>';
        $scope.QuestionsEnglish.addSubDiscipline = 'Add sub-discipline';
        $scope.QuestionsEnglish.addNewDiscipline = 'Add new discipline<br><small>Search for title of discipline (Press Space to see all available disciplines)</small>';
        $scope.QuestionsEnglish.addDiscipline = 'Add Discipline';
        $scope.QuestionsEnglish.sme = 'Group Technical Authority (GTA)';
        $scope.QuestionsEnglish.beenValidated = 'Has this knowledge been validated? <strong style="color:red">*</strong>';
        $scope.QuestionsEnglish.yes = 'Yes';
        $scope.QuestionsEnglish.no = 'No';
        $scope.QuestionsEnglish.validationRemark = 'Validation Remarks <strong style="color:red">*</strong>';
        $scope.QuestionsEnglish.sme = 'Group Technical Authority (GTA) <strong style="color:red">*</strong>';
        $scope.QuestionsEnglish.tooltipGTA = 'Appointed Group Technical Authority (GTA) to validate the contents & endorse the values for submitted Technical Alert.';
        $scope.QuestionsEnglish.projectStatus = 'Project Status <strong style="color:red">*</strong>';
        $scope.QuestionsEnglish.smeMsg = 'Select Group Technical Authority (GTA) Personnel';
        $scope.QuestionsEnglish.valueCreation = 'Value Creation';
        $scope.QuestionsEnglish.valueCreationType = 'Value Creation Type <strong class="req">*</strong><small>Select the current project status</small>';
        $scope.QuestionsEnglish.ongoingProject = 'Ongoing Project';
        $scope.QuestionsEnglish.completedProject = 'Completed Project';
        $scope.QuestionsEnglish.newValue = 'New Value';
        $scope.QuestionsEnglish.valueType = 'Value Type';
        $scope.QuestionsEnglish.estimationValue = 'Estimated Value';
        $scope.QuestionsEnglish.remarks = 'Remarks';
        $scope.QuestionsEnglish.skr = 'SKILL Knowledge Referenced (REPLICATION) (if any)';
        $scope.QuestionsEnglish.addValue = 'Add Value';
        $scope.QuestionsEnglish.total = 'Total';
        $scope.Field.projectStatus = null;
        $scope.Field.projectTypeId = '';
        $scope.valueCreation;
        $scope.Cop;
        // $scope.QuestionsEnglish.endorser = 'Endorser <strong style="color:red">*</strong>';
        // $scope.QuestionsEnglish.endorserMsg = 'Select an endorser to validate this experience<br><small>Search for name of endorser</small>';
        $scope.Questions = $scope.QuestionsEnglish;
        $scope.Cop;
        $scope.auditTrail = []
        $scope.CopOptions = [];
        vm.knowledgeDocumentId = $stateParams.id;
        $scope.status;
        $scope.disableField = false;
        $scope.passLoaded = false;
        $scope.viewMode;
        vm.config = appConfig;
        $scope.selectedSubDiscipline = [];


         function getKnowledgeDocumentDetail() {
        KnowledgeDocumentApi.api.knowledgeDocument.byId({}, {
            knowledgeDocumentId: vm.knowledgeDocumentId
            },
            function (response) {
                KnowledgeService.init(response);
                $scope.$broadcast('Get', { Get: KnowledgeService.get });
            if (!response || !response.kdId) {
                $("#notfound_modal").modal('show');
                $('#notfound_modal').on('hidden.bs.modal', function (e) {
              //  $state.go('app.LandingPageController');
                })
                return;
            }  
            
          vm.knowledgeDocument = response;
          $scope.knowledgeStatus =  vm.knowledgeDocument.status

          switch($scope.knowledgeStatus)
          {
              case "Review":$scope.knowledgeStatus="Reviewed";
              break;
              case "Submit":$scope.knowledgeStatus="Submitted";
              break;
              case "Approve":$scope.knowledgeStatus="Approved";
              break;
          } 
          $scope.Field.smeId=response.sme!=null?response.sme.userId:null;
          if(vm.knowledgeDocument.status != vm.config.Statuses.Draft){
            $scope.disableField = true;
          }
          else{
            $scope.disableField = false;
          }
          $scope.passLoaded = true;

        },
        function (response) {
          if (response.status !== 404)
            logger.error(response.data.errorMessage);
        });

    };
    if(vm.knowledgeDocumentId != undefined){
        getKnowledgeDocumentDetail();
    }
    $scope.getAuditTrial = function(){
        if($stateParams.id) {
            KnowledgeDiscoveryApi.getAuditTrial($stateParams.id).then(function (res) {
                if(res !=null && res != ""){
                $scope.auditTrail = res;
                }
            });
            }
    }
    $scope.getAuditTrial();
    $scope.$on("viewModeChanged", function (evt, mode) {
        $scope.viewMode = mode;
  

        if(vm.knowledgeDocument.status != vm.config.Statuses.Amend || 
        (vm.knowledgeDocument.sme != null && vm.knowledgeDocument.sme.userId != vm.userInfo.userId)){
                $scope.disableField = false;
         }

        if(vm.isReviewer && vm.knowledgeDocument.status == vm.config.Statuses.Submit){
            $scope.disableField = false;
        }
      });
            
 

      $scope.$on("clickedPrev", function () {    
        $state.go('^.build', { id: $stateParams.id }); 
      });

      $scope.$on("clickedPrev", function () {
            
        $state.go('^.build', { id: $stateParams.id });
      });
        if ($stateParams.shareLanguageCode !== null && $stateParams.shareLanguageCode !== undefined && $stateParams.shareLanguageCode != '')
        {
          _languageChange($stateParams.shareLanguageCode);
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
                        return KnowledgeDiscoveryApi.getDiscipline(options, $scope.ParentId, filters, $stateParams.shareLanguageCode);
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
                        return KnowledgeDiscoveryApi.getSkillTA(options , vm.knowledgeDocumentId)
                    }
                }
            }
        };

        $scope.EmailSource = {
            dataTextField: "PersonName",
            dataValueField: "Id",
            autoBind: false,
            delay: 500,
            dataSource: new kendo.data.DataSource({
                serverFiltering: true,
                transport: {
                    read: function (options) {
                        return KnowledgeDiscoveryApi.getEmails(options)
                    }
                }
            })
        };

        $scope.Experts = {
            dataTextField: "ExpertName",
            dataValueField: "ExpertID",
            valueTemplate: '<span class="dd_expert_list"><img data-ng-src="{{dataItem.ExpertPhoto?dataItem.ExpertPhoto:\'/assets/images/NoAvatar.jpg\'}}" alt="{{dataItem.ExpertName}}" onerror="this.src=\'/assets/images/NoAvatar.jpg\'"><strong>{{dataItem.ExpertName}}</strong><small>{{dataItem.Position}}</small></span>',
            template: '<span class="dd_expert_list"><img data-ng-src="{{dataItem.ExpertPhoto?dataItem.ExpertPhoto:\'/assets/images/NoAvatar.jpg\'}}" alt="{{dataItem.ExpertName}}" onerror="this.src=\'/assets/images/NoAvatar.jpg\'"><strong>{{dataItem.ExpertName}}</strong><small>{{dataItem.Position}}</small></span>',
            optionLabelTemplate: '<span class="dd_expert_list"><strong>Assign GTA</strong></span>',
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
            }
            //valueTemplate: '<span><span ng-if="dataItem.Description" kendo-tooltip k-content="dataItem.Description" style="display:block">{{dataItem.Text}}</span><span ng-if="!dataItem.Description">{{dataItem.Text}}</span></span>',
            //template: '<span><span ng-if="dataItem.Description" kendo-tooltip k-content="dataItem.Description" style="display:block">{{dataItem.Text}}</span><span ng-if="!dataItem.Description">{{dataItem.Text}}</span></span>'
        };

        $scope.Validation = {
            rules: {
                collection: function (input) {
                    if (input.is("[data-collection-msg]")) {
                        if (_.size($scope.Field.disciplines) === 0) return false;
                    }
                    return true;
                },
                // subcollection: function (input) {
                //     if (input.is("[data-collection-msg]")) {
                //         var flag = true;
                //         _.forEach(_.filter($scope.Field.disciplines, 'isPrimary'), function (o) {
                //             if (_.size(o.subs) === 0) flag = false;
                //         });
                //         return flag;
                //     }
                //     return true;
                // },
                subcollection: function (input) {
                    if (input.is("[data-collection-msg]")) {
                        if ((_.size($scope.Field.disciplines) === 0 )) return true;
                        if ((_.size($scope.Field.disciplines) !== 0 ) && (_.size($scope.selectedSubDiscipline) === 0 )  ) return false;
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
                subdiscipline: Message.Msg3, 
                radio : Message.Msg1
            }
        };

        var expertProfile = {};

        KnowledgeDiscoveryApi.api.Validate.get({ type: $stateParams.type, id: $stateParams.id }).$promise.then(function (res) {
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
            // debugger;
            // if (!_.isEmpty(res.userProfile)) {
            //     $scope.Field.Expert = { ExpertID: res.userProfile.id };
            //     // $scope.Field.EndorserID = res.endoserProfile.userName;
            //     // $scope.Field.EndorserName = res.endoserProfile.displayName;
            // }

            if (!_.isEmpty(res.endoserProfile)) {
                debugger;
                $scope.Field.Endorser = res.endoserProfile.displayName;
                $scope.Field.EndorserID = res.endoserProfile.userName;
                $scope.Field.EndorserName = res.endoserProfile.displayName;
            }

            //$scope.Field.valueCreationId = _.isNull(res.valueCreationId) ? res.valueCreations[0].id : res.valueCreationId;
            $scope.Field.valueCreations = res.valueCreations;
            $scope.Field.valueTypes = res.valueTypes;

            if ($stateParams.shareLanguageCode !== null && $stateParams.shareLanguageCode !== undefined && $stateParams.shareLanguageCode != '') {
              angular.forEach($scope.Field.valueCreations, function (value, key) {
                if (value.valueCreationName != undefined && value.valueCreationName != null && value.valueCreationName != "") {
                  TranslatorApi.api.TranslateSingleText.save({}, {
                    textToTranslate: value.valueCreationName,
                    fromLanguage: "en",
                    toLanguage: $stateParams.shareLanguageCode
                  },
                    function (response) {
                      value.valueCreationName = response.translatedText;
                    },
                    function (response) {
                      if (response.status !== 404)
                        logger.error(response.data.errorMessage);
                    });
                }
              });
            }

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
                    valueCreationTypeId : o.valueCreationTypeId
                });
            });

            if ($stateParams.shareId != undefined && $stateParams.shareId != 0 && $stateParams.shareId != '0') {
                $scope.Tooltip.push({});
                $scope.Field.valueCreateds.push({
                    id: null,
                    ValueTypeId: { Id: 0 },
                    EstimatedValue: 0,
                    Remarks: '',
                    KdReference: $stateParams.shareTitle,
                    KdReferenceId: $stateParams.shareId,
                    valueCreationTypeId : o.valueCreationTypeId
                });
            }

            $scope.Field.userRole = res.userRole;

            _.forEach($scope.Field.disciplines, function (o) {
                _RegClick(o.Id);
            });

            var statuses = ['Amend', 'Approve', 'Reject'/*, 'Endorse'*/];

            // if (_.indexOf(statuses, res.smeStatus) > -1 && _.indexOf(statuses, res.endorseStatus) > -1) {
            //     $scope.editableContent = _.isEqual(res.smeStatus, 'Amend') && (_.indexOf(['Amend', 'Endorse', 'Reject'], res.endorseStatus) > -1);
            //     $scope.editableValue = _.isEqual(res.endorseStatus, 'Amend') && (_.indexOf(['Amend', 'Approve', 'Reject'], res.smeStatus) > -1);
            // }
            $scope.Field.projectTypeId = res.projectTypeId;
          
            if($scope.Field.projectTypeId == 1)
            {
                $scope.Field.projectStatus = "ongoing";
            }
            else if($scope.Field.projectTypeId == 2){
                $scope.Field.projectStatus = "completed";
            }
            
            _.forEach(res.cops, function (o, idx) {
                $scope.CopOptions.push({
                    id:  parseInt(o.id, 10),
                    copName: o.copName
                });
            });
            $scope.Field.copId = res.copId;
            $scope.Field.coverId = res.coverImageId;
            
            $scope.$broadcast('GetCoverImage', { coverImage:res.coverImage, coverimageId: res.coverImageId});
            $scope.$broadcast('GetAdditionalInformation', { projects:res.additionalProjects, wells: res.additionalWells, equipments:res.additionalEquipments});
            $timeout(function () {
                AutosaveService.register(_AutoSave);
            }, 1000);
        }, function (err) {
            logger.error(err.data.message);
        });

        $scope.checkProjectStatus = function(status){
            if(status == "ongoing"){
                $scope.Field.projectTypeId = 1;
            }
            else {
                $scope.Field.projectTypeId = 2;
            }

            if($scope.Field.projectStatus == 'completed') {
                $scope.NewAddValue(1);
            }

            if($scope.Field.valueCreateds.length > 0) {
                $scope.Field.valueCreateds = $scope.Field.valueCreateds.filter(function(x){
                    return x.clicked === 'Value Realized';
                });
            }

            if($scope.Field.projectStatus == 'ongoing') {
                $scope.NewAddValue(2);
            }


            $timeout(function () { $scope.Validator.validateInput($("input[name=projectStatus]")); });
        }
        $scope.$on("clickedPreview", function () {
            _Preview();
          });

          $scope.$on("changePage", function (data, redirect) {
            $scope.redirecting = redirect;
            $timeout(function(){
              $('#redirectPosting').modal('show');
            }, 500);
            console.log(redirect);
          });
      
          $scope.confirmRedirect = function() {
            $('#redirectPosting').modal('hide');
            $timeout(function(){
              $state.go($scope.redirecting);
            }, 500);
          }

          $rootScope.$on('UpdateStatus', function (event, data) {
            $scope.getAuditTrial();
            getKnowledgeDocumentDetail();
          });

        $scope.$watchCollection('Field.disciplines', function (next, prev) {
            if (_.size(next) > 0) {
                if (!_.some(next, ['isPrimary', true])) $scope.Field.disciplines[0].isPrimary = true;
                if ($stateParams.type !== 'Pub') {
                    KnowledgeDiscoveryApi.api.GetGtaUser.save(JSON.stringify(_.map(_.filter(next, function (o) { return o.isPrimary }), 'Id'))).$promise.then(function (res) {
                        $scope.KExperts.setDataSource(new kendo.data.DataSource({
                            data: {
                                'experts': _.map(res, function (o, idx) { return { ExpertID: o.id, ExpertName: _.isEmpty(o.displayName) ? o.userName : o.displayName, Position: o.disciplineName, ExpertPhoto: Utils.getImage('avatar', o.id) } })
                            },
                            schema: {
                                data: 'experts'
                            }
                        }));
                        // if (_.size(res) > 0) $scope.Field.Expert = { ExpertID: _.head(res).id };
                        $scope.Field.Expert= { ExpertID: 0 };
                        if (!_.isEmpty(expertProfile)) {
                            $scope.Field.Expert = { ExpertID: expertProfile.id };
                            expertProfile = {};
                        }
                        $timeout(function () { $scope.Validator.validateInput($("select[name=Expert]")); });
                    });
                }
            } else {
                if ($stateParams.type !== 'Pub') {
                    $scope.KExperts.setDataSource(new kendo.data.DataSource({
                        data: {
                            'experts': []
                        },
                        schema: {
                            data: 'experts'
                        }
                    }));
                }
            }
        });

        $scope.getSlectedValue = function(item , index){
            $scope.Field.valueCreateds[index].Remarks =  _getValueTooltip(item.ValueTypeId.Id, 'description');
            $scope.Tooltip[index].toolTip = _getValueTooltip(item.ValueTypeId.Id, 'toolTip');
            $scope.Validator.validateInput($("input[name=Remarks]"));
        }

        function _onOpen(e) {
            $timeout(function () {
                e.sender.list.closest('.k-animation-container').find('.k-list-container').addClass('multiselect_panel no_grouping');
            });
        };

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

        $scope.checkValueCreation = 0;
        function _RemoveValue(idx) {
            $scope.checkValueCreation = 0;
            // $scope.Field.valueCreateds.splice(idx, 1);
            // $scope.Tooltip.splice(idx, 1);
            //   $scope.Field.Endorser = "";
            //     $scope.Field.EndorserID = "";
            //     $scope.Field.EndorserName = "";

               // if($scope.disableEndorseEdit == false && $scope.disableField == false){
                   debugger;
                    $scope.Field.valueCreateds.splice(idx, 1);
                    _.forEach($scope.Field.valueCreateds, function (o, idx) {
             
                        if(o.valueCreationTypeId == 1){
                            $scope.isValueRealized = true;
                            $scope.checkValueCreation= $scope.checkValueCreation + 1;
                        }
                    });
        
                    if($scope.checkValueCreation == 0){
                        $scope.isValueRealized = false;

                        $scope.Field.Endorser = null;
                        $scope.Field.EndorserID = null;
                        $scope.Field.EndorserName = null;
                    }
               // }
            
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
                $scope.selectedSubDiscipline.push(current);
                $scope.Validator.validateInput($("input[name=SubDisciplineField]"));
                $timeout(function () {
                    var parent = _.get($scope.Field.disciplines, '[' + idx + ']');
                    $scope.SubDiscipline[parent.Id] = "";
                    $scope.Validator.validateInput($("input[name=Discipline]"));
                });
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
                    KnowledgeDiscoveryApi.api.GetGtaUser.save(JSON.stringify(_.map(_.filter($scope.Field.disciplines, function (o) { return o.isPrimary }), 'Id'))).$promise.then(function (res) {
                        $scope.KExperts.setDataSource(new kendo.data.DataSource({
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
        };


        var _Skill = [];
        function _onSelectSkill(e) {
            _Skill.push({
                Id: e.dataItem.Id,
                Text: e.dataItem.Text
            });
        };

        $scope.autoSaveMsg = "";
        function _AutoSave(hasSave) {
            hasSave = hasSave || false;
            var errors = $scope.Validator.errors();
            if ($scope.Validator.validate()) {
                KnowledgeService.initValidate($scope.Field, $stateParams.id, _Skill);
                var postData = _.assignIn({ isAutoSave: true }, KnowledgeService.getValidate());
                // if (_getValueCreate() <= 0) {
                //     postData.endorseId = null;
                // }
                KnowledgeDiscoveryApi.api.SaveValidate.save({ type: $stateParams.type, isSubmit: false }, JSON.stringify(postData)).$promise.then(function (res) {
                    logger.success(hasSave ? "Save successfully!" : 'Autosave successfully');
                    $scope.autoSaveMsg = "Auto-saved 2 minutes ago";
                }, function (err) {
                    logger.error(err.data.message);
                });
            }
            else{
                logger.error("Some missing fields in (*)");
              }
            //if(errors.length == 0) $scope.Validator.hideMessages();
        };

        $scope.SubmitKnowledge=function (event)
        {
            event.preventDefault();
            if ($scope.Validator.validate()) {
                $scope.IsValidated = true;
                $scope.disableField = true;
                KnowledgeService.initValidate($scope.Field, $stateParams.id, _Skill);
                $scope.$broadcast('Submit', { Set: KnowledgeService.setAttr });
                var postData = KnowledgeService.getValidate();
                
                KnowledgeDiscoveryApi.api.SaveValidate.save({ type: $stateParams.type, isSubmit: true, isReviewer: vm.isReviewer }, JSON.stringify(postData)).$promise.then(function (res) {      
                         if (res.isConfirmSubmission) {
                             $scope.Confirm = res.confirmSubmit;
                             _showDialog();
                         } else {
                             logger.success("Submit successfully!");
                             $('#ModalSubmitted').modal('show');
                         }
                 }, function (err) {
                     logger.error(err.data.message);
                 });
            } 
            else{
                logger.error("Some missing fields in (*)");
              }
        
        };

        $scope.$on('uploadCoverImage', function(event, coverImage){
            
            $scope.Field.coverId = coverImage.id;
            $scope.Field.asCoverImage = coverImage.isAttachment;

            var tmp = coverImage.name.split('.');
            var extension = tmp[tmp.length - 1];
            $scope.Field.extensionImage = extension;

        });
        $scope.$on('onAdditionalInformation',function(event , data){
            $scope.Field.additionalEquipments = data.equipments;
        })

        $scope.Field.additionalProjects = []
        $scope.$on('projectAdded',function(event , project){
            var index = _.findIndex($scope.additionalProjects, function (obj) { return obj.projectId == project.ProjectName.id });
            var projectObj = {
                projectId: project.ProjectName.id,
                projectPhaseId: project.ProjectPhase.id,
                ppmsActivityId: project.PPMS.id,
                praElementsId: project.PRA.id
            };

            if(index == -1){
                $scope.Field.additionalProjects.push(projectObj);
            }
            else{
                $scope.Field.additionalProjects[index] = projectObj;
            }

                
        })

        $scope.Field.additionalWells = [];
        $scope.$on('wellsAdded',function(event , well){
            var index = _.findIndex($scope.additionalWells, function (obj) { return obj.wellId == well.WellName.id });
            var wellObj = {
                wellId: well.WellName.id,
                wellTypeId: well.WellType.id,
                wellPhaseId: well.WellPhase.id,
                wellOperationId: well.WellOperations.id,
            };

            if(index == -1){
                $scope.Field.additionalWells.push(wellObj);
            }
            else{
                $scope.Field.additionalWells[index] = wellObj;
            }
        })
        function _Save(event) {
            $scope.IsValidated = true;
            event.preventDefault();
           
                KnowledgeService.initValidate($scope.Field, $stateParams.id, _Skill);
                $scope.$broadcast('Submit', { Set: KnowledgeService.setAttr });
                var postData = KnowledgeService.getValidate();
               
                KnowledgeDiscoveryApi.api.SaveValidate.save({ type: $stateParams.type, isSubmit: false }, JSON.stringify(postData)).$promise.then(function (res) {
                   
                    logger.success('Saved Successfully as Draft');
                    $state.go($state.current,{ id :res.id }, {reload: true});
                    
                }, function (err) {
                    logger.error(err.data.message);
                });
            
        };

        function _Submit() {
            if ($scope.Field.ShareToEmail && ($scope.Field.Emails == null || $scope.Field.Emails.length <= 0)) {
                return;
            }
            $scope.$broadcast('Submit', { Set: KnowledgeService.setAttr });
            KnowledgeDiscoveryApi.api.SubmitValidate.save({ type: $stateParams.type }, JSON.stringify(KnowledgeService.getSubmit($scope.Field))).$promise.then(function (res) {
                //if (res.status === 'Submit' || res.status === 'Approve') {
                if(!$rootScope.userInfo.userAppConfiguration) {
                    $rootScope.userInfo.userAppConfiguration = {};
                }
                $rootScope.userInfo.userAppConfiguration.skipShareDocumentDialog = $scope.Field.IsSkip;
                UserProfileApi.saveUserInfo($rootScope.userInfo);
                _hideDialog();
                logger.success("Submit successfully!");
                $state.go('^.completed', { id: res.id });
                //}
            }, function (err) {
                logger.error(err.data.message);
            });
        };
        
        $scope.$on("clickedSaveAsDraft", function (evt) {
            _Save(evt);
          });

        function _Preview() {

            $scope.IsValidated = true;
            event.preventDefault();
            
                KnowledgeService.initValidate($scope.Field, $stateParams.id, _Skill);
                var postData = KnowledgeService.getValidate();
                $scope.$broadcast('Submit', { Set: KnowledgeService.setAttr });
                KnowledgeDiscoveryApi.api.SaveValidate.save({ type: $stateParams.type, isSubmit: false }, JSON.stringify(postData)).$promise.then(function (res) {
                   
                    var url = $state.href('app.knowledgeDiscovery.knowledgeDetail', { id: res.id });
                    window.open(url, '_blank');
                    
                }, function (err) {
                    logger.error(err.data.message);
                });
        };

        function _Back() {
            $state.go('^.build', { id: $stateParams.id });
        };
        $scope.isDone = function () {
            $('#ModalSubmitted').modal('hide');
            $timeout(function(){
              $state.go('app.knowledgeDiscovery.knowledgeDetail', { id: vm.knowledgeDocument.kdId });
            }, 500);
        }
        vm.reviewer = {}
        function getUserInfo() {
          vm.userInfo = UserProfileApi.getUserInfo();
          vm.isReviewer = vm.userInfo.roles.indexOf('KMI') != -1;
    
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

      function _showDialog() {
            //hiding the dialog based on user request
            $scope.Dialog = true;
            $scope.$emit('Dialog', { show: true });
        };

        function _hideDialog() {
          //  $scope.Field.IsSkip = $rootScope.userInfo.userAppConfiguration.skipShareDocumentDialog;
            $scope.Field.IsSkip = true;
            $scope.Dialog = false;
            $scope.$emit('Dialog', { show: false });
        };

        function _languageChange(inputLanguage) {
          if (inputLanguage == "en") {
              $scope.Questions = $scope.QuestionsEnglish;
          }
          else {
            TranslatorApi.api.TranslateMultipleHtmlText.save({}, {
              textToTranslate: $scope.QuestionsEnglish,
              fromLanguage: "en",
              toLanguage: inputLanguage
            },
              function (response) {
                $scope.Questions = response.translatedText;
              },
              function (response) {
                if (response.status !== 404)
                  logger.error(response.data.errorMessage);
              });
          }
        }

        getUserInfo();
     
        $scope.onOpen = _onOpen;
        $scope.onSelect = _onSelect;
        $scope.Toggle = _Toggle;
        $scope.MakePrimary = _MakePrimary;
        $scope.Remove = _Remove;
        $scope.RemoveValue = _RemoveValue;
      $scope.getValueCreate = _getValueCreate;
      $scope.getValueCreateFormattedString = _getValueCreateFormattedString;
        $scope.onSelectSkill = _onSelectSkill;
        $scope.Submit = _Submit;
        $scope.NewAddValue = _NewAddValue;
        $scope.Preview = _Preview;
        $scope.Back = _Back;
        $scope.showDialog = _showDialog;
        $scope.hideDialog = _hideDialog;
        $scope.autoSave = _AutoSave;

        $scope.$on("$destroy", function () {
            AutosaveService.destroy();
        });
    }
})();
