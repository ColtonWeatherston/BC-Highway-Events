function getData(queryURL) {
	$.ajax({
		type: "GET",
		url: queryURL,
		success: function(data, status, xhr){
		responseCode = xhr.status;
		if (responseCode == "200") {
			$('#tableRadio').removeAttr('disabled');
			$('#cardRadio').removeAttr('disabled');
			$('#submitError').hide();
			$('#submit').removeClass('disabled');
			$('#submit').removeAttr('disabled');
			$('#submit').html('View Events');
	   var myObj = data;
	   var result = "";
	   if (myObj.events.length == 0) {
			result = '<div class="alert alert-danger d-flex align-items-center" role="alert"><svg class="bi flex-shrink-0 me-2" width="24" height="24" role="img" aria-label="Danger:"><use xlink:href="#exclamation-triangle-fill"/></svg><div>No events were found matching your criteria</div></div>';
	   }
	   else {
			if ($("input[name='viewRadio']:checked").val() == "table") {
				result = "<thead class=\"table-light\"><tr><th>Route</th><th>Segment</th><th>Type</th><th>Severity</th><th>Description</th><th>Created</th><th>Last Updated</th><th>More Details</th></tr></thead>";
			}
			else {
				result = '<div class="row row-cols-1 row-cols-md-2 g-4">';
			}
		}
		// PARSE JSON myObj (in data) and insert into variable "result"
		for (x in myObj.events) {
			for (j in myObj.events[x].roads) {
				var dirPhrase;
				var segment;
				
				if (myObj.events[x].roads[j].direction == "BOTH") {
					dirPhrase = myObj.events[x].roads[j].direction + " DIRECTIONS";
				}
				else if (myObj.events[x].roads[j].direction == "N") {
					dirPhrase = "NORTHBOUND";
				}
				else if (myObj.events[x].roads[j].direction == "S") {
					dirPhrase = "SOUTHBOUND";
				}
				else if (myObj.events[x].roads[j].direction == "W") {
					dirPhrase = "WESTBOUND";
				}
				else if (myObj.events[x].roads[j].direction == "E") {
					dirPhrase = "EASTBOUND";
				}
				else if (myObj.events[x].roads[j].direction == "NONE") {
					dirPhrase = "";
				}
				else {
					dirPhrase = myObj.events[x].roads[j].direction;
				}
				
				if (typeof myObj.events[x].roads[j].to === 'undefined') {
					segment = myObj.events[x].roads[j].from;
				}
				else {
					segment = myObj.events[x].roads[j].from + " to " + myObj.events[x].roads[j].to;
				}
				
				myObj.events[x].event_type = (myObj.events[x].event_type).replace("_", " ");
				
				for (let i = 0; i < myObj.events[x].event_subtypes.length; i++) {
					myObj.events[x].event_subtypes[i] = myObj.events[x].event_subtypes[i].replace("_", " ");
				}
				
				if ($("input[name='viewRadio']:checked").val() == "table") {
					// Sets table row colour to RED if event is MAJOR
					if (myObj.events[x].severity == 'MAJOR') {
						result += "<tr class=\"table-danger\"><td>" + myObj.events[x].roads[j].name + " " + dirPhrase + "</td><td>" + segment + "</td><td>" + myObj.events[x].event_type + " - " + myObj.events[x].event_subtypes + "</td>" + "<td>" + myObj.events[x].severity + "</td>" + "<td>" +  myObj.events[x].description + "</td><td>" + ((myObj.events[x].created).replace("T", " ")).slice(0, 19) + "</td><td>" + ((myObj.events[x].updated).replace("T", " ")).slice(0, 19) + "</td><td><a href=\"https://www.drivebc.ca/~" + (myObj.events[x].id).slice(11) + "\" class=\"btn btn-info\" target=\"_blank\">Link</a></td></tr>";
					}
					else {
						result += "<tr><td>" + myObj.events[x].roads[j].name + " " + dirPhrase + "</td><td>" + segment + "</td><td>" + myObj.events[x].event_type + " - " + myObj.events[x].event_subtypes + "</td>" + "<td>" + myObj.events[x].severity + "</td>" + "<td>" +  myObj.events[x].description + "</td><td>" + ((myObj.events[x].created).replace("T", " ")).slice(0, 19) + "</td><td>" + ((myObj.events[x].updated).replace("T", " ")).slice(0, 19) + "</td><td><a href=\"https://www.drivebc.ca/~" + (myObj.events[x].id).slice(11) + "\" class=\"btn btn-info\" target=\"_blank\">Link</a></td></tr>";
					}
				}
				else {
					// Sets card colour to RED if event is MAJOR
					if (myObj.events[x].severity == 'MAJOR') {
						result += '<div class="col"><div class="card text-bg-danger"><div class="card-body"><h5 class="card-title">' + myObj.events[x].roads[j].name + ' ' + dirPhrase + '</h5>' + '<h6 class="card-subtitle mb-2 text-black">' + segment + '</h6>' + '<p class="card-text">' + myObj.events[x].description + '</p>' + '<a href="https://www.drivebc.ca/~' + (myObj.events[x].id).slice(11) + '" class="btn btn-info" target="_blank">More Details</a><br><br><div class="card-footer text-black"> Event Type: ' + myObj.events[x].event_type + " - " + myObj.events[x].event_subtypes + '<br>Last Updated: ' + ((myObj.events[x].updated).replace("T", " ")).slice(0, 19) + '</div>' + '</div></div></div>';
					}
					else {
						result += '<div class="col"><div class="card"><div class="card-body"><h5 class="card-title">' + myObj.events[x].roads[j].name + ' ' + dirPhrase + '</h5>' + '<h6 class="card-subtitle mb-2 text-muted">' + segment + '</h6>' + '<p class="card-text">' + myObj.events[x].description + '</p><a href="https://www.drivebc.ca/~' + (myObj.events[x].id).slice(11) + '" class="btn btn-info" target="_blank">More Details</a>' + '<br><br><div class="card-footer text-muted"> Event Type: ' + myObj.events[x].event_type + " - " + myObj.events[x].event_subtypes + '<br>Last Updated: ' + ((myObj.events[x].updated).replace("T", " ")).slice(0, 19) + '</div>' + '</div></div></div>';
					}
				}
			}
		}
		if ($("input[name='viewRadio']:checked").val() == "table") {
			$('#resultCardView').hide();
			$('#resultTableView').show();
			$('#resultTable').html(result);
		}
		else {
			$('#resultTableView').hide();
			$('#resultCardView').show();
			$('#resultCardView').html(result);
		}
	}
	},
	error: function(xhr, status, error){
		console.error(xhr);
		if (xhr.status == "400") {
			$('#tableRadio').removeAttr('disabled');
			$('#cardRadio').removeAttr('disabled');
			$('#submit').removeClass('disabled');
			$('#submit').removeAttr('disabled');
			$('#submit').html('Submit');
			$('#submitError').html('<div class="alert alert-danger d-flex align-items-center" role="alert"><svg class="bi flex-shrink-0 me-2" width="24" height="24" role="img" aria-label="Danger:"><use xlink:href="#exclamation-triangle-fill"/></svg><div><strong>(API Error 400 - Bad Request)</strong> Likely an invalid query. Please try again.</div></div>');
			$('#submitError').show();
		}
		else if (xhr.status == "401") {
			$('#tableRadio').removeAttr('disabled');
			$('#cardRadio').removeAttr('disabled');
			$('#submit').removeClass('disabled');
			$('#submit').removeAttr('disabled');
			$('#submit').html('Submit');
			$('#submitError').html('<div class="alert alert-danger d-flex align-items-center" role="alert"><svg class="bi flex-shrink-0 me-2" width="24" height="24" role="img" aria-label="Danger:"><use xlink:href="#exclamation-triangle-fill"/></svg><div><strong>(API Error 401 - Forbidden)</strong> Invalid Credentials. Please try again.</div></div>');
			$('#submitError').show();
		}
		else if (xhr.status == "404") {
			$('#tableRadio').removeAttr('disabled');
			$('#cardRadio').removeAttr('disabled');
			$('#submit').removeClass('disabled');
			$('#submit').removeAttr('disabled');
			$('#submit').html('Submit');
			$('#submitError').html('<div class="alert alert-danger d-flex align-items-center" role="alert"><svg class="bi flex-shrink-0 me-2" width="24" height="24" role="img" aria-label="Danger:"><use xlink:href="#exclamation-triangle-fill"/></svg><div><strong>(API Error 404 - Not Found)</strong> The Endpoint URL could not be found. Please try again.</div></div>');
			$('#submitError').show();
		}
		else if (xhr.status == "429") { // If API responds with "too many requests" error
			$('#tableRadio').removeAttr('disabled');
			$('#cardRadio').removeAttr('disabled');
			$('#submit').removeClass('disabled');
			$('#submit').removeAttr('disabled');
			$('#submit').html('View Events');
			$('#submitError').html('<div class="alert alert-danger d-flex align-items-center" role="alert"><svg class="bi flex-shrink-0 me-2" width="24" height="24" role="img" aria-label="Danger:"><use xlink:href="#exclamation-triangle-fill"/></svg><div><strong>(API Error 429 - Too many requests)</strong> Please wait 30 seconds and try again.</div></div>');
			$('#submitError').show();
		} else { // unhandled error
			$('#tableRadio').removeAttr('disabled');
			$('#cardRadio').removeAttr('disabled');
			$('#submit').removeClass('disabled');
			$('#submit').removeAttr('disabled');
			$('#submit').html('View Events');
			$('#submitError').html('<div class="alert alert-danger d-flex align-items-center" role="alert"><svg class="bi flex-shrink-0 me-2" width="24" height="24" role="img" aria-label="Danger:"><use xlink:href="#exclamation-triangle-fill"/></svg><div><strong>(Unhandled exception)</strong> Please try again.</div></div>');
			$('#submitError').show();
		}
	}
});
}

$("#areaSelect").change(function() {
	if ($("#areaSelect").val() == "2") { // Vancouver Island
		$("#highwaySelect").html('<option value="all" selected>All</option>\
								<option value="Highway%201">Highway 1 (Trans-Canada Hwy)</option>\
								<option value="Highway%201A">Highway 1A (Chemainus Rd)</option>\
								<option value="Highway%204">Highway 4 (Alberni/Pacific Rim Hwy</option>\
								<option value="Highway%204A">Highway 4A (Old Alberni Hwy)</option>\
								<option value="Highway%2014">Highway 14 (Sooke Rd/West Coast Rd)</option>\
								<option value="Highway%2017">Highway 17 (Pat Bay Hwy)</option>\
								<option value="Highway%2017A">Highway 17A (West Saanich Rd/Wain Rd)</option>\
								<option value="Highway%2018">Highway 18 (Cowichan Valley Hwy)</option>\
								<option value="Highway%2019">Highway 19 (Nanaimo Pkwy/Inland Island Hwy/North Island Hwy)</option>\
								<option value="Highway%2019A">Highway 19A (Old Island Hwy N)</option>\
								<option value="Highway%2028">Highway 28 (Gold River Hwy)</option>\
								<option value="Highway%2030">Highway 30 (Port Alice Rd)</option>');
	}
	else if ($("#areaSelect").val() == "1") { // Lower Mainland
		$("#highwaySelect").html('<option value="all" selected>All</option>\
								<option value="Highway%201">Highway 1 (Trans-Canada Hwy)</option>\
								<option value="Highway%207">Highway 7 (Lougheed Highway)</option>\
								<option value="Highway%207A">Highway 7A</option>\
								<option value="Highway%207B">Highway 7B (Mary Hill Bypass)</option>\
								<option value="Highway%2010">Highway 10</option>\
								<option value="Highway%2011">Highway 11 (Sumas Way/Abbotsford-Mission Hwy)</option>\
								<option value="Highway%2013">Highway 13 (264th St/Aldergrove-Bellingham Hwy)</option>\
								<option value="Highway%2015">Highway 15 (Pacific Hwy/176th St)</option>\
								<option value="Highway%2017">Highway 17 (SFPR)</option>\
								<option value="Highway%2017A">Highway 17A</option>\
								<option value="Highway%2091">Highway 91 (East-West Connector/Annacis Hwy)</option>\
								<option value="Highway%2091A">Highway 91A (Queensborough Connector)</option>\
								<option value="Highway%2099">Highway 99</option>');
	}
	else if ($("#areaSelect").val() == "6") { // Thompson-Nicola
		$("#highwaySelect").html('<option value="all" selected>All</option>\
								<option value="Highway%201">Highway 1 (Trans-Canada Hwy)</option>\
								<option value="Highway%205">Highway 5 (Coquihalla/Yellowhead Hwy)</option>\
								<option value="Highway%205A">Highway 5A (Merritt-Princeton/Princeton-Kamloops Hwy)</option>\
								<option value="Highway%208">Highway 8 (Merritt-Spences Bridge Hwy)</option>\
								<option value="Highway%2012">Highway 12 (Lytton-Lillooet Hwy)</option>\
								<option value="Highway%2097C">Highway 97C (Okanagan Connector)</option>\
								<option value="Highway%2097C">Highway 97D (Meadow Creek Rd)</option>');
	}
});

$(document).ready(function(){
	$("#areaSelect").trigger("change");
	
	$("#submit").click(function(){
		var responseCode;
		var postData;
		var queryURL = 'https://api.open511.gov.bc.ca/events?';

		$('#tableRadio').attr('disabled', true);
		$('#cardRadio').attr('disabled', true);
		$('#submit').addClass('disabled');
		$('#submit').attr('disabled', true);
		$('#submit').html('<span class="spinner-border spinner-border-sm" role="status" aria-hidden="true"></span> Loading...');
		
		if ($('#highwaySelect').val() == 'all') {
			if  ($('#severitySelect').val() == 'all') {
				queryURL += "area_id=drivebc.ca/" + $('#areaSelect').val();
			}
			else {
				queryURL += "area_id=drivebc.ca/" + $('#areaSelect').val() + "&severity=" + $('#severitySelect').val();
			}
		}
		else {
			if  ($('#severitySelect').val() == 'all') {
				queryURL += "area_id=drivebc.ca/" + $('#areaSelect').val() + "&road_name=" + $('#highwaySelect').val();
			}
			else {
				queryURL += "area_id=drivebc.ca/" + $('#areaSelect').val() + "&road_name=" + $('#highwaySelect').val() + "&severity=" + $('#severitySelect').val();
			}
		}
		
		getData(queryURL);
	});
});