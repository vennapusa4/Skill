/**
 * @author v.lugovksy
 * created on 16.12.2015
 */
(function () {
  'use strict';

  angular.module('app.collection')
    .directive('uploadImage', uploadImage);

  /** @ngInject */
  function uploadImage(CollectionApi) {
    return {
      restrict: 'AE',
      scope: {
        onUploaded: "&onUploaded"
      },
      controller: function ($scope) {
        $scope.CoverImage = {};
        $scope.k_options = {
          multiple: false,
          localization: {
            dropFilesHere: "<i class='icon-drop'></i><br>Drag and drop files here to upload",
            select: 'or select file to upload...'
          },
          validation: { allowedExtensions: ['jpg', 'png'], maxFileSize: 10485760 },
          async: { saveUrl: 'save', removeUrl: 'remove', autoUpload: true },
          showFileList: false
        };

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
            var file = e.files[i].rawFile;
            if (file) {
              var fd = new FormData();
              fd.append("attachment", file);
              CollectionApi.uploadAttachment(1, fd).then(function (res) {
                $scope.CoverImage = {
                  result: res.result,
                  id: res.id,
                  name: res.name,
                  size: res.size,
                  isAttachment: false
                };

                if (typeof ($scope.onUploaded) == 'function') {
                  $scope.onUploaded({ data: $scope.CoverImage });
                }
              });
            }
          }
        };

        function _Prevent(e) {
          e.preventDefault();
        };

        function _Use(img) {
          $scope.CoverImage = img;
        };

        $scope.Upload = _Upload;
        $scope.Prevent = _Prevent;
        $scope.Use = _Use;
      },
      templateUrl: 'app/main/apps/collection/_directives/cover-image.html',
    };
  }
})();
