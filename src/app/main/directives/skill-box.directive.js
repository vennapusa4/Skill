/**
 * @author v.lugovksy
 * created on 16.12.2015
 */
(function () {
  'use strict';

  angular.module('app.home')
    .directive('skillBox', skillBox);

  /** @ngInject */
  function skillBox(CollectionApi, $log, logger) {

    return {
      restrict: 'AE',
      scope: {
        data: '=',
      },
      controller: function ($scope, $state) {
        $scope.$state = $state;
        $scope.kd_id = 0;
        $scope.showAddToCollection = function (kdId) {
          $scope.kdcollectionsModel = {};
          $scope.kd_id = kdId;
          CollectionApi.getCollectionsByKdId({ id: kdId }, function (response) {
            $scope.kdcollectionsModel = response;
            $scope.kdcollectionsModel.kd_id = kdId;
            $log.info('Retrieved collections by knowledgeId successfully.');
          },
            function (response) {
              logger.error(response.data.errorMessage);
            });
        }

        $scope.SavedKdToColection = function () {
          CollectionApi.closeForm("#AddCollection" + $scope.kd_id);
          $scope.kdcollectionsModel = {};
          //load lại icon ở đây
          toastr.success('Added to collections', 'SKILL')
        }

        $scope.kmlFormatter = function (num, tofixed) {
          var result = num > 999 ? (num / 1000).toFixed(3) + 'k' : num;
          if (num >= 1000000000) {
            return (num / 1000000000).toFixed(3) + 'b';
          } else {
            if (num >= 1000000) {
              return (num / 1000000).toFixed(3) + 'm';
            } else {
              if (num >= 1000) {
                return (num / 1000).toFixed(3) + 'k';
              } else {
                return num;
              }
            }
          }
        }

        function _playVideos() {
          return false;
          $scope.attachment = $scope.data.videos[0]; // ToDo: Play Listing
          $scope.$element.find("#mediaplayerAttachmentCardview").parent().empty().append('<div id="mediaplayerAttachmentCardview" style="height:300px"></div>');
          $scope.$element.find("#mediaplayerAttachmentCardview").kendoMediaPlayer({
            autoPlay: true,
            navigatable: true,
            media: {
              title: $scope.attachment.fileName,
              source: $scope.attachment.attachmentUrl
            }
          });
          $scope.hasplay = 'video';
          $scope.$element.find('#ModalVideoAudioAttachmentCardView').modal('show');
        }

        function _pauseAudioOrVideo() {
          if ($scope.hasplay == 'video') {
            var mediaPlayer = $scope.$element.find("#mediaplayerAttachmentCardview").data("kendoMediaPlayer");
            mediaPlayer.pause();
          }

          if ($scope.hasplay == 'audio') {
            $scope.$element.find('.audio-section audio').each(function (item, i) {
              this.pause();
            });
          }

          $scope.hasplay = null;
        }

        $scope.playVideos = _playVideos;
        $scope.pauseAudioOrVideo = _pauseAudioOrVideo;
      },
      templateUrl: 'app/main/directives/skill-box.html',
      link: function ($scope, $element) {
        $scope.$element = $element;
      }
    };
  }
})();
