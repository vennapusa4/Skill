/**
 * @author v.lugovksy
 * created on 16.12.2015
 */
(function () {
    'use strict';

    angular.module('app.expertInterview')
        .directive('skillBoxExpertInterview', skillBoxExpertInterview);

    /** @ngInject */
    function skillBoxExpertInterview() {

        return {
            restrict: 'AE',
            scope: {
                data: '=',
            },
            controller: function ($scope, $state) {
                $scope.attachment = {};

                function _playVideos() {
                    return false;
                    $scope.attachment = $scope.data.videos[0]; // ToDo: Play Listing

                    $scope.$element.find("#mediaplayerAttachmentCardview").parent().empty().append('<div id="mediaplayerAttachmentCardview" style="height:300px"></div>');
                    $scope.$element.find("#mediaplayerAttachmentCardview").kendoMediaPlayer({
                        autoPlay: false,
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
            templateUrl: 'app/main/apps/expert-interview/_directives/skill-box-expert-interview.html',
            link: function ($scope, $element) {
                $scope.$element = $element;
            }
        };
    }
})();
