(function () {
    'use strict';

    angular.module('app.home')
        .filter('fileSize', fileSize);

    function fileSize() {
        return function (value) {
            return (value > 10000) ? (parseFloat(value / 1024000).toFixed(2) + " mb") : (parseFloat(value / 1000).toFixed(2) + " kb");
        }
    }
})();