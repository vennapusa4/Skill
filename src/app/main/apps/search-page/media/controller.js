(function () {
    'use strict';
  
    angular
      .module('app.SearchPage')
      .controller('MediaController', MediaController);
  
    /** @ngInject */
    function MediaController($scope,$q, $timeout, searchPageAPI , UserProfileApi, appConfig,$stateParams,$location, $state ) {
      var vm = this;
      
      $scope.documentType = ['all', 'publication', 'lesson learnt', 'best practice', 'technical alert'];
      $scope.medias = [1, 2, 3, 4, 5, 6, 7, 8, 9]

      // patch fix. Need to find a proper fix later
      $scope.isCollapsed = true;
      $scope.showhide = function(){
        //collapseTrending
        $("#collapseTrending").collapse('toggle');
        $timeout(function(){
          $("#collapseTrending").width = $("#collapseTrending").width + 10;
          $("#collapseTrending").width = $("#collapseTrending").width - 10;
        },200);
      
      };
      //
      $scope.pagename = "MediaPage";

      vm.isValidated = false;
      vm.withVideo = false;
      vm.withValue = false;
      vm.withReplication = false;
      vm.isValidated = false;
      vm.withAudio = false;

      $scope.searchFilters = [];
      $scope.trendingMedia = [];
      $scope.category = [];
      $scope.potentialValueTotal;
      $scope.valueRealizedTotal;
      $scope.trendingMediaLoaded = false;
      $scope.mediaLoaded = false;
    
      $scope.pageIndex = 1;
      $scope.maxSize = 8;
      $scope.found = 0;
      $scope.potential = 0;
      $scope.searchTime=0;
      $scope.valueRealize = 0;
      $scope.pageSize = 13;
      $scope.setPage = function (pageNo) {
        $scope.pageIndex = pageNo;
      };



     //play video
      $scope.canDisplayMainVideo = false;

      $scope.knowledgeID;
      $scope.fromDate;
      $scope.toDate;
     

      function playMedia(data){
        $scope.canDisplayMainVideo = true;
        var myOptions = {
          "nativeControlsForTouch": false,
          controls: true,
          autoplay: false,
          width: "100%",
          height: "100%",
         };

        $timeout(function(){
            //debugger;
            var myPlayerSearch = amp("azuremediaplayerSearchMian", myOptions);
            myPlayerSearch.src([
              {
                      "src": data.mediaURL,
                      "type": "application/vnd.ms-sstr+xml"
              }
            ]);
            amp("azuremediaplayerSearchMian").ready(function(){
              myPlayerSearch = this;
              myPlayerSearch.on("play", function () {
                $('#isnewMainVideo').addClass('playingVideo');
                
            });
            myPlayerSearch.on("pause", function () {
              $('#isnewMainVideo').removeClass('playingVideo');
          });
             // myPlayerSearch.play();
            });
          },1000);
        
      }
     //end of play video

     $scope.$emit('displayLeftPanel' , false);

    
    $scope.$on('onPopupOpen', function (evt, knowledge) {
      $scope.article = knowledge;
      $scope.knowledgeID = knowledge.articleID;
      $('#showArticle').modal('show');
    });

    var chunkedRequestWithPromise = function (search,doctype) {
      var deferred = $q.defer();
      var xhr = new XMLHttpRequest()
      
      var url = appConfig.SkillApi + 'api/SearchV2/SearchTrendingMedia?doctype='+doctype;
      if(search){
        url+= "&searchKeyword="+search;
      }
      xhr.onreadystatechange = function () {
        if (xhr.readyState === 4) {
            if (xhr.status === 200) {
                deferred.resolve(JSON.parse(this.response));
            } else {
                deferred.reject(xhr.statusText);
            }
        }
      };
      
      xhr.onprogress = function () {
        deferred.notify(xhr.responseText);
      }
      xhr.open("GET",url, true)
      var header= CryptoJS.AES.decrypt(localStorage["access-token"], appConfig.passwordKey).toString(CryptoJS.enc.Utf8);
      xhr.setRequestHeader("AccessToken",header);
      xhr.send();
      return deferred.promise;
    };
    function test(s) {
      var bracets=[]
      if(s[s.length]!=']' && s[s.length]!='}'){
        s+= '"'
      }
        for (var i = 0; i < s.length; i++) {
          if (s[i]=='[' || s[i]=='{') {
            bracets.push(s[i])
          } else if(s[i]==']' || s[i]=='}'){
            bracets.pop();
          }
        }
        bracets.reverse().forEach((e,i)=>{
          if(e=='['){
            s+= ']'
          }  
          else if(e=='{'){
            s+= '}'
          }
        });
        s=s.replace(/,\s*$/, "");
        return s
      }
    function getTrendingMedia(searchText , docType){
        $scope.trendingMediaLoaded = false;
        if(docType == undefined){
          docType = "All";
        }
        searchPageAPI.getMedia(searchText , docType).then(function (res) {
          $scope.trendingMedia = [];
          getMedia();
            res.forEach(function (media) {
                $scope.trendingMedia.push(media);
            });
           // debugger;
           $scope.trendingMediaLoaded = true;
          },()=>{},(sp)=>{         
            var jsonRaw=test(sp);
            var resp = JSON.parse(jsonRaw);
            $scope.trendingMedia = [];
            resp.forEach(function (media) {
              $scope.trendingMedia.push(media);
            });
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
        $scope.searchFilters.push({ "name": "All", "value": "All", "selected": true });
        for (kdType in appConfig.SearchFiltersForMedia) {
            if (appConfig.SearchFiltersForMedia.hasOwnProperty(kdType)) {
                var value = appConfig.SearchFiltersForMedia[kdType];
                //$scope.searchFilters.push({ "name": value, "value": kdType, "selected": true });

                //No filter should be selected for media according to requirement. 
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
    function getMedia(){
      $scope.mediaLoaded = false;
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

      if(queryUrl.isValidated == false || queryUrl.isValidated == "false" || queryUrl.isValidated == undefined ){
        vm.isValidated = false;
    }
    else{
      vm.isValidated = true;
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
     // $scope.category = [];
      
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
          "isShowReplications": vm.withReplication,
          "isShowHasAudio": vm.withAudio,
          "skip": skip,
          "take": $scope.pageSize,
          "sortField": "",
          "sortDir": "",
          "isExport": true,
          "searchTerm": queryUrl.searchKeyword
      }

        $scope.mediaList = [];
        searchPageAPI.getMedia($scope.searchData).then(function (res) {

                  if (res.data != null) {
                      $scope.mediaList = res.data;
                      $scope.found = res.total;
                      $scope.potentialValueTotal = res.potentialValueTotal;
                      $scope.valueRealizedTotal = res.valueRealizedTotal;
                      $scope.searchTime=res.seconds;
                     // $scope.hasDataLoaded = true;

                  
                     
                     if($scope.trendingMedia.length >0){
                      playMedia($scope.trendingMedia[0]);
                     }

                     if($scope.trendingMedia.length <=0 && $scope.mediaList.length > 0){
                      playMedia($scope.mediaList[0]);
                      $scope.mediaList.splice(0,1);
                     }
                     
                  }
                  else{
                     // $scope.hasDataLoaded = true;
                  }
                  $scope.mediaLoaded = true;
  
              
              });
    }

   $scope.pageChanged = function() {
    getMedia();
  }

   $scope.$on('onCategoryChange', function (event, categoryList) {
      $scope.category = categoryList;
      getMedia();
  });

  $scope.$on('onAdditionalFilterChange', function (event) {
    //   Tag.filter Tag.value
    getMedia();
    });

    $scope.$on('onSortingChange', function (event) {
       //   Tag.filter Tag.value
       getMedia();
       });

       $scope.$on('setDefaultDate', function (event, dates) {
        $scope.fromDate = dates.startDate;
        $scope.toDate = dates.endDate;
        if($rootScope.searchParams && $rootScope.searchParams.categoryName && $rootScope.searchParams.displayName){
          $scope.category = [{"displayName":$rootScope.searchParams.categoryName.substring(0, $rootScope.searchParams.categoryName.length - 1), "categoryName":$rootScope.searchParams.categoryName, "itemized":[{"itemName": $rootScope.searchParams.displayName, "itemId": $rootScope.searchParams.itemId, "itemGuid": null}]}];
      }
        getMedia();
    });
    $scope.$on('onMonthChange', function (event, dates) {
        $scope.fromDate = dates.startDate;
        $scope.toDate = dates.endDate;
        getMedia();
    });
    $scope.$on('onYearChange', function (event, dates) {
        $scope.fromDate = dates.startDate;
        $scope.toDate = dates.endDate;
        getMedia();
    });
    $scope.$on('onQuarterChange', function (event, dates) {
        $scope.fromDate = dates.fromDate;
        $scope.toDate = dates.toDate
        getMedia();
    });
    $scope.$on('customDateChange', function (event, dates) {
        $scope.fromDate = dates.fromDate;
        $scope.toDate = dates.toDate
        getMedia();
    });

    $scope.$on("onSearch", function(evt,searchText){ 
    //  alert("MEDIA EVENT FIRE");

        $scope.categoryName = $stateParams.docType;
        if($scope.categoryName == undefined){
            $scope.categoryName = "All"
            $location.search('docType', $scope.categoryName);
        }
        if(searchText)
        getTrendingMedia(searchText , $scope.categoryName);
       

    });

    function _onInit(){
       //DocType
        $scope.categoryName = $stateParams.docType;
      //  if($scope.categoryName == undefined){
      //      $scope.categoryName = "All"
      //      $location.search('docType', $scope.categoryName);
      //  }
       //SearchText
       $scope.searchText = $stateParams.searchKeyword;
       if($scope.searchText == undefined){    
            $scope.searchText = "";   
           $location.search('searchKeyword', $scope.searchText);
       }
       else{
           //If Search is not empty
           $location.search('searchKeyword', $scope.searchText);
       }
       $scope.$emit('onMediaLoad' , $scope.searchText , $scope.categoryName);
       $scope.setSelectedFilters();
       getTrendingMedia($scope.searchText , $scope.categoryName);
      // getMedia();

    }
    
    $scope.disableCollectionBtn = true;
      $scope.isCollectionSelected = false;
      $scope.checkCollection = function(){
        $scope.isCollectionSelected = false;
        $scope.ngModel.collections.forEach(function(item) {
          if(item.isChild == true) {
              $scope.isCollectionSelected = true;
          }
      });

      if($scope.isCollectionSelected){
        $scope.disableCollectionBtn = false;
      }
      else{
        $scope.disableCollectionBtn = true; 
      }

      }



  _onInit();
  
  $scope.OnInit = _onInit;
     
  }
  
})();
  