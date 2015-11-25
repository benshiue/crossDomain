$(function() {
	var token = $.cookie('TICKET');
	var username = $.cookie('USERNAME');
	var role_code= $.cookie('ROLECODE');
	//console.log(token);
	//console.log(username);
	var endpoint = "http://140.92.27.79";
	var upperBound,lowerBound = 0;
	var unit, timeUnit;
	var timeUpBound, timeLowBound = 0;
	var systemperiod=15;
	var order=1;
	var priority=1;
	var sort_rule="iname";
	var max_length=10;
	//var count_delete=0;
	var delete_iname = new Array();
	var edit_old_iname = new Array();
	var enter_event = "";
	var num_per_page =10;
	var page_no = 1;





	instance_panel = new instance_panel();
	auth = new auth();
	list_instance(sort_rule);




     				function list_instance(sort_rule){
     					console.log("role_code: "+role_code);

     					if( role_code==0 ){
     						var url = endpoint + "/spe/services/instance/v1/list?num_per_page=50&page_no=1";
     					}else{
     						var url = endpoint + "/spe/services/instance/v1/list?num_per_page="+num_per_page+"&page_no="+page_no+"&username=" +username;
     					}
						
						var data = '{"sort": [ { "field":' + sort_rule +', "order":' + order +', "priority":'+ priority +' } ]}';

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

									var instances = json.instances
									var list_number = instances.length;
									check_More_Btn(list_number);
									//console.log(list_number);

									
									for (var i = 0; i < list_number; i++) {
										var iname = instances[i]["iname"];
										var username = instances[i]["username"];
										var hue_ip = instances[i]["hue_ip"];
										var ambari_ip = instances[i]["ambari_ip"];
										var iname_hash = instances[i]["iname_hash"];
										var cnum = instances[i]["cnum"];
										var create_t=instances[i]["created_time"];
										var gene_days = _generatedDays(create_t);
			
										var date = new Date(create_t*1000);
										instance_time = date.toLocaleDateString();						
										
										$(".list-groups").append(_renderList(iname,gene_days,cnum,hue_ip,instance_time,username));
										$('[data-toggle="tooltip"]').tooltip(); 
									}
									
								},
								error : function(jqXHR,textSatus,thrownError) {
										if(jqXHR.status == 401)
											redirectToLoginPage();									
								}
								
							});
					
	
     				}

     				function check_More_Btn(list_number){
						if(list_number){
							console.log("=================ya=============");
							$("#more_list").removeClass("disabled");
							$("#more_list").on("click.disabled",false);
						}else{
							$("#more_list").addClass("disabled");
							$("#more_list").off("click.disabled");
						}
					}




					 function _generatedDays(create_t){
					                                var date = new Date();
					                                var nowSeconds = Math.floor(date / 1000);
					                                //console.log("now seconds: " + nowSeconds);
					                                var gene_days = Math.floor((nowSeconds - create_t) / 86400);
					                                //console.log("generated days : " + gene_days);
					                                
					                                return gene_days;
					                        }


				create_Instance = function(input_iname,input_num) {
					var url = endpoint + "/spe/services/instance/v1/create";
					var data = "{\"iname\":\"" + input_iname + "\"," +
								"\"cnum\":" + input_num + "," +
								"\"username\":\"" + username + "\"}";

					$(".list-groups").append(_render_fake_List(input_iname,input_num));
					//$('[data-toggle="tooltip"]').tooltip();
					
					$.ajax({
						type : "POST",
						url : url,
						headers : {
							"Authorization" : token
						},
						data : data,
						dataType : "json",
						//processData : false,
						//async: false,
						success : function(json) {
							
							//$(".bottom_dialog").removeClass('show_dialog');
							//$("body").removeClass("showEditor");
							location.reload();
						},
						error : function(jqXHR,textSatus,thrownError) {
										if(jqXHR.status == 401)
											redirectToLoginPage();									
								}
					});
		
				}




						

					deleteInstance = function(instances) {

							var url = endpoint + "/spe/services/instance/v1/delete";
							var data = {};
							if (role_code==0){

							}else{
								requestBody = {instances,username: $.cookie("USERNAME")};
							}

							var data2 = JSON.stringify(requestBody);
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
											redirectToLoginPage();									
								}
							});
							
						}


					edit_Instance = function(old_iname,new_iname) {
						console.log("old_iname: "+old_iname+"  /new_iname: "+new_iname);
						
					var url = endpoint + "/spe/services/instance/v1/update";
					var data = "{\"iname\":" + old_iname + "," +
								"\"new_iname\":" + new_iname + "," +
								"\"username\":" + username + "}";
					
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
								 //console.log(json.statuscode);
							},
							error : function(jqXHR,textSatus,thrownError) {
										if(jqXHR.status == 401)
											redirectToLoginPage();									
								}
						});
		
					}



		                function show_Delete(){
	            
							if($('input:checkbox:checked').length == 0){

									if (delete_iname.length > 0)
									{
									delete_iname.pop();
									delete_iname.push($(this).attr('value'));
									//console.log("====multi====="+delete_iname);
									}else{
									delete_iname.push($(this).attr('value'));
									//console.log("====single====="+delete_iname);
									}

							}else{
								$(".checkbox").each(function(i){
									
									var check_all_id = $(this).find("input[type=checkbox]").attr('id');
									//delete_iname.pop();
									// no check-all delete
									if (check_all_id!="checkall"){
										if($(this).find("input[type=checkbox]").prop('checked')){

											delete_iname.push($(this).find("input[type=checkbox]").val());
											console.log("====checkbox delete====="+delete_iname);
										}
									}	

								});
								
								}

								showDialog();
								$("#deleteInstance").addClass('show_dialog');

						}





						//delete button
						$("#delete_instance_ok_btn").click(function(){
						deleteInstance(delete_iname);
						});


						function show_Edit(){
								edit_old_iname.pop();
								edit_old_iname.push($(this).attr('value'));
								showDialog();
								$("#edit_Instance").addClass('show_dialog');
								$("#edit_new_iname").attr("placeholder", edit_old_iname);
								enter_event="edit";
						}
 

						
					function _actionIcon(){

						var itemRow = $(".item_opera");
						var multi_delete_Btn = $("#header_delete_btn");
						var numberOfChecked = $('input:checkbox:checked').length;

 


						if (numberOfChecked >0) {
							console.log("select ="+numberOfChecked);
							itemRow.each(function(i){	
							itemRow.addClass("disabled");
							});
							multi_delete_Btn.removeClass("disabled");
							removeDialog();
							_disable_Icons_click();
							multi_delete_Btn.bind("click",show_Delete);
						}else if (numberOfChecked == 0) {
							console.log("select ="+numberOfChecked);
							multi_delete_Btn.addClass("disabled");
							removeDialog();
							_enable_Icons_click();
							itemRow.each(function(i){	
							itemRow.removeClass("disabled");
							});
							
						}

					}

						function _disable_Icons_click(){
							$(".btn_edit").unbind("click");
							$(".btn_delete").unbind("click");
							$(".btn_more").unbind("click");

						}
						
						function _enable_Icons_click(){
						
							$(".btn_edit").bind("click",show_Edit);
							$(".btn_delete").bind("click",show_Delete);
							$(".btn_more").bind("click",show_More);
						}

						$(".btn_edit").click(function(){
		                    showDialog();
		                    $("#edit_Instance").addClass('show_dialog');
		                });




		                          
   






					function _render_fake_List(iname,cnum){
		
								var string = "";
								var substring = "";
								
								if (iname.length > 10){
									substring = iname.substring(0,max_length);
									substring += "...";
								}else{
									substring=iname;
								}
								
								
								string += "<div class=\"list-group\">";
								string += "<div class=\"list-group-item row\">";
								string += "<div class=\"col-md-6\">";
								string += "<div class=\"checkbox\" id=\"list_checkbox\">";
								string += "<label>";
								string += "<input type=\"checkbox\" value=\"" + iname + "\">";
								string += "<div class=\"instance\"> " + substring + " </div>";
								string += "<div class=\"gene_time\">Creating...</div>";
								string += "</label>";
								string += "</div>";
								string += "</div>";
								string += "<div class=\"col-md-6\">";
								string += "<a class=\"item_opera instance r_cluster\">";
								string += "<span data-toggle=\"tooltip\" data-placement=\"top\"><span>Running  <br>Nodes: </span>"+"  "+ cnum + " </span>";
								string += "</a>";
                                string += "<div class=\"entry_info\"><div class=\"entry_ip\">Creating...<br></div>"+"Development Entry"+"</div>";
								string += "<a class=\"item_opera instance\" data-toggle=\"modal\" data-target=\"#passwordModal\">";
								string += "<span class=\"glyphicon glyphicon-pause\" data-toggle=\"tooltip\" data-placement=\"top\" title=\"Pause\" data-toggle=\"modal\"></span>";
								string += "</a>";
								string += "<a class=\"item_opera instance btn_edit\" >";
								string += "<span class=\"glyphicon glyphicon-edit\" id=\"\" data-toggle=\"tooltip\" data-placement=\"top\" title=\"Edit\" ></span>";
								string += "</a>";
								string += "<a class=\"item_opera instance btn_more\" >";
								string += "<span class=\"glyphicon glyphicon-option-horizontal\" data-toggle=\"tooltip\" data-placement=\"top\" title=\"More\"></span></a>";
								string += "<a class=\"item_opera instance btn_delete\" >";
								string += "<span class=\"glyphicon glyphicon-trash\" data-toggle=\"tooltip\" data-placement=\"top\" title=\"Delete\"></span>";
								string += "</a>";
								string += "</div>";
								string += "</div>";
								string += "</div>";
								
								return string;
					}




					function _renderList(iname,gene_days,cnum,hue_ip,instance_time,username){
		
								var string = "";
								var gene_string = "";
								var substring = "";

								
								if(gene_days == 0 ){
									gene_string = "Generated less than 1 day.";
								}else{
									gene_string = "Generated " + gene_days + " days ago.";
								}
								
								if (iname.length > 10){
									substring = iname.substring(0,max_length);
									substring += "...";
								}else{
									substring=iname;
								}
								

								string += "<div class=\"list-group\">";
								string += "<div class=\"list-group-item row\">";
								string += "<div class=\"col-md-6\">";
								string += "<div class=\"checkbox\" id=\"list_checkbox\">";
								string += "<label>";
								string += "<input type=\"checkbox\" value=\"" + iname + "\">";
								string += "<div class=\"instance\"> " + substring + " </div>";
								string += "<div class=\"gene_time\">" + gene_string + "</div>";
								string += "</label>";
								string += "</div>";
								string += "</div>";
								string += "<div class=\"col-md-6\">";
								string += "<a class=\"item_opera instance r_cluster\">";
								string += "<span data-toggle=\"tooltip\" data-placement=\"top\"><span>Running  <br>Nodes: </span>"+"  "+  cnum + " </span>";
								string += "</a>";
                                string += "<div class=\"entry_info\"><div class=\"entry_ip\">"+hue_ip+"<br></div>"+"Development Entry"+"</div>";

								string += "<a class=\"item_opera instance\">";
								string += "<span class=\"glyphicon glyphicon-pause\" data-toggle=\"tooltip\" data-placement=\"top\" title=\"Pause\" data-toggle=\"modal\"></span>";
								string += "</a>";
								string += "<a class=\"item_opera instance btn_edit\" value=\""+ iname +"\">";
								string += "<span class=\"glyphicon glyphicon-edit\" id=\"\" data-toggle=\"tooltip\" data-placement=\"top\" title=\"Edit\" ></span>";
								string += "</a>";
								string += "<a class=\"item_opera instance btn_more\" value=\""+ iname +"\">";
								string += "<span class=\"glyphicon glyphicon-option-horizontal\" data-toggle=\"tooltip\" data-placement=\"top\" title=\"More\" value=\""+username+"\"></span></a>";

								string += "<a class=\"item_opera instance btn_delete\" value=\""+ iname +"\">";
								string += "<span class=\"glyphicon glyphicon-trash\" data-toggle=\"tooltip\" data-placement=\"top\" title=\"Delete\"></span>";
								string += "</a>";

								string += "</div>";
								string += "</div>";
								string += "</div>";
								
								return string;
					}



		var create_validator = $("#create_instance_form").validate({
				rules:{
					input_iname:{
						required: true,
						maxlength: 20,
						minlength: 4,
						//inamecheck: true
					},
					input_num:{
						number: true,
						digits: true,
						required: true,
						max: 999,
						min: 1,
						//inumcheck: true					
					}
				},
				messages: {
					danger_input_iname:{
						maxlength: "Please enter no more than 20 characters.",
						minlength: "Please enter at least 4 characters.",
						inamecheck: "Please enter a-z, 0-9 only."
					},
					danger_input_num:{
						//maxlength: "Please enter no more than 999.",
						//minlength: "Please enter at least 1.",
						inumcheck: "Please enter 0-9 only."	
					}
				},

				//errorLabelContainer : $(".form-control-static")
				errorPlacement: function(error, element) {
					if (element.attr("name") === "input_iname" )
						error.appendTo("#danger_input_iname");
					else if (element.attr("name") === "input_num" )
						error.appendTo("#danger_input_num");
				}
				
			});



				var edit_validator = $("#edit_instance_form").validate({
					rules:{
						input_edit_iname:{
							required: true,
							maxlength: 20,
							minlength: 4,
							//inamecheck: true
						}
					},
					messages: {
						danger_input_iname:{
							maxlength: "Please enter no more than 20 characters.",
							minlength: "Please enter at least 4 characters.",
							inamecheck: "Please enter a-z, 0-9 only."
						}
					},

					//errorLabelContainer : $(".form-control-static")
					errorPlacement: function(error, element) {
						if (element.attr("name") === "input_edit_iname" )
							error.appendTo("#danger_edit_name");
					}
					
				});




				

				function showDialog(){
						$(".bottom_dialog").removeClass('show_dialog');
						$("body").addClass("showEditor");
							}
				function removeDialog(){
						$(".bottom_dialog").removeClass('show_dialog');
						$("body").removeClass("showEditor");
							}


				$("body").bind('keydown',function(e){
					var keycode = e.which;
					console.log("keycode: " + keycode);
					if(keycode == 27){
						//press escape
						$(".bottom_dialog_close_btn").click();
					}else if(keycode == 13){
						console.log("keycode: " + keycode);
						if(enter_event=="create"){
							console.log("create");
							$("#create_instance_btn").click();
						}else if(enter_event=="edit"){
							console.log("edit");
							$("#edit_instance_ok_btn").click();
						}

						}
				});


				$("#dropdown_sort_by_date").click(function(){
					//console.log("dropdown_sort_by_date");
					sort_rule="created_time";
					$(".list-groups").empty();
					list_instance(sort_rule);
				});

				$("#dropdown_sort_by_name").click(function(){
					sort_rule="iname";
					$(".list-groups").empty();
					list_instance(sort_rule);
				});

				$("#dropdown_sort_by_node_number").click(function(){
					sort_rule="cnum";
					$(".list-groups").empty();
					list_instance(sort_rule);
				});


         
			  	//select all
			  	
				$("#checkall").click(function () {
						//$("input:checkbox").prop('checked', $(this).prop("checked"));
						var checkboxes = $(".list-groups").find(":checkbox");
						console.log("checkboxes: "+checkboxes);
						if($(this).is(':checked')) {
							checkboxes.prop('checked', true);
						} else {
							checkboxes.prop('checked', false);
						}
						
						_actionIcon();
					});

   


				//select single checkbox 
			    $(".checkbox").click(function(e){
					_actionIcon();
				});
    


                //create instance OK
	       		$("#create_instance_btn").click(function(){

	       				var iname = $("#input_iname").val();
	       				var inum = $("#number_input").val();

	       				var iname_regex = /^[a-z0-9]*$/;
	       				var inum_regex = /^[0-9]*$/;
	 
						if (iname!="" && iname.length<21 && iname.length>3 && iname.match(iname_regex)){
							if (inum!="" && inum.length<1000 && inum.length>0 && inum.match(inum_regex)){
								create_Instance(iname,inum);
                  				removeDialog();
							}else{
								//$("#danger_input_inum").append("Please enter a-z, 0-9 only.");
							}

						}else{
						  //$("#danger_input_iname").append("Please enter a-z, 0-9 only.");
						}                        
	
				});

				$("#cancel_instance_btn").click(function(){
					$(".form-control").val("");
					create_validator.resetForm();
					removeDialog();
					
				});

				$("#clear_instance_btn").click(function(){
					$(".form-control").val("");
					create_validator.resetForm();
					
				});





				//Edit instance OK
				$("#edit_instance_ok_btn").click(function(){

						var iname = $("#edit_new_iname").val();
	       				var iname_regex = /^[a-z0-9]*$/;
	       				
						if (iname!="" && iname.length<21 && iname.length>3 && iname.match(iname_regex)){
							    edit_Instance(edit_old_iname,iname);	
								removeDialog();
						}               
					
					
				});


				//edit cancel btn
				$("#cancel_edit_instance_btn").click(function(){
					$(".form-control").val("");
					edit_validator.resetForm();
					removeDialog();			
				});

				//Header create btn
				$(".btn_create").click(function(){
                    showDialog();
                    $("#createInstance").addClass('show_dialog');            
                    $("#number_input").val("3");
                    enter_event="create";
                });


                $(".bottom_dialog_close_btn").click(function(){
                	$(".form-control").val("");
                	create_validator.resetForm();
                	edit_validator.resetForm();
                    removeDialog();
                });

				$("#logout").click(function(){
					auth.logout();
				});

				$("#more_list").click(function(){
					page_no++;
					list_instance(sort_rule);
				});


				// directly click delete_btn, get the value of btn_delete_
				$(".btn_delete").click(show_Delete);


				$(".btn_edit").click(show_Edit); 

				// directly click more
				$(".btn_more").click(show_More);

				$(".number_input").TouchSpin({
                  verticalbuttons: true
                });

				//Description and Monitor
				function show_More(){
					var more_iname = new Array();
					more_iname.push($(this).attr('value'));
					//console.log("====沒選====="+more_iname);
					instance_panel.monitor_defalut(more_iname);
				}
				//401 direct to login page
				function redirectToLoginPage(){
					window.location.href = "lo