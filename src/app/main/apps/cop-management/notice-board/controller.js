(function () {
  'use strict';

  angular
    .module('app.copManagement')
    .controller('AdminCopNoticeBoardController', AdminCopNoticeBoardController);

  /** @ngInject */
  function AdminCopNoticeBoardController($scope,$rootScope, $timeout, MasterDataGameMechanicsApi, $window, $state, AdminSettingCoPApi) {
    $scope.pageSize = 10;
    $scope.Keyword = '';
    $scope.checkedIds = {};
    $scope.selectItemId = null;
    $scope.isCheckedMulti = false;
    $scope.modal = {};
    $scope.selectedItem = {};
    $scope.btnDisable = true;


    //define modal
    $scope.modal.selectCop = 'Select CoP<strong class="req">*</strong>';
    $scope.modal.title = 'Title<strong class="req">*</strong>';
    $scope.modal.description = 'Description<strong class="req">*</strong>';
    $scope.modal.external = 'External Link';
    $scope.modal.effective = 'Effective Date<strong class="req">*</strong>';
    $scope.modal.dateCreated = 'Date Created<strong class="req">*</strong>';
    $scope.modal.createdBy = 'Created by';
    $scope.modal.modalTitle = '';

    //define params
    $scope.Field = {};
    $scope.Field.selectCop = '';
    $scope.Field.title = '';
    $scope.Field.description = '';
    $scope.Field.external = '';
   // $scope.Field.fromDate = '';
    //$scope.Field.toDate = '';
    var currentDate = new Date();
    $scope.Field.dateCreated =  kendo.parseDate(currentDate, "DD/MM/YYYY");
    $scope.Field.createdBy = $rootScope.userInfo.displayName;

    
    
    $scope.Field.fromDate = kendo.parseDate(currentDate, "dd/MM/yyyy");
    $scope.Field.toDate = kendo.parseDate(currentDate, "dd/MM/yyyy");
   //$("#toDate").data("kendoDatePicker").min($scope.Field.fromDate);
    $scope.min = $scope.Field.fromDate;

    localStorage["kendo-grid-filter"]=null;
    $scope.filterBy = {
        logic: "and",
        filters: []
    };
    $scope.filterByOriginal = {
        logic: "and",
        filters: []
    };
    $scope.filters = [];

    $scope.gridDataSource = new kendo.data.DataSource({
      transport: {
        read: function (options) {
        debugger
            $scope.checkedIds = {};
            $("#header-chb").prop('checked', false);
            return AdminSettingCoPApi.getNoticeBoard(options,$scope.Keyword,$scope.filterBy.filters.length>0?$scope.filterBy:null,$scope.gridDataSource.total());
        
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
            copName: {
              type: "string"
            },
            title: {
              type: "string"
            },
            createdDate: {
              type: "date"
            },
            isPublished: {
              type: "string"
            },
            author: {
              type: "string"
            },
            effectiveFrom:{
              type: "date"
            },
            effectiveTo: {
              type: "date"
            }
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
      filterable: true,
      filterMenuInit: function(e){
        e.container.on("click", "[type='reset']", function () {
            console.log(e);
            $scope.filterByOriginal.filters.forEach(function(filterArray , arrayIndex){
                  //to remove all checked columns onClear
                  for(var i= filterArray.filters.length ; i > 0 ; i--){
                    if(filterArray.filters[i - 1].field == e.field.charAt(0).toUpperCase()+ e.field.slice(1)){
                        var index = i-1;
                        filterArray.filters.splice(index,1);
                    }
                }
                
                if(filterArray.filters.length == 0){
                    $scope.filterByOriginal.filters.splice(arrayIndex,1);
                    $scope.filterBy.filters.splice(arrayIndex,1);
                }
            });

            if($scope.filterByOriginal.filters.length == 0){
                $scope.filterByOriginal = {
                    logic: "and",
                    filters: []
                };
            }

            var grid = $("#xgrid").data("kendoGrid");
            localStorage["kendo-grid-filter"] = kendo.stringify($scope.filterByOriginal);
            var options = localStorage["kendo-grid-filter"];
            if (localStorage["kendo-grid-filter"]!=JSON.stringify(grid.dataSource.filter()) && options!="null") {
                
                LoadGridFilters(options);
            }
            
        });
    },

    filter:function(e){

        e.preventDefault();
       if(e.filter==null){
           return;
       }
       debugger;
       var BreakException = {};
       var tempFilter=e.filter;
       $scope.filterByOriginal.filters.push(tempFilter);
       localStorage["kendo-grid-filter"] = kendo.stringify($scope.filterByOriginal);
        e.filter.filters.forEach(function(filter,index){
            if(filter.field!=null && filter.field.length>0)
            {
                filter.field=filter.field.charAt(0).toUpperCase() + filter.field.slice(1);
                $scope.filterBy.filters.forEach(function(existingFilter,existingIndex){
                    existingFilter.filters.forEach(function(existingField){
                        try
                        {
                            if(existingField.field==filter.field)
                            {
                                $scope.filterBy.filters.splice(existingIndex,1);
                                throw BreakException;
                            }
                        }
                        catch(e)
                        {
                            if (e !== BreakException) throw e;
                        }
                    });
                });
            }

               if(filter.field == "UserTypeName"){
                 // filter.field = "SubmitterName";
                  filter.operator = "contains"
               }
     
        });
        
       
        $scope.filterBy.filters.push(e.filter);
       
         var grid = $("#xgrid").data("kendoGrid");
        // localStorage["kendo-grid-options"] = kendo.stringify(grid.getOptions());
        // console.log(localStorage["kendo-grid-options"]);
        var options = localStorage["kendo-grid-filter"];
        if (localStorage["kendo-grid-filter"]!=JSON.stringify(grid.dataSource.filter()) && options!="null") {
            
            LoadGridFilters(options);
        }
        //$scope.filters.push(filter);
        //$scope.gridDataSource.fetch();
    },
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
        // {
        //   template: '<a data-toggle="modal" data-target="#addNoticeBoard" class="k-button" href="\\#" onclick="return toolbar_click()">Add New</a>' 
        // },
        {
          name: "create",
          iconClass: "c-icon icon-new",
          text: "Add New",
        },
        {
          name: "edit",
          iconClass: "c-icon icon-new",
          text: "Edit",
        },
        "delete",
        {
          name: "excel",
          iconClass: "c-icon icon-export",
          text: "Export to Excel"
        }
      ],
      excel: {
        allPages: true,
        filterable: true,
        fileName: "Notice board.xlsx"
      },
      // pdf: {
      //   allPages: true,
      //   filterable: true,
      //   fileName: "Notice board.pdf",
      //   paperSize: "A4",
      //   landscape: true,
      //   scale: 0.75
      // },
      excelExport: function (e) {
        var sheet = e.workbook.sheets[0];
        _.set(sheet, 'columns', [
          { width: 300, autoWidth: false },
          { width: 150, autoWidth: false },
          { width: 150, autoWidth: false },
          { width: 150, autoWidth: false },
          { width: 150, autoWidth: false }
        ]);
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
          field: "copName",
          title: "CoP NAME",
          width: "20%",
          filterable: {
            extra: false,
            operators: {
                    string: {
                        contains: "Contains",
                    }
                }
          }
        },
        {
          field: "title",
          title: "Title",
          width: "30%",
          filterable : { extra: false,operators: {
            string: {
                contains: "Contains",
              }
            }
          }
        },
        {
          field: "createdDate",
          title: "Date",
          // template: function(data){
          //   var date = new moment(data.createdDate).format("DD MMM YYYY")
          //   return date.toUpperCase();
          // },
          format: "{0:dd MMM yyyy}",
          filterable : { 
            operators: {
            date: {
              // eq :"Is equal",
              gt : "After",
              lt:"Before",
              }
            }
          }
        },
        // {
        //   field: "isPublished",
        //   title: "Status",
        //   template: function(data){
        //     return data.isPublished == "true" ? "Posted" : "Draft";
        //   },
        //   filterable: {
        //     extra: false,
        //     operators: {
        //       string: {
        //         eq: "Equal"
        //       }
        //     },
        //     ui: cityFilter
        // }
        // },
        {
          field: "author",
          title: "Author",
          filterable : { extra: false,operators: {
            string: {
                contains: "Contains",
              }
            }
          }
        },

        // {
        //   field: "description",
        //   title: "Status",
        //   template: "Draft"
          
        // },
        // {
        //   field: "pointsRequired",
        //   title: "Author",
        //   template: "Saharbuddin Bahar (PROD/ABF)"
        // }
      ]
    };

    $scope.editItem = function (itemId) {
      // $state.go('appAdmin.gameMechanicsAdmin.levelBuild', { id: itemId });
    }

    $scope.checkItem = function (data) {
      if (data.CheckItem) {
        $scope.selectedItem = data;
        $scope.checkedIds[data.id] = data.id;
        $scope.selectItemId = data.id;
        $scope.Field.selectCop = data.copName;
        $scope.Field.copId = data.copId;
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

    $scope.changeCopSelector = function(e){
      var data = $('#copAutoComplete').data('kendoAutoComplete');
      var item = data.dataItem();
      $scope.Field.copId = item.id;
    }

    function LoadGridFilters(filterString) {
      debugger;
      if (filterString != "") {
        var filters = JSON.parse(filterString);
        filters.filters.forEach(function(filter,index){
          filter.filters.forEach(function(existingFilter){
              existingFilter.field=existingFilter.field.charAt(0).toLowerCase() + existingFilter.field.slice(1);
          });
            
        });
        var grid = $("#xgrid").data("kendoGrid");
        parseFilterDateValues(filters,checkIfDate, grid);

        var datasource= $("#xgrid").getKendoGrid().dataSource;
        datasource.filter(filters);
      }
  }

    function parseFilterDateValues(expression, fieldTypeChecker, grid){
      if(expression.filters){
        parseFilterDateValues(expression.filters, fieldTypeChecker, grid);
      } else {
        expression.forEach(function(filter){
          if(fieldTypeChecker(grid, filter.field)){
            filter.value = kendo.parseDate(filter.value);
          }
        })
      }
  }

  function checkIfDate(grid, field){		
      return grid.dataSource.options.schema.model.fields[field]!=null?grid.dataSource.options.schema.model.fields[field].type === 'date':false;		
  }
  
    $scope.handleAddCop = function(){
      var check = $scope.modal.modalTitle === 'Edit Notice';
      if(check){
        AdminSettingCoPApi.updateNoticeBoard({
          "id": $scope.selectItemId,
          "title": $scope.Field.title,
          "description": $scope.Field.description,
          "effectiveFrom": $scope.Field.fromDate,
          "effectiveTo": $scope.Field.toDate,
          "isPublished": true,
          "copId": $scope.Field.copId,
          "attachmentIds": [],
          "externalUrl": $scope.Field.externalUrl,
        }).then(function(res){
          $("#addNoticeBoard").modal("hide");
          $scope.gridDataSource.read();
          $scope.resetForm();
        },function (error) {
          logger.error(error.data.message);
        });
      }
      else{
        // var fromDate = new moment($scope.Field.fromDate,"DD/MM/YYYY").format();
        // var toDate = new moment($scope.Field.toDate,"DD/MM/YYYY").format();
        AdminSettingCoPApi.createNoticeBoard({
          "id": $scope.selectItemId,
          "title": $scope.Field.title,
          "description": $scope.Field.description,
          "effectiveFrom": $scope.Field.fromDate,
          "effectiveTo": $scope.Field.toDate,
          "isPublished": true,
          "copId": $scope.Field.copId,
          "attachmentIds": [],
          "externalUrl": $scope.Field.externalUrl,

        }).then(function(res){
          $("#addNoticeBoard").modal("hide");
          $scope.gridDataSource.read();
          $scope.resetForm();
        },function (error) {
          logger.error(error.data.message);
        });
      }
    }
    
    function cityFilter(element) {
      element.kendoDropDownList({
        dataSource: [
          { Name: "Posted", Id: true },
          { Name: "Draft", Id: false }
        ],
        dataTextField: "Name",
        dataValueField: "Id",
        optionLabel: "--Select Value--"
          //dataSource: ["true","false"],
          //optionLabel: "--Select Value--"
      });
    }
    $scope.resetForm = function() {
      $("#addNoticeBoardfrm").get(0).reset();
      $scope.Field.selectCop = "";
      $scope.Field.title = "";
      $scope.Field.description = "";
      $scope.Field.externalUrl = "";
      $scope.Field.fromDate = "";
      $scope.Field.toDate = "";
      $scope.Field.dateCreated = "";
      $scope.Field.createdBy = "";
    }

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

      $('.k-grid-add').on('click', function (e) {
    
        $scope.selectedItem = {};
        $scope.Field = {};
       // $('#dateCreated').val(new moment().format("DD/MM/YYYY"));
       // $('#copAutoComplete').val($scope.selectedItem.copName);
       $scope.Field.createdBy = $rootScope.userInfo.displayName;
       // $('#CoPCreatedBy').val($rootScope.userInfo.displayName);
        if($scope.modal.modalTitle == 'Edit Notice'){
          $scope.modal.modalTitle = 'Add New Notice';
        }
        $scope.Field.fromDate = kendo.parseDate(currentDate, "DD/MM/YYYY") ;
        $scope.Field.toDate = kendo.parseDate(currentDate, "DD/MM/YYYY") ;
       // $("#toDate").data("kendoDatePicker").min($scope.Field.fromDate);
       // $scope.min = kendo.parseDate(currentDate, "DD/MM/YYYY");
        $scope.Field.dateCreated = kendo.parseDate(currentDate, "DD/MM/YYYY");

          $("#addNoticeBoard").modal("show");
      });

      $('.k-grid-edit').on('click', function (e) {
        if($scope.selectItemId && $('.k-grid-edit' ).hasClass( "k-state-disabled" ) == false){
          $scope.Field.selectCop = $scope.selectedItem.copName;
          $scope.Field.title = $scope.selectedItem.title;
          $scope.Field.description = $scope.selectedItem.description;
          $scope.Field.externalUrl = $scope.selectedItem.externalUrl;
          $scope.Field.fromDate = kendo.parseDate($scope.selectedItem.effectiveFrom, "DD/MM/YYYY") ;
          $scope.min = $scope.Field.fromDate;
          $("#toDate").data("kendoDatePicker").min($scope.Field.fromDate);
          $scope.Field.toDate = kendo.parseDate($scope.selectedItem.effectiveTo, "DD/MM/YYYY") ;
          $scope.Field.dateCreated = kendo.parseDate($scope.selectedItem.createdDate, "DD/MM/YYYY");
          $scope.Field.createdBy = $scope.selectedItem.author;
         

          $scope.modal.modalTitle = 'Edit Notice';
          $("#addNoticeBoard").modal("show");
        }
      });

      // Trigger grid action
      // $(".k-grid-edit").addClass("k-state-disabled");
      $('.k-grid-edit').on('click', function (e) {
        if ($scope.isCheckedMulti) return;
        // $state.go('appAdmin.gameMechanicsAdmin.levelBuild', { id: $scope.selectItemId });
      });

      $('.k-grid-add').on('click', function (e) {
        // $state.go('appAdmin.gameMechanicsAdmin.levelBuild');
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

        AdminSettingCoPApi.deleteNoticeBoard(ids).then(function (data) {
          if (data.result)
            $scope.gridDataSource.read();
        });
      });

      $("#menu-cop-management").addClass('current');
      // $('.selectpicker').selectpicker();
      $(".k-grid-add").attr('disabled','disabled');

    }, 1000);

    $scope.Search = function() {
      $scope.gridDataSource.read();
    }

    var selectedDate;
    var SelectedStartDate;
    $scope.fromChange = function(e){
      
      var datePicker = e.sender;
       selectedDate = datePicker.value();
       SelectedStartDate = formatDate(selectedDate);
       $scope.min = SelectedStartDate;
      $scope.Field.toDate = SelectedStartDate;
      $("#toDate").data("kendoDatePicker").min(SelectedStartDate);
  }
  function formatDate(date) {
    //fix error display calendar when month,weekend, day
    // var addMonth = vm.isfirstLoadCalendar ? 0 : 1;
    var addMonth = 1;
    date = new Date(date);
    var day = ('0' + date.getDate()).slice(-2);
    var month = ('0' + (date.getMonth() + addMonth)).slice(-2);
    var year = date.getFullYear();

    return day + '/' + month + '/' + year;
}
    function _init(){
      // $scope.gridDataSource.read();
      AdminSettingCoPApi.getAllCoP().then(function(res){
          if(res){
            $scope.btnDisable =false;
            $("#copAutoComplete").kendoAutoComplete({
              dataTextField: "name", // The widget is bound to the "name" field
              dataSource: res,
            });
          }
      })
      
    }

    _init();
  }

})();
