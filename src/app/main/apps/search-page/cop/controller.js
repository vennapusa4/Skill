(function () {
    'use strict';

    angular
        .module('app.SearchPage')
        .controller('copController', copController);

    /** @ngInject */
    function copController($scope, searchPageAPI, UserProfileApi, LandingPageAPI, appConfig, $timeout  , $stateParams , $location) {
        
        var vm = this;
        vm.dummyRelated = ['basin', 'petroleum exploration', 'sedimentory', 'type of basin', 'bayesian analysis', 'basin modelling'];
        vm.dummyUser = [
            {
                name: 'Ahmad Fitri Hakim bin Mohad Fadzil',
                title: 'King of all Kings',
                image: '/assets/images/aidil.jpg'
            },
            {
                name: 'Raja Azura',
                title: 'Queen',
                image: '/assets/images/aidil.jpg'
            },
            {
                name: 'Fateh Hamin',
                title: 'Bishop',
                image: '/assets/images/aidil.jpg'
            },
            {
                name: 'Nur Ikhwan Bin Mustafa',
                title: 'Castle',
                image: '/assets/images/aidil.jpg'
            },
            {
                name: 'Mustaqim bin Beramboi',
                title: 'Knight',
                image: '/assets/images/aidil.jpg'
            },
            {
                name: 'Saadah Munirah binti Latiff',
                title: 'King of all Kings',
                image: '/assets/images/aidil.jpg'
            }

        ];
        $scope.trendingCoP = [];
        $scope.cop = [];
        vm.isEndorsed = false;
        vm.withVideo = false;
        vm.withValue = false;
        vm.withReplication = false;
        vm.isValidated = false;
        $scope.pageIndex = 1;
        $scope.maxSize = 8;
        $scope.found = 0;
        $scope.potential = 0;
        $scope.valueRealize = 0;
        $scope.searchTime=0;
        $scope.pageSize = 9;
        vm.withAudio = false;
        $scope.searchFilters = [];
        $scope.trendingCopLoaded = false;
        $scope.copLoaded = false;
        $scope.currentView = 'list';
        $scope.potentialValueTotal;
        $scope.valueRealizedTotal;
        $scope.fromDate;
        $scope.toDate;
        vm.isdeepSearch = false;

        vm.scrollLeftContent = function () {
            var div = document.querySelector('div#scrollContent');
            div.scrollTo(div.scrollLeft + 262, 0);
            console.log(div.scrollLeft);
        }
        $scope.isSearched = true;

        $scope.$emit('displayLeftPanel' , true);

        $scope.$on("onSearch", function(evt,object){ 
          //  alert("COP EVENT FIRE");
            $scope.categoryName = $stateParams.docType;
            vm.isdeepSearch = false;
            if($scope.categoryName == undefined){
                $scope.categoryName = "All"
                $location.search('docType', $scope.categoryName);
            }
            getTrendingCoP(object.searchText , $scope.categoryName);
            getCoP();

        });

        $scope.$on("onRemoveSearch", function (evt) {
          // alert("KNOWLEDGE EVENT FIRE");
          $scope.searchText = '';
          vm.isdeepSearch = false;
          $scope.categoryName = $stateParams.docType;
            if ($scope.categoryName == undefined) {
                $scope.categoryName = "All"
              //  $location.search('docType', $scope.categoryName);
            }
          getTrendingCoP($scope.searchText  , $scope.categoryName);
          getCoP();
          $scope.$emit('onCoPLoad' , $scope.searchText , $scope.categoryName);
      });

        $scope.$on('onAdditionalFilterChange', function (event) {
          //   Tag.filter Tag.value
          getCoP();
        });
 
        $scope.$on('onSortingChange', function (event) {
             //   Tag.filter Tag.value
             getCoP();
        });

        $scope.categoryCountList = [
          {
              "name" : "All",
          },
          {
            "name" : "Lessons Learnt",
          },
          {
            "name" : "Best Practices",
         },
         {
            "name" : "Publications",
         },
         {
            "name" : "Technical Alerts",
         },
         {
            "name" : "Collections",
         },
         {
          "name" : "Community of Practice",
       },
       {
        "name" : "People",
        }
        ];


        $scope.$on('setDefaultDate', function (event, dates) {
          $scope.fromDate = dates.startDate;
          $scope.toDate = dates.endDate;
          getCoP();
      });
      $scope.$on('onMonthChange', function (event, dates) {
          $scope.fromDate = dates.startDate;
          $scope.toDate = dates.endDate;
          getCoP();
      });
      $scope.$on('onYearChange', function (event, dates) {
          $scope.fromDate = dates.startDate;
          $scope.toDate = dates.endDate;
          getCoP();
      });
      $scope.$on('onQuarterChange', function (event, dates) {
          $scope.fromDate = dates.fromDate;
          $scope.toDate = dates.toDate
          getCoP();
      });
      $scope.$on('customDateChange', function (event, dates) {
          $scope.fromDate = dates.fromDate;
          $scope.toDate = dates.toDate
          getCoP();
      });

        function getTrendingCoP(searchText, categoryName){
          $scope.trendingCopLoaded = false;
            searchPageAPI.getTrendingCOP(searchText, categoryName).then(function (res) {
                res.forEach(function (cop) {
                    $scope.trendingCoP.push(cop);
                });
                $scope.trendingCopLoaded = true;
              });
         }

         $scope.arrSortby = [

            { id: 'LatestContribution', name: 'Latest Contribution' },
            { id: 'HighestEngagement', name: 'Highest Engagement' },
            { id: 'MostShared', name: 'Most Shared' },
            { id: 'HighestValueRealised', name: 'Highest Value Realised' },
            { id: 'HighestPotentialValue', name: 'Highest Potential Value' },
            { id: 'HighestReplication', name: 'Highest Replication' },
        ];

        $scope.setSelectedFilters = function(){
            var kdType;
            for (kdType in appConfig.SearchFilters) {
                if (appConfig.SearchFilters.hasOwnProperty(kdType)) {
                    var value = appConfig.SearchFilters[kdType];
                  //  $scope.searchFilters.push({ "name": value, "value": kdType, "selected": true });
                    $scope.searchFilters.push({ "name": value, "value": kdType, "selected": false });
                }
            }
        }

        function kmlFormatter(num, tofixed) {
            var result = num > 999 ? (num / 1000).toFixed(3) + 'k' : num;
            if (num >= 1000000000) {
              return (num / 1000000000).toFixed(3) + 'B';
            } else {
              if (num >= 1000000) {
                return (num / 1000000).toFixed(3) + 'M';
              } else {
                if (num >= 1000) {
                  return (num / 1000).toFixed(3) + 'K';
                } else {
                  return num;
                }
              }
            }
            return result;
          }

         // Format currency
         $scope.kmlFormatter = function (str) {
            return kmlFormatter(str);
        }

         function getCoP(){
          $scope.copLoaded = false;
            var filters;
            var sorting;
            var docType;

            var queryUrl = $location.search();
            if(queryUrl.sortBy == undefined || queryUrl.sortBy == null) {
              sorting = $scope.arrSortby[0].id;
            } else {
              sorting = queryUrl.sortBy;
            }
            if(queryUrl.isEndorsed == false || queryUrl.isEndorsed == "false" || queryUrl.isEndorsed == undefined ){
                vm.isEndorsed = false;
            }
            else{
              vm.isEndorsed = true;
            }
            if(queryUrl.isValidated == false || queryUrl.isValidated == "false" || queryUrl.isValidated == undefined ){
              vm.isValidated = false;
            }
            else{
              vm.isValidated = true;
            }
            if(queryUrl.withVideo == false || queryUrl.withVideo == "false" || queryUrl.withVideo == undefined){
                vm.withVideo = false;
            }
            else{
              vm.withVideo = true;
            }

            if(queryUrl.withAudio == false || queryUrl.withAudio == "false" || queryUrl.withAudio == undefined){
                vm.withAudio = false;
              }
              else{
                vm.withAudio = true;
              }

            if(queryUrl.withValue == false || queryUrl.withValue == "false" || queryUrl.withValue == undefined){
              
                vm.withValue = false;
            }
            else{
                vm.withValue = true;
            }

            if(queryUrl.withReplication == false || queryUrl.withReplication == "false" || queryUrl.withReplication == undefined){
            
                vm.withReplication = false;
            }
            else{
              vm.withReplication = true;
            }
            if(queryUrl.isValidated == false || queryUrl.isValidated == "false" || queryUrl.isValidated == undefined){
            
                vm.isValidated = false;
            }
            else{
              vm.isValidated = true;
            }

            docType = queryUrl.docType;
            queryUrl.searchKeyword
            $scope.userInfo = UserProfileApi.getUserInfo();
            $scope.category = [];

            var skip = ($scope.pageIndex - 1) * $scope.pageSize;

            $scope.searchData = {
                "searchKeyword": queryUrl.searchKeyword,
                "searchKeywordTranslated": [
                  ""
                ],
                "docType": docType,
                "fromDate": $scope.fromDate,
                "todate": $scope.toDate,
                "year": 0,
                "userid": 0,
                "category": $scope.category,
                "sortBy": sorting,
                "filterBy": [],
                "isShowHasValue":  vm.withValue , 
                "isShowHasVideo": vm.withVideo,
                "isShowValidate":  vm.isValidated ,
                "isShowEndorsed": vm.isEndorsed,
                "isShowValidated": vm.isValidated,
                "isShowReplications": vm.withReplication,
                "isShowHasAudio": vm.withAudio,
                "skip": skip,
                "take": 1000,
                "sortField": "",
                "sortDir": "",
                "isExport": true,
                "searchTerm": queryUrl.searchKeyword,
                "isdeepSearch": vm.isdeepSearch
            }
              $scope.directory = [];
              vm.alphabet;
              vm.newarray = [];
              vm.copsBoard = [];
              $scope.sortedArray = [];
              searchPageAPI.getAllCoP($scope.searchData).then(function (res) {
     
                        if (res.data != null) {
                            $scope.cop = res.data;
                            console.log(res.data);
                            $scope.found = res.total;
                            $scope.potentialValueTotal = res.potentialValueTotal;
                            $scope.valueRealizedTotal = res.valueRealizedTotal;
                            $scope.searchTime=res.seconds;
                            res.data.sort(function(a, b){
                              return a.name.toLowerCase().localeCompare(b.name.toLowerCase());
                            }).forEach(function (cop) {
                              $scope.directory.push(cop);
                            });
                    
                            $scope.directory.forEach(function (cop) {
                              vm.copsBoard.push(cop);
                            });
                            for(var i =0 ; i < $scope.directory.length;i++){
                              vm.alphabet = $scope.directory[i].name.charAt(0);
                              $scope.sortedArray = [];
                              for(var j=vm.copsBoard.length ; j > 0 ; j--){
                                if(vm.copsBoard.length != 0){
                                  if(vm.alphabet.toUpperCase() == vm.copsBoard[0].name.charAt(0).toUpperCase()){
                                    $scope.sortedArray.push(vm.copsBoard[0]);
                                    vm.copsBoard.splice(0 , 1);
                                  }
                                }
                              }
                              if($scope.sortedArray.length != 0){
                                vm.newarray.push({"alphabet": vm.alphabet , "cops": $scope.sortedArray});
                              }
                            
                            }
                            $scope.checker = Math.ceil(vm.newarray.length / 2);
                    
                            $scope.firstRow = vm.newarray.slice(0, $scope.checker + 1);
                            $scope.secondRow = vm.newarray.slice($scope.checker + 1, ($scope.checker * 2));
                            console.log($scope.firstRow);
                            console.log($scope.secondRow);
                           // $scope.hasDataLoaded = true;
                        }
                        else{
                           // $scope.hasDataLoaded = true;
                        }
                        $scope.copLoaded = true;
                    
                    });
         }

         $scope.pageChanged = function() {
            getCoP(); 
        }
      
         $scope.$on('onCategoryChange', function (event, categoryList) {
            $scope.category = categoryList;
            getCoP();
        });
        $scope.$on('onChangeView', function (event, data) {
            $scope.currentView = data;
        });

         function _onInit(){

            //DocType
            $scope.categoryName = $stateParams.docType;
            if($scope.categoryName == undefined){
                $scope.categoryName = "All"
                $location.search('docType', $scope.categoryName);
            }
            //SearchText
            //SearchText
            $scope.searcParameter = $stateParams.searchKeyword;

            if($scope.searchText == null){
                if($stateParams.searchKeyword == undefined){
                    $stateParams.searchKeyword = "";   
                    $scope.searchText = $stateParams.searchKeyword;
                }
                else{
                    console.log("Coming in Else of CoP"+$scope.searcParameter);
                    $scope.searchText = $stateParams.searchKeyword;
                    $scope.$emit('onCoPLoad' , $scope.searchText , $scope.categoryName);
                }
            }

            $location.search('searchKeyword', $scope.searchText);

            if($scope.searchText == null && $scope.searchText == ""){
                if($stateParams.searchKeyword == undefined){
                    $stateParams.searchKeyword = "";   
                }
                $scope.searchText = $stateParams.searchKeyword;
                $location.search('searchKeyword', $scope.searchText);

            }
            else{
                //If Search is not empty
                $location.search('searchKeyword', $scope.searchText);
            }

            $scope.setSelectedFilters();
            getTrendingCoP($scope.searchText , $scope.categoryName);
            getCoP();
        }

        _onInit();
        $scope.OnInit = _onInit;

       

    }

})();
