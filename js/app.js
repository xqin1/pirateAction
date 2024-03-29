var m, interaction, mm = com.modestmaps;
var baselayer = 'fcc.map-rons6wgv';
var activelayer = 'fcc.pirate';
var layers = [activelayer];
var actionDetails = {
  state: '',
  statename: ''
}


wax.tilejson('http://api.tiles.mapbox.com/v3/' + layers + '.jsonp', function (tilejson) {
  tilejson.minzoom = 3;
  tilejson.maxzoom = 5;
 // b = new mm.Map('map', new wax.mm.connector(tilejson), null, null);
  m = new mm.Map('map', new wax.mm.connector(tilejson), null, [
  new mm.MouseHandler(), new mm.TouchHandler()]);
  m.setCenterZoom(new mm.Location(38, -76), 4);
  tilejson.attribution = 'Maps made with open source <a href="http://tilemill.com" target="_blank"> TileMill</a>.  ' + ' Data from <a href="http://www.fcc.gov">FCC</a>.';
  myTooltip = new wax.tooltip;

  myTooltip.getTooltip = function (feature, context) {
	 // console.log(feature);
    return $('#tooltips').html('<div class="inner">' + showTableContent(feature) + '</div>').get(2);
  }
	
  myTooltip.click = function (feature, context) {
    myTooltip.getTooltip(feature, context);
    initTblSort();
  }
	
  myTooltip.hideTooltip = function (feature, context) {
    $('#tooltips').html('');
  }

  interaction = wax.mm.interaction(m, tilejson, {
    callbacks: myTooltip,
    clickAction: ['full', 'teaser', 'location']
  });
//  m.addCallback("zoomed", function (m) {
//    b.setCenterZoom(m.getCenter(), m.getZoom());
//    //console.log(m.getZoom());
//  });
  m.setProvider(new wax.mm.connector(tilejson));
  wax.mm.attribution(m, tilejson).appendTo(m.parent);
  wax.mm.zoomer(m, tilejson).appendTo($('#controls')[0]);
  wax.mm.bwdetect(m, {
    auto: true,
    png: '.png64?'
  });
});




function refreshMap(layers) {

  wax.tilejson('http://api.tiles.mapbox.com/v3/' + layers + '.jsonp', function (tilejson) {
    tilejson.minzoom = 3;
    tilejson.maxzoom = 5;
    m.setProvider(new wax.mm.connector(tilejson));
    window.setTimeout(function () {
     // b.setProvider(new wax.mm.connector(tilejson));
    }, 500);
    m.setCenterZoom(new mm.Location(38, -76), 4);
   // $('#tooltips').empty();
    interaction.remove();
    legend = wax.mm.legend(m, tilejson).appendTo(document.getElementById('tooltips'));
    interaction = wax.mm.interaction(m, tilejson, {
      callbacks: myTooltip,
      clickAction: ['full', 'teaser', 'location']
    });
  });
}

function showTableContent(feature) {
  var features = feature.split(' ');
  var state = features[0];
  var num = features[1];
  var type = features[features.length - 1].split("-")[0];
  var action = features[features.length - 1].split("-")[1];
  var statename = "";
  var content = " ";
  var typeByState = getTypeByState(state);
  var numPercent = (num * 100) / data.features.length;

  actionDetails.state = state;
  
	for (i = 0; i < features.length; i++) {
    if (i != 0 && i != 1 && i != features.length - 1) {
      statename += features[i] + " ";
    }
  }
	
	actionDetails.statename = statename;
	
  if (type == "alltype") {
    content += "<h2>Pirate action details in " + statename + "</h2>";
    content += "<h4>Total pirate action cases: <span class='red'>" + num + "</span></h4>";
    content += "<h4>Percent of total cases: <span class='red'>" + parseFloat(numPercent).toFixed(1) + "%</span></h4>";
    content += "<table id='tbl-summary'><tr><th>Type</th><th>Cases</th><th>Amount</th></tr>";

    if (typeByState[0] == 0) {
      content += "<tr><td>NAL</td>";
    } else {
      content += "<tr><td><a id='nal' class='lnk-actionDetails' href='#void'>NAL</a></td>";
    }

    content += "<td>" + typeByState[0] + "</td>";
    content += "<td>$" + typeByState[1] + "</td></tr>";

    if (typeByState[2] == 0) {
      content += "<tr><td>NOUO</td>";
    } else {
      content += "<tr><td><a id='nouo' class='lnk-actionDetails' href='#void'>NOUO</a></td>";
    }

    /*content +="<tr><td>NOUO</td>";*/
    content += "<td>" + typeByState[2] + "</td>";
    content += "<td>$" + typeByState[3] + "</td></tr>";

    if (typeByState[4] == 0) {
      content += "<tr><td>FORFEITURE ORDER</td>";
    } else {
      content += "<tr><td><a id='forf_order' class='lnk-actionDetails' href='#void'>FORFEITURE ORDER</a></td>";
    }

    /*content +="<tr><td>FORFEITURE ORDER</td>";*/
    content += "<td>" + typeByState[4] + "</td>";
    content += "<td>$" + typeByState[5] + "</td></tr>"

    if (typeByState[6] == 0) {
      content += "<tr><td>M.O.&amp;O.</td>";
    } else {
      content += "<tr><td><a id='moo' class='lnk-actionDetails' href='#void'>M.O.&O.</a></td>";
    }

    /*content +="<tr><td>M.O.&amp;O.</td>";*/
    content += "<td>" + typeByState[6] + "</td>";
    content += "<td>$" + typeByState[7] + "</td></tr>"


    if (typeByState[8] == 0) {
      content += "<tr><td>ORDER & CONSENT DECREE</td>";
    } else {
      content += "<tr><td><a id='cd' class='lnk-actionDetails' href='#void'>ORDER & CONSENT DECREE</a></td>";
    }

    /*content +="<tr><td>ORDER & CONSENT DECREE</td>";*/
    content += "<td>" + typeByState[8] + "</td>";
    content += "<td>$" + typeByState[9] + "</td></tr>"
    
    if (typeByState[10] == 0) {
        content += "<tr><td>NOV</td>";
      } else {
        content += "<tr><td><a id='nov' class='lnk-actionDetails' href='#void'>NOV</a></td>";
      }

      /*content +="<tr><td>ORDER & CONSENT DECREE</td>";*/
      content += "<td>" + typeByState[10] + "</td>";
      content += "<td>$" + typeByState[11] + "</td></tr>"
    
      if (typeByState[12] == 0) {
          content += "<tr><td>ERRATUM</td>";
        } else {
          content += "<tr><td><a id='erratum' class='lnk-actionDetails' href='#void'>ERRATUM</a></td>";
        }

        /*content +="<tr><td>ORDER & CONSENT DECREE</td>";*/
        content += "<td>" + typeByState[12] + "</td>";
        content += "<td>$" + typeByState[13] + "</td></tr>"
    
    
    content += "</table>";
  } else if (type == "nal") {
    content += "<h2>Pirate NAL action details in " + statename + "</h2>";
    content += "<h4>Total pirate NAL action cases: <span class='red'>" + num + "</span></h4>";
    content += "<h4>Total amount of NAL: <span class='red'>$" + typeByState[1] + "</span></h4>"
    content += "<em>Click for a breakdown of all NAL actions.</em>";
    if (action == "click") {
      content += getActionDetails(state, type);
    }
  } else if (type == "nouo") {
    content += "<h2>Pirate NOUO action details in " + statename + ":</h2>";
    content += "<h4>Total pirate NOUO action cases: <span class='red'>" + num + "</span></h4>";
    content += "<em>Click for a breakdown of all NOUO actions.</em>";
    if (action == "click") {
      content += getActionDetails(state, type);
    }
  } else if (type == "forf_order") {
    content += "<h2>Pirate Forfeiture Order action details in " + statename + ":</h2>";
    content += "<h4>Total pirate Forfeiture Order action cases: <span class='red'>" + num + "</span></h4>";
    content += "<h4>Total amount of Forfeiture Order: <span class='red'>$" + typeByState[5] + "</span></h4>"
    content += "<em>Click for a breakdown of all Forfeiture Order actions.</em>";
    if (action == "click") {
      content += getActionDetails(state, type);
    }
  } else if (type == "other") {
    var totalAmount = typeByState[7] + typeByState[9];
    content += "<h2>Pirate Other type action details in " + statename + ":</h2>";
    content += "<h4>Total pirate Other type action cases: <span class='red'>" + num + "</span></h4>";
    content += "<h4>Total amount of Other type: <span class='red'>$" + totalAmount + "</span></h4>"
    content += "<em>Click for a breakdown of all Other type actions.</em>";
    if (action == "click") {
      content += getActionDetails(state, type);
    }
  }

  return content;
}

function showSubCatTableContent(type){
 $('#tooltips').html('');
  var num = 0;
  var amount=0;
  var content = "";
  var typeName;
  switch (type) {
      case 'nal': {
          typeName = 'NAL'
          break;
        }
      case 'nouo': {
          typeName = 'NOUO'
          break;
        }
      case 'forforder': {
          typeName = 'Forfeiture Order'
          break;
        }
      case 'other': {
          typeName = 'Other'
          break;
        }
    }
  var features = data.features;
  for (i = 0; i < features.length; i++) {
    if (typeName == "NAL") {
      if (features[i].properties.actiontype == "NAL") {
        num++;
        amount += features[i].properties.amount;
      }
    } 
    else  if (typeName == "NOUO") {
        if (features[i].properties.actiontype == "NOUO") {
          num++;
          amount += features[i].properties.amount;
        }
    } 
    else if (typeName == "Forfeiture Order"){
        if (features[i].properties.actiontype == "FO") {
          num++;
          amount += features[i].properties.amount;
        }
    } 
    else if (typeName == "Other"){
        if (features[i].properties.actiontype == "M.O.&O." || 
                features[i].properties.actiontype == "CD" ||
                features[i].properties.actiontype == "NOV" ||
                features[i].properties.actiontype == "ERRATUM") {
            num++;
            amount += features[i].properties.amount;
        }
    }    
  }
  if (type != "all"){
       content += "<h2>Pirate " + typeName +" action details in United State</h2>";
        content += "<h4>Total pirate " + typeName + " action cases: <span class='red'>" + num + "</span></h4>";
        content += "<h4>Total amount of " + typeName + ": <span class='red'>$" + amount + "</span></h4>";
  }

    return content;
}

function getTypeByState(state) {
  var typeByState = [];
  var nalNum = 0,
    nalAmount = 0,
    nouoNum = 0,
    nouoAmount = 0,
    forfNum = 0;
  forfAmount = 0, mooNum = 0, mooAmount = 0, ocdNum = 0, ocdAmount = 0,novNum=0,novAmount=0,erratumNum=0,erratumAmount=0;
  var features = data.features;
  for (i = 0; i < features.length; i++) {
    if (features[i].properties.state == state) {
      if (features[i].properties.actiontype == "NAL") {
        nalNum++;
        nalAmount += features[i].properties.amount;
      } else if (features[i].properties.actiontype == "NOUO") {
        nouoNum++;
        nouoAmount += features[i].properties.amount;
      } else if (features[i].properties.actiontype == "FO") {
        forfNum++;
        forfAmount += features[i].properties.amount;
      } else if (features[i].properties.actiontype == "M.O.&O.") {
        mooNum++;
        mooAmount += features[i].properties.amount;
      } else if (features[i].properties.actiontype == "CD") {
        ocdNum++;
        ocdAmount += features[i].properties.amount;
      }
      	else if (features[i].properties.actiontype == "NOV") {
        novNum++;
        novAmount += features[i].properties.amount;
      }
      	else if (features[i].properties.actiontype == "ERRATUM") {
        erratumNum++;
        erratumAmount += features[i].properties.amount;
      }

    }
  }
  typeByState.push(nalNum);
  typeByState.push(nalAmount);
  typeByState.push(nouoNum);
  typeByState.push(nouoAmount);
  typeByState.push(forfNum);
  typeByState.push(forfAmount);
  typeByState.push(mooNum);
  typeByState.push(mooAmount);
  typeByState.push(ocdNum);
  typeByState.push(ocdAmount);
  typeByState.push(novNum);
  typeByState.push(novAmount);
  typeByState.push(erratumNum);
  typeByState.push(erratumAmount);
  return typeByState;
}

function getActionDetails(state, type) {
  console.log(state + " " + type)
  var content = "";
  var features = data.features;
  if (type == "all"){
    return content;
  }

  var dataType="other";
  switch (type){
  	case "nal":
  		dataType="NAL";
  		break;
  	case "nouo":
  		dataType="NOUO";
  		break;
  	case "forf_order":
  		dataType="FO";
  		break;
    case "forforder":
      dataType="FO";
      break;
  	case "moo":
  		dataType="M.O.&O.";
  		break;
  	case "cd":
  		dataType="CD";
  		break;
  	case "nov":
  		dataType="NOV";
  		break;
  	case "erratum":
  		dataType="ERRATUM";
  		break;
  	default:
  		break; 			
  }
  
  //console.log(state,dataType);
  if (state != "allstates"){
    content += "<table id='tbl-actionDetails' class='tablesorter'><thead><tr><th><div class='sort-wrapper'>File &nbsp;<span class='sort'></span></div></th><th><div class='sort-wrapper'>Date &nbsp;<span class='sort'></span></div></th><th><div class='sort-wrapper'>Name &nbsp;<span class='sort'></span></div></th><th><div class='sort-wrapper'>City &nbsp;<span class='sort'></span></div></th><th><div class='sort-wrapper'>Amt. &nbsp;<span class='sort'></span></div></th><th>URL</th></tr></thead>";
     if (dataType != "other"){
       for (i = 0; i < features.length; i++) {
            if (features[i].properties.state == state && features[i].properties.actiontype == dataType) {
              content += "<tr><td>" + features[i].properties.caseno + "</td>";
              content += "<td>" + features[i].properties.date + "</td>";
              content += "<td>" + features[i].properties.casename + "</td>";
              content += "<td>" + features[i].properties.city + "</td>";
              content += "<td>$" + features[i].properties.amount + "</td>";
              content += "<td><a href='" + features[i].properties.url + "' target='_blank'>link</a></td></tr>";
            }
        } 
     }
     else{
       for (i = 0; i < features.length; i++) {
            if (features[i].properties.state == state && features[i].properties.actiontype != "NAL" && features[i].properties.actiontype != "NOUO" && features[i].properties.actiontype != "FO") {
              content += "<tr><td>" + features[i].properties.caseno + "</td>";
              content += "<td>" + features[i].properties.date + "</td>";
              content += "<td>" + features[i].properties.casename + "</td>";
              content += "<td>" + features[i].properties.city + "</td>";
              content += "<td>$" + features[i].properties.amount + "</td>";
              content += "<td><a href='" + features[i].properties.url + "' target='_blank'>link</a></td></tr>";
            }
        } 
      }
  }
  else{
      content += "<table id='tbl-actionDetails' class='tablesorter'><thead><tr><th><div class='sort-wrapper'>File &nbsp;<span class='sort'></span></div></th><th><div class='sort-wrapper'>Date &nbsp;<span class='sort'></span></div></th><th><div class='sort-wrapper'>Name &nbsp;<span class='sort'></span></div></th><th><div class='sort-wrapper'>State &nbsp;<span class='sort'></span></div></th><th><div class='sort-wrapper'>Amt. &nbsp;<span class='sort'></span></div></th><th>URL</th></tr></thead>";
     if (dataType != "other"){
       for (i = 0; i < features.length; i++) {
            if (features[i].properties.actiontype == dataType) {
              content += "<tr><td>" + features[i].properties.caseno + "</td>";
              content += "<td>" + features[i].properties.date + "</td>";
              content += "<td>" + features[i].properties.casename + "</td>";
              content += "<td>" + features[i].properties.state + "</td>";
              content += "<td>$" + features[i].properties.amount + "</td>";
              content += "<td><a href='" + features[i].properties.url + "' target='_blank'>link</a></td></tr>";
            }
        } 
     }
     else{
       for (i = 0; i < features.length; i++) {
            if (features[i].properties.actiontype != "NAL" && features[i].properties.actiontype != "NOUO" && features[i].properties.actiontype != "FO") {
              content += "<tr><td>" + features[i].properties.caseno + "</td>";
              content += "<td>" + features[i].properties.date + "</td>";
              content += "<td>" + features[i].properties.casename + "</td>";
              content += "<td>" + features[i].properties.state + "</td>";
              content += "<td>$" + features[i].properties.amount + "</td>";
              content += "<td><a href='" + features[i].properties.url + "' target='_blank'>link</a></td></tr>";
            }
        } 
      }
  }
  
 content += "</table>";
 return content;
  
//  if (type == "nal") {
//    content += "<table id='tbl-actionDetails' class='tablesorter'><thead><tr><th><div class='sort-wrapper'>File &nbsp;<span class='sort'></span></div></th><th><div class='sort-wrapper'>Date &nbsp;<span class='sort'></span></div></th><th><div class='sort-wrapper'>Name &nbsp;<span class='sort'></span></div></th><th><div class='sort-wrapper'>City &nbsp;<span class='sort'></span></div></th><th><div class='sort-wrapper'>Amt. &nbsp;<span class='sort'></span></div></th><th>URL</th></tr></thead>";
//    for (i = 0; i < features.length; i++) {
//      if (features[i].properties.state == state && features[i].properties.actiontype == "NAL") {
//        content += "<tr><td>" + features[i].properties.caseno + "</td>";
//        content += "<td>" + features[i].properties.date + "</td>";
//        content += "<td>" + features[i].properties.casename + "</td>";
//        content += "<td>" + features[i].properties.city + "</td>";
//        content += "<td>$" + features[i].properties.amount + "</td>";
//        content += "<td><a href='" + features[i].properties.url + "' target='_blank'>link</a></td></tr>";
//      }
//    }
//  } else if (type == "nouo") {
//    content += "<table id='tbl-nouo' class='tablesorter'><thead><tr><th><div class='sort-wrapper'>File &nbsp;<span class='sort'></span></div></th><th><div class='sort-wrapper'>Date &nbsp;<span class='sort'></span></div></th><th><div class='sort-wrapper'>Address &nbsp;<span class='sort'></span></div></th><th>URL</th></tr></thead>";
//    for (i = 0; i < features.length; i++) {
//      if (features[i].properties.state == state && features[i].properties.actiontype == "NOUO") {
//        content += "<tr><td>" + features[i].properties.file + "</td>";
//        content += "<td>" + features[i].properties.date + "</td>";
//        content += "<td>" + features[i].properties.addressee + "</td>";
//        content += "<td><a href='" + features[i].properties.url + "' target='_blank'>link</a></td></tr>";
//      }
//    }
//  } else if (type == "forf_order") {
//    content += "<table id='tbl-actionDetails' class='tablesorter'><thead><tr><th><div class='sort-wrapper'>File &nbsp;<span class='sort'></span></div></th><th><div class='sort-wrapper'>Date &nbsp;<span class='sort'></span></div></th><th><div class='sort-wrapper'>Address &nbsp;<span class='sort'></span></div></th><th><div class='sort-wrapper'>Amt. &nbsp;<span class='sort'></span></div></th><th>URL</th></tr></thead>";
//    for (i = 0; i < features.length; i++) {
//      if (features[i].properties.state == state && features[i].properties.actiontype == "FORFEITURE ORDER") {
//        content += "<tr><td>" + features[i].properties.file + "</td>";
//        content += "<td>" + features[i].properties.date + "</td>";
//        content += "<td>" + features[i].properties.addressee + "</td>";
//        content += "<td>$" + parseAmount(features[i].properties.fortamt) + "</td>";
//        content += "<td><a href='" + features[i].properties.url + "' target='_blank'>link</a></td></tr>";
//      }
//    }
//  } else if (type == "other") {
//    content += "<table id='tbl-other' class='tablesorter'><thead><tr><th><div class='sort-wrapper'>Type &nbsp;<span class='sort'></span></div></th><th><div class='sort-wrapper'>File &nbsp;<span class='sort'></span></div></th><th><div class='sort-wrapper'>Date &nbsp;<span class='sort'></span></div></th><th><div class='sort-wrapper'>Address &nbsp;<span class='sort'></span></div></th><th><div class='sort-wrapper'>Amt. &nbsp;<span class='sort'></span></div></th><th>URL</th></tr></thead>";
//    for (i = 0; i < features.length; i++) {
//      if (features[i].properties.state == state && features[i].properties.actiontype != "NAL" && features[i].properties.actiontype != "NOUO" && features[i].properties.actiontype != "FORFEITURE ORDER") {
//        content += "<tr><td>" + features[i].properties.actiontype + "</td>";
//        content += "<td>" + features[i].properties.file + "</td>";
//        content += "<td>" + features[i].properties.date + "</td>";
//        content += "<td>" + features[i].properties.addressee + "</td>";
//        content += "<td>$" + parseAmount(features[i].properties.fortamt) + "</td>";
//        content += "<td><a href='" + features[i].properties.url + "' target='_blank'>link</a></td></tr>";
//      }
//    }
//  }

}

function parseAmount(amt) {
  if (!isNaN(amt)) {
    return 0;
  } else {
    amt = amt.replace("$", "");
    amt = amt.replace(",", "");
    return parseFloat(amt);
  }
}


function initTblSort() {
  if (jQuery('#tbl-actionDetails') && jQuery('#tbl-actionDetails tbody tr').length > 1) {
    jQuery('#tbl-actionDetails').dataTable({
      "aoColumns": [
      null, null, null,null,
      {
        "sType": "currency"
      },
      null],
      "aaSorting": [
        [1, "desc"]
      ],
      "bDestroy": true,
      "bFilter": false,
      "bInfo": false,
      "bPaginate": false,
      "bLengthChange": false
    });
//  } else if (jQuery('#tbl-nouo') && jQuery('#tbl-nouo tbody tr').length > 1) {
//    jQuery('#tbl-nouo').dataTable({
//      "aaSorting": [
//        [1, "desc"]
//      ],
//      "bDestroy": true,
//      "bFilter": false,
//      "bInfo": false,
//      "bPaginate": false,
//      "bLengthChange": false
//    });
//  } else if (jQuery('#tbl-other') && jQuery('#tbl-other tbody tr').length > 1) {
//    jQuery('#tbl-other').dataTable({
//      "aaSorting": [
//        [2, "desc"]
//      ],
//      "bDestroy": true,
//      "bFilter": false,
//      "bInfo": false,
//      "bPaginate": false,
//      "bLengthChange": false
//    });
  }
}


$(document).ready(function () {
  $('.description').hide();
  $('#description-all').show();

  // Layer Selection
  jQuery('a.candidate-tab').click(function (e) {
    var actiontype = jQuery(this).attr('id');
    e.preventDefault();

    jQuery('a.candidate-tab').removeClass('active');
    jQuery(this).addClass('active');

    jQuery('.description').hide();
    jQuery('#description-' + actiontype).show();

    $('#tooltips').html('<div class="inner">' + showSubCatTableContent(jQuery(this).attr('id'))+ '</div>');
     var actionD = getActionDetails("allstates", jQuery(this).attr('id'));
      jQuery('#tooltips .inner').append('<div id="sect-actionDetails">'+ actionD + '</div>');
    initTblSort();
    

  });

  jQuery('#tooltips').on('click', '.lnk-actionDetails', function (e) {

    var type = jQuery(this).attr('id');
   // console.log(type);
		var typeName = '';
    var actionD = getActionDetails(actionDetails.state, type);
		
		e.preventDefault();
		
		switch (type) {
			case 'nal': {
					typeName = 'NAL'
					break;
				}
			case 'nouo': {
					typeName = 'NOUO'
					break;
				}
			case 'forf_order': {
					typeName = 'Forfeiture Order'
					break;
				}
			case 'other': {
					typeName = 'Other'
					break;
				}
		}
		
    jQuery('#sect-actionDetails').remove();
    jQuery('#tooltips .inner').append('<div id="sect-actionDetails"><h2>' + typeName + ' Cases in ' + actionDetails.statename + '</h2>' + actionD + '</div>');
    initTblSort();
  });
});

jQuery('ul li a').click(function (e) {
  if (!$(this).hasClass('active')) {
    jQuery('ul li a').removeClass('active');

    jQuery(this).addClass('active');
    activeLayer='';
    activeLayer = jQuery(this).attr('data-layer');
    layers = [
    //borders,
    activeLayer];
    refreshMap(layers);

  }
});
