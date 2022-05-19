module.exports = function(RED) {
  function weatherPWSHistoricalDataNode( n ) {
    RED.nodes.createNode(this,n );
    var node = this;
    var StationId = n.stationid;
    var units = n.units;
    var name = n.name;
    var range = n.range;
    var date = n.date;
    var pwsConfigNode;
    var apiKey;
    const axios = require('axios');

    // Retrieve the config node
    pwsConfigNode = RED.nodes.getNode(n.apikey);
    apiKey = pwsConfigNode.credentials.apikey;

    if (!units) {
      units = 'm';
    }

    function datevalidation( v ) {
      var datestr =""+v // cast from number to string
      if (!/^\d{8}/.test(datestr)) { return false; }
      var year = datestr.substring(0,4);
      var month = datestr.substring(4,6);
      var day = datestr.substring(6,8);
      // Date.parse will return NaN if this isn't a valid date
      var time = Date.parse(year+"-"+month+"-"+day);
      return !isNaN(time);
    }

    function dateparser( msg ) {
      // Date validation and reformatting
      var teststr;
      if( typeof msg.twcparams.date !== 'undefined' ) {
        // The pws date to query was passed in as a msg key value pair
        // override any value specified in the edit panel
        var time = new Date(msg.twcparams.date);
        if( !isNaN(time) ) {
          // msg.date contains a timestamp
          // Grab the date 2020-01-01 from the ISO format
          teststr = time.toISOString().substr(0,10);
        } else {
          // cast from number to string in case it was a number
          teststr = ""+msg.twcparams.date;
        }
      } else {
        // Use the date provided in the edit panel
        teststr = date ;
      }
      var datestr;
      // reformat 2020-01-01 or 2020/01/01 to 20200101 required yyyymmdd format
      datestr = teststr.replace( /(\d{4})[\-/](\d{1,2})[\-/](\d{1,2})/, '$1$2$3' );

      if( !datestr || !datevalidation(datestr) ) {
        msg.payload = "Error: No or incorrect date format provided. yyyymmdd required.";
        node.send(msg);
        return null;
      }
      return datestr;
    }

    node.on('input', function (msg) {
      msg.twcparams = msg.twcparams || {};
      var datestr = dateparser( msg );
      if( !datestr ) {
        return;
      }
      msg.twcparams.date = datestr ;

      if( typeof msg.twcparams.range == 'undefined' ) {
        msg.twcparams.range = range;
      }

      if( typeof msg.twcparams.units == 'undefined' ) {
        msg.twcparams.units = units; // take the default or the node setting
      } else if( "emhEMH".indexOf(msg.twcparams.units) >= 0 ) {
        // passed in param is valid, override default or node setting
        msg.twcparams.units = msg.twcparams.units.toLowerCase();
      } else {
        msg.twcparams.units = units; // take the default or the node setting
      }

      var curStationId = StationId;
      if( typeof msg.twcparams.StationID != 'undefined' ) {
        curStationId = msg.twcparams.StationID.toUpperCase();
      }
      if( !curStationId ) {
        // No StationID is set. Abort with error
        msg.payload = "Error: No StationID provided.";
        node.send(msg);
      } else {
        msg.twcparams.StationID = curStationId;
        (async () => {
          try {
            const response = await axios.get('https://api.weather.com/v2/pws/history/'+ msg.twcparams.range + '?stationId='+ curStationId +'&format=json&date='+datestr+'&units='+msg.twcparams.units+'&apiKey='+apiKey);
            //console.log(response.data)
            msg.payload = response.data;
            node.send(msg);
          } catch (error) {
            //console.log(error.response.data);
            //console.log(error.response.status);
            if (error.response) {
              // The request was made and the server responded with a status code
              // that falls out of the range of 2xx
              console.log(error.response.data);
              console.log(error.response.status);
              console.log(error.response.headers);
              node.warn(error.response.data);
            } else if (error.request) {
              // The request was made but no response was received
              // `error.request` is an instance of XMLHttpRequest in the browser and an instance of
              // http.ClientRequest in node.js
              console.log(error.request);
            } else {
              // Something happened in setting up the request that triggered an Error
              console.log('Error', error.message);
            }
            console.log(error.config);
            console.log(error.toJSON());
            node.send(msg);
          }
        })();
      }
    });
  }
  RED.nodes.registerType("pws-historical",weatherPWSHistoricalDataNode);
}
