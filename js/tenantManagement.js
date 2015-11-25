function tenantManagement(){
	var token = $.cookie('TICKET');
	//var token = "563a1eae72a8ba03568e4879";
	var endpoint = "http://140.92.27.79";
	
	this.listTenants = function(field,order,priority,pnum,pindex) {
		var url = endpoint + "/spe/services/user/v1/list?num_per_page=" + pnum +"&page_no=" + pindex;
		var data = '{"sort": [ { "field":"' + field +'", "order":' + order +', "priority":'+ priority +' } ]}';
		var more = false;
		//console.log("list data: " + data);
		$.ajax({
			type : "POST",
			url : url,
			headers : {
				"Authorization" : token
			},
			data : data,
			dataType : "json",
			processData : false,
			async: false,
			success : function(json) {
				
				var tenants = json.users;
				var NumOfData = tenants.length;
				
				for (var i = 0; i < NumOfData; i++) {
					var userName = tenants[i]["username"];
					var email = tenants[i]["email"];
					var role = tenants[i]["role"];
					var createdTime = tenants[i]["created_time"];
					var lastLogin = tenants[i]["last_login"];
					var instanceNum = tenants[i]["inum"];
					var lastActive = tenants[i]["last_activity"];
					var lastActivityString = "";
					
					//setting the generated day
					var gene_days = _generatedDays(createdTime);
					
					//process last activity
					//lastActivityString = _lastActivityHandler(lastActive);
					
					$(".list-groups").append(_renderList(userName,gene_days,instanceNum,lastActivityString));
					$('[data-toggle="tooltip"]').tooltip(); 
					
					//check whether next page is exists or not
					var nextpage = pindex+1;
					url = endpoint + "/spe/services/user/v1/list?num_per_page=" + pnum +"&page_no=" + nextpage;
					$.ajax({
						type : "POST",
						url : url,
						headers : {
							"Authorization" : token
						},
						data : data,
						dataType : "json",
						processData : false,
						async: false,
						success : function(json) {
							
							var NumOfData = 0;
							var tenants = json.users;
							NumOfData = tenants.length;
							
							//means there are another tenants exist
							if(NumOfData > 0)
								more = true;
						},
						error : function(jqXHR,textSatus,thrownError) {
							if(jqXHR.status == 401)
								_redirectToLoginPage();
						}
					});
				}
				
			},
			error : function(jqXHR,textSatus,thrownError) {
				if(jqXHR.status == 401)
					_redirectToLoginPage();
			}
		});
		
		return more;
	}
	
	this.createTenant = function(account,role,password) {
		var url = endpoint + "/spe/services/user/v1/create";
		var data = "{\"username\":" + account + "," +
					"\"password\":" + password + "," +
					"\"email\":" + account + "," +
					"\"role\":" + role + "}";
			//console.log("(inside)username: " + account + "password: " + password +"email: " + account +"role: " + role );
		$.ajax({
			type : "POST",
			url : url,
			headers : {
				"Authorization" : token
			},
			data : data,
			dataType : "json",
			processData : false,
			async: false,
			success : function(json) {
				
				$(".bottom_dialog").removeClass('show_dialog');
				$("body").removeClass("showEditor");
				 location.reload();
			},
			error : function(jqXHR,textSatus,thrownError) {
				if(jqXHR.status == 401)
					_redirectToLoginPage();
			}
		});
		
	}
	
	this.deleteTenant = function(tenants) {
		var url = endpoint + "/spe/services/user/v1/delete";
		var data = {};
		data["users"] = tenants;
		var data2 = 	JSON.stringify(data);
		console.log(data2);
		$.ajax({
			type : "DELETE",
			url : url,
			headers : {
				"Authorization" : token
			},
			data : data2,
			dataType : "json",
			processData : false,
			async: false,
			success : function(json) {
				
				$(".bottom_dialog").removeClass('show_dialog');
				$("body").removeClass("showEditor");
				 location.reload();
			},
			error : function(jqXHR,textSatus,thrownError) {
				if(jqXHR.status == 401)
					_redirectToLoginPage();
			}
		});
		
	}

	this.editProfile = function(account,email,password,role) {
		var url = endpoint + "/spe/services/user/v1/update";
		var data = "{\"username\":" + account + ",";
		//console.log("account: " + account + " email: " + email + " password: " + password + " role: " + role);
		if (email.trim()) {
			data += "\"email\":" + email + ",";
		}
		if (password.trim()) {
			data += "\"password\":" + password + ",";
		}
		if (role.trim()) {
			data += "\"role\":" + role + ",";
		}
		data += "}";
			//console.log("update data: " + data);
		$.ajax({
			type : "POST",
			url : url,
			headers : {
				"Authorization" : token
			},
			data : data,
			dataType : "json",
			processData : false,
			async: false,
			success : function(json) {
				
				$(".bottom_dialog").removeClass('show_dialog');
				$("body").removeClass("showEditor");
				 location.reload();
			},
			error : function(jqXHR,textSatus,thrownError) {
				if(jqXHR.status == 401)
					_redirectToLoginPage();
			}
		});
		
	}
	
	this.getTenant = function(account) {
		var url = endpoint + "/spe/services/user/v1/get?username=" + account;
		var resp = new Object();
		
		$.ajax({
			type : "GET",
			url : url,
			headers : {
				"Authorization" : token
			},
			dataType : "json",
			processData : false,
			async: false,
			success : function(json) {
				
				resp = json;
			},
			error : function(jqXHR,textSatus,thrownError) {
				if(jqXHR.status == 401)
					_redirectToLoginPage();
			}
		});
		
		return resp;
	}
	
	//X days ago
	function _generatedDays(create_time){
		var date = new Date();
		var nowSeconds = Math.floor(date / 1000);
		//console.log("now seconds: " + nowSeconds);
		var gene_days = Math.floor((nowSeconds - create_time) / 86400);
		//console.log("generated days : " + gene_days);
		
		return gene_days;
	}
	
	//yyyy/mm/dd
	function _formalDate(time){
		var localTime = "";
		if (time == "undefined" || time == undefined) {
			localTime = "None";
		}else{
			var date = new Date(time*1000);
			localTime = date.toLocaleDateString();
		}
		return localTime;
	}
	
	function _renderList(account,gene_time,inst_num,login_activity){
		
		var string = "";
		var gene_string = "";
		
		if(gene_time == 0 ){
			gene_string = "Generated less than 1 day";
		}else{
			gene_string = "Generated " + gene_time + " days ago";
		}
		
		string += "<div class=\"list-group\">";
		string +=  "<div class=\"list-group-item row\">";
		string += "<div class=\"col-md-6\">";
		string += "<div class=\"checkbox\">";
		string += "<label>";
		string += "<input type=\"checkbox\" value=\"" + account + "\">";
		string += "<div class=\"account\"> " + account + " </div>";
		string += "<div class=\"gene_time\">" + gene_string + "</div>";
		string += "</label>";
		string += "</div>";
		string += "</div>";
		string += "<div class=\"col-md-4\">";
		string += "<a class=\"item_opera r_cluster\">";
		string += "<span data-toggle=\"tooltip\" data-placement=\"top\" title=\"Running Instance(s)\"><span>Running<br>Instance(s):</span>" + inst_num + "</span>";
		string += "</a>";
		string += "<a class=\"item_opera btn_password\" value=\""+ account +"\">";
		string += "<span class=\"glyphicon glyphicon-lock\" data-toggle=\"tooltip\" data-placement=\"top\" title=\"Password\" data-toggle=\"modal\" data-target=\"#passwordTenant\"></span>";
		string += "</a>";
		string += "<a class=\"item_opera btn_edit\" value=\""+ account +"\">";
		string += "<span class=\"glyphicon glyphicon-edit\" id=\"\" data-toggle=\"tooltip\" data-placement=\"top\" title=\"Edit\" ></span>";
		string += "</a>";
		string += "<a class=\"item_opera btn_delete\" value=\""+ account +"\">";
		string += "<span class=\"glyphicon glyphicon-trash\" data-toggle=\"tooltip\" data-placement=\"top\" title=\"Delete\"></span>";
		string += "</a>";
		string += "</div>";
		//string += "<div class=\"col-md-2\">";
		//string += "<div class=\"last_activity\">" + login_activity;
		//string += "</div>";
		//string += "</div>";
		string += "</div>";
		string += "</div>";
		
		return string;
	}
	
	function _lastActivityHandler(lastActivityObject){
		//means no actions before
		if(lastActivityObject.length == 0)
			return "None";
		var lastActivity = lastActivityObject[0];
		var lastAction = lastActivity.action;
		var lastActionTime = lastActivity.time;
		var returnString = "";
		
		if(lastAction == "login" || lastAction == "logout"){
			returnString += "Last " + lastAction + ":<br>";
			returnString += _formalDate(lastActionTime);
		}else if(lastAction == "terminate" || lastAction == "subscribe"){
			//capitalize first letter
			lastAction = lastAction.charAt(0).toUpperCase() + lastAction.slice(1);
			returnString += lastAction + " a Instance:<br>";
			var gene_time = _generatedDays(lastActionTime);
			
			if(gene_time == 0 ){
				returnString += "less than a day";
			}else{
				returnString += gene_time + " days ago";
			}
		
		}
		
		return returnString;
	}
	
	function _redirectToLoginPage(){
		window.location.href = "login.html";
	}
	
}