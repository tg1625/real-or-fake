//Images
var bkImage;
var buttonImg;
//Questions/Image Data
var questions = [];
var data;
//ML Classifier
var classifier;
//Fonts
var basicFont;
var scriptFont;
//AUdio
var bellSound;
var correctSound;
var wrongSound;
var backgroundMsc;
var winner = "";

function preload()
{
    bkImage = loadImage("assets/background3-bw.jpg");   
    buttonImg = loadImage("assets/pushbutton-red.png");
    data = loadJSON("../data.json", loadQuestions);
    classifier = ml5.imageClassifier('https://teachablemachine.withgoogle.com/models/zCK6ikhxU/model.json');
    basicFont = loadFont("assets/FuturaLT-Condensed.ttf");
    scriptFont = loadFont("assets/Filmotype_Leader.otf");
    soundFormats('mp3', 'ogg');
    bellSound = loadSound('assets/bell.mp3');
    correctSound = loadSound('assets/correct2.mp3');
    wrongSound = loadSound('assets/wrong.mp3');
    backgroundMsc = loadSound('assets/theme.mp3');
}

function setup()
{
    createCanvas(bkImage.width, bkImage.height);
    // createCanvas(600, 600);

    var mgr = new SceneManager();
    mgr.bkImage = bkImage; // inject bkImage property
    mgr.questions = questions;
    mgr.data = data;
    mgr.classifier = classifier;
    mgr.buttonImg = buttonImg;
    mgr.scriptFont = scriptFont;
    mgr.basicFont = basicFont;
    mgr.bellSound = bellSound;
    mgr.correctSound = correctSound;
    mgr.wrongSound = wrongSound;
    mgr.backgroundMsc = backgroundMsc;
    mgr.winner = winner;
    mgr.wire();
    mgr.showScene( Intro );
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