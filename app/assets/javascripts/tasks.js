function move_to_unfinished_top (task_obj,list_obj) {
	var first_task = list_obj.find('.task:first');
	if(task_obj.attr("id") != first_task.attr("id"))
	{
		task_obj.hide('fast', function() {
			$(this).remove().insertBefore(first_task).show('fast');
		});
	}


}
//moves the task to the top of finished tasks
function move_to_finished_top(task_obj,list_obj)
{
	var last_unfinished_task = list_obj.find('.task:not(.finished):last');
	if(task_obj.attr("id") != last_unfinished_task.attr("id"))
	{
		task_obj.hide('fast', function () {
			$(this).remove().insertAfter(last_unfinished_task).show('fast');
		});
	}
	
}



function reset_task_form (list) {
// if in the list page, do not reset the list element 
	// otherwise reset it


// clear the contents of the input text field 
// or do some mag

	list.find('.task_name').val('');
}

function task_saving_done (jq_task) {
	jq_task.find('.task_name:first').attr('contenteditable','true');
	jq_task.removeClass('ajaxing editing');
	jq_task.find('.task_save:first').hide('fast');
	jq_task.blur();
	$(document).off('mouseup');
}


$(function(){

	if($('.list_specific_view').length )
	{
		//hide the plus buttons as the form itself will have list-id 
		$('.list_plus').addClass('hidden');
	}

	$(document).on('click','.task_trash',function (e) {
		var task_ele = $(this).closest('.task');
		var url = $(this).data('url');

		//create an ajax request!
		$.ajax({
				url: url,
				data: { _method:'delete'},
				dataType: 'json',
				type: 'post',
				success: function (data) {
					task_ele.hide('fast',function  () {
						task_ele.remove();
					});
				}
			});

	});

 // In that case: $target.hide('slow', function(){ $target.remove(); });

	//trigger task name save when enter is pressed when task name is editing
	$(document).on('keypress','.task.editing', function  (event){
		   if (event.keyCode == 13) {
        		event.preventDefault();
        		$(document).trigger('mouseup');
        	}
	});

	$(document).on('click','.task_name', function  () {
		//see if there is any task getting updated 

		//if nothing else is being edited:


		//select all the text - UI improvement

		var task_ele = $(this).closest('.task').addClass('editing');
		var save_ele = task_ele.find('.task_save:first').show('fast');

		task_ele.data('old_desc',$.trim($(this).text()));

		//if clicked outside, the task details are saved! 
		$(document).mouseup(function (e)
		{

		    if (!task_ele.is(e.target) // if the target of the click isn't the container...
		        && task_ele.has(e.target).length === 0) // ... nor a descendant of the container
		    {

		        save_ele.trigger('click');
		        $(document).off('mouseup');
		    }
		});

	});

	$(document).on('click','.task_save', function  (e) {

		e.preventDefault();

		var jq_task = $(this).closest('.task');
		var new_content = $.trim(jq_task.find('.task_name:first').text());
		var old_content = jq_task.data('old_desc');


		if(new_content === "")
		{
			jq_task.find('.task_name:first').text(old_content);
			new_content = old_content;
		}

		jq_task.find('.task_name:first').removeAttr('contenteditable').blur();
		if(new_content == old_content)
		{
			task_saving_done(jq_task);
			return;
		}

		var task = {'name' : new_content};

		jq_task.addClass('ajaxing');
		$.ajax({
				url: jq_task.data('url'),
				type: 'post',
				data: {_method: 'PATCH', task : task},
				dataType: 'json',
				success: function (data) {
					task_saving_done(jq_task);
				}
			});
	});


	$(document).on('click','.task_checkbox',function  () {
		var id;
		id = $(this).attr('id'); 
		id = id.replace("task_cb_","");

		var checked = $(this).prop('checked');
		var url = $(this).data('url');
		var task = { 'status' : checked };

		$.ajax({
			url: url,
			type: 'post',
			data: { _method:'PATCH', task: task},
			dataType: 'json',
			success: function (data) {
				id = "#task_name_" + id;
				var task_obj = $(id).closest('.task');
				var list_obj = task_obj.closest('.list');

				if (checked) {
					move_to_finished_top(task_obj,list_obj);
					$(id).addClass("checked");
					task_obj.addClass('finished');
					
				} else{
					move_to_unfinished_top(task_obj,list_obj);
					$(id).removeClass("checked");
					$(id).closest('.task').removeClass('finished');
				}
			}
		}); //call the ajax function // in the success callback, strikethorough the text!
	});


	$(document).on('keypress',".task_form .task_name",function (event) {
	    if (event.which == 13) {
	        event.preventDefault();
	        $(this).closest('.task_form').submit();
	    }
	});

	// strikethrough($('.ele')); 
});

