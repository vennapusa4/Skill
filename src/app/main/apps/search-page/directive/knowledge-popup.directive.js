/**
 * @author v.lugovksy
 * created on 16.12.2015
 */
(function () {
    'use strict';

    angular.module('app.SearchPage')
        .directive('knowledgePopup', knowledgePopup);

    /** @ngInject */
    function knowledgePopup() {

        return {
            restrict: 'E',
            scope: {
                id: "=",
                article: "="

            },
            controller: function ($scope,KnowledgeDocumentApi, appConfig, $timeout, $rootScope,KnowledgeDiscoveryApi,$state,$stateParams) {
                var vm = this;
                console.log($scope.article);
                vm.config = appConfig;
                $scope.selectedArticle = null;
                $scope.selectedKnowledgeID;
                
              
                function loadDetail(data) {
                    debugger;
                   
                    $scope.selectedArticle = null;
                    var articleInfo = {}
                    var postData = { knowledgeDocumentId: data };
                    KnowledgeDocumentApi.knowledgeDocument(postData).then(function (res) {
                      //  
                            if(res != null){
                                articleInfo['knowledge'] = res;  
                                
                            }
                           
                            KnowledgeDocumentApi.GetKnowledgeUserInfo(data).then(function (res) {
                                if(res != null){

                                    articleInfo['user_info']  = res;  
                                     
                                }
                                KnowledgeDocumentApi.api.replicationDetails.query({}, postData,
                                    function (response) {
                                        articleInfo['replicationDetail'] = response;
                                        KnowledgeDocumentApi.GetKnowledgeAdditionInfo(data).then(function (response) {
                                            articleInfo['additional_info'] = response;
                                            KnowledgeDocumentApi.api.replicationHistory.query({}, postData,
                                                function (response) {
                                                    articleInfo['replicationHistory'] = response;
                                                    KnowledgeDocumentApi.api.attachments.query({}, { knowledgeDocumentId: $scope.id },
                                                        function (response) {
                                                            articleInfo['attachments'] = response;
                                                            var videos = [];
                                                            var audios = [];
                                                            var images = [];
                                                            articleInfo.attachments.forEach(function(element){
                                                              if(element.fileName.toLowerCase().indexOf('.png') != -1 || element.fileName.toLowerCase().indexOf('.jpg') != -1 || element.fileName.toLowerCase().indexOf('.jpeg') != -1){
                                                                images.push(element);
                                                              } else if (element.fileName.toLowerCase().indexOf('.mp3') != -1) {
                                                                audios.push(element);
                                                              } else if (element.fileName.toLowerCase().indexOf('.mp4') != -1) {
                                                                videos.push(element);
                                                              } 
                                                            });


                                                            if(videos.length > 0) {
                                                              $scope.mediaSource = videos[0];
                                                              $scope.mediaType = 'video';
                                                            } else if(audios.length > 0) {
                                                              $scope.mediaSource = audios[0];
                                                              $scope.mediaType = 'audio';
                                                            } 
                                                            // else if(images.length > 0) {
                                                            //   $scope.mediaSource = images[0];
                                                            //   $scope.mediaType = 'image';
                                                            // }
                                                            

                                                            console.log($scope.mediaSource);
                                                            console.log($scope.mediaType);

                                                            KnowledgeDocumentApi.api.replicationContributorDetails.query({}, { knowledgeDocumentId: $scope.id },
                                                                function (response) {
                                                                    articleInfo['replication_contributors'] = response;
                                                                    $scope.selectedArticle = articleInfo;
                                                                    console.log($scope.selectedArticle);
                                                                    postView();
                                                                    //initVideoFiles($scope.selectedArticle.attachments);
                                                                  // $log.info('Retrieved replication contributors successfully.');
                                                                },
                                                                function (response) {
                                                                  if (response.status !== 404)
                                                                    logger.error(response.data.errorMessage);
                                                                });
                                            
                                                        }, function (response) {
                                                          if (response.status !== 404)
                                                            logger.error(response.data.errorMessage);
                                                        });
                                               
                                                }, function (response) {
                                                  if (response.status !== 404)
                                                    logger.error(response.data.errorMessage);
                                                });
                                        });
                            
                                    },
                                    function (response) {
                                      if (response.status !== 404)
                                        logger.error(response.data.errorMessage);
                                    });
                            });
                         });
                        
                    $('#showArticle').modal({
                      backdrop: 'static',
                      keyboard: false
                    });
                }
               
                $scope.showArticleShare = function (data) {
                  $scope.choosenKnowlegde = data;
                  $scope.$emit('modalShareOpen', data);
                }
                $rootScope.$on('onPopupOpen', function (evt, knowledge) {
                    loadDetail(knowledge.articleID);
                    $('#showArticle').modal('show');
                   
                });
                $scope.$on('modalOpen', function (event, data) {
                  $scope.ngModel = data || { recents: [], collections: [] };
          
                });

                
                function postView() {
                    var viewRequest = {
                      knowledgeDocumentId: $scope.id,
                      taggingTypeName: 'View',
                      taggingTypeValue: true
                    };
                    KnowledgeDocumentApi.api.postTagging.save({}, viewRequest,
                      function (response) {
                        $scope.selectedArticle.knowledge.totalViewsCount += 1;
                      },
                      function (response) {
                        logger.error(response.data.errorMessage);
                      });
                  };
              
                $rootScope.$on('updateTotalLikeCount', function (evt, data) {
                    if (data.kdId == $scope.id) {
                      $scope.selectedArticle.knowledge.isLiked = data.isLiked;
                    }
                  });
              
                  $rootScope.$on('updateTotalBookmarkCount', function (evt, data) {
                    if (data.kdId == $scope.id) {
                      $scope.selectedArticle.knowledge.isSavedToLibrary = data.isSavedToLibrary;
                    }
                  });

                  $scope.postLike = function (articleID) {
                    var isLiked = $scope.article.isLiked || false;
                    if (isLiked) {
                        $scope.article.isLiked = false;
                        $scope.article.totalLikes--;
                        if ($scope.article.totalLikes <= 0) {
                            $scope.article.totalLikes = 0;
                        }
                        KnowledgeDocumentApi.postLike(articleID, false).then(function (data) {
                            if (!data.isSuccess) {
                                $scope.article.totalLikes++;
                                $scope.article.isLiked = true;
                            }
                            $rootScope.$broadcast('updateTotalLikeCount', {
                                articleID: $scope.article.articleID,
                                isLiked: $scope.article.isLiked
                            });
                        }, function (error) {
                            $scope.article.totalLikes++;
                            $scope.article.isLiked = true;
                        });
                    }
                    else {
                        $scope.article.isLiked = true;
                        $scope.article.totalLikes++;
                        KnowledgeDocumentApi.postLike(articleID, true).then(function (data) {
                            if (!data.isSuccess) {
                                $scope.article.totalLikes--;
                                if ($scope.article.totalLikes <= 0) {
                                    $scope.article.totalLikes = 0;
                                }
                                $scope.article.isLiked = false;
                            }
                            $rootScope.$broadcast('updateTotalLikeCount', {
                                articleID: $scope.article.articleID,
                                isLiked: $scope.article.isLiked
                            });
                            $state.go($state.current,$stateParams, {notify: false}) 
                          //  $('body').removeClass('modal-open');
                          //  $('.modal-backdrop').remove();
                        }, function (error) {
                            $scope.article.totalLikes--;
                            if ($scope.article.totalLikes <= 0) {
                                $scope.article.totalLikes = 0;
                            }
                            $scope.article.isLiked = false;
                        });
                    }

                    return false;
                }

                    function postSave(isSavedToLibrary) {
                      $scope.selectedArticle.isSavedToLibrary = isSavedToLibrary;
                      $scope.selectedArticle.totalSaveLibraryCount = isSavedToLibrary ? ++$scope.selectedArticle.totalSaveLibraryCount : --$scope.selectedArticle.totalSaveLibraryCount;
                      var saveRequest = {
                        knowledgeDocumentId: $scope.id,
                        taggingTypeName: 'Save',
                        taggingTypeValue: $scope.selectedArticle.isSavedToLibrary
                      };
                      KnowledgeDocumentApi.api.postTagging.save({}, saveRequest,
                        function (response) {
                          $rootScope.$broadcast('UpdateInterest');
                        },
                        function (response) {
                          logger.error(response.data.errorMessage);
                        });
                    };

    
                $scope.updateComment = function(data) {
                    $scope.selectedArticle.knowledge.totalCommentsCount = data;
                }
                // $scope.removeEverything = function (data) {
                //     $scope.selectedArticle = null;
                //     $scope.$emit('closingModal');
                // }
                $scope.changeArticle = function(data) {
                    $scope.id = data;
                    loadDetail(data)
                }
             
                $scope.mediaPlayes=[];
                $scope.loadVideo = function(id, attachmentUrl){
                  
                    $timeout(function(){
                        var myOptions = {
                            "nativeControlsForTouch": false,
                            controls: true,
                            autoplay: false,
                            width: "100%",
                            height: "auto",
                        }
                        var myPlayerPopup = amp("azuremediaplayerPopup"+id, myOptions);
                        myPlayerPopup.src([
                            {
                                    "src": attachmentUrl,
                                    "type": "application/vnd.ms-sstr+xml"
                            }
                        ]);
                        amp("azuremediaplayerPopup"+id).ready(function(){
                            debugger;
                            myPlayerPopup = this;
                        });
                        $scope.mediaPlayes.push(myPlayerPopup);
                   },1000);
                }
                $scope.hideModal = function(){
                  debugger;
                  $rootScope.$broadcast("stopmedia");
                  $scope.mediaType = '';
                  $scope.mediaSource = '';
                  //debugger
                  if($scope.mediaPlayes){
                    for(var i = 0 ; i< $scope.mediaPlayes.length; i++){
                      $scope.mediaPlayes[i].pause();
                    }
                  }
                  
                  $('#showArticle').modal('hide');

                }
               
                $scope.downloadAttachment = function(attachment) {
                    if(attachment.fileName.toLowerCase().lastIndexOf(".mp3") < 0 && attachment.fileName.toLowerCase().lastIndexOf(".mp4") < 0){
                      window.open(attachment.attachmentUrl, "_blank");
                    }
                };

                loadDetail($scope.id);

              },
            templateUrl: 'app/main/apps/search-page/directive/knowledge-popup.html'
            
        };
    }
})();
