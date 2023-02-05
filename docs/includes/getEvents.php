<?php
  $curl = curl_init();
  $url = "https://api.open511.gov.bc.ca/events?";
  $headers = [
    "Content-Type: application/json"
  ];
  
  if ($_POST["highway"] == "") {
    if ($_POST["severity"] == "") {
      $url = $url."area_id=drivebc.ca/".$_POST["area"];
    }
    else {
      $url = $url."area_id=drivebc.ca/".$_POST["area"]."&severity=".$_POST["severity"];
    }
  }
  else {
    if ($_POST["severity"] == "") {
    $url = $url."area_id=drivebc.ca/".$_POST["area"]."&road_name=".$_POST["highway"];
    }
    else {
      $url = $url."area_id=drivebc.ca/".$_POST["area"]."&road_name=".$_POST["highway"]."&severity=".$_POST["severity"];
    }
  }
  
  curl_setopt($curl, CURLOPT_URL, $url);
  curl_setopt($curl, CURLOPT_RETURNTRANSFER, true);
  curl_setopt($curl, CURLOPT_HTTPHEADER, $headers);
  curl_setopt($curl, CURLOPT_HEADER, false);

  $response = curl_exec($curl);
  $statusCode = curl_getinfo($curl, CURLINFO_HTTP_CODE);

  curl_close($curl);

  echo $response;
  echo $statusCode;
?>