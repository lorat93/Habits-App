//global reference to our firebase database root
var URL = 'https://burning-inferno-2190.firebaseio.com';
var ref = new Firebase(URL);

function newUser(){
	var username = document.getElementById("usermail").value;
	var pass = document.getElementById("password").value;

	insertIntoAuth(username, pass);
	mixpanel.track("User Registered");

}

/***** FUNCTION THAT INSERTS USER INFORMATION IN THE AUTHENTICATION DATABASE
	   WHICH IS USED BY FIREBASE'S BUILTIN LOGIN/VALIDATOR FUNCTIONS *****/
function insertIntoAuth(username, password){
		ref.createUser({
		email    :  username,
		password : password
		}, function(error, userData) {
			if (error) {
				switch (error.code) {
				  case "EMAIL_TAKEN":
					alert ("The user account is already in use!");
					console.log("The new user account cannot be created because the email is already in use.");
					break;
				  case "INVALID_EMAIL":
					alert ("Invalid email account!");
					console.log("The specified account is not a valid email.");
					break;
				  default:
					console.log("Error creating user:", error);
					
				}
				$('#usermail').val('');
				$('#password').val('');
				$('#userkey').val('');
			  } else {
				  
				console.log("Successfully created authentication account with uid:  ", userData.uid);
				insertUser(username, password)
				
			  }
		} ); 
}

/***** FUNCTION TO CREATE THE USER OBJ AND INSERT INTO DATABASE. THIS WILL NOT BE CALLED IF insertIntoAuth() fail
	   AS IT MEANS THE ENTRY WAS INVALID OR ALREADY EXISTING *****/
function insertUser(username, password){
	var userRef = ref.child("users");
	var habitRef=ref.child("habits");
	userRef.push({
		useremail : username,
		password : password,
		habitnum: 0 },
		function (error){
			if (error){
				alert ("ERROR CREATING USER ACCOUNT!!");
				console.log("ERROR CREATING USER ACCOUNT!!");
			}
			else {
				alert ("Successfully created user account! You may now log in.");
				console.log("CREATED USER ACCOUNT!!");
			}
			location.reload();
		});
}

/*****FUNCTION TO LOG IN USER *****/
function usrlogin() {
	
	var username = document.getElementById("usermail").value;
	var pass = document.getElementById("password").value;
	findUser(username);
	userAuth(username,pass);
	mixpanel.track("User Logged in");

}

/***** Function to see if the user object exists in the 'users' table and if it does,
		retrieves the unique key *****/
function findUser(username){
	
		userRef=ref.child("users");
		var userid = userRef.once('value', function(snapshot){
			
		//this snapshot has a copy of ALL user obj's key
		snapshot.forEach(function(childSnapshot){
			//object is a snap for of a user's attributes (without the KEY). childSnapshot contains KEY
	
			var key=childSnapshot.key();
			var object = childSnapshot.val();
			if (object.useremail == username){
			
				$('#userkey').val(key);

			}
			
		});
		});

}
		
/***** Function used for user login.
		NOTE: not in use currently, there is a bug of browser redirecting the page
		      as this script is being executed...due to this, the authWithPassword() 
			  doesn't work as it's supposed to *****/
function userAuth(username, password){

	ref.authWithPassword({
	  "email": username,
	  "password": password
	}, function(error, authData) {
	  if (error) {
		console.log("Login Failed!", error);
		alert("Login Failed!"+ error);
		$('#usermail').val('');
		$('#password').val('');
	  } else {
		  console.log("Authenticated successfully with payload:", authData);
		  ref.onAuth(authCallback);

	}}, {   remember: "sessionOnly"});
	
}

function authCallback(authData){
		if (authData){
				console.log("User is logged in!"); 
				document.getElementById("loginformid").submit();
		}
		else {	
				console.log("User is not logged in!"); 

				location.reload();
		}
		
}


	
