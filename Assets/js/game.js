//Echonest API code
apiKey   ='1DXWYOVVQHNF7AR18';

function getSongData() {
    var trackURL = 'Freestyle.mp3';
    var context  = new webkitAudioContext();
    var _title   = 'Freestyle';
    var _artist  = 'Taalbi Brothers';
    var url = 'http://developer.echonest.com/api/v4/song/search?format=json&bucket=audio_summary';
    $.getJSON(url, {title:_title, artist:_artist, api_key:apiKey}, function(data) {
        var analysisURL = data.response.songs[0].audio_summary.analysis_url;
        console.log(analysisURL);
        var remixer = createJRemixer(context, $, apiKey);
        remixer.remixTrackByURL(analysisURL, trackURL, function (track, percent) {
            console.log(percent);
            console.log(track.status);
            if (track.status == 'ok') {
                var bpm;
                var bs = [];
                var volume = [];
                var game_beats = []; // JSON Object for iterating through in the game.
                for (var i = 0; i < track.analysis.beats.length; i++) {
                    bpm = 60/parseFloat(track.analysis.beats[i].duration);
                    //console.log(track.analysis.beats.length);
                    //console.log("next");
                    //console.log(track.analysis.beats[i].time);
                    console.log(bpm);
                    bs.push(bpm);
                    var loud = parseFloat(track.analysis.beats[i].oseg.loudness_max);
                    volume.push(loud);
                    game_beats.push({"bpm": bpm, "loudness": loud});
                    //console.log(track.analysis.beats[i].oseg.loudness_start);
                    //console.log('next');
                }
                //console.log("random string");
                //console.log(volume);
                //bs.sort();
                //var v = volume.copy();
                //var b = bs.copy();
                // console.log(volume.sort());
                // console.log(bs.sort());
                // console.log(volume.shift(), volume.pop());
                // console.log(bs.shift(), bs.pop());
                // console.log(game_beats);
                //console.log("Min volume: " + Math.min.apply(null, volume));
                //console.log("Max volume: " + Math.max.apply(null, volume));
                //console.log("BLAH");
            } 
        });
    });
}

//API code ends here

//global variables
score = 0;
levelnumber = 1;
moveup = false;
movedown = false;
moveright = false;
moveleft = false;
items = {
	obstacles: [],
	avatar: null
};

function randomSquare() {
    var squares = ['red.png', 'orange.png', 'yellow.png', 'green.png', 'light_blue.png', 
        'dark_blue.png', 'purple.png', 'magenta.png', 'strawberry.png'];
    var image = new Image();
    image.src = 'assets/images/' + squares[Math.floor(Math.random() * 9)];
    return image;
}


//Object prototype
function Item (img, sx, sy, swidth, sheight, x, y, width, height, speed) {
	this.img = img;
	this.sx = sx;
	this.sy = sy;
	this.swidth = swidth;
	this.sheight = sheight;
	this.x = x;
	this.y = y;
	this.width = width;
	this.height = height;
	this.speed = speed;


	this.breathefire = function () {
		alert("breathing fire");
	}
		
	this.drawme = function () {
      
        if (moveup){
            this.y -= this.speed;           
        }
        if(movedown){
            this.y += this.speed;
        }
        if(moveleft){
            this.x -= this.speed;

        }
        if(moveright){
            this.x += this.speed;
        }
		ctx.drawImage(this.img, this.sx, this.sy, this.swidth, this.sheight, this.x, this.y, this.width, this.height);
	}
    this.drawObject = function () {
        ctx.drawImage(randomSquare(), this.sx, this.sy, this.swidth, this.sheight, this.x, this.y, this.width, this.height);
    }
}


function reset() {
}
//anonymous function
$(document).ready(function(){
	delay = 1000/30; // milliseconds
	ctx = document.getElementById('game').getContext('2d');
	initialize();

	avatar.onload = function() {
         console.log("here");
		drawGame();
		setInterval(drawGame, delay); // draw refers to the function
	};
});
// initializes images/objects
function initialize() {
	avatar = new Image();
	avatar.src = 'assets/images/simon.png';
	items.avatar = new Item(avatar, 0, 0, 638, 850, 0, 0, 20, 20, 5);
    items.objects = new Item(randomSquare(), 0, 0, 20, 20, 900, 200, 20, 20, 5);


    //need creation array here
	
    //key listeners
    document.addEventListener("keydown", KeyDown, false);
    document.addEventListener("keyup", KeyUp, false);

    function KeyDown(evt)
    {
        var KeyID = evt.keyCode;
        switch(KeyID)
        {
        	case 32:
        		items.avatar.breathefire();
        		break;
            case 37:
            case 65:
                moveleft=true;
                break;
            case 39:
            case 68:
               moveright=true;
                break;
            case 38:
            case 87:
                moveup=true;
                break;
            case 40:
            case 83:
                movedown=true;
                break;
        }
    }
    function KeyUp(evt)
    {
        var KeyID = evt.keyCode;
        switch(KeyID)
        {
            case 32:
                items.avatar.breathefire();
                break;
            case 37:
            case 65:
                moveleft=false;
                break;
            case 39:
            case 68:
                moveright=false;
                break;
            case 38:
            case 87:
                moveup=false;
                break;
            case 40:
            case 83:
                movedown=false;
                break;
        }
    }
}


//calls rendering functions
function drawGame() {
	renderBackgrounds();
	//addOverlays();
	renderAvatar();	

    renderObjects();	

        gameLoops();
    
}

function renderBackgrounds () {
	ctx.fillStyle = "#000000";
	ctx.fillRect(0, 0, 800, 400);
}

function addOverlays() {
}

function renderObjects(){
    items.objects.x-=items.objects.speed;
    $(items.objects.img).ready(function () {
        items.objects.drawObject();
    });


}
function renderAvatar() {
	$(items.avatar.img).ready(function () {
		items.avatar.drawme();
	});
}


//will be used to detect interactions etc.
function gameLoops(){

    if(collision(items.avatar,items.objects)){
        alert("you dead");
    }

}

function collision(obj1, obj2){
    if (obj1.x + obj1.width - 5 < obj2.x) {
      	return false;
    } else if (obj1.y + obj1.height - 5< obj2.y) {
      	return false;
    } else if (obj1.x > obj2.x + obj2.width - 5) {
      	return false;
    } else if (obj1.y > obj2.y + obj2.height- 5){
     	return false;
    } else {
    	return true;
    }
}
