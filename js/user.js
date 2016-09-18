var apiConst = "http://loopracapi.mathematician.engineer"
var guest = true;
var userInfo = {}

$('#loginBtn').on('click', function() {
	loginInterface("If you already have an account, login here");
})

$('#signupBtn').on('click', signupInterface)
$('#logoutBtn').on('click', logoutInterface)

$('#search').on('click', function() {
	if(guest && !passenger) {
		loginInterface("You need to login to try further functionality. If you don't have an account yet, please <a onClick='signupInterface'>sign up</a> at first.")
	$('#popupInterface').modal('show')
	}
})

function checkLogin() {
	if(guest) {
		return false;
	}
	if(!checkCookie("auth_token")) {
		setFooterMessage("Sorry, you need to login again");
		logout();
	}
}

function isEmpty(str) {
    return (str === undefined || !str || 0 === str.length || /^\s*$/.test(str));
}

function setFooterMessage(message) {
	var footer = $('#footer')
	footer.fadeOut().html(message).fadeIn();
	setTimeout(function() {
		footer.fadeOut();
	}, 5000);
}

function inputValidation(name, message, checkFunction) {
	var value = $(name).find(':input').val();
	if(isEmpty(value) || (checkFunction !== undefined && checkFunction !== null && !checkFunction(value))) {
		$(name).addClass('has-error');
		$('#popupWarning').html(message).removeClass('hide')
		$(name).find(':input').on('change', function() {
			$(name).removeClass('has-error');
			$('#popupWarning').addClass('hide');
		})
		return false;
	}
	return true;
}

function loginInterface(message) {
	$('#popupTitle').html('Login');
	$('#popupMessage').html(message);
	$('#userEmail').removeClass('hide');
	$('#userPassword').removeClass('hide');
	$('#userPassword2').addClass('hide');
	$('#popupForm').removeClass('hide');
	$('#popupAction').html("Login");
	$('#popupAction').off('click');
	$('#popupAction').on('click', function() {
		if(!inputValidation('#userEmail', "User Email is required.")) {
			return;
		}

		if(!inputValidation('#userPassword', "User password is required.")) {
			return;
		}

		login($('#userEmail').find(':input').val(), $('#userPassword').find(':input').val())
	})
}

function signupInterface() {
	$('#popupTitle').html('Sign up');
	$('#popupMessage').html('Welcome, you only need your email address to join us');
	$('#userEmail').removeClass('hide');
	$('#userPassword').removeClass('hide');
	$('#userPassword2').removeClass('hide');
	$('#popupForm').removeClass('hide');
	$('#popupAction').html("Sign up");
	$('#popupAction').off('click');
	$('#popupAction').on('click', function() {
		if(!inputValidation('#userEmail', "User Email is required.")) {
			return;
		}
		if(!inputValidation('#userPassword', "User password with at least 8 characters is required.", function(pass) {
			return pass.length >= 8;
		})) {
			return;
		}
		if(!inputValidation('#userPassword2', "You have to type your passpord again", function(pass2) {
			console.log(pass2, $('#userPassword').find(':input').val())
			return pass2 === $('#userPassword').find(':input').val();
		})) {
			return;
		}
		signup($('#userEmail').find(':input').val(), $('#userPassword').find(':input').val())
	})

}

function logoutInterface() {
	$('#popupTitle').html('Log out');
	$('#popupMessage').html('Are you sure you want to log out?');
	$('#popupForm').addClass('hide');
	$('#popupAction').html("Confirm");
	$('#popupAction').off('click');
	$('#popupAction').on('click', logout)
}

function login(userEmail, password) {
	console.log(userEmail, password);
	$.ajax({
    type:     "post",
    crossDomain: true,
    data:     {email: userEmail,
    					 password: password },
    cache:    false,
    url:      apiConst + "/login",
    dataType: "json"
  }).always(function(response, statusText, XHR) {
  	var status = response.status;
  	if(statusText === "success") {
  		status = 200;
 		}
    switch(status) {
   		case 200:
   			data = response;
				$("#popupWarning").addClass('hide');
				$('#popupInterface').modal('hide');
				$('.guestMod').addClass('hide');
				$('.userMod').removeClass('hide');
				userInfo = data.user;
				setCookie("authtoken", "12", 15)
				guest = false;
				setFooterMessage("Welcome back <b>" + userEmail + "</b>.")
				break;
			case 401:
 				var data = JSON.parse(response.responseText)
   			$('#popupWarning').text(data.errors[0]).removeClass('hide')
    		break;
    	default:
    		$('#popupWarning').text("Sorry, something get wrong, please try again later").removeClass('hide')
   	}
  })
}

function signup(userEmail, password) {
	console.log(userEmail, password);
	$.ajax({
    type:     "post",
    crossDomain: true,
    data:     {email: userEmail,
    					 password: password },
    cache:    false,
    url:      apiConst + "/signup",
    dataType: "json",
    error: function (xhr, status, error) {
    	$('#popupWarning').text(error).show()
    },
    success: function (data) {
			$("#popupWarning").addClass('hide');
			loginInterface("Now you can login using your new account");
			setFooterMessage("Successfully create account <b>" + userEmail + "</b>.")
    }
  }); 
}

function logout() {
	console.log("user active log out");
	guest = true;
	userInfo = {};
	setFooterMessage("You have logged out Looprac");
	$('.guestMod').removeClass('hide');
	$('.userMod').addClass('hide');
	guest = true;
	$('#popupInterface').modal('hide');
}

function createCORSRequest(method, url, callback, json) {
  var xhr = new XMLHttpRequest();
  if ("withCredentials" in xhr) {
    xhr.open(method, url, true);
  	xhr.onreadystatechange = function() { 
      callback(xhr.responseText, xhr.status);
  	}
    xhr.send(JSON.stringify(json));
  } else if (typeof XDomainRequest != "undefined") {
    xhr = new XDomainRequest();
    xhr.open(method, url);
  } else {
    xhr = null;
  }
  return xhr;
}