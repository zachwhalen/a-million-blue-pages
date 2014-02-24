extraLabels = {
				
				'XI' : 'Introduction',
				'V' : 'Contents',
				'VI' : 'Foreword',
				'III' : 'Title Page',
				'3' : 'Chapter I',
				'8' : 'Chapter II',
				'19' : 'Chapter III',
				'24' : 'Chapter IV',
				'41' : 'Chapter V',
				'74' : 'Chapter VI',
				'80' : 'Chapter VII',
				'97' : 'Chapter VIII',
				'107' : 'Chapter IX',
				'153' : 'Chapter X',
				'246' : 'Chapter XI',
				'275' : 'Chapter XII',
				'313' : 'Chapter XIII',
				'347' : 'Chapter XIV',
				'353' : 'Chapter XV',
				'370' : 'Chapter XVI',
				'384' : 'Chapter XVII',
				'408' : 'Chapter XVIII',
				'418' : 'Chapter XIX',
				'423' : 'Chapter XX',
				'491' : 'Chapter XXI',
				'522' : 'Chapter XXII',
				'526' : 'Chapter XXIII',
				'529' : 'Exhibits',
				'538' : 'Appendix I-A',
				'541' : 'Appendix I-B',
				'548' : 'Appendix I-C',
				'553' : 'Appendix I-D',
				'555' : 'Appendix I-E',
				'557' : 'Appendix I-F',
				'568' : 'Appendix II-A',
				'573' : 'Appendix II-B',
				'581' : 'Appendix II-C',
				'584' : 'Appendix II-D', 
				'586' : 'Appendix II-E', 
				'645' : 'Appendix II-F', 
				'657' : 'Appendix III', 
				'663' : 'Index',
				'707' : 'Credits', 
				'709' : 'Yggdrasil'
				}
				
thePages = makeThePages();

function makeThePages(){
	var glom = new Array();
	var roms = new Array();
	var nums = new Array();
	var thePages = new Object();
	// array index is raw order
	// element is an object like {'703','TNR','printed'}
	glom.push('Cover', 'Cover-Flap','Inside-cover', 'Collage-Recto', 'Collage-Verso');
	for (var x = 1; x <= 26; x++){
		glom.push(romanize(x));
		roms.push(romanize(x));
	}

	for (var p = 1; p <= 710; p++){
		glom.push(p);
		nums.push(p);
	}
	glom.push('Inside-Back','Back-Cover');

	for (var g = 0; g <= glom.length; g++){
		var obj = {
			'raw' : g,
			'name' : glom[g],
			'region' : locatePage(glom[g], roms, nums),
			'label' : checkLabel(glom[g]),
			'implied' : ( ($.inArray(glom[g], ['I','II','III','IV','V','VI','VII','VIII','IX','X','XXIV','XXV','XXVI',710]) == -1) ? false : true )
		};
		thePages[g] = obj;
	}

	
	// assign each a section
	
	
	return thePages;
}

function checkLabel (g){

	if (extraLabels[g]){
		return extraLabels[g];
	}

	return false;
}

function locatePage (g, roms, nums){
	if ($.inArray(g, ['Cover', 'Cover-Flap','Inside-cover', 'Collage-Recto', 'Collage-Verso']) > -1){
		return 'front';
	}
	if ($.inArray(g, ['Inside-Back','Back-Cover']) > -1){
		return 'back';
	}
	if ($.inArray(g, roms) > -1){
		return 'intro';
	}
	if ($.inArray(g, nums) > -1){
		return 'tnr';
	}
	return false;
}




function legitPg (pg) {
	// update this to check with legitPages instead
	numbers = [];
	for (var r = 1; r <= 26; r++){
		numbers.push(romanize(r));
	}
	arabs = [];
	for (var a = 1; a <= 710; a++){
		numbers.push(''+a);
	}
	//legitPages = ['Cover', 'Cover-Flap','Inside-cover', 'Collage-Recto', 'Collage-Verso', roms, arabs, 'Inside-Back','Back-Flap','Back-Cover' ];
	legitPages = $.merge(['Cover', 'Cover-Flap','Inside-cover', 'Collage-Recto', 'Collage-Verso','Inside-Back','Back-Cover'], numbers);
	
		
	if ($.inArray(pg,legitPages) == -1){
		return false;
	}else{
		return true;
	}
}

// just make a big, reusable Pages object


// # reasons why coding makes me a better teacher






function filterBus() {
			// a generalized filtering function
			// could take an argument from URL, otherwise, runs on each click.
			// Therefore, each click should also update URL with its parameters.
			
		
			var defaultBlob  = filterBlob; // redundant probably
		
			var activeBlob = new Object();
			
			
			// parse filter state from URL
			var urlBlob = {
				'empty' : getURLParameter('empty'),
				'tag' : getURLParameter('tag'),
				'type' : getURLParameter('type'),
				'source' : getURLParameter('source'),
				'filters' : getURLParameter('filters'),
				'ts' : getURLParameter('ts')
			}
			
			
			// parse filter state from checkboxes
			var boxBlob = {
				'empty' : ($("#hide-empty").prop("checked") ? 'hide' : 'show' ),
				'tag' : checked('tag'),
				'type' : checked('type'),
				'source' : checked('source'),
				'filters' : ($("#hide-filter").prop("checked") ? 'show' : 'hide' ),
				'ts' : $("input[name='thumbsize']:checked").val()
			};
			
			//if (any url parameters are null)
			if (urlBlob.empty == "null" | urlBlob.tag == "null" | urlBlob.type == "null" | urlBlob.source == "null" | urlBlob.filters == "null" | urlBlob.ts == "null"){
			
				//load the default filter state, 
				
				activeBlob = defaultBlob;
				
	
			}else{
				if (clicked){
					//load the boxBlob, push to URL for convenience
					activeBlob = boxBlob;
				}else{
					//load the URLBlob
					activeBlob = urlBlob;
				}
			}
			
	
			
			// previous options decide how to set activeBlob, so proceed
			doChecks(activeBlob);
			doFilter(activeBlob);
			
			window.history.pushState('page', 'A Million Blue Pages', stringifyBlob(activeBlob));
	
			$("#permalink").attr('href', stringifyBlob(activeBlob));
			
}
		
		function doChecks(blob){
			// for later, a sanity check on the incoming blob would be helpful
			// check all the right boxes --- hopefully this won't create infiniti
			
			// START HERE
			
			// 1. empty
			
			if (blob.empty == 'hide'){
				$("#hide-empty").prop("checked", true);
				
			}else{
				$("#hide-empty").prop("checked", false);
			}
			
			// 2. restrict by tag
			
			if (blob.tag == 'all'){
				$("label.filter-tag input").each( function () {
					$(this).prop("checked", false);
				});
			}else{
				var tags = blob.tag.split('+');
				for (var t = 0; t <= tags.length + 1; t++){
					$("#filter-tag-"+tags[t]).prop("checked", true);
				}
			}
			
			
			// 3. type
			if (blob.type == 'all'){
				$("label.filter-type input").each( function () {
					$(this).prop("checked", false);
				});
			}else{
				var types = blob.type.split('+');
				for (var t = 0; t <= types.length + 1; t++){
					$("#filter-type-"+types[t]).prop("checked", true);
				}
			}
			
			// 4. source
			if (blob.source == 'all'){
				$("label.filter-source input").each( function () {
					$(this).prop("checked", false);
				});
			}else{
				var sources = blob.source.split('+');
				for (var t = 0; t <= sources.length + 1; t++){
					$("#filter-source-"+sources[t]).prop("checked", true);
				}
			}

			// 5. filters
			if (blob.filters == 'hide'){
				$("#hide-filter").prop("checked", false);
				
			}else{
				$("#hide-filter").prop("checked", true);
			}
			
			// 6. thumbsize
			
			if (blob.ts == 'small'){
				$("#thumb-small").prop("checked", true);
				
			}else{
				$("#thumb-larger").prop("checked", true);
			}
			
		}
		
		function stringifyBlob(blob){
			return '?empty='+blob.empty+'&tag='+blob.tag+'&type='+blob.type+'&source='+blob.source+'&filters='+blob.filters+'&ts='+blob.ts;
	
		}
		
		function doFilter(blob){

			// do filter card show hide

			if (blob.filters == 'show'){

				$("#pg-head").slideDown();
			}else{
				$("#pg-head").slideUp();

			}

			// takes filters as an argument and applies whatever is needed from the filterBus();
			
			var selective = false;
			
			var par = ['tag','type','source'];
			$(".pg-node").hide();
			console.log(blob);
			for (var p = 0; p <= 2; p++){
				var pars = blob[par[p]].split('+');
				for (var s = 0; s < pars.length; s++){
						
					var parameter = par[p];
					var value	= pars[s];

					if (value != 'all'){
						selective = true;
					}

					if (selective){
						$(".pg-node."+pars[s]).show();

					}

					

				}
			}

			if (!selective){
				$(".pg-node").show();
			}
			
			// this could be more elegant but whatever
			if (blob.ts == 'larger'){
				$("div.view").addClass("larger");
			}else{
				$("div.view").removeClass("larger");
			}
			
			// hide rows 
			// [[ do this last]]
			$("#pg-content .pg").each( function(){
				var isParent = false;
				$(this).children(".pg-node").each( function(){
					if ($(this).css('display') == 'block'){
						isParent = true;
					}
				});
				
				if (!isParent & blob.empty == 'hide'){
					$(this).hide();
				}else{
					$(this).show();
				}
			});
			
		}
		
		
		function checked(filter){
			var all = true;
			var checked = new Array();
			
			$('label.filter-' + filter).each( function () { 
				
				if ($(this).find('input').prop('checked')){
					checked.push($(this).attr('for').split('-').pop());
					all = false;
				}
			});

			if (all){
				return('all');
			}else{
				return checked.join('+');
			}
		}


		// what it says on the box
		function getURLParameter(name) {
				return decodeURI(
					(RegExp(name + '=' + '(.+?)(&|$)').exec(location.search)||[,null])[1]
				);
			}
	
		// Utility function for romanizing
		function romanize (num) {
		    if (!+num)
		        return false;
		    var digits = String(+num).split(""),
		        key = ["","C","CC","CCC","CD","D","DC","DCC","DCCC","CM",
		               "","X","XX","XXX","XL","L","LX","LXX","LXXX","XC",
		               "","I","II","III","IV","V","VI","VII","VIII","IX"],
		        roman = "",
		        i = 3;
		    while (i--)
		        roman = (key[+digits.pop() + (i * 10)] || "") + roman;
		    return Array(+digits.join("") + 1).join("M") + roman;
		}