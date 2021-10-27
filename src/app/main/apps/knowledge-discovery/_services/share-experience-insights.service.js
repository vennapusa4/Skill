(function () {
    'use strict';

    angular
        .module('app.knowledgeDiscovery')
        .factory('ShareExperienceInsightsService', ShareExperienceInsightsService);

    /** @ngInject */
    function ShareExperienceInsightsService(SkillService) {
        var source = {};

        this.GetS = function (path) {
            return angular.copy(_.get(source, path));
        };

        this.SetS = function (path, value) {
            _.set(source, path, value);
            return true;
        };

        this.Model = {
            "sourceId": 0,
            "asCoverImage": null,
            "extensionImage": null,
            "coverId": 0,
            "title": null,
            "articleTitle": null,
            "newspaperName": null,
            "magazineName": null,
            "bookTitle": null,
            "author": null,
            "publishDate": null,
            "isbn": null,
            "summary": null,
            "url": null,
            "eventName": null,
            "eventYear": 0,
            "eventId": 0,
            "digitalMediaTypeId": 0,
            "pubMonth": 0,
            "pubYear": 0,
            "countryId": 0,
            "societyId": 0,
            "audienceLevelId": 0,
            "additionalProjects": [],
            "additionalWells": [],
            "additionalEquipments": [],
            "additionalKeyWords": [],
            "authors": [],
            "copId": 0,
            "locationId": 0,
            "knowledgeDocumentRefs": [],
        };
        
        return angular.extend(this, SkillService);
    }

})();
