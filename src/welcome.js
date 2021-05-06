function Welcome()
{
    this.draw = function()
    {
        image( this.sceneManager.bkImage, 0, 0);

        drawIntroScreen();        
    }

    this.keyPressed = function()
    {
        if ( keyCode == 32 ) //press space to start
        {
            // Invoke the Game scene passing as argument the string '1' or '2'
            this.sceneManager.showScene( Game);
        }
    }

    function drawIntroScreen()
    {
        
        textSize(24);
        textStyle(BOLD);
        textAlign(CENTER);
        fill("white");
        text("Today's contestants...", width / 2, 50);

        textSize(48);
        textStyle(BOLD);
        text("REAL or FAKE", width / 2, height/2);

    

        fill("black");
        textSize(12);

        text("Press space to start ", width / 2, height / 2 + 150);
    }

}