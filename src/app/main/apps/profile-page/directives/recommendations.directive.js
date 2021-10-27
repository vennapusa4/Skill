/**
 * @author v.lugovksy
 * created on 16.12.2015
 */
(function () {
    'use strict';

    angular.module('app.ProfilePage')
        .directive('recommendations', recommendations);

    /** @ngInject */
    function recommendations() {

        return {
            restrict: 'E',
            scope: {
                "article" : '='
            },
            controller: function ($scope,appConfig, CollectionApi, $log, logger , UserProfileApi,LandingPageAPI  ) {
                $scope.color;
                $scope.newDesc = $scope.article.description.replace(/(<([^>]+)>)/gi, "");
                $scope.arrcolors= appConfig.copCategoryColor;
               // $scope.article.description = $scope.article.description.slice(0, 60)+"...";
                
                function setArticleColor(){
                    if($scope.article.coPGroup == 'Operation & Technology'){
                        $scope.color = $scope.arrcolors[0];
                    }
                    else if($scope.article.coPGroup== 'Engineering & Maintenance'){
                        $scope.color = $scope.arrcolors[1];
                    }
                    else if($scope.article.coPGroup == 'Project Management'){
                        $scope.color = $scope.arrcolors[2];
                    }
                    else if($scope.article.coPGroup == 'Business Improvement'){
                        $scope.color = $scope.arrcolors[3];
                    }
                    else if($scope.article.coPGroup == 'Production, Development & Exploration'){
                        $scope.color = $scope.arrcolors[4];
                    }
                    else if($scope.article.coPGroup == 'HSE'){
                        $scope.color = $scope.arrcolors[5];
                    }
                    else if($scope.article.coPGroup == 'Business Enablers'){
                        $scope.color = $scope.arrcolors[6];
                    }
                    else if($scope.article.coPGroup == 'Technical Data'){
                        $scope.color = $scope.arrcolors[7];
                    }
                }
                $scope.showAddToCollection = function (kdId) {

                    $scope.kdcollectionsModel = {};
                    $scope.kd_id = kdId;
                    CollectionApi.getCollectionsByKdId({ id: kdId }, function (response) {
                      $scope.kdcollectionsModel = response;
                      $scope.kdcollectionsModel.kd_id = kdId;
                      $log.info('Retrieved collections by knowledgeId successfully.');

                      $scope.$emit('modalOpen', $scope.kdcollectionsModel); // going up!
                    },
                      function (response) {
                        logger.error(response.data.errorMessage);
                      });
                  }
          
                  $scope.SavedKdToColection = function () {
                    CollectionApi.closeForm("#CollectionPopup");
                    $scope.kdcollectionsModel = {};
                    //load lại icon ở đây
                    toastr.success('Added to collections', 'SKILL')
                  }

                  $scope.requestToSubscribe = function(copID){
                    $scope.userInfo = UserProfileApi.getUserInfo(); 

                    $scope.postData = {
                        userId :   $scope.userInfo.userId,
                        copId: copID
                    }

                    LandingPageAPI.RequestToSubscribeToCop($scope.postData).then(function (data) {
                      
                        $scope.$emit('requestSent', "success");
                     },function (error) {
                       logger.error(error);
                       $scope.$emit('requestSent', "error");
                     });


                 }

                setArticleColor();
            },
            templateUrl: 'app/main/apps/profile-page/directives/recommendations.html'
            
        };
    }
})();
