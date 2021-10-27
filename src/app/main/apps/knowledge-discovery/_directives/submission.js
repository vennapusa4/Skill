/**
 * @author v.lugovksy
 * created on 16.12.2015
 */
(function () {
    'use strict';

    angular.module('app.knowledgeDiscovery')
        .directive('submission', submission);

    /** @ngInject */
    function submission(KnowledgeService, Utils, SearchApi, UserProfileApi, appConfig) {
        return {
            restrict: 'AE',
            scope: {
                showAa: '=',
                show : '='
            },
            controller: function ($scope, $timeout) {

                $scope.SubmissionBy = {};

              $scope.Questions = {};
              $scope.Questions.submittedBy = $scope.$parent.Questions.submittedBy;
              $scope.Questions.changeSubmitter = $scope.$parent.Questions.changeSubmitter;
              $scope.Questions.searchSubmitter = $scope.$parent.Questions.searchSubmitter;
              $scope.Questions.iamauthor = $scope.$parent.Questions.iamauthor;
              $scope.Questions.author = $scope.$parent.Questions.author;
              $scope.Questions.selectcop = $scope.$parent.Questions.selectcop;
              $scope.Questions.selectcoptitle = $scope.$parent.Questions.selectcoptitle;

              $scope.$on('changeQuestionsLanguage', function (event, data) {
                $scope.Questions.submittedBy = $scope.$parent.Questions.submittedBy;
                $scope.Questions.changeSubmitter = $scope.$parent.Questions.changeSubmitter;
                $scope.Questions.searchSubmitter = $scope.$parent.Questions.searchSubmitter;
                $scope.Questions.iamauthor = $scope.$parent.Questions.iamauthor;
                $scope.Questions.author = $scope.$parent.Questions.author;
                $scope.Questions.selectcop = $scope.$parent.Questions.selectcop;
                $scope.Questions.selectcoptitle = $scope.$parent.Questions.selectcoptitle;
              });

                $scope.CopOptions = [];

                // For Change Submitter function
                $scope.isShowChangeSubmitterLink = false;
                $scope.isShowChangeSubmitterBox = false;
                $scope.Submitter = null;

                var offInit = $scope.$on('Init', function (event, data) {
                    var currentUser = UserProfileApi.getUserInfo();
                    if (currentUser && currentUser.roles != null) {
                        if (currentUser.roles.indexOf(appConfig.KMRole) != -1) {
                            $scope.isShowChangeSubmitterLink = true;
                        }
                    }
                    if (!data) {
                        $scope.SubmissionBy = KnowledgeService.getBuild('submittedByUser');
                        $scope.CopOptions = _.map(KnowledgeService.getBuild('cops'), function (o) { return { Text: o.copName, Id: o.id } });
                        $scope.Avatar = Utils.getImage('avatar', $scope.SubmissionBy.id);
                        offInit();
                    }
                });

                var offGet = $scope.$on('Get', function (event, data) {
                    $scope.SubmissionBy = data.Get('submittedByUser');
                    $scope.Avatar = Utils.getImage('avatar', $scope.SubmissionBy.id);
                    $scope.IsAuthor = data.Get('isAuthor');
                    $scope.Cop = { Id: data.Get('copId') };
                    offGet();
                });

                $scope.$on('Change', function (event, data) {
                    data.Set('isAuthor', $scope.IsAuthor);
                    data.Set('SubmissionBy', $scope.SubmissionBy);
                });

                $scope.$on('Submit', function (event, data) {
                    data.Set('isAuthor', $scope.IsAuthor);
                    data.Set('createdUserId', $scope.SubmissionBy.id);
                    if (!_.isEmpty($scope.Cop)) data.Set('copId', $scope.Cop.Id);
                });

                function _AlsoAuthor() {
                    if ($scope.showAa) {
                        $scope.$broadcast('AlsoAuthor', { status: $scope.IsAuthor, submissionBy: $scope.SubmissionBy });
                    } else {
                        $scope.$parent.$broadcast('AlsoAuthor', { status: $scope.IsAuthor, submissionBy: $scope.SubmissionBy });
                    }
                }

                $scope.AlsoAuthor = _AlsoAuthor;


                // For Change Submitter function
                $scope.changeSubmitterClick = function () {
                    $scope.Submitter = null;
                    $scope.isShowChangeSubmitterBox = true;
                }

                $scope.cancelSubmitter = function () {
                    $scope.Submitter = null;
                    $scope.isShowChangeSubmitterBox = false;
                }

                $scope.applySubmitter = function () {
                    $scope.SubmissionBy = {
                        id: $scope.Submitter.id,
                        userName: $scope.Submitter.name,
                        displayName: $scope.Submitter.displayName,
                        disciplineName: $scope.Submitter.disciplineName,
                        subDisciplineName: $scope.Submitter.subDisciplineName,
                        department: $scope.Submitter.department,
                    };
                    $scope.Avatar = Utils.getImage('avatar', $scope.SubmissionBy.id);
                    $scope.cancelSubmitter();
                }

                $scope.SubmitterSource = {
                    dataTextField: "displayName",
                    dataValueField: "name",
                    filter: "contains",
                    minLength: 1,
                    delay: 500,
                    dataSource: {
                        serverFiltering: true,
                        transport: {
                            read: function (options) {
                                return SearchApi.searchUserForPointAdmin(options, null);
                            }
                        },
                    },
                    open: function (e) {
                        $timeout(function () {
                            e.sender.list.closest('.k-animation-container').find('.k-list-container').addClass('multiselect_panel no_grouping');
                        });
                    },
                };

                $scope.onOpenSubmitter = function (e) {
                    $timeout(function () {
                        e.sender.list.closest('.k-animation-container').find('.k-list-container').addClass('multiselect_panel no_grouping');
                    });
                };

                $scope.onSelectSubmitter = function (e) {
                    $scope.Submitter = e.dataItem;
                    console.log($scope.Submitter);
                };
            },
            templateUrl: 'app/main/apps/knowledge-discovery/_directives/submission.html',
        };
    }
})();
