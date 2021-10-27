(function () {
  'use strict';

  angular
    .module('app.knowledgeDiscovery')
    .factory('KnowledgeService', KnowledgeService);

  /** @ngInject */
  function KnowledgeService(Utils) {
    var entire = {
      "id": null,
      "knowledgeDocumentId": null,
      "lessonLearnType": null,
      "technicalAlertType": null,
      "title": null,
      "summary": null,
      "supposedToHappen": null,
      "actuallyHappen": null,
      "whyDifference": null,
      "whatLearn": null,
      "originalLanguage": null,
      "isAuthor": true,
      "attachments": [],
      "copId": null,
      "projectId": null,
      "projectPhaseId": null,
      "locationId": null,
      "valueCreationTypeId": null,
      "wellId": null,
      "wellPhaseId": null,
      "wellOperationId": null,
      "valueInRM": null,
      "recommendation": null,
      "insightKnowledgeReferences": [],
      "authors": [],
      "referenceKdIds": [],
      'businessSectors' : [],
      'businessSectorTypeIds':[],
      'methodologyTools': null,
       'businessImpact': null,
      'successFactors': null,
      'ptgpts': false,
      'ptgptsValue': null,
      'projectTypeId' : null
     
    };

    var draft = {};

    function init(value) {
      draft = angular.copy(value);
      if (draft && draft.collaborationResponses && draft.collaborationResponses.length > 0) {
        build.collaborationResponses = draft.collaborationResponses;
      }
      return true;
    }

    function get(path) {
      return _.get(draft, path);
    }

    function set(path, value) {
      _.set(draft, path, value);
      return true;
    }

    function getPost() {
      return angular.copy(entire);
    }

    function setAttr(path, value) {
      _.set(entire, path, value);
      return true;
    }

    function getAttr(path) {
      return _.get(entire, path);
    }

    function mergeObject(path, value) {
      var node = _.isEmpty(path) ? entire : _.get(entire, path);
      var newnode = _.merge(node, value);
      if (_.isEmpty(path)) {
        entire = newnode;
      }
      else {
        _.set(entire, path, newnode);
      }
      return true;
    }

    var images = [];

    function loadImages(imgs) {
      images = angular.copy(imgs);
    }

    function getImages() {
      return angular.copy(images);
    }

    var build = {};

    function getBuild(path) {
      return _.get(build, path);
    }

    function initBuild(data) {
      build = angular.copy(data);
      return true;
    }

    var validate = {
      "id": null,
      "disciplines": [],
      "additionalProjects": [],
      "additionalWells": [],
      "additionalEquipments": [],
      "smeId": null,
      "documentShareValuesCreated": [],
      "isShareToDepartment": false,
      "isShareToCop": false,
      "emailsToShare": [],
      "isSkip": false,
      "projectTypeId": false,
      "submittedAsValidated" : false,
      "copId" : null,
      "validationRemarks":null,
      "asCoverImage": null,
      "extensionImage": null,
      "coverId": 0,
    };

    function initValidate(field, documentId, _Skill) {
      var disciplines = [];
      _.forEach(field.disciplines, function (o) {
        if (!_.isEmpty(o.subs)) {
          _.forEach(o.subs, function (o1) {
            disciplines.push({
              disciplineId: parseInt(o.Id),
              subdisciplineId: parseInt(o1.Id),
              isPrimary: o.isPrimary
            });
          });
        }
        else {
          disciplines.push({
            disciplineId: parseInt(o.Id),
            isPrimary: o.isPrimary
          });
        }
      });
      var documentShareValuesCreated = [];
      _.forEach(field.valueCreateds, function (o) {
        var tmp = _.filter(_Skill, ['Text', o.KdReference]);
        documentShareValuesCreated.push({
          id: o.id,
          knowledgeDocumentId: parseInt(documentId),
          valueTypeId: o.ValueTypeId.Id,
          estimatedValue: _.isNaN(parseInt(o.EstimatedValue)) ? undefined : parseInt(o.EstimatedValue),
          remarks: o.Remarks,
          kdReferenceId: (tmp.length > 0) ? parseInt(tmp[0].Id) : o.KdReferenceId,
          valueCreationTypeId : o.valueCreationTypeId
        });
      });
      var smeid=null;
      if(field.Expert!=null)
      {
        smeid=field.Expert.ExpertID;
      }
      _.set(validate, 'id', parseInt(documentId));
      _.set(validate, 'disciplines', disciplines);
      _.set(validate, 'smeId', smeid);
      _.set(validate, 'endorseId', field.EndorserID);
      _.set(validate, 'valueCreationId', field.valueCreationId);
      _.set(validate, 'documentShareValuesCreated', documentShareValuesCreated);
      _.set(validate, 'projectTypeId', field.projectTypeId);
      _.set(validate, 'submittedAsValidated', field.submittedAsValidated);
      _.set(validate, 'copId', field.copId);
      _.set(validate, 'validationRemarks', field.validationRemarks);
      _.set(validate, 'asCoverImage', field.asCoverImage);
      _.set(validate, 'extensionImage', field.extensionImage);
      _.set(validate, 'coverId', field.coverId);
      _.set(validate, 'additionalProjects', field.additionalProjects);
      _.set(validate, 'additionalWells', field.additionalWells);
      _.set(validate, 'additionalEquipments', field.additionalEquipments);
    }

    function getValidate() {
      var tmp = angular.copy(validate);
      delete tmp.isShareToDepartment;
      delete tmp.isShareToCop;
      delete tmp.emailsToShare;
      delete tmp.isSkip;
      return tmp;
    }

    function getSubmit(fields) {
      _.set(validate, 'isShareToDepartment', fields.ShareToDepartment);
      _.set(validate, 'isShareToCop', fields.ShareToCop);
      _.set(validate, 'emailsToShare', fields.ShareToEmail ? _.map(fields.Emails, function (o) { return o.Id }) : []);
      _.set(validate, 'isSkip', fields.IsSkip);
      return angular.copy(validate);
    }

    function transform(type, data, headers) {
      var contentDisposition = headers('Content-Disposition');
      if (!_.isEmpty(contentDisposition)) {
        var dict = _.fromPairs(_.map(_.split(contentDisposition, ';'), function (o) {
          return _.trim(o).split('=');
        }));
        var fileId = dict['id'];
        var fileName = '';
        if (dict.hasOwnProperty('fileName')) {
          fileName = decodeURIComponent(dict['fileName'].replace(new RegExp(/\+/g), " "));
        } else {
          fileName = decodeURIComponent(dict['filename'].replace(new RegExp(/\+/g), " "));
        }

        var fileUrl = '';
        if (_.endsWith(fileName, '.png') || _.endsWith(fileName, '.jpg')) {
          fileUrl = Utils.getImage(type ? 'cover' : 'doc', fileId);
        }
        else {
          fileUrl = Utils.getIcon(fileName);
        }
        return {
          result: fileUrl,
          id: parseInt(fileId),
          name: fileName,
          size: data.size
        };
      }
      return {};
    }

    return {
      init: init,
      get: get,
      set: set,
      getPost: getPost,
      setAttr: setAttr,
      getAttr: getAttr,
      mergeObject: mergeObject,
      getBuild: getBuild,
      initBuild: initBuild,
      getValidate: getValidate,
      getSubmit: getSubmit,
      initValidate: initValidate,
      loadImages: loadImages,
      getImages: getImages,
      transform: transform
    };
  }

})();
