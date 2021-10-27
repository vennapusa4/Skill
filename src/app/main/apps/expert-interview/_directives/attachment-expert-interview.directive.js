/**
 * @author v.lugovksy
 * created on 16.12.2015
 */
(function () {
    'use strict';

    angular.module('app.expertInterview')
        .directive('attachmentExpertInterview', attachmentExpertInterview);

    /** @ngInject */
    function attachmentExpertInterview(ExpertInterviewApi, ExpertInterviewService, Utils, logger, appConfig) {

        return {
            restrict: 'AE',
            scope: {},
            controller: function ($scope, $rootScope) {
                $scope.Attachments = [];
                $scope.k_options = {
                    multiple: true,
                    localization: {
                        dropFilesHere: "<i class='icon-drop'></i><br>Drag and drop files here to upload",
                        select: 'or select file to upload...'
                    },
                    validation: { allowedExtensions: appConfig.allowExpertInterviewExtension, maxFileSize: 10485760 * 5 },
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
                    _Load();
                });

                function _Upload(e) {
                    for (var i = 0; i < e.files.length; i++) {
                        var obj = Utils.validateFile(e.files[i], appConfig.allowExpertInterviewExtension);
                        if (obj.extension && obj.size) {
                            var file = e.files[i].rawFile;
                            var isPhoto = Utils.validateFile(e.files[i], appConfig.allowImageExtension).extension;
                            if (file) {
                                var fd = new FormData();
                                fd.append("attachment", file);
                                ExpertInterviewApi.uploadAttachment(0, fd).then(function (res) {
                                    $scope.Attachments.push({
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
                    var obj = $scope.Attachments[idx];
                    URL.revokeObjectURL(obj.result);
                    $scope.Attachments.splice(idx, 1);
                    _Load();
                };

                function _Load() {
                    ExpertInterviewService.loadImages(_.filter($scope.Attachments, function (o) {
                        return o.isPhoto;
                    }));
                    $rootScope.$broadcast('LoadImages', $scope.Attachments);
                };

                function _SetCoverImage(att) {
                    if ($scope.Attachments != null) {
                        var coverIndex = -1;
                        for (var i = 0; i < $scope.Attachments.length; i++) {
                            if ($scope.Attachments[i].id == att.id) {
                                coverIndex = i;
                            }
                            $scope.Attachments[i].isCoverImage = false;
                        }
                        if (coverIndex != -1) {
                            $scope.Attachments[coverIndex].isCoverImage = true;
                        }
                    }
                    $rootScope.$broadcast('LoadImages', $scope.Attachments);
                };

                $scope.Upload = _Upload;
                $scope.Prevent = _Prevent;
                $scope.Remove = _Remove;
                $scope.SetCoverImage = _SetCoverImage;
            },
            templateUrl: 'app/main/apps/expert-interview/_directives/attachment-expert-interview.html',
        };
    }
})();
