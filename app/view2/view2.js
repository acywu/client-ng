'use strict';

angular.module('myApp.view2', ['ngRoute'])

.config(['$routeProvider', function($routeProvider) {
  $routeProvider.when('/view2', {
    templateUrl: 'view2/view2.html',
    controller: 'View2Ctrl'
  });
}])

.controller('View2Ctrl', ['$scope',function($scope, socketInstance) {
  $scope.messages = [];
  $scope.sendMessage = function(){
    socketInstance.emit('userChat', $scope.message)
  }

  $scope.$on('socketInstance', function (ev, data) {
    $scope.messages = data
  });

  // Canned Data
  $scope.labels = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "November", "December"];
  $scope.data = [
    [65, 59, 80, 81, 56, 55, 40, 23, 45, 54, 53, 34]
  ];
  $scope.onClick = function (points, evt) {
    console.log(points, evt);
  };
  $scope.datasetOverride = [{ yAxisID: 'y-axis-1' }, { yAxisID: 'y-axis-2' }];
  $scope.options = {
    scales: {
      yAxes: [
        {
          id: 'y-axis-1',
          type: 'linear',
          display: true,
          position: 'left'
        },
        {
          id: 'y-axis-2',
          type: 'linear',
          display: true,
          position: 'right'
        }
      ]
    }
  };

}]);
