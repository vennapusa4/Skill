(function () {
    'use strict';

    angular
        .module('app.email')
        .controller('TypeOfEmailController', TypeOfEmailController);

    /** @ngInject */
    function TypeOfEmailController(EmailApi, logger) {
        var vm = this;

        vm.emailItems = [];
        // Get all Email from Server
        vm.GetAll = function () {

            EmailApi.getAll().then(function (data) {
                vm.emailItems = data;
            });
        }
        vm.GetAll();

        vm.Save = function (dataItem) {

            EmailApi.save(dataItem.templateName, dataItem.subject, dataItem.bodyContent).then(function (data) {

                logger.success('Save success!', 'SKILL');
            });
        }
    }
})();