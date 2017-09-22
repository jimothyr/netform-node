
var path = require('path');
var express = require('express');
var js = require('graceful-fs');
var router = express.Router();
var conf = require("../sim_modules/config");
var appDir = conf.appRoot //config.path.dirname(require.main.filename);
require('datejs')

var apifunction = require(path.join(appDir, 'sim_modules','api_functions'))
var testData = require(path.join(appDir, 'test','testdata.json'))
var testUsers = require(path.join(appDir, 'test','testusers.json'))
var users = require (path.join(appDir,"sim_modules",'users'))
var write = require(path.join(appDir, "sim_modules", "logs"));


/* GET api */

router.get('/',function(req,res){
	res.send("no route, use post")
});
router.post('/', function(req, res) {

	//if nothing posted then use test config and test users : attach test users to config body
	//if postdata then find correct user list (mainly for live date simulations).
	var test = (Object.keys(req.body).length === 0);true;false;//check if any post data

	var config = test?apifunction.userTestData(testData):req.body;
	//add users to config...
	var simID = test?"test":((config.simID == '' || config.simID == 'undefined') ? Date.today().toString("yyyy_MM_dd") : config.simID)

	write.makeSimFiles(simID);
	var UData = JSON.parse(fs.readFileSync(write.folders.userFile));
	//process UDATA
	config.PCusers = UData;
	//console.log(JSON.stringify(config))
	config = apifunction.processUserData(config);//
	res.send(apifunction.runSimulation(config));//res.send(simulation.simulate(req.body,req.query.sId));
});

router.get('/userlist', function(req,res){
	res.header("Access-Control-Allow-Origin", "*");  
	var out  = users.getUsersfromUserdata()
	console.log(out)
	res.send(out)
	//	res.send(js.readFileSync(path.join(conf.appRoot,"data","sim_status.json")));
  });

router.get('/eventslist', function(req,res){
	res.header("Access-Control-Allow-Origin", "*");  
	var list = fs.readdirSync(path.join(conf.appRoot,"data","events"))
	list.forEach(function(l,i){
		list[i]=l.replace(".json","")
	})

	res.send(list)
});

router.get('/systemStatus', function(req,res){
	res.header("Access-Control-Allow-Origin", "*"); 
	res.header("Content-type", "application/json");   
 console.log("dataroute",conf.dataRoot)
//   write.setSimStatus();
  res.send(js.readFileSync(path.join(conf.dataRoot,"sim_status.json")));
});

module.exports = router;