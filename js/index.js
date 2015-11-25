$(function() {
        var roleCode = $.cookie('ROLECODE');
        if (roleCode == 0) {
		$("#login").text("LOGOUT");
	} else if (roleCode == 1) {
		$("#tenant").hide();
		$("#login").text("LOGOUT");
	} else if (roleCode == -1) {
		 $("#instance").hide();
		 $("#tenant").hide();
	}
});
