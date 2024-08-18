{
  let reps = 50;
  let work = 30;
  let rest = 30;
  let currReps;
  let currWork;
  let currRest;
  let countDownInterval;
  
  const drawNumAndMsg = function(msg, num) {
    g.setFontAlign(0, 0);
    g.setFont("Vector", 25);
    g.drawString(msg, g.getWidth() / 2, 10);
    g.setFont("Vector", 80);
    g.drawString(num, g.getWidth()/2 + 5, g.getHeight()/2 + 10);
  };
  
  const drawControls = function() {
    g.fillPoly([g.getWidth() / 2, g.getHeight() / 2 - 65, g.getWidth() / 2 - 30, g.getHeight() / 2 - 30, g.getWidth() / 2 + 30, g.getHeight() / 2  - 30]);
    g.fillPoly([g.getWidth() / 2, g.getHeight() / 2 + 75, g.getWidth() / 2 - 30, g.getHeight() / 2 + 40, g.getWidth() / 2 + 30, g.getHeight() / 2  + 40]);
  };
  
  const drawTimerScreen = function(msg, num) {
    g.clear(1);
    drawNumAndMsg(msg, num);
  };

  const drawParameterScreen = function(msg, num) {
    g.clear(1);
    drawNumAndMsg(msg, num);
    drawControls();
  };
  
  const countDown = function() {
    if (currWork === 0 && currRest === 0) {
      currWork = work;
      currRest = rest;
      currReps--;
      Bangle.buzz(80);
      if (currReps === 0) {
        new Promise(() => setTimeout(() => Bangle.buzz(40), 200)).then(() => Bangle.buzz(80));
        clearInterval(countDownInterval);
        repsScreen();
      } else {
        drawTimerScreen("working", currWork--);
      }
    } else if (currWork === 0) {
      if (currRest === rest) {
        Bangle.buzz(80);
      }
      drawTimerScreen("resting", currRest--);
    } else {
      drawTimerScreen("working", currWork--);
    }
  };
  
  const doTheThing = function(reps, work, rest) {
    currWork = work;
    currReps = reps;
    currRest = rest;
    Bangle.removeAllListeners("drag");
    Bangle.removeAllListeners("touch");
    countDownInterval = setInterval(countDown, 1000);
  };
  
  const restScreen = function() {
    Bangle.removeAllListeners("drag");
    Bangle.removeAllListeners("touch");
    drawParameterScreen("rest", rest);
    
    Bangle.on("drag", (event) => {
      if (event.b && event.dy < 0) {
        drawParameterScreen("rest", ++rest);
      } else if (event.b && event.dy > 0 && rest > 1) {
        drawParameterScreen("rest", --rest);
      }
    });
    
    Bangle.on("touch", (btn, touch) => {
      if (touch.y < g.getHeight() / 2 - 30) {
        drawParameterScreen("rest", ++rest);
      } else if (touch.y > g.getHeight() / 2 + 40) {
        drawParameterScreen("rest", --rest);
      } else if (touch.y >= g.getHeight() / 2 - 30 && touch.y <= g.getHeight() / 2 + 40) {
        doTheThing(reps, work, rest);
      }
    });
  };
  
  const workScreen = function() {
    Bangle.removeAllListeners("drag");
    Bangle.removeAllListeners("touch");
    drawParameterScreen("work", work);
    
    Bangle.on("drag", (event) => {
      if (event.b && event.dy < 0) {
        drawParameterScreen("work", ++work);
      } else if (event.b && event.dy > 0 && work > 1) {
        drawParameterScreen("work", --work);
      }
    });
    
    Bangle.on("touch", (btn, touch) => {
      if (touch.y < g.getHeight() / 2 - 30) {
        drawParameterScreen("work", ++work);
      } else if (touch.y > g.getHeight() / 2 + 40) {
        drawParameterScreen("work", --work);
      } else if (touch.y >= g.getHeight() / 2 - 30 && touch.y <= g.getHeight() / 2 + 40) {
        restScreen();
      }
    });
  };

  const repsScreen = function() {
    Bangle.removeAllListeners("drag");
    Bangle.removeAllListeners("touch");
    drawParameterScreen("reps", reps);

    Bangle.on("drag", (event) => {
      if (event.b && event.dy < 0) {
        drawParameterScreen("reps", ++reps);
      } else if (event.b && event.dy > 0 && reps > 1) {
        drawParameterScreen("reps", --reps);
      }
    });
    
    Bangle.on("touch", (btn, touch) => {
      if (touch.y < g.getHeight() / 2 - 30) {
        drawParameterScreen("reps", ++reps);
      } else if (touch.y > g.getHeight() / 2 + 40) {
        drawParameterScreen("reps", --reps);
      } else if (touch.y >= g.getHeight() / 2 - 30 && touch.y <= g.getHeight() / 2 + 40) {
        workScreen();
      }
    });
  };

  repsScreen();
}