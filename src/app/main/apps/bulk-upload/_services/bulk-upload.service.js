(function () {
    'use strict';

    angular
        .module('app.bulkUpload')
        .factory('BulkUploadService', bulkUploadService);

    /** @ngInject */
    function bulkUploadService(SkillService) {
        var assign = {};
        var currentSource = "";

        this.setCurrentSource = function (val) {
            currentSource = val;
            console.log("xxxxxxxxxxxxx-Field.SourceId: " + val);
        };
        this.getCurrentSource = function () {
            return currentSource;
        };

        this.setAssign = function (path, val) {
            _.set(assign, path, val);
        };

        this.getAssign = function (path) {
            return _.get(assign, path);
        };

        this.clearAssign = function () {
            assign = {};
        };

        this.setAssignList = function (val) {
            _.set(assign, "AssignList", val);
        };

        this.getAssignList = function () {
            return _.get(assign, "AssignList");
        };
        this.setBusinessSectorList = function (val) {
            _.set(assign, "BusinessSectors", val);
        };

        this.getBusinessSectorList = function () {
            return _.get(assign, "BusinessSectors");
        };

        return angular.extend(this, SkillService);
    }

})();
