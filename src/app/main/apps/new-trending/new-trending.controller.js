(function () {
    'use strict';

    angular
        .module('app.newTrending')
        .controller('NewTrendingController', NewTrendingController);

    /** @ngInject */
    function NewTrendingController($scope, InsightsApi, $mdSidenav, $timeout, $filter, $rootScope, api, $state, msNavigationService, dialog, SearchApi, appConfig, InsightsCommonService, UserProfileApi, TrendingApi, LeaderboardApi) {

        var vm = this;
        $scope.isAll = false;
        $scope.doughNutColor = ['#00A19C', '#FECE66'];
        $scope.knowledgeContributionLabels = ["Total", "My Contribute"];
        $scope.knowledgeContributionData = [];
        $scope.valueRealisedData = [0,0];
        $scope.knowledgeReplicationData = [];
        $scope.doughNutColor2 = ['#00A19C'];
        $scope.knowledgeContributionLabels2 = ["Data 1", "Data 2", "Data 3", "Data 4","Data 5", "Data 6", "Data 7", "Data 8"];
        $scope.knowledgeContributionData2 = [1, 2, 1.5, 3];
        $scope.trendingTopic = [];
        $scope.knowledgeTypeOptions = ["All Knowledge", "Lesson Learnt", "Best Practice", "Technical Alert", "Publication"];
        // $scope.rankingFilterOptions = ["MyDivision", "MyDepartment", "Overall"];
        $scope.rankingFilterOptions = [{ value:"Overall", display: "Individual"}];
        $scope.rankingFilterSelected = "Overall";
        $scope.knowledgeTypeKnowledge = "All Knowledge";
        $scope.knowledgeTypeContributor = "All Knowledge";
        $scope.knowledgeTypeEngagedUser = "All Knowledge";
        $scope.knowledgeTypeValueRealised = "All Knowledge";
        $scope.filterTab = "All";
        $scope.quarterSelected = 'Q1';
        $scope.fromDate = new Date(1900, 0, 1),
        $scope.toDate = new Date();
        $scope.tabSelected = 'custom'

        vm.trendOptions = {
            elements: {
                point:{
                    radius: 0
                },
                line: {
                    tension: 0
                }
            },
            tooltips: {
              enabled: false
            },
            scales: {
              xAxes: [{
                display: false
              }],
              yAxes: [{
                display: false,
                ticks: {
                    beginAtZero: true
                }
              }]
            }
          };
          vm.noTooltip = {
            tooltips: {
              enabled: false
            }
          };
        $scope.startDate = new Date(1, 1, 1900);
        $scope.endDate = new Date();
        $scope.type = "Default";

        $scope.pageFilterOptions = ["Default", "My Department", "My Division", "My Discipline", "My CoP"];

        $scope.topTrendingKnowledge = [];
        $scope.topTrendingCollection = [];
        $scope.topTrendingContributors = [];
        $scope.topTrendingEngagedUsers = [];
        $scope.topTrendingValueRealised = [];
        $scope.topTrendingReplicatedKnowledge = [];
        $scope.trendingSearching = function(data) {
          var url = $state.href('app.SearchPage.knowledge', { docType: 'All' });
          localStorage.setItem('trendTopicName', data.topic);
          localStorage.setItem('trendTopicID', data.totalSubmissions);
          window.open(url,'_blank');
        }
        $scope.topTrendingTopic = [];
        $scope.allTrendingTopic = [];
        $scope.topTrendingSearchKeyword = [];
        $scope.allTrendingTopicSearchKeyword = [];
        $scope.currentChallenge = [];
        $scope.rankingData = [];
        $scope.userRanking = null;
        $scope.topTrendingKnowledgeLoaded = false;
        $scope.topTrendingCollectionLoaded = false;
        $scope.topTrendingContributorsLoaded = false;
        $scope.topTrendingEngagedUsersLoaded = false;
        $scope.topTrendingValueRealisedLoaded = false;
        $scope.topTrendingReplicatedKnowledgeLoaded = false;
        $scope.topTrendingTopicLoaded = false;
        $scope.topTrendingSearchKeywordLoaded = false
        $scope.currentChallengeLoaded = false;
        $scope.topDataLoaded = false;
        $scope.rankingFilterCop = 0;
        $scope.listCopData = [];
        $scope.rankingFilterDivision = 'true';
        $scope.rankingDataLoaded = false;
        $scope.yearChange = function(e){
          var datePicker = e.sender;
          var selectedDate = datePicker._value;
          var selectedYear  = selectedDate.getFullYear();
          $scope.filterTab = selectedYear;
        }
        $scope.pageIndex = 1;
        $scope.pageSize = 10;
        $scope.maxSize = 10;
        $scope.found;

        $scope.setPage = function (pageNo) {
            $scope.pageIndex = pageNo;
        };
        $scope.pageChanged = function (page) {
          
          if (page <= 0) return;
          $scope.pageIndex = page;
          $scope.hasDataLoaded = false;
          $scope.articleLoad = false;
          getAllTrendingTopic();
      }

      $scope.pageKeywordIndex = 1;
      $scope.pageKeywordSize = 10;
      $scope.maxKeywordSize = 10;
      $scope.keywordFound;
      
      $scope.trendingSearchKeywordSetPage = function (pageNo) {
          $scope.pageKeywordIndex = pageNo;
      };

      $scope.trendingSearchKeywordPageChanged = function (page) {    
        if (page <= 0) return;
        $scope.pageKeywordIndex = page;
        getAllTrendingSearchKeywords();
    }

        $scope.handleOpen = function(){
          $('#dropdownMenu2').dropdown('toggle')
        }

        $scope.rankingFilterOptionOnchange = function(){
          fetchRankingData();
        }
        $scope.selectAllTime = function () {
          $scope.fromDate = new Date(1, 1, 1900),
          $scope.toDate = new Date();
          $scope.startDate = new Date(1, 1, 1900),
          $scope.endDate = new Date();
          $scope.filterTab = 'All';
          fetchApi();
          $scope.handleCloseDateFilter();
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
          fetchApi();
          $scope.handleCloseDateFilter();
        }

        $scope.quarterOnChange = function(quarter){
          $scope.quarterSelected = quarter
        }

        $scope.handleCloseDateFilter = function(){
          //fetchApi();
          $(".dropdown.open").removeClass("open");
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

        function LoadTrendingTopic() {
          var input = {
            fromDate: "01/01/2018",
            toDate: "01/01/2021",
            segmentItems: [{
              id: 0,
              name: "All",
              percentage: "100.00%",
              segmentTypeL1: "All",
              segmentTypeL2: null,
              segmentTypeL2Name: null,
              text: "All",
              value: 14959
            }],
            isViewMore: false
          };
          InsightsApi.getTrendingTopics(input).then(function (data) {
            if (data != null) {
                var result = _.chain(data).groupBy("type").map(function (v, i) {
                    return {
                        kdType: i,
                        items: v
                    }
                }).value();
                $scope.trendingTopic = result[0];
            }
        }, function (error) {
            console.log(error);
        });
      }

      // LoadTrendingTopic();

      function fetchDataForChart(){
        $scope.topDataLoaded = false;
        var payload = {
          "fromDate": $scope.startDate,
          "toDate": $scope.endDate,
          "type": $scope.type,
          "isAuthorOnly": !$scope.isAll
        }
        TrendingApi.getKnowledgeContribution(payload).then(function (data) {
          $scope.knowledgeContributionData = [data.total, data.myContributed];
          TrendingApi.getValueCreateions(payload).then(function (data) {
            $scope.valueRealisedData = [data.total, data.myContributed];
            TrendingApi.getKnowledgeReplicated(payload).then(function (data) {
              $scope.knowledgeReplicationData = [data.total, data.myContributed];
              $scope.topDataLoaded = true;
            }, function (error) {
                console.log(error);
                $scope.topDataLoaded = true;
            });
          }, function (error) {
              console.log(error);
          });
        }, function (error) {
            console.log(error);
        });
      }

      function fetchMyLevel(){
        LeaderboardApi.getMyLevel().then(function (data) {
          if (data != null) {
            $scope.level = data;
          }
        }, function (error) {
          console.log(error);
        });
      } 

      $scope.totalTrendingKnowldege;

      $scope.fetchTrendingKnowledge = function(isExport){
        $scope.topTrendingKnowledgeLoaded = false;
        var payload = {
          "fromDate": $scope.startDate,
          "toDate": $scope.endDate,
          "type": $scope.type,
          "take": 10,
          "knowledgeType": $scope.knowledgeTypeKnowledge
        }
        TrendingApi.getTopTrendingKnowledge(payload).then(function (response) {
          if (response != null ) {
            if(!isExport){
              var formattedData = response.data;
              $scope.totalTrendingKnowldege = response.total;
              response.data.forEach(function(v,i){
                v.chartData = [];
                v.trend.forEach(function(v2,i2){
                  v.chartData.push(v2.totalCount);
                })
              })
              $scope.topTrendingKnowledge = formattedData;
              
              $scope.topTrendingKnowledgeLoaded = true;
            }
          }
        }, function (error) {
          console.log(error);
          $scope.topTrendingKnowledgeLoaded = true;
        });
      } 
      $scope.userInfo;
      function getUserInfo() {
        $scope.userInfo = UserProfileApi.getUserInfo();
  
      };
      
      $scope.exportTopTrendingKnowledge = [];
      $scope.handleExportForKnowledge = function(){

          $scope.dataToExport = []
        $scope.topTrendingKnowledge.slice(0, $scope.totalItemTrendingKnowledge).forEach(function(v){
          $scope.dataToExport.push(
            {
              "KNOWLEDGE": v.title, 
                "AUTHOR": v.author.displayName,
                "SAVES": v.totalSaves,
                "LIKES": v.totalLikes,
                "SHARES": v.totalShares,
                "VIEWS": v.totalViews,
                "URL": "https://skill.petronas.com/knowledge-discovery/"+v.id
            }
          )
        })
        if($scope.dataToExport.length > 0){
          var myStyle = {
          headers: true,
          columns: [
            {title: "KNOWLEDGE", width: 300},
                    {title: "AUTHOR", width: 300},
                    {title: "SAVES", width: 300},
                    {title: "LIKES", width: 300},
                    {title: "SHARES", width: 300},
                    {title: "VIEWS", width: 300},
                    {title: "URL", width: 400},
          ]
        }
        alasql('SELECT * INTO XLSX("Trending Knowledge",?) FROM ?',[myStyle, $scope.dataToExport.sort()]);
        }
        
      
      }
      
      $scope.handleExportAllForKnowledge = function(){

        
        var payload = {
          "fromDate": $scope.startDate,
          "toDate": $scope.endDate,
          "type": $scope.type,
          "take": $scope.totalTrendingKnowldege,
          "knowledgeType": $scope.totalTrendingKnowldege
        }
        TrendingApi.getTopTrendingKnowledge(payload).then(function (response) {
          if (response != null ) {
            if(!isExport){
              var formattedData = response.data;
              $scope.exportTopTrendingKnowledge = formattedData;
              $scope.exportTopTrendingKnowledge.forEach(function(v){
                $scope.dataToExport.push(
                  {
                    "KNOWLEDGE": v.title, 
                      "AUTHOR": v.author.displayName,
                      "SAVES": v.totalSaves,

                      "LIKES": v.totalLikes,
                      "SHARES": v.totalShares,
                      "VIEWS": v.totalViews,
                      "URL": "https://skill.petronas.com/knowledge-discovery/"+v.id
                  }
                )
              })
              if($scope.dataToExport.length > 0){
                var myStyle = {
                headers: true,
                columns: [
                  {title: "KNOWLEDGE", width: 300},
                          {title: "AUTHOR", width: 300},
                          {title: "SAVES", width: 300},
                          {title: "LIKES", width: 300},
                          {title: "SHARES", width: 300},
                          {title: "VIEWS", width: 300},
                          {title: "URL", width: 400},
                ]
              }
              alasql('SELECT * INTO XLSX("Trending Knowledge",?) FROM ?',[myStyle, $scope.dataToExport.sort()]);
              }
            }
          }
        }, function (error) {
         
        });
        
      }
      $scope.viewMoreTopTrendingKnowledge = function () {
        var url = $state.href('app.SearchPage.knowledge', { docType: 'All' });
          localStorage.setItem('TrendingToggle', 'open');
          window.open(url,'_blank');
        // $('#ModalTableTrendingAll').modal('show');
      }

      $scope.closeViewMoreTopTrendingKnowledge = function () {
        $('#ModalTableTrendingAll').modal('hide');
      }

      $scope.printPDF = function() {
        window.print();
      }

      $scope.totalTrendingCollection;
      function fetchTopTrendingCollection(){
        $scope.topTrendingCollectionLoaded = false;
        var payload = {
          "fromDate": $scope.startDate,
          "toDate": $scope.endDate,
          "type": $scope.type,
          "take": 10,
        }
        TrendingApi.getTopTrendingCollection(payload).then(function (response) {
          if (response != null) {
            $scope.topTrendingCollection = response.data;
            $scope.totalTrendingCollection = response.total;
            $scope.topTrendingCollectionLoaded = true;
          }
        }, function (error) {
          console.log(error);
          $scope.topTrendingCollectionLoaded = true;
        });
      } 
      $scope.exportTopTrendingCollection = [];
      $scope.handleExportForCollection = function(){
       
          $scope.dataToExport = []
          $scope.topTrendingCollection.slice(0, $scope.totalItemCollection).forEach(function(v){
            $scope.dataToExport.push(
              {
                "COLLECTION": v.title, 
                  "LIKES": v.totalLikes,
                  "BOOKMARKS": v.totalSaves,
                  "SHARES": v.totalShares,
                  "URL": "https://skill.petronas.com/collection-detail/"+v.id,
              }
            )
          })
          if($scope.dataToExport.length > 0){
            var myStyle = {
            headers: true,
            columns: [
              {title: "COLLECTION", width: 300},
                      {title: "LIKES", width: 300},
                      {title: "BOOKMARKS", width: 300},
                      {title: "SHARES", width: 300},
                      {title: "URL", width: 300},
            ]
          }
          alasql('SELECT * INTO XLSX("Trending Collection",?) FROM ?',[myStyle, $scope.dataToExport.sort()]);
        }
     
      }

      
      $scope.handleExportAllForCollection = function(){
      
        var payload = {
          "fromDate": $scope.startDate,
          "toDate": $scope.endDate,
          "type": $scope.type,
          "take": $scope.totalTrendingCollection,
        }
        TrendingApi.getTopTrendingCollection(payload).then(function (response) {
          if (response != null) {
            $scope.exportTopTrendingCollection = response.data;
            $scope.dataToExport = []
            $scope.exportTopTrendingCollection.forEach(function(v){
              $scope.dataToExport.push(
                {
                  "COLLECTION": v.title, 
                    "LIKES": v.totalLikes,
                    "BOOKMARKS": v.totalSaves,
                    "SHARES": v.totalShares,
                    "URL": "https://skill.petronas.com/collection-detail/"+v.id,
                }
              )
            })
            if($scope.dataToExport.length > 0){
              var myStyle = {
              headers: true,
              columns: [
                {title: "COLLECTION", width: 300},
                        {title: "LIKES", width: 300},
                        {title: "BOOKMARKS", width: 300},
                        {title: "SHARES", width: 300},
                        {title: "URL", width: 300},
              ]
            }
            alasql('SELECT * INTO XLSX("Trending Collection",?) FROM ?',[myStyle, $scope.dataToExport.sort()]);
          }
          }
        }, function (error) {
        });      
       
      }
      

      $scope.viewMoreTopTrendingCollection = function () {
        var url = $state.href('app.SearchPage.collection', { docType: 'All' });
          localStorage.setItem('TrendingToggle', 'open');
          window.open(url,'_blank');
        // $('#ModalTableTrendingCollection').modal('show');
      }

      $scope.closeTopTrendingCollection = function () {
        $('#ModalTableTrendingCollection').modal('hide');
      }

      $scope.totalTrendingContributors;
      function fetchTopTrendingContributor(){
        $scope.topTrendingContributorsLoaded = false;
        var payload = {
          "fromDate": $scope.startDate,
          "toDate": $scope.endDate,
          "type": $scope.type,
          "take": 10,
          "knowledgeType": $scope.knowledgeTypeContributor
        }
        TrendingApi.getTopContributors(payload).then(function (response) {
          if (response != null) {
            $scope.topTrendingContributors = response.data;
            $scope.totalTrendingContributors = response.total
            $scope.topTrendingContributorsLoaded = true;
          }
        }, function (error) {
          console.log(error);
          $scope.topTrendingContributorsLoaded = true;
        });
      } 

      $scope.handleExportForContributor = function(){

          $scope.dataToExport = []
        $scope.topTrendingContributors.slice(0, $scope.totalItemContributor).forEach(function(v){
          $scope.dataToExport.push(
            {
              "CONTRIBUTORS": v.displayName, 
                "AUTHORED": v.totalAuthorized,
                "REPLICATION": v.totalReplication,
                "KNOWLEDGE": v.totalKnowledge,
                "VALUE REALISED": v.totalValueRealized
            }
          )
        })
        if($scope.dataToExport.length > 0){
          var myStyle = {
          headers: true,
          columns: [
            {title: "CONTRIBUTORS", width: 500},
                    {title: "AUTHORED", width: 300},
                    {title: "REPLICATION", width: 300},
                    {title: "KNOWLEDGE", width: 300},
                    {title: "VALUE REALISED", width: 300},
          ]
        }
        alasql('SELECT * INTO XLSX("Top Contributors",?) FROM ?',[myStyle, $scope.dataToExport.sort()]);
      }
        
      }
      $scope.handleExportAllForContributor = function(){

          var payload = {
            "fromDate": $scope.startDate,
            "toDate": $scope.endDate,
            "type": $scope.type,
            "take": $scope.totalTrendingContributors,
            "knowledgeType": $scope.knowledgeTypeContributor
          }
          TrendingApi.getTopContributors(payload).then(function (response) {
            if (response != null) {
              $scope.exportTopTrendingContributors = response.data;
              $scope.dataToExport = []
            $scope.exportTopTrendingContributors.forEach(function(v){
              $scope.dataToExport.push(
                {
                  "CONTRIBUTORS": v.displayName, 
                    "AUTHORED": v.totalAuthorized,
                    "REPLICATION": v.totalReplication,
                    "KNOWLEDGE": v.totalKnowledge,
                    "VALUE REALISED": v.totalValueRealized
                }
              )
            })
            if($scope.dataToExport.length > 0){
              var myStyle = {
              headers: true,
              columns: [
                {title: "CONTRIBUTORS", width: 500},
                        {title: "AUTHORED", width: 300},
                        {title: "REPLICATION", width: 300},
                        {title: "KNOWLEDGE", width: 300},
                        {title: "VALUE REALISED", width: 300},
              ]
            }
            alasql('SELECT * INTO XLSX("Top Contributors",?) FROM ?',[myStyle, $scope.dataToExport.sort()]);
          }
            }
          }, function (error) {
            console.log(error);
            $scope.topTrendingContributorsLoaded = true;
          });
        
      
      }

      

      function formatDate(date) {
        //fix error display calendar when month,weekend, day
        // var addMonth = vm.isfirstLoadCalendar ? 0 : 1;
        var addMonth = 1;
        date = new Date(date);
        console.log();
        var day = ('0' + date.getDate()).slice(-2);
        var month = date.toLocaleString('default', { month: 'short' });
        var year = date.getFullYear();

        return day  + '-' + month + '-' + year;
    }

      $scope.viewMoreTopTrendingContributor = function () {
          var url = $state.href('app.SearchPage.people', { docType: 'All', sortBy:"HighestContributor" , "startDate": formatDate($scope.fromDate),"endDate": formatDate($scope.toDate)});
          localStorage.setItem('peopleSorting', 'Highest Contributor');
          window.open(url,'_blank');
        // $('#ModalTableTrendingContributor').modal('show');
      }

      $scope.viewMoreEngagedUser = function () {
        var url = $state.href('app.SearchPage.people', { docType: 'All' , sortBy:"HighestEngagement", "startDate": formatDate($scope.fromDate),"endDate": formatDate($scope.toDate)});
        localStorage.setItem('peopleSorting', 'Highest Engagement');
        window.open(url,'_blank');
      // $('#ModalTableTrendingContributor').modal('show');
    }

      $scope.closeTopTrendingContributor = function () {
        $('#ModalTableTrendingContributor').modal('hide');
      }

      $scope.totalTrendingEngagedUsers;
      function fetchTopTrendingEngagedUser(){
        $scope.topTrendingEngagedUsersLoaded = false;
        var payload = {
          "fromDate": $scope.startDate,
          "toDate": $scope.endDate,
          "type": $scope.type,
          "take": 10,
          "knowledgeType": $scope.knowledgeTypeEngagedUser
        }
        TrendingApi.getTopEngagedPeople(payload).then(function (response) {
          if (response != null) {
            $scope.topTrendingEngagedUsers = response.data;
            $scope.topTrendingEngagedUsersLoaded = true;
          }
        }, function (error) {
          $scope.topTrendingEngagedUsersLoaded = true;
          console.log(error);
        });
      } 

      $scope.exportTopTrendingEngagedUsers = [];
      $scope.handleExportForEngagedUser = function(){

          $scope.dataToExport = []
        $scope.topTrendingEngagedUsers.slice(0, $scope.totalItemEngagedUser).forEach(function(v){
          $scope.dataToExport.push(
            {
              "CONTRIBUTORS": v.displayName, 
                "USER SINCE": v.userSinceDate,
                "REPLICATION": v.totalReplication,
                "SAVES": v.totalSave,
                "SHARES": v.totalShare,
                "LIKES": v.totalLike,
                "VIEWS": v.totalView,
                "COMMENTS": v.totalComments,
                "RATING": v.totalRatings
            }
          )
        })
        if($scope.dataToExport.length > 0){
          var myStyle = {
          headers: true,
          columns: [
            {title: "CONTRIBUTORS", width: 300},
                    {title: "USER SINCE", width: 300},
                    {title: "REPLICATION", width: 300},
                    {title: "SAVES", width: 300},
                    {title: "SHARES", width: 300},
                    {title: "LIKES", width: 300},
                    {title: "VIEWS", width: 300},
                    {title: "COMMENTS", width: 300},
                    {title: "RATING", width: 300},
          ]
        }
        alasql('SELECT * INTO XLSX("Top Engaged People",?) FROM ?',[myStyle, $scope.dataToExport.sort()]);
       }
        
      }
      $scope.handleExportAllForEngagedUser = function(){

        var payload = {
          "fromDate": $scope.startDate,
          "toDate": $scope.endDate,
          "type": $scope.type,
          "take": $scope.totalTrendingEngagedUsers,
          "knowledgeType": $scope.knowledgeTypeEngagedUser
        }
        TrendingApi.getTopEngagedPeople(payload).then(function (response) {
          if (response != null) {
            $scope.exportTopTrendingEngagedUsers = response.data;
          }
        }, function (error) {
        });


          $scope.dataToExport = []
        $scope.exportTopTrendingEngagedUsers.forEach(function(v){
          $scope.dataToExport.push(
            {
              "CONTRIBUTORS": v.displayName, 
                "USER SINCE": v.userSinceDate,
                "REPLICATION": v.totalReplication,
                "SAVES": v.totalSave,
                "SHARES": v.totalShare,
                "LIKES": v.totalLike,
                "VIEWS": v.totalView,
                "COMMENTS": v.totalComments,
                "RATING": v.totalRatings
            }
          )
        })
        if($scope.dataToExport.length > 0){
          var myStyle = {
          headers: true,
          columns: [
            {title: "CONTRIBUTORS", width: 300},
                    {title: "USER SINCE", width: 300},
                    {title: "REPLICATION", width: 300},
                    {title: "SAVES", width: 300},
                    {title: "SHARES", width: 300},
                    {title: "LIKES", width: 300},
                    {title: "VIEWS", width: 300},
                    {title: "COMMENTS", width: 300},
                    {title: "RATING", width: 300},
          ]
        }
        alasql('SELECT * INTO XLSX("Top Engaged People",?) FROM ?',[myStyle, $scope.dataToExport.sort()]);
      }
        
       
      }
      

      $scope.viewMoreTopEngagedUser = function (type, index) {
        $('#ModalTableEngagedUser').modal('show');
      }

      $scope.closeTopEngagedUser = function () {
        $('#ModalTableEngagedUser').modal('hide');
      }

      $scope.totalTopValueRealized;
      function fetchTopValueRealized(){
        $scope.topTrendingValueRealisedLoaded = false;
        var payload = {
          "fromDate": $scope.startDate,
          "toDate": $scope.endDate,
          "type": $scope.type,
          "take": 10,
          "knowledgeType": $scope.knowledgeTypeValueRealised
        }
        TrendingApi.getTopValueRealized(payload).then(function (response) {
          if (response != null) {
            $scope.topTrendingValueRealised = response.data;
            $scope.totalTopValueRealized = response.total;
            $scope.topTrendingValueRealisedLoaded = true;
          }
        }, function (error) {
          console.log(error);
          $scope.topTrendingValueRealisedLoaded = true;
        });
      }

      $scope.exportTopTrendingValueRealised = [];
      $scope.handleExportForValueRealized = function(){

          $scope.dataToExport = []
        $scope.topTrendingValueRealised.slice(0, $scope.totalItemValueRealised).forEach(function(v){
          var author = 'No Author';
          if(v.author != null) {
            author = v.author.displayName;
          }
          $scope.dataToExport.push(
            {
              "KNOWLEDGE": v.title, 
              "AUTHOR": author,
              "SUBMITTER": v.createdBy.displayName,
              "VALUE REALISED": v.valueRealized,
              "URL": "https://skill.petronas.com/knowledge-discovery/"+v.id
            }
          )
        })
        if($scope.dataToExport.length > 0){
          var myStyle = {
          headers: true,
          columns: [
            {title: "KNOWLEDGE", width: 300},
            {title: "AUTHOR", width: 300},
            {title: "SUBMITTER", width: 300},
            {title: "VALUE REALISED", width: 300},
            {title: "URL", width: 300},
          ]
        }
        alasql('SELECT * INTO XLSX("Top Value Realized",?) FROM ?',[myStyle, $scope.dataToExport.sort()]);
      }
        
        
      }
      $scope.handleExportAllForValueRealized = function(){

        var payload = {
          "fromDate": $scope.startDate,
          "toDate": $scope.endDate,
          "type": $scope.type,
          "take": $scope.totalTopValueRealized,
          "knowledgeType": $scope.knowledgeTypeValueRealised
        }
        TrendingApi.getTopValueRealized(payload).then(function (response) {
          if (response != null) {
            $scope.exportTopTrendingValueRealised = response.data;
          }
        }, function (error) {
          console.log(error);
        });

          $scope.dataToExport = []
          $scope.topTrendingValueRealised.slice(0, $scope.totalItemValueRealised).forEach(function(v){
            var author = 'No Author';
            if(v.author != null) {
              author = v.author.displayName;
            }
            $scope.dataToExport.push(
              {
                "KNOWLEDGE": v.title, 
                "AUTHOR": author,
                "SUBMITTER": v.createdBy.displayName,
                "VALUE REALISED": v.valueRealized,
                "URL": "https://skill.petronas.com/knowledge-discovery/"+v.id
              }
            )
          })
          if($scope.dataToExport.length > 0){
            var myStyle = {
            headers: true,
            columns: [
              {title: "KNOWLEDGE", width: 300},
              {title: "AUTHOR", width: 300},
              {title: "SUBMITTER", width: 300},
              {title: "VALUE REALISED", width: 300},
              {title: "URL", width: 300},
            ]
          }
          alasql('SELECT * INTO XLSX("Top Value Realized",?) FROM ?',[myStyle, $scope.dataToExport.sort()]);
        }
        
      
        
      }

      $scope.viewMoreValueRealized = function () {

        // $('#ModalTableValueRealized').modal('show');
      }

      $scope.closeValueRealized = function () {
        $('#ModalTableValueRealized').modal('hide');
      }

      $scope.totalReplicatedKnowledge;
      function fetchTopReplicatedKnowledge(){

        $scope.topTrendingReplicatedKnowledgeLoaded = false;
        var payload = {
          "fromDate": $scope.startDate,
          "toDate": $scope.endDate,
          "type": $scope.type,
          "take": 10,
        }
        TrendingApi.getTopReplicatedKnowledge(payload).then(function (response) {
          if (response != null) {
            $scope.topTrendingReplicatedKnowledge = response.data;
            $scope.totalReplicatedKnowledge = response.total;
            console.log($scope.topTrendingReplicatedKnowledge);
            $scope.topTrendingReplicatedKnowledgeLoaded = true;
          }
        }, function (error) {
          console.log(error);
          $scope.topTrendingReplicatedKnowledgeLoaded = true;
        });
      }

      $scope.exportTopTrendingReplicatedKnowledge = [];
      $scope.handleExportForReplicatedKnowledge = function(){

          $scope.dataToExport = []
        $scope.topTrendingReplicatedKnowledge.slice(0, $scope.totalItemReplicatedKnowledge).forEach(function(v){
          $scope.dataToExport.push(
            {
              "KNOWLEDGE": v.title,
              "CREATED BY": v.createdBy.displayName, 
              "REPLICATION COUNT":v.replicationCount,
              "URL": "https://skill.petronas.com/knowledge-discovery/"+v.id
            }
          )
        })
        if($scope.dataToExport.length > 0){
          var myStyle = {
          headers: true,
          columns: [
            {title: "KNOWLEDGE", width: 300},
            {title: "CREATED BY", width: 300},
            {title: "REPLICATION COUNT", width: 300},
            {title: "URL", width: 300},
          ]
        }
        alasql('SELECT * INTO XLSX("Top Replicated Knowledge",?) FROM ?',[myStyle, $scope.dataToExport.sort()]);
      }
        
        
      }

      $scope.handleExportAllForReplicatedKnowledge = function(){

          var payload = {
            "fromDate": $scope.startDate,
            "toDate": $scope.endDate,
            "type": $scope.type,
            "take": $scope.totalReplicatedKnowledge,
          }
          TrendingApi.getTopReplicatedKnowledge(payload).then(function (response) {
            if (response != null) {
              $scope.exportTopTrendingReplicatedKnowledge = response.data;
              $scope.dataToExport = []
        $scope.exportTopTrendingReplicatedKnowledge.forEach(function(v){
          $scope.dataToExport.push(
            {
              "KNOWLEDGE": v.title,
              "CREATED BY": v.createdBy.displayName, 
              "REPLICATION COUNT":v.replicationCount,
              "URL": "https://skill.petronas.com/knowledge-discovery/"+v.id
            }
          )
        })
        if($scope.dataToExport.length > 0){
          var myStyle = {
          headers: true,
          columns: [
            {title: "KNOWLEDGE", width: 300},
            {title: "CREATED BY", width: 300},
            {title: "REPLICATION COUNT", width: 300},
            {title: "URL", width: 300},
          ]
        }
        alasql('SELECT * INTO XLSX("Top Replicated Knowledge",?) FROM ?',[myStyle, $scope.dataToExport.sort()]);
      }
            }
          }, function (error) {
            console.log(error);
          });
        
     
        
      }

      

      $scope.totalTrendingTopics;
      function fetchTrendingTopics(){
        $scope.topTrendingTopicLoaded = false;
        var payload = {
          "fromDate": $scope.startDate,
          "toDate": $scope.endDate,
          "type": $scope.type,
          "take": 10,
        }
        TrendingApi.getTrendingTopics(payload).then(function (response) {
          if (response != null) {
            $scope.topTrendingTopic = response.data;
            $scope.allTrendingTopic = response.data;
            $scope.totalTrendingTopics = response.total;
            console.log(response);
            $scope.found = response.total;
            $scope.topTrendingTopicLoaded = true;
          }
        }, function (error) {
          console.log(error);
          $scope.topTrendingTopicLoaded = true;
        });
      }

      function getAllTrendingTopic() {
        var payload = {
          "fromDate": $scope.startDate,
          "toDate": $scope.endDate,
          "type": $scope.type,
          "skip": ($scope.pageIndex - 1) * $scope.maxSize,
          "take": $scope.maxSize,
        }
        TrendingApi.getTrendingTopics(payload).then(function (response) {
          if (response != null) {
            $scope.allTrendingTopic = response.data;
          }
        }, function (error) {
          console.log(error);
        });
      }
      $scope.exportAllTrendingTopic = [];
      $scope.handleExportForTrendingTopics = function(){
       
        $scope.dataToExport = []
        $scope.topTrendingTopic.slice(0, $scope.totalItemTopic).forEach(function(v){
          $scope.dataToExport.push(
            {
              "TITLE": v.topic, 
              "SUBMISSIONS":v.totalSubmissions
            }
          )
        })
        if($scope.dataToExport.length > 0){
          var myStyle = {
          headers: true,
          columns: [
            {title: "TITLE", width: 300},
            {title: "SUBMISSIONS", width: 300},
          ]
        }
        alasql('SELECT * INTO XLSX("Trending Topic",?) FROM ?',[myStyle, $scope.dataToExport.sort()]);
      }
        
        
      }

      $scope.handleExportAllForTrendingTopics = function(){
       
          var payload = {
            "fromDate": $scope.startDate,
            "toDate": $scope.endDate,
            "type": $scope.type,
            "skip": ($scope.pageIndex - 1) * $scope.maxSize,
            "take": $scope.totalTrendingTopics,
          }
          TrendingApi.getTrendingTopics(payload).then(function (response) {
            if (response != null) {
              $scope.exportAllTrendingTopic = response.data;
            }
          }, function (error) {
            console.log(error);
          });

          $scope.dataToExport = []
          $scope.exportAllTrendingTopic.forEach(function(v){
            $scope.dataToExport.push(
              {
                "TITLE": v.topic, 
                "SUBMISSIONS":v.totalSubmissions
              }
            )
          })
        if($scope.dataToExport.length > 0){
          var myStyle = {
          headers: true,
          columns: [
            {title: "TITLE", width: 300},
            {title: "SUBMISSIONS", width: 300},
          ]
        }
        alasql('SELECT * INTO XLSX("Trending Topic",?) FROM ?',[myStyle, $scope.dataToExport.sort()]);
      }
        
       
        
      }

      $scope.totalTrendingSearchKeywords
      function fetchTrendingSearchKeywords(){
        $scope.topTrendingTopicLoaded = false;
        var payload = {
          "fromDate": $scope.startDate,
          "toDate": $scope.endDate,
          "type": $scope.type,
          "take": 10,
        }
        TrendingApi.getTrendingSearchKeywords(payload).then(function (response) {
          if (response != null) {
            $scope.topTrendingSearchKeyword = response.data;
            $scope.allTrendingTopicSearchKeyword = response.data;
            $scope.totalTrendingSearchKeywords = response.total;
            $scope.keywordFound = response.total;
            $scope.topTrendingSearchKeywordLoaded = true;
          }
        }, function (error) {
          console.log(error);
          $scope.topTrendingSearchKeywordLoaded = true;
        });
      }

      function getAllTrendingSearchKeywords() {
        var payload = {
          "fromDate": $scope.startDate,
          "toDate": $scope.endDate,
          "type": $scope.type,
          "skip": ($scope.pageKeywordIndex - 1) * $scope.maxKeywordSize,
          "take": $scope.maxKeywordSize,
        }
        TrendingApi.getTrendingSearchKeywords(payload).then(function (response) {
          if (response != null) {
            $scope.allTrendingTopicSearchKeyword = response.data;
          }
        }, function (error) {
          console.log(error);
        });
      }

      $scope.exportAllTrendingSearchKeywords = [];
      $scope.handleExportForTrendingSearchKeywords = function(){
       
        $scope.dataToExport = []
        $scope.topTrendingSearchKeyword.slice(0, $scope.totalItemSearchKeyword).forEach(function(v){
          $scope.dataToExport.push(
            {
              "TITLE": v.topic, 
              "SUBMISSIONS":v.totalSubmissions
            }
          )
        })
        if($scope.dataToExport.length > 0){
          var myStyle = {
          headers: true,
          columns: [
            {title: "TITLE", width: 300},
            {title: "SUBMISSIONS", width: 300},
          ]
        }
        alasql('SELECT * INTO XLSX("Trending Topic",?) FROM ?',[myStyle, $scope.dataToExport.sort()]);
      }
        
        
      }

      $scope.handleExportAllForTrendingSearchKeywords = function(){
       
          var payload = {
            "fromDate": $scope.startDate,
            "toDate": $scope.endDate,
            "type": $scope.type,
            "skip": ($scope.pageIndex - 1) * $scope.maxSize,
            "take": $scope.totalTrendingSearchKeywords,
          }
          TrendingApi.getTrendingSearchKeywords(payload).then(function (response) {
            if (response != null) {
              $scope.exportAllTrendingSearchKeywords = response.data;
            }
          }, function (error) {
            console.log(error);
          });

          $scope.dataToExport = []
          $scope.exportAllTrendingSearchKeywords.forEach(function(v){
            $scope.dataToExport.push(
              {
                "TITLE": v.topic, 
                "SUBMISSIONS":v.totalSubmissions
              }
            )
          })
        if($scope.dataToExport.length > 0){
          var myStyle = {
          headers: true,
          columns: [
            {title: "TITLE", width: 300},
            {title: "SUBMISSIONS", width: 300},
          ]
        }
        alasql('SELECT * INTO XLSX("Trending Topic",?) FROM ?',[myStyle, $scope.dataToExport.sort()]);
      }
        
       
        
      }


      function fetchRanking(){
        LeaderboardApi.getMyRanking().then(function (data) {
          if (data != null) {
            $scope.ranking = data;
          }
        }, function (error) {
          console.log(error);
        });
      }

      $scope.handleExportForRanking = function(){

       if($scope.userInfo.isAdmin){
          $scope.dataToExport = []
        $scope.rankingData.forEach(function(v){
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
        alasql('SELECT * INTO XLSX("User Ranking",?) FROM ?',[myStyle, $scope.dataToExport.sort()]);
      }
      }
        
        else{
          $scope.dataToExport = []
        $scope.rankingData.forEach(function(v){
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
        alasql('SELECT * INTO XLSX("User Ranking",?) FROM ?',[myStyle, $scope.dataToExport.sort()]);
      }
      }
      }
        
      $scope.goAllKnowledge = function () {
        var url = $state.href('app.SearchPage.collection', { docType: 'All' });
          localStorage.setItem('TrendingToggle', 'open');
          window.open(url,'_blank');
    }

    $scope.onChangeCopData = function () {
      rankingCopData();
    }
    $scope.onChangeDivisionData = function() {
      fetchRankingData();
    }
    function rankingCopData(){
      $scope.rankingDataLoaded = false;
      $scope.userRanking = null;
      var payload = {
        length: "",
        skip: 0,
        start: "",
        take: 0,
        fromDate: new Date(1, 1, 1900),
        toDate: new Date(),
        coPId: $scope.rankingFilterCop
      }
      LeaderboardApi.getCommunityScoreRankingByCop("MyDepartment",payload).then(function (data) {
        if (data != null) {
          $scope.rankingData = data.rankingListResponse;
            $scope.rankingDataLoaded = true;
            $scope.userRanking = data;
        }
      }, function (error) {
        console.log(error);
        $scope.rankingDataLoaded = true;
      });
  }
    function fetchRankingData(){
      $scope.rankingDataLoaded = false;
      $scope.userRanking = null;
      if($scope.type == 'My CoP') {
        if($scope.listCopData.length == 0) {
          LeaderboardApi.getSubscribedCoP().then(function (data) {
            if (data != null) {
              $scope.listCopData = data;
              if($scope.listCopData.length > 0) {
                  $scope.rankingFilterCop = data[0].id;
                  rankingCopData();
                  $timeout(function(){
                      $("#copOption").val($scope.rankingFilterCop);
                      $("#copOption").find('option').get(0).remove();
                  }, 1000)
                  
                  // $('select#copOption').find('option:contains("' + $scope.selectedCoP + '")').attr("selected",true);

              } else {
                $scope.rankingDataLoaded = true;
              }
            } else {
              $scope.rankingDataLoaded = true;
            }

          }, function (error) {
            console.log(error);
            $scope.rankingDataLoaded = true;
          });
        } else {
          rankingCopData();
        }
      } else {
        var payload = {
          IsIndividual: true,
          length: 0,
          skip: 0,
          start: 0,
          take: 0,
          fromDate: new Date(1, 1, 1900),
          toDate: new Date(),
          type: $scope.rankingFilterSelected
        }
        if($scope.type == 'My Division') {
          payload.IsIndividual = $scope.rankingFilterDivision;
        }
        LeaderboardApi.getCommunityScoreRanking("MyDepartment",payload).then(function (data) {
          if (data != null && data.hasOwnProperty("rankingListResponse") && data.rankingListResponse.length > 0) {
            $scope.rankingData = data.rankingListResponse;
          } else {
            $scope.rankingData = [];
          }
          $scope.rankingDataLoaded = true;
          $scope.userRanking = data;
        }, function (error) {
          console.log(error);
          $scope.rankingDataLoaded = true;
        });
      }
    }

      function fetchApi(){
        //
        // LoadTrendingTopic();
        //
        getUserInfo();
        fetchDataForChart();
        //
        fetchMyLevel();
        //
        $scope.fetchTrendingKnowledge();
        //
        fetchTopTrendingCollection();
        //
        fetchTopTrendingContributor();
        //
        fetchTopTrendingEngagedUser();
        //
        fetchTopValueRealized();
        //
        fetchTopReplicatedKnowledge();
        //
        fetchTrendingTopics();
        fetchTrendingSearchKeywords();
        //
        fetchCurrentChallenge();
        fetchRankingData();
        //
        fetchRanking();
        
      }

      function getProfile(){
        var user = UserProfileApi.getUserInfo();
        UserProfileApi.getProfile(user.userId).then(function (res) {
          if(res != null || res!= ""){
            $scope.user = res;
          }
        });
      }

      function fetchCurrentChallenge(){
        $scope.currentChallengeLoaded = false;
        var payload = {
          // "fromDate": $scope.startDate,
          // "toDate": $scope.endDate,
          "skip":0,
          "take": 10,
        }
        TrendingApi.getCurrentChallenge(payload).then(function (response) {
          if (response != null && response.data.length > 0) {
            $scope.currentChallenge = response.data;
          }
          $scope.currentChallengeLoaded = true;
        }, function (error) {
          console.log(error);
          $scope.currentChallengeLoaded = true;
        });
      }

      function _onInit(){
        fetchApi();
        getProfile();
      }

      _onInit();

      $scope.onChangeTrendingKnowledgeFilter = function(){
        $scope.fetchTrendingKnowledge();
      }

      $scope.onChangeTrendingContributorFilter = function(){
        fetchTopTrendingContributor();
      }

      $scope.onChangeTrendingEngagedUserFilter = function(){
        fetchTopTrendingEngagedUser();
      }

      $scope.onChangeTrendingValueRealisedFilter = function(){
        fetchTopValueRealized();
      }

      $scope.onChangeType = function(){
        console.log($scope.type);
        if($scope.type == 'My Division') {
          $scope.rankingFilterSelected = 'MyDivision';
        } else if ($scope.type == 'My Department') {
          $scope.rankingFilterSelected = 'MyDepartment';
        } else if ($scope.type == 'My Discipline') {
          $scope.rankingFilterSelected = 'MyDiscipline';
        } else if ($scope.type == 'Default') {
          $scope.rankingFilterSelected = 'Overall';
        }
        fetchApi();
      }

      $scope.onChangeisAuthorOnly = function(){
        fetchDataForChart();
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
    }

})();
