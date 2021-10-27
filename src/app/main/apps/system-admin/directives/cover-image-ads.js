/**
 * @author v.lugovksy
 * created on 16.12.2015
 */
(function () {
    'use strict';

    angular.module('app.knowledgeDiscovery')
        .directive('coverImageAds', coverImageAds);

    /** @ngInject */
    function coverImageAds(KnowledgeDiscoveryApi, KnowledgeService, Utils, logger, appConfig) {
        return {
            restrict: 'AE',
            scope: {},
            controller: function ($scope, $stateParams) {
              $scope.isDefaultCoverImage = false;

                var defaultCover = '/assets/images/subCoP.png';
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
  
                var offGet = $scope.$on('GetCoverImage', function (event, data) {
                    $scope.isDefaultCoverImage = true;
                    $scope.CoverImage = {
                        id: data.coverimageId,
                        result: Utils.getImage('cover',data.coverimageId),
                        name: data.coverImage.fileName,
                        size: 0,
                        isAttachment: false
                    };
                    offGet();
                });

                $scope.uploadFile= {
                    "lastModified": "",
                    "lastModifiedDate":"",
                    "name":"",
                    "extension": "",
                    "size":""
                    
                  }
                $scope.Upload = function(event) {

                    var input = event.target;
                    var reader = new FileReader();
                    var filename = input.files[0].name.split('.');
                    $scope.uploadFile.name = filename[0];
                    $scope.uploadFile.extension = "."+filename[1];
                    $scope.uploadFile.size = input.files[0].size ;
            
                       var obj = Utils.validateFile($scope.uploadFile, appConfig.allowImageExtension);
                 
                      if (obj.extension && obj.size) {

                        reader.onload = function(){
                          var result = reader.result;
                          var indexOfFirstPart = result.indexOf(',') + 1;
                          $scope.processedResult = result.substr(indexOfFirstPart, result.length);

                          $scope.isDefaultCoverImage = false;
                          $scope.CoverImage = {
                              result: $scope.processedResult,
                              name: $scope.uploadFile.name,
                              size: $scope.uploadFile.size,
                              isAttachment: false
                          };
                          $scope. $apply();
                        };
                        reader.readAsDataURL(input.files[0]);
                        
                        $scope.validExtension = true;
                        $scope.$emit('uploadCoverImage',$scope.processedResult )
                      }
                      else{
                        logger.error('Invalid file.')
                        $scope.validExtension = false;
                      }
                };
            },
            templateUrl: 'app/main/apps/system-admin/directives/cover-image-ads.html',
        };
    }
})();
