require('dotenv').config()
var mqtt = require('mqtt');
var mysql      = require('mysql');

var db = mysql.createConnection({
  host     : process.env.MYSQL_HOST,
  user     : process.env.MYSQL_USER,
  password : process.env.MYSQL_PASS,
  database : process.env.MYSQL_DB
});

db.connect();

var settings = {
  keepalive: 60000
}

var client  = mqtt.connect('mqtt://localhost', settings);

client.on('connect', function () {
  client.subscribe('smart/site/a201');
});

client.on('message', function (topic, message) {
  console.log(topic);
  var topicarr = topic.split('/');
  var topicjson = new Object();
  topicjson['site'] = topicarr[1];
  topicjson['cntr'] = topicarr[2];

  var msg = JSON.parse(message.toString());
  var remsg = Object.assign({},topicjson, msg);
  console.log(remsg);
  db.query("INSERT INTO sensordata (site_id, cntr_id, mid, temper1, temper2, humidity, co2, tid, ctrl)   VALUES  ( '"+remsg.site+"',	'"+remsg.cntr+"', "+remsg.id+",	"+remsg.t1+",	"+remsg.t2+",	"+remsg.hm+",	"+remsg.co+",	"+remsg.t+",	"+remsg.c+")", function(error,results){
    if (error) {
        console.log(error);
    }
    console.log(results);
  });
});

