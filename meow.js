const WIDTH = 500;
const HEIGHT = 1470;
const HALF = HEIGHT / 2;



const elements = {
 video: document.getElementById('CameraFeed'),
canvas: document.getElementById('sharkiecanvas'),
ctx: document.getElementById('sharkiecanvas').getContext('2d'),
clickybuttonbtn: document.getElementById('clickybutton'),
countdownEl: document.querySelector('.countdown-timer'),
}
let photoStage = 0; // 0 = top, 1 = bottom, 2 = done
function moveVideoToHalf(index) {
  const { video } = elements;
  video.style.display = 'block';
  video.style.top = index === 0 ? '0' : '33.3%';
  video.style.left = '0';
  video.style.width = '100%';
  video.style.height = '33.3%';
}

 function setupCamera() { navigator.mediaDevices.getUserMedia({video: true})
.then(Stream => {
    CameraFeed.srcObject = Stream;
    CameraFeed.play();
})
.catch(error => {
    console.error('labubu babies:', error );
});}

function startCountdown(callback) {
  let count = 3;
  const { countdownEl } = elements;

  countdownEl.textContent = countdown;
  countdownEl.style.display = 'flex';

  const intervalId = setInterval(() => {
    count--;
    if (count > 0) {
      countdownEl.textContent = countdown;
    } else {
      clearInterval(intervalId);
      countdownEl.style.display = 'none';
      callback();
    }
  }, 1000);
}

function takepics(){
    const { video, ctx } = elements;
  const yOffset = photoStage === 0 ? 0 : HALF;

  const videoWidth = video.videoWidth;
  const videoHeight = video.videoHeight;
  const targetAspect = WIDTH / HALF;
  const videoAspect = videoWidth / videoHeight;

  let sx, sy, sw, sh;

  if (videoAspect > targetAspect) {
   
    sh = videoHeight;
    sw = videoHeight * targetAspect;
    sx = (videoWidth - sw) / 2;
    sy = 0;
  } else {
    
    sw = videoWidth;
    sh = videoWidth / targetAspect;
    sx = 0;
    sy = (videoHeight - sh) / 2;
  }

  ctx.save();
  ctx.translate(WIDTH, 0);
  ctx.scale(-1, 1);
  ctx.drawImage(video, sx, sy, sw, sh, 0, yOffset, WIDTH, HALF);
  ctx.restore();

  photoStage++;

  if (photoStage === 1) {
    moveVideoToHalf(2);
    elements.clickybuttonbtn.disabled = false;
  } else if (photoStage === 2) {
    moveVideoToHalf(3);
    elements.clickybuttonbtn.disabled = false; }
    else if (photoStage === 3) {

    
    PhotoStripdone(); }
}


function PhotoStripdone(){
    const { video, ctx, clickybuttonbtn} = elements;
  video.style.display = 'none';

  const frame = new Image();
  frame.src = 'Assets/photobooth/camerapage/4.png';

  frame.onload = () => {
    ctx.drawImage(frame, 0, 0, WIDTH, HEIGHT);

    
    const dataURL = elements.canvas.toDataURL('image/png');
    localStorage.setItem('photoStrip', dataURL);

    
    setTimeout(() => {
      window.location.href = 'sharkie.html';
    }, 50);
  };

 
  frame.complete && frame.onload(); 
}

function setupEventListeners() {
  const { clickybuttonbtn, video } = elements;

  clickybuttonbtn.addEventListener('click', () => {
    if (photoStage > 1) return;
    clickybuttonbtn.disabled = true;
    startCountdown(takepics);
  });
  window.addEventListener('resize', () => {
    if (photoStage === 0) moveVideoToHalf(0);
    else if (photoStage === 1) moveVideoToHalf(1);
  });
}

function startbooth() {
  setupCamera();
  setupEventListeners();
}

startbooth();






