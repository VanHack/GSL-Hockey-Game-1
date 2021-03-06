var websocket;

function initWebsocket(email) {
	webSocket = new WebSocket("ws://localhost:8080/hockeyGame");
	
	websocket.onOpen = function() {
		webSocket.send(`email:${email}`);
		webSocket.send("getTeams");
		webSocket.send("getPlayers");
	};
	
	websocket.onmessage = function(e) {
		//implement handshake
		
		var points = parseInt(e.data);
		if(!isNaN(points)) {
			if(points > 0) {
				currentPoints += points;
				$('#message').html(`You guessed ${e.data.split(";")[1]} right and earned ${points} points`);
			} else {
				$('#message').html('You guessed ${e.data.split(";")[1]} wrong and earned 0 points');
			}
			return
		}
		
		if(e.data.indexOf("teams;") != -1) {
			var teams = JSON.parse(e.data.split(";")[1]);
			$("#team1").val(teams[0]);
			$("#team2").val(teams[1]);
			return;
		}
		
		if(e.data.indexOf("players;") != -1) {
			var players = JSON.parse(e.data.split(";")[1]);
			for (let player in players) {
				$('#playerOfMatch select').append(`<option value="${players[player]}">${player}</option>`);
			}
		}
	};
	
	websocket.onclose = function(e) {
		$('#message').html("The connection was lost. Please reload the page and login again to continue using.");
	};
}

function sendTeamGuess(team) {
	websocket.send(`guessTeam${team}`);
}

function sendPlayerGuess() {
	var player = $('#playerOfMatch select').val();
	websocket.send(`guessPlayer:${player}`);
}

$(document).ready(function() {
	$(window).bind(
		"beforeunload", 
		function() { 
			websocket.close();
		}
	);
});