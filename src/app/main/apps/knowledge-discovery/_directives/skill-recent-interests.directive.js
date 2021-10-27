/**
 * @author v.lugovksy
 * created on 16.12.2015
 */
(function () {
    'use strict';

    angular.module('app.knowledgeDiscovery')
        .directive('skillRecentInterests', skillRecentInterests);

    /** @ngInject */
    function skillRecentInterests() {
        return {
            restrict: 'AE',
            scope: {
                kdId: '<',
                expertInterviewId: '<'
            },
          controller: function ($rootScope, $scope, logger, KnowledgeDocumentApi, ExpertInterviewApi, TranslatorApi) {
              $scope.recentInterests = [];
              $scope.sorted = {
                  like: [],
                  share: [],
                  save: [],
                  replicate: [],
                  comment: []
              };
              $scope.nowShow = [];
              $scope.currentView = '';
              $scope.recentInterestsOriginal = [];
              $scope.Questions = {};
              $scope.Questions.recentInterests = $scope.$parent.Questions.recentInterests;
              $scope.Questions.loadmore = $scope.$parent.Questions.loadmore;

              $scope.$on('changeQuestionsLanguage', function (event, data) {
                $scope.Questions.recentInterests = $scope.$parent.Questions.recentInterests;
                $scope.Questions.loadmore = $scope.$parent.Questions.loadmore;
              });

              $scope.showActivity = function (data) {
                  $scope.nowShow = $scope.sorted[data];
                  $scope.currentView = data;
              }

              //$scope.$on('changeDataLanguage', function (event, data) {
              //  $scope.selectedLanguage = $scope.$parent.selectedLanguage;
              //  $scope.originalLanguageCode = $scope.$parent.originalLanguageCode;
              //  if ($scope.selectedLanguage == $scope.originalLanguageCode) {
              //    $scope.recentInterests = angular.copy($scope.recentInterestsOriginal);
              //  }
              //  else {
              //    $scope.recentInterests = angular.copy($scope.recentInterestsOriginal);
              //    angular.forEach($scope.recentInterests, function (value, key) {
              //      if (value.activityMessage != undefined && value.activityMessage != null && value.activityMessage != "") {
              //        TranslatorApi.api.TranslateSingleText.save({}, {
              //          textToTranslate: value.activityMessage,
              //          fromLanguage: $scope.originalLanguageCode,
              //          toLanguage: $scope.selectedLanguage
              //        },
              //          function (response) {
              //            value.activityMessage = response.translatedText;
              //          },
              //          function (response) {
              //            if (response.status !== 404)
              //              logger.error(response.data.errorMessage);
              //          });
              //      }
              //    });
              //  }
              //});

                function _getDuration(date) {
                    var startDate = new moment();
                    var endDate = moment(date, 'YYYY-MM-DD HH:mm:ss');
                    return moment.duration(endDate.diff(startDate)).humanize();
                };

                function _getRecentInterests(loadMore) {
                    var recentInterestsRequest = {
                        skip: (loadMore ? $scope.recentInterests.length : 0)
                    };

                    if ($scope.kdId) {
                        recentInterestsRequest.knowledgeDocumentId = $scope.kdId;

                        KnowledgeDocumentApi.api.recentInterests.query({}, recentInterestsRequest,
                            function (response) {
                                if (loadMore) {
                                    $scope.recentInterests = $scope.recentInterests.concat(response.recentInterests);
                                    $scope.totalRecordsCount = response.totalRecordsCount;
                                    response.recentInterests.forEach(function(el){
                                        if(el.activityName == 'Like') {
                                            $scope.sorted.like.push(el);
                                        } else if(el.activityName == 'Share') {
                                            $scope.sorted.share.push(el);
                                        } else if(el.activityName == 'Save') {
                                            $scope.sorted.save.push(el);
                                        } else if(el.activityName == 'Just Replicate') {
                                            $scope.sorted.replicate.push(el);
                                        } else if(el.activityName == 'Pin Comment') {
                                            $scope.sorted.comment.push(el);
                                        }
                                    });
                                }
                                else {
                                    $scope.sorted.like = [];
                                    $scope.recentInterests = response.recentInterests;
                                    $scope.totalRecordsCount = response.totalRecordsCount;
                                    debugger
                                    $scope.recentInterests.forEach(function(el){
                                        if(el.activityName == 'Like') {
                                            $scope.sorted.like.push(el);
                                        } else if(el.activityName == 'Share') {
                                            $scope.sorted.share.push(el);
                                        } else if(el.activityName == 'Save') {
                                            $scope.sorted.save.push(el);
                                        } else if(el.activityName == 'Just Replicate') {
                                            $scope.sorted.replicate.push(el);
                                        } else if(el.activityName == 'Pin Comment') {
                                            $scope.sorted.comment.push(el);
                                        }
                                    });
                                    $scope.showActivity('like');
                                }

                                $scope.recentInterestsOriginal = angular.copy($scope.recentInterests);
                                $scope.showLoadMoreButton = response.totalRecordsCount > $scope.recentInterests.length;
                                console.log($scope.sorted);
                            }, function (response) {
                                if (response.status !== 404)
                                    logger.error(response.data.errorMessage);
                            });
                    } else {
                        recentInterestsRequest.expertInterviewId = $scope.expertInterviewId;

                        ExpertInterviewApi.api.recentInterests.query({}, recentInterestsRequest,
                            function (response) {
                                if (loadMore) {
                                    $scope.recentInterests = $scope.recentInterests.concat(response.recentInterests);
                                }
                                else {
                                    $scope.recentInterests = response.recentInterests;
                                }
                                $scope.recentInterestsOriginal = angular.copy($scope.recentInterests);
                                $scope.showLoadMoreButton = response.totalRecordsCount > $scope.recentInterests.length;
                            }, function (response) {
                                if (response.status !== 404)
                                    logger.error(response.data.errorMessage);
                            });
                    }
                };

                $scope.getRecentInterests = _getRecentInterests;
                $scope.getDuration = _getDuration;
                $scope.getRecentInterests();
                $scope.showActivity('like');

                $rootScope.$on('UpdateInterest', function (event, data) {
                    _getRecentInterests();
                });
            },
            templateUrl: 'app/main/apps/knowledge-discovery/_directives/skill-recent-interests.html',
        };
    }
})();
