(function () {
    'use strict';

    angular
        .module('app.bulkUpload')
        .controller('BulkUploadReviewController', BulkUploadReviewController);

    /** @ngInject */
    function BulkUploadReviewController($scope, $state, $stateParams, $timeout, BulkUploadApi,
        KnowledgeDiscoveryApi, BulkUploadService, Utils, logger, $filter, $rootScope, UserProfileApi) {

        $scope.kdRefId = $stateParams.shareId;
        $scope.kdRefTitle = $stateParams.shareTitle;
        console.log("+++++++++++++++++++++++++++++++++++++++++++++");
        console.log($stateParams.shareId);
        console.log($stateParams.shareTitle);
        console.log("+++++++++++++++++++++++++++++++++++++++++++++");
        $scope.testAuthorID = [];
        $scope.arrayIndexSelected = '';
        $scope.RecordSelects = [];
        $scope.Records = [];
        $scope.Field = {
            batchNumber: { id: $stateParams.batchNumber },
            IsSkip: $rootScope.userInfo.userAppConfiguration.skipShareDocumentDialog
        };
        $scope.BatchNumbers = [];
        $scope.isvalid = true;
        $scope.isSubmiting = false;
        $scope.isProssing = false;
        var filterItem = {};
        var filterIndex = 0;
        $scope.iamAuthor = false;
        $scope.Field.ptgpts = false;
        $scope.beenReplicated = false;
        $scope.referenceKdIds = [];
        $scope.ptgpts = false;
        $scope.ptgptsValue;
        $scope.submittedasValidated = false;
        $scope.validatedRemarks;
        $scope.knowledge = [];

        $scope.screen = {
            name: "BulkUpload"
        }
       
        function _onInit() {
            BulkUploadApi.api.GetBatchNumbers.query().$promise.then(function (res) {
                if (!_.isEmpty(res)) {
                    $scope.BatchNumbers = _.map(res, function (o) {
                        return { id: o.title, title: o.title };
                    });
                    if (!_.isNull($scope.Field.batchNumber)) $scope.GetBatchData($scope.Field.batchNumber);
                }
            }, function (err) {
                logger.error(err.data.message);
            });
        }

        $scope.$on("changePage", function (data, redirect) {
            $scope.redirecting = redirect;
            $timeout(function () {
              $('#redirectPosting').modal('show');
            }, 500);
          });
      
          $scope.confirmRedirect = function () {
            $('#redirectPosting').modal('hide');
            $timeout(function () {
              $state.go($scope.redirecting);
            }, 500);
          }
        $scope.getSelectedIndex = function(index){
            $scope.RecordSelects = $scope.getRecordsSelect();
            $scope.checkAll = $scope.Records.length == $scope.RecordSelects.length;

                
                    if($scope.RecordSelects.length > 1){
                        for(var i=0; i< $scope.Records.length; i++){
                            $scope.Records[i].singleselected = false;
                        }
                    } else{
                        for(var i=0; i< $scope.Records.length; i++){
                            if($scope.Records[i].selected){
                                $scope.Records[i].singleselected = true;
                            }
                            else{
                                $scope.Records[i].singleselected = false;
                            }
                            
                        }
                    }
                   // $scope.Records[i].selected = false;
                
            // else{
            //     if($scope.Records[index].selected){
            //         $scope.Records[index].singleselected = true;
            //     }else{
            //         $scope.Records[index].singleselected = false;
            //     }
            // }
          
     
            
        }
 
        $scope.SelectSubmit = function() {
            $scope.RecordSelects = $scope.getRecordsSelect();
            $scope.checkAll = $scope.Records.length == $scope.RecordSelects.length;
            debugger;
            if($scope.RecordSelects.length > 1)
            {
                $scope.multiselected=true;
            }
            else{
                $scope.multiselected=false;
            }
        };

        $scope.SelectAll = function(checkAll) {
            _.forEach($scope.Records, function (o) { o.selected = checkAll });
            $scope.SelectSubmit();
        };


        function _Validate() {
            _.forEach($scope.Records, function (o, idx) {
                if (o.selected) {
                    var record = BulkUploadService.getAssign(idx + '');
                    if (!_.isEmpty(record)) {
                        o.isvalid = true;
                        o.isvalidCreation = true;
                        o.isvalidAuthor = true;
                        if ((_.isEmpty(record.expert) && o.type !== 'Publications') ||
                            (_.isEmpty(record.discipline) && o.type === 'Publications') ||
                            _.filter(record.discipline, function (o1) { return o1.isPrimary && o1.subs.length === 0 }).length > 0) {
                            o.isvalid = false;
                        }

                        if (record.valueCreateds && record.valueCreateds.length > 0) {
                            if ((_.isEmpty(record.valueCreationId)) ||
                                (o.type !== 'Publications' && (_.isEmpty(record.endorser) || _.isEmpty(record.endorser.id)))) {
                                o.isvalidCreation = false;
                            }
                        }

                        if (record.authors) {
                            if (record.authors == null || record.authors.length <= 0) {
                                o.isvalidAuthor = false;
                            }
                        }
                    } else {
                        o.isvalid = true;
                        o.isvalidCreation = true;
                        o.isvalidAuthor = true;
                    }
                } else {
                    o.isvalid = true;
                    o.isvalidCreation = true;
                    o.isvalidAuthor = true;
                }
            });
        };

        function _GetPost() {
            var post = [];
            _.forEach($scope.Records, function (o, idx) {
                if (o.selected) {
                    // var record = o;
                    var record = BulkUploadService.getAssign(idx + ''); // Old code
                    if (record) {
                        var tmp = {
                            documentId: o.documentId,
                            smeUserId: (o.type === 'Publications') || !record.expert ? null : record.expert.ExpertID,
                            endorserUserId: (o.type === 'Publications') || !record.endorser ? null : record.endorser.id,
                            attachmentIds: o.dataAttachments ? _.map(o.dataAttachments, function (item) { return item.id }) : [],
                            valueCreationId: record.valueCreationId,
                        };
                        var discipline = [];
                        _.forEach(record.discipline, function (o1) {
                            if (_.isEmpty(o1.subs)) {
                                discipline.push({
                                    disciplineId: o1.Id,
                                    subdisciplineId: null,
                                    isPrimary: o1.isPrimary
                                });
                            } else {
                                _.forEach(o1.subs, function (o2) {
                                    discipline.push({
                                        disciplineId: o1.Id,
                                        subdisciplineId: o2.Id,
                                        isPrimary: o1.isPrimary
                                    });
                                });
                            }
                        });
                        tmp['disciplines'] = discipline;

                        var valueCreateds = [];
                        _.forEach(record.valueCreateds, function (item) {
                            var knowledgeReferenced = _.filter(record.knowledgeReferenced, ['Text', item.KdReference]);
                            valueCreateds.push({
                                valueTypeId: item.ValueTypeId.Id,
                                estimatedValue: _.isNaN(parseInt(item.EstimatedValue)) ? undefined : parseInt(item.EstimatedValue),
                                remarks: item.Remarks,
                                kdReferenceId: (knowledgeReferenced.length > 0) ? parseInt(knowledgeReferenced[0].Id) : item.KdReferenceId
                            });
                        });
                        tmp['valueCreateds'] = valueCreateds;

                        var authors = [];
                        _.forEach(record.authors, function (item) {
                            if (item.name) {
                                authors.push(item.name);
                            }
                        });
                        tmp['authors'] = authors;
                        post.push(tmp);
                    }
                }
            });
            return post;
        };

        $scope.GetBatchData = function(batchNumber) {
            $scope.checkAll = false;
            $scope.RecordSelects = [];
            BulkUploadService.clearAssign();
            BulkUploadApi.api.GetBatch.query({
                batchNumber: batchNumber.id
            }).$promise.then(function (res1) {
                $scope.Records = _.isEmpty(res1) ? [] : _.map(res1, function (o) {
                     o['selected'] = false;
                     o['singleselected'] = false;
                    o['coverImage'] = Utils.getImage('cover', o.coverImage);
                    o['isEdit'] = false;
                    o['isEdited'] = false;
                    o['isValid'] = false;
                    o['authors'] = [];
                    o['attachmentIds'] = [];
                    o['pTGPTS'] = false;
                    o['ptgptsValue'] = null;
                    
                    
                    
                    return o;
                });
            }, function (err) {
                logger.error(err.data.message);
            });
        };

        function _Proceed() {
           $scope.selectedRecordsToProceed = [];
           var discipline=[];
           var valueCreateds = [];
           for (var i = 0; i < $scope.Records.length; i++) {
            if ($scope.Records[i].selected && $scope.Records[i].isValid == true) {
                _.forEach($scope.Records[i].disciplines, function (o1) {
                    if (_.isEmpty(o1.subs)) {
                        discipline.push({
                            disciplineId: o1.Id,
                            subdisciplineId: null,
                            isPrimary: o1.isPrimary
                        });
                    } else {
                        _.forEach(o1.subs, function (o2) {
                            discipline.push({
                                disciplineId: o1.Id,
                                subdisciplineId: o2.Id,
                                isPrimary: o1.isPrimary
                            });
                        });
                    }
                });
                $scope.Records[i].disciplines=discipline;

                _.forEach($scope.Records[i].valueCreateds, function (item) {
                              
                    valueCreateds.push({
                        valueTypeId: item.ValueTypeId.Id,
                        estimatedValue: _.isNaN(parseInt(item.EstimatedValue)) ? undefined : parseInt(item.EstimatedValue),
                        remarks: item.Remarks,
                        kdReferenceId: (item.KdReference == "") ? parseInt(knowledgeReferenced[0].Id) : item.KdReferenceId,
                        KnowledgeDocumentId : $scope.Records[i].documentId,
                        valueCreationTypeId : item.valueCreationTypeId
                    });
                            });
                            $scope.Records[i].valueCreateds=valueCreateds;
                $scope.selectedRecordsToProceed.push($scope.Records[i]);

                
            }
          }

          if($scope.selectedRecordsToProceed.length > 0){
               //   $scope.selectedRecordsToProceed.forEach( function(knowledge){
            BulkUploadApi.api.Proceed.save(angular.toJson($scope.selectedRecordsToProceed)).$promise.then(function (res) {
                // $scope.isProssing = false;
                 $('#ModalSubmitted').modal('show');
             }, function (err) {
                 $scope.isProssing = false;
                 logger.error(err.message);
             });
          }
          else{
            logger.error("Please fill in all the details before submission");
          }

       
        };

                  
        $scope.isDone = function () {
            $('#ModalSubmitted').modal('hide');
            $timeout(function(){
                $state.go('app.ProfilePage.actions');
              }, 500);
        }

        function _Submit() {
            if ($scope.Field.ShareToEmail && ($scope.Field.Emails == null || $scope.Field.Emails.length <= 0)) {
                return;
            }
            $scope.isSubmiting = true;
            var post = {
                kdSubmits: _GetPost(),
                isShareToDepartment: $scope.Field.ShareToDepartment,
                isShareToCop: $scope.Field.ShareToCop,
                isSkip: $scope.Field.IsSkip,
                emailToShare: $scope.Field.ShareToEmail ? _.map($scope.Field.Emails, function (o) { return o.Id }) : [],
                referenceKdIds: $scope.referenceKdIds,
               // submittedasValidated = $scope.submittedasValidated,
               // validatedRemarks: $scope.validatedRemarks,
                ptgpts: $scope.ptgpts,
                ptgptsValue: $scope.ptgptsValue

            };
            BulkUploadApi.api.Submit.save(angular.toJson(post)).$promise.then(function (res) {
                $rootScope.userInfo.userAppConfiguration.skipShareDocumentDialog = $scope.Field.IsSkip;
                UserProfileApi.saveUserInfo($rootScope.userInfo);
                _buildComplete(res.submitKdInfos);
            }, function (err) {
                logger.error(err.message);
                $scope.isSubmiting = false;
            });
        };

        function _buildComplete(data) {
            var first = _.head(data);
            if (!_.isEmpty(first)) {
                var knowledge = {
                    deparment: first.deparment,
                    cop: first.cop,
                    emailShare: first.emailShare,
                    titles: []
                };
                _.forEach(data, function (o) {
                    knowledge.titles.push({ id: o.docId, title: o.title });
                });
                localStorage['bulk-upload-complete'] = angular.toJson(knowledge);
                _hideDialog();
                logger.success('Save successfully!');
                $state.go('^.completed', {
                    type: _getType()
                });
                $scope.isSubmiting = false;
            } else {
                logger.error('No record imported');
                $scope.isSubmiting = false;
            }
        };

        function _getLinkValidate(record) {
            return '/knowledge-discovery/' + record.documentId;
        };

        function _getType() {
            if (!_.isEmpty($scope.Records)) {
                return _.head($scope.Records).type;
            }
            return '';
        };

        function _showDialog() {
            $scope.Dialog = true;
            $scope.$emit('Dialog', {
                show: true
            });
        };

        function _hideDialog() {
            $scope.Field.IsSkip = $rootScope.userInfo.userAppConfiguration.skipShareDocumentDialog;
            $scope.Dialog = false;
            $scope.$emit('Dialog', {
                show: false
            });
        };

        $scope.getRecordsSelect = function() {
            return _.filter($scope.Records, function (o) { return o.selected });
        }

      
    //    $scope.GetBatchData($scope.Field.batchNumber);
        $scope.Proceed = _Proceed;
        $scope.Submit = _Submit;
        $scope.getLinkValidate = _getLinkValidate;
        $scope.getType = _getType;
        $scope.showDialog = _showDialog;
        $scope.hideDialog = _hideDialog;
        $scope.multiselected=false;
        $scope.showBulkEdit = false;
        $scope.singleselected=false;
        $scope.isEditMode = false;

        $scope.bulkEdit = function(){
            $scope.isBulkEdit = true;
            $scope.isEditMode = true;
        }
        $scope.showEditPanel = function(idx){
            $scope.Records[idx].isEdit = true;
            $scope.isEditMode = true;
        }

        $scope.$on('onSave', function (event, data) {
           debugger;

                for(var i=0 ; i < $scope.Records.length;i++){
                    if ($scope.Records[i].selected) {
                        $scope.Records[i].isEdited = true; 
                      //  $scope.Records[i].documentId = data.data.documentId;
                        $scope.Records[i].Expert = data.data.Expert;
                        $scope.Records[i].smeUserId = data.data.Expert.ExpertID;
                        $scope.Records[i].endorserUserId = data.data.EndorserID;
                        $scope.Records[i].Endorser = data.data.Endorser;
                        $scope.Records[i].EndorserName =  data.data.EndorserName;
                        $scope.Records[i].disciplines = data.data.disciplines;
                        $scope.Records[i].submittedAsValidated = data.data.submittedAsValidated;
                        $scope.Records[i].validationRemarks = data.data.validationRemarks;
                        $scope.Records[i].referenceKdIds = data.data.referenceKdIds;
                        $scope.Records[i].projectTypeId = data.data.projectTypeId;
                        $scope.Records[i].valueCreationId = data.data.valueCreationId;
                        $scope.Records[i].valueCreateds = data.data.valueCreateds;
                        $scope.Records[i].valueTypes = data.data.valueTypes;
                        $scope.Records[i].isValid = data.data.isValid;
                    }
                   }

                   if(data.data.isEdit == true){
                    _HideAllSection(data.idx);
                }
          //  $scope.multiselected=false;
          //  $scope.checkAll = false;
            $scope.isBulkEdit = false;
            $scope.isEditMode = false;
        });

        $scope.$on('onCancel', function (event, data) {
            $scope.isEditMode = false;

            for(var i=0; i< $scope.Records.length; i++){
                $scope.Records[i].singleselected = false;
                $scope.Records[i].selected = false;
                
                _HideAllSection(i)
            }
            $scope.multiselected=false;
            $scope.checkAll = false;
            $scope.isBulkEdit = false;
        });

        function _HideAllSection(index) {
         
            if ($scope.Records != null) {

                for(var i=0; i< $scope.Records.length; i++){
                    $scope.Records[i].isEdit = false;
                    $scope.Records[i].singleselected = false;
                  //  $scope.Records[i].selected = false;
                }

               
                   
            }
        }
        _onInit();
    }
})();
