/**
 * @author v.lugovksy
 * created on 16.12.2015
 */
(function () {
    'use strict';

    angular.module('app.knowledgeDiscovery')
        .directive('videoAttachment', videoAttachment);

    /** @ngInject */
    function videoAttachment(KnowledgeService, Utils, SearchApi, UserProfileApi, appConfig) {
        return {
            restrict: 'AE',
            scope: {
            },
            controller: function ($scope, $rootScope, $timeout) {
                $scope.Attachments = [];
    
                $scope.k_options = {
                    multiple: true,
                    localization: {
                        dropFilesHere: "<i class='icon-drop'></i><br>Drag and drop files here to upload",
                        select: 'or select file to upload...'
                    },
                    validation: { allowedExtensions: [ 'mp4'], maxFileSize: 10485760 },
                    // async: { saveUrl: 'save', removeUrl: 'remove', autoUpload: true },
                    showFileList: true
                };

            },
            templateUrl: 'app/main/apps/knowledge-discovery/_directives/video-attachment.html',
        };
    }
})();
