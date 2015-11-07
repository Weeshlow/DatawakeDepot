'use strict';
var app = angular.module('com.module.dwUrlExtractions');

app.controller('UrlExtractionsCtrl', function($scope, $state, $stateParams, DwDomainEntityType, DwTrailUrl, DwUrlExtraction, UrlExtractionsService, gettextCatalog, AppAuth) {

  //Put the currentUser in $scope for convenience
  $scope.currentUser = AppAuth.currentUser;
  $scope.domainEntityTypes = [];
  $scope.trailUrls = [];

  $scope.formFields = [{
    key: 'id',
    type: 'input',
    templateOptions: {
      label: gettextCatalog.getString('id'),
      disabled: true
    }
  }, {
      key: 'dwTrailUrlId',
      type: 'select',
      templateOptions: {
          label: gettextCatalog.getString('Trail Url'),
          options: $scope.trailUrls,
          valueProp: 'id',
          labelProp: 'name',
          required: true,
          disabled: false
      }
  }, {
    key: 'dwDomainEntityTypeId',
    type: 'select',
    templateOptions: {
      label: gettextCatalog.getString('EntityType'),
      options: $scope.domainEntityTypes,
      valueProp: 'id',
      labelProp: 'name',
      required: false,
      disabled: false
    }
  },{
    key: 'value',
    type: 'input',
    templateOptions: {
      label: gettextCatalog.getString('Value'),
      required: true
    }
  }];


  $scope.delete = function(id) {
    UrlExtractionsService.deleteUrlExtraction(id, function() {
      $scope.safeDisplayedurlExtractions = UrlExtractionsService.getUrlExtractions();
      $state.go('^.list');
    });
  };

  $scope.onSubmit = function() {
    UrlExtractionsService.upsertUrlExtraction($scope.urlExtraction, function() {
      $scope.safeDisplayedurlExtractions = UrlExtractionsService.getUrlExtractions();
      $state.go('^.list');
    });
  };

  $scope.loading = true;
  DwUrlExtraction.find({filter: {include: [{relation:'trailUrl',scope:{include: ['trail']}},'domainEntityType']}}).$promise
      .then(function (allUrlExtractions) {
        $scope.safeDisplayedurlExtractions = allUrlExtractions;
        $scope.displayedUrlExtractions = [].concat($scope.safeDisplayedurlExtractions);
      })
      .catch(function (err) {
        console.log(err);
      })
      .then(function () {
        $scope.loading = false;
      }
  );

  DwDomainEntityType.find({filter: {include: []}}).$promise
      .then(function (allEntTypes) {
        for (var i = 0; i < allEntTypes.length; ++i) {
          $scope.domainEntityTypes.push({
            value: allEntTypes[i].name,
            name: allEntTypes[i].name + " - " + allEntTypes[i].description,
            id: allEntTypes[i].id
          });
        }
      })
      .catch(function (err) {
        console.log(err);
      })
      .then(function () {
      }
  );

  DwTrailUrl.find({filter: {include: []}}).$promise
      .then(function (allTrailUrls) {
          for (var i = 0; i < allTrailUrls.length; ++i) {
              $scope.trailUrls.push({
                  value: allTrailUrls[i].id,
                  name: allTrailUrls[i].url,
                  id: allTrailUrls[i].id
              });
          }
      })
      .catch(function (err) {
          console.log(err);
      })
      .then(function () {
      }
  );

  if ($stateParams.id) {
    UrlExtractionsService.getUrlExtraction($stateParams.id).$promise.then(function(result){
      $scope.urlExtraction = result;})
  } else {
    $scope.urlExtraction = {};
  }

});

