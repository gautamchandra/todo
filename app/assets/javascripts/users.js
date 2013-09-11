$(function(){


	$('.save_edit_user').click(function  () {
		if($('#user_password_confirmation').val() == "" && $('#user_password').val() == "")
		{
			$('#user_password').remove();
			$('#user_password_confirmation').remove();
			$('.edit_user').submit();
		}

	})	
});
