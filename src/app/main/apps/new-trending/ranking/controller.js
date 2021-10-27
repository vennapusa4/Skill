(function () {
    'use strict';

    angular
        .module('app.newTrending')
        .controller('RankingNewTrendingController', RankingNewTrendingController);

    /** @ngInject */
    function RankingNewTrendingController($scope, $timeout, LeaderboardApi) {

        var vm = this;
        $scope.filterTab = "All";
        $scope.quarterSelected = 'Q1';
        $scope.fromDate = new Date(1, 1, 1900),
        $scope.toDate = new Date();
        $scope.departmentType = "true";
        $scope.divisionType = "true";
        $scope.yearChange = function(e){
            var datePicker = e.sender;
            var selectedDate = datePicker._value;
            var selectedYear  = selectedDate.getFullYear();
            $scope.filterTab = selectedYear;
          }
        $scope.selectedCoP = 0;
        $scope.tabSelected = 'custom';
        $scope.rankingDivisionData = null;
        $scope.rankingDepartmentData = null;
        $scope.rankingCopData = null;
        $scope.copList = [];
        $scope.rankingDivisionDataLoaded = false;
        $scope.rankingDepartmentDataLoaded = false;
        $scope.rankingCopDataLoaded = false;

        function rankingDivisionData(){
            $scope.rankingDivisionDataLoaded = false;
            $scope.rankingDivisionData = null;
            var payload = {
              IsIndividual: $scope.divisionType,
              length: 0,
              skip: 0,
              start: 0,
              take: 20,
              fromDate: $scope.fromDate,
              toDate: $scope.toDate,
              type: "MyDivision"
            }
            LeaderboardApi.getCommunityScoreRanking("MyDepartment",payload).then(function (data) {
              if (data != null && data.hasOwnProperty("rankingListResponse") && data.rankingListResponse.length > 0) {
                $scope.rankingDivisionData = data;
                $scope.rankingDivisionDataLoaded = true;
                console.log($scope.rankingDivisionData);
              }
            }, function (error) {
              console.log(error);
              $scope.rankingDivisionDataLoaded = true;
            });
        }
        function rankingDepartmentData(){
            $scope.rankingDepartmentDataLoaded = false;
            $scope.rankingDepartmentData = null;
            var payload = {
              IsIndividual: $scope.departmentType,
              length: 0,
              skip: 0,
              start: 0,
              take: 20,
              fromDate: $scope.fromDate,
              toDate: $scope.toDate,
              type: "MyDepartment"
            }
            LeaderboardApi.getCommunityScoreRanking("MyDepartment",payload).then(function (data) {
              if (data != null && data.hasOwnProperty("rankingListResponse") && data.rankingListResponse.length > 0) {
                $scope.rankingDepartmentData = data;
                $scope.rankingDepartmentDataLoaded = true;
                console.log($scope.rankingDepartmentData);
              }
            }, function (error) {
              console.log(error);
              $scope.rankingDepartmentDataLoaded = true;
            });
        }

        function rankingCopData(){
            $scope.rankingCopDataLoaded = false;
            $scope.rankingCopData = null;
            var payload = {
              length: "",
              skip: 0,
              start: "",
              take: 20,
              fromDate: $scope.fromDate,
              toDate: $scope.toDate,
              coPId: $scope.selectedCoP
            }
            LeaderboardApi.getCommunityScoreRankingByCop("MyDepartment",payload).then(function (data) {
              if (data != null) {
                $scope.rankingCopData = data;
                $scope.rankingCopDataLoaded = true;
                console.log($scope.rankingCopData);
              }
            }, function (error) {
              console.log(error);
              $scope.rankingCopDataLoaded = true;
            });
        }

        $scope.loadMoreData = function(type){

          $('#' + type).removeClass('isLoaded');

          if(type == 'department'){
            //$scope.rankingDepartmentDataLoaded = false;
           // $scope.rankingDepartmentData = null;

           console.log( $scope.rankingDepartmentData.rankingListResponse.length);
            var payload = {
              IsIndividual: $scope.departmentType,
              length: 0,
              skip: $scope.rankingDepartmentData.rankingListResponse.length,
              start: 0,
              take: 20,
              fromDate: $scope.fromDate,
              toDate: $scope.toDate,
              type: "MyDepartment"
            }
            LeaderboardApi.getCommunityScoreRanking("MyDepartment",payload).then(function (data) {
              debugger;
              if (data != null && data.hasOwnProperty("rankingListResponse") && data.rankingListResponse.length > 0) {
                for(i = 0 ; i < data.rankingListResponse.length ;i++){
                  $scope.rankingDepartmentData.rankingListResponse.push(data.rankingListResponse[i]);
                }
              }
              $('#' + type).addClass('isLoaded');
            }, function (error) {
              console.log(error);
              $scope.rankingDepartmentDataLoaded = true;
              $('#' + type).addClass('isLoaded');
            });
          }
          else if(type == 'division'){
           // $scope.rankingDivisionDataLoaded = false;
           //debugger;
            //$scope.rankingDivisionData = null;
            var payload = {
              IsIndividual: $scope.divisionType,
              length: 0,
              skip: $scope.rankingDivisionData.rankingListResponse.length,
              start: 0,
              take: 20,
              fromDate: $scope.fromDate,
              toDate: $scope.toDate,
              type: "MyDivision"
            }
            LeaderboardApi.getCommunityScoreRanking("MyDepartment",payload).then(function (data) {
              if (data != null && data.hasOwnProperty("rankingListResponse") && data.rankingListResponse.length > 0) {
                for(i = 0 ; i < data.rankingListResponse.length ;i++){
                  $scope.rankingDivisionData.rankingListResponse.push(data.rankingListResponse[i]);
                }
                //$scope.rankingDivisionDataLoaded = true;
                //console.log($scope.rankingDivisionData);
              }
              $('#' + type).addClass('isLoaded');
            }, function (error) {
              console.log(error);
              $('#' + type).addClass('isLoaded');
              //$scope.rankingDivisionDataLoaded = true;
            });
          }
          else if(type == 'cop'){
            //$scope.rankingCopDataLoaded = false;
            //$scope.rankingCopData = null;
            var payload = {
              length: "",
              skip: $scope.rankingCopData.rankingListResponse.length, 
              start: "",
              take: 20,
              fromDate: $scope.fromDate,
              toDate: $scope.toDate,
              coPId: $scope.selectedCoP
            }
            LeaderboardApi.getCommunityScoreRankingByCop("MyDepartment",payload).then(function (data) {
              debugger;
              if (data != null && data.hasOwnProperty("rankingListResponse") && data.rankingListResponse.length > 0) {
                
                for(i = 0 ; i < data.rankingListResponse.length ;i++){
                  $scope.rankingCopData.rankingListResponse.push(data.rankingListResponse[i]);
                }
              }
              $('#' + type).addClass('isLoaded');
            }, function (error) {
              console.log(error);
              $scope.rankingCopDataLoaded = true;
              $('#' + type).addClass('isLoaded');
            });
          }

        }
        $scope.quarterOnChange = function(quarter){
            $scope.quarterSelected = quarter
          }

        $scope.changeDepartmentType = function(e) {
            rankingDepartmentData();
        }
        $scope.changeDivisionType = function(e) {
            rankingDivisionData();
        }
        $scope.onChangeCopData = function(e) {
            rankingCopData();
        }

        function listCopData(){

             LeaderboardApi.getSubscribedCoP().then(function (data) {
            //LeaderboardApi.getAllCop().then(function (data) {
              if (data != null) {
                $scope.listCopData = data;
                if($scope.listCopData.length > 0) {
                    $scope.selectedCoP = data[0].id;
                    refreshAllData();
                    $timeout(function(){
                        $("#copOption").val($scope.selectedCoP);
                        $("#copOption").find('option').get(0).remove();
                    }, 1000)
                    
                    // $('select#copOption').find('option:contains("' + $scope.selectedCoP + '")').attr("selected",true);

                } else {
                    rankingDivisionData();
                    rankingDepartmentData();
                }
              }
            }, function (error) {
              console.log(error);
            });
        }
        $scope.selectAllTime = function () {
          $scope.fromDate = new Date(1, 1, 1900),
          $scope.toDate = new Date();
          $scope.filterTab = 'All';
          refreshAllData();
          $scope.handleCloseDateFilter();
        }
        $scope.handleOpen = function(){
            $('#dropdownMenu2').dropdown('toggle')
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
          $scope.handleCloseDateFilter = function(){
            //fetchApi();
            $(".dropdown.open").removeClass("open");
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
                $scope.fromDate = moment(temp).add(8, 'hours').utc().startOf('quarter').format("YYYY-MM-DDTHH:mm:ss.SSS[Z]");
                $scope.toDate   = moment(temp).endOf('quarter').format("YYYY-MM-DDTHH:mm:ss.SSS[Z]");
                break;
              case 'year':
                $scope.fromDate = moment($scope.year).add(8, 'hours').utc().startOf('year').format("YYYY-MM-DDTHH:mm:ss.SSS[Z]");
                $scope.toDate   = moment($scope.year).add(8, 'hours').utc().endOf('year').format("YYYY-MM-DDTHH:mm:ss.SSS[Z]");
                break;
              case 'custom':
                $scope.fromDate = moment($scope.fromDate).add(8, 'hours').utc().format("YYYY-MM-DDTHH:mm:ss.SSS[Z]");
                $scope.toDate   = moment($scope.toDate).add(8, 'hours').utc().format("YYYY-MM-DDTHH:mm:ss.SSS[Z]");
                break;
              default : break;
            }
            refreshAllData();
            $scope.handleCloseDateFilter();
          }
        $scope.formatTime = function (str) {
            try {
                var mlist = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
                var date = new Date(str);
                var seconds = Math.floor((new Date() - date) / 1000);

                var interval = Math.floor(seconds / 31536000);

                if (interval > 1) {
                    return date.getDate() + " " + mlist[date.getMonth()] + " " + date.getFullYear();
                }
                interval = Math.floor(seconds / 2592000);
                if (interval > 1) {
                    return date.getDate() + " " + mlist[date.getMonth()] + " " + date.getFullYear();
                }
                interval = Math.floor(seconds / 86400);
                if (interval > 1) {
                    return interval + " days ago";
                }
                interval = Math.floor(seconds / 3600);
                if (interval > 1) {
                    return interval + " hours ago";
                }
                interval = Math.floor(seconds / 60);
                if (interval > 1) {
                    return interval + " minutes ago";
                }
                return Math.floor(seconds) + " seconds ago";
            } catch (e) {
                return str;
            }
          }
        $scope.handleExportDeparment = function() {

          //for export minimum should be 50.
          $scope.dataToExport = []
          if($scope.rankingDepartmentData.rankingListResponse.length < 50){
            var payload = {
              IsIndividual: $scope.departmentType,
              length: 0,
              skip: 0,
              start: 0,
              take: 50,
              fromDate: $scope.fromDate,
              toDate: $scope.toDate,
              type: "MyDepartment"
            }
            LeaderboardApi.getCommunityScoreRanking("MyDepartment",payload).then(function (data) {
              debugger;
              if (data != null && data.hasOwnProperty("rankingListResponse") && data.rankingListResponse.length > 0) {
                for(i = 0 ; i < data.rankingListResponse.length ;i++){
                  $scope.rankingDepartmentData.rankingListResponse.push(data.rankingListResponse[i]);
                  
                }

                $scope.rankingDepartmentData.rankingListResponse.forEach(function(v){
                  $scope.dataToExport.push(
                    {
                      "RANK": v.rank, 
                      "USER":v.userName,
                      "POINT": v.totalPoint
                    }
                  )
                })
                if($scope.dataToExport.length > 0){
                  var myStyle = {
                  headers: true,
                  columns: [
                    {title: "RANK", width: 300},
                    {title: "USER", width: 300},
                    {title: "POINT", width: 300},
                  ]
                }
                alasql('SELECT * INTO XLSX("Ranking - Department",?) FROM ?',[myStyle, $scope.dataToExport.sort()]);
              }

              }
            }, function (error) {
              console.log(error);
              $scope.rankingDepartmentDataLoaded = true;
            });
          }
          else{
            $scope.rankingDepartmentData.rankingListResponse.forEach(function(v){
              $scope.dataToExport.push(
                {
                  "RANK": v.rank, 
                  "USER":v.userName,
                  "POINT": v.totalPoint
                }
              )
            })
            if($scope.dataToExport.length > 0){
              var myStyle = {
              headers: true,
              columns: [
                {title: "RANK", width: 300},
                {title: "USER", width: 300},
                {title: "POINT", width: 300},
              ]
            }
            alasql('SELECT * INTO XLSX("Ranking - Department",?) FROM ?',[myStyle, $scope.dataToExport.sort()]);
          }
          }

        }
        $scope.handleExportDivision = function() {

          $scope.dataToExport = []
          if($scope.rankingDivisionData.rankingListResponse.length < 50 ){
            var payload = {
              IsIndividual: $scope.divisionType,
              length: 0,
              skip: 0,
              start: 0,
              take: 50,
              fromDate: $scope.fromDate,
              toDate: $scope.toDate,
              type: "MyDivision"
            }
            LeaderboardApi.getCommunityScoreRanking("MyDepartment",payload).then(function (data) {
              if (data != null && data.hasOwnProperty("rankingListResponse") && data.rankingListResponse.length > 0) {
                for(i = 0 ; i < data.rankingListResponse.length ;i++){
                  $scope.rankingDivisionData.rankingListResponse.push(data.rankingListResponse[i]);
                }

                $scope.rankingDivisionData.rankingListResponse.forEach(function(v){
                  $scope.dataToExport.push(
                    {
                      "RANK": v.rank, 
                      "USER":v.userName,
                      "POINT": v.totalPoint
                    }
                  )
                })
                if($scope.dataToExport.length > 0){
                  var myStyle = {
                  headers: true,
                  columns: [
                    {title: "RANK", width: 300},
                    {title: "USER", width: 300},
                    {title: "POINT", width: 300},
                  ]
                }
                alasql('SELECT * INTO XLSX("Ranking - Division",?) FROM ?',[myStyle, $scope.dataToExport.sort()]);
              }

                //$scope.rankingDivisionDataLoaded = true;
                //console.log($scope.rankingDivisionData);
              }
            }, function (error) {
              console.log(error);
              //$scope.rankingDivisionDataLoaded = true;
            });
          }
          else{
            $scope.rankingDivisionData.rankingListResponse.forEach(function(v){
              $scope.dataToExport.push(
                {
                  "RANK": v.rank, 
                  "USER":v.userName,
                  "POINT": v.totalPoint
                }
              )
            })
            if($scope.dataToExport.length > 0){
              var myStyle = {
              headers: true,
              columns: [
                {title: "RANK", width: 300},
                {title: "USER", width: 300},
                {title: "POINT", width: 300},
              ]
            }
            alasql('SELECT * INTO XLSX("Ranking - Division",?) FROM ?',[myStyle, $scope.dataToExport.sort()]);
          }
          }
          
        }
        $scope.handleExportCop = function() {

          $scope.dataToExport = []
          if($scope.rankingCopData.rankingListResponse.length < 50){
            var payload = {
              length: "",
              skip: 0, 
              start: "",
              take: 50,
              fromDate: $scope.fromDate,
              toDate: $scope.toDate,
              coPId: $scope.selectedCoP
            }
            LeaderboardApi.getCommunityScoreRankingByCop("MyDepartment",payload).then(function (data) {
              debugger;
              if (data != null && data.hasOwnProperty("rankingListResponse") && data.rankingListResponse.length > 0) {
                
                for(i = 0 ; i < data.rankingListResponse.length ;i++){
                  $scope.rankingCopData.rankingListResponse.push(data.rankingListResponse[i]);
                }

                $scope.rankingCopData.rankingListResponse.forEach(function(v){
                  $scope.dataToExport.push(
                    {
                      "RANK": v.rank, 
                      "USER":v.userName,
                      "POINT": v.totalPoint
                    }
                  )
                })
                if($scope.dataToExport.length > 0){
                  var myStyle = {
                  headers: true,
                  columns: [
                    {title: "RANK", width: 300},
                    {title: "USER", width: 300},
                    {title: "POINT", width: 300},
                  ]
                }
                alasql('SELECT * INTO XLSX("Ranking - CoP - ' + v.copName + '",?) FROM ?',[myStyle, $scope.dataToExport.sort()]);
              }
              }
            }, function (error) {
              console.log(error);
              $scope.rankingCopDataLoaded = true;
            });

          var cop = $scope.listCopData.find(function(x){
            return x.id == $scope.selectedCoP;
          })
          }
          else{
            $scope.rankingCopData.rankingListResponse.forEach(function(v){
              $scope.dataToExport.push(
                {
                  "RANK": v.rank, 
                  "USER":v.userName,
                  "POINT": v.totalPoint
                }
              )
            })
            if($scope.dataToExport.length > 0){
              var myStyle = {
              headers: true,
              columns: [
                {title: "RANK", width: 300},
                {title: "USER", width: 300},
                {title: "POINT", width: 300},
              ]
            }
            alasql('SELECT * INTO XLSX("Ranking - CoP - ' + v.copName + '",?) FROM ?',[myStyle, $scope.dataToExport.sort()]);
          }
          }
          
         
          
        }

        
        function refreshAllData(){
            rankingDivisionData();
            rankingDepartmentData();
            rankingCopData();
        }

        function _onInit(){
            listCopData();
          }

          _onInit();
    }

})();