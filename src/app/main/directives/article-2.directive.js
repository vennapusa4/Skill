/**
 * @author v.lugovksy
 * created on 16.12.2015
 */
(function () {
    'use strict';

    angular.module('app.landingPage')
        .directive('article2', article2);

    /** @ngInject */
    function article2() {

        return {
            restrict: 'E',
            scope: {
              article: '=',
              pagename: '='
            },
            controller: function ($scope , $element, AdminSettingCoPApi, appConfig , CollectionApi, $log, logger) {
                $scope.showDropdown = false;
                $scope.knowledgeID = 0;
                $scope.newDesc = $scope.article.description.replace(/(<([^>]+)>)/gi, "");
                $scope.color;
                $scope.arrcolors= appConfig.copCategoryColor;
               // $scope.article.description = $scope.article.description.slice(0, 270)+"...";

               $scope.showKnowledgeArticle = function(knowledge){
                // console.log(knowledgeId);
                 //$scope.knowledgeID =  knowledgeID
                 $scope.$broadcast('onPopupOpen', knowledge);
                 $scope.$emit('onPopupOpen', knowledge);
             }

               $scope.$on('onLikeClick', function (evt, knowledge) {
                $scope.showKnowledgeArticle(knowledge);
                });
               $scope.showArticleShare = function (data) {
                $scope.$emit('modalShareOpen', data);
              }
              $scope.SavedKdToColection = function () {
                CollectionApi.closeForm("#CollectionPopup");
                $scope.kdcollectionsModel = {};
                //load lại icon ở đây
                toastr.success('Added to collections', 'SKILL')
              }
                $scope.toggleDropdown = function () {
                    $scope.showDropdown = !$scope.showDropdown;
                    var myElements = angular.element( document.querySelectorAll('.item'));
                    if($scope.showDropdown) {
                        myElements.addClass('isChoosing');
                    } else {
                        myElements.removeClass('isChoosing');
                    }
                }

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

                setArticleColor();
                $scope.setArticleColor = setArticleColor;

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


            

            },
            templateUrl: 'app/main/directives/article-2.html'
            
        };
    }
})();
