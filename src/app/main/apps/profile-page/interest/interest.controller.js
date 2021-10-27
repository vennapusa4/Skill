(function () {
  'use strict';

  angular
    .module('app.ProfilePage')
    .controller('InterestController', InterestController);

  /** @ngInject */
  function InterestController($scope, profileAPI, UserProfileApi, appConfig, $timeout,$stateParams,$location ) {
    var vm = this;
    $scope.showMenu = false;
    vm.userRanking;
    $scope.cops = [];
    $scope.interests = [];
    $scope.events = [];
    $scope.eventsLoad = false;
    $scope.discussionLoad = false;
    $scope.recommendedArticleLoad = false;
    vm.userInfo;
    $scope.pagename = "ProfilePage";
    $scope.discussionTooltipshow2 = false;
    $scope.unsubscribedArticles = [];
    $scope.discussions = [];
    $scope.discussionData;
    $scope.totalDiscussions;
    $scope.interestId =  $stateParams.interestId;
    $scope.docTypemodel;
    function getUpcomingEvents(){
        profileAPI.getUpcomingEvents().then(function (res) {
            if (res != null || res != "") {
                res.forEach(function (event) {
                    $scope.events.push(event);
                });
            }
            $scope.eventsLoad = true;

        });
    }
    function getRecommendedArticles(){
        profileAPI.getUnSubscribedArticles().then(function (res) {
            if (res != null || res != "") {
                res.forEach(function (event) {
                    $scope.unsubscribedArticles.push(event);
                });
            }
            $scope.recommendedArticleLoad = true;
        });
    }
    function getDiscussions() {
        $scope.discussionData = {
            copId: '',
            userId: vm.userInfo.userId,
            page: vm.discussionPageIndex
          }
      
          profileAPI.getDiscussionsByCopId($scope.discussionData).then(function (res) {
            $scope.totalDiscussions = res.total;
            $scope.discussions = [];
            if(res != null && res.length !=0){
                res.discussions.forEach(function (discussion) {
                    $scope.discussions.push(discussion);
                });
                if (res.total > 0) {
                    vm.discussionSkip = (vm.discussionPageIndex - 1) * vm.discussionPageSize,
                      vm.discussionfromPos = vm.discussionSkip + 1;
                    vm.discussiontoPos = vm.discussionfromPos + res.total - 1;
                  }
                  else {
                    vm.discussionfromPos = 0;
                    vm.discussiontoPos = 0;
                  }
            }
            $scope.discussionLoad = true;
        });
    }
    $scope.knowledgeDocumentType = [];
    function setSelectedDocumentType(){
        var kdType;
        var queryUrl = $location.search();
        var docType = queryUrl.docType;
        for (kdType in appConfig.UserProfileKnowledgeDocumentTypes) {
            console.log(kdType);
            if (appConfig.UserProfileKnowledgeDocumentTypes.hasOwnProperty(kdType)) {
                var value = appConfig.UserProfileKnowledgeDocumentTypes[kdType];

                if(value == docType){
                    $scope.knowledgeDocumentType.push({ "name": value, "value": kdType, "selected": true });
                    $scope.docTypemodel = kdType;
                }
                else{
                    if(docType == undefined){
                        $scope.docTypemodel = "All";
                    }
                    $scope.knowledgeDocumentType.push({ "name": value, "value": kdType, "selected": false });
                } 
            }
        }
    }

    $scope.getTabValue = function(value){
        console.log("selected tab" + value);
        $location.search('docType', value);
    }


    function _onInit() {
        vm.userInfo = UserProfileApi.getUserInfo();
        $scope.$emit('onOtherMenuItemLoad' , vm.userInfo.userId);
         
        vm.fromPos = 0;
        vm.toPos = 0;

        /* PAGING */
        vm.pageIndex = 1;
        vm.pageSize = 10;
        vm.maxSize = 5;
        vm.setPage = function (pageNo) {
            vm.pageIndex = pageNo;
        };

        vm.discussionfromPos = 0;
        vm.discussiontoPos = 0;
  
        /* PAGING */
        vm.discussionPageIndex = 1;
        vm.discussionPageSize = 10;
        vm.discussionMaxSize = 5;
        vm.discussionSetPage = function (pageNo) {
            vm.discussionPageIndex = pageNo;
        };

        getUpcomingEvents();
        getRecommendedArticles();
        //Commenting Out the Discussion WorkItem # 142190
        //getDiscussions();
        setSelectedDocumentType();
    }

  
    $scope.$on('requestSent', function (event, status) {
        if (status == "success") {
            logger.success("Request Sent successfully!");

            $timeout(function () {
                $scope.unsubscribedArticles = [];
                profileAPI.getUnSubscribedArticles().then(function (res) {
                    if (res != null || res != "") {
                        res.forEach(function (event) {
                            $scope.unsubscribedArticles.push(event);
                        });
                    }
                });
            }, 3000);


        }
    });

    vm.discussionPageChanged = function (){
        $scope.getDiscussions();
    }

    _onInit();
  }

})();
