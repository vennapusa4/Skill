(function () {
    'use strict';

    angular
        .module('app.bulkUpload')
        .controller('BulkUploadUploadController', BulkUploadUploadController);

    /** @ngInject */
    function BulkUploadUploadController($scope, $stateParams) {
        var vm = this;
        $scope.Type = decodeURIComponent($stateParams.type);
        function _Download() {
            var fileData = localStorage['bulk-upload-template'];
            var fileName = localStorage['bulk-upload-templatename'];
            if (!_.isEmpty(fileData)) {
                var blob = b64toBlob(fileData, 'application/vnd.ms-excel');
                saveAs(blob, fileName + '.xlsx');
            }
        };

        function _Proceed() {
            $scope.$broadcast('Proceed', { id: $stateParams.shareId, title: $stateParams.shareTitle});
        };

        $scope.$on("changePage", function (data, redirect) {
            $scope.redirecting = redirect;
            $timeout(function () {
              $('#redirectPosting').modal('show');
            }, 500);
          });
      
          $scope.confirmRedirect = function () {
            $('#redirectPosting').modal('hide');
            $timeout(function () {
              $state.go($scope.redirecting);
            }, 500);
          }

        function b64toBlob(b64Data, contentType, sliceSize) {
            contentType = contentType || '';
            sliceSize = sliceSize || 512;

            var byteCharacters = atob(b64Data);
            var byteArrays = [];

            for (var offset = 0; offset < byteCharacters.length; offset += sliceSize) {
                var slice = byteCharacters.slice(offset, offset + sliceSize);

                var byteNumbers = new Array(slice.length);
                for (var i = 0; i < slice.length; i++) {
                    byteNumbers[i] = slice.charCodeAt(i);
                }

                var byteArray = new Uint8Array(byteNumbers);

                byteArrays.push(byteArray);
            }

            var blob = new Blob(byteArrays, { type: contentType });
            return blob;
        };

        $scope.Proceed = _Proceed;
        $scope.Download = _Download;
    }
})();
