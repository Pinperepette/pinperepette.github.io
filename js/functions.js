/* ANIMAZIONE
----------------------------------------------------------------*/
function showElements() {
	$("#wrapper").hide().removeClass("animation").fadeIn("slow");
}
setTimeout("showElements()", 5000);


/* CHART
----------------------------------------------------------------*/

google.load("visualization", "1", { packages : ["corechart"] });
google.setOnLoadCallback(drawChart);

function drawChart() {


	var data = google.visualization.arrayToDataTable([
		['Skill', 'Percent'],
		[ 'Bash' , 30],
		['C ++' , 24],
		['Java', 20],
		['Ruby', 14],
		['Python', 12]
	]);

	if ( $('#wrapper').width() >= 960 ){
		if( $('#chart').parent().parent().attr("id") == "ph04" ){
			var chart_height 	= 190;
			var chart_left		= "";
			var chart_width 	= 320;
		} else {
			var chart_height 	= 342;
			var chart_left		= 30;
			var chart_width 	= 620;
		}
	} else if  ( $('#wrapper').width() >= 700 ) {
		$('#chart > #holder').width(700).height("auto");
	} else if  ( $('#wrapper').width() >= 550 ) {
		$('#chart > #holder').width(550).height("auto");
	} else if  ( $('#wrapper').width() >= 400 ) {
		$('#chart > #holder').width(400).height(280);
	}

	if ( $.browser.msie && $.browser.version <= 8 ) {
		var chart_background 	= "#f5f5f5";
	} else{
		var chart_background 	= "transparent";
	}

	var options = {
		backgroundColor: chart_background ,
		chartArea:{
			width:"100%",
			height:"85%",
			left: chart_left
		},
		colors:['#FF8000','#8258FA', '#2E64FE', '#31B404', '#FF4000', '#FFFF00'],
		fontSize: 14,
		height: chart_height ,
		legend: {
			position: "right",
			alignment: "center",
			textStyle: {
				color: '#333',
				fontSize: 15,
			},
		},
		width: chart_width
	};

	var chart = new google.visualization.PieChart(document.getElementById('holder'));
	chart.draw(data, options);

	$("#ph01, #ph02, #ph03, #ph04, #ph05").sortable({
		connectWith : ".place_holder",
		cursor : 'move',
		handle : '.handle',
		tolerance: 'pointer',
		forceHelperSize : true,
		placeholder : "ui-state-highlight",
		revert : true,
		helper : 'clone',
		cursorAt : { left : 15, top : -2 },
		scrollSpeed: 40,
		items: '.item',
		start : function(event, ui) {
			$(".item").addClass("transitionsOff");
			$(".place_holder").addClass("increaseHeight");
			$('.place_holder:not(:has(div))').children(".arrow").addClass("visible");
		},
		sort : function(event, ui) {
			$(".place_holder").addClass("increaseHeight");
		},
		stop : function(event, ui) {
			$(".item").removeClass("transitionsOff");
			$(".place_holder").removeClass("increaseHeight");
			$('.place_holder .arrow').removeClass("visible");
			drawChart();
		},
		over: function(event, ui) {
			$(".ui-state-highlight").addClass("over")
		}
	});

	if ( $.browser.msie && $.browser.version <= 8 ) {
		$("#ph01, #ph02, #ph03, #ph04, #ph05").sortable("disable");
	}
}

$(window).resize(function() { drawChart() });
