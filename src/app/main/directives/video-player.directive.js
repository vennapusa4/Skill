/**
 * @author v.lugovksy
 * created on 16.12.2015
 */
(function () {
    'use strict';

    angular.module('app.landingPage')
        .directive('videoPlayer', videoPlayer);

    /** @ngInject */
    function videoPlayer() {

        return {
            restrict: 'E',
            scope: {
              pagename: '=',
              source: '=',
              autoplay: '='
            },
            controller: function ($scope , $element, $timeout, AdminSettingCoPApi, appConfig , CollectionApi, $log, logger) {
               // $scope.article.description = $scope.article.description.slice(0, 270)+"...";
              
                $scope.styleView = 'main';
                $scope.initStyle = 'height: 32rem;';
                $scope.playpauseButton = function() {
                    playMedia(true);
                    
                //    var vid = document.getElementById(data);
                //    if(vid.paused) {
                //        vid.play();
                //        document.getElementById('isPlayPause').innerHTML = '<img src="/assets/icons/new-icons/mini-view.svg">'
                //    } else {
                //     vid.pause();
                //     document.getElementById('isPlayPause').innerHTML = '<img src="/assets/icons/new-icons/play-white.svg">'
                //    }
                }
                $scope.playOnMini = function () {
                    if($scope.styleView == 'main') {
                        $scope.styleView = 'mini';
                        $('#isPlayVideo').addClass('isVideoMiniView');
                    } else {
                        $scope.styleView = 'main';
                        $('#isPlayVideo').removeClass('isVideoMiniView');
                    }
                }
                $scope.videoMute = function(data) {
                    var vid = document.getElementById(data);
                    if(vid.muted) {
                        vid.muted = false;
                        document.getElementById('isMuteButton').innerHTML = '<img src="/assets/icons/new-icons/volume.svg">'
                    } else {
                        vid.muted = true;
                     document.getElementById('isMuteButton').innerHTML = '<img src="/assets/icons/new-icons/play-white.svg">'
                    }
                 }
                 var myPlayerVideo;
                 function playMedia(isPlay){
                    //$scope.nowPlayingTrendingMedia = data;
          
                    // if(data){
                        if($scope.source) {
                            var myOptions = {
                                "nativeControlsForTouch": false,
                                controls: true,
                                autoplay: $scope.autoplay,
                                width: "100%",
                                height: "100%",
                               }
                              $timeout(function(){
                                myPlayerVideo = amp("azuremediaplayerKnowledgePopupMain" + $scope.source.id, myOptions);
                                myPlayerVideo.src([
                                  {
                                          "src": $scope.source.attachmentUrl,
                                          "type": "application/vnd.ms-sstr+xml"
                                  }
                                ]);
                                amp("azuremediaplayerKnowledgePopupMain" + $scope.source.id).ready(function(){
                                    myPlayerVideo = this;
                                  if(isPlay){
                                   // myPlayerSearchTrending.play();
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
                      if(myPlayerVideo){
                        myPlayerVideo.pause();
                      }
                  });
                  $scope.$on('changeVideo', function (event){
                    if(myPlayerVideo) {
                        myPlayerVideo.dispose()
                    }
                  });
                 $scope.viewFullscreen = function (data) {
                    var vid = document.getElementById(data);
                    if (vid.requestFullscreen) {
                        vid.requestFullscreen();
                    } else if (vid.mozRequestFullScreen) { 
                        vid.mozRequestFullScreen();
                    } else if (vid.webkitRequestFullscreen) {
                        vid.webkitRequestFullscreen();
                    } else if (vid.msRequestFullscreen) {
                        vid.msRequestFullscreen();
                    }
                  }
                  
                //   var mediaPlayer = document.getElementById('videoTest');
                //   mediaPlayer.addEventListener('timeupdate', updateProgressBar, false);
                //   function updateProgressBar() {
                //     var progressBar = document.getElementById('playtime');
                //     var percentage = Math.floor((100 / mediaPlayer.duration) *
                //     mediaPlayer.currentTime);
                //     progressBar.value = percentage;
                //     progressBar.innerHTML = percentage + '%';
                //  }
                //  $('#playtime').bind('click', function (e) {
                //     var mediaPlayer = document.getElementById('videoTest');
                //     var div = $(e.target);
                //     var display = div.find('#playtime');
                //     var offset = div.offset();
                //     var x = e.clientX - offset.left; 
                //     var newtime = (x / $('#playtime').width()) * mediaPlayer.duration;
                //     mediaPlayer.currentTime = newtime;

                // });
                playMedia(false);
                
            },
            templateUrl: 'app/main/directives/video-player.html'
            
        };
    }
})();
