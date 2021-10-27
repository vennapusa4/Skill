(function () {
    'use strict';

    angular
        .module('app.home')
        .factory('Utils', Utils);

    /** @ngInject */
    function Utils(appConfig) {
      //  debugger;
        var COVER = appConfig.SkillApi + 'api/Images/Preview/CoverImages/<%= id %>/Attachment';
        var AVATAR = appConfig.SkillApi + 'api/Images/Preview/UserProfiles/<%= id %>/ThumbnailPhoto';
        var DOC = appConfig.SkillApi + 'api/Images/Preview/KnowledgeDocumentAttachments/<%= id %>/Attachment';
        var EIDOC = appConfig.SkillApi + 'api/Images/Preview/ExpertInterviewAttachments/<%= id %>/Attachment';

        function _getImage(type, id) {
            if (id === null || id === undefined || id === 0) {
                var empty;
                switch (type) {
                    case 'avatar':
                        empty = '/assets/images/NoAvatar.jpg';
                        break;
                    case 'doc':
                    case 'cover':
                    default:
                        empty = '/assets/images/NoImage.gif';
                        break;
                }
                return empty;
            }
            var tmp;
            switch (type) {
                case 'avatar':
                    tmp = _.template(AVATAR);
                    break;
                case 'doc':
                    tmp = _.template(DOC);
                    break;
                case 'eidoc':
                    tmp = _.template(EIDOC);
                    break;
                case 'cover':
                default:
                    tmp = _.template(COVER);
                    break;
            }
            return tmp({ id: id });
        };

        function _getIcon(fileName) {
            var arr = fileName.split('.');
            var fileExt = _.toLower(arr[arr.length - 1]);
            var iconUrl = "/assets/icons/icon_other.png";
            switch (fileExt) {
                case 'doc':
                case 'docx':
                    iconUrl = "/assets/icons/icon_docx.png";
                    break;
                case 'xls':
                case 'xlsx':
                    iconUrl = "/assets/icons/icon_xlsx.png";
                    break;
                case 'ppt':
                case 'pptx':
                    iconUrl = "/assets/icons/icon_pptx.png";
                    break;
                case 'pdf':
                    iconUrl = "/assets/icons/icon_pdf.png";
                    break;
                case 'mp3':
                    iconUrl = "/assets/images/audio-bg.jpg";
                    break;
                case 'mp4':
                case 'webm':
                    iconUrl = "/assets/images/video-bg.jpg";
                    break;
                default:
                    iconUrl = "/assets/icons/icon_other.png";
                    break;
            }
            return iconUrl;
        };

        function _validateFile(file, exts) {
            var extension = (_.indexOf(_.map(exts, function (o) { return '.' + o }), _.toLower(file.extension)) > -1);
            var size = (file.size < (appConfig.maxFileSize * 1024 * 1024));
            return {
                extension: extension,
                size: size
            };
        };

        function _getContentDisposition(text, field) {
            var dict = _.fromPairs(_.map(_.split(text, ';'), function (o) {
                return _.trim(o).split('=');
            }));
            return decodeURIComponent(dict[field].replace(new RegExp(/\+/g), " "));
        };

        function _guid() {
            function s4() {
                return Math.floor((1 + Math.random()) * 0x10000)
                    .toString(16)
                    .substring(1);
            }
            return s4() + s4() + '-' + s4() + '-' + s4() + '-' +
                s4() + '-' + s4() + s4() + s4();
        };

        function _escape(input) {
            var chars = _.split(input, '');
            chars = _.filter(chars, function (o) {
                var charCode = o.charCodeAt(0);
                return charCode >= 31 && charCode <= 127;
            });
            return _.join(chars, '');
        };

        function _escapeArray(arr) {
            var result = [];
            _.forEach(arr, function (o) {
                result.push({ value: _escape(o.value) });
            });
            return result;
        };

        this.getImage = _getImage;
        this.getIcon = _getIcon;
        this.validateFile = _validateFile;
        this.getContentDisposition = _getContentDisposition;
        this.newguid = _guid;
        this.escape = _escape;
        this.escapeArray = _escapeArray;

        return this;
    }

})();
