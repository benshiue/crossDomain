$(function() {
	auth = new auth();
	$("#login").click(function() {
		var name= $.cookie("USERNAME", $('#loing_account').val());
		auth.login($('#login_password').val());
	});
	
	//add a new validator method
	$.validator.addMethod("passwordcheck", function(value, element) {
		var rule = /^[a-zA-Z0-9]+$/g;
		//return value.match(rule);
		return rule.test(value);
	},"Please enter A-Z, a-z, 0-9 only.");
	
	$("#login_form").validate({
		rules:{
			
			account_validate:{
				required: true,
				email: true
			},
			password_validate:{
				required: true,
				email: true
			
			}	
		},
		messages: {
	
			account_validate:{
				
			},
			password_validate:{
				maxlength: "Please enter no more than 20 characters.",
				minlength: "Please enter at least 4 characters.",
				passwordcheck: "Please enter A-Z, a-z, 0-9 only."
			}
		}
		//errorLabelContainer : $(".form-control-static")
		
	});
	
	$("body").bind('keydown',function(e){
		var keycode = e.which;
		//console.log("keycode: " + keycode);
		if(keycode == 13){
			auth.login($('#login_password').val());
		}
	});
	
});
