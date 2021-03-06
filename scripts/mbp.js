function pageRows(data) {
		
		totalNodes++;
		//console.log(data);

		var pg = data.cells.page;
		//var node = makeNode(data.cells);
		data.cells.imgthumb = false; // for non image thumbs like tweets etc which will be generically deployed from CSS
		var imgthumbs = ["photo","video","image"];
						
		//if (imgthumbs.indexOf(data.cells.type) > -1){
		if ($.inArray(data.cells.type, imgthumbs) > -1){
						data.cells.imgthumb = true;
		}

		data.cells.tags = data.cells.tags.replace(/ /,"-").replace(/,/g," "); 

		var thesetags = data.cells.tags.split(" ");

		for (var t = 0; t < thesetags.length; t++){	

			if (thesetags[t] != 'hol14'){
				if (!thesetags[t].match(/^p[0-9xiv]+/) ){
					//if (alltags.indexOf(thesetags[t]) == -1){
					if ($.inArray(thesetags[t], alltags) == -1){
					alltags.push(thesetags[t]); 
						numbers.tag[thesetags[t]] = 1;
					}else{
						numbers.tag[thesetags[t]] += 1;
					}
				}
			}
		}
		
		if ($.inArray(data.cells.source, allsources) < 0){
			allsources.push(data.cells.source);
			numbers.source[data.cells.source] = 1;
		}else{
			numbers.source[data.cells.source] += 1;

		}
		if ($.inArray(data.cells.type, alltypes) < 0){
			alltypes.push(data.cells.type);
			numbers.type[data.cells.type] = 1;
		}else{
			numbers.type[data.cells.type] += 1;
		}

		$("#p"+pg.toUpperCase()).append( template(data.cells) );
		$("#p"+pg.toUpperCase()+" .pg-label").html("<a href=\"/page.shtml?page="+pg+"\" title=\"View all items for this page\">"+pg+"</a>");
	}

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

	var activeLabel = 'Front-Matter'

	for (var g = 0; g <= glom.length; g++){

		if (extraLabels[glom[g]]){
			activeLabel = extraLabels[glom[g]];

		}

		var label = activeLabel;
		var obj = {
			'raw' : g,
			'name' : glom[g],
			'region' : locatePage(glom[g], roms, nums),
			'label' : checkLabel(glom[g]),
			'implied' : ( ($.inArray(glom[g], ['I','II','III','IV','V','VI','VII','VIII','IX','X','XXIV','XXV','XXVI',710]) == -1) ? false : true ),
			'section' : label
		};
		thePages[g] = obj;
	}

	
	// assign each a section, chapter
	// initially,

	var activeLabel = 'Front';

	for (var l = 0; l <= 742; l++){

	}
	
	
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

/* a helper, so I can refer to pages by name or raw order. */
function getPageByName(name){
	re = new RegExp(name, "i");

	for (var p = 0; p <= 742; p++){ // note, this is hardcoded. Change 742 if thePages change
	
		if (typeof thePages[p].name != 'undefined'){
			var nameSrgin = thePages[p].name + '';
			if (nameSrgin.match(re)) {

				return thePages[p];
			}
		}
	}

}


function legitPg (pg) {
	// update this to check with thePages instead
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

function legitPage(pg){
	// to replace legitPg
	// return an index for page requested if it exists in thePages.
	var requested = getPageByName(pg);
	if(typeof requested != 'undefined'){
		return thePages[requested.raw];
	}

}


function findNext(raw,pagesList){
	var next;
	for (var r = raw + 1; typeof next == 'undefined'; r++ ){	
		//console.log(r);
		//console.log(r+" "+$.inArray(String(thePages[r].name), pagesList));

		if ($.inArray(String(thePages[r].name), pagesList) > -1){
			next = thePages[r].name;
		} 
		if (r == 743){
			next = 'end';
		}
	}
	return next;
}

function findPrevious(raw,pagesList){
	var previous;
	for (var r = raw - 1; typeof previous == 'undefined'; r -= 1 ){		
		if (typeof thePages[r] == 'undefined'){
			previous = 'begin';
		}else if ($.inArray(String(thePages[r].name), pagesList) > -1){
			previous = thePages[r].name;
		} 	
	}
	return previous;
}

function filterBus() {
	console.log("filterbus");
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
		'tag' : findChecked('tag'),
		'type' : findChecked('type'),
		'source' : findChecked('source'),
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
	// This function applies the current filter object to the layout.


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
	
	// hide rows and apply labels appropriately
	// [[ do this after filers]]

	var shownLabels = new Array();
	var rowCount = 0;
	var activeLabel = 'Front-Matter';

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

		if ($(this).css("display") == 'block'){
			pageCounter++;
			if (thePages[rowCount].section != activeLabel){ 
				
				activeLabel = thePages[rowCount].section;
			}

			if ($.inArray(activeLabel,shownLabels) == -1){
				shownLabels.push(activeLabel);
				$(this).find(".extraLabel").show();
			}else{
				$(this).find(".extraLabel").hide();
			}
		}

		rowCount += 1;
	});

		
}
		
		
function findChecked(filter){
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

function sanitizeTime(stamp){
	// could be receiving times formatted in strings or in UNIX timestamps. The latter need to be converted to JS time (* 1000).

	// a bit of regex to tell what we're dealing with

	if (stamp.match(/^[0-9]{10}$/g)){
		return stamp * 1000;	
	}else{

		return Date.parse(stamp);
	}
	


}