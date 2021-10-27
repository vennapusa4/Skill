(function () {
    'use strict';

    angular
        .module('app.gameMechanics')
        .controller('GameMechanicsPointsManagementController', GameMechanicsPointsManagementController);

    /** @ngInject */
    function GameMechanicsPointsManagementController($scope, $timeout, MasterDataGameMechanicsApi, $window, $state) {

        $scope.Keyword = '';
        $scope.isSearch = false;
        $scope.pageSize = 10;
        $scope.checkedIds = {};
        $scope.selectItemId = null;
        $scope.isCheckedMulti = false;
        $scope.gridDataSource = new kendo.data.DataSource({
            transport: {
                read: function (options) {
                    $scope.checkedIds = {};
                    $("#header-chb").prop('checked', false);
                    if ($scope.isSearch) {
                        options.data.skip = 0;
                        $scope.isSearch = false;
                    }
                    return MasterDataGameMechanicsApi.getAllPoints(options, $scope.Keyword);
                },
                update: function (e) {
                    e.success();
                },
                destroy: function (e) {
                    MasterDataGameMechanicsApi.deletePoint({ id: e.data.id }).then(function (data) {
                        if (data.result) {
                            $scope.gridDataSource.read();
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
            pageSize: $scope.pageSize,
            schema: {
                data: function (e) {
                    return e.data;
                },
                total: "total",
                model: {
                    id: "id",
                    fields: {
                        ruleName: {
                            type: "string"
                        },
                        userType: {
                            type: "string"
                        },
                        condition: {
                            type: "string"
                        },
                        knowledgeType: {
                            type: "string"
                        },
                        points: {
                            type: "number"
                        },
                    }
                }
            }
        });


        //Grid definition
        $scope.mainGridOptions = {
            pageable: {
                pageSize: $scope.pageSize,
            },
            scrollable: false,
            sortable: false,
            filter: true,
            dataBound: function (e) {
                var view = this.dataSource.view();
                for (var i = 0; i < view.length; i++) {
                    if ($scope.checkedIds[view[i].id]) {
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
                    text: "Add New Rule"
                },
                {
                    name: "excel",
                    iconClass: "c-icon icon-export",
                    text: "Export"
                },
                {
                    name: "pdf",
                    iconClass: "c-icon icon-export",
                    text: "Export to PDF"
                }
            ],
            excel: {
                allPages: true,
                filterable: true,
                fileName: "Game Mechanics_PointManagement.xlsx"
            },
            excelExport: function (e) {
                var sheet = e.workbook.sheets[0];
                _.set(sheet, 'columns', [
                    { width: 300, autoWidth: false },
                    { width: 150, autoWidth: false },
                    { width: 150, autoWidth: false },
                ]);
            },
            pdf: {
                allPages: true,
                filterable: true,
                fileName: "Game Mechanics_PointManagement.pdf",
                paperSize: "A4",
                landscape: true,
                scale: 0.75
            },
            dataSource: $scope.gridDataSource,
            columns: [
                {
                    title: 'Select All',
                    headerTemplate: "<input type='checkbox' id='header-chb' class='k-checkbox header-checkbox' ng-click='headerChbChangeFunc()' ><label class='k-checkbox-label' for='header-chb'></label>",
                    template: function (dataItem) {
                        return "<input type='checkbox' id='chk_{{dataItem.id}}' ng-model='dataItem.CheckItem' ng-change='checkItem(dataItem)' class='k-checkbox row-checkbox' ><label class='k-checkbox-label' for='chk_{{dataItem.id}}'></label>"
                    },
                    width: "30px",
                    attributes: {
                        "class": "check_cell",
                    }
                },
                {
                    field: "ruleName",
                    title: "Rules Name",
                    template: function (dataItem) {
                        return "<a href='javascript: void(0)' ng-click='editItem(" + dataItem.id + ")'>" + dataItem.ruleName + "</a>";
                    }
                },
                {
                    field: "userType",
                    title: "User Type",
                },
                {
                    field: "condition",
                    title: "Condition",
                },
                {
                    field: "knowledgeType",
                    title: "Knowledge Type",
                },
                {
                    field: "point",
                    title: "Point",
                    template: function (dataItem) {
                        if (dataItem.point) {
                            if (dataItem.point > 0) {
                                return "<span>+" + dataItem.point + "</span>";
                            }
                            return "<span>" + dataItem.point + "</span>";
                        }

                        return '';
                    },
                },
                {
                    title: "&nbsp;",
                    template: function (dataItem) {
                        return "<span style='cursor: pointer;float:right'><i class='fa fa-ellipsis-v' aria-hidden='true' style='color:#898989'></i></span>";
                    },
                    width: "30px"
                }
            ],
        };

        $scope.Search = function () {
            $scope.isSearch = true;
            $scope.gridDataSource.query({
                page: 1,
                pageSize: $scope.pageSize
            });
        }

        $scope.editItem = function (itemId) {
            $state.go('appAdmin.gameMechanicsAdmin.pointBuild', { id: itemId });
        }

        $scope.checkItem = function (data) {
            if (data.CheckItem) {
                $scope.checkedIds[data.id] = data.id;
                $scope.selectItemId = data.id;
            } else {
                try {
                    delete $scope.checkedIds[data.id];
                } catch (ex) { }
                $scope.selectItemId = $scope.checkedIds ? $scope.checkedIds[Object.keys($scope.checkedIds)[0]] : null;
            }

            $scope.isCheckedMulti = Object.keys($scope.checkedIds).length > 1;
            var selectchk = $(".grid table input.k-checkbox:not(.header-checkbox):checked");
            if (selectchk.length == 1) {
                $(".k-grid-edit").removeClass("k-state-disabled");
            } else {
                $(".k-grid-edit").addClass("k-state-disabled");
            }
            var selectnonechk = $(".grid table input.k-checkbox:not(.header-checkbox)");
            $("#header-chb").prop('checked', selectchk.length == selectnonechk.length);
        };

        $scope.headerChbChangeFunc = function () {
            var checked = $("#header-chb").prop('checked');
            $scope.isCheckedMulti = checked;
            $('.row-checkbox').each(function (idx, item) {
                if (checked != $(item).prop("checked"))
                    $(item).trigger('click');
            });
        };

        $timeout(function () {
            $(".k-grid-edit").before("<h5>Bulk Actions</h5>");

            $('.grid table').each(function () {
                $(this).wrap('<div class="table-responsive" />');
            });

            $('.grid').each(function () {
                if ($(this).find('.k-grid-toolbar').length < 2) {
                    $(this).find(".k-grid-toolbar").clone(true, true).insertBefore($(".k-grid-pager", this));
                }
            });

            $(".k-grid-edit").addClass("k-state-disabled");
            $('.k-grid-edit').on('click', function (e) {
                if ($scope.isCheckedMulti) return;
                $state.go('appAdmin.gameMechanicsAdmin.pointBuild', { id: $scope.selectItemId });
            });
            $('.k-grid-add').on('click', function (e) {
                $state.go('appAdmin.gameMechanicsAdmin.pointBuild');
            });

            $('.k-grid-delete').click(function (e) {
                if (!$scope.checkedIds) {
                    return;
                }
                var confirm = $window.confirm("Are you sure you want to delete this record?");
                if (!confirm) {
                    return;
                }
                var ids = _.map($scope.checkedIds, function (num, key) { return key; });
                if (ids.length <= 0) return;

                MasterDataGameMechanicsApi.deleteMultiPoints(ids).then(function (data) {
                    if (data.result)
                        $scope.gridDataSource.read();
                });
            });
        }, 1000);

    }
})();
