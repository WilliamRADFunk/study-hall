var studyHallApp = angular.module('studyHallApp', []);

// Filters to make all uppercase.
studyHallApp.filter("uppercase", function($sce){
  return function(value){
    if (!angular.isString(value)) return value;
    return $sce.trustAsHtml(value.toUpperCase());
  };
});