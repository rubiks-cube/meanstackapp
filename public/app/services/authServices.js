angular.module('authServices',[])
.factory('Auth',function($http, AuthToken){
authFactory={};

//User.create(regData);
authFactory.login=function(loginData){
	return $http.post('/api/authenticate',loginData).then(function(data)
		{AuthToken.setToken(data.data.token);
			return data});
};

//Auth.isloggedin
authFactory.isLoggedIn=function(){
	if(AuthToken.getToken()){
		return true;

	}
	else
		{return false;
}
//Auth GetUser
   
};
//Auth.facebook(token)
authFactory.facebook=function(token){

  AuthToken.setToken(token);
};


authFactory.google=function(token){
	//console.log(token);
  //console.log('mooo');
  AuthToken.setToken(token);
};

authFactory.twitter=function(token){
	//console.log(token);
  //console.log('mooo');
  AuthToken.setToken(token);
};


authFactory.getUser=function(){
	if(AuthToken.getToken()){

		return $http.post('/api/me');}
		else{
			//reject the response
			$q.reject({message:'user has noo tkn'});
		}
	}
//Auth.logout
authFactory.logOut=function(){
AuthToken.setToken();
};
return authFactory;
})


.factory('AuthToken',function($window){
var authTokenFactory={};
//AuthToken.setToken
authTokenFactory.setToken=function(token){
 if(token){
	$window.localStorage.setItem('token',token);}
	else{
		$window.localStorage.removeItem('token');
	}
  };
//toget_settoken
  authTokenFactory.getToken=function(){
  	return $window.localStorage.getItem('token');
     };
return authTokenFactory;

})
//to attach token to each request after login
.factory('AuthInterceptors',function(AuthToken){

var authInterceptorFactory={};

authInterceptorFactory.request=function(config){
var token= AuthToken.getToken();
//console.log('popo'+token);
if(token){
	      config.headers['x-access-token']=token;
   }

return config;
};
return authInterceptorFactory;
});
