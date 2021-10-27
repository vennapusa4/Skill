(function () {
    'use strict';

    angular
        .module('app.home')
        .controller('HomeController', HomeController);

    /** @ngInject */
    function HomeController($rootScope, KnowledgeDocumentApi, UserProfileApi) {
        var vm = this;

        /** Properties */
        if (!_.isEmpty($rootScope.userInfo)) {
            if ($rootScope.userInfo.nickName == null || $rootScope.userInfo.nickName == '' ||
                $rootScope.userInfo.nickName == "null") {
                vm.WelcomeTitle = "Welcome back!";
            }
            else {
                vm.WelcomeTitle = "Welcome back, " + $rootScope.userInfo.nickName + "!";
            }
            if ($rootScope.userInfo.lastLoginDate == null || $rootScope.userInfo.lastLoginDate == '' ||
                $rootScope.userInfo.lastLoginDate == 'null') {

                vm.LastLoginInfo = 'This is the first time you login.';
            }
            else {

                (function getBeforeTimeLogin(lastLoginDate) {
                    var dtNow = moment();
                    var dtbefore = moment(lastLoginDate);

                    var duration = moment.duration(dtNow.diff(dtbefore));

                    var timeLoginAgo = null;
                    if (duration._data.years > 0) {
                        timeLoginAgo = duration._data.years + (duration._data.years != 1 ? " years" : " year");
                    } else if (duration._data.months > 0) {
                        timeLoginAgo = duration._data.months + (duration._data.months != 1 ? " months" : " month");
                    } else if (duration._data.days > 0) {
                        timeLoginAgo = duration._data.days + (duration._data.days != 1 ? " days" : " day");
                    } else if (duration._data.hours > 0) {
                        timeLoginAgo = duration._data.hours + (duration._data.hours != 1 ? " hours" : " hour");
                    } else if (duration._data.minutes > 0) {
                        timeLoginAgo = duration._data.minutes + (duration._data.minutes != 1 ? " minutes" : " minute");
                    } else if (duration._data.minutes.seconds > 0) {
                        timeLoginAgo = duration._data.seconds + (duration._data.seconds != 1 ? " seconds" : " second");
                    }

                    if (timeLoginAgo == null) {
                        vm.LastLoginInfo = 'This is the first time you login.';
                    }
                    else {
                        vm.LastLoginInfo = 'Your last login was ' + timeLoginAgo + ' ago.';
                    }

                })($rootScope.userInfo.lastLoginDate);
            }
        }


        vm.NewDocumentsSummary = {};
        KnowledgeDocumentApi.getNewDocumentsSummary().then(function (data) {
            vm.NewDocumentsSummary = data;
        });

        vm.KnowledgeDocumentSummary = {};
        KnowledgeDocumentApi.getSummary().then(function (data) {
            vm.KnowledgeDocumentSummary = data;
        });

        vm.FeaturedDocuments = [];
        KnowledgeDocumentApi.getFeaturedDocuments().then(function (data) {
            vm.FeaturedDocuments = data;
        });

        vm.KnowledgeDocumentLatest = [];
        KnowledgeDocumentApi.getLatest().then(function (data) {
            vm.KnowledgeDocumentLatest = data;
        });

        vm.UserRank = {};
        UserProfileApi.getRank().then(function (data) {
            vm.UserRank = data;
        });

        vm.SearchPopular = [];
        KnowledgeDocumentApi.searchPopular().then(function (data) {
            vm.SearchPopular = data;
        });

        vm.loading = false;
        vm.InterestFeeds = [];
        vm.InterestFeedsSkip = 0;
        vm.numberGetInterestFeedsFirst = 7;
        vm.InterestFeedsIsLast = true;

        vm.GetAllInterst = function () {
            vm.loading = true;
            UserProfileApi.getInterestFeeds(0, vm.numberGetInterestFeedsFirst).then(function (data) {
                vm.InterestFeedsIsLast = (!data || data.length == 0);
                vm.InterestFeeds = data;
                vm.loading = false;
            });
        }

        vm.InterestFeedsLoad = function () {
            vm.loading = true;
            vm.InterestFeedsSkip = vm.InterestFeeds.length;
            UserProfileApi.getInterestFeeds(vm.InterestFeedsSkip, 8).then(function (data) {
                vm.loading = false;
                vm.InterestFeedsIsLast = (!data || data.length == 0);
                _.each(data, function (item) {
                    vm.InterestFeeds.push(item);
                });
                vm.InterestFeedsSkip = vm.InterestFeeds.length;
            });
        };

        vm.InterestFeedsCollection = null;
        UserProfileApi.getInterestFeedsCollection(0, 7).then(function (data) {
            vm.InterestFeedsCollection = data.data;
            vm.numberGetInterestFeedsFirst = data.data ? 7 : 8;
            vm.GetAllInterst();
        });


        vm.HotTrending = [];
        KnowledgeDocumentApi.getTrending(1, 0, 0, 0).then(function (data) {
            vm.HotTrending = data;
        });

    }
})();
