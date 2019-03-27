// opencv.jsを読み込み
document.write('<script type="text/javascript" Language="JavaScript" src="./opencv.js"></script>');

if (navigator.mediaDevices) {
    navigator.mediaDevices.getUserMedia({ video: true, audio: false })

    .then(function onSuccess(stream) {
        var video = document.getElementById('video');
        video.autoplay = true;
        // //TODO: streamデータに対して画像処理を加えたい
        // let cap = new cv.VideoCapture(stream);
        // cv.imshow("debug", cap);
        // let frame = new cv.Mat(video.height, video.width, cv.CV_8UC4);
        // let dst = new cv.Mat(video.height, video.width, cv.CV_8UC4);
        // while(cap.read(frame)){
        //     cv.cvtColor(frame, dst, cv.COLOR_RGBA2GRAY, 0);
        //     cv.imshow("video", dst);
        // }
        video.srcObject = stream;
    })
    .catch(function onError() {
        alert('error');
    });
    } else {
    alert('getUserMedia is not supported in this browser.');
    }

    function grayscale(){
    let mat = cv.imread(imgElement);
    var dst = new cv.Mat();
    cv.cvtColor(mat, dst, cv.COLOR_RGBA2GRAY, 0);
    cv.imshow('canvasOutput', dst);
    mat.delete();
    dst.delete();
}

function onOpenCvReady() {
    document.getElementById('status').innerHTML = 'OpenCV.js is ready.';
}
