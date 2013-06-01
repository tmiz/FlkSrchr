$('form').each(function() {
		action = $(this).attr('action');
		$(this).attr('action', 'http://localhost/rewrite' + action);
	});