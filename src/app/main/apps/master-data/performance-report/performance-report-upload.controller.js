(function () {
    'use strict';
  
    angular
      .module('app.performanceReport')
      .controller('PerformanceReortUploadController', PerformanceReortUploadController);
  
    /** @ngInject */
    function PerformanceReortUploadController($scope, performanceReportAPI,Utils,appConfig, $stateParams,$rootScope,$filter,$timeout, $state) {
      var vm = this;

     $scope.template = {
       typeID: "",
       year: "",
       quarters:[
         {
          name: "Q1",
          startDate: "",
          endDate: "",
          cutoffDate : ""
         },
         {
          name: "Q2",
          startDate: "",
          endDate: "",
          cutoffDate : ""
         },
         {
          name: "Q3",
          startDate: "",
          endDate: "",
          cutoffDate : ""
         },
         {
          name: "Q4",
          startDate: "",
          endDate: "",
          cutoffDate : ""
         }

       ],
      
     };
     $scope.onViewDisabled = false;
     $scope.file;
     $scope.filename = "";
     $scope.isFileAdded;
     $scope.k_options = {
      multiple: false,
      localization: {
          dropFilesHere: "<div style='width:100%; display:block'><i class='icon-drop'></i><br/>Drag and drop files here to upload </div>",
          select: 'or select file to upload...'
      },
      validation: { allowedExtensions: ['.xlsm'], maxFileSize: 10485760 },
      async: { saveUrl: 'save', removeUrl: 'remove', autoUpload: true },
      showFileList: false
    };

 

    function _Upload(e) {
     // debugger;
          var obj = Utils.validateFile(e.files[0], appConfig.performanceReportTemplateFileExtension);
          if (obj.extension && obj.size) {
              var file = e.files[0].rawFile;
              if (file) {
                //debugger;
                  $scope.file = file;
                  $scope.filename = file.name;
                  $scope.isFileAdded = true;
                  $scope.$apply();
                  //debugger;
              }
          }
          else {
              logger.error('Invalid file.')
          }
        }

      function _Prevent(e) {
          e.preventDefault();
          $scope.filename = e.files[0].name;
          $scope.isFileAdded = true;
      };

      function _onSuccess(e){
        $scope.filename = e.files[0].name;
        $scope.isFileAdded = true;
      }

      function _onComplete(e){
        $scope.filename = e.files[0].name;
        $scope.isFileAdded = true;
      }

     $scope.yearChange = function(event){
      
      var yearDate = new Date($scope.template.year);
      var year = yearDate.getFullYear();
       //Quarter One
       var quarterOneStartDate = new Date( year, 0, 1) ;
       var quarterOneEndDate = new Date( year, 2, 31) ;
       var quarterOneCutOffDate = new Date( year, 3, 7) ;

       $scope.template.quarters[0].startDate = quarterOneStartDate; //kendo.parseDate(quarterOneStartDate, 'dd/mm/yyyy');
       $scope.template.quarters[0].endDate = quarterOneEndDate;// kendo.parseDate(quarterOneEndDate, 'dd/mm/yyyy');
       $scope.template.quarters[0].cutoffDate = quarterOneCutOffDate; //kendo.parseDate(quarterOneCutOffDate, 'dd/mm/yyyy');

        //Quarter Two
        var quarterTwoStartDate = new Date( year, 3, 1) ;
        var quarterTwoEndDate = new Date( year, 5, 30) ;
        var quarterTwoCutOffDate = new Date( year, 6, 7) ;
 
        $scope.template.quarters[1].startDate = quarterTwoStartDate;//kendo.parseDate(quarterTwoStartDate, 'dd/mm/yyyy');
        $scope.template.quarters[1].endDate =quarterTwoEndDate;// kendo.parseDate(quarterTwoEndDate, 'dd/mm/yyyy');
        $scope.template.quarters[1].cutoffDate = quarterTwoCutOffDate;//kendo.parseDate(quarterTwoCutOffDate, 'dd/mm/yyyy');

        //Quarter Three
        var quarterThreeStartDate = new Date( year, 6, 1) ;
        var quarterThreeEndDate = new Date( year, 8, 30) ;
        var quarterThreeCutOffDate = new Date( year, 9, 7) ;
 
        $scope.template.quarters[2].startDate = quarterThreeStartDate;//kendo.parseDate(quarterThreeStartDate, 'dd/mm/yyyy');
        $scope.template.quarters[2].endDate = quarterThreeEndDate;//kendo.parseDate(quarterThreeEndDate, 'dd/mm/yyyy');
        $scope.template.quarters[2].cutoffDate = quarterThreeCutOffDate;//kendo.parseDate(quarterThreeCutOffDate, 'dd/mm/yyyy');

        //Quarter Four
        var quarterFourStartDate = new Date( year, 9, 1) ;
        var quarterFourEndDate = new Date( year, 11, 31) ;
        var quarterFourCutOffDate = new Date( year + 1, 0, 7) ;
 
        $scope.template.quarters[3].startDate = quarterFourStartDate;//kendo.parseDate(quarterFourStartDate, 'dd/mm/yyyy');
        $scope.template.quarters[3].endDate = quarterFourEndDate;//kendo.parseDate(quarterFourEndDate, 'dd/mm/yyyy');
        $scope.template.quarters[3].cutoffDate =quarterFourCutOffDate;// kendo.parseDate(quarterFourCutOffDate, 'dd/mm/yyyy');


     } 
     
    
      $scope.templateTypes = [];

      function getAllReportTemplateType(){
        performanceReportAPI.getAllReportTemplateType().then(function (res) {
          //debugger;
          if(res.performanceReportTypes != null){
            $scope.templateTypes = res.performanceReportTypes; 
            // res.performanceReportTypes.forEach(function (templateType){
            //  // console.log("templateType"+templateType);
            //   $scope.templateTypes.push(templateType); 
              
            // });
            if($scope.templateTypes.length == 1){
              $scope.template.typeID = $scope.templateTypes[0].id;
            }
            // $scope.$apply();
          }
        });
      } 
      $scope.saveTemplate = function(){

        

        
        var year = $scope.template.year.getFullYear();

       for(var i = 0; i < $scope.template.quarters.length; i++){
        $scope.template.quarters[i].startDate =  $filter('date')($scope.template.quarters[i].startDate ,'dd-MMM-yyyy');
        $scope.template.quarters[i].endDate =  $filter('date')($scope.template.quarters[i].endDate ,'dd-MMM-yyyy');
        $scope.template.quarters[i].cutoffDate =  $filter('date')($scope.template.quarters[i].cutoffDate ,'dd-MMM-yyyy');
       }
        //$scope.template.year = year; 
        //debugger;
        var templateData ={};
        angular.copy($scope.template, templateData);
        templateData.year = year;

        var fd = new FormData();
        fd.append("attachment", $scope.file);
        fd.append("data", JSON.stringify( templateData));

        if($scope.filename == ""){
          $scope.isFileAdded = false;
        }
        if($scope.q1EndDateIsValid == true && $scope.q2EndDateIsValid == true && $scope.q3EndDateIsValid == true && $scope.q4EndDateIsValid == true && $scope.isFileAdded == true){
          performanceReportAPI.saveTemplate(0, fd).then(function (data) {
            logger.success("Save successfully!");
            $timeout(function () {
              $state.go('appAdmin.performanceReport');
            }, 2000);
        
         },function (error) {
           logger.error(error.data.message);
         });
        }else{
          if($scope.q1EndDateIsValid == false){
            $("#txtQ1EndDate").focus();
          } else if($scope.q2EndDateIsValid == false ){
            $("#txtQ2EndDate").focus();

          }else if($scope.q3EndDateIsValid == false){
            $("#txtQ3EndDate").focus();
          }
          else if($scope.q4EndDateIsValid == false){
            $("#txtQ4EndDate").focus();
          }

        }
      }

      function _onInit() {

        if ($stateParams.id) {
          $rootScope.title = 'View Performance Report Template';
          $scope.onViewDisabled = true;
          performanceReportAPI.getById($stateParams.id).then(function (res) {
           // debugger;
            $scope.template.typeID = res.typeId;
            //debugger;
            $scope.template.year = kendo.toString(res.year, 'yyyy') ;
            $scope.yearChange();
            $scope.filename = res.templateName;
            if(res.quarters != null){
              res.quarters.forEach(function (quarter) {
                $scope.template.quarters.push(quarter);
              });
            }  
          },function (error) {
            console.log(error);
          });
        }
        else {
          var currentDate = new Date();
         // debugger;
          $scope.template.year =  kendo.parseDate(currentDate, "yyyy");
          $scope.onViewDisabled = false;
          $scope.yearChange();
        }
      }
      $scope.q1EndDateIsValid = true;
      $scope.q2EndDateIsValid = true;
      $scope.q3EndDateIsValid = true;
      $scope.q4EndDateIsValid = true;

      $scope.endDateChange = function(element){
        if(element == "Q1"){
          if($scope.template.quarters[0].endDate < $scope.template.quarters[0].startDate){
            $scope.q1EndDateIsValid = false;
          }
        }
        else if(element == "Q2"){
          if($scope.template.quarters[1].endDate < $scope.template.quarters[1].startDate){
            $scope.q2EndDateIsValid = false;
          }
        }
        else if(element == "Q3"){
          if($scope.template.quarters[2].endDate < $scope.template.quarters[2].startDate){
            $scope.q3EndDateIsValid = false;
          }

        }
        else if(element == "Q4"){
          if($scope.template.quarters[3].endDate < $scope.template.quarters[3].startDate){
            $scope.q4EndDateIsValid = false;
          }
        }
      }
      
      $scope.downloadTemplate = function(){
        
        if ($stateParams.id) {
          performanceReportAPI.downloadTemplate($stateParams.id).then(function (res) {
            
          },function (error) {
            console.log(error.message);
          });
        }
      }
      _onInit();
      getAllReportTemplateType();
      $scope.Upload = _Upload;
      $scope.Prevent = _Prevent;
      $scope.onSuccess = _onSuccess;
      $scope.onComplete = _onComplete;

    }
  
  })();
  
