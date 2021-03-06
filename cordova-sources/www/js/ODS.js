/*
 Copyright 2014 eBusiness Information

 Licensed under the Apache License, Version 2.0 (the "License");
 you may not use this file except in compliance with the License.
 You may obtain a copy of the License at

 http://www.apache.org/licenses/LICENSE-2.0

 Unless required by applicable law or agreed to in writing, software
 distributed under the License is distributed on an "AS IS" BASIS,
 WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 See the License for the specific language governing permissions and
 limitations under the License.
 */

// ---------------------------------------------------------------------------
// URL API
// ---------------------------------------------------------------------------
const URL_BASE = "http://public.opendatasoft.com/api/records/1.0/search"

// ---------------------------------------------------------------------------
// Sample params
// ---------------------------------------------------------------------------
const SAMPLE_LIMIT = 500;
const SAMPLE_DATASET = "positions_geographiques_des_stations_du_reseau_ratp";
const SAMPLE_FACET = "reseau";


// ---------------------------------------------------------------------------
// ODS Normalized fields
// ---------------------------------------------------------------------------
const TAG_ENTRY = "records";
const TAG_ID = "recordid";
const TAG_DATA = "fields";

// ---------------------------------------------------------------------------
// Custom Sample related fields
// ---------------------------------------------------------------------------
const TAG_NAME = "nom_station";
const TAG_AREA = "arrondissement";
const TAG_LAT = "latitude";
const TAG_LONG = "longitude";

const myUrl =
        query.baseurl(URL_BASE)
            .dataset(SAMPLE_DATASET)
            .exclude(SAMPLE_FACET, "bus")
            .exclude(SAMPLE_FACET, "rer")
            .facet(SAMPLE_FACET)
            .limit(SAMPLE_LIMIT)
            .getUrl();


function ODSstart(){
  $('#myFilter').val("");
  retrieve(myUrl);
}

/**
 * Retrieves the ODS call result
 * @param url
 */
retrieve = function (url) {
  console.log('Reading posts');
  $.ajax({
    type: "GET",
    dataType: "json",
    url: url,
    success: onSuccess,
    error: onError
  });
  console.log('Reading posts asynchrounously');
};


/**
 * Processes JSON parsing on the ODS call result
 * @param data
 */
onSuccess = function (data) {
  var items = [];
  var entry;
  $.each(data[TAG_ENTRY], function (key, val) {

    entry =
        ODSResult.setId(val[TAG_ID])
            .setTitle(val[TAG_DATA][TAG_NAME])
            .setDescription(val[TAG_DATA][TAG_AREA])
            .setLatitude(val[TAG_DATA][TAG_LAT])
            .setLongitude(val[TAG_DATA][TAG_LONG]);

    items.push(entry.getDisplay());

  });
  $('#list').html(items.join("")); //prevent commas between two elements
  $('#list').listview('refresh');
  console.log('Exiting onSuccess');
};

/**
 * if error during retrieve
 * @param data
 * @param textStatus
 * @param errorThrown
 */
onError = function (data, textStatus, errorThrown) {
  console.log('Data: ' + data);
  console.log('Status: ' + textStatus);
  console.log('Error: ' + errorThrown);

  $("#list").html('<center>Error while loading posts. No connection ?</center>');

  console.log('Exiting onError');
};
