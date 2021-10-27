/**
 * @author v.lugovksy
 * created on 16.12.2015
 */
(function () {
    'use strict';

    angular.module('app.landingPage')
        .directive('audioPlayer', audioPlayer);

    /** @ngInject */
    function audioPlayer() {

        return {
            restrict: 'E',
            scope: {
              pagename: '=',
              source: '=',
              autoplay: '='
            },
            controller: function ($scope , $timeout, $element, AdminSettingCoPApi, appConfig , CollectionApi, $log, logger) {
               // $scope.article.description = $scope.article.description.slice(0, 270)+"...";

               var myPlayerAudio ;
               function playMedia(isPlay){
                //$scope.nowPlayingTrendingMedia = data;
      
                // if(data){
                    if($scope.source) {
                        var myOptions = {
                            "nativeControlsForTouch": false,
                            controls: true,
                            autoplay: $scope.autoplay,
                            width: "100%",
                            height: "200px",
                           }
                          $timeout(function(){
                            myPlayerAudio = amp("azuremediaplayerPopupMainAudio" + $scope.source.id, myOptions);
                            myPlayerAudio.src([
                              {
                                      "src": $scope.source.attachmentUrl,
                                      "type": "application/vnd.ms-sstr+xml"
                              }
                            ]);
                            amp("azuremediaplayerPopupMainAudio" + $scope.source.id).ready(function(){
                              myPlayerAudio = this;
                              if(isPlay){
                                // myPlayerAudio.play();
                              }
                              this.addEventListener('ended', function() {
                                $scope.$emit('playNext', $scope.source);
                            });
                            });
                          },500);
                    } 
                    
                 
                // }
              }
              $scope.$on('stopmedia', function (event) {
                if(myPlayerAudio){
                  myPlayerAudio.pause();
                }
              });
              $scope.$on('changeVideo', function (event){
                if(myPlayerAudio) {
                  myPlayerAudio.dispose()
                }
              });
                // $scope.initStyle = 'height: 32rem;';
                // $scope.playpauseButton = function(data) {
                //    var audio = document.getElementById(data);
                //    if(audio.paused) {
                //     //audio.play();
                //        document.getElementById('isPlayPause').innerHTML = '<img src="/assets/icons/new-icons/mini-view.svg">'
                //    } else {
                //     audio.pause();
                //     document.getElementById('isPlayPause').innerHTML = '<img src="/assets/icons/new-icons/play-white.svg">'
                //    }
                // }
                // $scope.videoMute = function(data) {
                //     var audio = document.getElementById(data);
                //     if(audio.muted) {
                //         audio.muted = false;
                //         document.getElementById('isMuteButton').innerHTML = '<img src="/assets/icons/new-icons/volume.svg">'
                //     } else {
                //         audio.muted = true;
                //      document.getElementById('isMuteButton').innerHTML = '<img src="/assets/icons/new-icons/play-white.svg">'
                //     }
                //  }
                //  $scope.viewFullscreen = function (data) {
                //     var audio = document.getElementById(data);
                //     if (audio.requestFullscreen) {
                //         audio.requestFullscreen();
                //     } else if (audio.mozRequestFullScreen) { 
                //         audio.mozRequestFullScreen();
                //     } else if (audio.webkitRequestFullscreen) {
                //         audio.webkitRequestFullscreen();
                //     } else if (audio.msRequestFullscreen) {
                //         audio.msRequestFullscreen();
                //     }
                //   }
                //   var mediaPlayer = document.getElementById('audioTest');
                //   mediaPlayer.addEventListener('timeupdate', updateProgressBar, false);
                //   function updateProgressBar() {
                //     var progressBar = document.getElementById('playtime');
                //     var percentage = Math.floor((100 / mediaPlayer.duration) *
                //     mediaPlayer.currentTime);
                //     progressBar.value = percentage;
                //     progressBar.innerHTML = percentage + '%';
                //  }
                //  $('#playtime').bind('click', function (e) {
                //     var mediaPlayer = document.getElementById('audioTest');
                //     var div = $(e.target);
                //     var display = div.find('#playtime');
                //     var offset = div.offset();
                //     var x = e.clientX - offset.left; 
                //     var newtime = (x / $('#playtime').width()) * mediaPlayer.duration;
                //     mediaPlayer.currentTime = newtime;

                // });
                playMedia(false);
            },
            templateUrl: 'app/main/directives/audio-player.html'
            
        };
    }
})();
