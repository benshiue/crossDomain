function auth() {
        var endpoint = "https://oranwind.api-us1.com/admin/api.php?api_action=contact_add";
        var requestBody;
		var roleCode;
		var key = "d0cd3bb6342ab6aed210958a04a9b50c5455a06dc455222fec6d23d6c0808428114df34b";
		var api_action = "automation_contact_add";
		var api_output = "json";
		var contentType ="application/x-www-form-urlencoded; charset=utf-8";
		

        this.login = function(password) {
        	//console.log("USERNAME: " + $.cookie("USERNAME"));
		
		requestBody = {api_key: key, api_action: api_action, email: password, api_output: api_output};
		console.log("requestbody" + JSON.stringify(requestBody));
                $.ajax({
					type: 'Post',
					url: endpoint,
					crossDomain: true,
					dataType: "json",
					contentType:contentType,
					processData: false,
					data: JSON.stringify(requestBody),
					//console.log("requestbody" + requestBody);
					success: function(data) {
						alert("post success");
						window.location.href = "index.html";
				 	
                	},
        	        error: function() {
	//				alert("Login failed!!");
                        }
                });
        };
		
		this.logout = function() {
				var ticket = $.cookie('TICKET');
				console.log("logout ticket: " + ticket);
                $.ajax({
					type: 'Get',
					url: endpoint + "/logout?ticket=" + ticket,
					dataType: "json",
					processData: false,
					success: function(data) {
					 $.cookie("ROLECODE", -1);
						window.location.href = "login.html";
				 	
                	},
        	        error: function() {
//				alert("Login failed!!");
                        }
                });
        };
}
