jQuery(document).on('change', 'input.nominasjonstatus', function(){
	var innslag = jQuery(this).parents('li.nominert-header');

	jQuery(document).trigger('nominasjon:'+ (jQuery(this).is(':checked') ? 'show':'hide'), [innslag.attr('data-id')]);
});


jQuery(document).on('nominasjon:show', function( e, id ) {
	jQuery('#nominert-header-'+id).addClass('nominert');
	jQuery('#nominert-data-' + id ).addClass('nominert').slideDown(); //.addClass('alert-success')
});


jQuery(document).on('nominasjon:hide', function( e, id ) {
	jQuery('#nominert-header-'+id).removeClass('nominert');
	jQuery( '#nominert-data-' + id ).removeClass('nominert').slideUp();
});

jQuery(document).on('click', '.nominasjon-sms-purring', function(e) {
	e.preventDefault();
	
	jQuery('#nominasjon-reminder-recipient').val( jQuery(this).attr('data-tel') );
	jQuery('#nominasjon-reminder').submit();
});


jQuery(document).on('change', 'input.nominasjonstatus', function(){
	data = {
		action: 'UKMnominasjon_toggleStatus',
		innslag: jQuery(this).parents('li.nominert-header').attr('data-id'),
		status: jQuery(this).is(':checked')
	};
	
	jQuery.post(ajaxurl, data, function(response ) {
		//console.log(response);
	});
});


jQuery(document).on('click', 'input.filopplasting-ja', function() {
	jQuery(document).trigger('nominasjon:konferansier:url:hide', [jQuery(this).parents('li.nominert-header').attr('data-id')]);
});
jQuery(document).on('click', 'input.filopplasting-nei', function() {
	jQuery(document).trigger('nominasjon:konferansier:url:show', [jQuery(this).parents('li.nominert-header').attr('data-id')]);
});


// TODO: sjekk at denne funker
jQuery(document).ready(function() {
	jQuery('input.filopplasting-ja').each(function(){
		if( jQuery(this).is(':checked') ) {
			jQuery(document).trigger('nominasjon:konferansier:url:hide');
		} else {
			jQuery(document).trigger('nominasjon:konferansier:url:show');
		}
	});
})

jQuery(document).on('nominasjon:konferansier:url:hide', function(e, id){
//	console.log('HIDE', id, e);
	jQuery('li#nominert-header-'+ id +' .filopplasting-url').parents('div.form-group').slideUp();
});

jQuery(document).on('nominasjon:konferansier:url:show', function(e, id){
//	console.log('SHOW', id, e);
	jQuery('li#nominert-header-'+ id +' .filopplasting-url').parents('div.form-group').slideDown();
});