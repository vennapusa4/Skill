(function () {
    'use strict';

    angular
        .module('app.insights')
        .factory('InsightsCommonService', InsightsCommonService);

    /** @ngInject */
    function InsightsCommonService(Utils, $location, $state, $rootScope, InsightsApi) {
        // Declare Variables
        var segmentLabels = {};
        var auditLogs = [];
        var inputSearch = {};

        function defaultAllUser() {
            return {
                id: 0,
                name: 'All',
                text: 'All',
                segmentTypeL1: 'All',
                segmentTypeL2: '',
                value: 0,
                percentage: '100%'
            };
        }
        // Export PDF
        function exportPDF(element, fileName) {
            kendo.drawing.drawDOM($(element))
                .then(function (group) {
                    return kendo.drawing.exportPDF(group, {
                        paperSize: "auto",
                        margin: { left: "1cm", top: "1cm", right: "1cm", bottom: "1cm" }
                    });
                })
                .done(function (data) {
                    // Save the PDF file
                    kendo.saveAs({
                        dataURI: data,
                        fileName: fileName + '.pdf',
                        proxyURL: "https://demos.telerik.com/kendo-ui/service/export"
                    });
                });
        }

        // Export Excel
        function exportExcel(type) {
            InsightsApi.getGlobalReport(type).then(function (data) {
                // debugger
            }, function (error) {
                console.log(error);
            });
        }

        // Segment Labels section
        function clearSegmentLabels() {
            segmentLabels = {};// angular.copy(value);
        }
        function getSegmentLabels(path) {
            return _.get(segmentLabels, path);
        }
        function getAllSegmentLabels() {
            return segmentLabels;
        }
        function setSegmentLabels(value) {
            _.set(segmentLabels, path, value);
        }
        function setAllSegmentLabels(value) {
            segmentLabels = value;
            localStorage.setItem("skillSegmentsSelected", JSON.stringify(value));
        }
        function getInputSearch() {
            return inputSearch;
        }
        function setInputSearch(value) {
            inputSearch = value;
        }

        // Audit Log section
        function clearAuditLogs() {
            auditLogs = []; //angular.copy(value);
        }
        function getAuditLogs(path) {
            return _.get(auditLogs, path);
        }
        function setAuditLogs(path, value) {
            _.set(auditLogs, path, value);
        }

        // Common function
        function getQuarter(date) {
            var quarter = Math.floor((date.getMonth() + 3) / 3);
            return quarter;
        }
        //Comment below function and replace to display 2 decimal point for value.
        //function kmlFormatter(num, tofixed) {
        //  var result = num > 999 ? (num / 1000).toFixed(3) + 'k' : num;
        //  if (num >= 1000000000) {
        //    return (num / 1000000000).toFixed(3) + 'b';
        //  } else {
        //    if (num >= 1000000) {
        //      return (num / 1000000).toFixed(3) + 'm';
        //    } else {
        //      if (num >= 1000) {
        //        return (num / 1000).toFixed(3) + 'k';
        //      } else {
        //        return num;
        //      }
        //    }
        //  }
        //  return result;
        //}
        function kmlFormatter(num, tofixed) {
            var result = num > 999 ? (num / 1000).toFixed(2) + 'k' : num;
            if (num >= 1000000000) {
                return (num / 1000000000).toFixed(2) + 'b';
            } else {
                if (num >= 1000000) {
                    return (num / 1000000).toFixed(2) + 'm';
                } else {
                    if (num >= 1000) {
                        return (num / 1000).toFixed(2) + 'k';
                    } else {
                        return num;
                    }
                }
            }
            return result;
        }
        function dateTimeToText(str) {
            try {
                var date = new Date(str);
                var seconds = Math.floor((new Date() - date) / 1000);

                var interval = Math.floor(seconds / 31536000);

                if (interval > 1) {
                    return interval + " years ago";
                }
                interval = Math.floor(seconds / 2592000);
                if (interval > 1) {
                    return interval + " months ago";
                }
                interval = Math.floor(seconds / 86400);
                if (interval > 1) {
                    return interval + " days ago";
                }
                interval = Math.floor(seconds / 3600);
                if (interval > 1) {
                    return interval + " hours ago";
                }
                interval = Math.floor(seconds / 60);
                if (interval > 1) {
                    return interval + " minutes ago";
                }
                if (interval < 0) {
                    return date;
                }
                return Math.floor(seconds) + " seconds ago";
            } catch (e) {
                return str;
            }
        }

        // Integration KD
        function applyFilter(fromDate, toDate, segmentSelected, filter, stateName) {
            var tempArr = [];
            var segmentItems = getAllSegmentLabels();
            if (segmentSelected != null) {
                tempArr.push(segmentSelected);
                segmentItems = tempArr;
            }

            var filterSources = {
                CoPs: [],
                Authors: [],
                Contributors: [],
                Departments: [],
                Disciplines: [],
                Divisions: [],
                Subdisciplines: [],
                Skills: [],
                fromDate: fromDate,
                toDate: toDate,
            };

            if (filter) {
                filterSources = _.extend(filterSources, filter)
            }

            if (segmentSelected) {
                switch (segmentSelected.segmentTypeL1) {
                    case 'CoP':
                        filterSources.CoPs.push({ name: segmentSelected.name, id: segmentSelected.id });
                        break;
                    case 'Discipline':
                        filterSources.Disciplines.push({ name: segmentSelected.segmentTypeL2Name, id: segmentSelected.segmentTypeL2 });
                        filterSources.Subdisciplines.push({ name: segmentSelected.name, id: segmentSelected.id });
                        break;
                    case 'Division':
                        filterSources.Divisions.push({ name: segmentSelected.segmentTypeL2Name, id: segmentSelected.segmentTypeL2 });
                        filterSources.Departments.push({ name: segmentSelected.name, id: segmentSelected.id });
                        break;
                    default:
                        break;
                }
            }

            setInputSearch(filterSources);
            if (stateName) {
                $state.go(stateName);
            } else {
                $state.go('app.knowledgeDiscovery.allKnowledge');
            }
        }

        // Master data
        function applyFilterForMasterData(x, category, pageId) {

            var arrCoPItems = [];
            var arrCoPCategoryItems = [];
            var arrDisciplineItems = [];
            var arrEquipmentItems = [];
            var arrKeywordItems = [];
            var arrProjectItems = [];
            var arrSubDisciplineItems = [];
            var arrWellsItems = [];
            var arrWellsOperationItems = [];
            var arrWellsPhaseItems = [];
            var arrKDRatingCommentsItems = [];
            var arrBusinessSectorsItems = [];

            switch (category) {
                case 'CoPs': {
                    arrCoPItems.push({ name: x.name, id: x.id });
                    break;
                }
                case 'CoPCaegory': {
                    arrCoPCategoryItems.push({ name: x.name, id: x.id });
                    break;
                }
                case 'Disciplines': {
                    arrDisciplineItems.push({ name: x.name, id: x.id });
                    break;
                }
                case 'Equipments': {
                    arrEquipmentItems.push({ name: x.name, id: x.id });
                    break;
                }
                case 'Keywords': {
                    arrKeywordItems.push({ name: x.name, id: x.id });
                    break;
                }
                case 'Projects': {
                    arrProjectItems.push({ name: x.projectName, id: x.id });
                    break;
                }
                case 'Subdisciplines': {
                    arrSubDisciplineItems.push({ name: x.disciplineName, id: x.id });
                    break;
                }
                case 'Wells': {
                    arrWellsItems.push({ name: x.name, id: x.id });
                    break;
                }
                case 'WellsOperations': {
                    arrWellsOperationItems.push({ name: x.name, id: x.id });
                    break;
                }
                case 'WellsPhase': {
                    arrWellsPhaseItems.push({ name: x.wellPhaseName, id: x.id });
                    break;
                }
                case 'KDRatingComments': {
                    arrKDRatingCommentsItems.push({ name: x.wellPhaseName, id: x.id });
                    break;
                }
                case 'BusinessSectors': {
                    arrBusinessSectorsItems.push({ name: x.wellPhaseName, id: x.id });
                    break;
                }
                default:
                    break;
            }

            var input = {
                CoPs: arrCoPItems,
                CoPCategory: arrCoPCategoryItems,
                Disciplines: arrDisciplineItems,
                Equipments: arrEquipmentItems,
                Keywords: arrKeywordItems,
                Projects: arrProjectItems,
                Subdisciplines: arrSubDisciplineItems,
                Wells: arrWellsItems,
                WellsOperations: arrWellsOperationItems,
                WellsPhase: arrWellsPhaseItems,
                KDRatingComments: arrKDRatingCommentsItems,
                arrBusinessSectorsItems:arrBusinessSectorsItems
            };
            setInputSearch(input);
            switch (pageId) {
                case 1: {
                    $state.go('app.knowledgeDiscovery.allKnowledge');
                    break;
                }
                case 2: {
                    $state.go('app.knowledgeDiscovery.lessonsLearnt');
                    break;
                }
                case 3: {
                    $state.go('app.knowledgeDiscovery.bestPractices');
                    break;
                }
                case 4: {
                    $state.go('app.knowledgeDiscovery.publications');
                    break;
                }
                default:
                    $state.go('app.knowledgeDiscovery.allKnowledge');
                    break;
            }
        }

        function bindDataTomap(data) {

            var mapData = [];
            _.each(data, function (x, xIndex) {
                if (x.latitude != null && x.longitude != null) {
                    mapData.push({
                        locationId: x.locationId,
                        locationName: x.locationName,
                        location: [x.latitude, x.longitude],
                        shape: "pinTarget",
                        tooltip: {
                            content: x.locationTypeName + ': ' + x.locationName,
                        }
                    });
                }
            });
            var xMap = $("#map").kendoMap({
                center: [4.2105, 101.9758],
                zoom: 4,
                layers: [{
                    type: "tile",
                    urlTemplate: "https://tile.thunderforest.com/transport/#= zoom #/#= x #/#= y #.png?apikey=8373a9f2422b42ea8852bebb8a602fca",
                    subdomains: ["a", "b", "c"],
                }],
                markers: mapData,
                markerClick: clicked,
            });
            function clicked(e) {
                try {
                    var currentStateName = $state.current.name;
                    var newState = '';

                    if (currentStateName.indexOf('Filter') != -1) {
                        newState = currentStateName.replace('Filter', '');
                    } else {

                        newState = currentStateName + 'Filter';
                    }
                    $('.k-popup').hide();
                    $rootScope.$broadcast('SetLayoutAfterFilter');
                    var id = e.marker.options.locationId;
                    var name = e.marker.options.locationName;

                    var filter = {
                        Locations: []
                    }
                    if (id != null && id != 0) {
                        filter.Locations.push({
                            name: name,
                            id: id
                        });
                    }
                    applyFilter(null, null, null, filter, newState);
                } catch (ex) {
                    console.log(ex);
                }
            }
        }

        return {
            defaultAllUser: defaultAllUser,
            exportPDF: exportPDF,
            exportExcel: exportExcel,

            clearSegmentLabels: clearSegmentLabels,
            getSegmentLabels: getSegmentLabels,
            getAllSegmentLabels: getAllSegmentLabels,
            setSegmentLabels: setSegmentLabels,
            setAllSegmentLabels: setAllSegmentLabels,

            clearAuditLogs: clearAuditLogs,
            getAuditLogs: getAuditLogs,
            setAuditLogs: setAuditLogs,

            getQuarter: getQuarter,
            kmlFormatter: kmlFormatter,
            dateTimeToText: dateTimeToText,

            getInputSearch: getInputSearch,
            setInputSearch: setInputSearch,
            applyFilter: applyFilter,
            applyFilterForMasterData: applyFilterForMasterData,
            bindDataTomap: bindDataTomap
        };
    }

})();
