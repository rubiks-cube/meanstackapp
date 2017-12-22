

var app=angular.module('appRoutes', ['ngRoute','authServices'])


.config(function($routeProvider,$locationProvider){
	$locationProvider.html5Mode({ enabled: true, requireBase: false });

	$routeProvider
	.when('/',{
		templateUrl: "app/views/pages/home.html"
	})

	.when('/about',{
		templateUrl: "app/views/pages/about.html"
	})

	.when('/register',{
		templateUrl: "app/views/pages/users/register.html",
        controller:'regCtrl',
		controllerAs: 'register',
		authenticated:false
	})
	.when('/login',{
		templateUrl: "app/views/pages/users/login.html",
		authenticated:false
       // controller:'regCtrl',
		//controllerAs: 'register'
	})
	.when('/logout',{
		templateUrl: "app/views/pages/users/logout.html",
		authenticated:true
	})
	.when('/profile',{
		templateUrl: "app/views/pages/users/profile.html",
		authenticated:true
	})
	.when('/facebook/:token',{
		templateUrl: "app/views/pages/users/social/social.html",
		controller:'facebookCtrl',
		controllerAs: 'facebook',
		authenticated:false
	})
	.when('/facebookerror',{
		templateUrl: "app/views/pages/users/login.html",
		controller:'facebookCtrl',
		controllerAs: 'facebook',
		authenticated:false
	})
	.when('/google/:token',{
		templateUrl: "app/views/pages/users/social/social.html",
		controller:'googleCtrl',
		controllerAs: 'google',
		authenticated:false
	})
	.when('/googleerror',{
		templateUrl: "app/views/pages/users/login.html",
		controller:'googleCtrl',
		controllerAs: 'google',
		authenticated:false
	})


	.when('/twitter/:token',{
		templateUrl: "app/views/pages/users/social/social.html",
		controller:'twitterCtrl',
		controllerAs: 'twitter',
		authenticated:false
	})
	.when('/twittererror',{
		templateUrl: "app/views/pages/users/login.html",
		controller:'twitterCtrl',
		controllerAs: 'twitter',
		authenticated:false
	})
	.when('/facebook/inactive/error',{
		templateUrl: "app/views/pages/users/login.html",
		controller:'facebookCtrl',
		controllerAs: 'facebook',
		authenticated:false
	})
	.when('/google/inactive/error',{
		templateUrl: "app/views/pages/users/login.html",
		controller:'googleCtrl',
		controllerAs: 'google',
		authenticated:false
	})
	.when('/twitter/inactive/error',{
		templateUrl: "app/views/pages/users/login.html",
		controller:'twitterCtrl',
		controllerAs: 'twitter',
		authenticated:false
	})
	.when('/activate/:token',{
		//console.log('kkk');
		templateUrl: "app/views/pages/users/activation/activate.html",
		controller:'emailCtrl',
		controllerAs: 'email',
		authenticated:false
		
	})
	.when('/resend',{
		//console.log('kkk');
		templateUrl: "app/views/pages/users/activation/resend.html",
		controller:'resendCtrl',
		controllerAs: 'resend',
          authenticated:false
		
	})
	.when('/resetusername',{
		//console.log('kkk');
		templateUrl: "app/views/pages/users/reset/username.html",
		controller:'usernameCtrl',
		controllerAs: 'username',
		authenticated:false

		
	})
	.when('/resetpassword',{
		//console.log('kkk');
		templateUrl: "app/views/pages/users/reset/password.html",
		controller:'passwordCtrl',
		controllerAs: 'password',
      authenticated:false
		
	})
	.when('/reset/:token',{
		//console.log('kkk');
		templateUrl: "app/views/pages/users/reset/newpassword.html",
		controller:'resetCtrl',
		controllerAs: 'reset',
      authenticated:false
		
	})

	.otherwise({redirectTo:'/'});
});

app.run(['$rootScope','$location','Auth',function($rootScope,$location,Auth){

$rootScope.$on('$routeChangeStart',function(event,next,current){

if(next.$$route.authenticated==true){
	  if(!Auth.isLoggedIn()){
       event.preventDefault();
         $location.path('/');
	}

}

else if(next.$$route.authenticated==false){

	if(Auth.isLoggedIn()){
    event.preventDefault();
 $location.path('/profile');
	}

}
//console.log(Auth.isLoggedIn());
	//console.log(next.$$route.authenticated);
});
}]);
