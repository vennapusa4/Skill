(function () {
    'use strict';

    angular
        .module('app.leaderboard')
        .controller('LeaderboardChallengesController', LeaderboardChallengesController);

    /** @ngInject */
    function LeaderboardChallengesController($rootScope, LeaderboardApi, UserProfileApi, logger, KnowledgeDiscoveryApi, $scope) {
        var vm = this;
        vm.ongoingChallenges = [];
        vm.completedChallenges = [];
        vm.take = 8;
        vm.showLoadMore = false;
        vm.ShareEmails = [];
        vm.challengeIdSelected = -1;
        vm.emailsSelected = [];
        vm.ShareToDepartment = false;
        vm.ShareToDivision = false;
        vm.ShareToEmail = false;
        vm.departmentName = "";
        vm.numberPepoleOfDepartment = "";
        vm.divisionName = "";
        vm.numberPepoleOfDivision = "";

        function _loadMore() {
            _getOngoingChallenges();
        }

        function _getOngoingChallenges() {
            var postObject = {
                skip: vm.ongoingChallenges.length,
                take: vm.take,
                sortField: null,
                sortDir: null,
                isExport: true,
                searchTerm: ''
            };
            LeaderboardApi.getOngoingChallenges(postObject).then(function (res) {
                if (res && res.data) {
                    _.each(res.data, function (o) {
                        vm.ongoingChallenges.push(o);
                    });

                    if (vm.ongoingChallenges.length < res.total) {
                        vm.showLoadMore = true;
                    } else {
                        vm.showLoadMore = false;
                    }

                    window.setTimeout(function () {
                        $('[data-toggle="popover"]').popover();
                        document.addEventListener('click', function (e) {
                            $('[data-toggle="popover"]').popover('hide')
                        }, true);

                        $('[data-toggle="popover"]').click(function (e) {
                            try {
                                var idSelected = $(this).attr('id');
                                $('#' + idSelected).popover('toggle');
                            } catch (e) {
                            }
                        });
                    }, 1000);
                }
            }, function (error) {
                logger.error(error);
            });
        }

        function _getCompletedChallenges() {
            LeaderboardApi.getCompletedChallenges().then(function (data) {
                if (data != null) {
                    vm.completedChallenges = data;
                }
            }, function (error) {
                logger.error(error);
            });
        }

        function _togglePinChallenge(challengeItem) {
            LeaderboardApi.setChallengeFavourite({ ChallengeId: challengeItem.id }).then(function (res) {
                if (res) {
                    _.each(vm.ongoingChallenges, function (o) {
                        if (o.id == challengeItem.id) {
                            o.isFavorite = !o.isFavorite;
                        }
                    });
                    $(window).scrollTop($('#top-challenge').offset().top - 100);
                    // document.getElementById("top-challenge").focus(); 
                }
            }, function (error) {
                logger.error(error);
            });
            if ($rootScope.userInfo && !$rootScope.userInfo.pinChallengeIds) {
                $rootScope.userInfo.pinChallengeIds = [];
            }
        }

        function _getChallengeShareInfors() {
            LeaderboardApi.getChallengeShareInfors().then(function (data) {
                if (data != null) {
                    vm.departmentName = data.departmentName;
                    vm.numberPepoleOfDepartment = data.numberPepoleOfDepartment;
                    vm.divisionName = data.divisionName;
                    vm.numberPepoleOfDivision = data.numberPepoleOfDivision;
                }
            }, function (error) {
                logger.error(error);
            });
        }

        function _getData() {
            _getOngoingChallenges();
            _getCompletedChallenges();
            _getChallengeShareInfors();
        }

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
                            vm.ShareEmails.push(
                                {
                                    value: e.dataItem.Id,
                                    label: e.dataItem.PersonName ? e.dataItem.PersonName : e.dataItem.Id
                                }
                            );
                            vm.emailsSelected.push(
                                {
                                    email: e.dataItem.Id,
                                    displayName: e.dataItem.PersonName,
                                    userName: e.dataItem.accountName
                                }
                            );
                        });
                    }
                },
            };
        }
        shareUsers();

        function _postShare() {
            if (vm.challengeIdSelected == -1) {
                return;
            }
            if (!vm.ShareToDepartment && !vm.ShareToDivision && !vm.ShareToEmail) {
                return;
            }
            if (vm.ShareToEmail && (vm.ShareEmails == null || vm.ShareEmails.length <= 0)) {
                return;
            }
            var shareRequest = {
                users: vm.ShareToEmail ? vm.emailsSelected : null,
                challengeId: vm.challengeIdSelected,
                isShareToDepartment: vm.ShareToDepartment,
                isShareToDivision: vm.ShareToDivision,
                isShareToEmail: vm.ShareToEmail
            };

            LeaderboardApi.shareChallenge(shareRequest,
                function (response) {
                    //logger.success("The challenge was shared successfully.");
                }, function (response) {
                    //logger.error("An errors occurred. Please contact admin.");
                }
            );
            _hideModalShare();
        };

        function _showModalShare(challengeId) {
            _resetModalShare();
            vm.challengeIdSelected = challengeId;
            $('#SubmitModal').modal('show', {
                backdrop: 'static',
                keyboard: false
            });
        }
        function _hideModalShare() {
            _resetModalShare();
            $('#SubmitModal').modal('hide');
        }
        function _resetModalShare() {
            vm.ShareEmails = [];
            vm.challengeIdSelected = -1;
            vm.emailsSelected = [];
            vm.ShareToDepartment = false;
            vm.ShareToCop = false;
            vm.ShareToEmail = false;
        }

        vm.showModalShare = _showModalShare;
        vm.hideModalShare = _hideModalShare;
        vm.loadMore = _loadMore;
        vm.getOngoingChallenges = _getOngoingChallenges;
        vm.getCompletedChallenges = _getCompletedChallenges;
        vm.togglePinChallenge = _togglePinChallenge;
        vm.getData = _getData;
        vm.postShare = _postShare;
        vm.getData();
    }
})();
