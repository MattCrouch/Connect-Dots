var header = function(){
	var canvas, context;
	var height, width;
	var dots = [];

	function Dot(posX, posY) {
		this.x = posX;
		this.y = posY;
		this.direction = (2 * Math.PI) * Math.random();
		this.speed = 0.01 + (Math.random()  * 0.01);
		this.connectTo = undefined;
	}

	function addNewDot(fromEdge) {
		var dot = new Dot(Math.random() * 100, Math.random() * 100);

		if(fromEdge) {
			//Initialise new dots from the edge of the canvas
			var flip = true;
			if(Math.random() >= 0.5) {
				flip = false;
			}

			if(dot.direction >= (Math.PI * 0.25) && dot.direction < (Math.PI * 0.75)) {
				//Going South
				dot.x = flip ? 0 : 100;
			} else if(dot.direction >= (Math.PI * 0.75) && dot.direction < (Math.PI * 1.25)) {
				//Going West
				dot.y = flip ? 100 : 0;
			} else if(dot.direction >= (Math.PI * 1.25) && dot.direction < (Math.PI * 1.75)) {
				//Going North
				dot.x = flip ? 100 : 0;
			} else {
				//Going East
				dot.y = flip ? 0 : 100;
			}
		}
                                                
		dots.push(dot);
	}

	function pcHeight(val) {
		return (val / height) * 100;
	}

	function pcWidth(val) {
		return (val / width) * 100;
	}

	function pxHeight(percentage) {
		return (percentage / 100) * height;
	}

	function pxWidth(percentage) {
		return (percentage / 100) * width;
	}

	function initDots(no) {
		dots = [];

		for(var i = 0; i < no; i++) {
			addNewDot(false);
		}
	}

	function draw() {
		function drawDot(x, y) {
			context.beginPath();

			context.arc(pxWidth(x), pxHeight(y), 5, 0, 2 * Math.PI, false);
			context.fill();
		}

		function moveDot(dot) {
			dot.x = dot.x + Math.cos(dot.direction) * dot.speed;
			dot.y = dot.y + Math.sin(dot.direction) * dot.speed;
		}

		function findNearestDot(dot) {
			//TODO: make a slightly more exciting connection algorithm
			var nearestDot, nearestVal;

			for(var i = 0; i < dots.length; i++) {
				if(dots[i] == dot) {
					continue;
				}

				var distance = Math.abs(dot.x - dots[i].x) + Math.abs(dot.y - dots[i].y);

				if((nearestDot === undefined || nearestVal === undefined || distance < nearestVal) && dots[i].connectTo !== dot) {
					dot.connectTo = dots[i];
					nearestVal = distance;
					nearestDot = dots[i];
				}
			}

			return nearestDot;
		}

		function connectDots(dot1, dot2) {
			//Draw a line between these two dots
			context.beginPath();
			context.moveTo(pxWidth(dot1.x), pxHeight(dot1.y));
			context.lineTo(pxWidth(dot2.x), pxHeight(dot2.y));
			context.stroke();
		}

		height = canvas.clientHeight; width = canvas.clientWidth;

		context.canvas.width = width;
		context.canvas.height = height;

		context.clearRect(0,0,context.canvas.width,context.canvas.height); // clear canvas

		for(var i = 0; i < dots.length; i++) {
			drawDot(dots[i].x, dots[i].y);
			moveDot(dots[i]);

			if(dots[i].x < 0 || dots[i].x > 100 || dots[i].y < 0 || dots[i].y > 100) {
				dots.splice(i, 1);
				addNewDot(true);
			}

			connectDots(dots[i], findNearestDot(dots[i]));
		}

		window.requestAnimationFrame(draw);
	}

	function init() {
		canvas = document.getElementById("dotsCanvas");

		if(!canvas || !canvas.getContext) {
			return false;
		}
		
		context = canvas.getContext('2d');
		
		context.lineWidth = 2;

		initDots(100);

		window.requestAnimationFrame(draw);
	}

	init();
}();