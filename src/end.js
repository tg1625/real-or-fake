function End()
{
    this.setup = function(){
        this.sceneManager.backgroundMsc.setVolume(0.3);
        console.log("The winner is", this.sceneManager.winner);
    }

    this.draw = function()
    {
        image(this.sceneManager.bkImage, 0, 0);
        this.drawEndScreen();        
    }

    this.keyPressed = function()
    {
        if ( keyCode == 32 ) //press space to restart
        {
            // Invoke the Game scene passing as argument the string '1' or '2'
            this.sceneManager.showScene(Game);
        }
    }

    this.drawEndScreen = function()
    {
        fill('rgba(0,0,0, 0.15)')
        rect(0, 0, width, height);
        textFont(this.sceneManager.scriptFont);
        textSize(60);
        textStyle(BOLD);
        textAlign(CENTER);
        fill(255);
        text("the winner is...", width / 2 + 20, height/2 - 40);

        textFont(this.sceneManager.basicFont);

        textSize(120);
        text(this.sceneManager.winner, width / 2, height/2 + 80);

        textSize(24);
        // text("Press space to replay ", width / 2, height - 50);
    }

}