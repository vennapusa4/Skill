(function () {
    'use strict';

    angular
        .module('app.SearchPage')
        .controller('CollectionController', CollectionController);

    /** @ngInject */
    function CollectionController($scope, searchPageAPI, UserProfileApi, appConfig, $location, $stateParams, $timeout) {
        
        var vm = this;
        $scope.trendingCollections = [];
        $scope.collections = [];
        $scope.searchFilters= [];
   
        $scope.potentialValueTotal;
        $scope.valueRealizedTotal;

        vm.scrollLeftContent = function () {
            var div = document.querySelector('div#scrollContent');
            div.scrollTo(div.scrollLeft + 262, 0);
            console.log(div.scrollLeft);
        }

        $scope.isSearched = false;
        $scope.cop = null;
        $scope.trendingCollectionLoaded = false;
        $scope.collectionLoaded = false;
        $scope.pageIndex = 1;
        $scope.maxSize = 8;
        $scope.found = 0;
        $scope.searchTime=0;
        $scope.potential = 0;
        $scope.valueRealize = 0;
        $scope.pageSize = 9;
        vm.isEndorsed = false;
        vm.isValidated = false;
        vm.withVideo = false;
        vm.withValue = false;
        vm.withReplication = false;
        vm.isValidated = false;
        $scope.fromDate;
        $scope.toDate;
        vm.isdeepSearch = false;
        $scope.categoryCountList = [
          {
            name: "All",
          },
          {
            name: "Lessons Learnt",
          },
          {
            name: "Best Practices",
          },
          {
            name: "Publications",
          },
          {
            name: "Technical Alerts",
          },
          {
            name: "Collections",
          },
          {
            name: "Community of Practice",
          },
          {
            name: "People",
          },
        ];

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
            $scope.searchFilters.push({ "name": "All", "value": "All", "selected": true });
            for (kdType in appConfig.SearchFilters) {
                if (appConfig.SearchFilters.hasOwnProperty(kdType)) {
                    var value = appConfig.SearchFilters[kdType];
                   // $scope.searchFilters.push({ "name": value, "value": kdType, "selected": true });
                   $scope.searchFilters.push({ "name": value, "value": kdType, "selected": false });
                }
            }
        }
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
       }
       ,
         {
          "name" : "People",
       }
        ];

      
        function getTrendingCollections(searchText){
          $scope.trendingCollectionLoaded = false;
            searchPageAPI.getTrendingCollections(searchText).then(function (res) {
                if(res != null) {
                  res.forEach(function (collection) {
                    $scope.trendingCollections.push(
                        {
                            "collectionId": collection.id,
                            "totalContributionsCount":collection.totalNumberOfArticles,
                            "collectionName": collection.name,
                            "totalLikesCount":collection.totalLikes,
                            "totalSaveLibraryCount":collection.totalBookmarks,
                            "imageUrl": collection.imageURL

                        }
                      );
                });
                }
                $scope.trendingCollectionLoaded = true;
                $timeout(function(){
                  checkTrendingToggle ();
                }, 500)
              });
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

        function getAllCollections(){
                $scope.collectionLoaded = false;
                var filters;
                var sorting;
                var docType;
    
                var queryUrl = $location.search();
                if(queryUrl.sortBy == undefined || queryUrl.sortBy == null) {
                  sorting = $scope.arrSortby[0].id;
                } else {
                  sorting = queryUrl.sortBy;
                }
                if(queryUrl.filter === undefined || queryUrl.filter === null) {
                    filters = $scope.searchFilters.map(function(x){ return x.name}).slice(1);
                } else {
                    filters = queryUrl.filter;
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
                $scope.userInfo = UserProfileApi.getUserInfo();
                $scope.knowledgeID;

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
                    "category": $scope.category ? $scope.category : [],
                    "sortBy": sorting,
                    "filterBy": [],
                    "isShowHasValue":  vm.withValue , 
                    "isShowHasVideo": vm.withVideo,
                    "isShowValidate":  vm.isValidated ,
                    "isShowEndorsed": vm.isEndorsed,
                    "isShowReplications": vm.withReplication,
                    "isShowHasAudio": vm.withAudio,
                    "skip": skip,
                    "take": $scope.pageSize,
                    "sortField": "",
                    "sortDir": "",
                    "isExport": true,
                    "searchTerm": queryUrl.searchKeyword,
                    "isdeepSearch": vm.isdeepSearch
                }
                  $scope.collections = [];
                  searchPageAPI.getCollections($scope.searchData).then(function (res) {
         
                            if (res.data != null) {
                            
                             res.data.forEach(function (collection) {
                                    $scope.collections.push(
                                        {
                                            "collectionId": collection.id,
                                            "totalContributionsCount":collection.totalNumberOfArticles,
                                            "collectionName": collection.name,
                                            "totalLikesCount":collection.totalLikes,
                                            "totalSaveLibraryCount":collection.totalBookmarks,
                                            "imageUrl": collection.imageURL
                
                                        });
                                });

                            }
                            $scope.found = res.total;
                            $scope.potentialValueTotal = res.potentialValueTotal;
                            $scope.valueRealizedTotal = res.valueRealizedTotal;
                            $scope.collectionLoaded = true;
                            $scope.searchTime=res.seconds;

                        });
         }


         $scope.$on('onCategoryChange', function (event, categoryList) {
            $scope.category = categoryList;
            getAllCollections();
         });
         $scope.pageChanged = function() {
            getAllCollections();
        }

        function checkTrendingToggle () {
          var checkSorting = localStorage.getItem('TrendingToggle');
                if(checkSorting !== undefined && checkSorting !== null) {
                  if(checkSorting == 'open') {
                    $('#collapseTrending').collapse({
                      toggle: true
                    })
                  } 
                    $timeout(function(){
                        localStorage.removeItem('TrendingToggle');
                    }, 1000);
                } 
        }

        $scope.$on('onAdditionalFilterChange', function (event) {
          //   Tag.filter Tag.value
          getAllCollections();
          });
 
          $scope.$on('onSortingChange', function (event) {
             //   Tag.filter Tag.value
             getAllCollections();
             });
             $scope.$on('setDefaultDate', function (event, dates) {
              $scope.fromDate = dates.startDate;
              $scope.toDate = dates.endDate;
              getAllCollections();
          });
          $scope.$on('onMonthChange', function (event, dates) {
              $scope.fromDate = dates.startDate;
              $scope.toDate = dates.endDate;
              getAllCollections();
          });
          $scope.$on('onYearChange', function (event, dates) {
              $scope.fromDate = dates.startDate;
              $scope.toDate = dates.endDate;
              getAllCollections();
          });
          $scope.$on('onQuarterChange', function (event, dates) {
              $scope.fromDate = dates.fromDate;
              $scope.toDate = dates.toDate
              getAllCollections();
          });
          $scope.$on('customDateChange', function (event, dates) {
              $scope.fromDate = dates.fromDate;
              $scope.toDate = dates.toDate
              getAllCollections();
          });
            

        $scope.$on("onSearch", function(evt,object){ 
          
            $scope.searchText = object.searchText;
            vm.isdeepSearch = false;
           
            getTrendingCollections(object.searchText);
            getAllCollections();

        });

        $scope.$on("onRemoveSearch", function (evt) {
          // alert("KNOWLEDGE EVENT FIRE");
          $scope.searchText = '';
          vm.isdeepSearch = false;
          getTrendingCollections($scope.searchText);
          getAllCollections();
          $scope.$emit('onCollectionLoad' , $scope.searchText); 
      });

         
         function _onInit(){
             //SearchText
             $scope.searchText = $stateParams.searchKeyword;
             if($scope.searchText != undefined){
                     //$location.search('searchKeyword', $scope.searchText);
                     $scope.$emit('onCollectionLoad' , $scope.searchText);   
             }
             $scope.setSelectedFilters();
            getTrendingCollections($scope.searchText);
            // getAllCollections();
        }

        _onInit();
        $scope.OnInit = _onInit;

    }

})();
