const WIDTH = 500;
const HEIGHT = 1470;
const THIRD = HEIGHT / 3;

const elements = {
  video: document.getElementById('CameraFeed'),
  canvas: document.getElementById('sharkiecanvas'),
  ctx: null,
  clickybuttonbtn: document.getElementById('clickybutton'),
  countdownEl: document.querySelector('.countdown-timer'),
};

elements.ctx = elements.canvas ? elements.canvas.getContext('2d') : null;

let photoStage = 0; // 0 = top, 1 = middle, 2 = bottom, 3 = done

function moveVideoToThird(index) {
  const { video } = elements;
  if (!video) return;
  video.style.display = 'block';
  video.style.left = '0';
  video.style.width = '100%';
  video.style.height = '33.3%';
  if (index === 0) video.style.top = '0';
  else if (index === 1) video.style.top = '33.3%';
  else video.style.top = '66.6%';
}

function setupCamera() {
  const { video, canvas } = elements;
  if (!video) return;
  navigator.mediaDevices.getUserMedia({ video: true })
    .then(stream => {
      video.srcObject = stream;
      video.play();
    })
    .catch(error => {
      console.error('Error accessing camera:', error);
    });

  
  if (canvas) {
    canvas.width = WIDTH;
    canvas.height = HEIGHT;
  }

  video.addEventListener('loadedmetadata', () => {
    
    if (elements.canvas) {
      elements.canvas.width = WIDTH;
      elements.canvas.height = HEIGHT;
    }
  });
}

function startCountdown(callback) {
  const { countdownEl } = elements;
  if (!countdownEl) { callback(); return; }

  let count = 3;
  countdownEl.textContent = count;
  countdownEl.style.display = 'flex';

  const intervalId = setInterval(() => {
    count--;
    if (count > 0) {
      countdownEl.textContent = count;
    } else {
      clearInterval(intervalId);
      countdownEl.style.display = 'none';
      callback();
    }
  }, 1000);
}

function takepics() {
  const { video, ctx, clickybuttonbtn } = elements;
  if (!video || !ctx) return;

  const yOffset = photoStage * THIRD;

  const videoWidth = video.videoWidth || video.clientWidth;
  const videoHeight = video.videoHeight || video.clientHeight;

  
  const scale = Math.min(WIDTH / videoWidth, THIRD / videoHeight);
  const dw = Math.round(videoWidth * scale);
  const dh = Math.round(videoHeight * scale);
  const dx = Math.round((WIDTH - dw) / 2);
  const dy = Math.round(yOffset + (THIRD - dh) / 2);

  ctx.save();
  ctx.translate(WIDTH, 0);
  ctx.scale(-1, 1);
  const mirroredX = WIDTH - dx - dw; // flip horizontally
  ctx.drawImage(video, 0, 0, videoWidth, videoHeight, mirroredX, dy, dw, dh);
  ctx.restore();

  photoStage++;

  
  if (photoStage < 3) {
    if (clickybuttonbtn) clickybuttonbtn.disabled = false;
    moveVideoToThird(photoStage);
  } else {
    PhotoStripdone();
  }
}

function PhotoStripdone() {
  const { video, ctx, canvas } = elements;
  if (video) video.style.display = 'none';

  
  if (canvas) {
    const dataURL = canvas.toDataURL('image/png');
    localStorage.setItem('photoStrip', dataURL);
    console.log('photoStrip saved to localStorage');
  }
}

function setupEventListeners() {
  const { clickybuttonbtn } = elements;
  if (!clickybuttonbtn) return;

  clickybuttonbtn.addEventListener('click', () => {
    console.log('capture button clicked, photoStage=', photoStage);
    if (photoStage >= 3) return;
    clickybuttonbtn.disabled = true;
    startCountdown(takepics);
  });

  window.addEventListener('resize', () => {
    
    if (photoStage <= 0) moveVideoToThird(0);
    else if (photoStage === 1) moveVideoToThird(1);
    else moveVideoToThird(2);
  });
}

function startbooth() {
 
  if (elements.canvas) {
    elements.canvas.width = WIDTH;
    elements.canvas.height = HEIGHT;
  }
  setupCamera();
  setupEventListeners();
  moveVideoToThird(0);
}

startbooth();






