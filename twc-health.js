module.exports = function(RED) {
  function weatherTWCHealthForecastNode( n ) {
    RED.nodes.createNode(this,n );
    var node = this;
    var name = n.name;
    var locationtype = n.locationtype;
    var location= n.location;
    var lang = n.lang;
    var conditiontype = n.conditiontype;
    var range = n.range;
    var pwsConfigNode;
    var apiKey;
    const axios = require('axios');

    // Retrieve the config node
    pwsConfigNode = RED.nodes.getNode(n.apikey);
    apiKey = pwsConfigNode.credentials.apikey;

    if (!lang) {
      lang = 'en-US';
    }

    node.on('input', function (msg) {
      msg.twcparams = msg.twcparams || {};

      if( typeof msg.twcparams.range == 'undefined' ) {
        msg.twcparams.range = range;
      }

      if( typeof msg.twcparams.conditiontype == 'undefined' ) {
        msg.twcparams.conditiontype = conditiontype;
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
          const response = await axios.get('https://api.weather.com/v3/wx/forecast/daily/'+msg.twcparams.range+'/cognitiveHealth?'+ msg.twcparams.locationtype + '='+ msg.twcparams.location +'&conditionType='+msg.twcparams.conditiontype+'&format=json&language='+msg.twcparams.lang+'&apiKey='+apiKey);
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
  RED.nodes.registerType("twc-health-forecast",weatherTWCHealthForecastNode);
}
