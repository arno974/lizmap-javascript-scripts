lizMap.events.on({
	'uicreated': function(e) {		
		var buttonPermaLink = $("div#permaLink div#tab-share-permalink a#permalink");		
		buttonPermaLink.tooltip({trigger:'click'});
		buttonPermaLink.attr('data-original-title', "Lien copié");
		buttonPermaLink.click(function(e) {
			e.preventDefault();	
			var permaLinkURL = $(this).attr('href');   
			navigator.clipboard.writeText($("#input-share-permalink").val());	
			setTimeout(function(){
				buttonPermaLink.tooltip('hide');
		   	}, 2000);		
		});		
	}
});
