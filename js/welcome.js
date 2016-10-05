//global reference to our firebase database root
var URL = 'https://burning-inferno-2190.firebaseio.com';
var ref = new Firebase(URL);
var usermail = "";//getUrlVars()['usermail'];
var userkey = "";//getUrlVars()['userkey'];



function getUrlVars(){
	var vars = {};
	var parts = window.location.href.replace(/[?&]+([^=&]+)=([^&]*)/gi, function(m,key,value) {
	vars[key] = value;
	});
	
	return vars;
}

function authCallback(authData){
				if (authData){
						console.log("User is logged in!"); 						
				}
				else {	
						console.log("User is not logged in!"); 
						window.location="login.html";
				}				
}
/*
/*** goto view.html ***
function gotoView(){
	
	userkey = getUrlVars()['userkey'];
	usermail = getUrlVars()['usermail'];
	
	var decode_email = decodeURIComponent(usermail);
	
	document.getElementById('userkey').value = userkey;
	document.getElementById('usermail').value = decode_email;
	
	document.getElementById("welcomeformid").action="list.html";
	document.getElementById("welcomeformid").submit();
	
}

/*** goto add.html ***
function gotoAdd(){
	userkey = getUrlVars()['userkey'];
	usermail = getUrlVars()['usermail'];
	
	var decode_email = decodeURIComponent(usermail);
	
	document.getElementById('userkey').value = userkey;
	document.getElementById('usermail').value = decode_email;
	
	document.getElementById("welcomeformid").action="add.html";
	document.getElementById("welcomeformid").submit();
	
}*/
	