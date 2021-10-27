/**
 * @author v.lugovksy
 * created on 16.12.2015
 */
(function () {
  'use strict';

  angular.module('app.knowledgeDiscovery')
    .directive('skillAttachmentBox', skillAttachmentBox);

  /** @ngInject */
  function skillAttachmentBox() {
    return {
      restrict: 'AE',
      scope: {
        kdId: '<',
      },
      controller: function ($scope,  logger, KnowledgeDocumentApi) {

        $scope.kdAttachments = [];
        $scope.attachment = {};
        $scope.Questions = {};
        if($scope.$parent.Questions && $scope.$parent.Questions.attachment){
          $scope.Questions.attachment = $scope.$parent.Questions.attachment;
        }
        else{
          $scope.Questions.attachment = "Attachment";
        }
        $scope.$on('changeQuestionsLanguage', function (event, data) {
          $scope.Questions.attachment = $scope.$parent.Questions.attachment;
        });

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
         //function initMediaPlayer(){
          
          
          function playMedia(video){
            var myOptions = {
              "nativeControlsForTouch": false,
              controls: true,
              autoplay: false,
              width: "640",
              height: "400",
             }
            var myPlayerPopup = amp("azuremediaplayerPopup", myOptions);

            myPlayerPopup.src([
              {
                      "src": video.attachmentUrl,
                      "type": "application/vnd.ms-sstr+xml"
              }
            ]);
            amp("azuremediaplayerPopup").ready(function(){
              myPlayerPopup = this;
              //myPlayerPopup.play();
            });
          }
  
        //}
        function _getAttachments() {
          KnowledgeDocumentApi.api.attachments.query({}, { knowledgeDocumentId: $scope.kdId },
            function (response) {
              $scope.kdAttachments = response;

              response.map(function (attachment, i) {
                var ext = attachment.fileName.substr(attachment.fileName.lastIndexOf('.') + 1);
                attachment.type = _setFileIcon(ext);
                return attachment;
              });
              $scope.kdAttachments = response;

              // $log.info('Retrieved attachments successfully.');
            }, function (response) {
              if (response.status !== 404)
                logger.error(response.data.errorMessage);
            });
        };

        // function _downloadAttachment(id, fileName) {
        //   $scope.fileName = fileName;

        //   KnowledgeDocumentApi.api.attachment.get({ id: id }, { responseType: 'arraybuffer' }).$promise.then(
        //     function (response) {
        //     }, function (response) {
        //       logger.error(response.data.errorMessage);
        //     });
        // };

        function _downloadAttachment(attachment) {
          if(attachment.fileName.toLowerCase().lastIndexOf(".mp3") < 0 && attachment.fileName.toLowerCase().lastIndexOf(".mp4") < 0){
            window.open(attachment.attachmentUrl, "_blank");
          }
        };


        $scope.hasplay = null;
        function _playAudio(attachment) {
          $scope.attachment = attachment;

          var audioHtml = '<audio controls autoplay="autoplay"><source src="' + attachment.attachmentUrl + '" type="audio/mpeg"> Your browser does not support the audio element.</audio>';
          $('.audio-section').empty();
          $('.audio-section').append(audioHtml);
          $scope.hasplay = 'audio';
         // initMediaPlayer();

          $('#ModalVideoAudioAttachment').modal('show');
        };

        function _playVideo(attachment) {
          $scope.attachment = attachment;

          // $("#mediaplayerAttachment").parent().empty().append('<div id="mediaplayerAttachment" style="height:300px"></div>');
          // $("#mediaplayerAttachment").kendoMediaPlayer({
          //   autoPlay: true,
          //   navigatable: true,
          //   media: {
          //     title: attachment.fileName,
          //     source: attachment.attachmentUrl
          //   }
          // });
          $scope.hasplay = 'video';
         // initMediaPlayer();
          playMedia(attachment);

          $('#ModalVideoAudioAttachment').modal('show');
        }

        
        function _pauseAudioOrVideo() {
          if ($scope.hasplay == 'video') {
            // var mediaPlayer = $("#mediaplayerAttachment").data("kendoMediaPlayer");
            myPlayerPopup.pause();
            //myPlayer.dispose();
          }

          if ($scope.hasplay == 'audio') {
            $('.audio-section audio').each(function (item, i) {
              myPlayerPopup.pause();
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
      templateUrl: 'app/main/apps/knowledge-discovery/_directives/skill-attachment-box.html',
    };
  }
}
)();
