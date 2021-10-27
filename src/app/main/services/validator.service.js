(function () {
    'use strict';

    angular
        .module('app.home')
        .factory('ValidatorService', ValidatorService);

    /** @ngInject */
    function ValidatorService(Message) {
        
        function _Rules(scope) {
            scope.Validation = {
                rules: {
                    richtext: function (textarea) {
                        if (textarea.is("[data-richtext-msg]")) {
                            var html = $('<div></div>').append(textarea.val()).text();
                            var valid = $('<div></div>').append(html).text().trim().length > 0;
                            return valid;
                        }
                        return true;
                    },
                    minlength: function (textarea) {
                        if (textarea.is("[data-minlength-msg]")) {
                            var html = $('<div></div>').append(textarea.val()).text();
                            var count = $('<div></div>').append(html).text().trim().length;
                            return count > 20 || count === 0;
                        }
                        return true;
                    }
                },
                messages: {
                    required: Message.Msg1,
                    richtext: Message.Msg1,
                    minlength: Message.Msg2,
                    list: Message.Msg1
                }
            };
        };

        function _ModelState(err) {
            return _.join(_.values(err), '<br>');
        }

        this.Rules = _Rules;
        this.ModelState = _ModelState;
        return this;
    }

})();