(function () {
    'use strict';

    angular
      .module('app.collection')
      .factory('CollectionService', CollectionService);

    /** @ngInject */
    function CollectionService(Utils) {
        var entire = {
            "id": null,
        };
        function getPost() {
            return angular.copy(entire);
        }

        function setAttr(path, value) {
            _.set(entire, path, value);
            return true;
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
            "smeId": null,
            "valueCreationId": null,
            "documentShareValuesCreated": [],
            "isShareToDepartment": false,
            "isShareToCop": false,
            "emailsToShare": [],
            "isSkip": false
        };

        function initValidate(field, documentId, _Skill) {
            var disciplines = [];
            _.forEach(field.disciplines, function (o) {
                _.forEach(o.subs, function (o1) {
                    disciplines.push({
                        disciplineId: parseInt(o.Id),
                        subdisciplineId: parseInt(o1.Id),
                        isPrimary: o.isPrimary
                    });
                });
            });
            var documentShareValuesCreated = [];
            _.forEach(field.valueCreateds, function (o) {
                var tmp = _.filter(_Skill, ['Text', o.ReferenceId]);
                documentShareValuesCreated.push({
                    knowledgeDocumentId: parseInt(documentId),
                    valueTypeId: _.isNaN(parseInt(o.ValueTypeId)) ? null : parseInt(o.ValueTypeId),
                    estimatedValue: _.isNaN(parseInt(o.EstimatedValue)) ? null : parseInt(o.EstimatedValue),
                    remarks: o.Remarks,
                    kdReferenceId: (tmp.length > 0) ? parseInt(tmp[0].Id) : null
                });
            });
            _.set(validate, 'id', parseInt(documentId));
            _.set(validate, 'disciplines', disciplines);
            _.set(validate, 'smeId', field.Expert.ExpertID);
            _.set(validate, 'valueCreationId', field.valueCreationId);
            _.set(validate, 'documentShareValuesCreated', documentShareValuesCreated);
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

        function transform(data, headers) {
            var contentDisposition = headers('Content-Disposition');
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
            if (_.endsWith(fileName ,'.png') || _.endsWith(fileName ,'.jpg')) {
                fileUrl = Utils.getImage('cover', fileId);
            }
            else {
                var arr = fileName.split('.');
                var fileExt = arr[arr.length - 1];
                switch (fileExt) {
                    case 'doc':
                    case 'docx':
                        fileUrl = "/assets/icons/icon_docx.png";
                        break;
                    case 'xls':
                    case 'xlsx':
                        fileUrl = "/assets/icons/icon_xlsx.png";
                        break;
                    case 'pdf':
                    default:
                        fileUrl = "/assets/icons/icon_pdf.png";
                        break;
                }
            }
            return {
                result: fileUrl,
                id: parseInt(fileId),
                name: fileName,
                size: data.size
            };
        }

        return {
            getPost: getPost,
            setAttr: setAttr,
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
