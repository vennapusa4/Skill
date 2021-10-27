(function () {
    'use strict';

    angular
        .module('app.insights')
        .factory('InsightsApi', InsightsApi);

    /** @ngInject */
    function InsightsApi($resource, appConfig, $http, $q) {
        var $q = $q;

        var api = {
            // segment
            getAllSegmentTypes: $resource(appConfig.SkillApi + 'api/Insights/SegmentTypeL1'),
            getAllDisciplines: $resource(appConfig.SkillApi + 'api/Insights/SegmentTypeL2/:id'),
            searchSegmentSuggestions: $resource(appConfig.SkillApi + 'api/Insights/SearchSegmentItem', {}, {
                save: { method: 'POST', isArray: true }
            }),
            saveSegment: $resource(appConfig.SkillApi + 'api/Insights/Overview/People/SaveSegment'),
            loadDataForTopLabels: $resource(appConfig.SkillApi + 'api/Insights/SegmentLabel'),
            loadDataForTopLabelsValue: $resource(appConfig.SkillApi + 'api/Insights/SegmentLabel/Value'),
            getSegmentKDSummary: $resource(appConfig.SkillApi + 'api/Insights/SegmentKDSummary'),
            getSegmentValueSummary: $resource(appConfig.SkillApi + 'api/Insights/SegmentValueSummary'),
            getSegmentPeopleSummary: $resource(appConfig.SkillApi + 'api/Insights/SegmentPeopleSummary'),
            loadDataForTopLabelsPeople: $resource(appConfig.SkillApi + 'api/Insights/SegmentLabel/People'),

            // overview
            getOverviewKnowledgeData: $resource(appConfig.SkillApi + 'api/Insights/Overview/Knowledge'),
            getOverviewCreationData: $resource(appConfig.SkillApi + 'api/Insights/Overview/CreationValue'),
            getOverviewContributionCreationData: $resource(appConfig.SkillApi + 'api/Insights/Overview/Knowledge/Contribution'),
            getOverviewValueData: $resource(appConfig.SkillApi + 'api/Insights/Overview/Value'),
            getOverviewPeopleData: $resource(appConfig.SkillApi + 'api/Insights/Overview/People/RightNow', {}, {
                save: { method: 'GET', isArray: false }
            }),
            getOverviewConnectionData: $resource(appConfig.SkillApi + 'api/Insights/Overview/People/TotalConnection', {}, {
                save: { method: 'GET', isArray: true }
            }),
            getOverviewRecentActivitieData: $resource(appConfig.SkillApi + 'api/Insights/Overview/People/RecentActivitie', {}, {
                save: { method: 'GET', isArray: true }
            }),

            // knowledge
            getTopTrendingKnowledge: $resource(appConfig.SkillApi + 'api/Insights/Knowledge/MostEngagement', {}, {
                save: { method: 'POST', isArray: true }
            }),
            getTrendingTopics: $resource(appConfig.SkillApi + 'api/Insights/Knowledge/TrendingTopics', {}, {
                save: { method: 'POST', isArray: true }
            }),
            getKnowledgeEngagement: $resource(appConfig.SkillApi + 'api/Insights/Knowledge/Engagement', {}, {
                save: { method: 'POST', isArray: true }
            }),
            getLatestContributors: $resource(appConfig.SkillApi + 'api/Insights/Knowledge/LatestContributor', {}, {
                save: { method: 'POST', isArray: true }
            }),
            getKnowledgeAddedVsValidated: $resource(appConfig.SkillApi + 'api/Insights/Knowledge/NewKnowledge', {}, {
                save: { method: 'POST', isArray: true }
            }),
            getKnowledgeAddedVsValidatedChart: $resource(appConfig.SkillApi + 'api/Insights/Knowledge/NewKnowledge/Chart', {}, {
                save: { method: 'POST', isArray: false }
            }),
            getKnowledgeContribution: $resource(appConfig.SkillApi + 'api/Insights/Knowledge/Contribution', {}, {
                save: { method: 'POST', isArray: true }
            }),
            getDataByLocation: $resource(appConfig.SkillApi + 'api/Insights/Knowledge/ByLocation', {}, {
                save: { method: 'POST', isArray: true }
            }),

            // value
            getTopValue: $resource(appConfig.SkillApi + 'api/Insights/Value/TopValue', {}, {
                save: { method: 'POST', isArray: true }
            }),
            getTopReplications: $resource(appConfig.SkillApi + 'api/Insights/Value/TopReplication', {}, {
                save: { method: 'POST', isArray: true }
            }),
            getValueCreation: $resource(appConfig.SkillApi + 'api/Insights/Value/ValueCreation', {}, {
                save: { method: 'POST', isArray: true }
            }),
            getExperienceValue: $resource(appConfig.SkillApi + 'api/Insights/Value/ExperienceValue', {}, {
                save: { method: 'POST', isArray: true }
            }),
            getReplicationValue: $resource(appConfig.SkillApi + 'api/Insights/Value/ReplicationValue', {}, {
                save: { method: 'POST', isArray: true }
            }),
            getExperienceValueBreakdown: $resource(appConfig.SkillApi + 'api/Insights/Value/ValueBreakdown', {}, {
                save: { method: 'POST', isArray: true }
            }),
            getValueDataByLocation: $resource(appConfig.SkillApi + 'api/Insights/Value/ByLocation', {}, {
                save: { method: 'POST', isArray: true }
            }),

            // people
            getTopEngagedUsers: $resource(appConfig.SkillApi + 'api/Insights/People/TopEngagedUsers', {}, {
                save: { method: 'POST', isArray: true }
            }),
            getTopContributors: $resource(appConfig.SkillApi + 'api/Insights/People/TopContributors', {}, {
                save: { method: 'POST', isArray: true }
            }),
            getPeopleKnowledgeContribution: $resource(appConfig.SkillApi + 'api/Insights/People/KnowledgeContribution', {}, {
                save: { method: 'POST', isArray: true }
            }),
            getPeopleTotalContributors: $resource(appConfig.SkillApi + 'api/Insights/People/TotalContributors', {}, {
                save: { method: 'POST', isArray: true }
            }),
            getGetContributorInfoById: $resource(appConfig.SkillApi + 'api/Insights/People/GetContributorInfo/:id'),
            getActiveLocationDetail: $resource(appConfig.SkillApi + 'api/Location/ActiveLocation/Details?locationId=:id'),
            getKnowledgeSubmission: $resource(appConfig.SkillApi + 'api/Insights/Knowledge/Submission', {}, {
                save: { method: 'POST', isArray: true }
            }),

            // audit logs
            getAuditLogs: $resource(appConfig.SkillApi + 'api/ExportInsight/GetAllExportInsight', {}, {
                save: { method: 'POST', isArray: true }
            }),
            getAuditLogsToExcel: $resource(appConfig.SkillApi + 'api/ExportInsight/ToExcel/AuditLogs', {}, {
                save: { method: 'POST', isArray: true }
            }),

            // Export 
            insertAuditLogs: $resource(appConfig.SkillApi + 'api/ExportInsight/Export', {}, {
                save: { method: 'POST', isArray: false }
            }),


            testExport: $resource(appConfig.SkillApi + 'api/ExportInsight/ToExcel/TopTrendingKnowledge', {}, {
                save: { method: 'POST', isArray: true }
            }),

            getIK_TopTrendingKnowledgeToExcel: $resource(appConfig.SkillApi + 'api/ExportInsight/ToExcel/TopTrendingKnowledge', {}, {
                save: { method: 'POST', isArray: true }
            }),

            getP_TopContributorsToExcel: $resource(appConfig.SkillApi + 'api/ExportInsight/ToExcel/TopContributors', {}, {
                save: { method: 'POST', isArray: true }
            }),
            getP_TopEngagedUsersToExcel: $resource(appConfig.SkillApi + 'api/ExportInsight/ToExcel/TopEngagedUsers', {}, {
                save: { method: 'POST', isArray: true }
            }),

            getV_TopValueCreationToExcel: $resource(appConfig.SkillApi + 'api/ExportInsight/ToExcel/TopValueCreation', {}, {
                save: { method: 'POST', isArray: true }
            }),
            getV_TopReplicationsToExcel: $resource(appConfig.SkillApi + 'api/ExportInsight/ToExcel/TopReplications', {}, {
                save: { method: 'POST', isArray: true }
            }),

            // Location
            getListLocationByKnowledge: $resource(appConfig.SkillApi + 'api/Location/GetListLocationByKnowledge'),
            getActiveLocation: $resource(appConfig.SkillApi + 'api/Location/ActiveLocation'),
            getLocationOnMap: $resource(appConfig.SkillApi + 'api/Location/GetLocationOnMap', {}, {
                save: { method: 'POST', isArray: true }
            }),

            getGlobalReport: $resource(appConfig.SkillApi + 'api/Insights/Report/:type', {}, {
                get: {
                    method: 'GET',
                    isArray: false,
                    headers: {
                        'Accept': 'application/octet-stream'
                    },
                    responseType: 'blob',
                    cache: false,
                    transformResponse: function (data, headers) {
                        var contentType = headers('Content-Type');
                        var disposition = headers('Content-Disposition');
                        var defaultFileName = "download";
                        if (disposition) {
                            var match = disposition.match(/.*filename=\"?([^;\"]+)\"?.*/);
                            if (match[1])
                                defaultFileName = match[1];
                        }
                        defaultFileName = defaultFileName.replace(/[<>:"\/\\|?*]+/g, '_');
                        var file = new Blob([data], {
                            type: contentType
                        });
                        saveAs(file, defaultFileName);
                    }
                }
            }),
        };

        // segment
        function allSegmentTypes() {
            var deferred = $q.defer();
            api.getAllSegmentTypes.query({}, function (data) {
                deferred.resolve(data);
            }, function (data) {
                deferred.reject(data);
            });
            return deferred.promise;
        }
        function allDisciplines(id) {
            var deferred = $q.defer();
            api.getAllDisciplines.query({ id: id }, function (data) {
                deferred.resolve(data);
            }, function (data) {
                deferred.reject(data);
            });
            return deferred.promise;
        }
        function saveSegment(segmentType, discipline) {
            var deferred = $q.defer();
            api.saveSegment.save({}, { SegmentType: segmentType, Discipline: discipline }, function (data) {
                deferred.resolve(data);
            }, function (data) {
                deferred.reject(data);
            });
            return deferred.promise;
        }
        function searchSegmentSuggestions(options, data) {
            api.searchSegmentSuggestions.save(data).$promise.then(function (res) {
                options.success(res);
            }, function (err) {
                options.error(err);
            });
        }
        function loadDataForTopLabels(input) {
            var deferred = $q.defer();
            api.loadDataForTopLabels.save({}, { SegmentItems: input }, function (data) {
                deferred.resolve(data);
            }, function (data) {
                deferred.reject(data);
            });
            return deferred.promise;
        }
        function loadDataForTopLabelsValue(input) {
            var deferred = $q.defer();
            api.loadDataForTopLabelsValue.save({}, { SegmentItems: input }, function (data) {
                deferred.resolve(data);
            }, function (data) {
                deferred.reject(data);
            });
            return deferred.promise;
        }
        function getSegmentKDSummary(input) {
            var deferred = $q.defer();
            api.getSegmentKDSummary.save({}, { segmentItems: input }, function (data) {
                deferred.resolve(data);
            }, function (data) {
                deferred.reject(data);
            });
            return deferred.promise;
        }
        function getSegmentValueSummary(input) {
            var deferred = $q.defer();
            api.getSegmentValueSummary.save({}, { segmentItems: input }, function (data) {
                deferred.resolve(data);
            }, function (data) {
                deferred.reject(data);
            });
            return deferred.promise;
        }
        function getSegmentPeopleSummary(input) {
            var deferred = $q.defer();
            api.getSegmentPeopleSummary.save({}, { segmentItems: input }, function (data) {
                deferred.resolve(data);
            }, function (data) {
                deferred.reject(data);
            });
            return deferred.promise;
        }
        function loadDataForTopLabelsPeople(input) {
            var deferred = $q.defer();
            api.loadDataForTopLabelsPeople.save({}, { SegmentItems: input }, function (data) {
                deferred.resolve(data);
            }, function (data) {
                deferred.reject(data);
            });
            return deferred.promise;
        }

        // overview
      function overviewKnowledgeData(fromDate, toDate) {
            var deferred = $q.defer();
          api.getOverviewKnowledgeData.save({}, { fromDate: fromDate, toDate: toDate }, function (data) {
                deferred.resolve(data);
            }, function (data) {
                deferred.reject(data);
            });
            return deferred.promise;
        }
        function overviewValueCreationData(fromDate,toDate) {
            var deferred = $q.defer();
          api.getOverviewCreationData.save({}, { fromDate: fromDate, toDate: toDate }, function (data) {
                deferred.resolve(data);
            }, function (data) {
                deferred.reject(data);
            });
            return deferred.promise;
        }
        function overviewContributionData(fromDate, toDate) {
            var deferred = $q.defer();
            api.getOverviewContributionCreationData.save({}, { fromDate: fromDate, toDate: toDate }, function (data) {
                deferred.resolve(data);
            }, function (data) {
                deferred.reject(data);
            });
            return deferred.promise;
        }
        function overviewValueData(fromDate, toDate) {
            var deferred = $q.defer();
            api.getOverviewValueData.save({}, { fromDate: fromDate, toDate: toDate }, function (data) {
                deferred.resolve(data);
            }, function (data) {
                deferred.reject(data);
            });
            return deferred.promise;
        }
        function overviewPeopleData() {
            var deferred = $q.defer();
            api.getOverviewPeopleData.get({}, function (data) {
                deferred.resolve(data);
            }, function (data) {
                deferred.reject(data);
            });
            return deferred.promise;
        }
        function overviewConnectionData() {
            var deferred = $q.defer();
            api.getOverviewConnectionData.query({}, function (data) {
                deferred.resolve(data);
            }, function (data) {
                deferred.reject(data);
            });
            return deferred.promise;
        }
        function overviewRecentActivitieData() {
            var deferred = $q.defer();
            api.getOverviewRecentActivitieData.query({}, function (data) {
                deferred.resolve(data);
            }, function (data) {
                deferred.reject(data);
            });
            return deferred.promise;
        }

        // knowledge
        function getTopTrendingKnowledge(input) {
            var deferred = $q.defer();
            api.getTopTrendingKnowledge.save({}, { fromDate: input.fromDate, toDate: input.toDate, segmentItems: input.segmentItems, isViewMore: input.isViewMore }, function (data) {
                deferred.resolve(data);
            }, function (data) {
                deferred.reject(data);
            });
            return deferred.promise;
        }
        function getTrendingTopics(input) {
            var deferred = $q.defer();
            api.getTrendingTopics.save({}, { fromDate: input.fromDate, toDate: input.toDate, segmentItems: input.segmentItems, isViewMore: input.isViewMore }, function (data) {
                deferred.resolve(data);
            }, function (data) {
                deferred.reject(data);
            });
            return deferred.promise;
        }
        function getKnowledgeEngagement(input) {
            var deferred = $q.defer();
            api.getKnowledgeEngagement.save({}, { fromDate: input.fromDate, toDate: input.toDate, segmentItems: input.segmentItems, isViewMore: input.isViewMore }, function (data) {
                deferred.resolve(data);
            }, function (data) {
                deferred.reject(data);
            });
            return deferred.promise;
        }
        function getLatestContributors(input) {
            var deferred = $q.defer();
            api.getLatestContributors.save({}, { fromDate: input.fromDate, toDate: input.toDate, segmentItems: input.segmentItems, isViewMore: input.isViewMore }, function (data) {
                deferred.resolve(data);
            }, function (data) {
                deferred.reject(data);
            });
            return deferred.promise;
        }
        function getKnowledgeAddedVsValidated(input) {
            var deferred = $q.defer();
            api.getKnowledgeAddedVsValidated.save({}, { fromDate: input.fromDate, toDate: input.toDate }, function (data) {
                deferred.resolve(data);
            }, function (data) {
                deferred.reject(data);
            });
            return deferred.promise;
        }
        function getKnowledgeAddedVsValidatedChart(input) {
            var deferred = $q.defer();
            api.getKnowledgeAddedVsValidatedChart.save({}, { fromDate: input.fromDate, toDate: input.toDate, type: input.type, disciplineIds: input.disciplineIds }, function (data) {
                deferred.resolve(data);
            }, function (data) {
                deferred.reject(data);
            });
            return deferred.promise;
        }
        function getKnowledgeContribution(input) {
            var deferred = $q.defer();
            api.getKnowledgeContribution.save({}, { fromDate: input.fromDate, toDate: input.toDate, segmentItems: input.segmentItems, isViewMore: input.isViewMore }, function (data) {
                deferred.resolve(data);
            }, function (data) {
                deferred.reject(data);
            });
            return deferred.promise;
        }
        function getDataByLocation(input) {
            var deferred = $q.defer();
            api.getDataByLocation.save({}, { fromDate: input.fromDate, toDate: input.toDate, segmentItems: input.segmentItems, isViewMore: input.isViewMore }, function (data) {
                deferred.resolve(data);
            }, function (data) {
                deferred.reject(data);
            });
            return deferred.promise;
        }

        // value
        function getTopValue(input) {
            var deferred = $q.defer();
            api.getTopValue.save({}, { fromDate: input.fromDate, toDate: input.toDate, segmentItems: input.segmentItems, isViewMore: input.isViewMore, isEndorsed: input.isEndorsed }, function (data) {
                deferred.resolve(data);
            }, function (data) {
                deferred.reject(data);
            });
            return deferred.promise;
        }
        function getTopReplications(input) {
            var deferred = $q.defer();
            api.getTopReplications.save({}, { fromDate: input.fromDate, toDate: input.toDate, segmentItems: input.segmentItems, isViewMore: input.isViewMore, isEndorsed: input.isEndorsed }, function (data) {
                deferred.resolve(data);
            }, function (data) {
                deferred.reject(data);
            });
            return deferred.promise;
        }
        function getValueCreation(input) {
            var deferred = $q.defer();
            api.getValueCreation.save({}, { fromDate: input.fromDate, toDate: input.toDate, segmentItems: input.segmentItems, isViewMore: input.isViewMore, isEndorsed: input.isEndorsed }, function (data) {
                deferred.resolve(data);
            }, function (data) {
                deferred.reject(data);
            });
            return deferred.promise;
        }
        function getExperienceValue(input) {
            var deferred = $q.defer();
            api.getExperienceValue.save({}, { fromDate: input.fromDate, toDate: input.toDate, segmentItems: input.segmentItems, isViewMore: input.isViewMore, isEndorsed: input.isEndorsed }, function (data) {
                deferred.resolve(data);
            }, function (data) {
                deferred.reject(data);
            });
            return deferred.promise;
        }
        function getReplicationValue(input) {
            var deferred = $q.defer();
            api.getReplicationValue.save({}, { fromDate: input.fromDate, toDate: input.toDate, segmentItems: input.segmentItems, isViewMore: input.isViewMore, isEndorsed: input.isEndorsed }, function (data) {
                deferred.resolve(data);
            }, function (data) {
                deferred.reject(data);
            });
            return deferred.promise;
        }
        function getExperienceValueBreakdown(input) {
            var deferred = $q.defer();
            api.getExperienceValueBreakdown.save({}, { type: input.type, fromDate: input.fromDate, toDate: input.toDate, segmentItems: input.segmentItems, isEndorsed: input.isEndorsed }, function (data) {
                deferred.resolve(data);
            }, function (data) {
                deferred.reject(data);
            });
            return deferred.promise;
        }
        function getValueDataByLocation(input) {
            var deferred = $q.defer();
            api.getValueDataByLocation.save({}, { type: input.type, fromDate: input.fromDate, toDate: input.toDate, segmentItems: input.segmentItems, isEndorsed: input.isEndorsed }, function (data) {
                deferred.resolve(data);
            }, function (data) {
                deferred.reject(data);
            });
            return deferred.promise;
        }



        // people
        function getTopEngagedUsers(input) {
            var deferred = $q.defer();
            api.getTopEngagedUsers.save({}, { fromDate: input.fromDate, toDate: input.toDate, segmentItems: input.segmentItems, isViewMore: input.isViewMore }, function (data) {
                deferred.resolve(data);
            }, function (data) {
                deferred.reject(data);
            });
            return deferred.promise;
        }
        function getTopContributors(input) {
            var deferred = $q.defer();
            api.getTopContributors.save({}, { fromDate: input.fromDate, toDate: input.toDate, segmentItems: input.segmentItems, isViewMore: input.isViewMore }, function (data) {
                deferred.resolve(data);
            }, function (data) {
                deferred.reject(data);
            });
            return deferred.promise;
        }
        function getPeopleKnowledgeContribution(input) {
            var deferred = $q.defer();
            api.getPeopleKnowledgeContribution.save({}, { fromDate: input.fromDate, toDate: input.toDate, segmentItems: input.segmentItems, isViewMore: input.isViewMore }, function (data) {
                deferred.resolve(data);
            }, function (data) {
                deferred.reject(data);
            });
            return deferred.promise;
        }
        function getPeopleTotalContributors(input) {
            var deferred = $q.defer();
            api.getPeopleTotalContributors.save({}, { fromDate: input.fromDate, toDate: input.toDate, segmentItems: input.segmentItems, isViewMore: input.isViewMore }, function (data) {
                deferred.resolve(data);
            }, function (data) {
                deferred.reject(data);
            });
            return deferred.promise;
        }
        function getGetContributorInfoById(id) {
            var deferred = $q.defer();
            api.getGetContributorInfoById.get({ id: id }, function (data) {
                deferred.resolve(data);
            }, function (data) {
                deferred.reject(data);
            });
            return deferred.promise;
        }
        function getActiveLocationDetail(id) {
            var deferred = $q.defer();
            api.getActiveLocationDetail.get({ id: id }, function (data) {
                deferred.resolve(data);
            }, function (data) {
                deferred.reject(data);
            });
            return deferred.promise;
        }
        function getKnowledgeSubmission(input) {
            var deferred = $q.defer();
            api.getKnowledgeSubmission.save({}, { fromDate: input.fromDate, toDate: input.toDate, segmentItems: input.segmentItems, isViewMore: input.isViewMore }, function (data) {
                deferred.resolve(data);
            }, function (data) {
                deferred.reject(data);
            });
            return deferred.promise;
        }



        // audit logs
        function getAuditLogs(input) {
            var deferred = $q.defer();
            api.getAuditLogs.save({}, { section: input.section, exportType: input.exportType, pageName: input.pageName, fromDate: input.fromDate, endDate: input.endDate }, function (data) {
                deferred.resolve(data);
            }, function (data) {
                deferred.reject(data);
            });
            return deferred.promise;
        }
        function getAuditLogsToExcel(input) {
            var deferred = $q.defer();
            api.getAuditLogsToExcel.save({}, { section: input.section, exportType: input.exportType, pageName: input.pageName, fromDate: input.fromDate, endDate: input.endDate, isExport: true }, function (data) {
                deferred.resolve(data);
            }, function (data) {
                deferred.reject(data);
            });
            return deferred.promise;
        }
        function getIK_TopTrendingKnowledgeToExcel(input) {
            var deferred = $q.defer();
            api.getIK_TopTrendingKnowledgeToExcel.save({}, { fromDate: input.fromDate, toDate: input.toDate, segmentItems: input.segmentItems, isViewMore: input.isViewMore, isExport: true }, function (data) {
                deferred.resolve(data);
            }, function (data) {
                deferred.reject(data);
            });
            return deferred.promise;
        }


        function getP_TopContributorsToExcel(input) {
            var deferred = $q.defer();
            api.getP_TopContributorsToExcel.save({}, { fromDate: input.fromDate, toDate: input.toDate, segmentItems: input.segmentItems, isViewMore: input.isViewMore, isExport: true }, function (data) {
                deferred.resolve(data);
            }, function (data) {
                deferred.reject(data);
            });
            return deferred.promise;
        }
        function getP_TopEngagedUsersToExcel(input) {
            var deferred = $q.defer();
            api.getP_TopEngagedUsersToExcel.save({}, { fromDate: input.fromDate, toDate: input.toDate, segmentItems: input.segmentItems, isViewMore: input.isViewMore, isExport: true }, function (data) {
                deferred.resolve(data);
            }, function (data) {
                deferred.reject(data);
            });
            return deferred.promise;
        }

        function getV_TopValueCreationToExcel(input) {
            var deferred = $q.defer();
            api.getV_TopValueCreationToExcel.save({}, { fromDate: input.fromDate, toDate: input.toDate, segmentItems: input.segmentItems, isViewMore: input.isViewMore, isEndorsed: input.isEndorsed, isExport: true }, function (data) {
                deferred.resolve(data);
            }, function (data) {
                deferred.reject(data);
            });
            return deferred.promise;
        }
        function getV_TopReplicationsToExcel(input) {
            var deferred = $q.defer();
            api.getV_TopReplicationsToExcel.save({}, { fromDate: input.fromDate, toDate: input.toDate, segmentItems: input.segmentItems, isViewMore: input.isViewMore, isEndorsed: input.isEndorsed, isExport: true }, function (data) {
                deferred.resolve(data);
            }, function (data) {
                deferred.reject(data);
            });
            return deferred.promise;
        }


        // audit logs
        function insertAuditLogs(input) {
            var deferred = $q.defer();
            api.insertAuditLogs.save({}, { section: input.section, exportType: input.exportType, pageName: input.pageName }, function (data) {
                deferred.resolve(data);
            }, function (data) {
                deferred.reject(data);
            });
            return deferred.promise;
        }

        function testExport(input) {
            var deferred = $q.defer();
            api.testExport.save({}, { fromDate: input.fromDate, toDate: input.toDate, segmentItems: input.segmentItems, isViewMore: input.isViewMore }, function (data) {
                deferred.resolve(data);
            }, function (data) {
                deferred.reject(data);
            });
            return deferred.promise;
        }

        // Location
        function getLocationOnMap(input) {
            var deferred = $q.defer();
            api.getLocationOnMap.save({}, { ids: input }, function (data) {
                deferred.resolve(data);
            }, function (data) {
                deferred.reject(data);
            });
            return deferred.promise;
        }
        function getActiveLocation() {
            var deferred = $q.defer();
            api.getActiveLocation.query({}, function (data) {
                deferred.resolve(data);
            }, function (data) {
                deferred.reject(data);
            });
            return deferred.promise;
        }
        function getListLocationByKnowledge(knowledgeType) {
            var deferred = $q.defer();
            api.getListLocationByKnowledge.query({ knowledgeType: knowledgeType }, function (data) {
                deferred.resolve(data);
            }, function (data) {
                deferred.reject(data);
            });
            return deferred.promise;
        }
        function getGlobalReport(type) {
            var deferred = $q.defer();
            api.getGlobalReport.get({ type: type }, function (data) {
                deferred.resolve(data);
            }, function (data) {
                deferred.reject(data);
            });
            return deferred.promise;
        }

        return {
            api: api,

            // segment
            allSegmentTypes: allSegmentTypes,
            allDisciplines: allDisciplines,
            saveSegment: saveSegment,
            searchSegmentSuggestions: searchSegmentSuggestions,
            loadDataForTopLabels: loadDataForTopLabels,
            loadDataForTopLabelsValue: loadDataForTopLabelsValue,
            getSegmentKDSummary: getSegmentKDSummary,
            getSegmentValueSummary: getSegmentValueSummary,
            getSegmentPeopleSummary: getSegmentPeopleSummary,
            loadDataForTopLabelsPeople: loadDataForTopLabelsPeople,

            // overview
            overviewKnowledgeData: overviewKnowledgeData,
            overviewValueCreationData: overviewValueCreationData,
            overviewContributionData: overviewContributionData,
            overviewValueData: overviewValueData,
            overviewPeopleData: overviewPeopleData,
            overviewConnectionData: overviewConnectionData,
            overviewRecentActivitieData: overviewRecentActivitieData,

            // knowledge
            getTopTrendingKnowledge: getTopTrendingKnowledge,
            getTrendingTopics: getTrendingTopics,
            getKnowledgeEngagement: getKnowledgeEngagement,
            getLatestContributors: getLatestContributors,
            getKnowledgeAddedVsValidated: getKnowledgeAddedVsValidated,
            getKnowledgeAddedVsValidatedChart: getKnowledgeAddedVsValidatedChart,
            getKnowledgeContribution: getKnowledgeContribution,
            getDataByLocation: getDataByLocation,

            // value
            getTopValue: getTopValue,
            getTopReplications: getTopReplications,
            getValueCreation: getValueCreation,
            getExperienceValue: getExperienceValue,
            getReplicationValue: getReplicationValue,
            getExperienceValueBreakdown: getExperienceValueBreakdown,
            getValueDataByLocation: getValueDataByLocation,

            // people
            getTopEngagedUsers: getTopEngagedUsers,
            getTopContributors: getTopContributors,
            getPeopleKnowledgeContribution: getPeopleKnowledgeContribution,
            getPeopleTotalContributors: getPeopleTotalContributors,
            getGetContributorInfoById: getGetContributorInfoById,
            getActiveLocationDetail: getActiveLocationDetail,
            getKnowledgeSubmission: getKnowledgeSubmission,

            // audit logs
            getAuditLogs: getAuditLogs,
            getAuditLogsToExcel: getAuditLogsToExcel,
            insertAuditLogs: insertAuditLogs,

            getIK_TopTrendingKnowledgeToExcel: getIK_TopTrendingKnowledgeToExcel,


            getP_TopContributorsToExcel: getP_TopContributorsToExcel,
            getP_TopEngagedUsersToExcel: getP_TopEngagedUsersToExcel,

            getV_TopValueCreationToExcel: getV_TopValueCreationToExcel,
            getV_TopReplicationsToExcel: getV_TopReplicationsToExcel,

            testExport: testExport,

            getLocationOnMap: getLocationOnMap,
            getActiveLocation: getActiveLocation,
            getListLocationByKnowledge: getListLocationByKnowledge,
            getGlobalReport: getGlobalReport
        };
    }

})();
