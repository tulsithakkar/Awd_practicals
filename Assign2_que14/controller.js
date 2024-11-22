const app = angular.module('productApp',[]);
app.controller('productconttroller',function($scope,$http){
    $http.get('http://localhost:3000/api/products')
    .then(function(response){
        $scope.products = response.data;
    })
    .catch(function(error){
        console.error("error fetching in products")
    })
})