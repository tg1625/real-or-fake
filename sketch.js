//Speech Rec Tings
var myRec = new p5.SpeechRec('en-US', parseResult); // new P5.SpeechRec object
myRec.continuous = true; // do continuous recognition
myRec.interimResults = true;
let mostrecentword;

//ML Tings
// Classifier Variable
let classifier;
// Model URL
let imageModelURL = 'https://teachablemachine.withgoogle.com/models/zCK6ikhxU/';
// To store the classification
let label = "";
let questions = []; 
let currentQ = 0;
let data;

function preload() {
  classifier = ml5.imageClassifier(imageModelURL + 'model.json');
  data = loadJSON("data.json", loadQuestions);
}

function setup(){
  // graphics stuff:
  createCanvas(800, 600);
  // Start classifying
  classifyImage(questions[currentQ].url);
  //Start speech recognizing
  myRec.start(); 
}

function draw(){
  background(240, 240, 245);
  displayQuestion();
  // Draw the label
  fill(0);
  textSize(16);
  textAlign(CENTER);
  text(label, width / 2, height/2);
  text(mostrecentword, width / 2, height/2 + 20);
  // filter(GRAY);
}

//Get random questions from the JSON file
function loadQuestions(){
  data = data.data;
  let seen = [];
  while(questions.length < 5){
    let q = int(random(0, data.length));
    if(!seen.includes(q)){
      let img = loadImage("assets/" + data[q].url);
      questions.push({"url": img, "real": data[q].real});
      seen.push(q);
    }
  }
  console.log("Questions are", questions);
}

function displayQuestion(){
  image(questions[currentQ].url, width / 2 - 100 , 50, 200, 200);
}

//Get result for Speech Recognition
function parseResult(){
    mostrecentword = myRec.resultString.split(' ').pop();
    // console.log(mostrecentword);
}

 //Classification for ML
 function classifyImage(img) {
  classifier.classify(img, gotResult);
}

//Result of ML
function gotResult(error, results) {
  // If there is an error
  if (error) {
    console.error(error);
    return;
  }
  label = results[0].label;
  classifyImage(questions[currentQ].url);
}