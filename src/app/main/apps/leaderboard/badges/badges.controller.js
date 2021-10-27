(function () {
    'use strict';

    angular
        .module('app.leaderboard')
        .controller('LeaderboardBadgesController', LeaderboardBadgesController);

    /** @ngInject */
    function LeaderboardBadgesController(LeaderboardApi, appConfig) {
        var vm = this;
        vm.data = [];
        vm.dataCommunity = [];
        vm.arrClassBadge = appConfig.arrClassBadge;
        vm.arrClassCommunity = appConfig.arrClassCommunity;

        // Load data
        function getData() {
            LeaderboardApi.getBadges().then(function (data) {
                if (data != null) {
                    //data = [
                    //    {
                    //        "badgeId": 2,
                    //        "levelName": "Master of Lessons 11",
                    //        "badgeImageUrl": "assets/images/badges/book.png",
                    //        "description": "Submitted 10 Lesson Learnt knowledge."
                    //    },
                    //    {
                    //        "badgeId": 3,
                    //        "levelName": "Master of Lessons 10",
                    //        "badgeImageUrl": "assets/images/badges/book.png",
                    //        "description": "Submitted 10 Lesson Learnt knowledge."
                    //    },
                    //    {
                    //        "badgeId": 4,
                    //        "levelName": "Master of Lessons 9",
                    //        "badgeImageUrl": "assets/images/badges/thumbsup.png",
                    //        "description": "Submitted 10 Lesson Learnt knowledge."
                    //    },
                    //    {
                    //        "badgeId": 5,
                    //        "levelName": "Master of Lessons 8",
                    //        "badgeImageUrl": "assets/images/badges/broadcast.png",
                    //        "description": "Submitted 10 Lesson Learnt knowledge."
                    //    },
                    //    {
                    //        "badgeId": 6,
                    //        "levelName": "Master of Lessons 7",
                    //        "badgeImageUrl": "assets/images/badges/diamond.png",
                    //        "description": "Submitted 10 Lesson Learnt knowledge."
                    //    },
                    //    {
                    //        "badgeId": 7,
                    //        "levelName": "Master of Lessons 6",
                    //        "badgeImageUrl": "assets/images/badges/diamond.png",
                    //        "description": "Submitted 10 Lesson Learnt knowledge."
                    //    },
                    //    {
                    //        "badgeId": 8,
                    //        "levelName": "Master of Lessons 5",
                    //        "badgeImageUrl": "assets/images/badges/mobile.png",
                    //        "description": "Submitted 10 Lesson Learnt knowledge."
                    //    },
                    //    {
                    //        "badgeId": 9,
                    //        "levelName": "Master of Lessons 4",
                    //        "badgeImageUrl": "assets/images/badges/mobile.png",
                    //        "description": "Submitted 10 Lesson Learnt knowledge."
                    //    }, {
                    //        "badgeId": 2,
                    //        "levelName": "Master of Lessons 3",
                    //        "badgeImageUrl": "assets/images/badges/book.png",
                    //        "description": "Submitted 10 Lesson Learnt knowledge."
                    //    },
                    //    {
                    //        "badgeId": 3,
                    //        "levelName": "Master of Lessons 2",
                    //        "badgeImageUrl": "assets/images/badges/book.png",
                    //        "description": "Submitted 10 Lesson Learnt knowledge."
                    //    },
                    //    {
                    //        "badgeId": 4,
                    //        "levelName": "Master of Lessons 1",
                    //        "badgeImageUrl": "assets/images/badges/thumbsup.png",
                    //        "description": "Submitted 10 Lesson Learnt knowledge."
                    //    },
                    //];
                    vm.data = data;
                }
            }, function (error) {
                console.log(error);
                });

            LeaderboardApi.getBadgesCommunity().then(function (data) {
                if (data != null) {
                    vm.dataCommunity = data;
                }
            }, function (error) {
                console.log(error);
            });
        }
        getData();

        vm.setBadgeClassName = function(index){
            if (index < vm.arrClassBadge.length) {
                return vm.arrClassBadge[index];
            } else {
                var tempIndex = index - vm.arrClassBadge.length;
                return vm.arrClassBadge[tempIndex];
            }
        }
        vm.setCommunityClassName = function(index){
            if (index < vm.arrClassCommunity.length) {
                return vm.arrClassCommunity[index];
            } else {
                var tempIndex = index - vm.arrClassCommunity.length;
                return vm.arrClassCommunity[tempIndex];
            }
        }
    }
})();
