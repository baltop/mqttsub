const mqtt = require('mqtt');


//const client = mqtt.connect("mqtt://45.120.69.86",{clean:true});

(function doConnect(){
  this.client = mqtt.connect('mqtt://45.120.69.86', this.myOptionsIfAny);
  this.client.on('connect', () => {
      this.client.subscribe('test/topic');
      this.client.on('message', (topic, message) => {
        console.log(message.toString());
      });
      this.client.on('offline', () => {
          this.client.end(true, () => {
              doConnect();
          });
  });
  });
})();


