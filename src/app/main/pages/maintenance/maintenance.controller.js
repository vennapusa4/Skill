(function ()
{
    'use strict';

    angular
        .module('app.pages.maintenance')
        .controller('MaintenanceController', MaintenanceController);

    /** @ngInject */
    function MaintenanceController()
    {
        var vm = this;

        // Data
        vm.themes = fuseTheming.themes;

        // Methods

        //////////
    }
})();