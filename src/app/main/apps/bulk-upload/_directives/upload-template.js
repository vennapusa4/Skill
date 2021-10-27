/**
 * @author v.lugovksy
 * created on 16.12.2015
 */
(function () {
    'use strict';

    angular.module('app.bulkUpload')
        .directive('uploadTemplate', uploadTemplate);

    /** @ngInject */
    function uploadTemplate(BulkUploadApi, logger) {
        return {
            restrict: 'AE',
            scope: {
                proceed: '=',
                valid: '=',
                sharedid: '@',
                sharedtitle: '@',
            },
            controller: function ($scope, $state) {
                var fd = null;
                $scope.Templates = [];
                $scope.valid = false;
                $scope.k_options = {
                    multiple: false,
                    localization: {
                        dropFilesHere: "<i class='icon-drop'></i><br>Drag and drop files here to upload",
                        select: 'or select file to upload...'
                    },
                    validation: { allowedExtensions: ['xls', 'xlsx'], maxFileSize: 10485760 },
                    async: { saveUrl: 'save', removeUrl: 'remove', autoUpload: true },
                    showFileList: false
                };

                $scope.$on('Proceed', function (event, data) {
                    _Proceed(data);
                });

                function _Select(e) {
                    for (var i = 0; i < e.files.length; i++) {
                        var file = e.files[i].rawFile;
                        if (file) {
                            fd = new FormData();
                            fd.append("attachment", file);
                            $scope.Templates = [];
                            $scope.valid = true;
                            $scope.Templates.push({ name: file.name, size: file.size });
                            $scope.$apply();
                        }
                    }
                };

                function _Remove() {
                    $scope.Templates = [];
                    $scope.valid = false;
                    fd = null;
                };

                function _Prevent(e) {
                    e.preventDefault();
                };

                function _Proceed(data) {
                    if (fd !== null) {
                        BulkUploadApi.api.Import.save({}, fd).$promise.then(function (res) {
                            var first = _.head(res);
                            if (!_.isEmpty(first)) {
                                logger.success('Import data successfully')
                                localStorage.removeItem('bulk-upload-template');

                                if (data != null && data != '') {
                                    try {
                                        $scope.sharedid = parseInt(data.id);
                                        $scope.sharetitle = data.title;
                                    } catch (e) {
                                        $scope.sharedid = 0;
                                        $scope.sharetitle = '';
                                    }
                                }
                                $state.go('app.bulkUpload.review', { batchNumber: decodeURIComponent(first.batchNum), shareId: $scope.sharedid, shareTitle: $scope.sharetitle });
                            } else {
                                logger.error('No record imported.');
                            }
                        }, function (err) {
                            var errorMessage=err.data.errorMessage;
                            if(err.data.exception!=null)
                            {
                                errorMessage=errorMessage+":"+err.data.exception.Message;
                            }
                            logger.error(errorMessage);
                        });
                    }
                };


                $scope.Select = _Select;
                $scope.Remove = _Remove;
                $scope.Prevent = _Prevent;
                $scope.Proceed = _Proceed;
            },
            templateUrl: 'app/main/apps/bulk-upload/_directives/upload-template.html',
        };
    }
})();
