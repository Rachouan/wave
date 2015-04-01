var allSongs = [];

$(function  () {

	var currentSongId = 0;
	var play = $(".play");
	var next = $(".next");
	var prev = $(".prev");
	var scrubber = $(".scrubBar");
	var audio = document.getElementById('myaudio');
	var maxWidth = $(window).width();
	var maxHeight = $(window).height();
	var dancer;
	var kick;
	var points = [];
	var water = [];
	var canvas = document.getElementById("canvas");
	var ctx = canvas.getContext('2d');

	var context;
	if('webkitAudioContext' in window) {
	    context = new webkitAudioContext();
	}else{
		context = new AudioContext();
	}
	var audioAnimation;
	var audioBuffer;
	var sourceNode;
	var analyser;
	canvas.width = maxWidth;
	canvas.height = maxHeight;
	ctx.translate (canvas.width/2, canvas.height/2);

	var colors = [["12,100%",61], ['60,100%',81], ['96,63%',78], ['139,34%',61], ['170,100%',32]];
	

	$(window).on("keyup",function (e) {

		console.log(e.keyCode);
		switch(e.keyCode){

			case 32:
			playSong();
			break;
		}
	});

	function init(){

		play.on("click",playSong);
		next.on("click",nextSong);
		prev.on("click",prevSong);

		scrubber.on("click",function  (e) {

			var mouseX = e.pageX - $(this).offset().left;
			audio.currentTime = (mouseX / $(this).width())*audio.duration;
			playback();

		});
		

		$(".box").on("click",function  () {
			if(!$(this).parent().hasClass("header")){
				$(this).parent().addClass("header");
				$(this).removeClass("icon-expand");
				$(this).addClass("icon-contract");
			}else{
				$(this).parent().removeClass("header");
				$(this).removeClass("icon-contract");
				$(this).addClass("icon-expand");

			}
			
		});

		$.ajax({ 

                type: 'GET', 
                url: 'json/music.json',
                data: { get_param: 'value' }, 
                dataType:'json',
                success: function (data) { 

                	$.each( data, function( key, val ) {

					  	var item = [

					  	val.index,
					  	val.songname,
					  	val.artist,
					  	val.song_url,
					  	val.albumartwork

					  	];

					  	allSongs.push(item);

					  });

						setSong();

            }});


		audio.addEventListener("canplay", function(e) {
		    setupAudioNodes();
	  	}, false);


		visualise(100);
		waterVis(100);



	}

	function setupAudioNodes() {
	  analyser = (analyser || context.createAnalyser());
	  analyser.smoothingTimeConstant = 0.8;
	  analyser.fftSize = 512;

	  sourceNode = context.createMediaElementSource(audio);
	  sourceNode.connect(analyser);
	  sourceNode.connect(context.destination);
	  
	  playSong();
	  draw();
	}

	function draw () {
	  array =  new Uint8Array(analyser.frequencyBinCount);
	  analyser.getByteFrequencyData(array);

	  var avrage = 0;
	  for ( var i = 0; i < (array.length); i++ ){
	    var value = array[i];
	    avrage += value;
	  }

	  avrage = avrage/array.length;

	  	var value = avrage;

	  	animate(value);

		requestAnimationFrame(draw);
	}

	function setSong () {

		$(".artist").html(allSongs[currentSongId][2]);
		$(".songname").html(allSongs[currentSongId][1]);

		$("#myaudio source").remove();
		$("#myaudio").append('<source src="audio/'+allSongs[currentSongId][3]+'" type="audio/mpeg">')
		console.log(allSongs[currentSongId][3]);
	}

	function waterVis (amount) {

		var xPos = -(maxWidth*2);
		//

		for (var i = 0; i < amount; i++) {


			xPos += (maxWidth)/10;

			water.push([xPos,0]);


		}
	}

	function playSong (e) {

		if (audio.paused == false) {

		  play.removeClass("icon-pause");
		  play.addClass("icon-play");
		  audio.pause();

 		 //kick.off();
		} else {
			//kick.on();
		  audio.play();
		  play.removeClass("icon-play");
		  play.addClass("icon-pause");
		  var playbackBar = setInterval(playback, 1000);
		}

	}

	function visualise (amount) {

		for (var i = 0; i < amount; i++) {

			var x = randRange(-maxWidth,maxWidth);
			var y = randRange(-maxHeight,maxHeight);
			var size = randRange(5,50);
			var color = randRange(0,colors.length-1);
			var param = Math.random(2);
			points.push([x,y,size,color,param]);

		}
	}


	function animate(val){

		ctx.clearRect ( -maxWidth/2 , -maxHeight/2 , canvas.width, canvas.height );
		
		//ctx.fillStyle = '#8ED6FF';
  		//ctx.fill();


  		ctx.beginPath();

		for(var j = 0; j<water.length; j++){


			water[j]

			var golf = Math.sin(((val)/j))*j;

			/*ctx.beginPath();
			ctx.moveTo(water[j-1][0],water[j-1][1]);
			if(water[j+1]){
				ctx.lineTo(water[j]/j,water[j][1]);
			}
			ctx.lineWidth = 10;
			ctx.strokeStyle = "#ffffff";
			ctx.stroke();*/

			
			var xpos = 0;
			var ypos = golf;
			//console.log(xpos);

			if(j != 0){
				xpos = water[j-1][0];
				ypos = water[j-1][1];
			}
			ctx.moveTo(xpos,ypos);
			ctx.lineTo(water[j][0],golf);
			/*ctx.beginPath();
			ctx.fillStyle = "#ffffff";
			ctx.arc(water[j][0], golf, 10, 0, 2 * Math.PI, false);
			ctx.fill();*/


			water[j] = [water[j][0],golf];

		}
		ctx.lineTo(water[water.length-1][0],maxHeight);
		ctx.lineTo(water[0][0],maxHeight);
		ctx.lineTo(water[1][0],water[1][1]);
  		ctx.fillStyle = '#8ED6FF';
  		ctx.fill();
		ctx.strokeStyle = "#ffffff";
		ctx.stroke();
		ctx.closePath();





		/*
		for (var i = 0; i < points.length; i++) {
			var position = points[i];
			var newyPos = position[1] - position[4];
			//console.log(position);

			if(newyPos < -maxHeight){
				newyPos = randRange(maxHeight, maxHeight+200);
				position[0] = randRange(-maxWidth,maxWidth);
			}
			color = "hsla("+colors[position[3]][0]+","+(colors[position[3]][1]+(val/512)*50)+"%,"+(0.3+(val/512))+")";

			ctx.beginPath();
			ctx.fillStyle = color;
			ctx.arc(position[0], position[1], position[2]+(val/5), 0, 2 * Math.PI, false);
			ctx.fill();

			points[i] = [position[0],newyPos,position[2],position[3],position[4]];

		};
		*/

	}

	function randRange( minNum, maxNum) {
      return (Math.floor(Math.random() * (maxNum - minNum + 1)) + minNum);
    }


	function playback(){

		$('.playback').css({width: (audio.currentTime / audio.duration) * $(".scrubBar").width()});

	    if(audio.currentTime == audio.duration){
	    	nextSong();
	    }
	}

	function nextSong(){

		currentSongId++;
		if(currentSongId > allSongs.length-1){
			currentSongId = 0;
		}

		setSong();
	}

	function prevSong() {
		currentSongId--;
		if(currentSongId < 0){
			currentSongId = allSongs.length-1;
		}
		setSong();
	}

	init();
})