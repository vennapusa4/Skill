(function () {
    'use strict';

    angular
      .module('app.featuredSlides')
      .factory('AdminFeaturedSlidesService', AdminFeaturedSlidesService);

    /** @ngInject */
    function AdminFeaturedSlidesService() {
        var images = [];
        function loadImages(imgs) {
            images = angular.copy(imgs);
        }

        function getImages() {
            return angular.copy(images);
        }

        function transform(data, headers) {
            var contentDisposition = headers('Content-Disposition');
            var dict = _.fromPairs(_.map(_.split(contentDisposition, ';'), function (o) {
                return _.trim(o).split('=');
            }));
            var fileId = dict['id'];
            var fileName = dict['fileName'] ? decodeURIComponent(dict['fileName'].replace(new RegExp(/\+/g), " ")) : '';
            var fileUrl = dict['imageUrl'] || '';
            return {
                result: decodeURIComponent(fileUrl),
                id: parseInt(fileId),
                name: fileName,
                size: data.size
            };
        }

        return {
            loadImages: loadImages,
            getImages: getImages,
            transform: transform
        };
    }

})();
