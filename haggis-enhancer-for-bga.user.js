
// ==UserScript==
// @name       Haggis Enhancer for Board Game Arena 
// @namespace  http://use.i.E.your.homepage/
// @version    0.1
// @description  Improve Haggis interface on Board Game Arena 
// @match      http://*.boardgamearena.com/*
// @require http://code.jquery.com/jquery-latest.js
// @copyright  2014, Ien Cheng
// ==/UserScript==

$(document).ready(function() {
    var startupStuffDone = false;
    
    if($("meta[property='og:title']")[0].content == 'Haggis') {     
        console.log("[BGA Haggis Enhancer] running...");
        
        // enhance each card as it's added
        var handObserver = new MutationObserver(function(mutations, observer) {
            for(var i = 0; i < mutations.length; i++) {
                for(var j = 0; j < mutations[i].addedNodes.length; j++) {
                    console.log("[BGA Haggis Enhancer] enhancing card " + mutations[i].addedNodes[j].id);
                    enhanceCard(mutations[i].addedNodes[j]);
                }
            }
        });
	    handObserver.observe($("#myhand")[0], { childList: true });
        
        var readyObserver = new MutationObserver(function(mutations, observer) {
            // do game wide stuff after logs, which seems to loaded at or near the end
            if(!startupStuffDone) {
                console.log("[BGA Haggis Enhancer] cleaning up game interface");
                removeSpinningHourglasses();
                removeHurryUpMessages();
                minimizeScreenStuff();
                moveQuitButton();
                startupStuffDone = true;
            }
            
            // remove play by play logs
            for(var i = 0; i < mutations.length; i++) {
                for(var j = 0; j < mutations[i].addedNodes.length; j++) {
                    logItem = mutations[i].addedNodes[j];
					console.log("[BGA Haggis Enhancer] removing play-by-play log item " + logItem.id);
                    logItem.remove();
                }
            }
        });
		readyObserver.observe($("#logs")[0], { childList: true });
    }
});

function pickCard(cardDiv) {
    cardDiv.style.__oldTop = cardDiv.style.top;
    var topString = cardDiv.style.top;
    var topPosition = parseInt(topString.slice(0, topString.length - 2)); // remove "px" from end
    var newTopPosition = topPosition - 20;
    cardDiv.style.top = newTopPosition.toString() + "px";
    cardDiv.onclick = function() {
        unpickCard(cardDiv);
    }
}

function enhanceCard(cardDiv) {
	cardDiv.onclick = function() {
		pickCard(this);
	}
    cardDiv.oncontextmenu = function() { // on right click
        markCard(this);
        return false;
    }
}

function unpickCard(cardDiv) {
    cardDiv.style.top = cardDiv.style.__oldTop;
    cardDiv.onclick = function() {
        pickCard(cardDiv);
    }
}

function removeSpinningHourglasses() {
	console.log("[BGA Haggis Enhancer] removing spinning hourglasses...");
    images = $('.player-board > .roundedboxinner > img');
    for(var i = 0; i < images.length / 2; i++) {
        // avatarImage = images[i * 2];
        avatarActiveImage = images[i * 2 + 1];
        // avatarActiveImage.src = avatarImage.src;
        avatarActiveImage.parentNode.removeChild(avatarActiveImage);
    }
}

function removeHurryUpMessages() {
	console.log("[BGA Haggis Enhancer] removing hurry up message and timer...");
    $('#not_playing_help')[0].innerHTML = "";
    $('#reflexiontime_value')[0].style.display = 'none';
}

function markCard(cardDiv) {
    cardDiv.style.opacity = cardDiv.style.opacity == "1" ? "0.5" : "1";
}

function minimizeScreenStuff() {
    // set betting panel to be just simplified buttons without the explanatory text, and sans no bet button
    betPanel = $('#betpanel')[0];
    betPanel.innerHTML = '<a id="bet_nobet" href="#" style="display:none;">[No bet]</a><a id="bet_littlebet" href="#">[Little bet]</a> <a id="bet_bigbet" href="#">[Big bet]</a>';
    betPanel.style.backgroundImage = "none";
    betPanel.style.textAlign = "center";
    
    // minimize "My hand" line
    gamePlayAreaText = $('#game_play_area').children('h3');
    textNodes = gamePlayAreaText.contents().filter(function() { return this.nodeType == 3; });
    textNodes[0].remove(); // remove "My hand:";
    textNodes[2].remove(); // remove "Cards played:";
    
    // move reorder cards buttons to left and add space below
    reorderButtons = $('.reordercards');
	reorderButtons[0].style.margin = "0px";    
	reorderButtons[1].style.margin = "0px";
    reorderButtons[0].parentNode.style.marginBottom = "20px";
    
    // hide blocks under game area
    blocks = $('#page-content > .whiteblock');
    for(var i = 0; i < blocks.length; i++) {
		blocks[i].style.display = "none";
    }
    
    // hide game progression bar
    $('#game_progression_bar')[0].style.display = 'none';
    
    // hide footer
    $('#overall-footer')[0].style.display = 'none';
    
    // hide header
    $('#topbar')[0].style.display = 'none';
    
    // hide info panel (with bomb messages)
    $('#head_infomsg')[0].style.display = 'none';
    
    // make player turn text smaller
    turnLabel = $('#pagemaintitletext')[0]
    turnLabel.style.fontSize = "80%";
    
    // move it
    playerBoardArea = $('#player_boards')[0];
    playerBoardArea.insertBefore(turnLabel, playerBoardArea.firstChild);
    
    // hide player turn bar background box
    $('#page-title')[0].className = "";
    
    // make your hand and played cards labels wood colored to be less distracting
    labels = $('#game_play_area > h3');
    for(var i = 0; i < labels.length; i++) {
        labels[i].style.color = "#a06f3f";
    }
    
    // hide time bar
    bar = $('#thismove_time_bar_currentplayer')[0];
    bar.style.display = "none";
}

function moveQuitButton() {
    button = $('#globalaction_quit')[0];
    button.style.float = "right";
    content = $('#overall-content')[0];
    content.insertBefore(button, content.firstChild);
    console.log(button);
}
