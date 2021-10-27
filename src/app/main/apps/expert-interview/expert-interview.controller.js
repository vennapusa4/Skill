(function () {
    'use strict';

    angular
        .module('app.expertInterview')
        .controller('ExpertInterviewController', ExpertInterviewController);

    /** @ngInject */
    function ExpertInterviewController($scope, ExpertInterviewApi, $timeout, $window, Utils, CommonApi, BulkUploadApi, UserProfileApi, KnowledgeDiscoveryApi, SearchApi, $location) {
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
                        { field: 'Authors', value: searchAuthorId }
                    ];
                    return ExpertInterviewApi.getExpertInterviewManagements(options, vm.searchTerm, filterBy, vm.gridDataSource.total());
                },
                update: function (e) {
                    e.success();
                },
                destroy: function (e) {
                    ExpertInterviewApi.deleteItem({ id: e.data.id }).then(function (data) {
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
                {
                    name: "create",
                    iconClass: "c-icon icon-new",
                    text: "Add New"
                },
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

                        if (dataItem.status == "Draft") {
                            result = "<a href='/expert-interview/" + dataItem.id + "'>" + dataItem.title + "</a>"
                        } else {
                            result = "<a href='/expert-interview/" + dataItem.id + "'> " + dataItem.title + "</a>"
                        }

                        return result;
                    }
                },
                {
                    field: "attachment",
                    title: "<i class='icon-attachment'></i>",
                    template: '#: attachment ? "Yes":"No" #',
                    width: '60px'
                },
                {
                    field: 'smeUser',
                    title: 'SME User',
                    // template: '<span>#= smeUser.title# </span>',
                    template: function (dataItem) {
                        if (dataItem.smeUser && dataItem.smeUser.title) {
                            return dataItem.smeUser.title;
                        }

                        return '';
                    },
                    width: '120px'
                },
                {
                    field: 'disciplines',
                    title: 'Disciplines',
                    editable: false,
                    template: '# for(var i = 0; i < disciplines.length; i++) {# #:disciplines[i].title# <br/> #}#'
                },
                // {
                //   field: "status",
                //   title: "Status",
                // },
                {
                    field: 'createdDate',
                    title: 'Date',
                    format: '{0:dd-MMM-yyyy}',
                    width: '120px'
                },
            ],
            excel: {
                allPages: true,
                filterable: true,
                fileName: "Expert Interview.xlsx"
            },
            excelExport: function (e) {
            },
            change: function () {
                var selectedCount = vm.grid.select().length;

                vm.grid.element.find('.k-grid-delete').each(function () {
                    $(this).kendoButton().data('kendoButton').enable(selectedCount > 0);
                });
            },
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
            var result = getExcelCommon(row);
            var addmore = [
                { value: row.sourcename },
                { value: row.isbn },
                { value: row.url },
                { value: row.articleTitle },
                { value: row.bookTitle },
                { value: row.authors },
                { value: row.eventName },
                { value: row.eventYear },
                { value: row.digitalMediaTypeName },
                { value: row.publishedDate },
                { value: row.magazineName },
                { value: row.newspaperName },
                { value: row.publicationMonth },
                { value: row.publicationYear },
                { value: row.country },
                { value: row.society },
                { value: row.audienceLevel }
            ];
            var args = [12, 0].concat(addmore);
            Array.prototype.splice.apply(result, args);
            result.push({ value: formatDate(row.createdDate) });
            return Utils.escapeArray(result);
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
                if (selectchk.length === 1)
                    $(".k-grid-edit").removeClass("k-state-disabled");
                else if (!$(".k-grid-edit").hasClass("k-state-disabled"))
                    $(".k-grid-edit").addClass("k-state-disabled");
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
            placeholder: "Filter by SME",
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
            $(".k-grid-edit").before("<h5>Expert Actions</h5>");

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
                if (!vm.checkedIds) {
                    return;
                }
                var ids = _.map(vm.checkedIds, function (num, key) { return key; });
                if (ids.length <= 0) return;
                $location.path("/expert-interview/add/" + ids);
            });

            $('.k-grid-edit2').on('click', function (e) {
                //if (vm.isCheckedMulti) return;
                if (!vm.checkedIds) return;
                if (_.size(vm.checkedIds) === 1) {
                    var trEl = $('input#chk_' + vm.selectItemId).closest('tr');

                    vm.SelectedDisciplineIds = [];
                    vm.SelectedSubDisciplineIds = [];
                    vm.SelectedAuthorIds = [];
                    vm.AllAuthors = [];
                    ExpertInterviewApi.getKnowledgeDocumentSettingById(vm.selectItemId).then(function (data) {
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

                ExpertInterviewApi.delete(ids).then(function (data) {
                    if (data.result)
                        vm.gridDataSource.read();
                });
            });

            $('.k-grid-add').click(function (e) {
                window.location.href = '/expert-interview/add/';
            });

            $('.k-grid-edit').click(function (e) {
                if (!vm.checkedIds) {
                    return;
                }
                var ids = _.map(vm.checkedIds, function (num, key) { return key; });
                if (ids.length <= 0) return;
                _.each(ids, function (item, index) {
                    window.location.href = '/expert-interview/add/' + item;
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
