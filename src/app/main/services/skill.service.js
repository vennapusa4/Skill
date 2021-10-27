(function () {
    'use strict';

    angular
        .module('app.home')
        .factory('SkillService', SkillService);

    /** @ngInject */
    function SkillService(Utils) {
        var entire = {};

        this.Init = function (value) {
            entire = angular.fromJson(angular.toJson(value));
        };

        this.Post = function () {
            return angular.copy(entire);
        };

        this.Get = function (path) {
            return angular.copy(_.get(entire, path));
        };
        this.Set = function (path, value) {
            _.set(entire, path, value);
            return true;
        };

        this.Merge = function (path, value) {
            var node = _.isEmpty(path) ? entire : _.get(entire, path);
            var newnode = _.merge(node, value);
            if (_.isEmpty(path)) {
                entire = newnode;
            }
            else {
                _.set(entire, path, newnode);
            }
            return true;
        };

        this.Transform = function (data, headers) {
            var contentDisposition = headers('Content-Disposition');
            var dict = _.fromPairs(_.map(_.split(contentDisposition, ';'), function (o) {
                return _.trim(o).split('=');
            }));
            var fileId = dict['id'];
            var fileName = decodeURIComponent(dict['fileName'].replace(new RegExp(/\+/g), " "));
            var fileUrl = '';
            if (fileName.endsWith('.png') || fileName.endsWith('.jpg')) {
                fileUrl = URL.createObjectURL(data);
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
        };

        return this;
    }

})();
