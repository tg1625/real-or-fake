function Game(){
    //Player class for player and machine
    class Player {
        constructor(n, xpos, ypos, f, size) {
          this.name = n; //name
          this.x = xpos; //x position of the name label
          this.y = ypos;//y position of the name label
          this.font = f; //font of the label
          this.fontSize = size; //font size of the label
          this.score = 0; //player score
        }

        display(){
            textAlign(CENTER);
            //Bounding Box example - https://p5js.org/reference/#/p5.Font/textBounds
            let bbox = this.font.textBounds(this.name, this.x, this.y, this.fontSize);
            fill(0);
            rect(bbox.x - 5, bbox.y - 5, bbox.w + 10, bbox.h + 10);
            fill(255);
            textFont(this.font);
            textSize(this.fontSize);
            text(this.name, this.x, this.y);

            fill(0);
            rect(bbox.x - 5, bbox.y + bbox.h , bbox.w + 10, 48);
            fill(255);
            textFont(this.font);
            textSize(32);
            text(this.score.toString(), this.x, this.y + bbox.h + 24);
        }
      }

    //Timer Class to Keep the Game Clock
    //adapted from this example
    // https://editor.p5js.org/denaplesk2/sketches/ryIBFP_lG
    class Timer{
        constructor(length, font){
            this.length = length;
            this.currTime = length;
            this.font = font;
            this.timer;
        }

        display(){
            //Bounding Box example - https://p5js.org/reference/#/p5.Font/textBounds
            let bbox = this.font.textBounds("TIME REMAINING", width-60, height/2, 16);
            fill(0);
            rect(bbox.x - 5, bbox.y - 5, bbox.w + 10, bbox.h + 10);
            textFont(this.font);
            textSize(16);
            textAlign(CENTER);
            fill(255);
            text("TIME REMAINING", width-60,  height/2);
            fill(0);
            rect(bbox.x - 5, bbox.y + bbox.h , bbox.w + 10, 48);
            fill(255);
            textFont(this.font);
            textSize(32);
            text(this.currTime.toString(), width - 60,  height/2 + bbox.h + 24);
        }

        start(){
            this.timer = setInterval(this.keepTime.bind(this), 1000);
        }

        stop(){
            clearInterval(this.timer);
        }

        keepTime(){
            if(this.currTime > 0){
                this.currTime--;
            }
            // console.log("Timer is at", this.currTime);
        }
    }

    //Game variables
    let questions; 
    let player; 
    let machine;
    let currentQ = 0;
    let answering = false;
    let clock;

    //Sound effects
    let bellSound;
    let correctSound;
    let wrongSound;

    //Button object tings
    var button;

    //Speech Rec Tings
    var myRec = new p5.SpeechRec('en-US', parseResult); // new P5.SpeechRec object\
    myRec.continuous = true; // do continuous recognition
    let mostrecentword;

    //ML Tings
    // To store the classification
    let label = "";

    this.setup = function(){
        //questions
        questions = this.sceneManager.questions;
        //button tings
        button = createSprite(50,50);
        button.scale= 0.25;
        button.position.x = width/2;
        button.position.y = height-100;
        button.addImage(this.sceneManager.buttonImg);
        button.mouseActive = true; 
        button.setDefaultCollider();
        button.onMousePressed = this.answerQuestion;
        
        //Players
        player = new Player("PLAYER", 50, height - 100, this.sceneManager.basicFont, 16);
        machine = new Player("MACHINE", width - 60, height - 100, this.sceneManager.basicFont, 16);

        //clock tings
        clock = new Timer(30, this.sceneManager.basicFont);
        clock.start();

        // graphics stuff:
        createCanvas(500, 500);
        // Start classifying
        this.classifyImage(questions[currentQ].url);

        //Sound effects
        this.sceneManager.backgroundMsc.setVolume(0.05); //lower music volume
        bellSound = this.sceneManager.bellSound;
        correctSound = this.sceneManager.correctSound;
        wrongSound = this.sceneManager.wrongSound;

        //Start speech recognition
        myRec.start();
        
    }

    this.draw = function() {
        //Go to end scene if all rounds are complete
        if(currentQ >4){
            clock.stop(); //stop the clock
            //Find the winner
            if(player.score > machine.score){
                this.sceneManager.winner = "PLAYER";
            }
            else if(player.score == machine.score){
                this.sceneManager.winner = "TIE";
            }
            else{
                this.sceneManager.winner = "MACHINE";
            }
            button.remove(); //remove the button
            this.sceneManager.showScene(End);
        }//else, show the game screen
        else{
            background(200, 200, 200);
            image(this.sceneManager.bkImage, 0, 0);
            fill('rgba(0,0,0, 0.1)')
            rect(0, 0, width, height);
            this.displayQuestion();

            //Round Title
            fill(255);
            textSize(64);
            textFont(this.sceneManager.scriptFont);
            text("Round " + (currentQ + 1).toString(), width/2 - textWidth("Round 1")/2, 75);


            //Display player/machine scores,timer, and button
            player.display(); 
            machine.display();
            clock.display();
            drawSprites();

            //If run out of time, next question
            if(clock.currTime == 0){
                wrongSound.play();
                switchQuestion.bind(this);
                switchQuestion();
            } //esle go through AI stuff
            else{
                aiAnswerChance = int(random(0, 5000));
                //if NOT currently answering a question, after 5 seconds, AI has 0.2% chance of answering every time draw() is run 
                if(clock.currTime < 25 && aiAnswerChance < 10 && !answering){
                    console.log("Will it answer?", aiAnswerChance);
                    checkAnswerMachine.bind(this);
                    checkAnswerMachine();
                } 
            }

            filter(GRAY);
        }
        
    }

    //function to display question image 
    this.displayQuestion = function(){
        image(questions[currentQ].url, width / 2 - 75 , 150, 150, 150);
    }

    //Function that runs after clicking the button to answer question
    this.answerQuestion = function(){
        console.log("Clicked!");
        answering = true;
        clock.stop();
        bellSound.play();
        //Thanks to these random citizens: https://stackoverflow.com/questions/5911211/settimeout-inside-javascript-class-using-this
        //who helped me figure out bind to get the function to work
        timer = setTimeout(checkAnswerPlayer.bind(this), 3000); //will give player 3 seconds to say their answer 
    }

    //Function to check the player's answer
    function checkAnswerPlayer(){
        console.log("Is it real?", questions[currentQ].real);
        const answer = mostrecentword;
        mostrecentword = ""; //reset most recent
        console.log("Player says", answer);
        let correct = false;
        //Check if their answer was correct 
        switch(questions[currentQ].real){
            case true:
                if(answer == "real")
                    correct = true;
            case false:
                if(answer == "fake")
                    correct = true;     
        }
        //handling for if answer is correct or not
        if(correct){
            player.score++;
            correctSound.play();
            timer = setTimeout(switchQuestion.bind(this), 5000);
        }
        else{
            wrongSound.play();
            timer = setTimeout(switchQuestion.bind(this), 3000);
        }
    }

    //Function to check the machine's answer
    //Thanks to these random citizens:https://stackoverflow.com/questions/14226803/wait-5-seconds-before-executing-next-line
    //for the delay function
    const checkAnswerMachine = async() => {
        console.log("Is it real?", questions[currentQ].real);
        console.log("Machine says", label);
        bellSound.play();
        answering = true;
        clock.stop();
        await(delay(2000)); //wait 2 seconds after bell sound before having the AI answer
        var voice = new p5.Speech();
        voice.speak(label);
        await delay(3000); //wait 3 seconds after answer before saying if it's correct 
        let correct = false;
        //Check if their answer was correct, same as player  
        switch(questions[currentQ].real){
            case true:
                if(label == "Real")
                    correct = true;
            case false:
                if(label == "Fake")
                    correct = true;
        }
        mostrecentword = "";
        if(correct){
            machine.score++;
            correctSound.play();
            timer = setTimeout(switchQuestion.bind(this), 5000);
        }
        else{
            wrongSound.play();
            timer = setTimeout(switchQuestion.bind(this), 3000);
        }
    };

    //Move to next question
    function switchQuestion(){
        currentQ +=1;
        //reset clock
        clock.currTime = clock.length;
        clock.start();
        answering = false;
    }

    //Get result for Speech Recognition
    function parseResult(){
        mostrecentword = myRec.resultString.split(' ').pop();
        console.log(mostrecentword);
    }

    //Classification for ML
    this.classifyImage = function(img) {
        this.sceneManager.classifier.classify(img, this.gotResult);
    }

    //Result of ML
    this.gotResult = function(error, results) {
    // If there is an error
        if (error) {
            console.error(error);
            return;
        }
        label = results[0].label;
    }

    //Thanks to these random citizens:https://stackoverflow.com/questions/14226803/wait-5-seconds-before-executing-next-line
    //for the delay function
    const delay = ms => new Promise(res => setTimeout(res, ms));
}

