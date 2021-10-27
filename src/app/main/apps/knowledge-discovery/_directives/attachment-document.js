/**
 * @author v.lugovksy
 * created on 16.12.2015
 */
(function () {
    'use strict';

    angular.module('app.knowledgeDiscovery')
        .directive('attachment', attachment);

    /** @ngInject */
    function attachment(KnowledgeDiscoveryApi, KnowledgeService, Utils, logger, appConfig) {

        return {
            restrict: 'AE',
            scope: {
                disable: '=',
            },
            controller: function ($scope,Guid, $rootScope, $interval) {
                var guid = Guid.newGuid();
                //alert(guid);

                $scope.Attachments = [];
                $scope.ExistingAttachments = [];
                $scope.isLoading = false;

                $scope.Questions = {};
                $scope.Questions.attachment = $scope.$parent.Questions.attachment;
                $scope.Questions.formatsaccepted = $scope.$parent.Questions.formatsaccepted;
                $scope.Questions.useascover = $scope.$parent.Questions.equipment;

                $scope.$on('changeQuestionsLanguage', function (event, data) {
                  $scope.Questions.attachment = $scope.$parent.Questions.attachment;
                  $scope.Questions.formatsaccepted = $scope.$parent.Questions.formatsaccepted;
                  $scope.Questions.useascover = $scope.$parent.Questions.equipment;
                });

                $scope.attachmentType = function (data) {
                    var splitter = data.substr(data.lastIndexOf('.') + 1);
                    return splitter.toUpperCase();
                };

                $scope.k_options = {
                    multiple: true,
                    localization: {
                        dropFilesHere: "<i class='icon-drop'></i><br>Drag and drop files here",
                        select: 'or select file to upload...'
                    },
                    validation: { allowedExtensions: ['jpg', 'png', 'pdf', 'doc', 'xls', 'ppt', 'docx', 'xlsx', 'pptx', 'mp4', 'mp3'], maxFileSize: 10485760 },
                    async: { saveUrl: 'save', removeUrl: 'remove', autoUpload: true },
                    showFileList: false
                };

                $scope.$on('Submit', function (event, data) {
                    data.Set('attachments', _.map($scope.Attachments, function (o) { return o.id }));
                });

                $scope.$on('Get', function (event, data) {
                    $scope.Attachments = _.map(data.Get('attachments'), function (o) {
                        var isPhoto = (_.filter(appConfig.allowImageExtension, function (ext) { return _.endsWith(o.fileName, '.' + ext) }).length == 1);
                        return {
                            result: isPhoto ? Utils.getImage('doc', o.id) : Utils.getIcon(o.fileName),
                            id: o.id,
                            name: o.fileName,
                            size: o.size,
                            isAttachment: true,
                            isPhoto: isPhoto
                        };
                    });
                    debugger;
                    angular.copy($scope.Attachments, $scope.ExistingAttachments);
                    _Load();
                });

               

                function getUploadStatus(){
                    // debugger;
                    $interval(_UploadStatus, 10000);
                }
                getUploadStatus();

                $scope.totalFileCount = 0;
                $scope.prevTotalFileCount = 0;

                $scope.remvoedItems = [];
                $scope.isStatusRefreshStarts = false;

                function _UploadStatus(){
                    //  debugger;
                    if($scope.isStatusRefreshStarts){
                    
                        // if($scope.uploadFileCount >= $scope.uploadingDoneCount){
                        //     $scope.Attachments = [];
                            //_UploadStatus(guid);
                            debugger;
                            KnowledgeDiscoveryApi.getUploadStatus(guid).then(function (res) {
                              
                                var completedCount = res.length;
                                debugger;
                                if(completedCount == $scope.totalFileCount){
                                    $scope.isLoading = false;

                                    $scope.Attachments = [];
                                    angular.copy($scope.ExistingAttachments, $scope.Attachments);

                                    $scope.isStatusRefreshStarts = false;
                                    $rootScope.$broadcast('finishUploadAttachment');
                                    $rootScope.$broadcast('uploadAttachment', { prefix:"Upload Finished", isUploading: false, totalCount: $scope.uploadFileCount, uploadingCount: 0 });
                                    for(i=0;i<res.length; i++){
                                        if(res[i].uploadedStatusMessage != "Failed"){
                                            debugger;
                                            var isRemoved = false;
                                            var k = 0;
                                            for( k=0; k<$scope.remvoedItems.length; k++){
                                                if(res[i].id == $scope.remvoedItems[k]){
                                                    isRemoved = true;
                                                    break;
                                                }
                                            }

                                            if(!isRemoved){
                                                debugger;
                                                $scope.Attachments.push({
                                                    id: res[i].id,
                                                    name: res[i].fileName,
                                                    size: res[i].fileSize,
                                                    isAttachment: true,
                                                    url : res[i].url
                                                });
                                            }
                                        }
                                        else{
                                            //logger.error("File: "+res[i].fileName+" failed to upload");           
                                        }
                                    }
                                }
                                else{
                                    var totalNewUpload = $scope.totalFileCount - $scope.prevTotalFileCount;
                                    var totalNewUploaded = res.length - $scope.prevTotalFileCount;
                                    $rootScope.$broadcast('uploadAttachment', { prefix: "Uploading ", isUploading: true, totalCount: totalNewUpload,  uploadingCount : (totalNewUploaded+1) });
                                }                                
                            });
                        // }
                        // else{
                        //     console.log('all upload done');
                        // }
                    }
                   
                }

             

                function _Upload(e) {
                    //$scope.isStatusRefreshStarts = false;
                    var currFileCount = e.files.length;
                    var currFileUpDoneCount = 0;
                    $scope.isLoading = true;
                    //$rootScope.$broadcast('uploadingAttachment');
                    
                    debugger;
                    angular.copy($scope.totalFileCount, $scope.prevTotalFileCount);
                    $scope.prevTotalFileCount = $scope.totalFileCount;
                    $scope.totalFileCount += currFileCount;

                    $rootScope.$broadcast('uploadAttachment', {  prefix : "Preparing ", isUploading: true, totalCount: currFileCount,  uploadingCount: 1 });

                    for (var i = 0; i < e.files.length; i++) {
                        var obj = Utils.validateFile(e.files[i], appConfig.allowFileExtension);
                        if (obj.extension && obj.size) {
                            var file = e.files[i].rawFile;
                            var isPhoto = Utils.validateFile(e.files[i], appConfig.allowImageExtension).extension;
                            if (file) {
                                var fd = new FormData();
                                fd.append("attachment", file);
                                fd.append("refId",guid);
                                KnowledgeDiscoveryApi.uploadAttachment(0, fd).then(function (res) {
                                    currFileUpDoneCount++;
                                    debugger;
                                    if(i == e.files.length){
                                        $scope.isStatusRefreshStarts = true;
                                    }
                                    if(currFileUpDoneCount < currFileCount){
                                        $rootScope.$broadcast('uploadAttachment', { prefix : "Preparing ",  isUploading: true, totalCount: currFileCount,  uploadingCount : (currFileUpDoneCount+1) });
                                    }
                                }).then(function () {
                                    //  logger.error(e.files[i].fileName+'Some file failed to upload.');
                                     //console.log(e.files[i]);
                                    _Load();
                                }).catch(function(){
                                    logger.error(e.files[i].fileName+'Some file failed to upload.');
                                });
                            }
                        }
                        else {
                            logger.error('Invalid file.')
                        }
                    }
                };

                function _Prevent(e) {
                    e.preventDefault();
                };

                function _Remove(idx) {
                    if($scope.disable == false){
                        var obj = $scope.Attachments[idx];
                        URL.revokeObjectURL(obj.result);
                        $scope.Attachments.splice(idx, 1);
                        
                        debugger;
                        for(var i = 0; i < $scope.ExistingAttachments.length; i++){
                            if($scope.ExistingAttachments[i].id == obj.id){
                                $scope.ExistingAttachments.splice(i,1);
                            }
                        }
                       // $scope.totalFileCount -= 1;
                       debugger;
                       $scope.remvoedItems.push(obj.id);
                        _Load();
                    }
             
                };

                function _Use(img) {
                    $rootScope.$broadcast('UseImage', { img: img });
                };

                function _Load() {
                    KnowledgeService.loadImages(_.filter($scope.Attachments, function (o) {
                        return o.isPhoto;
                    }));
                    $rootScope.$broadcast('LoadImages', null);
                };

                $scope.Upload = _Upload;
                $scope.Prevent = _Prevent;
                $scope.Remove = _Remove;
                $scope.Use = _Use;
            },
            templateUrl: 'app/main/apps/knowledge-discovery/_directives/attachment-document.html',
        };
    }
})();
