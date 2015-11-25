$(function() {
	var pageIndex = 1;
	var pageRowNum = 10;
	var listField = "username";
	var listOrder = 1;
	var listPriority = 1;
	var disableActionIcons = false;
	var deleteAccount = new Array();
	var changePwdAccount = "";
	var editAccount = "";
	var visibleFormId = "";
	
	tenantManagement = new tenantManagement();
	auth = new auth();
	//list tenants
	var more = tenantManagement.listTenants(listField,listOrder,listPriority,pageRowNum,pageIndex);
	//decide to show "more" button or not
	_checkMoreBtn();
	_executeCollapser();
	
	function _showDialog(){
		$(".bottom_dialog").removeClass('show_dialog');
		$("body").addClass("showEditor");
	}
	function _removeDialog(){
		$(".bottom_dialog").removeClass('show_dialog');
		$("body").removeClass("showEditor");
	}
	function _appendNextPage(){
		console.log("append next page");
		pageIndex++;
		more = tenantManagement.listTenants(listField,listOrder,listPriority,pageRowNum,pageIndex);
	}
	function _showPassword(){
		//first dialog show then disable button
		_disableOKButton("change_pwd_ok_btn");

		//means directly click change password icon
		if($('input:checkbox:checked').length == 0){
			changePwdAccount = $(this).attr("value");
		}else{
			changePwdAccount = $("input[type=checkbox]:checked" ).val();
		}
		_showDialog();
		$("#passwordModal").addClass('show_dialog');
		visibleFormId = "passwordModal";
	}
	function _showEdit(){
		editAccount = $(this).attr("value");
		_checkTenantRole();
		_showDialog();
		$("#editTenant").addClass('show_dialog');
		visibleFormId = "editTenant";
	}
	function _showDelete(){
		
		//means directly click trash can icon
		if($('input:checkbox:checked').length == 0){
			deleteAccount.push($(this).attr("value"));
		}else{
			$(".checkbox").each(function(i){
				
				if($(this).find("input[type=checkbox]").prop('checked')){
					deleteAccount.push($(this).find("input[type=checkbox]").val());
				}
			});
		}

		_showDialog();
		$("#deleteTenant").addClass('show_dialog');
		visibleFormId = "deleteTenant";
	}
	function _executeChangePwd(){
		var account = "",newPassword = "",email = "",role = "";
		newPassword = $("#change_confirm_new_pwd").val();
		
		tenantManagement.editProfile(changePwdAccount,email,newPassword,role);
	}
	function _executeDelete(){
		//console.log("selected account: " + deleteAccount);
		tenantManagement.deleteTenant(deleteAccount);
	}
	function _executeCollapser(){
		$(".account").collapser({
			mode: 'chars',
			truncate: 20,
			showText: "[Read More]",
			hideText: "[Hide]"
		});
		$(".gene_time").collapser({
			mode: 'chars',
			truncate: 25,
			showText: "[Read More]",
			hideText: "[Hide]"
		});
		/*$(".last_activity").collapser({
			mode: 'chars',
			truncate: 30,
			showText: "[Read More]",
			hideText: "[Hide]"
		});*/
	}
	function _resetRadioCheckbox(role){
		//reset radio checkbox 
		$('input:radio[name="tenant_role"]').removeAttr('checked');
		//set role radio checkbox 
		$('input:radio[name="tenant_role"]').filter("[value=\"" + role + "\"]").prop('checked', true);
	}
	function _checkTenantRole(){
		//var account = "";
		//console.log("account: " + editAccount);
		/*$(".checkbox").each(function(i){
			
			if($(this).find("input[type=checkbox]").prop('checked')){
				account = $(this).find("input[type=checkbox]").val();
				//console.log("selected account: " + account);
				return false;
			}
		});*/
		var tenantInfo = tenantManagement.getTenant(editAccount);
		var role = tenantInfo.role;
		if(role == 0){
			$('input:radio[name="tenant_role"]').filter('[value="admin"]').prop('checked', true);
		}else{
			$('input:radio[name="tenant_role"]').filter('[value="user"]').prop('checked', true);
		}
	}
	function _checkMoreBtn(){
		if(more){
			$("#more_btn").removeClass("disabled");
			$("#more_btn").on("click.disabled",false);
		}else{
			$("#more_btn").addClass("disabled");
			$("#more_btn").off("click.disabled");
		}
	}
	function _actionIconBinding(){
		var selectedItemCounter=0;
		//exclude the inum icon
		var itemRow = $(".item_opera:not(.r_cluster)");
		var deleteBtn = $("#header_delete_btn");
		var checkall = false;
		
		if($("#checkall").prop('checked')){
			checkall = true;
		}
		
		selectedItemCounter = $('input:checkbox:checked').length;
		//console.log("check box count: " +  selectedItemCounter);
		if (selectedItemCounter > 1 ) {
			itemRow.each(function(i){	
				_disableIcons();
			});
			deleteBtn.removeClass("disabled");
			deleteBtn.bind("click",_showDelete);
			disableActionIcons = true;
		}else if (selectedItemCounter == 0 ) {
			deleteBtn.addClass("disabled");
			deleteBtn.unbind("click");
			_enableIcons();
			disableActionIcons = false;
		}else if (selectedItemCounter == 1 &&  !checkall) {
			deleteBtn.removeClass("disabled");
			_enableIcons();
			disableActionIcons = false;
		}
	}
	
	function _disableIcons(){
		//grey out icons
		var itemRow = $(".item_opera:not(.r_cluster)");
		itemRow.addClass("disabled");
		//icons malfunction
		$(".btn_password").unbind("click");
		$(".btn_edit").unbind("click");
		$(".btn_delete").unbind("click");
	}
	
	function _enableIcons(){
		//ungrey out icons
		var itemRow = $(".item_opera:not(.r_cluster)");
		itemRow.removeClass("disabled");
		//icons function recovery
		$(".btn_password").bind("click",_showPassword);
		$(".btn_edit").bind("click",_showEdit);
		$(".btn_delete").bind("click",_showDelete);
	}
	
	function _disableOKButton(id){
		var idString = "#"+id;
		//grey out button
		var OKbutton = $(idString);
		OKbutton.addClass("disabled");
		//button malfunction
		OKbutton.off("click.disabled");
	}
	function _enableOKButton(id){
		var idString = "#"+id;
		//ungrey out button
		var OKbutton = $(idString);
		OKbutton.removeClass("disabled");
		//button function recovery
		OKbutton.on("click.disabled",false);
	}
	
	//add a new validator method
	$.validator.addMethod("passwordcheck", function(value, element) {
		var rule = /^[a-zA-Z0-9]+$/g;
		//return value.match(rule);
		return rule.test(value);
	},"Please enter A-Z, a-z, 0-9 only.");
	$("#logout").click(function(){
		auth.logout();
	});
	
	//enable or disable "more" button
	$("#more_btn").click(function(){
		_appendNextPage();
		console.log("click more button and check icon: " + disableActionIcons);
		if(disableActionIcons)
			_disableIcons();
		else
			_enableIcons();
		_checkMoreBtn();
		//check collapser 
		_executeCollapser();
	});
	//enable or disable change password form`s "OK" button
	$('#changePasswordForm input').on('blur keyup', function() {
		if (change_validator.form()) {
			_enableOKButton("change_pwd_ok_btn");
		} else {
			_disableOKButton("change_pwd_ok_btn");
		}
	});
	//enable or disable create tenant form`s "OK" button
	$('#createTenantForm input').on('blur keyup', function() {
		if (create_validator.form()) {
			_enableOKButton("create_tenant_ok_btn");
		} else {
			_disableOKButton("create_tenant_ok_btn");
		}
	});

	$("body").bind('keydown',function(e){
		var keycode = e.which;
		//console.log("keycode: " + keycode);
		if(keycode == 27){
			//press escape
			$(".bottom_dialog_close_btn").click();
		}else if(keycode == 13){
			//press enter
			if(visibleFormId == "createTenantForm"){
				if(create_validator.form())				
				$("#create_tenant_ok_btn").click();
			}else if(visibleFormId == "deleteTenant"){
				$("#delete_tenant_ok_btn").click();
			}else if(visibleFormId == "editTenant"){
				$("#edit_tenant_ok_btn").click();
			}else{
				if(change_validator.form())
				$("#change_pwd_ok_btn").click();
			}
		}	
	});
	
	$(".item_detail .col-md-2 li").click(function(){
		$index=$(this).index();
		$(this).siblings('').removeClass('active');
		$(this).addClass('active');
		$(".i_de_block").hide();
		$(".i_de_block").eq($index).show();

	});
	
	$(".btn_password").click(_showPassword);
	
	$("#change_pwd_ok_btn").click(_executeChangePwd);
	
	$(".btn_delete").click(_showDelete);
	
	$("#delete_tenant_ok_btn").click(_executeDelete);
	
	$(".btn_create").click(function(){
		//first dialog show then disable button
		_disableOKButton("create_tenant_ok_btn");
		//set radio check default value
		$('input:radio[name="tenant_role"]').filter('[value="user"]').prop('checked', true); 
		_showDialog();
		$("#createTenant").addClass('show_dialog');
		visibleFormId = "createTenantForm";
		//unselect all items
		var checkboxes = $("input:checkbox");
		checkboxes.prop('checked',false);
		_actionIconBinding();
	});
	$("#create_tenant_ok_btn").click(function(){
		var account,password = "";
		var role = 1;
		
		account = $("#create_email").val();
		//console.log($("input:radio:checked[name=\"tenant_role\"]").val());
		if ($('input:radio:checked[name="tenant_role"]').val() == "admin"){
			_resetRadioCheckbox("admin");
			role = 0;
		}
		password = $("#create_confirm_pwd").val();
		//console.log("role: " + role);
		tenantManagement.createTenant(account,role,password);
		//reset form
		$(".form-control").val("");
	});
	
	$(".btn_edit").click(_showEdit);
	
	$("#edit_tenant_ok_btn").click(function(){
		
		var account = "",email = "",password = "",role = "";
		
		if ($('input:radio:checked[name="tenant_role"]').val() == "admin"){
			_resetRadioCheckbox("admin");
			role = "0";
		}else{
			role = "1";
		}
		//console.log("new role: " + role);
		//means directly click edit tenant icon
		if($('input:checkbox:checked').length == 0){
			account = editAccount;
		}else{
			account = $("input[type=checkbox]:checked" ).val();
		}
		
		tenantManagement.editProfile(account,email,password,role);
		
	});
	
	//sorting
	$(".dropdown-menu li").click(function() {
		var selectedId = this.id;
		var selectedElement = $(this);
		var sortButton = $("#sort_btn");
		var sortField = "";
	
		
		//clear class
		$(".list-groups").empty();
		//reset flag
		if (selectedElement.attr("ace") == undefined || selectedElement.attr("ace") == "undefined") {
			$(".dropdown-menu").each(function(i){
				var list = $(this).find('li');
				list.each(function(){
					list.removeAttr("ace");
				});
			});
			
		}

		if (selectedId == "sort_username") {		
			listField = "username";
		}else if (selectedId == "sort_cluster") {
			listField = "inum";
		}else if (selectedId == "sort_age") {
			listField = "created_time";
		}
		//else { //sort by last activity
		//	listField = "time";
		//}
		
		if(selectedElement.attr("ace") == "false" || selectedElement.attr("ace") == undefined 
			|| selectedElement.attr("ace") == "undefined"){
				
			//means acending list tenants
			$(this).attr({"ace":"true"});
			listOrder = 1;
			//reset page index
			pageIndex = 1;
			sortButton.removeClass("glyphicon glyphicon-sort-by-attributes-alt");
			sortButton.addClass("glyphicon glyphicon-sort-by-attributes");
			more = tenantManagement.listTenants(listField,listOrder,listPriority,pageRowNum,pageIndex);
		}else {
			//means decending list tenants
			$(this).attr({"ace":"false"});
			listOrder = 0;
			//reset page index
			pageIndex = 1;
			sortButton.removeClass("glyphicon glyphicon-sort-by-attributes");
			sortButton.addClass("glyphicon glyphicon-sort-by-attributes-alt");
			more = tenantManagement.listTenants(listField,listOrder,listPriority,pageRowNum,pageIndex);
		}
			_checkMoreBtn();
			_actionIconBinding();
	});
	
	//check all box
	$("#checkall").bind("click",function () {
		var checkboxes = $("input:checkbox");
		checkboxes.prop('checked', $(this).prop("checked"));
		/*var checkboxes = $(".list-groups").find(":checkbox");
		if($(this).is(':checked')) {
			checkboxes.prop('checked', true);
		} else {
			checkboxes.prop('checked', false);
		}*/
	});
	
	$("#checkall").keydown(function (e) {
		//press escape to unselect all checkbox 
		if(e.which == 27) {
			var checkboxes = $("input:checkbox");
			checkboxes.prop('checked', false);
		}else if(e.which == 65){
			//press 'A' to select all checkbox
			var checkboxes = $("input:checkbox");
			checkboxes.prop('checked', true);
		}
		_actionIconBinding();
	});
	//$(".checkbox").bind("click",function(e){
	//	_actionIconBinding();
	//});
	$(document).on("click",".checkbox",function(){
		_actionIconBinding();
	});
	
	$(".list-groups").click(function(){
		$(".bottom_dialog_close_btn").click();
	}).find(".item_opera:not(.r_cluster)").click(function(e){
		e.stopPropagation();
	});
	
	
	//create tenant validate area
	var create_validator = $("#createTenantForm").validate({
		rules:{
			create_email:{
				required: true,
				email: true,
			},
			create_new_pwd:{
				required: true,
				maxlength: 20,
				minlength: 4,
				passwordcheck: true
			},
			create_confirm_pwd:{
				required: true,
				maxlength: 20,
				minlength: 4,
				passwordcheck: true,
				equalTo: $("#create_new_pwd")
			}	
		},
		messages: {
			email_error:{
				
			},
			password_error:{
				maxlength: "Please enter no more than 20 characters.",
				minlength: "Please enter at least 4 characters.",
				passwordcheck: "Please enter A-Z, a-z, 0-9 only."
			},
			confirm_password_error:{
		
				maxlength: "Please enter no more than 20 characters.",
				minlength: "Please enter at least 4 characters.",
				passwordcheck: "Please enter A-Z, a-z, 0-9 only.",
				equalTo: "Please enter the same value again."
			}
		},
		//errorLabelContainer : $(".form-control-static")
		errorPlacement: function(error, element) {
			if (element.attr("name") === "create_email" )
				error.appendTo("#create_email_error");
			else if (element.attr("name") === "create_new_pwd" )
				error.appendTo("#create_new_pwd_error");
			else if (element.attr("name") === "create_confirm_pwd" )
				error.appendTo("#create_confirm_pwd_error");
		}
		
	});
	
	//change password validate area
	var change_validator = $("#changePasswordForm").validate({
		rules:{
			
			change_new_pwd:{
				required: true,
				maxlength: 20,
				minlength: 4,
				passwordcheck: true
			},
			change_confirm_new_pwd:{
				required: true,
				maxlength: 20,
				minlength: 4,
				passwordcheck: true,
				equalTo: $("#change_new_pwd")
			}	
		},
		messages: {
	
			password_error:{
				maxlength: "Please enter no more than 20 characters.",
				minlength: "Please enter at least 4 characters.",
				passwordcheck: "Please enter A-Z, a-z, 0-9 only."
			},
			confirm_password_error:{
		
				maxlength: "Please enter no more than 20 characters.",
				minlength: "Please enter at least 4 characters.",
				passwordcheck: "Please enter A-Z, a-z, 0-9 only.",
				equalTo: "Please enter the same value again."
			}
		},
		//errorLabelContainer : $(".form-control-static")
		errorPlacement: function(error, element) {
			if (element.attr("name") === "change_new_pwd" )
				error.appendTo("#change_new_pwd_error");
			else if (element.attr("name") === "change_confirm_new_pwd" )
				error.appendTo("#change_confirm_new_pwd_error");
		},
		/*invalidHandler: function(error,validator) {
			console.log(validator.numberOfInvalids() + " field(s) are invalid");
			var errors = validator.numberOfInvalids();
			if (errors) {
				console.log("incorrect form");
				_disableOKButton("change_pwd_ok_btn");
			} else {
				console.log("correct form");
				_enableOKButton("change_pwd_ok_btn");
			}
		}*/
		
		
	});
	
	
	//cancel,X button
	$(".bottom_dialog_close_btn").click(function(){
		$(".form-control").val("");
		//clear validator error message
		change_validator.resetForm();
		create_validator.resetForm();
		_removeDialog();
		visibleFormId = "";
	});
	
	//clear button
	$(".bottom_dialog_clear_btn").click(function(){
		$(".form-control").val("");
		//clear validator error message
		change_validator.resetForm();
		create_validator.resetForm();
		
		if(this.id == "create_tenant_clear_btn"){
			//default is user
			_resetRadioCheckbox("user");
		}else if(this.id == "edit_profile_clear_btn"){
			//reset to tenant`s original role
			_checkTenantRole();
		}
	});
});
