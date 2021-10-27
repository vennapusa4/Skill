(function () {
    'use strict';

    angular
        .module('app.myAccount')
        .controller('SubmissionsController', SubmissionsController);

    /** @ngInject */
    function SubmissionsController($scope, $state, KnowledgeDocumentApi) {
        var vm = this;
        vm.isDisabledDeleteButton = true;
        vm.kdDraft = [];
        vm.chkAll = false;
        vm.arrSortby = [
            { id: 'HighestEngagement', name: 'Highest Engagement' },
            { id: 'LatestContribution', name: 'Latest Contribution' },
            { id: 'LatestValidation', name: 'Latest Validation' },
            { id: 'HighestValueRealised', name: 'Highest Value Realised' },
            { id: 'HighestPotentialValue', name: 'Highest Potential Value' },
            { id: 'HighestReplication', name: 'Highest Replication' },
        ];
        vm.selectSortby = vm.arrSortby[0];
        vm.CountStatus = {
            countAll: 0,
            countDraft: 0,

            countSMEPending: 0,
            countValidated: 0,
            countSMEAmend: 0,
            countSMERejected: 0,

            countEndorserPending: 0,
            countEndorsed: 0,
            countEndorseAmend: 0,
            countEndorseRejected: 0,
        };
        function getCount(kw) {
            var postDataStatus = {
                status: '',
                keyword: kw,
                sortBy: 'HighestEngagement',
                skip: '',
                take: ''
            };
            KnowledgeDocumentApi.getCountOfMySubmissions(postDataStatus).then(function (data) {
                vm.CountStatus = data;
                _setStatusName();
            });
        };
        getCount('');

        vm.status = '';
        vm.endorserStatus = '';
        switch ($state.current.name) {
            case 'app.myAccountUser.submissions':
                vm.status = ''
                break;
            case 'app.myAccountUser.submissions.draft':
                vm.status = 'Draft'
                break;
            case 'app.myAccountUser.submissions.pendingValidation':
                vm.status = 'Submit'
                break;
            case 'app.myAccountUser.submissions.validated':
                vm.status = 'Approve'
                break;
            case 'app.myAccountUser.submissions.amend':
                vm.status = 'Amend'
                break;
            case 'app.myAccountUser.submissions.rejected':
                vm.status = 'Reject'
                break;
            case 'app.myAccountUser.submissions.pendingEndorserment':
                vm.endorserStatus = 'Submit'
                break;
            case 'app.myAccountUser.submissions.endorsed':
                vm.endorserStatus = 'Endorse'
                break;
            case 'app.myAccountUser.submissions.endorsermentAmend':
                vm.endorserStatus = 'Amend'
                break;
            case 'app.myAccountUser.submissions.endorsermenRejected':
                vm.endorserStatus = 'Reject'
                break;
            default:
                break;
        }


        vm.isShowButton = false;
        vm.isShowButtonDelete = false;
        vm.isShowButtonrevert = false;

        vm.RemoveFilter = function (status, type) {
            if (type) {
                vm.status = '';
                vm.endorserStatus = status;

            } else {
                vm.status = status;
                vm.endorserStatus = '';
            }

            _setStatusName(type);
            vm.ResetSearch();
        }

        vm.changeSortBy = function () {
            vm.pageIndex = 1;
            vm.Search();
        }

        // Submissions
        vm.keyword = '';
        vm.ResetSearch = function (status) {
            vm.pageIndex = 1;
            vm.Search();
        }

        vm.fromPos = 0;
        vm.toPos = 0;

        /* PAGING */
        vm.pageIndex = 1;
        vm.pageSize = 10;
        vm.maxSize = 5;
        vm.setPage = function (pageNo) {
            vm.currentPage = pageNo;
        };

        vm.pageChanged = function () {
            vm.Search();
        };

        $scope.storedData = [];
        vm.Search = function () {

            function getPostData() {
                return {
                    status: vm.status,
                    endorsermentStatus: vm.endorserStatus,
                    disciplineId: '',
                    createdMonth: '',
                    keyword: vm.keyword,
                    sortBy: vm.selectSortby.id,
                    skip: (vm.pageIndex - 1) * vm.pageSize,
                    take: vm.pageSize
                };
            }
            var postData = getPostData();
            KnowledgeDocumentApi.getMySubmissions(postData).then(function (data) {
                if ($state.current.name == 'app.myAccountUser.submissions.draft'
                    || $state.current.name == 'app.myAccountUser.submissions.pendingValidation'
                    || $state.current.name == 'app.myAccountUser.submissions.validated'
                ) {
                    vm.isShowButton = true;
                    _.each(data.data, function (x, xIndex) {
                        x.IsSelected = false;
                    })
                } else {
                    vm.isShowButton = false;
                }

                if ($state.current.name == 'app.myAccountUser.submissions.draft') {
                    vm.isShowButtonDelete = true;
                    vm.isShowButtonrevert = false;
                } else if ($state.current.name == 'app.myAccountUser.submissions.validated') {
                    vm.isShowButtonDelete = false;
                    vm.isShowButtonrevert = false;
                }
                else {
                    vm.isShowButtonDelete = false;
                    vm.isShowButtonrevert = true;
                }

                $scope.storedData = data;
                if (data.total > 0) {
                    vm.fromPos = postData.skip + 1;
                    vm.toPos = vm.fromPos + data.data.length - 1;
                }
                else {
                    vm.fromPos = 0;
                    vm.toPos = 0;
                }
            }, function (err) {
                vm.isShowButton = false;
                vm.isShowButtonDelete = false;
                vm.isShowButtonrevert = false;
            });

            getCount(vm.keyword);
        }
        vm.Search();


        vm.changeSortByInMobile = function (sortBy) {
            vm.selectSortby = sortBy;
            vm.changeSortBy();
        }

        function _setStatusName(type) {
            if (!type) {
                switch (vm.status) {
                    case 'Draft':
                        vm.status = 'Draft'
                        vm.statusDisplay = "Draft " + vm.CountStatus.countDraft;
                        break;
                    case 'Submit':
                        vm.statusDisplay = "Pending Validation " + vm.CountStatus.countSMEPending;
                        break;
                    case 'Approve':
                        vm.statusDisplay = "Validated " + vm.CountStatus.countValidated;
                        break;
                    case 'Amend':
                        vm.statusDisplay = "Request for Amend " + vm.CountStatus.countSMEAmend;
                        break;
                    case 'Reject':
                        vm.statusDisplay = "Rejected " + vm.CountStatus.countSMERejected;
                        break;
                    default:
                        vm.statusDisplay = "All " + vm.CountStatus.countAll;
                        break;
                }
            } else {
                switch (vm.status) {
                    case 'Submit':
                        vm.statusDisplay = "Pending Endorserment " + vm.CountStatus.countEndorserPending;
                        break;
                    case 'Approve':
                        vm.statusDisplay = "Endorsed " + vm.CountStatus.countEndorsed;
                        break;
                    case 'Amend':
                        vm.statusDisplay = "Request for Amend " + vm.CountStatus.countEndorseAmend;
                        break;
                    case 'Reject':
                        vm.statusDisplay = "Rejected " + vm.CountStatus.countEndorseRejected;
                        break;
                    default:
                        vm.statusDisplay = "";
                        break;
                }
            }
        }

        vm.dd_close = false;
        vm.RefineByClose = function () {
            vm.dd_close = !vm.dd_close;
            $('body').removeClass('menu-open');
        }

        $scope.$on("submissionSelectedChange", function (evt, data) {
            vm.isDisabledDeleteButton = true;

            var isExists = _.findIndex(vm.kdDraft, function (x, xIndex) {
                return x == data.kdId;
            });
            if (data.isSelected) {
                if (isExists == -1) {
                    vm.kdDraft.push(data.kdId);
                }
            } else {
                if (isExists != -1) {
                    vm.kdDraft.splice(isExists, 1);
                }
            }
            if (vm.kdDraft != null && vm.kdDraft.length > 0) {
                vm.isDisabledDeleteButton = false;
            }
        });
        vm.SelectAllChk = function () {
            vm.kdDraft = [];
            if (vm.chkAll) {
                _.each($scope.storedData.data,function (x, xIndex) {
                    vm.kdDraft.push(x.kdId);
                    x.isSelected = true;
                });
            } else {
                _.each($scope.storedData.data, function (x, xIndex) {
                    x.isSelected = false;
                });
            }
            if (vm.kdDraft != null && vm.kdDraft.length > 0) {
                vm.isDisabledDeleteButton = false;
            }
        }
        vm.deleteAll = function () {
            if (vm.isDisabledDeleteButton) {
                return;
            }
            var postData = {
                "kdIds": vm.kdDraft
            }
            KnowledgeDocumentApi.deleteAllDraftItem(postData).then(function (data) {
                logger.success("Delete successfully!");
                vm.Search();
                vm.kdDraft = [];
                vm.isDisabledDeleteButton = true;
            }, function (err) {
                console.log(err);
                logger.error("Delete failed!");
            });
        }
        vm.revertAll = function () {
            if (vm.isDisabledDeleteButton) {
                return;
            }
            var postData = {
                "kdIds": vm.kdDraft
            }
            KnowledgeDocumentApi.revertAllDraftItem(postData).then(function (data) {
                logger.success("Revert successfully!");
                vm.Search();
                vm.kdDraft = [];
                vm.isDisabledDeleteButton = true;
            }, function (err) {
                console.log(err);
                logger.error("Revert failed!");
            });
        }
    }
})();
