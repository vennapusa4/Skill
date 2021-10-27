(function () {
    'use strict';

    angular
        .module('app.insights')
        .controller('InsightsController', InsightsController);

    /** @ngInject */
    function InsightsController() {
        var vm = this;
    }
})();