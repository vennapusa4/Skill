(function () {
    'use strict';

    angular
        .module('app.knowledgeManagement')
        .controller('KnowledgeManagementAdminController', KnowledgeManagementAdminController);

    /** @ngInject */
    function KnowledgeManagementAdminController($scope, KnowledgeManagementApi, $timeout, $window, Utils, CommonApi, BulkUploadApi, UserProfileApi, KnowledgeDiscoveryApi, SearchApi, logger, MasterDataGameMechanicsApi,appConfig) {
        //alert('knowledge management');

        var vm = this;
        vm.pageSize = 10;
        vm.searchTerm = '';
        vm.checkedIds = {};
        vm.checkedItems = [];
        vm.selectItemId = null;
        vm.isCheckedMulti = false;
        vm.isSearch = false;
        vm.hasAttachment = false;
        vm.bulk = {};
        vm.AllLLType = [];
        vm.AllStatus = [];
        vm.options = null;
        vm.filterBy = null;
        vm.filterByTypes = [];
        vm.filterType = "";
        vm.isWithReplication = false;

        var deferFeedKnowledgeDocumentTypes = MasterDataGameMechanicsApi.feedKnowledgeDocumentTypes().then(function (data) {
            vm.filterByTypes = data;
        });

        var searchDisciplineId = 0;
        var searchAuthorId = '';
        vm.gridDataSource = new kendo.data.DataSource({
            transport: {
                read: function (options) {
                    vm.checkedIds = {};
                    vm.checkedItems = [];
                    $("#header-chb").prop('checked', false);
                    if (vm.isSearch) {
                        options.data.skip = 0;
                        vm.isSearch = false;
                    }
                    var filterBy = [
                        { field: 'Disciplines', value: searchDisciplineId },
                        { field: 'Authors', value: searchAuthorId },
                        { field: 'Types', value: vm.filterType }
                    ];
                    vm.filterBy = filterBy;
                    vm.options = options;
                    return KnowledgeManagementApi.getKnowledges(options, vm.searchTerm, filterBy, vm.gridDataSource.total(), vm.isWithReplication);
                },
                update: function (e) {
                    e.success();
                },
                destroy: function (e) {
                    KnowledgeManagementApi.deleteItem({ id: e.data.id }).then(function (data) {
                        if (data.result) {
                            vm.gridDataSource.read();
                        } else {
                            e.error();
                        }
                    }, function () {
                        e.error();
                    });
                }
            },
            serverFiltering: true,
            serverSorting: true,
            serverPaging: true,
            pageSize: vm.pageSize,
            schema: {
                data: function (e) {
                    return e.data;
                },
                total: "total",
                model: {
                    id: "id",
                    fields: {
                        title: {
                            type: "string"
                        },
                        type: {
                            type: "string"
                        },
                        attachment: {
                            type: "boolean"
                        },

                        status: {
                            type: "string"
                        },
                        createdDate: {
                            type: "Date"
                        }
                    }
                }
            }
        });

        vm.search = function () {
            vm.isSearch = true;
            vm.gridDataSource.query({
                page: 1,
                pageSize: vm.pageSize
            });
        };

        //Grid definition
        vm.gridOptions = {
            pageable: {
                pageSize: vm.pageSize,
            },
            scrollable: false,
            sortable: false,
            filter: true,
            dataBound: function (e) {
                var view = this.dataSource.view();
                for (var i = 0; i < view.length; i++) {
                    if (vm.checkedIds[view[i].id]) {
                        this.tbody.find("tr[data-uid='" + view[i].uid + "']")
                            .addClass("k-state-selected")
                            .find(".checkbox")
                            .attr("checked", "checked");
                    }
                }
            },
            toolbar: [
                "edit",
                "delete",
                { template: '<kendo-button ng-click="vm.validate()" class="k-grid-validate">Validate</kendo-button>' },
                { template: '<kendo-button ng-click="vm.exportWithReplication()" class="k-button k-grid-export2"><span class="c-icon icon-export"></span>Export with replication</kendo-button>' },
                // { template: "<kendo-button class='k-grid-validate' style='margin-left:5px;'>Export to excel</kendo-button>" },
                {
                    name: "excel",
                    iconClass: "c-icon icon-export",
                    text: "Export to excel"
                }
            ],
            dataSource: vm.gridDataSource,
            columns: [
                {
                    title: 'Select All',
                    headerTemplate: "<input type='checkbox' id='header-chb' class='k-checkbox header-checkbox' ng-click='vm.headerChbChangeFunc()' ><label class='k-checkbox-label' for='header-chb'></label>",
                    template: function (dataItem) {
                        return "<input type='checkbox' id='chk_{{dataItem.id}}' ng-model='dataItem.CheckItem' ng-change='vm.checkItem(dataItem)' class='k-checkbox row-checkbox' ><label class='k-checkbox-label' for='chk_{{dataItem.id}}'></label>"
                    },
                    width: "30px",
                    attributes: {
                        "class": "check_cell",
                    }
                },
                {
                    field: "title",
                    title: "Title",
                    template: function (dataItem) {
                        var result = "";
                        if (dataItem.title == null || dataItem.title.trim() == '') dataItem.title = 'No Title';

                            if (dataItem.type == 'Best Practices') {
                                result = "<a href='/knowledge-discovery/best-practices/build?id=" + dataItem.id + "'>" + dataItem.title + "</a>"
                            }
                            else if (dataItem.type == 'Lessons Learnt') {
                                result = "<a href='/knowledge-discovery/lessons-learnt/build?id=" + dataItem.id + "'>" + dataItem.title + "</a>"
                            }
                            else if (dataItem.type == 'Publications') {
                                result = "<a href='/knowledge-discovery/publications/build?id=" + dataItem.id + "'>" + dataItem.title + "</a>"
                            }
                            else if (dataItem.type == 'Technical Alerts') {
                                result = "<a href='/knowledge-discovery/technical-alerts/build?id=" + dataItem.id + "'>" + dataItem.title + "</a>"
                            }
                            else {
                                // Default
                              result = "<a href='/knowledge-discovery/insights/build?id=" + dataItem.id + "'>" + dataItem.title + "</a>"
                            }
                     

                        return result;
                    }
                },
                {
                    field: "type",
                    title: "Type",
                },
                {
                    field: "attachment",
                    title: "<i class='icon-attachment'></i>",
                    template: '#: attachment ? "Yes":"No" #',
                    width: '60px'
                },
                {
                    field: 'disciplineResponses',
                    title: 'Discipline',
                    editable: false,
                    template: '# for(var i = 0; i < disciplineResponses.length; i++) {# #:disciplineResponses[i].title# <br/> #}#'
                },
                {
                    field: 'author',
                    title: 'Author',
                    template: '# for(var i = 0; i < author.length; i++) {# #:author[i].title# <br/> #}#',
                    width: '120px'
                },
                {
                    field: 'status',
                    title: 'Status',
                    width: '90px'
                },
                {
                    field: 'createdDate',
                    title: 'Date',
                    format: '{0:dd-MMM-yyyy}',
                    width: '120px'
                }
                
            ],
            editable: {
                mode: "popup",
                template: kendo.template($("#editorTemplate").html())
            },
            excel: {
                allPages: true,
                filterable: true,
                fileName: "Knowledge Management.xlsx"
            },
            excelExport: function (e) {
                e.preventDefault();
                var columns_1 = [
                    { name: 'Title', width: 100 },
                    { name: 'Lesson Learnt type', width: 100 },
                    { name: 'Summary', width: 100 },
                    { name: 'SupposedToHappen', width: 100 },
                    { name: 'ActuallyHappen', width: 100 },
                    { name: 'WhyDifference', width: 100 },
                    { name: 'WhatLearn', width: 100 },
                    { name: 'KDStage', width: 100 },
                    { name: 'CopName', width: 100 },
                    { name: 'Location', width: 100 },
                    { name: 'ValueCreationType', width: 100 },
                    { name: 'CurrentStatus', width: 100 },
                    { name: 'SMEUser name', width: 100 },
                    { name: 'CreatedBy name', width: 100 },
                    { name: 'Document type name', width: 100 },
                    { name: 'Discipline', width: 100 },
                    { name: 'Subdiscipline', width: 100 },
                    { name: 'Authors', width: 100 },
                    { name: 'Project', width: 100 },
                    { name: 'Project phase', width: 100 },
                    { name: 'Wells', width: 100 },
                    { name: 'Well phase', width: 100 },
                    { name: 'Well operation', width: 100 },
                    { name: 'Equipment', width: 100 },
                    { name: 'Keyword', width: 100 },
                    { name: 'Value Type', width: 100 },
                    { name: 'Estimated value', width: 100 },
                    { name: 'Remark', width: 100 },
                    { name: 'Reference title', width: 100 },
                    { name: 'Attachment Names', width: 200 },
                    { name: 'Created Date', width: 100 }
                ];
                var datas_1 = _.map(_.filter(e.data, function (o) { return o.type === 'Lessons Learnt' }), function (o1) {
                    return { cells: getExcelLL(o1), type: 'data' };
                });
                var columns_2 = [
                    { name: 'Title', width: 100 },
                    { name: 'Summary', width: 100 },
                    { name: 'SupposedToHappen', width: 100 },
                    { name: 'ActuallyHappen', width: 100 },
                    { name: 'WhyDifference', width: 100 },
                    { name: 'WhatLearn', width: 100 },
                    { name: 'KDStage', width: 100 },
                    { name: 'CopName', width: 100 },
                    { name: 'Location', width: 100 },
                    { name: 'ValueCreationType', width: 100 },
                    { name: 'CurrentStatus', width: 100 },
                    { name: 'SMEUser name', width: 100 },
                    { name: 'CreatedBy name', width: 100 },
                    { name: 'Document type name', width: 100 },
                    { name: 'Discipline', width: 100 },
                    { name: 'Subdiscipline', width: 100 },
                    { name: 'Authors', width: 100 },
                    { name: 'Project', width: 100 },
                    { name: 'Project phase', width: 100 },
                    { name: 'Wells', width: 100 },
                    { name: 'Well phase', width: 100 },
                    { name: 'Well operation', width: 100 },
                    { name: 'Equipment', width: 100 },
                    { name: 'Keyword', width: 100 },
                    { name: 'Value Type', width: 100 },
                    { name: 'Estimated value', width: 100 },
                    { name: 'Remark', width: 100 },
                    { name: 'Reference title', width: 100 },
                    { name: 'Attachment Names', width: 200 },
                    { name: 'Created Date', width: 100 }
                ];
                var datas_2 = _.map(_.filter(e.data, function (o) { return o.type === 'Best Practices' }), function (o1) {
                    return { cells: getExcelBP(o1), type: 'data' };
                });

                var columns_3 = [
                    { name: 'Title', width: 100 },
                    { name: 'Summary', width: 100 },
                    { name: 'KDStage', width: 100 },
                    { name: 'CopName', width: 100 },
                    { name: 'Location', width: 100 },
                    { name: 'ValueCreationType', width: 100 },
                    { name: 'CurrentStatus', width: 100 },
                    { name: 'SMEUser name', width: 100 },
                    { name: 'CreatedBy name', width: 100 },
                    { name: 'Document type name', width: 100 },
                    { name: 'Discipline', width: 100 },
                    { name: 'Subdiscipline', width: 100 },
                    { name: 'Sourcename', width: 100 },
                    { name: 'ISBN', width: 100 },
                    { name: 'URL', width: 100 },
                    { name: 'ArticleTitle', width: 100 },
                    { name: 'BookTitle', width: 100 },
                    { name: 'Authors', width: 100 },
                    { name: 'EventName', width: 100 },
                    { name: 'EventYear', width: 100 },
                    { name: 'DigitalMediaType Name', width: 100 },
                    { name: 'PublishedDate', width: 100 },
                    { name: 'NewspaperName', width: 100 },
                    { name: 'MagazineName', width: 100 },
                    { name: 'PublicationMonth', width: 100 },
                    { name: 'PublicationYear', width: 100 },
                    { name: 'Country', width: 100 },
                    { name: 'Society', width: 100 },
                    { name: 'AudienceLevel', width: 100 },
                    { name: 'Authors', width: 100 },
                    { name: 'Project', width: 100 },
                    { name: 'Project phase', width: 100 },
                    { name: 'Wells', width: 100 },
                    { name: 'Well phase', width: 100 },
                    { name: 'Well operation', width: 100 },
                    { name: 'Equipment', width: 100 },
                    { name: 'Keyword', width: 100 },
                    { name: 'Value Type', width: 100 },
                    { name: 'Estimated value', width: 100 },
                    { name: 'Remark', width: 100 },
                    { name: 'Reference title', width: 100 },
                    { name: 'Attachment Names', width: 200 },
                    { name: 'Created Date', width: 100 }
                ];
                var datas_3 = _.map(_.filter(e.data, function (o) { return o.type === 'Publications' }), function (o1) {
                    return { cells: getExcelPub(o1), type: 'data' };
                });

                var columns_4 = [
                    { name: 'Title', width: 100 },
                    { name: 'Summary', width: 100 },
                    { name: 'Description', width: 100 },
                    { name: 'Recommendation', width: 100 },
                    { name: 'KDStage', width: 100 },
                    { name: 'CopName', width: 100 },
                    { name: 'Location', width: 100 },
                    { name: 'ValueCreationType', width: 100 },
                    { name: 'CurrentStatus', width: 100 },
                    { name: 'GroupTechnicalAuthority', width: 100 },
                    { name: 'CreatedBy name', width: 100 },
                    { name: 'Document type name', width: 100 },
                    { name: 'Discipline', width: 100 },
                    { name: 'Subdiscipline', width: 100 },
                    { name: 'Authors', width: 100 },
                    { name: 'Project', width: 100 },
                    { name: 'Project phase', width: 100 },
                    { name: 'Wells', width: 100 },
                    { name: 'Well phase', width: 100 },
                    { name: 'Well operation', width: 100 },
                    { name: 'Equipment', width: 100 },
                    { name: 'Keyword', width: 100 },
                    { name: 'Value Type', width: 100 },
                    { name: 'Estimated value', width: 100 },
                    { name: 'Remark', width: 100 },
                    { name: 'Attachment Names', width: 200 },
                    { name: 'Created Date', width: 100 }
                ];
                var datas_4 = _.map(_.filter(e.data, function (o) { return o.type === 'Technical Alerts' }), function (o1) {
                    return { cells: getExcelTA(o1), type: 'data' };
                });

                var workbook = new kendo.ooxml.Workbook({
                    sheets: [
                        {
                            title: "Lesson Learnt",
                            columns: _.map(columns_1, function (o) { return { autoWidth: false, width: o.width } }),
                            freezePane: {
                                colSplit: 0,
                                rowSplit: 1,
                            },
                            filter: {
                                from: 0,
                                to: columns_1.length - 1
                            },
                            rows: _.concat([{
                                cells: _.map(columns_1, function (o) {
                                    return {
                                        background: "#7a7a7a",
                                        color: '#fff',
                                        value: o.name,
                                        rowSpan: 1,
                                        colSpan: 1
                                    }
                                }),
                                type: 'header'
                            }], datas_1)
                        },
                        {
                            title: "Best Practice",
                            columns: _.map(columns_2, function (o) { return { autoWidth: false, width: o.width } }),
                            freezePane: {
                                colSplit: 0,
                                rowSplit: 1,
                            },
                            filter: {
                                from: 0,
                                to: columns_2.length - 1
                            },
                            rows: _.concat([{
                                cells: _.map(columns_2, function (o) {
                                    return {
                                        background: "#7a7a7a",
                                        color: '#fff',
                                        value: o.name,
                                        rowSpan: 1,
                                        colSpan: 1
                                    }
                                }),
                                type: 'header'
                            }], datas_2)
                        },
                        {
                            title: "Publication",
                            columns: _.map(columns_3, function (o) { return { autoWidth: false, width: o.width } }),
                            freezePane: {
                                colSplit: 0,
                                rowSplit: 1,
                            },
                            filter: {
                                from: 0,
                                to: columns_3.length - 1
                            },
                            rows: _.concat([{
                                cells: _.map(columns_3, function (o) {
                                    return {
                                        background: "#7a7a7a",
                                        color: '#fff',
                                        value: o.name,
                                        rowSpan: 1,
                                        colSpan: 1
                                    }
                                }),
                                type: 'header'
                            }], datas_3)
                        },
                        {
                            title: "Technical Alerts",
                            columns: _.map(columns_4, function (o) { return { autoWidth: false, width: o.width } }),
                            freezePane: {
                                colSplit: 0,
                                rowSplit: 1,
                            },
                            filter: {
                                from: 0,
                                to: columns_4.length - 1
                            },
                            rows: _.concat([{
                                cells: _.map(columns_4, function (o) {
                                    return {
                                        background: "#7a7a7a",
                                        color: '#fff',
                                        value: o.name,
                                        rowSpan: 1,
                                        colSpan: 1
                                    }
                                }),
                                type: 'header'
                            }], datas_4)
                        }
                    ]
                });

                var JSZipInstance;
                var oldGenerate;
                var oldJSZip;
                var blobForSave;
                if (window.JSZip && window.JSZip.support && window.JSZip.support.blob) {
                    oldGenerate = window.JSZip.prototype.generate;
                    oldJSZip = window.JSZip;
                    window.JSZip.prototype.generate = function (options) {
                        blobForSave = oldGenerate.call(JSZipInstance, _.assignIn(
                            {},
                            options,
                            {
                                type: 'blob',
                                mimeType: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'
                            }
                        ));
                        return '';
                    };
                    window.JSZip = function () {
                        JSZipInstance = new oldJSZip();
                        return JSZipInstance;
                    };
                    workbook.toDataURL();
                    window.JSZip = oldJSZip;
                    window.JSZip.prototype.generate = oldGenerate;

                    saveAs(blobForSave, "Knowledge Management.xlsx");
                } else {
                    kendo.saveAs({
                        dataURI: workbook.toDataURL(),
                        fileName: "Knowledge Management.xlsx"
                    });
                }

                //var worker = new Worker("/assets/js/worker/export.worker.js");

                //worker.postMessage(JSON.stringify(e.data));

                //worker.onmessage = function (event) {
                //    console.log(event.data);
                //}
            },
            change: function () {
                // TODO: Refactor to use data-binding instead. Currently, data-binding doesn't update button state immediately
                var selectedCount = vm.grid.select().length;

                vm.grid.element.find('.k-grid-edit').each(function () {
                    $(this).kendoButton().data('kendoButton').enable(selectedCount === 1);
                });
                vm.grid.element.find('.k-grid-delete,.k-grid-validate').each(function () {
                    $(this).kendoButton().data('kendoButton').enable(selectedCount > 0);
                });
            },
            save: function (e) {
                e.preventDefault();
                if (e.model.type !== 'Bulk') {
                    var formData = {
                        id: e.model.id,
                        title: vm.dataItem.title,
                        DisciplineIds: vm.SelectedDisciplineIds,
                        SubDisciplineIds: vm.SelectedSubDisciplineIds,
                        SMEUserId: vm.dataItem.smeUser != null ? vm.SMEUserId : null,
                        AuthorIds: vm.SelectedAuthorIds,
                        hasAttachment: vm.dataItem.hasAttachment,
                        type: vm.dataItem.type
                    };

                    KnowledgeManagementApi.updateKnowledge(formData).then(function (data) {
                        if (data.result) {
                            vm.gridDataSource.read();
                        }
                    });
                } else {
                    var postData = {
                        comment: vm.bulk.comment,
                        ids: vm.bulk.ids,
                        type: vm.bulk.updateType ? vm.bulk.type : null,
                        smeUserId: vm.bulk.updateSME ? vm.bulk.smeId : null,
                        statusId: vm.bulk.updateStatus ? vm.bulk.status.id : null,
                        lessonLearntTypeId: (vm.bulk.updateType && vm.bulk.type === 'Lesson Learnt') ? vm.bulk.lessonLearntType : null
                    };
                    KnowledgeManagementApi.api.batchUpdate.save(null, postData).$promise.then(function (res) {
                        logger.success('Update successfully');
                        vm.gridDataSource.read();
                    }, function (err) {
                        logger.error(err);
                    });
                }

            },
            beforeEdit: function (e) {
                //if (_.size(vm.checkedIds) > 1) {
                e.model.type = "Bulk";
                KnowledgeManagementApi.getAllRefs().then(function (data) {
                    vm.AllLLType = data.allLLType;
                    vm.AllStatus = data.allStatus;
                    vm.bulk = {
                        updateType: false,
                        type: 'Best Practice',
                        lessonLearntType: _.head(data.allLLType).id,
                        updateSME: false,
                        sme: null,
                        updateStatus: false,
                        status: _.head(data.allStatus),
                        comment: null,
                        smeId: null,
                        ids: _.map(vm.checkedIds, function (val, key) { return val }),
                        hasPublication: !_.isEmpty(_.filter(vm.checkedItems, function (o) { return o.type === 'Publications' })),
                        hasDraft: !_.isEmpty(_.filter(vm.checkedItems, function (o) { return o.status === 'Draft' }))
                    };
                }, function (err) {
                    logger.error(err.data.message);
                });
                //}
            },
            edit: function (e) {
                if (_.size(vm.checkedIds) > 1) {
                    $('.k-window-titlebar').find('.k-window-title').text('Bulk Edit');
                    vm.SMEControl.enable(false);
                }
            }
        };

        function htmlDecode(value) {
            return $('<div/>').html(value).text();
        };

        function formatDate(date) {
            if (!date) return "";
            var monthNames = [
                "Jan", "Feb", "Mar",
                "Apr", "May", "Jun", "Jul",
                "Aug", "Sep", "Oct",
                "Nov", "Dec"
            ];
            date = new Date(date);
            var day = date.getDate();
            day = day <= 9 ? ('0' + day) : day
            var monthIndex = date.getMonth();
            var year = date.getFullYear();

            return day + '-' + monthNames[monthIndex] + '-' + year;
        }


        function getExcelLL(row) {
            var result = getExcelCommon(row);
            var addmore = [
                { value: 'To be follow' },
                { value: htmlDecode(row.supposedToHappen) },
                { value: htmlDecode(row.actuallyHappen) },
                { value: htmlDecode(row.whyDifference) },
                { value: htmlDecode(row.whatLearn) }
            ];
            var args = [1, 0].concat(addmore);
            Array.prototype.splice.apply(result, args);
            result.push({ value: formatDate(row.createdDate) });
            return Utils.escapeArray(result);
        };

        function getExcelBP(row) {
            var result = getExcelCommon(row);
            var addmore = [
                { value: htmlDecode(row.supposedToHappen) },
                { value: htmlDecode(row.actuallyHappen) },
                { value: htmlDecode(row.whyDifference) },
                { value: htmlDecode(row.whatLearn) }
            ];
            var args = [2, 0].concat(addmore);
            Array.prototype.splice.apply(result, args);
            result.push({ value: formatDate(row.createdDate) });
            return Utils.escapeArray(result);
        };

        function getExcelPub(row) {
            var result = [];
            result.push({ value: row.title });
            result.push({ value: row.summary });
            result.push({ value: row.kdStage });
            result.push({ value: row.copName });
            result.push({ value: row.location });
            result.push({ value: row.valueCreationType });
            result.push({ value: row.status });
            result.push({ value: row.smeUserName });
            result.push({ value: row.createdByName });
            result.push({ value: row.documentTypeName });
            result.push({ value: _.join(_.uniq(_.map(row.disciplineResponses, function (o) { return o.title })), ',') });
            result.push({ value: _.join(_.uniq(_.map(row.subDisciplineResponses, function (o) { return o.title })), ',') });
            result.push({ value: row.sourcename });
            result.push({ value: row.isbn });
            result.push({ value: row.url });
            result.push({ value: row.articleTitle });
            result.push({ value: row.bookTitle });
            
            result.push({ value: _.join(_.map(row.author, function (o) { return o.title }), ',') });
            result.push({ value: row.eventName });
            result.push({ value: row.eventYear });
            result.push({ value: row.digitalMediaTypeName });
            result.push({ value: row.publishedDate });
            result.push({ value: row.newspaperName });
            result.push({ value: row.magazineName });
            result.push({ value: row.publicationMonth });
            result.push({ value: row.publicationYear });
            result.push({ value: row.country });
            result.push({ value: row.society });
            result.push({ value: row.audienceLevel });
            result.push({ value: _.join(_.map(row.author, function (o) { return o.title }), ',') });

            result.push({ value: _.join(row.project, ',') });
            result.push({ value: _.join(row.projectPhase, ',') });
            result.push({ value: _.join(row.wells, ',') });
            result.push({ value: _.join(row.wellsPhase, ',') });
            result.push({ value: _.join(row.wellOperation, ',') });
            result.push({ value: _.join(row.equipment, ',') });
            result.push({ value: _.join(row.keyword, ',') });
            result.push({ value: _.join(row.valueType, ',') });
            result.push({ value: _.join(row.estimatedValue, ',') });
            result.push({ value: _.join(row.remark, ',') });
            result.push({ value: row.referenceTitle});
            result.push({ value: _.join(row.attachmentNames, ',') });
            result.push({ value: row.createdDate });
            return result;
        };

        function getExcelTA(row) {
            var result = [];
            result.push({ value: row.title });
            result.push({ value: row.summary });
            result.push({ value: row.description });
            result.push({ value: row.recommendation });
            result.push({ value: row.kdStage });
            result.push({ value: row.copName });
            result.push({ value: row.location });
            result.push({ value: row.valueCreationType });
            result.push({ value: row.status });
            result.push({ value: row.groupTechnicalAuthority });
            result.push({ value: row.createdByName });
            result.push({ value: row.documentTypeName });
            result.push({ value: _.join(_.uniq(_.map(row.disciplineResponses, function (o) { return o.title })), ',') });
            result.push({ value: _.join(_.uniq(_.map(row.subDisciplineResponses, function (o) { return o.title })), ',') });
            result.push({ value: _.join(_.map(row.author, function (o) { return o.title }), ',') });
            result.push({ value: _.join(row.project, ',') });
            result.push({ value: _.join(row.projectPhase, ',') });
            result.push({ value: _.join(row.wells, ',') });
            result.push({ value: _.join(row.wellsPhase, ',') });
            result.push({ value: _.join(row.wellOperation, ',') });
            result.push({ value: _.join(row.equipment, ',') });
            result.push({ value: _.join(row.keyword, ',') });
            result.push({ value: _.join(row.valueType, ',') });
            result.push({ value: _.join(row.estimatedValue, ',') });
            result.push({ value: _.join(row.remark, ',') });
            result.push({ value: _.join(row.attachmentNames, ',') });
            result.push({ value: row.createdDate });
            return result;
        };


        function getExcelCommon(row) {
            var result = [];
            result.push({ value: row.title });
            result.push({ value: row.summary });
            result.push({ value: row.kdStage });
            result.push({ value: row.copName });
            result.push({ value: row.location });
            result.push({ value: row.valueCreationType });
            result.push({ value: row.status });
            result.push({ value: row.smeUserName });
            result.push({ value: row.createdByName });
            result.push({ value: row.documentTypeName });
            result.push({ value: _.join(_.uniq(_.map(row.disciplineResponses, function (o) { return o.title })), ',') });
            result.push({ value: _.join(_.uniq(_.map(row.subDisciplineResponses, function (o) { return o.title })), ',') });
            result.push({ value: _.join(_.map(row.author, function (o) { return o.title }), ',') });
            result.push({ value: _.join(row.project, ',') });
            result.push({ value: _.join(row.projectPhase, ',') });
            result.push({ value: _.join(row.wells, ',') });
            result.push({ value: _.join(row.wellsPhase, ',') });
            result.push({ value: _.join(row.wellOperation, ',') });
            result.push({ value: _.join(row.equipment, ',') });
            result.push({ value: _.join(row.keyword, ',') });
            result.push({ value: _.join(row.valueType, ',') });
            result.push({ value: _.join(row.estimatedValue, ',') });
            result.push({ value: _.join(row.remark, ',') });
            result.push({ value: _.join(row.referenceTitle, ',') });
            result.push({ value: _.join(row.attachmentNames, ',') });
            return result;
        };

        vm.SelectedDisciplineIds = [];
        vm.checkItem = function (data) {
            if (data.CheckItem) {
                vm.checkedIds[data.id] = data.id;
                vm.checkedItems.push(angular.copy(data));
                vm.selectItemId = data.id;
            } else {
                try {
                    delete vm.checkedIds[data.id];
                    _.remove(vm.checkedItems, function (o) { return o.id === data.id });
                } catch (ex) { }
                vm.selectItemId = vm.checkedIds ? vm.checkedIds[Object.keys(vm.checkedIds)[0]] : null;
            }

            setButtonStatus();
        };

        function setButtonStatus() {
            var selectchk = $(".grid table input.k-checkbox:checked");
            if (selectchk.length > 0) {
                $(".k-grid-delete").removeClass("k-state-disabled");
                $(".k-grid-edit").removeClass("k-state-disabled");
                //if (selectchk.length === 1)
                //    $(".k-grid-edit").removeClass("k-state-disabled");
                //else if (!$(".k-grid-edit").hasClass("k-state-disabled"))
                //    $(".k-grid-edit").addClass("k-state-disabled");
            }
            else {
                if (!$(".k-grid-delete").hasClass("k-state-disabled"))
                    $(".k-grid-delete").addClass("k-state-disabled");
                if (!$(".k-grid-edit").hasClass("k-state-disabled"))
                    $(".k-grid-edit").addClass("k-state-disabled");
            }
        };

        vm.headerChbChangeFunc = function () {
            var checked = $("#header-chb").prop('checked');
            vm.isCheckedMulti = checked;
            $('.row-checkbox').each(function (idx, item) {
                if (checked != $(item).prop("checked"))
                    $(item).trigger('click');
            });
        };

        vm.validate = function () {
            var selectedIds = _.map(vm.checkedIds, function (num, key) { return key; });
            if (selectedIds.length <= 0) return;

            KnowledgeManagementApi.validate(selectedIds).then(function (response) {
                if (response.result) {
                    logger.success('Validate success.');
                    vm.gridDataSource.read();
                }
                else {
                    logger.success('There selected items cannot validate.');
                }
            });
        };

        vm.exportWithReplication = function () {
            vm.isWithReplication = true;
            // Trigger export excel event
            var grid = $("#xgrid").data("kendoGrid");
            grid.saveAsExcel();

            vm.isWithReplication = false;

            //var options = angular.copy(vm.options);
            //var total = angular.copy(vm.gridDataSource.total());
            //KnowledgeManagementApi.exportWithReplication(options, vm.searchTerm, vm.filterBy, total);
            //vm.gridDataSource.read();
            //return;
        };

        vm.AllDisciplines = [];
        vm.AllSubDisciplines = [];

        vm.disciplinesOptions = {
            select: function (e) {

                vm.AllSubDisciplines = [];
                //get sub-discipline
                vm.SelectedDisciplineIds.push(e.dataItem.id);
                CommonApi.getSubDisciplines(vm.SelectedDisciplineIds).then(function (items) {

                    vm.AllSubDisciplines = items;
                    $.each(vm.AllSubDisciplines, function (sindex, svalue) {
                        svalue.title = svalue.subDisciplineName;
                    });
                });
            },
            deselect: function (e) {
                vm.AllSubDisciplines = [];
                var indexItem = vm.SelectedDisciplineIds.indexOf(e.dataItem.id);
                if (indexItem != -1) {
                    vm.SelectedDisciplineIds.splice(indexItem, 1);
                    CommonApi.getSubDisciplines(vm.SelectedDisciplineIds).then(function (items) {

                        vm.AllSubDisciplines = items;
                        $.each(vm.AllSubDisciplines, function (sindex, svalue) {
                            svalue.title = svalue.subDisciplineName;
                        });
                    });
                }
            }
        };

        vm.BulkSMESource = {
            dataTextField: "Text",
            dataValueField: "Id",
            filter: "contains",
            minLength: 1,
            dataSource: {
                serverFiltering: true,
                transport: {
                    read: function (options) {
                        return BulkUploadApi.GetSmeUsers(options);
                    }
                },
            },
            select: function (e) {
                vm.bulk.smeId = e.dataItem.Id;
            }
        };

        vm.SMEUserId = null;
        vm.SMESource = {
            dataTextField: "Text",
            dataValueField: "Id",
            filter: "contains",
            minLength: 1,
            dataSource: {
                serverFiltering: true,
                transport: {
                    read: function (options) {
                        return BulkUploadApi.GetSmeUser(options, vm.SelectedDisciplineIds);
                    }
                },
            },
            select: function (e) {
                vm.SMEUserId = e.dataItem.Id;
            }
        };

        vm.DisciplineSrc = {
            dataTextField: "Text",
            dataValueField: "Id",
            placeholder: "Filter by Discipline",
            minLength: 1,
            delay: 500,
            dataSource: {
                serverFiltering: true,
                transport: {
                    read: function (options) {
                        return KnowledgeDiscoveryApi.getDiscipline(options, [], []);
                    }
                }
            },
            open: function (e) {
                $timeout(function () {
                    e.sender.list.closest('.k-animation-container').find('.k-list-container').addClass('multiselect_panel no_grouping');
                });
            },
            select: function (e) {
                searchDisciplineId = e.dataItem.Id;
                vm.search();
            },
            change: function (e) {
                if (_.isEmpty(vm.searchDiscipline)) {
                    searchDisciplineId = 0;
                    vm.search();
                }
            }
        };

        vm.AuthorSrc = {
            dataTextField: "displayName",
            dataValueField: "name",
            placeholder: "Filter by Author",
            minLength: 1,
            delay: 500,
            dataSource: {
                serverFiltering: true,
                transport: {
                    read: function (options) {
                        return SearchApi.searchUser(options, []);
                    }
                },
            },
            open: function (e) {
                $timeout(function () {
                    e.sender.list.closest('.k-animation-container').find('.k-list-container').addClass('multiselect_panel no_grouping');
                });
            },
            select: function (e) {
                searchAuthorId = e.dataItem.name;
                vm.search();
            },
            change: function (e) {
                if (_.isEmpty(vm.searchAuthor)) {
                    searchAuthorId = '';
                    vm.search();
                }
            }
        };

        vm.toggleSME = function () {
            vm.SMEControl.enable(vm.bulk.updateSME);
        };

        vm.AllAuthors = [];
        vm.SelectedAuthorIds = [];

        function _onOpen(e) {
            $timeout(function () {
                e.sender.list.closest('.k-animation-container').find('.k-list-container').addClass('multiselect_panel no_grouping');
            });
        };

        $scope.onOpen = _onOpen;

        $timeout(function () {
            //Add title on toolbar
            $(".k-grid-edit").before("<h5>Bulk Actions</h5>");

            $('.grid table').each(function () {
                $(this).wrap('<div class="table-responsive" />');
            });

            // Add toolbar after Grid, before pager
            $('.grid').each(function () {
                if ($(this).find('.k-grid-toolbar').length < 2) {
                    $(this).find(".k-grid-toolbar").clone(true, true).insertBefore($(".k-grid-pager", this));
                }
            });
            $(".k-grid-delete").addClass("k-state-disabled");
            $(".k-grid-edit").addClass("k-state-disabled");
            $('.k-grid-edit').on('click', function (e) {
                //if (vm.isCheckedMulti) return;
                if (!vm.checkedIds) return;
                if (_.size(vm.checkedIds) === 1) {
                    var trEl = $('input#chk_' + vm.selectItemId).closest('tr');

                    vm.SelectedDisciplineIds = [];
                    vm.SelectedSubDisciplineIds = [];
                    vm.SelectedAuthorIds = [];
                    vm.AllAuthors = [];
                    KnowledgeManagementApi.getKnowledgeDocumentSettingById(vm.selectItemId).then(function (data) {
                        vm.dataItem = data;
                        vm.SelectedDisciplineIds = _.map(data.discipline, function (o) { return o.id; });

                        if (data.smeUser != null) {
                            vm.SMEUserId = data.smeUser.id;
                            vm.SMEUser = data.smeUser.title;
                        }

                        // Get all Authors                    
                        UserProfileApi.getAllUsers().then(function (allAuthors) {
                            vm.AllAuthors = allAuthors;
                            vm.SelectedAuthorIds = _.map(data.authors, function (o) { return o.id; });
                        });
                        if (vm.SelectedDisciplineIds != null && vm.SelectedDisciplineIds.length > 0) {
                            CommonApi.getSubDisciplines(vm.SelectedDisciplineIds).then(function (items) {

                                vm.AllSubDisciplines = items;
                                $.each(vm.AllSubDisciplines, function (sindex, svalue) {
                                    svalue.title = svalue.subDisciplineName;
                                });
                                vm.SelectedSubDisciplineIds = _.map(data.subDiscipline, function (o) { return o.id; });
                            });
                        }

                        vm.hasAttachment = angular.copy(data.hasAttachment);
                    });
                    vm.grid.editRow(trEl);
                } else {
                    var trEl = $('input#chk_' + _.sample(vm.checkedIds)).closest('tr');
                    vm.grid.editRow(trEl);
                }
            });

            $('.k-grid-delete').click(function (e) {
                if (!vm.checkedIds) {
                    return;
                }
                var ids = _.map(vm.checkedIds, function (num, key) { return key; });
                if (ids.length <= 0) return;

                var confirm = $window.confirm("Are you sure you want to delete this record?");
                if (!confirm) {
                    return;
                }

                KnowledgeManagementApi.deleteKnowledges(ids).then(function (data) {
                    if (data.result)
                        vm.gridDataSource.read();
                });
            });

            UserProfileApi.getAllUsers().then(function (allAuthors) {
                vm.AllAuthors = allAuthors;
            });

            CommonApi.getAllDiscipline().then(function (items) {
                vm.AllDisciplines = items;
            });

        }, 1000);
    }

})();
