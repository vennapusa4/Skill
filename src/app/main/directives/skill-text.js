/**
 * @author v.lugovksy
 * created on 16.12.2015
 */
(function () {
    'use strict';

    angular.module('app.home')
        .directive('skillTextEllipsis', skillTextEllipsis);

    /** @ngInject */
    function skillTextEllipsis($timeout) {

        return {
            restrict: 'A',
            scope: true,
            link: function ($scope, $element, $attrs) {
                var lineHeight = parseInt($attrs['lineHeight']);
                $timeout(function () {
                    var height = $element.height();
                    if (height > 0) {
                        var oldContent = $element.text();
                        $element.attr('title', oldContent);
                        $element.text('');
                        var arr = _.split(oldContent, '');
                        var content = '';
                        var isDone = false;
                        _.forEach(arr, function (o) {
                            if (!isDone) {
                                content += o;
                                $element.text(content);
                                if ($element.height() > lineHeight) {
                                    var tmp = content.substring(0, content.length - 2);
                                    $element.text(_.truncate(content, { 'length': _.trim(tmp).length - 1, 'omission': '…', 'separator': ' ' }));
                                    isDone = true;
                                }
                            }
                        });
                    }
                }, 200);
            }
        };
    }
})();