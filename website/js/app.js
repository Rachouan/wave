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
	

	$(window).on("keyup",function (e) {

		console.log(e.keyCode);
		switch(e.keyCode){

			case 32:
			playSong();
			break;
		}
	});

	function init(){

		audio.addEventListener("canplay", function(e) {
			var visualiser = new Visualiser();
			visualiser.setUpCanvas(canvas);
			if(visualiser.setupAudioNodes(audio)){
				playSong();
			}
	  	}, false);

		

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


		



	}

	
	function setSong () {

		$(".artist").html(allSongs[currentSongId][2]);
		$(".songname").html(allSongs[currentSongId][1]);

		$("#myaudio source").remove();
		$("#myaudio").append('<source src="audio/'+allSongs[currentSongId][3]+'" type="audio/mpeg">')
		console.log(allSongs[currentSongId][3]);
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