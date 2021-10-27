/**
 * @author v.lugovksy
 * created on 16.12.2015
 */
(function () {
    'use strict';

    angular.module('app.expertInterview')
        .directive('skillAttachmentBoxExpertInterview', skillAttachmentBoxExpertInterview);

    /** @ngInject */
    function skillAttachmentBoxExpertInterview() {
        return {
            restrict: 'AE',
            scope: {
                expertInterviewId: '<',
            },
            controller: function ($scope, logger, ExpertInterviewApi) {
                $scope.eiAttachments = [];
                $scope.attachment = {};

                function _setFileIcon(ext) {
                    switch (ext) {
                        case 'png':
                        case 'jpg':
                        case 'jpeg':
                            return 'fa-file-image-o';
                        case 'pdf':
                            return 'fa-file-pdf-o';
                        case 'pptx':
                        case 'ppt':
                            return 'fa-file-powerpoint-o';
                        case 'xlsx':
                        case 'xls':
                            return 'fa-file-excel-o';
                        case 'docx':
                        case 'doc':
                            return 'fa-file-word-o';
                        default:
                            return 'fa-file';
                    };
                }

                function _getAttachments() {
                    ExpertInterviewApi.api.attachments.query({}, { expertInterviewId: $scope.expertInterviewId },
                        function (response) {
                            $scope.eiAttachments = response;

                            response.map(function (attachment, i) {
                                var ext = attachment.fileName.substr(attachment.fileName.lastIndexOf('.') + 1);
                                attachment.type = _setFileIcon(ext);
                                return attachment;
                            });
                            $scope.eiAttachments = response;

                            // $log.info('Retrieved attachments successfully.');
                        }, function (response) {
                            if (response.status !== 404)
                                logger.error(response.data.errorMessage);
                        });
                };

                function _downloadAttachment(id, fileName) {
                    $scope.fileName = fileName;

                    ExpertInterviewApi.api.attachment.get({ id: id }, { responseType: 'arraybuffer' }).$promise.then(
                        function (response) {
                        }, function (response) {
                            logger.error(response.data.errorMessage);
                        });
                };

                $scope.hasplay = null;
                function _playAudio(attachment) {
                    $scope.attachment = attachment;

                    var audioHtml = '<audio controls autoplay="autoplay"><source src="' + attachment.attachmentUrl + '" type="audio/mpeg"> Your browser does not support the audio element.</audio>';
                    $('.audio-section').empty();
                    $('.audio-section').append(audioHtml);
                    $scope.hasplay = 'audio';
                    $('#ModalVideoAudioAttachment').modal('show');
                };

                function _playVideo(attachment) {
                    $scope.attachment = attachment;

                    $("#mediaplayerAttachment").parent().empty().append('<div id="mediaplayerAttachment" style="height:300px"></div>');
                    $("#mediaplayerAttachment").kendoMediaPlayer({
                        autoPlay: false,
                        navigatable: true,
                        media: {
                            title: attachment.fileName,
                            source: attachment.attachmentUrl
                        }
                    });
                    $scope.hasplay = 'video';
                    $('#ModalVideoAudioAttachment').modal('show');
                }

                function _pauseAudioOrVideo() {
                    if ($scope.hasplay == 'video') {
                        var mediaPlayer = $("#mediaplayerAttachment").data("kendoMediaPlayer");
                        mediaPlayer.pause();
                    }

                    if ($scope.hasplay == 'audio') {
                        $('.audio-section audio').each(function (item, i) {
                            this.pause();
                        });
                    }

                    $scope.hasplay = null;
                }

                $scope.downloadAttachment = _downloadAttachment;
                $scope.getAttachments = _getAttachments;
                $scope.playAudio = _playAudio;
                $scope.playVideo = _playVideo;
                $scope.getAttachments();

                $scope.pauseAudioOrVideo = _pauseAudioOrVideo;
            },
            templateUrl: 'app/main/apps/expert-interview/_directives/skill-attachment-box-expert-interview.html',
        };
    }
})();