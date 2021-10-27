/**
 * @author v.lugovksy
 * created on 16.12.2015
 */
(function () {
    'use strict';

    angular.module('app.knowledgeDiscovery')
        .directive('additionalInfo', additionalInfo);

    /** @ngInject */
    function additionalInfo(SearchApi, $anchorScroll, MasterDataProjectApi, MasterDataEquipmentApi, WellApi) {
        return {
            restrict: 'AE',
            scope: {
                disabled: "="
            },
          controller: function ($scope, $timeout, $rootScope) {

            $scope.Questions = {};
            $scope.Questions.chhoseAddInfo = $scope.$parent.Questions.chhoseAddInfo;
            $scope.Questions.newInfo = $scope.$parent.Questions.newInfo;
            $scope.Questions.newEntry = $scope.$parent.Questions.newEntry;
            $scope.Questions.createNewEntry = $scope.$parent.Questions.createNewEntry;
            $scope.Questions.entryName = $scope.$parent.Questions.entryName;
            $scope.Questions.entryType = $scope.$parent.Questions.entryType;
            $scope.Questions.addNewInfo = $scope.$parent.Questions.addNewInfo;

            $scope.showAddNew = false;

            $scope.showAdding = function(data) {
                $scope.showAddNew = data;
            }

            $scope.$on('changeQuestionsLanguage', function (event, data) {
              $scope.Questions.chhoseAddInfo = $scope.$parent.Questions.chhoseAddInfo;
              $scope.Questions.newInfo = $scope.$parent.Questions.newInfo;
              $scope.Questions.newEntry = $scope.$parent.Questions.newEntry;
              $scope.Questions.createNewEntry = $scope.$parent.Questions.createNewEntry;
              $scope.Questions.entryName = $scope.$parent.Questions.entryName;
              $scope.Questions.entryType = $scope.$parent.Questions.entryType;
              $scope.Questions.addNewInfo = $scope.$parent.Questions.addNewInfo;
            });

                $scope.AdditionalProjects = [];
                $scope.AdditionalWells = [];
                $scope.AdditionalEquipments = [];

                $scope.New = { type: 'Project', name: '' };
                $scope.AddNew = function () {
                    var postData = { name: $scope.New.name };
                    switch ($scope.New.type) {
                        case 'Project':
                            MasterDataProjectApi.addProject(postData).then(function (res) {
                                $scope.Additional = '';
                                $scope.showAddNew = false;
                            }, function (err) {
                                toastr(err.data.message, 'SKILL');
                            });
                            break;
                        case 'Well':
                            WellApi.addWell(postData).then(function (res) {
                                $scope.Additional = '';
                                $scope.showAddNew = false;
                            }, function (err) {
                                toastr(err.data.message, 'SKILL');
                            });
                            break;
                        case 'Equipment':
                            MasterDataEquipmentApi.addNew(postData).then(function (res) {
                                $scope.Additional = '';
                                $scope.showAddNew = false;
                            }, function (err) {
                                toastr(err.data.message, 'SKILL');
                            });
                            break;
                        default:
                            break;
                    }
                    $scope.New = { type: 'Project' };
                };

                $scope.CancelNew = function () {
                    $scope.New = { type: 'Project' };
                    $scope.showAddNew = false;
                };

                $scope.Hide = function () {
                    $scope.Additional = '';
                    $scope.AdditionalPopup.close();
                    $scope.showAddNew = false;
                };

                $scope.AllSource = {
                    dataTextField: "name",
                    dataValueField: "id",
                    placeholder: "Add project, well equipment and / or other attribute",
                    filter: "contains",
                    minLength: 0,
                    dataSource: {
                        serverFiltering: true,
                        transport: {
                            read: function (options) {
                                var postData = {
                                    ProjectFilters: _.map($scope.AdditionalProjects, function (o) { return o.ProjectName.id }),
                                    WellFilters: _.map($scope.AdditionalWells, function (o) { return o.WellName.id }),
                                    EquipmentFilters: _.map($scope.AdditionalEquipments, function (o) { return o.id }),
                                    KeyWordFilters: [],
                                };
                                return SearchApi.searchInformations(options, postData);
                            }
                        },
                        group: { field: "type" }
                    },
                    open: function (e) {
                        $timeout(function () {
                            e.sender.list.closest('.k-animation-container').find('.k-list-container').addClass('multiselect_panel custom_nodata');
                        });
                    },
                    select: function (e) {
                        switch (e.dataItem.type) {
                            case "Projects":
                                var index = _.findIndex($scope.AdditionalProjects, function (obj) { return obj.ProjectName.id == e.dataItem.id });
                                if (index == -1) {

                                    var ProjectObj = {
                                        ProjectName: {
                                            id: e.dataItem.id,
                                            name: e.dataItem.name
                                        },
                                        ProjectPhase: {

                                        }
                                    };

                                    $scope.AdditionalProjects.push(ProjectObj);
                                    $timeout(function(){
                                        $anchorScroll('project' + ($scope.AdditionalProjects.length - 1))
                                    }, 100)
                                    $scope.ClosePanel();
                                }
                                break;
                            case "Wells":
                                var index = _.findIndex($scope.AdditionalWells, function (obj) { return obj.WellName.id == e.dataItem.id });
                                if (index == -1) {

                                    var WellObj = {
                                        WellName: {
                                            id: e.dataItem.id,
                                            name: e.dataItem.name
                                        },
                                        WellPhase: {

                                        },
                                        WellOperations: {

                                        }
                                    };

                                    $scope.AdditionalWells.push(WellObj);
                                    $timeout(function(){
                                        $anchorScroll('well' + ($scope.AdditionalWells.length - 1))
                                    }, 100)
                                    $scope.ClosePanel();
                                }
                                break;
                            case "Equipments":
                                var index = _.findIndex($scope.AdditionalEquipments, function (obj) { return obj.id == e.dataItem.id });
                                if (index == -1) {

                                    var EquipmentObj = {
                                        id: e.dataItem.id,
                                        name: e.dataItem.name
                                    };

                                    $scope.AdditionalEquipments.push(EquipmentObj);
                                    $timeout(function(){
                                        $anchorScroll('equipment')
                                    }, 100)
                                    $scope.ClosePanel();
                                }
                                break;
                            case "Keywords":
                                break;
                            default:
                                break;
                        }

                        $scope.$apply(function () {
                            $scope.Additional = '';
                        });

      
        
                        $scope.arrAdditionalEquipments = _.map($scope.AdditionalEquipments, function (o) {
                            return {
                                equipmentId: o.id,
                            }
                        });
        
                        $scope.$emit('onAdditionalInformation',{equipments: $scope.arrAdditionalEquipments })
        
                    },
                    noDataTemplate: kendo.template($(".search_template").html()),
                };

                $scope.$on('onDeleteEquipment', function (event,data) {
                    $scope.AdditionalEquipments = data;
                });

                $timeout(function () {
                    var control = $scope.AdditionalPopup;
                    var autocompleteInput = control.element;

                    autocompleteInput.on('click', function (e) {
                        control.search('');
                    });
                }, 1000);

                //if ($rootScope.userInfo.isAdmin) {
                //    $scope.AllSource['noDataTemplate'] = kendo.template($(".search_template").html());
                //}

                $scope.$on('GetAdditionalInformation', function (event, data) {
                    $scope.AdditionalProjects = _.map(data.projects, function (o) {
                        return {
                            ProjectName: {
                                name: o.projectName,
                                id: o.id
                            },
                            ProjectPhase: {
                                name: o.projectPhaseName,
                                id: o.projectPhaseId
                            },
                            PPMS: {
                                name: o.ppmsActivityName,
                                id: o.ppmsActivityId
                            },
                            PRA: {
                                name: o.praElementName,
                                id: o.praElementId
                            }
                        };
                    });
                    $scope.AdditionalWells = _.map(data.wells, function (o) {
                        return {
                            WellName: {
                                name: o.wellName,
                                id: o.id
                            },
                            WellType: {
                                name: o.wellTypeName,
                                id: o.wellTypeId
                            },
                            WellPhase: {
                                name: o.wellPhaseName,
                                id: o.wellPhaseId
                            },
                            WellOperations: {
                                name: o.wellOperationName,
                                id: o.wellOperationId
                            }
                        };
                    });
                    $scope.AdditionalEquipments = _.map(data.equipments, function (o) { return { id: o.id, name: o.equipmentName } });
                });

     
                $('#ModalCreate').on('shown.bs.modal', function () {
                    var freeText = $('#additional-free-text').val();
                    $scope.$apply(function () {
                        $scope.New.name = freeText;
                    });
                    $('#x-entry-name').focus();
                })
            },
            templateUrl: 'app/main/apps/knowledge-discovery/_directives/additional-info.html',
            link: function ($scope, $element) {

                $scope.CloseAllPanel = function () {
                    setTimeout(function () {
                        $($element).find('.k-header').click();
                    }, 2000);
                }
                //$scope.CloseAllPanel();

                $scope.ClosePanel = function () {
                    $($element).find(".k-content").hide();
                    $($element).find(".k-state-selected").removeClass('k-state-selected');
                }

                setTimeout(function () {
                    $('#ModalCreate').on('shown.bs.modal', function (e) {
                        $(this).parents('li').addClass('modal_open');
                        $('body').removeClass('modal-open');
                    });

                    //Remove class when create modal is closed
                    $('#ModalCreate').on('hidden.bs.modal', function (e) {
                        $(this).parents('li').removeClass('modal_open');
                    });
                }, 1000);
            }
        };
    }
})();
