let video;
let facemesh;
let predictions = [];
const indices1 = [409, 270, 269, 267, 0, 37, 39, 40, 185, 61, 146, 91, 181, 84, 17, 314, 405, 321, 375, 291];
const indices2 = [76, 77, 90, 180, 85, 16, 315, 404, 320, 307, 306, 408, 304, 303, 302, 11, 72, 73, 74, 184];
const leftEye = [243, 190, 56, 28, 27, 29, 30, 247, 130, 25, 110, 24, 23, 22, 26, 112, 133, 173, 157, 158, 159, 160, 161, 246, 33, 7, 163, 144, 145, 153, 154, 155];
const rightEye = [359, 467, 260, 259, 257, 258, 286, 414, 463, 341, 256, 252, 253, 254, 339, 255, 263, 466, 388, 387, 386, 385, 384, 398, 362, 382, 381, 380, 374, 373, 390, 249];

function setup() {
  createCanvas(640, 480).position(
    (windowWidth - 640) / 2,
    (windowHeight - 480) / 2
  );
  video = createCapture(VIDEO);
  video.size(width, height);
  video.hide();

  facemesh = ml5.facemesh(video, modelReady);
  facemesh.on("predict", results => {
    predictions = results;
  });
}

function modelReady() {
  console.log("Facemesh model loaded!");
}

function draw() {
  background(220);
  image(video, 0, 0, width, height);

  if (predictions.length > 0) {
    const keypoints = predictions[0].scaledMesh;

    // 繪製第一組紅色線條
    drawShape(keypoints, indices1, [255, 0, 0], 15);

    // 繪製第二組紅色線條
    drawShape(keypoints, indices2, [255, 0, 0], 15, true);

    // 填滿第二組內部黃色
    fillShape(keypoints, indices2, [255, 255, 0, 200]);

    // 填滿第一組與第二組之間綠色
    fillBetweenShapes(keypoints, indices1, indices2, [0, 255, 0, 150]);

    // 繪製左眼
    drawShape(keypoints, leftEye, [255, 0, 0], 10, true);
    fillShape(keypoints, leftEye, [0, 0, 255, 150]); // 填滿藍色

    // 繪製右眼
    drawShape(keypoints, rightEye, [255, 0, 0], 10, true);
    fillShape(keypoints, rightEye, [0, 0, 255, 150]); // 填滿藍色
  }
}

function drawShape(keypoints, indices, color, weight, close = false) {
  stroke(...color);
  strokeWeight(weight);
  noFill();
  beginShape();
  for (let i = 0; i < indices.length; i++) {
    const idx = indices[i];
    const [x, y] = keypoints[idx];
    vertex(x, y);
  }
  if (close) endShape(CLOSE);
  else endShape();
}

function fillShape(keypoints, indices, color) {
  fill(...color);
  noStroke();
  beginShape();
  for (let i = 0; i < indices.length; i++) {
    const idx = indices[i];
    const [x, y] = keypoints[idx];
    vertex(x, y);
  }
  endShape(CLOSE);
}

function fillBetweenShapes(keypoints, indices1, indices2, color) {
  fill(...color);
  noStroke();
  beginShape();
  for (let i = 0; i < indices1.length; i++) {
    const idx = indices1[i];
    const [x, y] = keypoints[idx];
    vertex(x, y);
  }
  for (let i = indices2.length - 1; i >= 0; i--) {
    const idx = indices2[i];
    const [x, y] = keypoints[idx];
    vertex(x, y);
  }
  endShape(CLOSE);
}