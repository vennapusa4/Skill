/**
 * @author v.lugovksy
 * created on 16.12.2015
 */
(function () {
    'use strict';

    angular.module('app.home')
        .directive('skillUpdateInterest', skillUpdateInterest);

    /** @ngInject */
    function skillUpdateInterest() {

        return {
            restrict: 'AE',
            scope: {
                callback: '&',
            },
            controller: function ($scope, KnowledgeDocumentApi, CommonApi) {

                // Update Interest
                $scope.MyRecommendedDiscipline = [];
                $scope.MyRecommendedDisciplineChange = [];

                $scope.AllDisciplines = [];
                $scope.SelectedDisciplineIds = [];
                $scope.SelectedDisciplineIdsChange = [];
                CommonApi.getAllDiscipline().then(function (totalData) {

                    KnowledgeDocumentApi.getRecommendedDisciplineForMe("", 0, 4).then(function (data) {
                        $scope.MyRecommendedDiscipline = data;
                        $scope.MyRecommendedDisciplineChange = angular.copy(data);

                        if ($scope.MyRecommendedDiscipline.length > 0) {
                            _.remove(totalData, function (obj) {
                                var index = _.findIndex($scope.MyRecommendedDiscipline, function (o) {
                                    return o.id == obj.id;
                                });

                                return index != -1;
                            });
                        }

                        $scope.AllDisciplines = totalData;
                        KnowledgeDocumentApi.getMyDisciplines("", 0, 10).then(function (data) {
                            $scope.SelectedDisciplineIds = [];
                            for (var i = 0; i < data.length; i++) {
                                var myRecomIndex = -1; // $scope.MyRecommendedDiscipline.findIndex(s=> s.id == data[i].id);
                                for(var j=0;j < $scope.MyRecommendedDiscipline.length; j++)
                                {
                                    if($scope.MyRecommendedDiscipline[i].id == data[j].id) {
                                        myRecomIndex=j;
                                        break;
                                    }
                                }
                                if(myRecomIndex == null || myRecomIndex == undefined || myRecomIndex <=0)
                                {
                                    $scope.SelectedDisciplineIds.push(data[i].id);
                                    $scope.SelectedDisciplineIdsChange.push(data[i].id);
                                }
                                else{
                                    $scope.MyRecommendedDiscipline[myRecomIndex].isSelectedByMe = true;
                                }
                            }
                        });
                    });
                });

                $scope.UpdateMyInterestDisciplines = function () {

                    var idsPost = [];
                    for (var i = 0; i < $scope.SelectedDisciplineIdsChange.length; i++) {
                        idsPost.push($scope.SelectedDisciplineIdsChange[i]);
                    }

                    for (var i = 0; i < $scope.MyRecommendedDisciplineChange.length; i++) {
                        if ($scope.MyRecommendedDisciplineChange[i].isSelectedByMe == true) {
                            if (idsPost.indexOf($scope.MyRecommendedDisciplineChange[i].id) == -1) {
                                idsPost.push($scope.MyRecommendedDisciplineChange[i].id);
                            }
                        }
                    }

                    var postData = { ids: idsPost };
                    KnowledgeDocumentApi.updateMyInterestDisciplines(postData).then(function (data) {

                        if (data.result == true) {
                            $scope.element.find('#UpdateInterest').modal('hide');
                            $scope.MyRecommendedDiscipline = angular.copy($scope.MyRecommendedDisciplineChange);
                            $scope.SelectedDisciplineIds = angular.copy($scope.SelectedDisciplineIdsChange);

                            $scope.callback();
                        } else {

                            // to original
                            $scope.MyRecommendedDisciplineChange = angular.copy($scope.MyRecommendedDiscipline);
                            $scope.SelectedDisciplineIdsChange = angular.copy($scope.SelectedDisciplineIds);
                        }
                    });
                }

                $scope.CancelUpdateInterest = function () {
                    // to original

                    $scope.MyRecommendedDisciplineChange = angular.copy($scope.MyRecommendedDiscipline);
                    $scope.SelectedDisciplineIdsChange = angular.copy($scope.SelectedDisciplineIds);
                    $scope.element.find('#UpdateInterest').modal('hide');
                }
            },
            templateUrl: 'app/main/directives/skill-update-interest.html',
            link: function ($scope, $element) {

                var $scope = $scope;
                var $element = $($element);
                $scope.element = $element;
            }
        };
    }
})();