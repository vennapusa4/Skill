/**
 * @author v.lugovksy
 * created on 16.12.2015
 */
(function () {
    'use strict';

    angular.module('app.knowledgeDiscovery')
        .directive('skillAdditionProject', skillAdditionProject);

    /** @ngInject */
    function skillAdditionProject(SearchApi, $timeout, BulkUploadService) {

        return {
            restrict: 'AE',
            scope: {
                data: '=',
                total: '=',
                disabled: '='
            },
            controller: function ($scope,TranslatorApi) {
                // Clone 'data'
                $scope.dataChange = angular.copy($scope.data);
                $scope.isProjectPhaseRequired = false;
                $scope.isShowProjectNameRequired = null;
                $scope.isShowProjectPhaseRequired = null;

                $scope.QuestionsEnglish = {};
                $scope.Questions = {};
                $scope.QuestionsEnglish.project = 'Project';
                $scope.QuestionsEnglish.projectName = 'Project Name';
                $scope.QuestionsEnglish.projectPhase = 'Project Phase';
                $scope.QuestionsEnglish.pPMSActivity = 'PPMS Activity';
                $scope.QuestionsEnglish.pRAElements = 'PRA Elements';
                $scope.Questions = $scope.QuestionsEnglish;

              $scope.$on('changeInputLanguage', function (event, data) {
                var inputLanguage = data.inputLanguage;
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
                // do what you want to do
              });

                $scope.$watch('data', function (newVal, oldVal) {
                    $scope.dataChange = angular.copy(newVal);
                    var sourceName = BulkUploadService.getCurrentSource();
                    $scope.isProjectPhaseRequired = sourceName == "Success Story";
                   
                
                });
                $scope.ProjectNameSource = {
                    dataTextField: "name",
                    dataValueField: "id",
                    filter: "contains",
                    minLength: 1,
                    dataSource: {
                        serverFiltering: true,
                        transport: {
                            read: function (options) {
                                return SearchApi.SearchProject(options);
                            }
                        },
                        group: { field: "type" }
                    },
                    open: function (e) {
                        $timeout(function () {
                            e.sender.list.closest('.k-animation-container').find('.k-list-container').addClass('multiselect_panel');
                        });
                    },
                    select: function (e) {
                        $scope.dataChange.ProjectName = e.dataItem;
                    }
                };

                $scope.ProjectPhaseSource = {
                    dataTextField: "name",
                    dataValueField: "id",
                    filter: "contains",
                    minLength: 1,
                    dataSource: {
                        serverFiltering: true,
                        transport: {
                            read: function (options) {
                                return SearchApi.SearchProjectPhase(options);
                            }
                        },
                        group: { field: "type" }
                    },
                    open: function (e) {
                        $timeout(function () {
                            e.sender.list.closest('.k-animation-container').find('.k-list-container').addClass('multiselect_panel');
                        });
                    },
                    select: function (e) {
                        $scope.dataChange.ProjectPhase = e.dataItem;
                    }
                };

                $scope.PPMSSource = {
                    dataTextField: "name",
                    dataValueField: "id",
                    filter: "contains",
                    minLength: 1,
                    dataSource: {
                        serverFiltering: true,
                        transport: {
                            read: function (options) {
                                return SearchApi.SearchPPMS(options);
                            }
                        },
                        group: { field: "type" }
                    },
                    open: function (e) {
                        $timeout(function () {
                            e.sender.list.closest('.k-animation-container').find('.k-list-container').addClass('multiselect_panel');
                        });
                    },
                    select: function (e) {
                        $scope.dataChange.PPMS = e.dataItem;
                    }
                };

                $scope.PRASource = {
                    dataTextField: "name",
                    dataValueField: "id",
                    filter: "contains",
                    minLength: 1,
                    dataSource: {
                        serverFiltering: true,
                        transport: {
                            read: function (options) {
                                return SearchApi.SearchPRA(options);
                            }
                        },
                        group: { field: "type" }
                    },
                    open: function (e) {
                        $timeout(function () {
                            e.sender.list.closest('.k-animation-container').find('.k-list-container').addClass('multiselect_panel');
                        });
                    },
                    select: function (e) {
                        $scope.dataChange.PRA = e.dataItem;
                    }
                };

                $timeout(function () {
                    var ppInput = $scope.ProjectPhaseControl.element;
                    ppInput.on('click', function () {
                        var value = ppInput.val();
                        $scope.ProjectPhaseControl.search(value);
                    });

                    var ppmsInput = $scope.PPMSControl.element;
                    ppmsInput.on('click', function () {
                        var value = ppmsInput.val();
                        $scope.PPMSControl.search(value);
                    });

                    var praInput = $scope.PRAControl.element;
                    praInput.on('click', function () {
                        var value = praInput.val();
                        $scope.PRAControl.search(value);
                    });
                }, 1000);

                $scope.Delete = function (projectNameId) {
                    _.remove($scope.total, function (obj) {
                        return obj.ProjectName.id === projectNameId;
                    });
                    $scope.$emit("deletedProject", projectNameId);
                };

                $scope.Cancel = function () {
                    $scope.dataChange = angular.copy($scope.data);
                    $scope.ClosePanel();
                    
                };

                $scope.Apply = function () {
                    $scope.isShowProjectNameRequired = false;
                    var isValie = true;
                    if ($scope.dataChange.ProjectName.id == null || $scope.dataChange.ProjectName.id == -1 || $scope.dataChange.ProjectName.id == 0) {
                        $scope.isShowProjectNameRequired = true;
                        isValie = false;
                    }
                    if ($scope.dataChange.ProjectPhase.id == null || $scope.dataChange.ProjectPhase.id == -1 || $scope.dataChange.ProjectPhase.id == 0) {
                        $scope.isShowProjectPhaseRequired = true;
                        isValie = false;
                    }
                    if (!isValie) {
                        return;
                    };

                    $scope.data = angular.copy($scope.dataChange);
                    $scope.$emit("projectAdded", $scope.dataChange);
                    $scope.ClosePanel();

                    return false;
                };
            },
            templateUrl: 'app/main/directives/skill-addition-project.html',
            link: function ($scope, $element) {

                $scope.ClosePanel = function () {
                    $($element).find(".k-header").click();
                }
            }
        };
    }
})();
