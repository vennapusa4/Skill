/**
 * @author v.lugovksy
 * created on 16.12.2015
 */
(function () {
    'use strict';

    angular.module('app.home')
        .directive('skillAdditionEquipment', skillAdditionEquipment);

    /** @ngInject */
    function skillAdditionEquipment(SearchApi, $timeout) {

        return {
            restrict: 'AE',
            scope: {
                data: '=',
                disabled: '='
            },
          controller: function ($scope, TranslatorApi) {

              $scope.QuestionsEnglish = {};
              $scope.Questions = {};
              $scope.QuestionsEnglish.equipment = 'Equipment';
              $scope.QuestionsEnglish.equipmentName = 'Equipment Name';
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

                // Clone 'data'
                $timeout(function () {
                    $scope.dataChange = _.map(angular.copy($scope.data), function (o) {
                        return { id: o.id, name: o.name, type: 'Equipments' }
                    });
                });

                $scope.$watchCollection('data', function (newVal, oldVal) {
                    if (!_.isEmpty(newVal)) {
                        $scope.dataChange = _.map(angular.copy(newVal), function (o) {
                            return { id: o.id, name: o.name, type: 'Equipments' }
                        });
                    }
                });


                $scope.$watchCollection('dataChange', function (newVal, oldVal) {
                    if (newVal.length !== $scope.data.length) {
                    $scope.$emit('onDeleteEquipment', newVal);
                        
                    }
                });

                $scope.Equipmentsource = {
                    dataTextField: "name",
                    dataValueField: "id",
                    filter: "contains",
                    autoBind: false,
                    minLength: 1,
                    dataSource: {
                        serverFiltering: true,
                        transport: {
                            read: function (options) {
                                return SearchApi.SearchEquipment(options);
                            }
                        },
                        group: { field: "type" }
                    },
                    open: function (e) {
                        $timeout(function () {
                            e.sender.list.closest('.k-animation-container').find('.k-list-container').addClass('multiselect_panel');
                        });
                    }
                };

                $scope.joinEquipmentName = function () {

                    return _.map($scope.data, 'name').join(', ');
                };

                $scope.Delete = function () {

                    $scope.data = [];
                    $scope.dataChange = [];

                    //update
                    $scope.$emit('onDeleteEquipment', $scope.dataChange);

                };

                $scope.Cancel = function () {
                    $scope.dataChange = _.map(angular.copy($scope.data), function (o) {
                        return { id: o.id, name: o.name, type: 'Equipments' }
                    });
                    $scope.ClosePanel();
                };

                $scope.Apply = function () {
                    $scope.data = angular.copy($scope.dataChange);
                    $scope.ClosePanel();

                    return false;
                };
            },
            templateUrl: 'app/main/directives/skill-addition-equipment.html',
            link: function ($scope, $element) {

                $scope.ClosePanel = function () {
                    $($element).find(".k-header").click();
                }
            }
        };
    }
})();
