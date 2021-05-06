function Intro()
{
    this.setup = function(){
        this.sceneManager.backgroundMsc.play();
        this.sceneManager.backgroundMsc.setLoop(true);
        this.sceneManager.backgroundMsc.setVolume(0.3);
    }

    this.draw = function()
    {
        image(this.sceneManager.bkImage, 0, 0);
        
        this.drawIntroScreen();        
    }

    this.keyPressed = function()
    {
        if ( keyCode == 32 ) //press space to start
        {
            // Invoke the Game scene passing as argument the string '1' or '2'
            this.sceneManager.showScene( Game);
            // this.sceneManager.backgroundMsc.stop();
        }
    }

    this.drawIntroScreen = function()
    {
        fill('rgba(0,0,0, 0.15)')
        rect(0, 0, width, height);
        textFont(this.sceneManager.scriptFont);
        textSize(36);
        textStyle(BOLD);
        textAlign(CENTER);
        fill(255);
        text("it's time to play...", width / 2, 75);

        textFont(this.sceneManager.basicFont);

        textSize(96);
        text("REAL", width / 2 - 48, height/2 - 48);

        textSize(48);
        text("or", width / 2, height/2);

        textSize(96);
        text("FAKE", width / 2 + 48, height/2 + 96);
    

        textSize(24);
        text("Press space to start ", width / 2, height - 50);
    }

}