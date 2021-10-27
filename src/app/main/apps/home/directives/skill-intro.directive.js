/**
 * @author v.lugovksy
 * created on 16.12.2015
 */
(function () {
  'use strict';

  angular.module('app.home')
    .directive('skillIntro', skillIntro);

  /** @ngInject */
  function skillIntro($compile, appConfig) {

    return {
      restrict: 'AE',
      scope: {},
      controller: function ($scope) {
        $scope.myInterval = 5000;
        $scope.noWrapSlides = false;
        $scope.active = 0;
        $scope.slides = _.map(appConfig.introduction, function (value, idx) { return { id: idx++, image: value } });
        function _hide(event) {
          $scope.showIntroduction = false;
          $('body').css('overflow', 'auto');
        }

        $scope.hide = _hide;
      },
      link: function (scope) {

        var firstTime = (localStorage['firsttime'] == 'true');
        if (firstTime) {
          localStorage['firsttime'] = false;
          scope.showIntroduction = true;
          var template = '<div class="modal fade in modal_response" id="introduction-video" tabindex="- 1" role="dialog" style="display:block" ng-if="showIntroduction">'
            + '<div class="modal-dialog" role= "document" >'
            + '<div class="modal-header" style="position:relative;"><button type="button" class="close" ng-click="hide()" data-dismiss="modal" aria-label="Close" style="position:absolute;top:5px;right:-30px;opacity:1;"><span aria-hidden="true"><i class="icon-close"></i></span></button></div>'
            + '<div class="modal-content" style="border:none;border-radius:0px">'
            + '<div uib-carousel active="active" interval="myInterval" no-wrap="noWrapSlides">'
            + '<div uib-slide ng-repeat="slide in slides track by $index" index="slide.id"><img ng-src="{{slide.image}}" style="margin:auto;">'
            + '</div></div>'
            + '</div></div></div>';
          var videoFn = $compile(template);
          var videoContent = videoFn(scope);

          var background = '<div class="modal-backdrop fade in" ng-if="showIntroduction"></div>';
          var bacgroundFn = $compile(background);
          var backgroundContent = bacgroundFn(scope);

          $('body').append(videoContent);
          $('body').append(backgroundContent);
          $('body').css('overflow', 'hidden');
        }
      }
    };
  }
})();
