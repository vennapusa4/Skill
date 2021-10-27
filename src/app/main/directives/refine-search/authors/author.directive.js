/**
 * @author v.lugovksy
 * created on 16.12.2015
 */
(function () {
    'use strict';

    angular.module('app.SearchPage')
        .directive('author', author);

    /** @ngInject */
    function author() {

        return {
            restrict: 'E',
            scope: {
                list: "=",
                removeAuthor : "="
            },
            controller: function ($scope, $timeout,SearchApi) {

               // console.log("REMOVE AUTHOR"+$scope.removeAuthor);
                var vm = this;
                vm.searchText = "";
                $scope.selectedObject = {
                    "id":"",
                    "text":"",
                }
                $scope.$on("onSearchTagRemove", function(evt,field){ 
                    if(field == "Authors"){
                       // alert("Remove Author");
                        $("#author-list").data("kendoAutoComplete").value("");
                    }
                 });
                $scope.Scope = {
                    placeholder: "Author",
                    dataTextField: "text",
                    dataValueField: "id",
                    filter: "contains",
                    minLength: 4,
                    delay : 500,
                    clearButton: false,
                    dataSource: $scope.list,
                    open: function (e) {
                        $timeout(function () {
                            e.sender.list.closest('.k-animation-container').find('.k-list-container').addClass('multiselect_panel no_grouping');
                        });
                    },
                    select: function (e) {
                        $scope.$emit('onAuthorSelection' , e.dataItem);
                        
                    }
                };


            },
     
            templateUrl: 'app/main/directives/refine-search/authors/author.html'

        };
    }
})();
