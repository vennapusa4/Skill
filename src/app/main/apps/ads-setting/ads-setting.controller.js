(function () {
    'use strict';

    angular
        .module('app.user')
        .controller('AdsSettingController', AdsSettingController);

    /** @ngInject */
    function AdsSettingController($scope, $timeout, AdsSettingAPI, $window , Utils, appConfig) {
        var vm = this;
        vm.UserName = [];
        $scope.pageSize = 10;
        $scope.selectedUserType = {};
       // $scope.coverImage;
        var currentDate = new Date();
        $scope.checkedIds = {};
        $scope.checkedIds = {};
        $scope.selectItemId = null;
        $scope.selectedItem = {};
        $scope.isNew = false;
        $scope.active;
        console.log(currentDate);
        $scope.fromDate = kendo.parseDate(currentDate, "yyyy-MM-DD");
        $scope.toDate = kendo.parseDate(currentDate, "yyyy-MM-DD");
        $scope.min = kendo.parseDate(currentDate);

        $scope.isDefaultCoverImage = false;

        var defaultCover = appConfig.defaultCoverImageForAdmin;
        $scope.Images = [];
       

        $scope.activeAds = [];
        $scope.showActiveAd = function(){
          AdsSettingAPI.getAllActiveAds().then(function (res) {
            if(res != null){
              $scope.activeAds = [];

              res.data.forEach(function (ads, index){
                if(index < 1){
                  $scope.activeAds.push(ads); 
                }
               
              });
            }
          }); 
        }
    
        $scope.showActiveAd();
        $scope.addNewAdverd = function(){
            $('#addnew').modal('show');
        }
        $scope.gridDataSource = new kendo.data.DataSource({
            transport: {
                read: function (options) {
                    return AdsSettingAPI.getAll(options, $scope.Keyword, $scope.gridDataSource.total());
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
                        id: { type: "number" },
                        title: { type: "string" },
                        description: { type: "string" },
                        fromDate: { type: "string" },
                        toDate: { type: "string" },
                        coverImage : {type:"string"},
                        active : {type: "string"},
                        isActive : {type: "boolean"}
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
        var exportFlag = false;
        //Grid definition
        $scope.mainGridOptions = {
            pageable: {
                pageSize: $scope.pageSize
            },
            scrollable: false,
            sortable: false,
            filter: true,
            //define dataBound event handler
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
              //  { template: '<kendo-button ng-click="addNewAdverd()" class="k-grid-validate">Add New</kendo-button>' },
              {
                name: "create",
                iconClass: "c-icon icon-new",
                text: "Add New"
            },
              "edit",
              "delete",
              
                // {
                //     name: "excel",
                //     iconClass: "c-icon icon-export",
                //     text: "Export to excel"
                // },
            ],
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
                    field: "coverImage",
                    title: "Image",
                    template: "<img style='width: 100%' data-ng-src='data:image/PNG;base64,#=coverImage#' />"

                },
                {
                    field: "title",
                    title: "Title",
                },
                {
                    field: "description",
                    title: "Description",
                    width: "30%",
                },
                {
                    field: "duration",
                    title: "Duration",
                    format: "{0:dd-MMM-yyyy}",
                    template: function (dataItem) {
                        return '<span style="font-weight: 600">From</span> . '+formatDate(dataItem.fromDate)+'<br/><span style="font-weight: 600">To</span> . '+ formatDate(dataItem.toDate)
                      },
                },
                {
                    field: "active",
                    title: "Status",
                    width: "80px",
                },
                {
                  field: "isActive",
                  title: "isActive",
                  hidden: true
               }
            ], excel: {
                allPages: true,
                filterable: true,
                fileName: "Ads.xlsx",
                
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
            // editable: {
            //     mode: "popup",
            //     template: kendo.template($("#editorTemplate").html())
            // },
            edit: function (e) {
                // if (e.model.isNew()) {
                //   //$scope.isDefaultCoverImage = true;
                  
                //     $("a.k-grid-update")[0].innerHTML = "<span class='k-icon k-i-check'></span> Save";
                // }
                // else {
                //   $scope.isDefaultCoverImage = true;
                //   $scope.CoverImage = {
                //       result: e.model.coverImage,
                //       name: $scope.uploadFile.name,
                //       size: $scope.uploadFile.size,
                //       isAttachment: false
                //   };
                //     e.container.kendoWindow("title", "Edit");
                // }
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

                 
          

                
                }
            }
        };

        $scope.modal = {};
        $scope.modal.modalTitle = '';
        $scope.ad = {};

     


        $scope.uploadFile= {
          "lastModified": "",
          "lastModifiedDate":"",
          "name":"",
          "extension": "",
          "size":""
          
        }

        $scope.openFile = function(event) {
      
    
          var input = event.target;
          var reader = new FileReader();
          var filename = input.files[0].name.split('.');
          $scope.uploadFile.name = filename[0];
          $scope.uploadFile.extension = "."+filename[1];
          $scope.uploadFile.size = input.files[0].size ;
  
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


        function exportExcel() {
            AdsSettingAPI.exportAllUsers();
        }
        function formatDate(date) {
            //fix error display calendar when month,weekend, day
            // var addMonth = vm.isfirstLoadCalendar ? 0 : 1;
            var addMonth = 1;
            date = new Date(date);
            var day = ('0' + date.getDate()).slice(-2);
            var month = ('0' + (date.getMonth() + addMonth)).slice(-2);
            var year = date.getFullYear();

            return year + '-' + month + '-' + day;
        }
        

        //Searching the Grid by the value of the textbox
        $scope.gridSearchFunc = function () {
            var searchValue = $('.grid_search').val();

            //Setting the filter of the Grid
            $(this).parents('.setting_heading').siblings('.grid').data("kendoGrid").dataSource.filter({
                logic: "or",
                filters: [
                    {
                        field: "Title",
                        operator: "contains",
                        value: searchValue
                    },
                    {
                        field: "Title",
                        operator: "contains",
                        value: searchValue
                    },
                    {
                        field: "Title",
                        operator: "contains",
                        value: searchValue
                    },
                    {
                        field: "Title",
                        operator: "contains",
                        value: searchValue
                    }
                ]
            });
        };
       
        $scope.checkItem = function (data) {
          if (data.CheckItem) {
            $scope.selectedItem = data;
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
            //$(".k-grid-delete").removeClass("k-state-disabled");
            $(".k-grid-edit").removeClass("k-state-disabled");
          } else {
            // $(".k-grid-delete").addClass("k-state-disabled");
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
      // $(".k-grid-delete").addClass("k-state-disabled");
      $(".k-grid-edit").addClass("k-state-disabled");


      $('.k-grid-add').on('click', function (e) {
        $scope.isNew = true;

        $scope.CoverImage = {
          id: 0,
          name: 'DownloadAttachment',
          result: "",
          isAttachment: false
       };
    
          $scope.ad.title = "";
          $scope.ad.description = "";
          $scope.ad.isActive = false;
          $scope.ad.fromDate = kendo.parseDate(currentDate, "yyyy-MM-DD");
          $scope.ad.toDate = kendo.parseDate(currentDate, "yyyy-MM-DD");
          $scope.modal.modalTitle = 'Add New Advertisement';
          $scope.modal.btn = 'Save'
      
          $("#addnew").modal("show");
      });

      $('.k-grid-edit').on('click', function (e) {
        $scope.isNew = false;
        if($scope.selectItemId && $('.k-grid-edit' ).hasClass( "k-state-disabled" ) == false){
         
          $scope.ad.title = $scope.selectedItem.title;
          $scope.ad.description = $scope.selectedItem.description;
          $scope.ad.isActive = $scope.selectedItem.isActive;
          $scope.ad.fromDate = $scope.selectedItem.fromDate;
          $scope.ad.toDate = $scope.selectedItem.toDate;

          $scope.CoverImage = {
            id: 0,
            name: 'DownloadAttachment',
            result: $scope.selectedItem.coverImage,
            isAttachment: false
         };

         
          $scope.modal.modalTitle = 'Edit Advertisement';
          $scope.modal.btn = '<button ng-click="updateAdvertisement()" class="admin-default">Update</button>'
          $("#addnew").modal("show");
        }
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
      
      
              AdsSettingAPI.deleteMultiAds(ids).then(function (data) {
                if (data.result)
                  $scope.gridDataSource.read();
              });
            });
          }, 1000);
          

          var selectedDate;
          var SelectedStartDate;
          $scope.fromChange = function(e){
            
            var datePicker = e.sender;
             selectedDate = datePicker.value();
             SelectedStartDate = formatDate(selectedDate);
             $scope.min = SelectedStartDate;
            $scope.ad.toDate = SelectedStartDate;
            $("#toDate").data("kendoDatePicker").min(SelectedStartDate);
        }


          $scope.saveAdvertisement = function(){

            if($scope.isNew){
              var postData = {
                title : $scope.ad.title,
                description : $scope.ad.description,
                fromDate : formatDate($scope.ad.fromDate),
                toDate : formatDate($scope.ad.toDate),
                image : $scope.CoverImage.result,
                active : $scope.ad.isActive,
              }
  
                AdsSettingAPI.addNew(postData).then(function (data) {
                  if (data.result) {
                    $("#addnew").modal("hide");
                    $scope.gridDataSource.read();
                    $scope.showActiveAd();
                  }
                });
            }
            else{
              var updateData = {
                id: $scope.selectItemId,
                title : $scope.ad.title,
                description : $scope.ad.description,
                fromDate : formatDate($scope.ad.fromDate),
                toDate : formatDate($scope.ad.toDate),
                image : $scope.CoverImage.result,
                active : $scope.ad.isActive,
              };
  
              AdsSettingAPI.update(updateData).then(function (data) {
                if (data.result) {
                  $("#addnew").modal("hide");
                  $scope.gridDataSource.read();
                  $scope.showActiveAd();
                }
            });
            }            

          }

    }
})();
