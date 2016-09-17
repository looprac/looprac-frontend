var apiConst = "http://loopracapi.mathematician.engineer"

function isEmpty(str) {
    return (str === undefined || !str || 0 === str.length || /^\s*$/.test(str));
}

function inputValidation(name, service, message) {
	var value = $(name).find(':input').val();
	if(isEmpty(value)) {
		$(name).addClass('has-error');
		$('#' + service + 'Warning').html(message).removeClass('hide')
		$(name).find(':input').on('change', function() {
			$(name).removeClass('has-error');
			$('#' + service + 'Warning').addClass('hide');
		})
		return false;
	}
	return true;
}

function loginInterface(message) {
	$('#loginMessage').html(message);
	$('#loginSubmit').on('click', function() {
		if(!inputValidation('#userEmail', 'login', "User Email is required.")) {
			return;
		}

		if(!inputValidation('#userPassword', 'login', "User password is required.")) {
			return;
		}

		login($('#userEmail').find(':input').val(), $('#userPassword').find(':input').val())
	})
}

function login(userEmail, password) {
	console.log(userEmail, password);
	$.ajax({
    type:     "post",
    data:     { email: userEmail,
    						password: password },
    cache:    false,
    url:      apiConst + "/auth_user",
    dataType: "application/json",
    error: function (xhr, status, error) {
    	$('#loginWarning').text(error).show()
    },
    success: function (data, status) {
			if(status === 200) {
				$("#loginWarning").hide();
				$('#loginInterface').addClass('fade');
			} else {
				$('#loginWarning').text(data['errors'][0]).show()
			}
    }
});
}