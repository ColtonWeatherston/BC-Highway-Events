function getData(postData) {
	$.ajax({
	 type: "POST",
	 url: 'includes/getEvents.php',
	 data: postData,
	 success: function(data){
	 responseCode = data.slice(-3);
	 if (responseCode == "200" || responseCode == "201") {
	   $('#submit').removeClass('disabled');
	   $('#submit').removeAttr('disabled');
	   $('#submit').html('View Events');
	   var myObj = JSON.parse(data.slice(0, -3));
	   var result = "";
	   if (myObj.events.length == 0) {
		   result = '<div class="alert alert-danger d-flex align-items-center" role="alert"><svg class="bi flex-shrink-0 me-2" width="24" height="24" role="img" aria-label="Danger:"><use xlink:href="#exclamation-triangle-fill"/></svg><div>No events were found matching your criteria</div></div>';
	   }
	   else {
		   result = "<thead class=\"table-light\"><tr><th>Route</th><th>Segment</th><th>Type</th><th>Severity</th><th>Description</th><th>Created</th><th>Last Updated</th><th>More Details</th></tr></thead>";
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
				
				// Sets table row colour to RED if event is MAJOR
				if (myObj.events[x].severity == 'MAJOR') {
					result += "<tr class=\"table-danger\"><td>" + myObj.events[x].roads[j].name + " " + dirPhrase + "</td><td>" + segment + "</td><td>" + myObj.events[x].event_type + " - " + myObj.events[x].event_subtypes + "</td>" + "<td>" + myObj.events[x].severity + "</td>" + "<td>" +  myObj.events[x].description + "</td><td>" + ((myObj.events[x].created).replace("T", " ")).slice(0, 19) + "</td><td>" + ((myObj.events[x].updated).replace("T", " ")).slice(0, 19) + "</td><td><a href=\"https://www.drivebc.ca/~" + (myObj.events[x].id).slice(11) + "\" class=\"btn btn-info\" target=\"_blank\">Link</a></td></tr>";
				}
				else {
					result += "<tr><td>" + myObj.events[x].roads[j].name + " " + dirPhrase + "</td><td>" + segment + "</td><td>" + myObj.events[x].event_type + " - " + myObj.events[x].event_subtypes + "</td>" + "<td>" + myObj.events[x].severity + "</td>" + "<td>" +  myObj.events[x].description + "</td><td>" + ((myObj.events[x].created).replace("T", " ")).slice(0, 19) + "</td><td>" + ((myObj.events[x].updated).replace("T", " ")).slice(0, 19) + "</td><td><a href=\"https://www.drivebc.ca/~" + (myObj.events[x].id).slice(11) + "\" class=\"btn btn-info\" target=\"_blank\">Link</a></td></tr>";
				}
			}
		}
	   
	   $('#resultTable').html(result);
	 }
	 else if (responseCode == "400") {
	   $('#submit').removeClass('disabled');
	   $('#submit').removeAttr('disabled');
	   $('#submit').html('Submit');
	   $('#submitError').html('<div class="alert alert-danger d-flex align-items-center" role="alert"><svg class="bi flex-shrink-0 me-2" width="24" height="24" role="img" aria-label="Danger:"><use xlink:href="#exclamation-triangle-fill"/></svg><div>(Error 400 - Bad Request) Likely an invalid query. Please try again.</div></div>');
	 }
	 else if (responseCode == "401") {
	   $('#submit').removeClass('disabled');
	   $('#submit').removeAttr('disabled');
	   $('#submit').html('Submit');
	   $('#submitError').html('<div class="alert alert-danger d-flex align-items-center" role="alert"><svg class="bi flex-shrink-0 me-2" width="24" height="24" role="img" aria-label="Danger:"><use xlink:href="#exclamation-triangle-fill"/></svg><div>(Error 401 - Forbidden) Invalid Credentials. Please try again.</div></div>');
	 }
	 else if (responseCode == "404") {
	   $('#submit').removeClass('disabled');
	   $('#submit').removeAttr('disabled');
	   $('#submit').html('Submit');
	   $('#submitError').html('<div class="alert alert-danger d-flex align-items-center" role="alert"><svg class="bi flex-shrink-0 me-2" width="24" height="24" role="img" aria-label="Danger:"><use xlink:href="#exclamation-triangle-fill"/></svg><div>(Error 404 - Not Found) The Endpoint URL could not be found. Please try again.</div></div>');
	 }
	 },
	 error: function(xhr, status, error){
	 console.error(xhr);
	 }
	});
}

$("#areaSelect").change(function() {
	if ($("#areaSelect").val() == "2") { // Vancouver Island
		$("#highwaySelect").html('<option value="all" selected>All</option>\
								<option value="Highway%201">Highway 1 (Trans-Canada Hwy)</option>\
								<option value="Highway%204">Highway 4 (Alberni/Pacific Rim Hwy</option>\
								<option value="Highway%204A">Highway 4A (Old Alberni Hwy)</option>\
								<option value="Highway%2014">Highway 14 (Sooke Rd/West Coast Rd)</option>\
								<option value="Highway%2017">Highway 17 (Pat Bay Hwy)</option>\
								<option value="Highway%2018">Highway 18 (Cowichan Valley Hwy)</option>\
								<option value="Highway%2019">Highway 19 (Nanaimo Pkwy/Inland Island Hwy/North Island Hwy)</option>\
								<option value="Highway%2019A">Highway 19A (Old Island Hwy N)</option>');
	}
	else if ($("#areaSelect").val() == "1") { // Lower Mainland
		$("#highwaySelect").html('<option value="all" selected>All</option>\
								<option value="Highway%201">Highway 1 (Trans-Canada Hwy)</option>\
								<option value="Highway%2017">Highway 17 (SFPR)</option>\
								<option value="Highway%2017A">Highway 17A</option>\
								<option value="Highway%2091">Highway 91 (East-West Connector/Annacis Hwy)</option>\
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
		
		$('#submit').addClass('disabled');
		$('#submit').attr('disabled');
		$('#submit').html('<span class="spinner-border spinner-border-sm" role="status" aria-hidden="true"></span> Loading...');
		
		if ($('#highwaySelect').val() == 'all') {
			if  ($('#severitySelect').val() == 'all') {
				postData = {area: $('#areaSelect').val(), highway: "", severity: ""};
			}
			else {
				postData = {area: $('#areaSelect').val(), highway: "", severity: $('#severitySelect').val()};
			}
		}
		else {
			if  ($('#severitySelect').val() == 'all') {
				postData = {area: $('#areaSelect').val(), highway: $('#highwaySelect').val(), severity: ""};
			}
			else {
				postData = {area: $('#areaSelect').val(), highway: $('#highwaySelect').val(), severity: $('#severitySelect').val()};
			}
		}
		
		getData(postData);
	});
});