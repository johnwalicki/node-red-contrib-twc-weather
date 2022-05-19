module.exports = function(RED) {
  function weatherPWS5DayForecastNode( n ) {
    RED.nodes.createNode(this,n );
    var node = this;
    var units = n.units;
    var name = n.name;
    var locationtype = n.locationtype;
    var location= n.location;
    var lang = n.lang;
    var pwsConfigNode;
    var apiKey;
    const axios = require('axios');

    // Retrieve the config node
    pwsConfigNode = RED.nodes.getNode(n.apikey);
    apiKey = pwsConfigNode.credentials.apikey;

    if (!units) {
      units = 'm';
    }
    if (!lang) {
      lang = 'en-US';
    }

    node.on('input', function (msg) {

      msg.twcparams = msg.twcparams || {};

      if( typeof msg.twcparams.units == 'undefined' ) {
        msg.twcparams.units = units; // take the default or the node setting
      } else if( "emhEMH".indexOf(msg.twcparams.units) >= 0 ) {
        // passed in param is valid, override default or node setting
        msg.twcparams.units = msg.twcparams.units.toLowerCase();
      } else {
        msg.twcparams.units = units; // take the default or the node setting
      }

      if( typeof msg.twcparams.lang == 'undefined' ) {
        msg.twcparams.lang = lang;
      }

      if( typeof msg.twcparams.location == 'undefined' ) {
        msg.twcparams.location = location;
      }

      if( typeof msg.twcparams.locationtype == 'undefined' ) {
        msg.twcparams.locationtype = locationtype;
      }

      (async () => {
        try {
          const response = await axios.get('https://api.weather.com/v3/wx/forecast/daily/5day?'+ msg.twcparams.locationtype + '='+ msg.twcparams.location +'&format=json&language='+msg.twcparams.lang+'&units='+msg.twcparams.units+'&apiKey='+apiKey);
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
    });
  }
  RED.nodes.registerType("pws-forecast",weatherPWS5DayForecastNode);
}
