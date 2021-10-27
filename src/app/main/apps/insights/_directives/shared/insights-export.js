/**
 * @author v.lugovksy
 * created on 16.12.2015
 */
(function () {
  'use strict';

  angular.module('app.insights')
    .directive('insightsExport', insightsExport);
  /** @ngInject */
  function insightsExport() {
    return {
      restrict: 'AE',
      replace: true,
      scope: {
        classname: '@',
        filename: '@',
        fromdate: '=',
        todate: '=',
        module: '@',
        section: '@',
      },
      controller: function ($scope, $filter, $rootScope, InsightsCommonService, InsightsApi, UserProfileApi) {
        $scope.userInfo = UserProfileApi.getUserInfo();

        // Export Excel
        $scope.exportExcel = function testExport(segmentItems, isViewMore, fromDate, toDate) {
          $scope.loading = true;
          var segmentItems = InsightsCommonService.getAllSegmentLabels();
          var input = {
            fromDate: $filter('date')($scope.fromdate, "MM/dd/yyyy"),
            toDate: $filter('date')($scope.todate, "MM/dd/yyyy"),
            segmentItems: segmentItems.labelItemResponses,
            isViewMore: true
          };
          switch ($scope.module) {
            case "Insight Knowledge": {
              switch ($scope.section) {
                case "Top Trending Knowledge": {
                  exportKnowledge_TopTrendingKnowledge(input);
                  break;
                }
                case "Trending Topics & Knowledge Contribution": {
                  exportKnowledge_TrendingTopicsAndKnowledgeContribution(input);
                  break;
                }
                case "Knowledge Engagement": {
                  exportKnowledge_KnowledgeEngagement(input);
                  break;
                }
                case "Knowledge Originate": {
                  exportKnowledge_KnowledgeOriginate(input);
                  break;
                }
                case "Knowledge Added vs Validated": {
                  exportKnowledge_KnowledgeAddedAndValidated(input);
                  break;
                }
                case "Audit Logs": {
                  export_AuditLogs();
                  break;
                }
              }
              break;
            }
            case "Insight Value": {
              switch ($scope.section) {
                case "Top Value Creation": {
                  exportValue_TopValueCreation(input);
                  break;
                }
                case "Top Replications": {
                  exportValue_TopReplications(input);
                  break;
                }
                case "Experience Value & Replication Value": {
                  exportValue_ExperienceValueAndReplicationValue(input);
                  break;
                }
                case "Most Value Creation": {
                  exportValue_MostValueCreation(input);
                  break;
                }
                case "Most Value By Location": {
                  exportValue_MostValueByLocation(input);
                  break;
                }
                case "Audit Logs": {
                  export_AuditLogs();
                  break;
                }
              }
              break;
            }
            case "Insight People": {
              switch ($scope.section) {
                case "Top Contributors": {
                  exportPeople_TopContributors(input);
                  break;
                }
                case "Top Engaged Users": {
                  exportPeople_TopEngagedUsers(input);
                  break;
                }
                case "Total Contributors & Knowledge Contibutions": {
                  exportPeople_TotalContributorsAndKnowledgeContibutions(input);
                  break;
                }
                case "Audit Logs": {
                  export_AuditLogs();
                  break;
                }
              }
              break;
            }
          }
        }

        // Export PDF
        $scope.exportPDF = function () {
          InsightsCommonService.exportPDF($scope.classname, $scope.filename);
          insertLog("PDF");
        }

        // Inset log after click export data
        function insertLog(exportType) {
          var input = {
            section: $scope.section,
            exportType: exportType,
            pageName: $scope.module
          }
          $scope.loading = true;
          InsightsApi.insertAuditLogs(input).then(function (data) {
            $scope.loading = false;
            $rootScope.$broadcast('addExportLog', {});
          }, function (error) {
            $scope.loading = false;
            console.log(error);
          });
        }

        // Format datetime to text
        function dateTimeToText(str) {
          return InsightsCommonService.dateTimeToText(str);
        }

        // Export Excel
        function downloadFileFromData(exportdata, isGroupBy, multiData) {
          var module = $scope.module;

          function datenum(v, date1904) {
            if (date1904) v += 1462;
            var epoch = Date.parse(v);
            return (epoch - new Date(Date.UTC(1899, 11, 30))) / (24 * 60 * 60 * 1000);
          };

          function getSheet(data, opts) {
            var ws = {};
            var range = { s: { c: 10000000, r: 10000000 }, e: { c: 0, r: 0 } };

            var wscols = [];
            var arrMaxChars = [];
            for (var R = 0; R < data.length; ++R) {
              var merge = {};
              var groupByRIndex = -1;
              if (R == 0) {
                for (var C = 0; C < data[R].length; ++C) {
                  arrMaxChars.push(10);
                }
              }

              for (var C = 0; C < data[R].length; ++C) {
                if (range.s.r > R) range.s.r = R;
                if (range.s.c > C) range.s.c = C;
                if (range.e.r < R) range.e.r = R;
                if (range.e.c < C) range.e.c = C;
                var cell = { v: data[R][C] };
                if (cell.v == null) continue;
                var cell_ref = XLSX.utils.encode_cell({ c: C, r: R });

                if (typeof cell.v === 'number') cell.t = 'n';
                else if (typeof cell.v === 'boolean') cell.t = 'b';
                else if (cell.v instanceof Date) {
                  cell.t = 'n'; cell.z = XLSX.SSF._table[14];
                  cell.v = datenum(cell.v);
                }
                else cell.t = 's';

                if (cell.v != null && cell.v.length > arrMaxChars[C]) {
                  arrMaxChars[C] = cell.v.length;
                }

                if (isGroupBy) {
                  if (R != 0 && C == 0 && cell.v != null && typeof cell.v != 'number' && cell.v.indexOf('_cat_') != -1) {
                    cell.v = cell.v.replace('_cat_', '');
                    groupByRIndex = R;
                  }
                }

                // Cell styles
                cell.s = {};
                var allBorders = { top: { style: 'thin', color: { rgb: '000000' } }, bottom: { style: 'thin', color: { rgb: '000000' } }, left: { style: 'thin', color: { rgb: '000000' } }, right: { style: 'thin', color: { rgb: '000000' } } };
                cell.s.border = allBorders;

                // Header styles
                if (R == 0) {
                  cell.s.fill = { patternType: "solid", fgColor: { rgb: '7A7A7A' } };
                  cell.s.font = { color: { rgb: 'FFFFFF' }, bold: true };
                }

                // Group title styles
                if (groupByRIndex != -1) {
                  cell.s = { font: { bold: true, italic: true }, fill: { patternType: "solid", fgColor: { rgb: 'D9D9D9' } }, }
                  cell.s.border = allBorders;

                  merge = { s: { r: groupByRIndex, c: 0 }, e: { r: groupByRIndex, c: data[R].length - 1 } };
                  if (!ws['!merges']) ws['!merges'] = [];
                  ws['!merges'].push(merge);
                }
                ws[cell_ref] = cell;
              }
            }
            _.each(arrMaxChars, function (item, index) {
              wscols.push({ wch: item });
            });
            ws['!cols'] = wscols;
            if (range.s.c < 10000000) ws['!ref'] = XLSX.utils.encode_range(range);
            return ws;
          };

          function Workbook() {
            if (!(this instanceof Workbook)) return new Workbook();
            this.SheetNames = [];
            this.Sheets = {};
          }

          /* add worksheet to workbook */
          var wb = new Workbook();
          if (multiData.length <= 0) {
            var ws = getSheet(exportdata);
            wb.SheetNames.push("Sheet1");
            wb.Sheets["Sheet1"] = ws;
          } else {
            _.each(multiData, function (s, sIndex) {
              var ws = getSheet(s.data);
              wb.SheetNames.push(s.sheetName);
              wb.Sheets[s.sheetName] = ws;
            });
          }
          var wbout = XLSX.write(wb, { bookType: 'xlsx', bookSST: true, type: 'binary' });

          function s2ab(s) {
            var buf = new ArrayBuffer(s.length);
            var view = new Uint8Array(buf);
            for (var i = 0; i < s.length; ++i) view[i] = s.charCodeAt(i) & 0xFF;
            return buf;
          }

          saveAs(new Blob([s2ab(wbout)], { type: "application/octet-stream" }), $scope.filename + '.xlsx');
          insertLog("Excel");
        }

        // Save data as file
        var saveData = (function () {
          var a = document.createElement("a");
          document.body.appendChild(a);
          //a.style = "display: none";
          return function (data, fileName) {
            var json = JSON.stringify(data),
              blob = new Blob([json], { type: "octet/stream" }),
              url = window.URL.createObjectURL(blob);
            a.href = url;
            a.download = fileName;
            a.click();
            window.URL.revokeObjectURL(url);
          };
        }());

        // Export data each section
        function exportKnowledge_TopTrendingKnowledge(input) {
          InsightsApi.getIK_TopTrendingKnowledgeToExcel(input).then(function (data) {
            var result = _.chain(data).groupBy("segmentType").map(function (v, i) {
              return {
                segmentType: i,
                items: v
              }
            }).value();

            // Mapping data
            var exportData = [];
            exportData.push(["KNOWLEDGE", "AUTHOR", "VIEWS", "LIKES", "SHARES", "SAVES"]);
            angular.forEach(result, function (cat, key1) {
              exportData.push(['_cat_' + cat.segmentType, null, null, null, null, null]);
              angular.forEach(cat.items, function (item, key2) {
                exportData.push([item.kdTitle || '', item.author || '', item.views || 0, item.likes || 0, item.shares || 0, item.save || 0]);
              });
            });

            downloadFileFromData(exportData, true, []);
            $scope.loading = false;

          }, function (error) {
            $scope.loading = false;
            console.log(error);
          });
        }
        function exportKnowledge_TrendingTopicsAndKnowledgeContribution(input) {
          var xsegmentItems = input.segmentItems;
          InsightsApi.getTrendingTopics(input).then(function (data1) {
            InsightsApi.getKnowledgeContribution(input).then(function (data2) {
              $scope.loading = false;

              var exportData1 = [];
              exportData1.push(["TOPIC", "SUBMISSION", "LIKES"]);

              var exportData2 = [];
              exportData2.push(["#", "KNOWLEDGE", "USERS"]);

              _.each(xsegmentItems, function (s, sIndex) {
                exportData1.push(['_cat_' + s.name, null, null]);
                _.each(data1, function (d, dIndex) {
                  if (s.name.replace(/ /g, '') == d.type.replace(/ /g, '')) {
                    exportData1.push([d.keyword, d.count, 0]);
                  }
                });
              });

              _.each(xsegmentItems, function (s, sIndex) {
                exportData2.push(['_cat_' + s.name, null, null]);
                _.each(data2, function (d, dIndex) {
                  if (s.name.replace(/ /g, '') == d.segmentType.replace(/ /g, '')) {
                    exportData2.push(['', d.kdCount, d.userCount]);
                  }
                });
              });


              // Download file
              downloadFileFromData(null, true, [{ sheetName: 'Trending Topics', data: exportData1 }, { sheetName: 'Knowledge Contribution', data: exportData2 }]);
            }, function (error) {
              $scope.loading = false;
              console.log(error);
            });
          }, function (error) {
            $scope.loading = false;
            console.log(error);
          });
        }
        function exportKnowledge_KnowledgeEngagement(input) {
          var xsegmentItems = input.segmentItems;
          InsightsApi.getKnowledgeEngagement(input).then(function (data) {
            $scope.loading = false;
            if (data != null) {
              // Mapping data
              var exportData = [];
              exportData.push(["Views", "Likes", "Shares", "Saves"]);
              _.each(xsegmentItems, function (s, sIndex) {
                exportData.push(['_cat_' + s.name, null, null, null]);
                var t1 = 0, t2 = 0, t3 = 0, t4 = 0;
                _.each(data, function (d, dIndex) {
                  if (s.name.replace(/ /g, '') == d.segmentType.replace(/ /g, '')) {
                    switch (d.engagementType) {
                      case 'View': {
                        _.each(d.engagementChartResponses, function (x, xIndex) {
                          t1 += x.count;
                        });
                        break;
                      }
                      case 'Like': {
                        _.each(d.engagementChartResponses, function (x, xIndex) {
                          t2 += x.count;
                        });
                        break;
                      }
                      case 'Share': {
                        _.each(d.engagementChartResponses, function (x, xIndex) {
                          t3 += x.count;
                        });
                        break;
                      }
                      case 'Save': {
                        _.each(d.engagementChartResponses, function (x, xIndex) {
                          t3 += x.count;
                        });
                        break;
                      }
                    }
                  }
                });
                exportData.push([t1, t2, t3, t4]);
              });

              // Download file
              downloadFileFromData(exportData, true, []);
            }
          }, function (error) {
            $scope.loading = false;
            console.log(error);
          });

        }
        function exportKnowledge_KnowledgeOriginate(input) {
          $scope.loading = true;
          InsightsApi.getDataByLocation(input).then(function (data) {
            if (data != null) {
              $scope.loading = false;
              var result = _.chain(data).groupBy("segmentType").map(function (v, i) {
                return {
                  segmentType: i,
                  items: v
                }
              }).value();

              // Mapping data
              var exportData = [];
              exportData.push(["LOCATIONS", "KNOWLEDGE"]);
              angular.forEach(result, function (cat, key1) {
                exportData.push(['_cat_' + cat.segmentType, null]);
                angular.forEach(cat.items, function (item, key2) {
                  exportData.push([item.locationName || '', item.knowledgeCount || 0]);
                });
              });

              downloadFileFromData(exportData, true, []);
            }
          }, function (error) {
            $scope.loading = false;
            console.log(error);
          });
        }
        function exportKnowledge_KnowledgeAddedAndValidated(input) {
          InsightsApi.getKnowledgeAddedVsValidated(input).then(function (data) {
            if (data != null) {
              $scope.loading = false;

              var exportData1 = [];
              var exportData2 = [];
              var exportData3 = [];
              var exportData4 = [];

              exportData1.push(["LOCATIONS", "VALIDATED KNOWLEDGE", "PENDING KNOWLEDGE"]);
              exportData2.push(["LOCATIONS", "VALIDATED KNOWLEDGE", "PENDING KNOWLEDGE"]);
              exportData3.push(["LOCATIONS", "VALIDATED KNOWLEDGE", "PENDING KNOWLEDGE"]);
              exportData4.push(["LOCATIONS", "VALIDATED KNOWLEDGE", "PENDING KNOWLEDGE"]);

              _.each(data, function (item, index) {
                if (item.type == "All") {
                  _.each(item.newKnowledgeItem, function (x, xIndex) {
                    exportData1.push([x.locationName, x.validated, x.added]);
                  });
                }
                if (item.type == "Lessons Learnt") {
                  _.each(item.newKnowledgeItem, function (x, xIndex) {
                    exportData2.push([x.locationName, x.validated, x.added]);
                  });
                }
                if (item.type == "Best Practices") {
                  _.each(item.newKnowledgeItem, function (x, xIndex) {
                    exportData3.push([x.locationName, x.validated, x.added]);
                  });
                }
                if (item.type == "Publications") {
                  _.each(item.newKnowledgeItem, function (x, xIndex) {
                    exportData4.push([x.locationName, x.validated, x.added]);
                  });
                }
              });



              // Download file
              downloadFileFromData(null, true, [{ sheetName: 'All', data: exportData1 }, { sheetName: 'Lessons Learnt', data: exportData2 }, { sheetName: 'Best Practices', data: exportData3 }, { sheetName: 'Publications', data: exportData4 }]);
            }
          }, function (error) {
            $scope.loading = false;
            console.log(error);
          });
        }

        function exportValue_TopValueCreation(input) {
          InsightsApi.getV_TopValueCreationToExcel(input).then(function (data) {
            var result = _.chain(data).groupBy("segmentType").map(function (v, i) {
              return {
                segmentType: i,
                items: v
              }
            }).value();

            // Mapping data
            var exportData = [];
            exportData.push(["KNOWLEDGE", "AUTHOR", "VALUE CREATED", "VALUE CREATION TYPE","DATE", "VALUE TYPE"]);
            angular.forEach(result, function (cat, key1) {
              exportData.push(['_cat_' + cat.segmentType, null, null, null]);
              angular.forEach(cat.items, function (item, key2) {
                console.log(item);
                exportData.push([item.kdTitle || '', item.author || '', item.valueCreated || 0, item.valueCreationType || 0, item.createdDate || "", item.valueType || '']);
              });
            });

            downloadFileFromData(exportData, true, []);
            $scope.loading = false;

          }, function (error) {
            $scope.loading = false;
            console.log(error);
          });
        }
        function exportValue_TopReplications(input) {
          InsightsApi.getV_TopReplicationsToExcel(input).then(function (data) {
            var result = _.chain(data).groupBy("segmentType").map(function (v, i) {
              return {
                segmentType: i,
                items: v
              }
            }).value();

            // Mapping data
            var exportData = [];
            exportData.push(["KNOWLEDGE", "AUTHOR", "REPLICATED", "REPLICATED BY", "REPLICATION IMPACT"]);
            angular.forEach(result, function (cat, key1) {
              exportData.push(['_cat_' + cat.segmentType, null, null, null, null]);
              angular.forEach(cat.items, function (item, key2) {
                exportData.push([item.kdTitle || '', item.author || '', item.replicated || '', item.replicatedBy || '', item.replicationImpact || '']);
              });
            });

            downloadFileFromData(exportData, true, []);
            $scope.loading = false;

          }, function (error) {
            $scope.loading = false;
            console.log(error);
          });
        }
        function exportValue_ExperienceValueAndReplicationValue(input) {
          $scope.loading = true;
          var xsegmentItems = input.segmentItems;
          InsightsApi.getExperienceValue(input).then(function (data) {
            $scope.loading = false;
            if (data != null) {
              var exportData = [];
             

              _.each(xsegmentItems, function (s, sIndex) {
                var t1 = 0, t2 = 0, t3 = 0, t4 = 0, t5 = 0, t6 = 0;
                var h1 = 0, h2 = 0, h3 = 0, h4 = 0, h5 = 0, h6 = 0;
                _.each(data, function (d, dIndex) {
                  if (s.name.replace(/ /g, '') == d.segmentType.replace(/ /g, '')) {
                    
                    console.log(d.valueTypeResponses);
                    _.each(d.valueTypeResponses, function (v, VIndex) {
                      switch (VIndex) {
                        case 0: h1 = v.typeName;
                          t1 += v.value;
                          break;
                        case 1: h2 = v.typeName;
                          t2 += v.value;
                          break;
                        case 2: h3 = v.typeName;
                          t3 += v.value;
                          break;
                        case 3: h4 = v.typeName;
                          t4 += v.value;
                          break;
                        case 4: h5 = v.typeName;
                          t5 += v.value;
                          break;
                        case 5: h6 = v.typeName;
                          t6 += v.value;
                          break;
                      }
                    });
                   
                  }
                });
                exportData.push(["#", h1, h2, h3, h4, h5, h6]);
                exportData.push(['_cat_' + s.name, null, null, null, null, null]);
                exportData.push(["", t1, t2, t3, t4, t5, t6]);
              });

              downloadFileFromData(exportData, true, []);
            }
          }, function (error) {
            $scope.loading = false;
            console.log(error);
          });
        }
        function exportValue_MostValueCreation(input) {
          InsightsApi.getValueCreation(input).then(function (data) {
            var result = _.chain(data).groupBy("segmentType").map(function (v, i) {
              return {
                segmentType: i,
                items: v
              }
            }).value();
            // Mapping data
            var exportData = [];
            exportData.push(["VALUES", "USERS", "KNOWLEDGE"]);
            angular.forEach(result, function (cat, key1) {
              exportData.push(['_cat_' + cat.segmentType, null, null]);
              angular.forEach(cat.items, function (item, key2) {
                exportData.push([item.totalValue || '', item.totalUser || '', item.totalKnowledge || '']);
              });
            });

            downloadFileFromData(exportData, true, []);
            $scope.loading = false;

          }, function (error) {
            $scope.loading = false;
            console.log(error);
          });
        }

        function exportValue_MostValueByLocation(input) {
          $scope.loading = true;
          InsightsApi.getValueDataByLocation(input).then(function (data) {
            if (data != null) {
              $scope.loading = false;
              var result = _.chain(data).groupBy("segmentType").map(function (v, i) {
                return {
                  segmentType: i,
                  items: v
                }
              }).value();

              // Mapping data
              var exportData = [];
              exportData.push(["LOCATIONS", "KNOWLEDGE"]);
              angular.forEach(result, function (cat, key1) {
                exportData.push(['_cat_' + cat.segmentType, null]);
                angular.forEach(cat.items, function (item, key2) {
                  exportData.push([item.locationName || '', item.value || 0]);
                });
              });

              downloadFileFromData(exportData, true, []);
            }
          }, function (error) {
            $scope.loading = false;
            console.log(error);
          });
        }

        function exportPeople_TopContributors(input) {
          InsightsApi.getP_TopContributorsToExcel(input).then(function (data) {
            var result = _.chain(data).groupBy("segmentType").map(function (v, i) {
              return {
                segmentType: i,
                items: v
              }
            }).value();

            // Mapping data
            var exportData = [];
            exportData.push(["CONTRIBUTOR", "AUTHORED", "VALUE CREATED", "REPLICATION", "LESSON LEARNT", "TECHNICAL PAPER", "PUBLICATIONS", "BEST PRACTICES"]);
            angular.forEach(result, function (cat, key1) {
              exportData.push(['_cat_' + cat.segmentType, null, null, null, null, null, null, null]);
              angular.forEach(cat.items, function (item, key2) {
                exportData.push([item.contributor || '', item.authored || '', item.valueCreated || '', item.replication || '', item.lessonLearn || '', '', item.publication || '', item.bestPractice || '']);
              });
            });

            downloadFileFromData(exportData, true, []);
            $scope.loading = false;

          }, function (error) {
            $scope.loading = false;
            console.log(error);
          });
        }
        function exportPeople_TopEngagedUsers(input) {
          InsightsApi.getP_TopEngagedUsersToExcel(input).then(function (data) {
            var result = _.chain(data).groupBy("segmentType").map(function (v, i) {
              return {
                segmentType: i,
                items: v
              }
            }).value();

            // Mapping data
            var exportData = [];
            exportData.push(["USER", "USER SINCE", "BADGES", "RANK", "REPLICATION", "VIEWS", "LIKES", "SHARES", "SAVES"]);
            angular.forEach(result, function (cat, key1) {
              exportData.push(['_cat_' + cat.segmentType, null, null, null, null, null, null, null, null]);
              angular.forEach(cat.items, function (item, key2) {
                exportData.push([item.user || '', item.userSince || '', item.badges || '', item.rank || '', item.replication || '', item.views || '', item.likes || '', item.shares || '', item.saves || '']);
              });
            });

            downloadFileFromData(exportData, true, []);
            $scope.loading = false;

          }, function (error) {
            $scope.loading = false;
            console.log(error);
          });
        }
        function exportPeople_TotalContributorsAndKnowledgeContibutions(input) {
          var xsegmentItems = input.segmentItems;
          InsightsApi.getPeopleTotalContributors(input).then(function (data1) {
            InsightsApi.getPeopleKnowledgeContribution(input).then(function (data2) {
              $scope.loading = false;

              var exportData1 = [];
              exportData1.push(["#", "TOTAL", "SMEs"]);

              var exportData2 = [];
              exportData2.push(["#", "USERS", "KNOWLEDGE"]);

              _.each(xsegmentItems, function (s, sIndex) {
                exportData1.push(['_cat_' + s.name, null, null]);
                var t1 = 0, t2 = 0;
                _.each(data1, function (d, dIndex) {
                  if (s.name.replace(/ /g, '') == d.segmentType.replace(/ /g, '')) {
                    if (!d.isSME) {
                      _.each(d.totalContributorsChartResponses, function (x, xIndex) {
                        t1 += x.count;
                      });
                    } else {
                      _.each(d.totalContributorsChartResponses, function (x, xIndex) {
                        t2 += x.count;
                      });
                    }
                  }
                });
                exportData1.push(['', t1, t2]);
              });

              _.each(xsegmentItems, function (s, sIndex) {
                exportData2.push(['_cat_' + s.name, null, null]);
                var t1 = 0, t2 = 0;
                _.each(data2, function (d, dIndex) {
                  if (s.name.replace(/ /g, '') == d.segmentType.replace(/ /g, '')) {
                    t1 += d.totalUser;
                    t2 += d.totalKnowledge;
                  }
                });
                exportData2.push(['', t1, t2]);
              });

              // Download file
              downloadFileFromData(null, true, [{ sheetName: 'Total Contributors', data: exportData1 }, { sheetName: 'Knowledge Contribution', data: exportData2 }]);
            }, function (error) {
              $scope.loading = false;
              console.log(error);
            });
          }, function (error) {
            $scope.loading = false;
            console.log(error);
          });
        }
        function export_AuditLogs() {
          $scope.loading = true;
          var dataInput = {
            section: null,
            exportType: null,
            pageName: $scope.module,
            fromDate: $filter('date')($scope.fromdate, "MM/dd/yyyy"),
            endDate: $filter('date')($scope.todate, "MM/dd/yyyy"),
          };
          InsightsApi.getAuditLogsToExcel(dataInput).then(function (data) {
            $scope.loading = false;
            var exportData = [];
            if (data != null) {
              exportData.push(["USER", "DISCIPLINE", "ACTIVITIES", "TIME", "USER ROLE"]);
              angular.forEach(data, function (item, key2) {
                try {
                  exportData.push([item.user, item.discipline, item.activity, InsightsCommonService.dateTimeToText(item.time), item.userRole]);
                } catch (e) {
                }
              });

              // Download file
              downloadFileFromData(exportData, false, []);
            }
          }, function (error) {
            $scope.loading = false;
            console.log(error);
          });
        }
      },
      templateUrl: 'app/main/apps/insights/_directives/shared/insights-export.html',
    };
  }
})();
