(function () {
    'use strict';

    angular
        .module('app.newTrending')
        .controller('ChallengesNewTrendingController', ChallengesNewTrendingController);

    /** @ngInject */
    function ChallengesNewTrendingController($scope,TrendingApi,LeaderboardApi) {

        var vm = this;
        $scope.onGoingChallengeData = [];
        $scope.onCompleteChallengeData = [];
        $scope.pageFilterOptions = ["Default", "My Department", "My Division", "My Discipline", "My CoP"];
        $scope.type = "Default";
        $scope.filterTab = "2020";
        $scope.tabSelected = "ongoing";
        $scope.challengeOngoingLoaded = false;
        $scope.nowShowing = 'ongoing';
        $scope.challengeCompleteLoaded = false;
        $scope.quarterSelected = 'Q1';
        function getOnGoingChallengeData(){
          $scope.challengeOngoingLoaded = false;
            var payload = {
                "skip":0,
                "take": 10,
              }
            TrendingApi.getCurrentChallenge(payload).then(function (response){
                if (response != null && response.data.length > 0) {
                    $scope.onGoingChallengeData = response.data;
                  }
                  $scope.challengeOngoingLoaded = true;
            }, function (error) {
                console.log(error);
                $scope.challengeOngoingLoaded = true;
              });
        }

        function getCompletedChallenge(){
          $scope.challengeCompleteLoaded = false;
            var payload ={
                "skip":0,
                "take": 10,
            }
            TrendingApi.getCompletedChallenge(payload).then(function (response) {
                if (response.data.length > 0) {
                    $scope.onCompleteChallengeData = response.data;
                }else{
                    $scope.onCompleteChallengeData = []
                }
                console.log($scope.onCompleteChallengeData);
                $scope.challengeCompleteLoaded = true;
            }, function (error) {
                $scope.onCompleteChallengeData = []
                logger.error(error);
                $scope.challengeCompleteLoaded = true;
            });
        }

        $scope.handleChangeTab = function(tab){
            $scope.nowShowing = tab;
            // switch(tab){
            //     case "ongoing": $scope.tabSelected = "completed";
            //     break;
            //     case "completed": 
            //     $scope.tabSelected = "ongoing";
            //     getCompletedChallenge();
            //     break;
            //     default:break;
            // }
        }
        
        $scope.formatDateTime = function(dt){
           return moment(dt).format("MMM DD,YYYY");
        }
        $scope.onChangeType = function(){
        }
        $scope.openTab = function(evt, tabname) {
            var i, tabcontent, tablinks;
            tabcontent = document.getElementsByClassName("tabcontent");
            for (i = 0; i < tabcontent.length; i++) {
              tabcontent[i].style.display = "none";
            }
            tablinks = document.getElementsByClassName("tablinks");
            for (i = 0; i < tablinks.length; i++) {
              tablinks[i].className = tablinks[i].className.replace(" active", "");
            }
            document.getElementById(tabname).style.display = "block";
            evt.currentTarget.className += " active";
            $scope.tabSelected = tabname;
          }
          $scope.yearChange = function(e){
            var datePicker = e.sender;
            var selectedDate = datePicker._value;
            var selectedYear  = selectedDate.getFullYear();
            $scope.filterTab = selectedYear;
          }
          $scope.quarterOnChange = function(quarter){
            $scope.quarterSelected = quarter
          }
          $scope.handleApplyDateFilter = function(){
            switch ($scope.tabSelected){
              case 'month':
                $scope.startDate = moment($scope.month).add(8, 'hours').utc().startOf('month').format("YYYY-MM-DDTHH:mm:ss.SSS[Z]");
                $scope.endDate   = moment($scope.month).add(8, 'hours').utc().endOf('month').format("YYYY-MM-DDTHH:mm:ss.SSS[Z]");
                break;
              case 'quarter':
                var temp = moment().format();
                if($scope.quarterSelected == 'Q1'){
                  temp = moment().quarter(1).format();
                }else if($scope.quarterSelected == 'Q2'){
                  temp = moment().quarter(2).format();
                }else if($scope.quarterSelected == 'Q3'){
                  temp = moment().quarter(3).format();
                }else{
                  temp = moment().quarter(4).format();
                }
                $scope.startDate = moment(temp).add(8, 'hours').utc().startOf('quarter').format("YYYY-MM-DDTHH:mm:ss.SSS[Z]");
                $scope.endDate   = moment(temp).endOf('quarter').format("YYYY-MM-DDTHH:mm:ss.SSS[Z]");
                break;
              case 'year':
                $scope.startDate = moment($scope.year).add(8, 'hours').utc().startOf('year').format("YYYY-MM-DDTHH:mm:ss.SSS[Z]");
                $scope.endDate   = moment($scope.year).add(8, 'hours').utc().endOf('year').format("YYYY-MM-DDTHH:mm:ss.SSS[Z]");
                break;
              case 'custom':
                $scope.startDate = moment($scope.fromDate).add(8, 'hours').utc().format("YYYY-MM-DDTHH:mm:ss.SSS[Z]");
                $scope.endDate   = moment($scope.toDate).add(8, 'hours').utc().format("YYYY-MM-DDTHH:mm:ss.SSS[Z]");
                break;
              default : break;
            }
            $scope.handleCloseDateFilter();
          }
          $scope.handleOpen = function(){
            $('#dropdownMenu2').dropdown('toggle')
          }
          $scope.handleCloseDateFilter = function(){
            //fetchApi();
            $(".dropdown.open").removeClass("open");
          }

        function _onInit(){
            getOnGoingChallengeData();
            getCompletedChallenge();
          }
    
          _onInit();
    }

})();