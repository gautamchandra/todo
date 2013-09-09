$(function(){

	$(document).on('click','.list_trash',function (e) {
		e.preventDefault();
		var list_ele = $(this).parents('.list:first');
		var url = list_ele.data('url');

		//create an ajax request!
		$.ajax({
				url: url,
				data: { _method:'delete'},
				dataType: 'json',
				type: 'post',
				success: function (data) {
					list_ele.hide('fast',function  () {
						list_ele.remove();
					});
				}
			});
	});

	$(document).on('click','.list_save', function  (e) {

		e.preventDefault();

		var jq_list = $(this).parents('.list');
		var new_content = $.trim(jq_list.children('.list_name').html());
		var old_content = jq_list.data('old_desc');

		jq_list.children('.list_name').removeAttr('contenteditable').blur();
		if(new_content == old_content)
		{
			list_saving_done(jq_list);
			return;
		}

		var list = {'name' : new_content};

		jq_list.addClass('ajaxing');
		$.ajax({
				url: jq_list.data('url'),
				type: 'post',
				data: {_method: 'PATCH', list : list},
				dataType: 'json',
				success: function (data) {
					list_saving_done(jq_list);
				}
			});
	});

	$(document).on('click','.list_name', function  () {
		//see if there is any list getting updated 

		//if nothing else is being edited:
		
		var list_ele = $(this).parent('.list').addClass('editing');
		var save_ele = $(this).siblings('.list_save').show('fast');

		list_ele.data('old_desc',$.trim($(this).html()));
		var this_ele = $(this);

		//if clicked outside, the list details are saved! 
		$(document).mouseup(function (e)
		{

		    if (!this_ele.is(e.target)) // if the target of the click isn't the container...
		    {

		        save_ele.trigger('click');
		        $(document).off('mouseup');
		    }
		});

	});


	$(document).on('keypress','.list.editing', function  (event){
		   if (event.keyCode == 13) {
        		event.preventDefault();
        		$(document).trigger('mouseup');
        	}
	});


});

function list_saving_done (jq_list) {
	jq_list.children('.list_name').attr('contenteditable','true');
	jq_list.removeClass('ajaxing editing');
	jq_list.children('.list_save').hide('fast');
	jq_list.blur();
}