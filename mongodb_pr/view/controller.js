const userModule = angular.module("userApp",[]);
userModule.controller("userCtrl",function($scope,$http){
    $scope.testmsg = "angularjs is working";
    $scope.users =[];
    $scope.newUser ={};
    $scope.edituserId = null;
    $scope.msg ="";
    $scope.addstat=0;

    $scope.getuser = function(){
        $http.get("api/users").then(
            function(response){
                $scope.users = response.data;
            },
            function(error){
                $scope.msg = "error fetching users";
                console.error(error);
            }
        );
    };


    $scope.addUser = function(){
        const existingUser = $scope.users.find(
            (item) => item.userId === $scope.newUser.userId
        );
        if(existingUser){
            $scope.msg = "user id alredy exits."
            return;
        }

        $http.post('/api/addUsers',$scope.newUser).then(
            function(response){
                $scope.msg = response.data.msg || "user added";
                $scope.getuser();

                $scope.newUser={};
                $scope.addstat=0;


                if($scope.userForm){
                    $scope.userForm.$setPristine();
                    $scope.userForm.$setUntounched();
                }

            },
            function(error){
                $scope.msg = "error adding user";
                console.log(error);
            }

        )
    }

    $scope.editUser = function (userId) {
        $scope.editUserId = userId; // Set the currently editing user ID
    };
    
    $scope.saveUser = function (item) {
        $http.put(`/api/editUsers/${item.userId}`, item).then(
            function (response) {
                $scope.msg = "User updated successfully";
                $scope.editUserId = null; // Reset the editing ID
                $scope.getuser(); // Refresh the user list
            },
            function (error) {
                $scope.msg = "Error updating user";
                console.error(error);
            }
        );
    };

    $scope.deleteUser = function (userId) {
        $http.delete(`/api/deleteUser/${userId}`).then(
          function (response) {
            $scope.msg = "User deleted";
            $scope.getuser(); // Refresh the User list
          },
          function (error) {
            $scope.msg = "Error deleting User";
            console.error(error);
          }
        );
      };

    $scope.getuser();
});