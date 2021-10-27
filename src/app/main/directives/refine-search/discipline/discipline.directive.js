/**
 * @author v.lugovksy
 * created on 16.12.2015
 */
(function () {
    'use strict';

    angular.module('app.SearchPage')
        .directive('discipline', discipline);

    /** @ngInject */
    function discipline() {

        return {
            restrict: 'E',
            scope: {
                list: "=",
                removeDiscipline : "="
            },
            controller: function ($scope, $timeout,SearchApi) {

                var vm = this;
                vm.searchText = "";
                $scope.selectedObject = {
                    "id":"",
                    "text":"",
                }
                $scope.$on("onSearchTagRemove", function(evt,field){ 
                    if(field == "Discipline"){
                        //alert("Remove Author");
                        $("#discipline-list").data("kendoAutoComplete").value("");
                    }
                 });

                $scope.Scope = {
                    placeholder: "Discipline",
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
     
            templateUrl: 'app/main/directives/refine-search/discipline/discipline.html'

        };
    }
})();
