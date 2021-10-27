/**
 * @author v.lugovksy
 * created on 16.12.2015
 */
(function () {
  'use strict';

  angular.module('app.knowledgeDiscovery')
    .directive('skillKnowledgeDiscoveryListingVideo', skillKnowledgeDiscoveryListingVideo);

  /** @ngInject */
  function skillKnowledgeDiscoveryListingVideo() {
    return {
      restrict: 'AE',
      replace: true,
      scope: {
        kdId: '<',
      },
      controller: function ($scope, KnowledgeDocumentApi) {

        var myOptions = {
          "nativeControlsForTouch": false,
          controls: true,
          autoplay: false,
          width: "640",
          height: "400",
        }
        $scope.videos = null;

        var myPlayer = amp("azuremediaplayer", myOptions);
        
        function playMedia(index){
          var video = $scope.videos[index];
          (video);
          myPlayer.src([
            {
                    "src": video.source,
                    "type": "application/vnd.ms-sstr+xml"
            }
          ]);
          amp("azuremediaplayer").ready(function(){
            myPlayer = this;
           // myPlayer.play();
          });
        }

        function onChange() {
          var index = this.select().index();
          playMedia(index);
        }

           KnowledgeDocumentApi.getVideos($scope.kdId).then(function (response) {
            if (response && response.length > 0) {
              if (response.length > 1) {
                $scope.isShowVideosList = true;
              }
              $scope.videos = response;
              

              var templateHtml = $("#templateVideoListing").html();
              $("#listView").kendoListView({
                    dataSource: $scope.videos,
                    selectable: true,
                    scrollable: true,
                    template: kendo.template(templateHtml),
                    change: onChange
              });
                
              playMedia(0);
              // $scope.videos = new kendo.data.DataSource({
              //   data: response
              // });

              //_initVideo();
              // }
            }
          });

        // $scope.videos = null;
        // $scope.isShowVideosList = false;
        // function _initVideo() {
        //   $("#mediaplayer").kendoMediaPlayer({
        //     autoPlay: true
        //   });

        //   var templateHtml = $("#templateVideoListing").html();

        //   $("#listView").kendoListView({
        //     dataSource: $scope.videos,
        //     selectable: true,
        //     scrollable: true,
        //     template: kendo.template(templateHtml),
        //     change: onChange,
        //     dataBound: onDataBound
        //   });
        // }

        // function onChange() {
        //   var index = this.select().index();
        //   var dataItem = this.dataSource.view()[index];
        //   $("#mediaplayer").data("kendoMediaPlayer").media(dataItem);
        // }

        // function onDataBound() {
        //   this.select(this.element.children().first());
        // }

        // function _getExpertVideo() {
        //   $scope.isShowVideosList = false;
        //   KnowledgeDocumentApi.getVideos($scope.kdId).then(function (response) {
        //     if (response && response.length > 0) {
        //       if (response.length > 1) {
        //         $scope.isShowVideosList = true;
        //       }
        //       // var cloneRes = response;
        //       // var cloneRes = [];
        //       // cloneRes.push(response[0]);

        //       // if (response.length > 1) {
        //       //     $("#mediaplayer").kendoMediaPlayer({
        //       //         autoPlay: true,
        //       //         navigatable: true,
        //       //         media: response[0]
        //       //     });

        //       //     $("#mediaplayer").data("kendoMediaPlayer").media(response[0]);
        //       // } else {
        //       $scope.videos = new kendo.data.DataSource({
        //         data: response
        //       });

        //       _initVideo();
        //       // }
        //     }
        //   });
        // };

        // $scope.getExpertVideo = _getExpertVideo;
        // $scope.getExpertVideo();
      },
      templateUrl: 'app/main/apps/knowledge-discovery/_directives/skill-knowledge-discovery-listing-video.html',
      link: function ($scope, $element) {
        $scope.element = $($element);
      }
    };
  }
})();
