function Visualiser () {

	var points = [];
	var water = [];
	var maxWidth;
	var maxHeight;
	var ctx;
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

	
	var colors = [["12,100%",61], ['60,100%',81], ['96,63%',78], ['139,34%',61], ['170,100%',32]];

	function init () {

		console.log("init");

		visualise(100);
		waterVis(100);
	}

	Visualiser.prototype.setUpCanvas = function(canvas) {
		ctx = canvas.getContext('2d');
		maxWidth = canvas.width;
		maxHeight = canvas.height;
		ctx.translate (canvas.width/2, canvas.height/2);
		console.log(maxWidth,maxHeight);
	};

	Visualiser.prototype.setupAudioNodes = function(audio) {

		analyser = (analyser || context.createAnalyser());
		analyser.smoothingTimeConstant = 0.8;
		analyser.fftSize = 512;

		sourceNode = context.createMediaElementSource(audio);
		sourceNode.connect(analyser);
		sourceNode.connect(context.destination);

		draw();

		return true;

	};

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

	  	dots(value);

		requestAnimationFrame(draw);
	}


	function waterVis (amount) {

		var xPos = -(maxWidth*2);
		//

		for (var i = 0; i < amount; i++) {


			xPos += (maxWidth)/10;

			water.push([xPos,0]);


		}
	}


	function water(val){

		ctx.clearRect ( -maxWidth/2 , -maxHeight/2 , canvas.width, canvas.height );
		
		//ctx.fillStyle = '#8ED6FF';
  		//ctx.fill();


  		ctx.beginPath();

		for(var j = 0; j<water.length; j++){


			water[j]

			var golf = Math.sin(((val)/j))*j;

			
			var xpos = 0;
			var ypos = golf;
			//console.log(xpos);

			if(j != 0){
				xpos = water[j-1][0];
				ypos = water[j-1][1];
			}
			ctx.moveTo(xpos,ypos);
			ctx.lineTo(water[j][0],golf);


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

	}

	function dots (val) {

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
	}

	function randRange( minNum, maxNum) {
      return (Math.floor(Math.random() * (maxNum - minNum + 1)) + minNum);
    }



	init();

}