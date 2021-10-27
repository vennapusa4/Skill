/**
 * @author v.lugovksy 
 * created on 16.12.2015
 */
(function () {
    'use strict';

    angular.module('app.knowledgeDiscovery')
        .directive('addAuthor', addAuthor);

    /** @ngInject */
  function addAuthor(SearchApi, TranslatorApi, $timeout) {
        return {
            restrict: 'AE',
            scope: {
                save: '='
            },
            controller: function ($scope) {
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
                                return SearchApi.searchUser(options, $scope.Authors);
                            }
                        },
                    },
                    open: function (e) {
                        $timeout(function () {
                            e.sender.list.closest('.k-animation-container').find('.k-list-container').addClass('multiselect_panel no_grouping');
                        });
                    },
                };

                $scope.Authors = [];
                $scope.QuestionsEnglish = {};
                $scope.Questions = {};
                $scope.QuestionsEnglish.addAuthorSearch = 'Add new author<br><small>Search for name of author</small>';
                $scope.QuestionsEnglish.addAuthorIcon = 'Add new author <i class="icon-new"></i>';
                $scope.Questions = $scope.QuestionsEnglish;

                $scope.$on('Init', function (event, data) {
                    if (data && data.hasOwnProperty('Get')) {
                        $scope.Authors = data.Get(_.snakeCase(data.Type) + '.authors') || [];
                        $scope.Authors = _.filter($scope.Authors, function (o) { return o.name !== data.Get('SubmissionBy').userName });
                        if (data.Get('isAuthor')) {
                            $scope.Authors.unshift({
                                name: data.Get('SubmissionBy').userName,
                                displayName: data.Get('SubmissionBy').displayName,
                                isSubmission: true
                            });
                        }
                    }
                });

                $scope.$on('Get', function (event, data) {
                    $scope.Authors = _.filter(data.Get('authors'), function (o) { return o.name !== data.Get('submittedByUser.userName') });
                    if (data.Get('isAuthor')) {
                        $scope.Authors.unshift({
                            name: data.Get('submittedByUser.userName'),
                            displayName: data.Get('submittedByUser.displayName'),
                            isSubmission: true
                        });
                    }
                });

                $scope.$on('Change', function (event, data) {
                    data.Set(_.snakeCase(data.Type) + '.authors', $scope.Authors);
                });

                $scope.$on('Submit', function (event, data) {
                    if ($scope.save) {
                        data.Set('authors', _.map($scope.Authors, function (o) { return o.name }));
                    }
                });

                $scope.$on('AlsoAuthor', function (event, data) {
                    var index = _.findIndex($scope.Authors, function (obj) { return obj.name == data.submissionBy.userName });
                    if (data.status && index === -1) {
                        $scope.Authors.unshift({
                            name: data.submissionBy.userName,
                            displayName: data.submissionBy.displayName,
                            isSubmission: true
                        });
                    } else if (!data.status && index === 0) {
                        $scope.Authors.splice(0, 1);
                    }
                });

                $scope.$on('Validate', function (event) {
                    _Validate();
                });

                $scope.$watch('Authors', function (next, prev) {
                    _Validate();
                }, true);

                $scope.$on('changeInputLanguage', function(event, data) {
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

                function _onOpen(e) {
                    $timeout(function () {
                        e.sender.list.closest('.k-animation-container').find('.k-list-container').addClass('multiselect_panel no_grouping');
                    });
                };

                function _onSelect(e) {
                    var index = _.findIndex($scope.Authors, function (obj) { return obj.name == e.dataItem.name });
                    if (index == -1) {
                        $scope.Authors.push(e.dataItem);
                    }
                    $timeout(function () {
                        $scope.Author = "";
                    });
                };

                function _Remove(idx) {
                    $scope.Authors.splice(idx, 1);
                };

                function _Validate() {
                    $scope.$emit('ValidateStatus', { status: $scope.Authors.length > 0 });
                };

                $scope.onOpen = _onOpen;
                $scope.onSelect = _onSelect;
                $scope.Remove = _Remove;
            },
            templateUrl: 'app/main/apps/knowledge-discovery/_directives/add-author.html',
            link: function (scope) {
                scope.newauthor = false;
                scope.$emit('Completed', null);
            }
        };
    }
})();
