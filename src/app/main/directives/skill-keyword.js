/**
 * @author v.lugovksy
 * created on 16.12.2015
 */
(function () {
  'use strict';

  angular.module('app.home')
    .directive('skillKeyword', skillKeyword);

  /** @ngInject */
  function skillKeyword($timeout) {

    return {
      restrict: 'AE',
      scope: {
        hasMin: '=',
        min : '='
      },
      controller: function ($scope) {
        $scope.keywords = [];

        $scope.Questions = {};
        $scope.Questions.chooseKeyword = 'Keywords <strong class="req" ng-if="min != 0">*</strong>';

        $scope.$on('changeQuestionsLanguage', function (event, data) {
          $scope.Questions.chooseKeyword = $scope.$parent.Questions.chooseKeyword;
        });

        $scope.showMin = false;

        $scope.KeywordSource = {
          dataTextField: "title",
          dataValueField: "title",
          valuePrimitive: true,
          filter: "contains",
          autoBind: true,
          minLength: $scope.min,
          minSelectedItems : $scope.min,
          dataSource: [],
          change:function (e) {
            $scope.$emit('validateKeyword',  $scope.keywords.length);
           },
          filtering: function (e) {
            if (e.filter) {
              if (_.endsWith(e.filter.value, ' ')) {
                addKeyword(_.trim(e.filter.value));
              }
            }
          },
          open: function (e) {
            e.preventDefault();
          }
        };
        if($scope.hasMin == 'show') {
          $scope.showMin = true;
        }
        console.log($scope.showMin);
        var offGet = $scope.$on('Get', function (event, data) {
          _.forEach(data.Get('additionalKeyWords'), function (o) {
            addKeyword(o.keyWord);
          });
          $scope.keywords = _.map(data.Get('additionalKeyWords'), 'keyWord');
          offGet();
        });

        $scope.$on('Submit', function (event, data) {
          data.Set('additionalKeyWords', _.map($scope.keywords, function (o) {
            return {
              keyWord: o
            };
          }));
        });

        function addKeyword(val) {
          if(val != ""){
            $scope.KeywordControl.dataSource.add({ title: val });
            if (!_.head(_.filter($scope.keywords, function (o) { return o.title === val }))) {
              $scope.keywords.push(val);
              $scope.$emit('validateKeyword',  $scope.keywords.length);
              
            }
          }
        
        };

        $timeout(function () {
          var inputKeyword = $scope.KeywordControl.input;
          inputKeyword.on('keydown', function (e) {
            if (e.keyCode === 13 && e.keyCode !== 32) {
              e.preventDefault();
              var newKeyword = _.trim(this.value);
              $timeout(function () {
                addKeyword(newKeyword);
              });
            }
            else if (e.keyCode === 32) {
              e.preventDefault();
              var newKeyword = _.trim(this.value);
              if(newKeyword != ""){
                $timeout(function () {
                  addKeyword(newKeyword);
                });
              }
              else{
                e.preventDefault();
              }
              
            }
          });

          $scope.close = function(e){
            alert("closed");
          }
          inputKeyword.on('focusin', function (e) {
            e.preventDefault();
          });
        }, 1000);
      },
      templateUrl: 'app/main/directives/skill-keyword.html',
      link: function (scope) {
        scope.$emit('Completed', null);
      }
    };
  }
})();
