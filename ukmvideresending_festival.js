var warn_ledere = null;
var warn_hotelldogn = null;
jQuery(document).ready(function(){
	jQuery('.videresend_item').each(function(){
		if( jQuery(this).attr('data-videresendt') == 'true' ) {
			load_kontroll( jQuery(this).attr('data-id'), jQuery(this).attr('id') );
		}
	});
});
// INFORMASJON OM HVORDAN LASTE OPP PLAYBACK
jQuery(document).on('click', '.alertPlayback', function( e ) {
	e.preventDefault();
	jQuery('#pageContainer').slideUp();
	jQuery('#pageAlertContainer').html( twigJSalertplayback.render() ).slideDown();
});

// INFORMASJON OM HVORDAN LASTE OPP FILMER
jQuery(document).on('click', '.alertVideoUpload', function( e ) {
	e.preventDefault();
	jQuery('#pageContainer').slideUp();
	jQuery('#pageAlertContainer').html( twigJSalertvideoupload.render() ).slideDown();
});

// INFORMASJON OM HVORDAN LASTE OPP BILDER
jQuery(document).on('click', '.alertImageUpload', function( e ) {
	e.preventDefault();
	jQuery('#pageContainer').slideUp();
	jQuery('#pageAlertContainer').html( twigJSalertimageupload.render() ).slideDown();
});

// SKJUL INFORMASJON, VIS OVERSIKT I STEDET
jQuery(document).on('click', '.cancelAlert', function() {
	jQuery('#pageAlertContainer').html( 'Vennligst vent..' ).slideUp();
	jQuery('#pageContainer').slideDown();
	jQuery('#ledere_modal').html( 'Vennligst vent..' ).slideUp();
	jQuery('#ledere_content').slideDown();

});


// IMAGESELECTOR

// LAST INN BILDER AV GITT INNSLAG
jQuery(document).on('click', '.imageSelector', function( e ) {
	var innslag = jQuery(this).parents('tr');
	
	var data = {
		action: 'UKMvideresending_festival_ajax',
		subaction: 'image_selector_list', 
		b_id: innslag.attr('data-bid'),
		t_id: innslag.attr('data-tid'),
		selector: innslag.attr('id'),
		kunstner: jQuery(this).attr('data-kunstner')=='true'
	};

	jQuery('#pageContainer').slideUp();
	jQuery('#pageAlertContainer').html( twigJSimageselectorload.render( {navn: innslag.attr('data-navn') }) ).slideDown();

	
	jQuery.post(ajaxurl, data, function(response) {
		var data = jQuery.parseJSON( response );
		
		jQuery('#pageAlertContainer').html( twigJSimageselectorshow.render( data ) );
	});
});

// VELG (OG FORHÅNDVSVIS) ET BILDE
jQuery(document).on('click', '.image_selector_thumb', function(){
	var selected = jQuery('#image_selected_container');
	var image = jQuery('#image_selector_big');
	var select = jQuery(this).find('img');
	selected.slideDown();
	image.attr('data-id', select.attr('data-id') );
	image.attr('data-full', select.attr('data-full') );
	image.attr('data-thumb', select.attr('src') );
	image.attr('src', select.attr('data-full') );
});

// VELG (OG LAGRE) BILDE FOR GITT INNSLAG
jQuery(document).on('click', '#image_selector_select', function(){
	var selected = jQuery('#image_selector_big');
	
	var data = {
				action:			'UKMvideresending_festival_ajax',
				subaction:		'image_selector_set',
				rel_id:			selected.attr('data-id'),
				b_id:			jQuery(this).attr('data-bid'),
				t_id:			jQuery(this).attr('data-tid'),
				selector:		jQuery(this).attr('data-selector'),
				image_full:		selected.attr('data-full'),
				image_thumb:	selected.attr('data-thumb'),
				kunstner:		jQuery(this).attr('data-kunstner')=='true'
			};


	jQuery('#pageAlertContainer').html('Vent, lagrer...');

	jQuery.post(ajaxurl, data, function( response ) {
		var data = jQuery.parseJSON(response);

		if( data.kunstner == 'true') {
			var kunstner = jQuery('td.kunstner_'+data.b_id);
			kunstner.each(function(){
				var image = jQuery('<img />').attr('src', data.image_thumb); 
				var button = jQuery('<a />').attr('href','#').attr('data-kunstner','true').addClass('imageSelector btn btn-default btn-xs').html('Velg annet bilde');
				jQuery(this).removeClass('alert-danger').addClass('alert-success').html( image ).append('<br />').append( button );
			});
		} else {
			var innslag = jQuery('#' + data.selector );
			var image = jQuery('<img />').attr('src', data.image_thumb); 
			var button = jQuery('<a />').attr('href','#').addClass('imageSelector btn btn-default btn-xs').html('Velg annet bilde');
			var button2 = jQuery('<a />').attr('href','#').addClass('alertImageUpload btn btn-block btn-xs btn-default').html('Last opp bilde(r)');
			var imageCont = innslag.find('td.imageSelect:not(.kunstner)');
			imageCont.removeClass('alert-danger').addClass('alert-success').html( image ).append('<br />').append( button ).append('<br />eller<br />').append( button2 );
		}
		
		jQuery('#pageAlertContainer').slideUp().html( 'Vennligst vent..' );
		jQuery('#pageContainer').slideDown();
	});
});



// FILM"SELECTOR"
// LIST OPP ALLE FILMER I UKM-TV FOR GITT INNSLAG
jQuery(document).on('click', '.videoCheck', function( e ) {
	var innslag = jQuery(this).parents('tr');

	var data = {
		action: 'UKMvideresending_festival_ajax',
		subaction: 'video_selector_list', 
		b_id: innslag.attr('data-bid'),
		t_id: innslag.attr('data-tid'),
		selector: innslag.attr('id')
	};

	jQuery('#pageContainer').slideUp();
	jQuery('#pageAlertContainer').html( twigJSvideoselectorload.render( {navn: innslag.attr('data-navn') }) ).slideDown();

	
	jQuery.post(ajaxurl, data, function(response) {
		var data = jQuery.parseJSON( response );
		
		jQuery('#pageAlertContainer').html( twigJSvideoselectorlist.render( data ) );
	});
});

// PLAYBACK"SELECTOR"
// LIST OPP ALLE FILER I PLAYBACKMODULEN FOR GITT INNSLAG
jQuery(document).on('click', '.playbackCheck', function( e ) {
	var innslag = jQuery(this).parents('tr');

	var data = {
		action: 'UKMvideresending_festival_ajax',
		subaction: 'playback_selector_list', 
		b_id: innslag.attr('data-bid'),
		t_id: innslag.attr('data-tid'),
		selector: innslag.attr('id')
	};

	jQuery('#pageContainer').slideUp();
	jQuery('#pageAlertContainer').html( twigJSplaybackselectorload.render( {navn: innslag.attr('data-navn') }) ).slideDown();

	
	jQuery.post(ajaxurl, data, function(response) {
		var data = jQuery.parseJSON( response );
		jQuery('#pageAlertContainer').html( twigJSplaybackselectorlist.render( data ) );
	});
	
});


// VIDERESEND INNSLAG

jQuery(document).on('click', 'input.videresend', function() {
	var innslag = jQuery(this).parents('tr.videresend_item');
	var detaljer = innslag.find('.videresend_detaljer');
		
	jQuery(this).attr('disabled',true);
	
	if( jQuery(this).is(':checked') ) {
		innslag.addClass('alert info');
		detaljer.html('Vent, videresender innslag...').slideDown();
		innslag.attr('data-status', 'videresender');
		
		videresend( innslag.attr('data-id'), innslag.attr('id') );
	} else {
		avmeld( innslag.attr('data-id'), innslag.attr('id') );
	}
});

jQuery(document).on('click', 'input.videresend_person', function(){
	var person = jQuery(this).parents('tr.person');

	jQuery(this).attr('disabled', true);
	if( jQuery(this).is(':checked') ) {
		person.find('.person_navn').html('Vent, videresender...');
		videresend_person( person.attr('data-id'), person.attr('id') );
	} else {
		person.find('.person_navn').html('Vent, melder av...');
		avmeld_person( person.attr('data-id'), person.attr('id') );
	}
});

function avmeld( ID, IDselector ) {
	var data = {
		action: 'UKMvideresending_festival_ajax',
		subaction: 'avmeld',
		id: ID,
		selector: IDselector
	};

	var innslag = jQuery('#' + IDselector);
	var detaljer = innslag.find('.videresend_detaljer');
		
	innslag.find('input.videresend').attr('disabled',true);
	detaljer.html('Vent, melder av...');

	// since 2.8 ajaxurl is always defined in the admin header and points to admin-ajax.php
	jQuery.post(ajaxurl, data, function(response) {
		var data = jQuery.parseJSON( response );
		var innslag = jQuery('#'+ data.selector);

		if( data.success ) {
			display_avmeld( data.selector );
		} else {
			alert('Kunne ikke avmelde!');
			detaljer.html('Vent, laster detaljer');
			load_kontroll( data.selectorID, data.selector)
			innslag.find('input.videresend').attr('checked', true);
		}
		innslag.find('input.videresend').attr('disabled', false)
	});

}

function videresend( ID, IDselector) {
	var data = {
		action: 'UKMvideresending_festival_ajax',
		subaction: 'videresend',
		id: ID,
		selector: IDselector
	};

	// since 2.8 ajaxurl is always defined in the admin header and points to admin-ajax.php
	jQuery.post(ajaxurl, data, function(response) {
		handleVideresendToggle( response );
	});
}

function load_kontroll( ID, IDselector ) {
	var data = {
		action: 'UKMvideresending_festival_ajax',
		subaction: 'load_kontroll',
		id: ID,
		selector: IDselector
	};

	jQuery.post(ajaxurl, data, function(response) {
		data = jQuery.parseJSON( response );
		jQuery('#'+data.selector).find('.videresend_detaljer').html( twigJSkontrollertittel.render( data ) );
	});
}

function videresend_person( ID, IDselector ) {	
	var data = {
		action: 'UKMvideresending_festival_ajax',
		subaction: 'videresend_person',
		id: ID,
		selector: IDselector
	};

	jQuery.post(ajaxurl, data, function(response) {
		data = jQuery.parseJSON( response );
		var person = jQuery( '#' + data.selector );

		if( data.success ) {
			person.addClass('success');
		} else {
			alert('Kunne ikke videresende person!');
			person.removeClass('success');
			person.find('input.videresend_person').attr('checked', false);
		}
		person.find('input.videresend_person').attr('disabled', false);
		person.find('.person_navn').html( person.find('.person_navn').attr('data-navn') );
	});
}

function avmeld_person( ID, IDselector ) {	
	var data = {
		action: 'UKMvideresending_festival_ajax',
		subaction: 'avmeld_person',
		id: ID,
		selector: IDselector
	};

	jQuery.post(ajaxurl, data, function(response) {
		data = jQuery.parseJSON( response );
		var person = jQuery( '#' + data.selector );

		if( data.success ) {
			person.removeClass('success');
		} else {
			alert('Kunne ikke avmelde person!');
			person.addClass('success');
			person.find('input.videresend_person').attr('checked', true);
		}
		person.find('input.videresend_person').attr('disabled', false);
		person.find('.person_navn').html( person.find('.person_navn').attr('data-navn') );
	});
}
function handleVideresendToggle( response ) {
	data = jQuery.parseJSON( response );
	var innslag = jQuery( '#' + data.selector );
	var detaljer = innslag.find('.videresend_detaljer');
	var checkbox = innslag.find('input.videresend');

	if( !data.videresendt ) {
		alert('Kunne ikke videresende!');
		display_avmeld( data.selector );
	} else {
		innslag.addClass('success').removeClass('info').attr('data-status', 'videresendt');
		detaljer.html('Innslag videresendt, last kontrolliste!');
		detaljer.html( twigJSkontrollertittel.render( data ) );
		checkbox.attr('disabled',false);
	}
}

function display_avmeld( selector ) {
	var innslag = jQuery( '#' + selector );
	innslag.removeClass('success').removeClass('info').attr('data-status', 'ikke_videresendt');
	innslag.find('.videresend_detaljer').slideUp();
	innslag.find('input.videresend').attr('disabled',false).attr('checked',false);
}

jQuery.datepicker.regional['no'] = {
	closeText: 'Lukk',
    prevText: '&laquo;Forrige',
	nextText: 'Neste&raquo;',
	currentText: 'I dag',
    monthNames: ['Januar','Februar','Mars','April','Mai','Juni',
    'Juli','August','September','Oktober','November','Desember'],
    monthNamesShort: ['Jan','Feb','Mar','Apr','Mai','Jun',
    'Jul','Aug','Sep','Okt','Nov','Des'],
	dayNamesShort: ['S&oslash;n','Man','Tir','Ons','Tor','Fre','L&oslash;r'],
	dayNames: ['S&oslash;ndag','Mandag','Tirsdag','Onsdag','Torsdag','Fredag','L&oslash;rdag'],
	dayNamesMin: ['S&oslash;','Ma','Ti','On','To','Fr','L&oslash;'],
	weekHeader: 'Uke',
    dateFormat: 'yy-mm-dd',
	firstDay: 1,
	isRTL: false,
	showMonthAfterYear: false,
	yearSuffix: ''};
jQuery.datepicker.setDefaults(jQuery.datepicker.regional['no']);

// LEDERE
// Lagre leder
jQuery(document).on('click','button.leder_save', function(){
	jQuery(this).html('Lagrer...').removeClass('btn-success').addClass('btn-info');
	
	var leder = jQuery(this).parents('tr.leder');
	var form = leder.find('form.leder_edit_form');
	
	var data = {	action:			'UKMvideresending_festival_ajax',
					subaction:		'leder_save',
					selector: leder.attr('id'),
					ID: leder.attr('data-id'),
					navn: form.find('input.leder_navn').val(),
					mobil: form.find('input.leder_mobil').val(),
					epost: form.find('input.leder_epost').val(),
					type: form.find('.leder_type').val()
				};
	
	jQuery.post(ajaxurl, data, function( response) {
		data = jQuery.parseJSON( response );
		
		if( !data.success ) {
			alert('En feil har oppstått ved lagring, og dine endringer ble derfor ikke lagret!');
			jQuery('#'+data.selector).find('.leder_save').html('Lagre').removeClass('btn-info').addClass('btn-success');
		} else {
			jQuery('#'+data.selector).find('.leder_save').html('Lagret!').removeClass('btn-info').addClass('btn-success');
			jQuery(document).trigger('rekalkuler_overnatting');
			jQuery(document).trigger('middagsgjester_save');
			jQuery(document).trigger('leder_lagret');
			setTimeout(function() {
				//console.log('reset leder save button');
				jQuery('button.leder_save').html('Lagre');
			}, 2000);
		}
	});
});

// Legg til leder
jQuery(document).on('click', '.addLeder', function(){
	jQuery('#ledere_content').hide();
	jQuery('#ledere_modal').html('Vent, legger til leder...').slideDown();
	
	var data = { action: 'UKMvideresending_festival_ajax',
				subaction: 'leder_leggtil'
				};
	
	jQuery.post(ajaxurl, data, function(response) {
		var data = jQuery.parseJSON(response);
		var ledere = jQuery('table#ledere');
		ledere.append( twigJSledereleder.render( data ) );
		jQuery('#ledere_modal').slideUp().html('Vennligst vent, laster inn..');
		jQuery('#ledere_content').slideDown();
		jQuery('html, body').animate({scrollTop:jQuery(document).height()}, 'slow');
		jQuery(document).trigger('rekalkuler_overnatting');
		jQuery(document).trigger('middagsgjester_save');
	})
});
// Slett leder
jQuery(document).on('click','.leder_delete', function(e){
	e.preventDefault();
	jQuery(this).html('Sletter...').addClass('btn-info').removeClass('btn-danger');
	var leder = jQuery(this).parents('tr.leder');
	var do_delete = confirm('Er du sikker på at du vil slette ' + leder.find('input.leder_navn').val() +'?');
	
	
	if(do_delete){
		var data = {action: 'UKMvideresending_festival_ajax',
					subaction: 'leder_slett',
					ID: leder.attr('data-id'),
					selector: leder.attr('id')
					};
		jQuery.post(ajaxurl, data, function(response) {
			var data = jQuery.parseJSON(response);
			
			if( !data.success ) {
				alert('Kunne ikke slette leder pga ukjent feil. Prøv igjen, evt kontakt UKM Norge om feilen vedvarer');
				jQuery('#'+data.selector).find('button.leder_delete').html('Slett').addClass('btn-danger').removeClass('btn-info');
			} else {
				jQuery('#'+data.selector).slideUp().remove();
				jQuery(document).trigger('rekalkuler_overnatting');
				jQuery(document).trigger('middagsgjester_save');
			}
		});
	} else {
		jQuery(this).html('Slett').addClass('btn-danger').removeClass('btn-info');
	}

});


jQuery(document).on('rekalkuler_ledere_per_natt', function(){
	 var ant = jQuery('#overnatting_deltakere_antall').val(); 
	 jQuery('#num_ledere_deltakerovernatting').html( Math.ceil(ant / 10) );
});

// Link lederutregning per natt
jQuery(document).on('keyup click change ready', '#sove_korrigert', function(){
	jQuery(document).trigger('rekalkuler_ledere_per_natt').trigger('rekalkuler_overnatting');
});
jQuery(document).ready(function(){
	jQuery(document).trigger('rekalkuler_ledere_per_natt').trigger('rekalkuler_overnatting');
});


// Kalkuler overnattinger
jQuery(document).on('click', '.fordeling_overnatting', function(){
	var selector = 'input[name="'+ jQuery(this).attr('name') +'"]:checked';
	var data = { action: 'UKMvideresending_festival_ajax',
				subaction: 'leder_natt_save',
				dato: jQuery(this).attr('data-dato'),
				sted: jQuery( selector ).val(),
				leder: jQuery(this).parents('tr.leder').attr('data-ID'),
				selector: selector
				};
	
	jQuery.post(ajaxurl, data, function(response) {
		var data = jQuery.parseJSON( response );
		
		if( !data.success ) {
			alert(	'En feil oppsto ved lagring av overnatting. Vennligst prøv igjen, eller kontakt UKM Norge om feilen vedvarer' + 
					"\r\n" +
					data.leder.l_navn +' '+ data.natt.dag +'.'+ data.natt.mnd +' ble ikke lagret');
			jQuery( data.selector ).attr('checked',false);
		}
	});
	
	jQuery(document).trigger('rekalkuler_overnatting');
});

jQuery(document).on('rekalkuler_advarsel', function(e, ledere, hotelldogn){
	//console.group('REDRAW ADVARSEL');
	
	var ledere_for_lite = [];
	jQuery('.overnatting_deltakere').each(function(){
		var natt = jQuery(this);
		if( natt.hasClass('alert-danger') ) {
			ledere_for_lite.push( {dag: jQuery(this).attr('data-dag'),
									  human: jQuery(this).attr('data-human')
									});
		}
	});
	
	var warn_nattledere = 0;
	//console.group('Nattledere advarsel');
	for (var key in nattledere) {
	  if (nattledere.hasOwnProperty(key)) {
		  if( nattledere[key] == 0 || nattledere[key] == null) {
			  warn_nattledere++;
		  }
	    //console.log(key + " -> " + nattledere[key]);
	  }
	}
	//console.log('Warn: ' + warn_nattledere);
	//console.groupEnd();
	
	// Lagre antall hotelldøgn
	var postdata = {action: 'UKMvideresending_festival_ajax',
					subaction: 'leder_overnatting_hotelldogn',
					hotelldogn: hotelldogn
				};
	jQuery.post(ajaxurl, postdata, function(response){});
	//
	
	var data = {'ledere': ledere,
				'hotelldogn': hotelldogn,
				'pris_hotelldogn': jQuery('#pris_hotelldogn').val(),
				'ledere_for_lite': ledere_for_lite,
				'overnatting_deltakere': jQuery('#overnatting_deltakere').val(),
				'nattledere_for_lite': warn_nattledere
				};
	//console.log(data);
	jQuery('#ledere_advarsler').html( twigJSlederestatus.render( data ) );
	//console.groupEnd();
});

jQuery(document).on('rekalkuler_overnatting', function() {
	//console.group('REKALKULER OVERNATTING');

	//console.group('Reset');
	var fordeling = {};
	var ledere = {};
	var hotelldogn = 0;
	jQuery('tr.leder').each(function(){
		var leder = jQuery(this);
		var lederen = {id: leder.attr('id'),
						navn: leder.find('input.leder_navn').val(),
						mangler_overnatting: [],
						type: leder.find('.leder_type').val()
					};
		//console.log('Reset overnattinger for '+ lederen.navn);
		ledere[ lederen.id ] = lederen;
	});

	
	jQuery('.overnattingssted').each(function(){
		var sted = {id: jQuery(this).attr('id'),
					navn: jQuery(this).html()
					};
		//console.log('Reset ' + sted.id);
		jQuery('.overnattingsdager').each(function(){
			var id = jQuery(this).attr('id');
			sted[id] = 0;
			//console.log('Reset ' + sted.id + ':' + id);
		});
		fordeling[sted.id] = sted;
	});
	//console.log('Reset fullført');
	//console.warn( fordeling );
	//console.groupEnd();
	
	//console.group('Tell opp');
	jQuery('tr.leder').each(function(){
		var leder = jQuery(this);
		//console.group('Tell opp: ' + leder.find('input.leder_navn').val() );

		jQuery('.overnattingsdager').each(function(){
			var id = jQuery(this).attr('id');
			var selector = 'input[name="leder_'+ leder.attr('data-id') +'_dato_'+ id +'"]:checked';
			var sted = leder.find(selector).val();
			if( sted != undefined ) {
				fordeling[ sted ][ id ] ++;
				if( sted == 'hotell' ) {
					hotelldogn++;
				}
				// VALG AV HOVEDLEDER
				var nattleder_selector = 'leder_'+ leder.attr('data-id') + '_natt_' + id;
				//console.group('Nattleder '+ nattleder_selector);
				if( sted == 'deltakere' ) {
					//console.info('KAN');
					var ledernavn = jQuery('#leder_'+ leder.attr('data-id') ).find('input.leder_navn').val();
					if( ledernavn.length == 0 ) {
						ledernavn = jQuery('#leder_'+ leder.attr('data-id') ).find('.leder_type').val() + 'leder uten navn';
					}

					if( jQuery('#' + nattleder_selector).length ) {
						//console.log('Er i listen');
						jQuery('#' + nattleder_selector).text(ledernavn);
					} else {
						//console.info('Legg til i listen');
						jQuery('#nattleder_'+id).append('<option value="'+ leder.attr('data-id') +'" id="'+ nattleder_selector +'">'+ ledernavn +'</option>');
					}
					// Sett selected hvis vedkommende er lagret selected i databasen
					if( parseInt( nattledere['natt_'+id] ) == parseInt( leder.attr('data-id')) ) {
						jQuery( '#' + nattleder_selector ).attr('selected','selected');
					}
				} else {
					//console.warn('Kan ikke - fjern fra listen');
					jQuery('#'+ nattleder_selector ).remove();
					//console.log( leder.attr('data-id') + ' kan ikke være hovedleder ' + id );
				}
				console.groupEnd();
			} else {
				ledere[ leder.attr('id') ]['mangler_overnatting'].push( jQuery(this).attr('data-human') +' '+ jQuery(this).attr('data-dag') +'.' );
				sted = 'ikke valgt';
			}
			//console.log('Natt ' + id + ': ' + sted);
		});
		//console.groupEnd();
	});
	
	jQuery(document).trigger('lagre_nattleder');
	//console.log('Opptelling fullført');
	//console.groupEnd();
	//console.warn( fordeling );

	//console.group('Manglende overnattinger');
	//console.warn( ledere );
	//console.groupEnd();
	
	//console.group('Antall hotelldøgn');
	//console.warn( hotelldogn );
	//console.groupEnd();
	
	
	
	//console.group('Distribuer til bruker');
	for (var sted in fordeling) {
		if (fordeling.hasOwnProperty(sted)) {
			for( var dag in fordeling[sted] ) {
				var antall = fordeling[sted][dag];
				
				//console.log('fordeling_'+ sted +'_'+ dag +' => '+ fordeling[sted][dag]);
				if( sted == 'deltakere') {
					var css = antall >= parseInt(jQuery('#num_ledere_deltakerovernatting').html()) ? 'success' : 'danger';			
					jQuery('#' + 'fordeling_'+ sted +'_'+ dag).removeClass('alert-success alert-danger').addClass('alert-'+css);
				}
				jQuery('#' + 'fordeling_'+ sted +'_'+ dag).html( antall );
			}
		}
	}
	//console.groupEnd();	

	//console.groupEnd();
	warn_ledere = ledere;
	warn_hotelldogn = hotelldogn;
	jQuery(document).trigger('rekalkuler_advarsel', [ledere, hotelldogn]);
});

// Lagre antall som sover i Spektrum
jQuery(document).on('click','#sove_korriger', function(){
	jQuery(this).html('Lagrer...').addClass('btn-info').removeClass('btn-success');
	var data = { action: 'UKMvideresending_festival_ajax',
				subaction: 'leder_overnatting_spektrum',
				kommentar: jQuery('#sove_korrigert').val()
			};
	jQuery.post(ajaxurl, data, function(response){
		var data = jQuery.parseJSON( response );
		
		if( data.success ) {
			jQuery('#sove_korriger').html('Lagret!');
			
			setTimeout(function(){jQuery('#sove_korriger').html('Lagre')},2000);
		} else {
			alert('En feil oppsto ved lagring! Vennligst prøv igjen, evt kontakt UKM Norge om feilen vedvarer');
		}
		jQuery('#sove_korriger').removeClass('btn-info').addClass('btn-success');
	});
});

jQuery(document).on('click', '#middagsgjester_save', function(e){
	e.preventDefault();
	jQuery(document).trigger('middagsgjester_save');
});

// Lagre middagsgjester
jQuery(document).on('middagsgjester_save', function() {
	jQuery('#middagsgjester_save').html('Lagrer...').addClass('btn-info').removeClass('btn-success');
	
	var data = { 	action: 'UKMvideresending_festival_ajax',
					subaction: 'leder_middagsgjester',
					gjest_ukm: jQuery('#ledermaltid_1').val(),
					gjest_fylke1: jQuery('#ledermaltid_2').val(),
					gjest_fylke2: jQuery('#ledermaltid_3').val()
				};
	
	jQuery.post(ajaxurl, data, function(response){
		var data = jQuery.parseJSON(response);
		
		if( data.success ) {
			jQuery('#middagsgjester_save').html('Lagret!');
			setTimeout(function(){jQuery('#middagsgjester_save').html('Lagre')}, 2000);
			jQuery('#ledermaltid_1').html( twigJSlederemaltid.render( {ledere: data.ledere, maltid_selected: data.gjester.ukm} ) );
			jQuery('#ledermaltid_2').html( twigJSlederemaltid.render( {ledere: data.ledere, maltid_selected: data.gjester.fylke1} ) );
			jQuery('#ledermaltid_3').html( twigJSlederemaltid.render( {ledere: data.ledere, maltid_selected: data.gjester.fylke2} ) );
		} else {
			alert('En feil oppsto ved lagring. Prøv igjen, evt kontakt UKM Norge om problemet vedvarer');
			jQuery('#middagsgjester_save').html('Lagre');
		}
		jQuery('#middagsgjester_save').addClass('btn-success').removeClass('btn-info');	
	});
});


// SEND INN KONTROLLSKJEMA FOR INNSLAG
jQuery(document).on('click', '.submitKontroll', function(){
	jQuery(this).html('Lagrer...').addClass('btn-info').removeClass('btn-default');
	var form = jQuery(this).parents('form');
	var innslag = form.parents('tr.videresend_item');
	var data = { 	'action': 'UKMvideresending_festival_ajax',
					'subaction':'kontrollskjema',
					'selector': innslag.attr('id'),
					'ID': innslag.attr('data-id')
				};
				
	form.find('input, textarea, select, radio').each(function(){
		data[ jQuery(this).attr('name') ] = jQuery(this).val();
	});
	
	jQuery.post(ajaxurl, data, function(response){
		var data = jQuery.parseJSON( response );
		var innslag = jQuery('#'+data.selector);
		var button = innslag.find('.submitKontroll');

		if( data.success ) {
			button.html('Lagret!');
			
			if( innslag.attr('data-template') == 'tittel' ) {
				innslag.find('span.tittel').html( data.tittel_tittel );
			}
			setTimeout(function(){button.html('Lagre endringer i informasjon')},2000);
		} else {
			alert('En feil oppsto ved lagring. Prøv igjen, evt kontakt UKM Norge om problemet vedvarer');
			button.html('Lagre endringer i informasjon');
		}
		button.addClass('btn-default').removeClass('btn-info');	
	});
});

jQuery(document).on('click', '#hvaErUnike', function(e){
	e.preventDefault();
	jQuery('#ledere_content').slideUp();
	jQuery('#ledere_modal').html( twigJSalertunikepersoner.render() ).slideDown();
});

// NATTLEDERE
jQuery(document).on('click', '#sove_nattledere', function(){
	console.log('sove_nattledere pushed.');
	jQuery(document).trigger('lagre_nattleder');
});

jQuery(document).on('ready', function() {
	jQuery(document).trigger('leder_lagret');
});

jQuery(document).on('lagre_nattleder', function() {
	
	console.log('Lagrer nattledere.');
	jQuery('#sove_nattledere').html('Lagrer...').addClass('btn-info').removeClass('btn-default');

	var data = {
		action: 'UKMvideresending_festival_ajax',
		subaction: 'leder_nattleder_save', 
	};
	
	jQuery('.nattleder').each(function() {
		var key = jQuery(this).attr('id').replace('nattleder_','natt_');
		nattledere[ key ] = jQuery(this).val();
		data[ jQuery(this).attr('id') ] = jQuery(this).val();
	});

	jQuery.post(ajaxurl, data, function(response) {
		jQuery('#sove_nattledere').html('Lagret!').addClass('btn-success').removeClass('btn-info');
		jQuery(document).trigger('rekalkuler_advarsler', [warn_ledere, warn_hotelldogn]);
		setTimeout(function(){jQuery('#sove_nattledere').html('Lagre hovedledere')},2000);
	});

});
