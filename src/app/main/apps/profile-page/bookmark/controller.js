(function () {
    'use strict';

    angular
        .module('app.ProfilePage')
        .controller('BookmarkController', BookmarkController);

    /** @ngInject */
    function BookmarkController($scope, AdsSettingAPI, profileAPI, UserProfileApi, LandingPageAPI, appConfig, $timeout,$location) {
        var vm = this;
        $scope.showMenu = false;
        vm.userRanking;
        $scope.cops = [];
        $scope.interests = [];
        $scope.events = [];
        vm.userInfo;
        $scope.pagename = "ProfilePage";
        $scope.eventsLoad = false;
        $scope.recommendedArticleLoad = false;
        $scope.unsubscribedArticles = [];
        $scope.knowledgeDocumentType = [];
        $scope.discussions = [];
        $scope.team = [];
        $scope.docTypemodel;
        $scope.Ads = null;

 


      
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

        function getActiveAds(){
            AdsSettingAPI.getAllActiveAds().then(function (res) {
                if(res && res.data && res.data.length > 0){
                    $scope.Ads = res.data[0];
                    console.log($scope.Ads);
                } else {
                    $scope.Ads = null;
                }
              });
        } 
        function setSelectedDocumentType(){
            var kdType;
            var queryUrl = $location.search();
            var docType = queryUrl.docType;
            for (kdType in appConfig.UserProfileKnowledgeDocumentTypesForReuse) {
                console.log(kdType);
                if (appConfig.UserProfileKnowledgeDocumentTypesForReuse.hasOwnProperty(kdType)) {
                    var value = appConfig.UserProfileKnowledgeDocumentTypesForReuse[kdType];
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
            getActiveAds();
            vm.userInfo = UserProfileApi.getUserInfo();
            $scope.$emit('onOtherMenuItemLoad' ,  vm.userInfo.userId);
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


        _onInit();

    }

})();
