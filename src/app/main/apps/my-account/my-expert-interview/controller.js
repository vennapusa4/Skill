(function () {
    'use strict';

    angular
        .module('app.myAccount')
        .controller('MyExpertInterviewController', MyExpertProfileController);

    /** @ngInject */
    function MyExpertProfileController($scope, $rootScope, logger, appConfig, $location,
        $anchorScroll, $stateParams, ExpertInterviewApi, KnowledgeDiscoveryApi, UserProfileApi) {
        var vm = this;

        var userId = $stateParams.id;
        if (userId == null || userId == 0) {
            userId = $rootScope.userInfo.userId;
        }

        vm.userInfo = UserProfileApi.getUserInfo();
        vm.expertInterviewId = null;
        vm.config = appConfig;
        vm.expertInterview = null;
        vm.trendSeries = ['TotalCount'];
        vm.trendLabels = [];
        vm.trendData = [];
        vm.showTrendGraph = false;
        vm.trendOptions = {
            tooltips: {
                enabled: false
            },
            scales:
            {
                xAxes: [{
                    display: false
                }],
                yAxes: [{
                    display: false
                }]
            }
        };

        function activate() {
            getExpertInterviewDetail();
            shareUsers();
        }

        function getExpertInterviewDetail() {
            ExpertInterviewApi.getByUserId(userId).then(function (response) {
                vm.expertInterview = response;
                vm.expertInterviewId = response.expertInterviewId;
                vm.expertInterview.hasVideo = response.videos.length > 0;
                if (vm.expertInterview.keywordList != null) {
                    vm.expertInterview.keywords = _.join(vm.expertInterview.keywordList, ', ');
                }

                //if (vm.expertInterview.status === vm.config.Statuses.Submit || vm.expertInterview.status === vm.config.Statuses.Approve) {
                    postView();
                //}
                getTrendDetails();
            }, function (response) {
                if (response.status !== 404)
                    logger.error('User don\'t have Expert Interview record!');
                // logger.error(response.data.errorMessage);
            });
        };

        function postLike(isLiked) {
            vm.expertInterview.isLiked = isLiked;
            vm.expertInterview.totalLikesCount = isLiked ? ++vm.expertInterview.totalLikesCount : --vm.expertInterview.totalLikesCount;
            var likeRequest = { expertInterviewId: vm.expertInterviewId, taggingTypeName: 'Like', taggingTypeValue: vm.expertInterview.isLiked };
            ExpertInterviewApi.api.postTagging.save({}, likeRequest,
                function (response) {
                    $rootScope.$broadcast('UpdateInterest');
                }, function (response) {
                    logger.error(response.data.errorMessage);
                });
        };

        function postSave(isSavedToLibrary) {
            vm.expertInterview.isSavedToLibrary = isSavedToLibrary;
            vm.expertInterview.totalSaveLibraryCount = isSavedToLibrary ? ++vm.expertInterview.totalSaveLibraryCount : --vm.expertInterview.totalSaveLibraryCount;
            var saveRequest = { expertInterviewId: vm.expertInterviewId, taggingTypeName: 'Save', taggingTypeValue: vm.expertInterview.isSavedToLibrary };
            ExpertInterviewApi.api.postTagging.save({}, saveRequest,
                function (response) {
                    $rootScope.$broadcast('UpdateInterest');
                }, function (response) {
                    logger.error(response.data.errorMessage);
                });
        };

        function postShare(isShared) {
            vm.expertInterview.isShared = isShared;
            // ToDo: QUANGNV8 issue on old code of KnowledgeDiscovery
            ExpertInterviewApi.postShare(vm.expertInterviewId, vm.expertInterview.isShared).then(
                function (response) {
                    vm.expertInterview.totalShareCount = vm.expertInterview.totalShareCount + vm.ShareEmails.length;
                    $rootScope.$broadcast('UpdateInterest');
                }, function (response) {
                    logger.error(response.data.errorMessage);
                });

            if (vm.ShareEmails && vm.ShareEmails.length > 0) {
                var postData = {
                    title: vm.expertInterview.title,
                    expertInterviewId: vm.expertInterviewId,
                    lstMailShare: vm.ShareEmails
                };
                ExpertInterviewApi.shareToEmail(postData).then(function (response) {
                    if (response && response.success) {
                        vm.ShareEmails = [];
                    }
                    $rootScope.$broadcast('UpdateInterest');
                }, function (response) {
                    logger.error(response.data.errorMessage);
                });
            }
        };

        function postView() {
            var viewRequest = { expertInterviewId: vm.expertInterviewId, taggingTypeName: 'View', taggingTypeValue: true };
            ExpertInterviewApi.api.postTagging.save({}, viewRequest,
                function (response) {
                    vm.expertInterview.totalViewsCount += 1;
                }, function (response) {
                    logger.error(response.data.errorMessage);
                });
        };

        function getTrendDetails() {
            var trendRequest = { expertInterviewId: vm.expertInterviewId };
            ExpertInterviewApi.api.trend.query({}, trendRequest,
                function (response) {
                    var data = [];
                    // vm.showTrendGraph = true;
                    for (var i = 0; i < response.length; i++) {
                        if (response[i].totalCount > 0)
                            vm.showTrendGraph = true;
                        vm.trendLabels.push(response[i].weekDay);
                        data.push(response[i].totalCount);
                    }
                    vm.trendData.push(data);
                }, function (response) {
                    if (response.status !== 404)
                        logger.error(response.data.errorMessage);
                });
        }

        function updateStatus(statusName) {
            var statusUpdateRequest = { expertInterviewId: vm.expertInterviewId, statusName: statusName, commentText: vm.reviewCommentText };
            ExpertInterviewApi.api.updateStatus.save({}, statusUpdateRequest,
                function (response) {
                    $scope.$broadcast('UpdateStatus', null);
                    getExpertInterviewDetail();
                    logger.success('Status updated successfully.');
                    switch (statusName) {
                        case 'Approve':
                            $("#ModalApprove").modal('hide');
                            break;
                        case 'Reject':
                            $("#ModalReject").modal('hide');
                            break;
                        case 'Amend':
                            $("#ModalAmend").modal('hide');
                            break;
                        default:
                            break;
                    }
                    vm.reviewCommentText = '';
                }, function (response) {
                    logger.error(response.data.errorMessage);
                });
        };

        function updateEndorseStatus(statusName) {
            var statusUpdateRequest = { expertInterviewId: vm.expertInterviewId, statusName: statusName, commentText: vm.reviewCommentText };
            ExpertInterviewApi.api.updateEndorseStatus.save({}, statusUpdateRequest,
                function (response) {
                    $scope.$broadcast('UpdateStatus', null);
                    getExpertInterviewDetail();
                    logger.success('Status updated successfully.');
                    switch (statusName) {
                        case 'Endorse':
                            $("#ModalApproveEndorse").modal('hide');
                            break;
                        case 'Reject':
                            $("#ModalRejectEndorse").modal('hide');
                            break;
                        case 'Amend':
                            $("#ModalAmendEndorse").modal('hide');
                            break;
                        default:
                            break;
                    }
                    vm.reviewCommentText = '';
                }, function (response) {
                    logger.error(response.data.errorMessage);
                });
        };

        $rootScope.$on('updateExpertInterviewTotalLikeCount', function (evt, data) {
            vm.expertInterview.isLiked = data;
        });

        $rootScope.$on('updateExpertInterviewTotalBookmarkCount', function (evt, data) {
            vm.expertInterview.isSavedToLibrary = data;
        });

        function gotoCommentsSection() {
            $anchorScroll.yOffset = 40;
            var newHash = 'Comment';
            if ($location.hash() !== newHash) {
                $anchorScroll(newHash);
            } else {
                $anchorScroll();
            }
        };

        function shareUsers() {
            vm.EmailSources = {
                placeholder: "Select user...",
                dataTextField: "PersonName",
                dataValueField: "Id",
                minLength: 1,
                delay: 500,
                valuePrimitive: true,
                dataSource: new kendo.data.DataSource({
                    serverFiltering: true,
                    transport: {
                        read: function (options) {
                            return KnowledgeDiscoveryApi.getEmails(options)
                        }
                    }
                }), open: function (e) {
                    setTimeout(function () {
                        e.sender.list.closest('.k-animation-container').find('.k-list-container').addClass('multiselect_panel no_grouping');
                    }, 100);
                },
                template: '<strong>#: data.PersonName #</strong><br/><small>#: data.PersonDept #</small>',
                select: function (e) {
                    var index = _.findIndex(vm.ShareEmails, function (item) { return item.value == e.dataItem.Id });
                    if (index == -1) {
                        $scope.$apply(function () {
                            vm.ShareEmails.push({ value: e.dataItem.Id, label: e.dataItem.PersonName ? e.dataItem.PersonName : e.dataItem.Id });
                        });
                    }
                },
            };
        }

        function calculateTotalComment(total) {
            vm.expertInterview.totalCommentsCount = total;
        }

        vm.postLike = postLike;
        vm.postSave = postSave;
        vm.postShare = postShare;
        vm.updateStatus = updateStatus;
        vm.updateEndorseStatus = updateEndorseStatus;
        vm.gotoCommentsSection = gotoCommentsSection;
        vm.calculateTotalComment = calculateTotalComment;
        vm.ShareEmails = [];

        activate();
    }
})();
