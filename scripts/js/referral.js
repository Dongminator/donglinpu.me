$(document).ready(function($) {

	$('.card__share > a').on('click', function(e){ 
		triggerButtonClickAction(e);
    });
});


function triggerButtonClickAction (e) {
	e.preventDefault(); // prevent default action - hash doesn't appear in url
	
	//	$(this).parent().find( 'div' ).toggleClass( 'card__social--active' );
	//$(this).toggleClass('share-expanded');
	
	var buttonId = e.target.id;
	
	if (buttonId == "share_uber") {
		window.open('https://www.uber.com/invite/donglinp1');
	} else if (buttonId == "share_lyft") {
		// Want up to $20 in free ride credit on Lyft? Download now with my link. https://lyft.com/iui/DONGLIN933140
		window.open('https://lyft.com/iui/DONGLIN933140');
	} else if (buttonId == 'share_veritas') {
		location.href = "mailto:web@donglinpu.me?subject=I want to work for Veritas!";
	}
}
