let video;
let poseNet;
let pose;
let skeleton;

let brain;

let rSlider, gSlider, bSlider;
let label;  
let state = 'waiting';


// Variable to store loudness threshold
let loudnessThreshold = 100;

// 
let voice;



function delay(time) {
  return new Promise((resolve, reject) => {
    if (isNaN(time)) {
      reject(new Error('delay requires a valid number.'));
    } else {
      setTimeout(resolve, time);
    }
  });
}
function windowResized() {
  resizeCanvas(windowWidth-400, 480);
  video.size(windowWidth-400, 480);
}
function setup() {
  let canvas = createCanvas(windowWidth-400, 480);
  canvas.parent('sketch-holder');

  video = createCapture(VIDEO, function(stream) {
    console.log('Video capture started');
  });
  video.size(windowWidth-400, 480);
  video.hide();

  video.elt.addEventListener('error', function(e) {
    console.error('Video error:', e);
  });
  rSlider = createSlider(0, 255, 0);
  gSlider = createSlider(0, 255, 0);
  bSlider = createSlider(0, 255, 0);

    poseNet = ml5.poseNet(video, {
  inputResolution: { width: windowWidth-400, height: 480 },
  outputStride: 16,
  flipHorizontal: true
}, modelReady);
  poseNet.on('pose', gotPoses);

  console.log('PoseNet is ready');

   let options = {
    inputs: 34,
    outputs: 3,
    task: 'regression',
    debug: true
  }
  brain = ml5.neuralNetwork(options);
 
 const modelInfo = {
   model: 'model (23).json',
    metadata: 'model_meta (23).json',
   weights: 'model.weights (23).bin',
   };
 brain.load(modelInfo, brainLoaded);

  // 
  voice = new p5.AudioIn();
  
  // 
  voice.start();
  
}
function brainLoaded() {
  console.log('pose predicting ready!');
  predictColor();
}

function predictColor() {
  if (pose) {
    let inputs = [];
    for (let i = 0; i < pose.keypoints.length; i++) {
      let x = pose.keypoints[i].position.x;
      let y = pose.keypoints[i].position.y;
      inputs.push(x);
      inputs.push(y);
    }
    brain.predict(inputs, gotResult);
  } else {
    setTimeout(predictColor, 100);
  }
}

function gotResult(error, results) {
  if (error) {
    console.error(error);
    return;
  }
  let r = results[0].value;
  let g = results[1].value;
  let b = results[2].value;
  rSlider.value(r);
  gSlider.value(g);
  bSlider.value(b);
  predictColor();
}
 
function gotPoses(poses) {
  console.log('Poses detected:', poses.length);
  if (poses.length > 0) {
    pose = poses[0].pose;
    skeleton = poses[0].skeleton;

  
    // Your pose detection logic here
    // (the if-else statements for different poses)
    //console.log(poses);  
   let LhipX = poses[0].pose.keypoints[11].position.x;
    let LhipY = poses[0].pose.keypoints[11].position.y;
  let RhipX = poses[0].pose.keypoints[12].position.x;
  let RhipY = poses[0].pose.keypoints[12].position.y;
  let LkneeX = poses[0].pose.keypoints[13].position.x;
  let LkneeY = poses[0].pose.keypoints[13].position.y;
  let RkneeX = poses[0].pose.keypoints[14].position.x;
  let RkneeY = poses[0].pose.keypoints[14].position.y;
  let LfootX = poses[0].pose.keypoints[15].position.x;
  let LfootY = poses[0].pose.keypoints[15].position.y;
  let RfootX = poses[0].pose.keypoints[16].position.x;
  let RfootY = poses[0].pose.keypoints[16].position.y;
  let LshoulderX = poses[0].pose.keypoints[5].position.x;
  let LshoulderY = poses[0].pose.keypoints[5].position.y;
  let RshoulderX = poses[0].pose.keypoints[6].position.x;
  let RshoulderY = poses[0].pose.keypoints[6].position.y;
  let chest = dist(LshoulderY, LhipY, RshoulderY, RhipY);
//console.log(chest);
  let LelbowX = poses[0].pose.keypoints[7].position.x;
  let LelbowY = poses[0].pose.keypoints[7].position.y;
  let RelbowX = poses[0].pose.keypoints[8].position.x;
  let RelbowY = poses[0].pose.keypoints[8].position.y;
  let LhandX = poses[0].pose.keypoints[9].position.x;
  let LhandY = poses[0].pose.keypoints[9].position.y;
      let RhandX = poses[0].pose.keypoints[10].position.x;
        let RhandY= poses[0].pose.keypoints[10].position.y;
  let heart = dist(LelbowY, LhipY, RelbowY, RhipY);
 // console.log(heart);
  let LearX = poses[0].pose.keypoints[3].position.x;
  let LearY = poses[0].pose.keypoints[3].position.y;
  let RearX = poses[0].pose.keypoints[4].position.x;
  let RearY = poses[0].pose.keypoints[4].position.y;
  let throat = dist(LearY, LshoulderY, RearY, RshoulderY);
// console.log(throat);
    //let nX = poses[0].pose.keypoints[0].position.x;
   // let nY = poses[0].pose.keypoints[0].position.y;
    let LeyeX = poses[0].pose.keypoints[1].position.x;
    let LeyeY = poses[0].pose.keypoints[1].position.y;
   let ReyeX = poses[0].pose.keypoints[2].position.x;
    let ReyeY = poses[0].pose.keypoints[2].position.y;
  let eyes = dist(LeyeX, LeyeY, ReyeX, ReyeY);
  let face = dist(LeyeY, ReyeY, LearY, RearY);
 //console.log(face);
  //console.log(eyes);
    //noseX = lerp(noseX, nX, 0.5);
   // noseY = lerp(noseY, nY, 0.5);
   // eyelX = lerp(eyelX, eX, 0.5);
    //eyelY = lerp(eyelY, eY, 0.5);
  //to do: upload sounds, q eyes and ears close, j program coming closer, kt face program, 0 color, 2 introduction sound, 3 program rising, 4 wide feet, 6 program lowering, 7 program work sound, 8 program user sound recognition, 9 program jazz hands or moving
   for (let i = 2; i < poses.length; i++) {
    let keypoints = poses[i].pose.keypoints;
     if (face >40) {
      generateq();
       //should work
    } else if (LkneeX - RkneeX >= 150, LkneeY - RkneeY >= 150) {
      generate4();
    }
      else if (RkneeX - LkneeX >= 150, RkneeY - LkneeY >=150) {
    generate4();
      //
       } else if (LhandX - RhandX <=100){
       generate1();
     //success
   } else if (LhandY > LshoulderY) {
    generate5();
   //success
   } else if (chest < 30) {
  generatee();
    //success
  } else if (throat > 50) {
    generatekt();
     //should work
   
      } else if (currentSoundLevel > loudnessThreshold) {
  // Add your code here for what should happen when a loud sound is detected
console.log("Loud sound detected!");
       generate8();
}
     
     else if (LhandX-LshoulderX <=50, RhandX-LshoulderX<=50){
        generatefh();
      } else if (LhipY - LfootY <= 100, RhipY - RfootY <= 100) {
    generate0();
     
      } else {
    
    generate9();
   }

    }

    if (state === 'collecting') {
      let inputs = [];
      for (let i = 0; i < pose.keypoints.length; i++) {
        let x = pose.keypoints[i].position.x;
        let y = pose.keypoints[i].position.y;
        inputs.push(x);
        inputs.push(y);
      }
      // Make sure targetColor is defined somewhere in your code
      brain.addData(inputs, targetColor);
    }
  }
}
  
poseNet.on('error', function(error) {
  console.error("PoseNet error:", error);
});

function modelReady() {
  console.log('model ready');
}
function modelLoaded() {
  console.log('poseNet ready');
}


function draw() {
   if (video.elt.readyState === 4) {
  // Display the mirrored video
  push();
  translate(width, 0);
  scale(-1, 1);
  image(video, 0, 0, width, height);
  pop();

  let r = rSlider.value();
  let g = gSlider.value();
  let b = bSlider.value();
  background(r, g, b, 100);

  let currentSoundLevel = voice.getLevel();
  
  if (currentSoundLevel > loudnessThreshold) {
    console.log("Loud sound detected!");
    generate8();
  }
  
  if (pose) {
    // Draw skeleton
    for (let i = 0; i < skeleton.length; i++) {
      let a = skeleton[i][0];
      let b = skeleton[i][1];
      strokeWeight(2);
      stroke(0);
      line(a.position.x, a.position.y, b.position.x, b.position.y);
    }
    // Draw keypoints
    for (let i = 0; i < pose.keypoints.length; i++) {
      let x = pose.keypoints[i].position.x;
      let y = pose.keypoints[i].position.y;
      fill(0);
      stroke(255);
      ellipse(x, y, 16, 16);
    }
    poseNet.singlePose(video);
  }
     } else {
    background(200);
    textAlign(CENTER, CENTER);
    text('Waiting for video...', width/2, height/2);
  }
}

