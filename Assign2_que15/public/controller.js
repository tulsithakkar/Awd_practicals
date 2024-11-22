var app = angular.module('studApp',[]);
app.controller("studCtrl",['$scope','$http',function($scope,$http){
    $scope.loginStatus = false;
    $scope.userRole ='';
    $scope.username='';
    $scope.password='';
    $scope.newStudent = {}; 
    $scope.loginMessage = '';
    $scope.students = [];
    $scope.studentDetails = null; 
    $scope.addstat = 0; 


$scope.checkUser = function(){
    $http.post('http://localhost:3002/api/login',{username : $scope.username, password:$scope.password})
    .then(function(response){
        if(response.data.success){
            $scope.loginStatus = true;
            $scope.userRole = response.data.role;

            $scope.username ='';
            $scope.password='';

            if($scope.userRole ==='student'){
                $scope.studentDetails = response.data.studentDetails;
            }
            if($scope.userRole === 'admin'){
                $scope.fetchStudent();
            }
        }else
        {
            $scope.loginStatus = false;
            $scope.loginMessage = 'invalid username or password';
        }
    });

};

$scope.fetchStudent = function(){
    $http.get('http://localhost:3002/api/students')
    .then(function(response)
    {
        $scope.students = response.data;
    }).catch(function(error){
        console.error("error in fetching")
    });

};

$scope.fetchStudentDetails = function(studentID){
    $http.get(`http://localhost:3002/api/students/${studentID}`)
    .then(function(response)
    {
        $scope.studentDetails = response.data;
    }).catch(function(error){
        console.error("error in fetching")
    }); 
};
$scope.editStudent = function(student) {
    student.editing = true;
};

$scope.saveStudent = function(student) {
    if (!student.studName || !student.course || !student.semester || !student.status) {
        alert("All fields are required.");
        return; 
    }

    $http.put(`http://localhost:3002/api/students/${student.studID}`, student)
        .then(function(response) {
            student.editing = false; 
        }).catch(function(error) {
            console.error('Error saving student:', error);
        });
};
$scope.deleteStudent = function(studID){
    if(confirm('are you sure you want to delete')){
        $http.delete(`http://localhost:3002/api/students/${studID}`)
    .then(function(response)
    {
        $scope.fetchStudent();
    }).catch(function(error){
        console.error("error in deleting")
    }); 
    }
};


$scope.addStudent = function(){
    if(!($scope.newStudent.studID && $scope.newStudent.studName && $scope.newStudent.course &&$scope.newStudent.status && $scope.newStudent.semester)){
        alert("all required");
        return;
    }
    $http.post(`http://localhost:3002/api/students/`,$scope.newStudent)
    .then(function(response)
    {
        $scope.students.push(response.data);
        $scope.newStudent={};
        $scope.addstat =0

    }).catch(function(error){
        console.error("error in adding")
    }); 

};

$scope.logout = function(){
    $scope.loginStatus = false; 
    $scope.userRole = ''; 
    $scope.studentDetails = null; 
    $scope.username = ''; 
    $scope.password = ''; 
    $scope.loginMessage = '';
}




}])