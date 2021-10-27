(function () {
  'use strict';

  angular
    .module('app.systemAdmin')
    .controller('AdminSystemCoverImageController', AdminSystemCoverImageController);

  /** @ngInject */
  function AdminSystemCoverImageController($scope, $timeout, CoverImageAPI, $window , Utils, appConfig) {

    var vm = this; 
    $scope.pageSize = 10;
    $scope.Keyword = '';
    $scope.checkedIds = {};
    $scope.isSearch = false;
    $scope.selectItemId = null;
    $scope.isCheckedMulti = false;
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
      $scope.addNewCover = function(){
        $('#addnew').modal('show');
    }

  $scope.isDefaultCoverImage = false;
  vm.typeId;

  var defaultCover = '/assets/images/subCoP.png';
  $scope.Images = [];
  $scope.CoverImage = {
      id: 0,
      name: 'DownloadAttachment',
      result: defaultCover,
      isAttachment: false
  };
  $scope.isDefaultCoverImage = true;

    $scope.gridDataSource = new kendo.data.DataSource({
      transport: {
        read: function (options) {
          $scope.checkedIds = {};
          $("#header-chb").prop('checked', false);
                    if ($scope.isSearch) {
                        options.data.skip = 0;
                        $scope.isSearch = false;
                    }
          return CoverImageAPI.getAll(options, $scope.Keyword ,  $scope.filterBy.filters.length>0?$scope.filterBy:null, $scope.gridDataSource.total() );
        },
        update: function (e) {
          e.success();
        },
        destroy: function (e) {
          CoverImageAPI.deleteMultiAds({ id: e.data.id }).then(function (data) {
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
      filterMenuInit: function(e) {
        debugger;
        if (e.field === "kdType") {
          var filterMultiCheck = this.thead.find("[data-field=" + e.field + "]").data("kendoFilterMultiCheck")
          filterMultiCheck.container.empty();
          filterMultiCheck.checkSource.sort({field: e.field, dir: "asc"});

          // uncomment the following line to handle any grouping from the original dataSource:
      // filterMultiCheck.checkSource.group(null);

          filterMultiCheck.checkSource.data(filterMultiCheck.checkSource.view().toJSON());
          filterMultiCheck.createCheckBoxes();

          
        }


      },

      schema: {
        data: function (e) {
          return e.data;
        },
        total: "total",
        model: {
          id: "id",
          fields: {
            kdtypeId: {
              type: "number"
            },
            kdType: {
              type: "string"
            },
            attachment: {
              type: "string"
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
      filterable: {
        extra: false,
      
    },
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
      {
        name: "create",
        iconClass: "c-icon icon-new",
        text: "Add New"
      },
   //   { template: '<kendo-button ng-click="addNewCover()" class="k-grid-validate">Edit</kendo-button>' },
      //  "edit",
        "delete",
      ],
      excel: {
        allPages: true,
        filterable: true,
        fileName: "CoverImage.xlsx"
      },
      editable: {
        mode: "popup",
        template: kendo.template($("#editorTemplate").html())

    },
    edit: function (e) {
      if (e.model.isNew()) {
          e.container.kendoWindow("title", "Add New");
          $("a.k-grid-update")[0].innerHTML = "<span class='k-icon k-i-check'></span> Save";
      }
      else {
          e.container.kendoWindow("title", "Edit");
      }
  },
  save: function (e) {
    e.preventDefault();

    var validator = $("#create-update-form").kendoValidator({
        rules: {
            required: function (input) {
                if (input.is("[data-required-msg]")) {
                    return !_.isEmpty(input.val());
                }
                return true;
            },
            username: function (input) {
                if (input.is("[data-username-msg]") && e.model.isNew()) {
                    return !_.isEmpty($scope.userName) && (vm.UserName === $scope.userName.displayName);
                }
                return true;
            }
        },
        messages: {
            required: 'Mandatory field.',
            username: 'Invalid User Name.'
        }
    }).data("kendoValidator");

   
    if (validator.validate()) {
      var postData = {
        fileName: $scope.uploadFile.name,
        extension: $scope.uploadFile.extension,
        mime: $scope.uploadFile.type,
        attachment: $scope.CoverImage.result,
        fileLength: $scope.uploadFile.size,
        kdtypeId: vm.typeId
      }

      var updateData = {
        id: e.model.id,
        fileName: $scope.uploadFile.name,
        extension: $scope.uploadFile.extension,
        mime: $scope.uploadFile.type,
        attachment: $scope.CoverImage.result,
        fileLength: $scope.uploadFile.size,
        kdtypeId: vm.typeId
      };


      if (e.model.isNew()) {
        CoverImageAPI.addNew(postData).then(function (data) {
          if (data.result) {
            $scope.gridDataSource.read();
          }
        });
  
      } else {

        CoverImageAPI.update(updateData).then(function (data) {
          if (data.result) {
            $scope.gridDataSource.read();
          }
      });
      }



    
    }
},
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
          field: "attachment",
          title: "Cover Image",
          filterable: false,
          template: "<img style='width: 250px' data-ng-src='data:image/PNG;base64,#=attachment#' />"
        },
        {
          field: "kdType",
          title: "Knowledge Type",
          filterable: { 
            multi: true,
                        search:true,
                        dataSource: [{
                          kdType: "Lesson Learnt",
                        },
                        {
                          kdType: "Best Practice",
                        },
                        {
                          kdType: "All Knowledge - Publications",
                        },
                        {
                          kdType: "Technical Alert",
                        },
                        {
                          kdType: "Insights",
                        },
                        {
                          kdType: "Ideas",
                        }
                        ],
                        checkAll: false

                    

        }
        }
      ]
    };

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
    $scope.knowledgeDocumentTypes = [];
    $scope.knowledgeDocumentType = function(){
      var kdType;
      for (kdType in appConfig.KnowledgeDocumentTypes) {
          if (appConfig.KnowledgeDocumentTypes.hasOwnProperty(kdType)) {
              var value = appConfig.KnowledgeDocumentTypes[kdType];

              if(value == "Best Practices"){
                $scope.knowledgeDocumentTypes.push({ "name": value, "id":1, "selected": true });
              }
              else if(value == "Lessons Learnt"){
                $scope.knowledgeDocumentTypes.push({ "name": value, "id":2, "selected": false });
              }
              else if(value == "Publications"){
                $scope.knowledgeDocumentTypes.push({ "name": value, "id":14, "selected": false });
              }
              else if(value == "Insights"){
                $scope.knowledgeDocumentTypes.push({ "name": value, "id":12, "selected": false });
              }
              else if(value == "Ideas"){
                $scope.knowledgeDocumentTypes.push({ "name": value, "id":11, "selected": false });
              }
              else if(value == "Technical Alerts"){
                $scope.knowledgeDocumentTypes.push({ "name": value, "id":16, "selected": false });
              }
          }
      }
  }

  $scope.Search = function () {
    $scope.isSearch = true;
    $scope.gridDataSource.query({
        page: 1,
        pageSize: $scope.pageSize
    });
}


  $scope.knowledgeDocumentType();

    $scope.editItem = function (itemId) {
      // $state.go('appAdmin.gameMechanicsAdmin.levelBuild', { id: itemId });
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

    $scope.uploadFile= {
      "lastModified": "",
      "lastModifiedDate":"",
      "name":"",
      "extension": "",
      "size":"",
      "type": "",
      
    }

    $scope.openFile = function(event) {
  

      var input = event.target;
      var reader = new FileReader();
      var filename = input.files[0].name.split('.');
      $scope.uploadFile.name = filename[0];
      $scope.uploadFile.extension = "."+filename[1];
      $scope.uploadFile.size = input.files[0].size ;
      $scope.uploadFile.type = input.files[0].type ;

         var obj = Utils.validateFile($scope.uploadFile, appConfig.allowImageExtension);
   
        if (obj.extension && obj.size) {
          reader.onload = function(){
            var result = reader.result;
            var indexOfFirstPart = result.indexOf(',') + 1;
            $scope.processedResult = result.substr(indexOfFirstPart, result.length);
            $scope.isDefaultCoverImage = false;
            $scope.CoverImage = {
                result: $scope.processedResult,
                name: $scope.uploadFile.name,
                size: $scope.uploadFile.size,
                isAttachment: false
            };
            $scope. $apply();
          };
          reader.readAsDataURL(input.files[0]);
          
          $scope.validExtension = true;
          $scope.$emit('uploadCoverImage', $scope.processedResult)
         
        }
        else{
          $scope.validExtension = false;
        }
      };

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

      // Trigger grid action
      $(".k-grid-edit").addClass("k-state-disabled");
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

        CoverImageAPI.deleteMultiAds(ids).then(function (data) {
          if (data.result)
            $scope.gridDataSource.read();
        });
      });

      $("#menu-system-admin").addClass('current');
      // $('.selectpicker').selectpicker();

    }, 1000);

  }

})();
