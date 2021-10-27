(function () {
    'use strict';

    angular
        .module('app.ranking')
        .controller('RankingAdminController', RankingAdminController);

    /** @ngInject */
    function RankingAdminController(RankingApi, toastr) {
        var vm = this;

        vm.AllRank = [];
        vm.tempData = [];
        vm.AllData = [];

        vm.GetStar = function () {
            RankingApi.getAll().then(function (data) {
                vm.AllData = angular.copy(data);
                vm.tempData = angular.copy(data);
            });
        };

        vm.GetStar();

        vm.ShowHideRankSection = function (rankId) {
            if (vm.AllRank.indexOf(rankId) < 0) {
                vm.AllRank.push(rankId);
            } else {
                vm.AllRank.splice(vm.AllRank.indexOf(rankId), 1);
            }
        }

        vm.isSelectedRule = function (ruleType, ruleId) {
            if (ruleType == ruleId) {
                return true;
            }
            return false;
        }

        vm.AddRule = function (rank) {
            var newData = {
                "ruleTypeId": vm.tempData.ruleTypes[0].id,
                "ruleType": "",
                "comparisonTypeId": vm.tempData.comparisonTypes[0].id,
                "comparisonType": "",
                "value": 0,
                "createdDate": "0001-01-01T00:00:00.000"
            };
            rank.rules.push(newData);
        }

        vm.RemoveRule = function (rank, rule) {
            var currentRank = vm.tempData.ranks.indexOf(rank);
            var currentRule = vm.tempData.ranks[currentRank].rules.indexOf(rule);
            vm.tempData.ranks[currentRank].rules.splice(currentRule, 1);
        }

        vm.rankTempId = 0;
        vm.AddRank = function () {
            if (vm.tempData.ranks.length <= 0) {
                vm.rankTempId++;
                var newRank1 = [{
                    "id": vm.rankTempId,
                    "rankName": "",
                    "star": 1,
                    "createdDate": "0001-01-01T00:00:00.000",
                    "rules": []
                }];
                vm.tempData.ranks = angular.copy(newRank1);
            } else {
                var newRank2 = {
                    "id": vm.rankTempId,
                    "rankName": "",
                    "star": 1,
                    "createdDate": "0001-01-01T00:00:00.000",
                    "rules": []
                };
                vm.tempData.ranks.push(newRank2);
            }
        }

        vm.ReloadCurrentRank = function (currentRank) {
            if (currentRank.createdDate == "0001-01-01T00:00:00.000") {
                currentRank.rules = [];
                currentRank.rankName = "";
                currentRank.star = 1;
            } else {
                currentRank.rules = angular.copy(vm.AllData.ranks[vm.tempData.ranks.indexOf(currentRank)].rules);
                currentRank.rankName = angular.copy(vm.AllData.ranks[vm.tempData.ranks.indexOf(currentRank)].rankName);
                currentRank.star = angular.copy(vm.AllData.ranks[vm.tempData.ranks.indexOf(currentRank)].star);
            }
        }

        vm.SaveCurrentRank = function (currentRank) {
            if (!vm.validateOnSave(currentRank))
                return;
            var index = vm.tempData.ranks.indexOf(currentRank);
            var saveData = {};
            saveData.rankid = currentRank.createdDate == "0001-01-01T00:00:00.000" ? "" : currentRank.id;
            saveData.rankName = currentRank.rankName;
            saveData.star = currentRank.star;
            saveData.rules = [];
            for (var i = 0; i < currentRank.rules.length; i++) {
                var rule = {
                    "rankid": currentRank.createdDate == "0001-01-01T00:00:00.000" ? "" : currentRank.id,
                    "ruleid": currentRank.rules[i].createdDate == "0001-01-01T00:00:00.000" ? "" : currentRank.rules[i].id,
                    "ruleTypeId": currentRank.rules[i].ruleTypeId,
                    "comparisonTypeId": currentRank.rules[i].comparisonTypeId,
                    "value": currentRank.rules[i].value
                };
                saveData.rules.push(rule);
            }
            RankingApi.saveRank(saveData).then(function (data) {
                toastr.success('Save rank success!');
                vm.AllData.ranks[index] = angular.copy(vm.tempData.ranks[index]);
            });

        }

        vm.DeleteRank = function (currentRank) {
            if (confirm("Are you sure?")) {
                RankingApi.deleteItem(currentRank.id).then(function (data) {
                    toastr.success('Delete rank success!');
                    vm.tempData.ranks.splice(vm.tempData.ranks.indexOf(currentRank), 1);
                });
            }
        }

        vm.isNumber = function (currentRule) {
            if (currentRule.value.toString() == "") return true;
            if (!angular.isNumber(currentRule.value.toString())) return true;
            return false;
        };

        vm.validateOnSave = function (currentRank) {
            if (currentRank.rankName == '') {
                alert("Rank name can not be null");
                return false;
            }
            if (currentRank.rules.length <= 0) {
                alert("There is no rule in this rank");
                return false;
            }
            for (var i = 0; i < currentRank.rules.length; i++) {
                if (currentRank.rules[i].value.toString() == "") {
                    alert("The value of Rule can not be null");
                    return false;
                }
                if (parseInt(currentRank.rules[i].value.toString(), 10).toString() == "NaN") {
                    alert("The value of Rule allow number only");
                    return false;
                }
            }
            return true;
        }

        vm.validateValue = function (currentValue) {
            var int = parseInt(currentValue);
            if (currentValue == '' || !angular.isNumber(int))
                return true;
            return false;
        }

        //vm.filterValue = function ($event) {
        //    //if ($event.keycode != 8) {
        //    //    $event.preventDefault();
        //    //}
        //    console.log($event.charCode);
        //    if ($event.charCode < 48 && $event.charCode > 57) {
        //        if ($event.keycode == 0) {
        //            $event.preventDefault();
        //        }
        //    }
        //}
    }
})();