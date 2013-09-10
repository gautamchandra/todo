$(function(){

	$(document).on('click','.list_trash',function (e) {
		e.preventDefault();
		confirm_text = 'The list and the corresponding tasks will be permanently deleted from \
database. Press "OK" if you want to proceed';
		if(!confirm(confirm_text))
			return;
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
		var new_content = $.trim(jq_list.children('.list_name').text());
		var old_content = jq_list.data('old_desc');

		jq_list.children('.list_name').removeAttr('contenteditable').blur();

		// putting back the old content in case there is no new content

		if(new_content === "")
		{
			jq_list.children('.list_name').text(old_content);
			new_content = old_content;
		}

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

		list_ele.data('old_desc',$.trim($(this).text()));
		var this_ele = $(this);

		//if clicked outside, the list details are saved! 
		$(document).mouseup(function (e)
		{

		    if (!this_ele.is(e.target) && !save_ele.is(e.target)) // if the target of the click isn't the container...
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

	$(document).on('click','.pin', function  (e) {
		e.preventDefault();

		var this_ele = $(this);
		var url = this_ele.parents('.list:first').data('url');
		var pin_status=1; 

		if(this_ele.hasClass('list_pinned'))
			pin_status = 0;

		var list = {'pinned' : pin_status};


		$.ajax({
			url: url,
			type: 'post',
			data: { _method:'PATCH', list : list },
			dataType: 'json',
			success: function (data) {
				if(!pin_status)
				{
					this_ele.removeClass('list_pinned').addClass('list_pin');
				}
				else
				{
					this_ele.removeClass('list_pin').addClass('list_pinned');
				}

				//if it is the planner page, remove the element from display!
				if(this_ele.parents('.planner').length != 0)
					this_ele.parents('.list:first').hide('slow').remove();
			}
		}); //call the ajax function // in the success callback, strikethorough the text!

	});






});

function list_saving_done (jq_list) {
	jq_list.children('.list_name').attr('contenteditable','true');
	jq_list.removeClass('ajaxing editing');
	jq_list.children('.list_save').hide('fast');
	jq_list.blur();
	$(document).off('mouseup');
}