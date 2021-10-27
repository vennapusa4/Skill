/**
 * @author v.lugovksy
 * created on 16.12.2015
 */
(function () {
    'use strict';

    angular.module('app.ProfilePage')
        .directive('expertInterview', expertInterview);

    /** @ngInject */
    function expertInterview() {

        return {
            restrict: 'E',
            scope: {
                id: "=",

            },
            controller: function ($scope,profileAPI,$rootScope,ExpertInterviewApi) { 
                var vm = this;  
                $scope.profile= {};
                $scope.interview= {};
                $scope.comments = [];
                $scope.totalComments;
                vm.expertInterview = {};
                vm.expertInterviewId = $scope.id;

                if($scope.id != 0 && $scope.id !=  undefined){
                        profileAPI.getExpertInterviewDetail($scope.id).then(function (res) {
                            vm.expertInterview = res;
                            if(res != null){
                                $scope.interview = res;
                                $('#showArticle_' + $scope.id).modal('show');
                                console.log( $scope.interview);
                            }
                     
                        });
                        profileAPI.getExpertInterviewProfile($scope.id).then(function (res) {
                            if(res != null){
                                $scope.profile = res;
                            }
                            console.log($scope.profile);
                        });
                        // profileAPI.getExpertInterviewProfile($scope.id).then(function (res) {
                        //     if(res != null){
                        //         $scope.profile = res;
                        //     }
                        // });
                        
                        

                        
                }
                function calculateTotalComment(total) {
                    vm.expertInterview.totalCommentsCount = total;
                  }
                  $scope.postLike = function(isLiked) {
                    vm.expertInterview.isLiked = isLiked;
                    vm.expertInterview.totalLikesCount = isLiked ? ++vm.expertInterview.totalLikesCount : --vm.expertInterview.totalLikesCount;
                    var likeRequest = { expertInterviewId: vm.expertInterviewId, taggingTypeName: 'Like', taggingTypeValue: vm.expertInterview.isLiked };
                    ExpertInterviewApi.api.postTagging.save({}, likeRequest,
                      function (response) {
                        $rootScope.$broadcast('UpdateInterest');
                      }, function (response) {
                        logger.error(response.data.errorMessage);
                      });
                  };
              
                  $scope.postSave = function(isSavedToLibrary) {
                    vm.expertInterview.isSavedToLibrary = isSavedToLibrary;
                    vm.expertInterview.totalSaveLibraryCount = isSavedToLibrary ? ++vm.expertInterview.totalSaveLibraryCount : --vm.expertInterview.totalSaveLibraryCount;
                    var saveRequest = { expertInterviewId: vm.expertInterviewId, taggingTypeName: 'Save', taggingTypeValue: vm.expertInterview.isSavedToLibrary };
                    ExpertInterviewApi.api.postTagging.save({}, saveRequest,
                      function (response) {
                        $rootScope.$broadcast('UpdateInterest');
                      }, function (response) {
                        logger.error(response.data.errorMessage);
                      });
                  };
              
                  function postShare(isShared) {
                    vm.expertInterview.isShared = isShared;
                    // ToDo: QUANGNV8 issue on old code of KnowledgeDiscovery
                    ExpertInterviewApi.postShare(vm.expertInterviewId, vm.expertInterview.isShared).then(
                      function (response) {
                        vm.expertInterview.totalShareCount = vm.expertInterview.totalShareCount + vm.ShareEmails.length;
                        $rootScope.$broadcast('UpdateInterest');
                      }, function (response) {
                        logger.error(response.data.errorMessage);
                      });
              
                    if (vm.ShareEmails && vm.ShareEmails.length > 0) {
                      var postData = {
                        title: vm.expertInterview.title,
                        expertInterviewId: vm.expertInterviewId,
                        lstMailShare: vm.ShareEmails
                      };
                      ExpertInterviewApi.shareToEmail(postData).then(function (response) {
                        if (response && response.success) {
                          vm.ShareEmails = [];
                        }
                        $rootScope.$broadcast('UpdateInterest');
                      }, function (response) {
                        logger.error(response.data.errorMessage);
                      });
                    }
                  };
              
                  function postView() {
                    var viewRequest = { expertInterviewId: vm.expertInterviewId, taggingTypeName: 'View', taggingTypeValue: true };
                    ExpertInterviewApi.api.postTagging.save({}, viewRequest,
                      function (response) {
                        vm.expertInterview.totalViewsCount += 1;
                      }, function (response) {
                        logger.error(response.data.errorMessage);
                      });
                  };
                  $rootScope.$on('updateExpertInterviewTotalLikeCount', function (evt, data) {
                    vm.expertInterview.isLiked = data;
                  });
              
                  $rootScope.$on('updateExpertInterviewTotalBookmarkCount', function (evt, data) {
                    vm.expertInterview.isSavedToLibrary = data;
                  });

                 // vm.postLike = postLike;
                //  vm.postSave = postSave;
                  vm.postShare = postShare;
                  $rootScope.$on('updateExpertInterviewTotalLikeCount', function (evt, data) {
                    vm.expertInterview.isLiked = data;
                  });
              
                  $rootScope.$on('updateExpertInterviewTotalBookmarkCount', function (evt, data) {
                    vm.expertInterview.isSavedToLibrary = data;
                  });
               
            },
            templateUrl: 'app/main/apps/profile-page/directives/expert-interview.html'
            
        };
    }
})();
