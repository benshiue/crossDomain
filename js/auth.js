function auth() {
        var endpoint = "https://api2.autopilothq.com/v1/contact";
        var requestBody;
		var roleCode;
		var key = "d0cd3bb6342ab6aed210958a04a9b50c5455a06dc455222fec6d23d6c0808428114df34b";
		var api_action = "automation_contact_add";
		var api_output = "json";
		var contentType ="application/json";
		

        this.login = function(password) {
        	//console.log("USERNAME: " + $.cookie("USERNAME"));
		
		requestBody = {"contact":{FirstName: key, LastName: api_action, Email: password}};
		console.log("requestbody" + JSON.stringify(requestBody));
                $.ajax({
					url: endpoint,
					headers: {
				        'Access-Control-Allow-Origin':'*',
				        'autopilotapikey':'4ab0f5292e5848e3902eab0d8e302804',
				        'Content-Type':'application/json'
				    },
					type: 'POST',
					dataType: "json",
					crossDomain: true,
					contentType:contentType,
					//processData: false,
					data: JSON.stringify(requestBody),
					//console.log(data);
					//console.log("requestbody" + requestBody);
					success: function(data) {
						alert("post success");
						window.location.href = "index.html";
				 	
                	},
        	        error: function() {
	//				alert("Login failed!!");
					alert("test");
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
