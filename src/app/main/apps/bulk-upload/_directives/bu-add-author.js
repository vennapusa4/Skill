/**
 * @author v.lugovksy 
 * created on 16.12.2015
 */
(function () {
  'use strict';

  angular.module('app.bulkUpload')
    .directive('buAddAuthor', buAddAuthor);

  /** @ngInject */
  function buAddAuthor(SearchApi, $timeout) {
    return {
      restrict: 'AE',
      scope: {
        save: '=',
        authors: '='
      },
      controller: function ($scope) {
        $scope.Authors = [];

        $scope.Source = {
          dataTextField: "displayName",
          dataValueField: "name",
          filter: "contains",
          minLength: 1,
          delay: 500,
          dataSource: {
            serverFiltering: true,
            transport: {
              read: function (options) {
                return SearchApi.searchUser(options, $scope.Authors);
              }
            },
          },
          open: function (e) {
            $timeout(function () {
              e.sender.list.closest('.k-animation-container').find('.k-list-container').addClass('multiselect_panel no_grouping');
            });
          },
        };

        $scope.Authors = $scope.authors;
        $scope.$on('AlsoAuthor', function (event, data) {
          var index = _.findIndex($scope.Authors, function (obj) { return obj.name == data.submissionBy.name });
          if (data.status && index === -1) {
            $scope.Authors.unshift({
              uid: data.submissionBy.uid,
              name: data.submissionBy.name,
              displayName: data.submissionBy.displayName,
              isSubmission: true
            });
          } else if (!data.status && index === 0) {
            $scope.Authors.splice(0, 1);
          }
        });

        $scope.$on('Validate', function (event) {
          _Validate();
        });

        $scope.$watch('Authors', function (next, prev) {
          _Validate();
        }, true);

        function _onOpen(e) {
          $timeout(function () {
            e.sender.list.closest('.k-animation-container').find('.k-list-container').addClass('multiselect_panel no_grouping');
          });
        };

        function _onSelect(e) {
          var index = _.findIndex($scope.Authors, function (obj) { return obj.name == e.dataItem.name });
          if (index == -1) {
            $scope.Authors.push(e.dataItem);
          }
          $timeout(function () {
            $scope.Author = "";

          });
        };

        function _Remove(idx) {
          $scope.Authors.splice(idx, 1);
        };

        function _Validate() {
          $scope.$emit('ValidateStatus', { status: $scope.Authors.length > 0 });
        };


        // Set to parrent
        $scope.$watch('Authors', function () {
          $scope.$parent.Authors = $scope.Authors;
        });

        $scope.onOpen = _onOpen;
        $scope.onSelect = _onSelect;
        $scope.Remove = _Remove;
      },
      templateUrl: 'app/main/apps/bulk-upload/_directives/bu-add-author.html',
      link: function (scope) {
        scope.newauthor = false;
        scope.$emit('Completed', null);
      }
    };
  }
})();
