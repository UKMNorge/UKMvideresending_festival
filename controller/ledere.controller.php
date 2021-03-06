<?php
require_once( PLUGIN_DIR_PATH.'class/leder.class.php' );
$TWIG['dager'] = netter( $videresendtil );

// Last inn eller opprett hoved- og utstillingsleder
// HOVEDLEDER
	$hovedleder = new leder();
	$hovedleder_load = $hovedleder->load_by_type( $m->g('pl_id'), $videresendtil->ID, 'hoved');
	
	if( !$hovedleder_load ) {
		$hovedleder->set('type', 'hoved');
		$hovedleder_create = $hovedleder->create( $m->g('pl_id'), $videresendtil->ID, get_option('season'));
	}

// UTSTILLINGSLEDER
	$utstillingleder = new leder();
	$utstillingleder_load = $utstillingleder->load_by_type( $m->g('pl_id'), $videresendtil->ID, 'utstilling');
	
	if( !$utstillingleder_load ) {
		$utstillingleder->set('type', 'utstilling');
		$utstillingleder_create = $utstillingleder->create( $m->g('pl_id'), $videresendtil->ID, get_option('season'));
	}

$TWIG['ledere'][] = $hovedleder;
$TWIG['ledere'][] = $utstillingleder;

$ledere = new SQL("SELECT `l_id`
					FROM `smartukm_videresending_ledere_ny`
					WHERE `pl_id_from` = '#pl_from'
					AND `pl_id_to` = '#pl_to'
					AND `season` = '#season'
					AND (`l_type` != 'utstilling' AND `l_type` != 'hoved')",
				array(	'pl_from' => $m->g('pl_id'),
						'pl_to' => $videresendtil->ID,
						'season' => get_option('season'),
					)
				);
$res = $ledere->run();

while( $r = SQL::fetch( $res ) ) {
	$TWIG['ledere'][] = new leder( $r['l_id'] );
}


$TWIG['sove'] = new stdClass();
$sql = new SQL("SELECT `systemet_overnatting_spektrumdeltakere`,
						`avvik_overnatting_spektrumdeltakere`,
						`overnatting_spektrumdeltakere`,
						`overnatting_kommentar`
				FROM `smartukm_videresending_infoskjema`
				WHERE `pl_id` = '#pl_to'
				AND `pl_id_from` = '#pl_from'",
			array( 'pl_to' => $videresendtil->ID,
					'pl_from' => $m->g('pl_id')
				)
			);
$res = $sql->run();
if( $res && mysql_num_rows( $res ) > 0 ) {
	$r = SQL::fetch( $res );
	$TWIG['sove']->system_deltakere = $r['systemet_overnatting_spektrumdeltakere'];
	$TWIG['sove']->deltakere = $r['overnatting_spektrumdeltakere'];
	$TWIG['sove']->kommentar = $r['overnatting_kommentar'];
} else {
	$TWIG['sove']->system_deltakere = 0;
	$TWIG['sove']->deltakere = 0;
}

// Hovedledere natt
$TWIG['nattledere'] = array();
foreach( $TWIG['dager'] as $dag ) {
	$TWIG['nattledere'][ $dag->dag .'_'. $dag->mnd ] = 'null';
}
$sql = new SQL("SELECT * FROM `smartukm_videresending_ledere_nattleder`
				WHERE `pl_id_from` = '#plid'",
				array('plid' => $m->get('pl_id') )
			   );
$res = $sql->run();
if( $res ) {
	while( $r = SQL::fetch( $res ) ) {
		$TWIG['nattledere'][ $r['dato'] ] = $r['l_id'];
	}
}

// LEDERMIDDAG
$TWIG['middagsgjester'] = middagsgjester( $videresendtil, $m );