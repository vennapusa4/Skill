(function () {
    'use strict';

    angular
        .module('app.core')
        .filter('removeHTML', removeHTML);

    /** @ngInject */
    function removeHTML() {
        return removeHTMLFilter;

        function removeHTMLFilter(text) {
            return  text ? String(text).replace(/<[^>]+>/gm, '') : '';;
        }
    }

})();