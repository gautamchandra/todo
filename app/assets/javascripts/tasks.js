function move_to_unfinished_top (task_obj,list_obj) {
	var first_task = list_obj.find('.task:first');
	if(task_obj.attr("id") != first_task.attr("id"))
	{
		task_obj.remove().insertBefore(first_task);
	}


}
//moves the task to the top of finished tasks
function move_to_finished_top(task_obj,list_obj)
{
	var last_unfinished_task = list_obj.find('.task:not(.finished):last');
	if(task_obj.attr("id") != last_unfinished_task.attr("id"))
	{
		task_obj.remove().insertAfter(last_unfinished_task);
	}
	
}



function reset_task_form () {
// if in the list page, do not reset the list element 
	// otherwise reset it


// clear the contents of the input text field 
// or do some mag

	$('#task_name').val('');
}

function task_saving_done (jq_task) {
	jq_task.children('.task_name').attr('contenteditable','true');
	jq_task.removeClass('ajaxing editing');
	jq_task.children('.task_save').hide('fast');
	jq_task.blur();
}


$(function(){
	$('.task_checkbox').each(function(i, obj) {
		$(this).prop('checked',false);
	});

	$('.task_checkbox.checked').each(function(i, obj) {
		$(this).prop('checked',true);
		$(this).parents('.task').addClass('finished');
	});

	$(document).keyup(function(e) {
  		if (e.keyCode == 27) {
  			$('.list.hidden').removeClass("hidden").show('fast');
  			reset_task_form();
  		}   // esc
	});


	if($('.list_specific_view').length )
	{
		//hide the plus buttons as the form itself will have list-id 
		$('.list_plus').addClass('hidden');
	}

	$(document).on('click','.task_trash',function (e) {
		var task_ele = $(this).parents('.task:first');
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

	$(document).on('click','.list_plus', function  (e) {
		e.preventDefault();

		ele = $(this).parent(".list");
		var list_id = ele.attr("id");

		//select all lists except this one
		var not_selector = ".list:not(#" + list_id + ")";

		$(not_selector).hide('fast',function  () {
			$(not_selector).addClass("hidden");
		});
		

		//put the value of list id to this id: 
		list_id = list_id.replace("list_","");
		$('#task_list_id').val(list_id);

		$('#task_name').focus();

	});

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
		
		var task_ele = $(this).parent('.task').addClass('editing');
		var save_ele = $(this).siblings('.task_save').show('fast');

		task_ele.data('old_desc',$.trim($(this).html()));

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

		var jq_task = $(this).parents('.task');
		var new_content = $.trim(jq_task.children('.task_name').html());
		var old_content = jq_task.data('old_desc');

		jq_task.children('.task_name').removeAttr('contenteditable').blur();
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
				var task_obj = $(id).parent('.task');
				var list_obj = task_obj.parents('.list');

				if (checked) {
					move_to_finished_top(task_obj,list_obj);
					$(id).addClass("checked");
					task_obj.addClass('finished');
					
				} else{
					move_to_unfinished_top(task_obj,list_obj);
					$(id).removeClass("checked");
					$(id).parent('.task').removeClass('finished');
				}
			}
		}); //call the ajax function // in the success callback, strikethorough the text!
	});


	// strikethrough($('.ele')); 
});

