(function () {
    'use strict';

    angular
        .module('app.gamificationBadges')
        .controller('GamificationBadgesAdminController', GamificationBadgesAdminController);

    /** @ngInject */
    function GamificationBadgesAdminController($scope, $timeout, GamificationBadgeApi, CommonApi) {
        var vm = this;
        $scope.pageSize = 10;

        $scope.gridDataSource = new kendo.data.DataSource({
            transport: {
                read: function (options) {
                    return GamificationBadgeApi.getGamificationBadges(options, $scope.Keyword);
                },
                update: function (e) {
                    e.success();
                },
                destroy: function (e) {
                    e.success();
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
                        imageUrl: { type: "string" },
                        badgeName: { type: "string" },
                        ruleTypeId: { type: "number" },
                        ruleType: { type: "string" }
                    }
                }
            }
        });

        $scope.Search = function () {
            $scope.gridDataSource.query({
                page: 1,
                pageSize: $scope.pageSize
            });
        }

        //Grid definition
        $scope.mainGridOptions = {
            pageable: {
                pageSize: $scope.pageSize,
            },
            scrollable: false,
            sortable: false,
            filter: true,
            dataBound: onDataBound,
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
                },
            ],
            excel: {
                allPages: true,
                filterable: true,
                fileName: "GamificationBadges.xlsx"
            },
            dataSource: $scope.gridDataSource,
            columns: [
                //define template column with checkbox and attach click event handler
                {
                    title: 'Select All',
                    headerTemplate: "<input type='checkbox' id='header-chb' class='k-checkbox header-checkbox' ng-click='headerChbChangeFunc()' ><label class='k-checkbox-label' for='header-chb'></label>",
                    template: function (dataItem) {
                        return "<input type='checkbox' id='chk_{{dataItem.id}}' ng-model='dataItem.CheckItem' ng-change='checkItem(dataItem)' class='k-checkbox row-checkbox' ><label class='k-checkbox-label' for='chk_{{dataItem.id}}'></label>"
                    },
                    // template: "<input type='checkbox' ng-model='dataItem.CheckItem' ng-change='checkItem(dataItem)' class='k-checkbox row-checkbox' /><label class='k-checkbox-label' for='${dataItem.id}'>",
                    width: "30px",
                    attributes: {
                        "class": "check_cell",
                    },
                },
                {
                    field: "badgeName",
                    title: "Badge Name",
                    template: "<img class='img_badge' src='#=data.imageUrl#' /> #=data.badgeName#",
                    attributes: {
                        "class": "badge_name",
                    },
                },
                {
                    field: "ruleTypeId",
                    title: "Achievement Rule",
                    template: "#:data.ruleType#"
                }
                //, { command: ["edit", "destroy"], title: "&nbsp;" }
            ],
            editable: {
                mode: "popup",
                template: kendo.template($("#editorTemplate").html())
            },
            save: function (e) {
                e.preventDefault();

                var validator = $("#gamification-badge-form").kendoValidator({
                    rules: {
                        upload: function (input) {
                            if (input[0].id == "gamification-badge-image" && e.model.isNew()) {
                                return !_.isNull($scope.previewFile);
                            }
                            return true;
                        }
                    }
                }).data("kendoValidator");

                if (validator.validate()) {
                    var formData = new FormData();
                    if ($scope.previewFile) formData.append("attachment", $scope.previewFile);
                    formData.append("id", e.model.id);
                    formData.append("badgeName", e.model.badgeName);
                    formData.append("ruleTypeId", e.model.ruleTypeId);

                    GamificationBadgeApi.saveGamificationBadge(formData).then(function (data) {
                        $scope.Search();
                    });
                }
            },
            edit: function (e) {
                $scope.preview = null;
                $scope.previewFile = null;
                if (e.model.isNew()) {
                    e.container.kendoWindow("title", "Add New");
                }
                else {
                    e.container.kendoWindow("title", "Edit");
                }
            }
        };

        $scope.id = null;
        $scope.checkItem = function (data) {
            if (data.CheckItem) {
                $scope.disabledClick = false;
                $scope.id = data.id;
            } else {
                $scope.disabledClick = true;
                $scope.ids = $.grep($scope.ids || [], function (a) {
                    return a !== data.id;
                });
            }
            setButtonStatus();

        };

        $scope.RuleTypes = {
            dataTextField: "name",
            dataValueField: "id",
            minLength: 1,
            delay: 500,
            dataSource: {
                serverFiltering: true,
                transport: {
                    read: function (options) {
                        return CommonApi.getAllRuleTypes(options);
                    }
                }
            }
        };

        var checkedIds = {};

        function selectRow() {
            var checked = this.checked,
                row = $(this).closest("tr"),
                grid = $(".grid").data("kendoGrid"),
                dataItem = grid.dataItem(row);

            checkedIds[dataItem.id] = checked;
            if (checked) {
                //-select the row
                row.addClass("k-state-selected");
            } else {
                //-remove selection
                row.removeClass("k-state-selected");
            }
            setButtonStatus();
        }


        $scope.headerChbChangeFunc = function () {
            var checked = $("#header-chb").prop('checked');
            $('.row-checkbox').each(function (idx, item) {
                if (checked) {
                    if (!($(item).closest('tr').is('.k-state-selected'))) {
                        $(item).click();
                    }
                } else {
                    if ($(item).closest('tr').is('.k-state-selected')) {
                        $(item).click();
                    }
                }
            });
        };

        // Add toolbar after Grid, before pager

        //on dataBound event restore previous selected rows:
        function onDataBound(e) {
            var view = this.dataSource.view();
            for (var i = 0; i < view.length; i++) {
                if (checkedIds[view[i].id]) {
                    this.tbody.find("tr[data-uid='" + view[i].uid + "']")
                        .addClass("k-state-selected")
                        .find(".checkbox")
                        .attr("checked", "checked");
                }
            }
        }

        function setButtonStatus() {
            var selectchk = $(".grid table input.k-checkbox:checked");
            if (selectchk.length > 0) {
                $(".k-grid-delete").removeClass("k-state-disabled");
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
        }

        $timeout(function () {
            $(".k-grid-edit").addClass("k-state-disabled");
            $(".k-grid-delete").addClass("k-state-disabled");
            //Add title on toolbar
            $(".k-grid-edit").before("<h5>Bulk Actions</h5>");

            // Add toolbar after Grid, before pager
            $('.grid').each(function () {
                $(this).find(".k-grid-toolbar").clone().insertBefore($(".k-grid-pager", this));
            });

            $('.grid table').each(function () {
                $(this).wrap('<div class="table-responsive" />');
            });

            $('.grid table .k-checkbox').on("click", selectRow);

            $('.k-grid-edit').click(function (e) {
                if ($(".k-grid-edit").hasClass("k-state-disabled"))
                    return;
                var trEl = $('input#chk_' + $scope.id).closest('tr');
                $scope.grid.editRow(trEl);
            });

            $('.k-grid-delete').click(function (e) {
                var ids = [];
                var grid = $(this).parents('.grid').data("kendoGrid");
                $(this).parents('.grid').find("input:checked").each(function () {
                    var dataItem = grid.dataItem($(this).closest('tr'));
                    ids.push(dataItem.id);
                });
                if (ids.length > 0) {
                    if (confirm("Are you sure you want to delete these records?")) {
                        GamificationBadgeApi.deleteGamificationBadges(ids).then(function (data) {
                            if (data.result == true) $scope.Search();
                        });
                    }
                }
            });
            setButtonStatus();
        }, 1000);

        $scope.preview = null;
        $scope.previewFile = null;
        $scope.k_options = {
            multiple: false,
            localization: {
                dropFilesHere: "<i class='icon-drop'></i><br>Drag and drop files here to upload",
                select: 'or select file to upload...'
            },
            validation: { allowedExtensions: ['jpg', 'png'], maxFileSize: 10485760 },
            async: { saveUrl: 'save', removeUrl: 'remove', autoUpload: true },
            showFileList: false,
            upload: function (e) {
                e.preventDefault();
            },
            select: function (e) {
                for (var i = 0; i < e.files.length; i++) {
                    var file = e.files[i].rawFile;
                    $scope.previewFile = file;
                    if (file) {
                        var reader = new FileReader();

                        reader.onloadend = function () {
                            $scope.preview = this.result;
                            $scope.$digest();
                        };

                        reader.readAsDataURL(file);
                    }
                }
            }
        };
    }
})();
