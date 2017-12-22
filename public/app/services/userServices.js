angular.module('userServices',[])
.factory('User',function($http){
userFactory={};

//User.create(regData);
userFactory.create=function(regData){
	return $http.post('/api/users',regData);
}
userFactory.checkUsername=function(regData){
	return $http.post('/api/checkusername',regData);
}
userFactory.checkEmail=function(regData){
	return $http.post('/api/checkemail',regData);
}

userFactory.activeAccount=function(token){
return $http.put('/api/activate/'+token);
}

userFactory.checkCredentials=function(loginData){
return $http.post('/api/resend',loginData);
}
userFactory.resendLink=function(username){

return $http.put('/api/resend',username);
}

userFactory.sendUsername=function(userData){

	return $http.get('/api/resetusername/'+userData);
}
userFactory.sendPassword=function(resetData){

	return $http.put('/api/resetpassword',resetData);
}

userFactory.resetUser=function(token){

	return $http.get('/api/resetpassword/'+token);
}
userFactory.savePassword=function(regData){

	return $http.put('/api/savepassword',regData);
}
return userFactory;
});