/**
 * @author v.lugovksy
 * created on 16.12.2015
 */
(function () {
    'use strict';

    angular.module('app.bulkUpload')
        .directive('attachmentBulk', attachmentBulk);

    /** @ngInject */
    function attachmentBulk(KnowledgeDiscoveryApi, KnowledgeService, Utils, logger, appConfig) {

        return {
            restrict: 'AE',
            scope: {
                attachmentData: '='
            },
            controller: function ($scope, $rootScope) {
                $scope.k_options = {
                    multiple: true,
                    localization: {
                        dropFilesHere: "<div style='width:100%; display:block'><i class='icon-drop'></i><br/>Drag and drop files here to upload </div>",
                        select: 'or select file to upload...'
                    },
                    validation: { allowedExtensions: ['jpg', 'png', 'pdf', 'doc', 'xls', 'ppt', 'docx', 'xlsx', 'pptx', 'mp4', 'mp3'], maxFileSize: 10485760 },
                    async: { saveUrl: 'save', removeUrl: 'remove', autoUpload: true },
                    showFileList: false
                };

                $scope.$on('Submit', function (event, data) {
                    data.Set('attachments', _.map($scope.attachmentData, function (o) { return o.id }));
                });

                $scope.$on('Get', function (event, data) {
                    $scope.attachmentData = _.map(data.Get('attachments'), function (o) {
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
                    _Load();
                });

                function _Upload(e) {
                    for (var i = 0; i < e.files.length; i++) {
                        var obj = Utils.validateFile(e.files[i], appConfig.allowFileExtension);
                        if (obj.extension && obj.size) {
                            var file = e.files[i].rawFile;
                            var isPhoto = Utils.validateFile(e.files[i], appConfig.allowImageExtension).extension;
                            if (file) {
                                var fd = new FormData();
                                fd.append("attachment", file);
                                KnowledgeDiscoveryApi.uploadAttachment(0, fd).then(function (res) {
                                    $scope.attachmentData.push({
                                        result: res.result,
                                        id: res.id,
                                        name: res.name,
                                        size: res.size,
                                        isAttachment: true,
                                        isPhoto: isPhoto
                                    });
                                }).then(function () {
                                    _Load();
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
                    var obj = $scope.attachmentData[idx];
                    URL.revokeObjectURL(obj.result);
                    $scope.attachmentData.splice(idx, 1);
                    _Load();
                };

                function _Load() {
                    KnowledgeService.loadImages(_.filter($scope.attachmentData, function (o) {
                        return o.isPhoto;
                    }));
                    $rootScope.$broadcast('LoadImages', null);
                };

                $scope.Upload = _Upload;
                $scope.Prevent = _Prevent;
                $scope.Remove = _Remove;
            },
            templateUrl: 'app/main/apps/bulk-upload/_directives/attachment-bulk.html',
        };
    }
})();
