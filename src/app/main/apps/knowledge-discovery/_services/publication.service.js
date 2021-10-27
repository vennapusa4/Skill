(function () {
    'use strict';

    angular
        .module('app.knowledgeDiscovery')
        .factory('PublicationService', publicationService);

    /** @ngInject */
    function publicationService(SkillService) {
        var source = {};

        this.GetS = function (path) {
            return angular.copy(_.get(source, path));
        };

        this.SetS = function (path, value) {
            _.set(source, path, value);
            return true;
        };

        this.TransformDateValue = function(value) {
            try {
                var reg = /(0[1-9]|[12][0-9]|3[01])[- /.](0[1-9]|1[012])[- /.](19|20)\d\d/;
                if (value.match(reg)) {
                    return moment(value, 'DD/MM/YYYY').toDate();
                } else {
                    return value;
                }
            } catch (e) {
                return value;
            }
        }

        this.Model = {
            "sourceId": 0,
            "asCoverImage": null,
            "extensionImage": null,
            "coverId": 0,
            "attachments": [],
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
            'businessSectors' : [],
            'businessSectorTypeIds':[],
            "additionalEquipments": [],
            "additionalKeyWords": [],
            "authors": [],
            "copId": 0,
            "locationId": 0,
            "referenceKdIds" :[]
        };
        
        return angular.extend(this, SkillService);
    }

})();
