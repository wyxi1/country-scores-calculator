const fetch = require('node-fetch');
const jsdom = require("jsdom");

var ALL_PLAYERS = {};

var ACC_MAPS = ["300833","329873","315634","346634","190915","139978","121456","311274","318941"];
var SPEED_MAPS = ["348320","348299","329702","348061","342452","348150","348344","343021"];

async function fetchLeaderboard(id) {
	
	var MAX_SWEDES = 10;
	var NUM_PAGES_TO_FETCH = 20;
	var topPlays = [];
	
	var earlyStop = false;

	var analyzeHtml = function(html) {
		
		var jsdom = require("jsdom");
		const { JSDOM } = jsdom;
		const { window } = new JSDOM(html);
		const { document } = (new JSDOM(html)).window;
		global.document = document;

		var $ = jQuery = require('jquery')(window);
		
		var rows = $('table.ranking.global tbody tr');
		if(rows.length == 0) {
			earlyStop = true;
			return;
		}
		
		$.each(rows,function(i,e) {
			var $e = $(e)
			var countryImg = $e.find(".player img");
			var countryURL = countryImg.attr("src");
			
			if(countryURL.endsWith("se.png")) {
				if(topPlays.length >= MAX_SWEDES) {
					return;
				}
				
				//Swedish player
				var playerID = $e.find(".player a").attr("href").substring(3); //Strip the /u/
				var playerName = $e.find(".player .songTop").text().trim();
				var score = parseInt($e.find(".score").text().trim().replace(/\,/g,""));
				//var percentage = $e.find(".percentage").html().trim();
				
				if(!ALL_PLAYERS[playerID]) {
					ALL_PLAYERS[playerID] = playerName;
				}
				
				topPlays.push({
					id: playerID,
					name: playerName,
					score: score,
					//percentage: percentage
				});
			}
			
		});
	};
	
	var baseurl = "https://scoresaber.com/leaderboard/";
	
	//Fetch 10 pages
	
	for(var i = 1; i <= NUM_PAGES_TO_FETCH; i++) {
		var url = 'https://scoresaber.com/leaderboard/' + id + "?page=" + i;
		console.log("Fetching " + url);
		await fetch(url)
			.then(res => res.text())
			.then(text => analyzeHtml(text));
			
		//Let's not spam scoresaber, wait a second.
		await new Promise(r => setTimeout(r, 3000));
		
		if(topPlays.length >= MAX_SWEDES) {
			break;
		}
		
		if(earlyStop) {
			break;
		}
	};

	
	return topPlays;
	
};

var calculateMapSet = async function(set) {
	
	var players = {};
	
	for(var i = 0; i < set.length; i++) {
		var scoresaberMapId = set[i];
		var topPlays = await fetchLeaderboard(scoresaberMapId);
		for(var j = 0; j < topPlays.length; j++) {
			play = topPlays[j];
			if(!players[play.id]) {
				players[play.id] = {
					name: play.name,
					score: 0,
					maps: 0
				};
			}
			
			players[play.id].score += play.score;
			players[play.id].maps += 1;
		}
	}
	
	var sortedPlayers = [];
	for (var id in players) {
		sortedPlayers.push({id:id,name:players[id].name,score:players[id].score,maps:players[id].maps});
	}
	
	function compare( a, b ) {
		if ( a.score < b.score ){
			return 1;
		}
		if ( a.score > b.score ){
			return -1;
		}
		return 0;
	}
	
	sortedPlayers.sort(compare);
	console.log(`Place \t| Player \t\t\t\t| Score \t| Scores counted`);
	console.log(`--------------------------------------------------------------------------------`);
	for(var i = 0; i < sortedPlayers.length; i++) {
		var player = sortedPlayers[i];
		console.log(`${i+1} \t| ${player.name} \t\t\t\t| ${player.score} \t| ${player.maps}`);
	}
};

var runBoth = async function() {
	console.log("Calculating speed maps");
	await calculateMapSet(SPEED_MAPS);
	console.log("Calculating acc maps");
	await calculateMapSet(ACC_MAPS);
}

runBoth();












