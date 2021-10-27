/**
 * @author v.lugovksy
 * created on 16.12.2015
 */
(function () {
    'use strict';

    angular.module('app.landingPage')
        .directive('videoCard', videoCard);

    /** @ngInject */
    function videoCard() {

        return {
            restrict: 'E',
            scope: {
                media: '=',
                pagename : '='
            },
            controller: function ($scope , $timeout, $element, AdminSettingCoPApi, appConfig , CollectionApi, $log, logger) {
               // $scope.article.description = $scope.article.description.slice(0, 270)+"...";
              var scrollElement = "#id"+$scope.$id;
              console.log($scope.media);
              $scope.$watch(function() { return angular.element(scrollElement).is(':visible') }, function() {
                  playMedia($scope.media);
              });
             
              
              function playMedia(data){
                var myOptions = {
                  "nativeControlsForTouch": false,
                  controls: true,
                  autoplay: false,
                  width: "auto",
                  height: "100%",
                 }
                  $timeout(function(){
                    var myPlayerSearchCard = amp("azuremediaplayerSearchCard"+$scope.$id, myOptions);
                    myPlayerSearchCard.src([
                      {
                              "src": data.mediaURL,
                              "type": "application/vnd.ms-sstr+xml"
                      }
                    ]);
                    amp("azuremediaplayerSearchCard"+$scope.$id).ready(function(){
                      myPlayerSearchCard = this;
                     // myPlayerSearchCard.play();
                    });
                  }, 500);

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
                
              }
              $scope.showArticleShare = function (data) {
                $scope.$emit('modalShareOpen', data);
              }
              $scope.showKnowledgeArticle = function(knowledge){
                  $scope.$broadcast('onPopupOpen', knowledge);
                 $scope.$emit('onPopupOpen', knowledge);
             }
              //end of play the video
              $scope.$on('onLikeClick', function (evt, knowledge) {
                $scope.showKnowledgeArticle(knowledge);
                });


            },
            templateUrl: 'app/main/directives/video-card.html'
            
        };
    }
})();
