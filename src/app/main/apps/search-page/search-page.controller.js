(function () {
    'use strict';
  
    angular
        .module('app.SearchPage')
        .controller('SearchPageController', SearchPageController);
  
    /** @ngInject */
    function SearchPageController($scope ,$timeout , profileAPI , UserProfileApi , $state , CollectionApi, $log, $location,searchPageAPI, $stateParams,$window,KnowledgeDiscoveryApi,KnowledgeDocumentApi,$rootScope ) {
        var vm = this;

        
        $scope.nowPlayingTrendingMedia = undefined;
        $scope.showSearch = false;
        $scope.viewSearch = false;

        function playMedia(data, isPlay){
          $scope.nowPlayingTrendingMedia = data;

          if(data){
            var myOptions = {
              "nativeControlsForTouch": false,
              controls: true,
              autoplay: false,
              width: "100%",
              height: "auto",
             }
            $timeout(function(){
              var myPlayerSearchTrending = amp("azuremediaplayerSearch", myOptions);
              myPlayerSearchTrending.src([
                {
                        "src": data.mediaURL,
                        "type": "application/vnd.ms-sstr+xml"
                }
              ]);
              amp("azuremediaplayerSearch").ready(function(){
                myPlayerSearchTrending = this;
                if(isPlay){
                  myPlayerSearchTrending.play();
                }
              });
            },500); 
           
          }
        }
        
        $scope.mediaType = 'audio';
        function getValue(){
          return window.localStorage.getItem('isSearch');
      }
      
      $scope.$watch(getValue, function(newValue){
          if (newValue === "true"){
              console.log('asdasd');
              $scope.viewSearch = true;
          } else {
            $scope.viewSearch = false;
            console.log('tryrtytr');
          }
      });
        $scope.searchText = null;
        $scope.categoryCountList= [
          {
              "name" : "All",
              "count":0
          },
          {
            "name" : "Lessons Learnt",
            "count":0
          },
          {
            "name" : "Best Practices",
            "count":0
         },
         {
            "name" : "Publications",
            "count":0
         },
         {
            "name" : "Technical Alerts",
            "count":0
         },
         {
            "name" : "Collections",
            "count":0
         },
         {
          "name" : "Community of Practice",
          "count":0
       },
        {
           "name" : "People",
           "count": 0
         }
        ]
      $scope.searchText;
      $scope.searchTrendingMedia = [];
      $scope.displayPanel = false;
      $scope.showSmallMenu = false;
      $scope.closeSmallMenu = function () {
        $scope.showSmallMenu = false;
      }
      vm.isEndorsed = false;
      vm.isValidated = false;
      vm.withVideo = false;
      vm.withValue = false;
      vm.withReplication = false;
      vm.isValidated = false;
      vm.withAudio = false;
      $scope.pagename = "SearchPage";
      $scope.mediaLoaded = false;
      vm.ShareEmails = [];
      $scope.choosenKnowlegde = {};
      $scope.isKnowledge = false;
      $scope.isDeepSearch = false;
      $scope.disabledDeepSearch = true;
      $scope.onDeepSearchChange = function(value){
     
      if(value ==true){
        $scope.isDeepSearch = false;
      }
      else{
        $scope.isDeepSearch = true;
      }
        $scope.$broadcast('onDeepSearch' ,  $scope.isDeepSearch);
      }
      $scope.$on('displayLeftPanel', function (event, bool) {
      //  $scope.displayPanel = bool;
     });
      
      function setDefaultView(){
        if ($state.current.name === 'app.SearchPage') {
            $scope.categoryName = $scope.categories[0].name;
             $state.go('app.SearchPage.knowledge', {docType : "All"});
        }
      }

      function getAllCategoryCount(searchText) {
        $scope.categoryCountList = $scope.categories= [
          {
              "name" : "All",
              "count":0
          },
          {
            "name" : "Lessons Learnt",
            "count":0
          },
          {
            "name" : "Best Practices",
            "count":0
         },
         {
            "name" : "Publications",
            "count":0
         },
         {
            "name" : "Technical Alerts",
            "count":0
         },
         {
            "name" : "Collections",
            "count":0
         },
         {
          "name" : "Community of Practice",
          "count":0
         },
         {
           "name" : "People",
           "count": 0
         }
        ];
        searchPageAPI.getCategoryCount(searchText).then(function (res) {
          $scope.categoryCountList=[];
            res.forEach(function (category) {
                $scope.categoryCountList.push(category);
            });
            $scope.$broadcast('onLeftMenuLoad', $scope.categoryCountList);
        });
     }

   


      $scope.redirectKnowledge = function(knowledge){
          // $scope.knowledgeID =  knowledge.articleID;
          // $scope.article = knowledge;
          var redirect = $state.href('app.knowledgeDiscovery.knowledgeDetail', { id: knowledge.articleID });
          $window.open(redirect, '_blank');
          // $scope.$broadcast('onPopupOpen', knowledge);
          // $scope.$emit('onPopupOpen', knowledge);
          // $('#showArticle').modal('show');

      }
      $scope.$on('onPopupOpen', function (evt, knowledge) {
        console.log("coming in on popup open in knowledge"+knowledge)
        $scope.article = knowledge;
        $scope.knowledgeID = knowledge.articleID;
        $('#showArticle').modal('show');
    });

    $scope.$on('modalShareOpen', function (event, data) {
        $scope.choosenKnowlegde = {};
        console.log("$scope.choosenKnowlegde in main controller"+ $scope.choosenKnowlegde);
        $scope.choosenKnowlegde = data;
        $('#ModalShare').modal('show');
      });

    function shareUsers() {
      vm.EmailSources = {
        placeholder: "Select user...",
        dataTextField: "PersonName",
        dataValueField: "Id",
        minLength: 4,
        delay: 500,
        valuePrimitive: true,
        dataSource: new kendo.data.DataSource({
          serverFiltering: true,
          transport: {
            read: function (options) {
              return KnowledgeDiscoveryApi.getEmails(options)
            }
          }
        }),
        open: function (e) {
          setTimeout(function () {
            e.sender.list.closest('.k-animation-container').find('.k-list-container').addClass('multiselect_panel no_grouping');
          }, 100);
        },
        template: '<strong>#: data.PersonName #</strong><br/><small>#: data.PersonDept #</small>',
        select: function (e) {
          var index = _.findIndex(vm.ShareEmails, function (item) {
            return item.value == e.dataItem.Id
          });
          if (index == -1) {
            $scope.$apply(function () {
              vm.ShareEmails.push({
                value: e.dataItem.Id,
                label: e.dataItem.PersonName ? e.dataItem.PersonName : e.dataItem.Id
              });
            });
          }
        },
      };
      }

  $scope.postShare = function() {
      var shareRequest = {
        knowledgeDocumentId: $scope.choosenKnowlegde.articleID,
        taggingTypeName: 'Share',
        taggingTypeValue: true
      };
      KnowledgeDocumentApi.api.postTagging.save({}, shareRequest,
        function (response) {    
          $rootScope.$broadcast('UpdateInterest');
        },
        function (response) {
          logger.error(response.data.errorMessage);
        });

      if (vm.ShareEmails && vm.ShareEmails.length > 0) {
        var postData = {
          title: $scope.choosenKnowlegde.title,
          kDId: $scope.choosenKnowlegde.articleID,
          lstMailShare: vm.ShareEmails
        };
        KnowledgeDiscoveryApi.shareKnowledgeDiscovery(postData).then(function (response) {
          if (response && response.success) {
            for(var element in vm.featuredArticles) {
              if(vm.featuredArticles[element].articleID === $scope.choosenKnowlegde.articleID) {
                  vm.featuredArticles[element].shareCount = vm.featuredArticles[element].shareCount + vm.ShareEmails.length;
              }
          }
          for(var element in vm.articles) {
              if(vm.articles[element].articleID === $scope.choosenKnowlegde.articleID) {
                  vm.articles[element].shareCount = vm.articles[element].shareCount + vm.ShareEmails.length;
              }
          }
            vm.ShareEmails = [];
          }
          $rootScope.$broadcast('UpdateInterest');
          $state.transitionTo($state.current, $stateParams, {reload: true});
         // $('#ModalShare').modal('close');
          $('body').removeClass('modal-open');
          $('.modal-backdrop').remove();
        }, function (response) {
          logger.error(response.data.errorMessage);
        });
      }
    };
     function getSearchTrendingMedia(searchText , docType){
        $scope.mediaLoaded = false;
        searchPageAPI.getTrendingMedia(searchText , docType).then(function (res) {
            $scope.searchTrendingMedia = [];
            $scope.nowPlayingTrendingMedia = undefined;

            res.forEach(function (media) {
                $scope.searchTrendingMedia.push(media);
            });
            $scope.mediaLoaded = true;
            $timeout(
              function(){
                if($scope.searchTrendingMedia != undefined && $scope.searchTrendingMedia.length > 0){
                  playMedia($scope.searchTrendingMedia[0], false);
                }
              }
            , 500);
          });
     }

     function _Search(){
      $scope.searchText = $("#txtSearchKeyword").val();
      if($scope.searchText == "" || $scope.searchText == null){
        $scope.displayPanel = false;
        $scope.disabledDeepSearch = true;
        if($state.current.name == "app.SearchPage.people"){
          $scope.displayPanel = false;
          $scope.$broadcast("onPeopleSearch",{searchText: $scope.searchText}); 
        }
      }
      else{
        if($state.current.name == "app.SearchPage.people"){
          $scope.displayPanel = false;
          $scope.$broadcast("onPeopleSearch",{searchText: $scope.searchText}); 
        }
        else{
          $scope.displayPanel = false;
        }
        $scope.disabledDeepSearch = false;
      }
        getAllCategoryCount($scope.searchText);
        
        getSearchTrendingMedia($scope.searchText , $scope.categoryName);

        $state.go($state.current, {docType: $scope.categoryName,searchKeyword: $scope.searchText}, {notify: false}) 
        console.log($state.current);
       // $location.skipReload().search('searchKeyword', $scope.searchText);
        $scope.$broadcast("onSearch",{searchText: $scope.searchText , deepSearchFlag: $scope.isDeepSearch});
        
     }

     $scope.$on('onKnowledgeLoad', function (event, searchText, docType) {
      $scope.searchText = searchText;
      $scope.categoryName =docType;
      $scope.isKnowledge = true;
      if(searchText == null || searchText == ""){
        $scope.displayPanel = false;
      }
       $("#txtSearchKeyword").val(searchText);
      getAllCategoryCount($scope.searchText);
      getSearchTrendingMedia($scope.searchText , $scope.categoryName);
     });
     
     $scope.$on('onCoPLoad', function (event, searchText, docType) {
      $scope.searchText = searchText;
      $scope.categoryName =docType;
      $scope.isKnowledge = false;
      // if(searchText == null || searchText == ""){
      //   $scope.displayPanel = true;
      // }
      $scope.displayPanel = false;
       $("#txtSearchKeyword").val(searchText);
       getAllCategoryCount($scope.searchText);
       getSearchTrendingMedia($scope.searchText , $scope.categoryName);
     });

     $scope.$on('onCollectionLoad', function (event, searchText) {
      $scope.searchText = searchText;
      
      $scope.isKnowledge = false;
      // if(searchText == null || searchText == ""){
      //   $scope.displayPanel = true;
      // }
      $scope.displayPanel = false;
       $("#txtSearchKeyword").val(searchText);
       getAllCategoryCount($scope.searchText);
       getSearchTrendingMedia($scope.searchText , $scope.categoryName);
     });

     $scope.$on('onMediaLoad', function (event, searchText , docType) {
      $scope.searchText = searchText;
      $scope.categoryName =docType;
      $scope.isKnowledge = false;
      $scope.displayPanel = false;
     
       $("#txtSearchKeyword").val(searchText);
       getAllCategoryCount($scope.searchText);
       getSearchTrendingMedia($scope.searchText , $scope.categoryName);
     });

     $scope.$on('onPeopleLoad', function (event, searchText , docType) {
      $scope.searchText = searchText;
      $scope.categoryName =docType;
      $scope.isKnowledge = false;
      $scope.displayPanel = false;
       $("#txtSearchKeyword").val(searchText);
       getAllCategoryCount($scope.searchText);
      //  getSearchTrendingMedia($scope.searchText , $scope.categoryName);
     });

     function _PlayMediaFile(data){
       playMedia(data, true);
     }


     $scope.showMediaInNewTab = function(){

          var url =$location.url();
        
         var docType;
          var searchParam = "";
          var queryUrl = $location.search();
          

            docType = queryUrl.docType;
            if(queryUrl.searchKeyword != undefined){
              searchParam = queryUrl.searchKeyword
            }
            
          $window.open($state.href('app.SearchPage.media', { "docType" : docType , "searchKeyword":searchParam }), '_blank');
         // $state.go('app.SearchPage.media', { "docType": docType, "searchKeyword":searchParam }, { reload : true, newtab : true, target : "_blank" });
     }

        $scope.removeMainSearch = function(){
          $scope.searchText = "";
          $("#txtSearchKeyword").val($scope.searchText);
         // $location.search('searchKeyword', $scope.searchText);
          //$state.transitionTo($state.current, $stateParams, {reload: true});
          
        // $state.go($state.current, {docType: $scope.categoryName}) 
        $state.go($state.current, {docType: $scope.categoryName,searchKeyword: $scope.searchText}, {notify: false}) 
        $scope.$broadcast("onRemoveSearch");
        }

        function _onInit(){
          var articleID;
          var queryUrl = $location.search();
          
          var search = queryUrl.searchKeyword;

          if(search == undefined){
            $scope.displayPanel = false;
            $scope.disabledDeepSearch = true;
          }
          //$state.current.title == "People"
          else{
            $scope.disabledDeepSearch = false;
          }
          articleID = queryUrl.knowledgeID;

        //  if(articleID == undefined || articleID == ""){
            setDefaultView();
            $scope.categoryName = $scope.categoryCountList[0].name;
          //  getAllCategoryCount($scope.searchText);
            getSearchTrendingMedia($scope.searchText , $scope.categoryName);
        //  }
            
        }

        _onInit();
        shareUsers();
        $scope.OnInit = _onInit;
        $scope.Search = _Search;
        $scope.PlayMediaFile = _PlayMediaFile;
    
    }
  
  })();
  