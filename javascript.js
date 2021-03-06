function initialize_webiopi(){
		// apply style.css after initialize webiopi
		applyCustomCss('styles.css');

		// set touch area
		var touchArea = $("#touchArea")[0];

		// add touch event listener 
		touchArea.addEventListener("touchstart", touchEvent, false);
		touchArea.addEventListener("touchmove", touchEvent, false);
		touchArea.addEventListener("touchend", touchEndEvent, false);

		// add click event listener
		touchArea.addEventListener("click", clickEvent, false);

		webiopi().refreshGPIO(false);

		// for text output
		getPhotoNumb();
		setTimeout("txtOutput()", 1000); // wait for get photo number

		imageSetup();
}

var commandID = 0;

var mCount = 0;
var mCanvas;
var mCtx;
var mImg1;
var mImg2;
var mImgShutter;
var mImgArrow;

var mWidth = 640;
var mHeight = 480;

var viewScale = 0.90;

var URL1, URL2;

var cameraMode = 0; //0:auto 1:preview 2:manual
var photoNumb = 0;

function txtOutput(){
		var tmp_mode;
		if(cameraMode == 0){
				tmp_mode = "Auto";
		}
		if(cameraMode == 1){
				tmp_mode = "Preview";
		}
		if(cameraMode == 2){
				tmp_mode = "Manual";
		}
		var txt = "Mode:" + tmp_mode + "       " + "PhotoNumb:" + photoNumb;

		document.getElementById("text_out").innerHTML = txt;
}

function getData(url) {
		return $.ajax({
				type: 'get',
				url: url
		});
}

function getPhotoNumb(){
		// Get photo number for preview
		getData('./photo/camera.set').then(function(data) {
				photoNumb = data;
		});
}

function imageSetup(){
		var host = location.host;
		var hostname = host.split(":")[0];

		var port_mjpeg = 9000;
		var port_webiopi = 8000;
		URL_MJPEG = 'http://' + hostname + ':' + port_mjpeg + '/?action=snapshot';
		URL_SHUTTER = 'http://' + hostname + ':' + port_webiopi + '/raspicam_wifi/img/shutter.png';
		URL_PREVIEW = 'http://' + hostname + ':' + port_webiopi + '/raspicam_wifi/photo/';
		URL_ARROW = 'http://' + hostname + ':' + port_webiopi + '/raspicam_wifi/img/arrow.png';


		mCanvas = document.getElementById("canvas");
		mCtx = mCanvas.getContext('2d');

		mWidth = viewScale*document.getElementById("touchArea").offsetWidth;
		mHeight= mWidth*3/4;

		mCanvas.width = mWidth;
		mCanvas.height = mHeight;

		mImg1 = new Image();
		mImg2 = new Image();
		mImgShutter = new Image();
		mImgArrow = new Image();

		mImg1.src = URL_MJPEG +'&'+(mCount++);

		mImgShutter.src = URL_SHUTTER;
		mImgArrow.src = URL_ARROW;

		mImg1.onload = function() {
				if(cameraMode == 0 || cameraMode == 2){
						mImg2.src = URL_MJPEG + '&' + (mCount++);
						mCtx.drawImage(mImg1, 0, 0, mWidth, mHeight);
						mCtx.drawImage(mImgShutter, 0, 0, mWidth, mHeight);
				}
				if(cameraMode == 1){
						mImg2.src = URL_PREVIEW + getZeroDigit(photoNumb, 6) + ".jpg";
						mCtx.drawImage(mImg1, 0, 0, mWidth, mHeight);
						mCtx.drawImage(mImgArrow, 0, 0, mWidth, mHeight);
				}
		};

		mImg2.onload = function() {
				if(cameraMode == 0 || cameraMode == 2){
						mImg1.src =URL_MJPEG + '&' + (mCount++);
						mCtx.drawImage(mImg2, 0, 0, mWidth, mHeight);
						mCtx.drawImage(mImgShutter, 0, 0, mWidth, mHeight);
				}

				if(cameraMode == 1){
						mImg1.src = URL_PREVIEW + getZeroDigit(photoNumb, 6) + ".jpg";
						mCtx.drawImage(mImg2, 0, 0, mWidth, mHeight);
						mCtx.drawImage(mImgArrow, 0, 0, mWidth, mHeight);
				}
		};
}

// touch event for smartphone
function touchEvent(e){
		e.preventDefault();

		var touch = e.touches[0];  
		var width = viewScale*document.getElementById("touchArea").offsetWidth;
		var height = width*3/4;

		if(touch.pageX<width/3){ // left
				if(cameraMode == 1){
						photoNumb--;
				}
		}else if(touch.pageX<2*width/3){ // middle
				if(touch.pageY<height/2){ // upper

				}else{ // lower
						if(cameraMode == 0 || cameraMode == 2){
								ActionShutter();
						}
				}
		}else if(touch.pageX<width){ // right
				if(cameraMode == 1){
						photoNumb++;
				}
		}

		txtOutput();
}

// touch end event
function touchEndEvent(e){
		e.preventDefault();

}

// click event for PC
function clickEvent(e){
		var width = viewScale*document.getElementById("touchArea").offsetWidth;
		var height = width*3/4;

		if(e.pageX<width/3){ // left
				if(cameraMode == 1){
						photoNumb--;
				}
		}else if(e.pageX<2*width/3){ // middle
				if(e.pageY>=2*height/5 && e.pageY<3*height/5){
				}else if(e.pageY<height/2){
						if(cameraMode == 0 || cameraMode == 2){
								ActionShutter();
						}
				}else{
				}
		}else if(e.pageX<width){ // right
				if(cameraMode == 1){
						photoNumb++;
				}
		}

		txtOutput();
}

function applyCustomCss(custom_css){
		var head = document.getElementsByTagName('head')[0];
		var style = document.createElement('link');
		style.rel = "stylesheet";
		style.type = 'text/css';
		style.href = custom_css;
		head.appendChild(style);
}

function getZeroDigit(num,digit) {
		var n,m,s;
		if (isNaN(num)) {
				s = num;
		} else {
				s = num.toString();
		}
		m = digit - s.length;
		for (n=0;n<m;n++) {
				s = "0" + s;
		}
		return s;
}

function ChangeMode(){
		cameraMode++;
		if(cameraMode > 2){
				cameraMode = 0;
		}

		getPhotoNumb();
		txtOutput();
}

function ActionShutter(){
		webiopi().callMacro("shutterCamera", [0]);

		setTimeout("imageSetup()", 5000);
		txtOutput();
}

function ActionShutdown(){
		webiopi().callMacro("shutdownCamera", [0]);
}
