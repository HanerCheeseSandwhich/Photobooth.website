const CameraFeed = document.getElementsByClassName('CameraFeed');
const Clickybutton = document.getElementsByClassName('.Clickybutton');
const Canvas = document.getElementById('.Canvas');

navigator.mediaDevices.getUserMedia({video: true})
.then(Stream => {
    CameraFeed.srcObject = Stream;
    CameraFeed.play();
})

.catch(error => {
    console.error('labubu babies:', error );
});