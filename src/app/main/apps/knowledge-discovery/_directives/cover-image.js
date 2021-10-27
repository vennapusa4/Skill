/**
 * @author v.lugovksy
 * created on 16.12.2015
 */
(function () {
    'use strict';

    angular.module('app.knowledgeDiscovery')
        .directive('coverImage', coverImage);

    /** @ngInject */
    function coverImage(KnowledgeDiscoveryApi, CoverImageAPI, KnowledgeService, Utils, logger, appConfig) {
        return {
            restrict: 'AE',
            scope: {
                ktype: '=',
            },
            controller: function ($scope, $stateParams) {
              $scope.choosenCover = false;
              $scope.isDefaultCoverImage = false;
              $scope.coverImages = [];
              $scope.Questions = {};
              $scope.Questions.uploadMessage = $scope.$parent.Questions.uploadMessage;
              $scope.Questions.minSizeMessage = $scope.$parent.Questions.minSizeMessage;
              $scope.Questions.varietyMessage = $scope.$parent.Questions.varietyMessage;
              $scope.Questions.useascover = $scope.$parent.Questions.useascover;

              $scope.$on('changeQuestionsLanguage', function (event, data) {
                $scope.Questions.uploadMessage = $scope.$parent.Questions.uploadMessage;
                $scope.Questions.minSizeMessage = $scope.$parent.Questions.minSizeMessage;
                $scope.Questions.varietyMessage = $scope.$parent.Questions.varietyMessage;
                $scope.Questions.useascover = $scope.$parent.Questions.useascover;
              });


              if($scope.ktype) {
                CoverImageAPI.getByType($scope.ktype).then(function(x){
                    $scope.coverImages = x.data;
                })
              } else {
                CoverImageAPI.getByType(14).then(function(x){
                    $scope.coverImages = x.data;
                })
              }

              
            //   CoverImageAPI.getByType($scope.ktype).then(function(x){
            //       $scope.coverImages = x.data;
            //       console.log($scope.coverImages);
            //   })

                var defaultCover = '/assets/images/LL1.jpg';
                switch ($stateParams.type) {
                    case 'BP':
                        defaultCover = '/assets/images/BP1.jpg';
                        break;
                    case 'LL':
                        defaultCover = '/assets/images/LL1.jpg';
                        break;
                    case 'Pub':
                        defaultCover = '/assets/images/P1.jpg';
                        break;
                    case 'SEI':
                        defaultCover = '/assets/images/P1.jpg';
                        break;
                    default:
                        break;

                }
                $scope.Images = [];
                $scope.CoverImage = {
                    id: 0,
                    name: 'DownloadAttachment',
                    result: defaultCover,
                    isAttachment: false
                };
                $scope.isDefaultCoverImage = true;

                $scope.k_options = {
                    multiple: false,
                    localization: {
                        dropFilesHere: "<i class='icon-drop'></i><br>Drag and drop files here",
                        select: 'or select file to upload...'
                    },
                    validation: { allowedExtensions: ['jpg', 'png'], maxFileSize: 10485760 },
                    async: { saveUrl: 'save', removeUrl: 'remove', autoUpload: true },
                    showFileList: false
                };

                $scope.$on('LoadImages', function () {
                    $scope.Images = KnowledgeService.getImages();
                    if (!_.isEmpty($scope.CoverImage) && $scope.CoverImage.isAttachment) {
                        if (_.filter($scope.Images, function (o) { return o.name == $scope.CoverImage.name }).length == 0) {
                            $scope.CoverImage = {};
                        }
                    }
                });

                $scope.$on('UseImage', function (event, data) {
                    _Use(data.img);
                });

                var offGet = $scope.$on('GetCoverImage', function (event, data) {
                    $scope.isDefaultCoverImage = true;
                    $scope.choosenCover = true;
                    $scope.CoverImage = {
                        id: data.coverimageId,
                        result: Utils.getImage('cover',data.coverimageId),
                        name: data.coverImage.fileName,
                        size: 0,
                        isAttachment: false
                    };
                    offGet();
                });

                $scope.$on('Submit', function (event, data) {
                    if (!_.isEmpty($scope.CoverImage)) {
                        data.Set('coverId', $scope.CoverImage.id);
                        data.Set('asCoverImage', $scope.CoverImage.isAttachment);

                        var tmp = $scope.CoverImage.name.split('.');
                        var extension = tmp[tmp.length - 1];
                        data.Set('extensionImage', extension);
                    }
                });

                function _Upload(e) {
                    for (var i = 0; i < e.files.length; i++) {
                        var obj = Utils.validateFile(e.files[i], appConfig.allowImageExtension);
                        if (obj.extension && obj.size) {
                            var file = e.files[i].rawFile;
                            if (file) {
                                var fd = new FormData();
                                fd.append("attachment", file);
                                // KnowledgeDiscoveryApi.uploadAttachment(1, fd).then(function (res) {
                                //     debugger;
                                //     $scope.CoverImage = {
                                //         result: res.result,
                                //         id: res.id,
                                //         name: res.name,
                                //         size: res.size,
                                //         isAttachment: false
                                //     };
                                // });
                                KnowledgeDiscoveryApi.uploadAttachment(1, fd).then(function (res) {
                                    debugger;
                                    $scope.isDefaultCoverImage = false;
                                    $scope.CoverImage = {
                                        result: res.image,
                                        id: res.id,
                                        name: res.fileName,
                                        size: res.size,
                                        isAttachment: false
                                    };
                                    console.log($scope.CoverImage);
                                    $scope.choosenCover = true;
                                    $scope.$emit('uploadCoverImage',$scope.CoverImage )
                                });
                            }
                        } else {
                            logger.error('Invalid file.')
                        }
                    }
                };

                function _Prevent(e) {
                    e.preventDefault();
                };

                function _Use(img) {
                    $scope.isDefaultCoverImage = false;
                    $scope.CoverImage = {
                        result: img.attachment,
                        id: img.id,
                        name: img.fileName,
                        size: img.fileLength,
                        isAttachment: false
                    };
                    $scope.choosenCover = true;
                };
                $scope.Upload = _Upload;
                $scope.Prevent = _Prevent;
                $scope.Use = _Use;
            },
            templateUrl: 'app/main/apps/knowledge-discovery/_directives/cover-image.html',
        };
    }
})();
