/**
 * @author v.lugovksy
 * created on 16.12.2015
 */
(function () {
    'use strict';

    angular.module('app.SearchPage')
        .directive('wells', wells);

    /** @ngInject */
    function wells() {

        return {
            restrict: 'E',
            scope: {
                list: "=",
                removeWell : "="
            },
            controller: function ($scope, $timeout,SearchApi) {

                var vm = this;
                vm.searchText = "";
                $scope.selectedObject = {
                    "id":"",
                    "text":"",
                }
                $scope.$on("onSearchTagRemove", function(evt,field){ 
                    if(field == "Wells"){
                        $("#wells-list").data("kendoAutoComplete").value("");
                    }
                 });
              
                $scope.Scope = {
                    placeholder: "Wells",
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
                        $scope.$emit('onWellSelection' , e.dataItem);
                        
                    }
                };


            },
     
            templateUrl: 'app/main/directives/refine-search/wells/wells.html'

        };
    }
})();
