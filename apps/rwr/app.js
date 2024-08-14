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
  
  const incrementAndDrawReps = function() {
    reps++;
    drawParameterScreen("reps", reps);
  };
  
  const incrementAndDrawWork = function() {
    work++;
    drawParameterScreen("work", work);
  };
  
  const incrementAndDrawRest = function() {
    rest++;
    drawParameterScreen("rest", rest);
  };
  
  const decrementAndDrawReps = function() {
    reps--;
    drawParameterScreen("reps", reps);
  };
  
  const decrementAndDrawRest = function() {
    rest--;
    drawParameterScreen("rest", rest);
  };
  
  const decrementAndDrawWork = function() {
    work--;
    drawParameterScreen("work", work);
  };
  
  const sleep = function(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
  };
  
  const countDown = function() {
    if (currWork === 0 && currRest === 0) {
      currWork = work;
      currRest = rest;
      currReps--;
      Bangle.buzz(80, 0.8);
      if (currReps === 0) {
        new Promise(() => setTimeout(() => Bangle.buzz(40), 200)).then(() => Bangle.buzz(80));
        clearInterval(countDownInterval);
        repsScreen();
      } else {
        drawTimerScreen("working", currWork--);
      }
    } else if (currWork === 0) {
      if (currRest === rest) {
        Bangle.buzz(80, 0.8);
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
        incrementAndDrawRest();
      } else if (event.b && event.dy > 0 && rest > 1) {
        decrementAndDrawRest();
      }
    });
    
    Bangle.on("touch", (btn, touch) => {
      if (touch.y < g.getHeight() / 2 - 30) {
        incrementAndDrawRest();
      } else if (touch.y > g.getHeight() / 2 + 40) {
        decrementAndDrawRest();
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
        incrementAndDrawWork();
      } else if (event.b && event.dy > 0 && work > 1) {
        decrementAndDrawWork();
      }
    });
    
    Bangle.on("touch", (btn, touch) => {
      if (touch.y < g.getHeight() / 2 - 30) {
        incrementAndDrawWork();
      } else if (touch.y > g.getHeight() / 2 + 40) {
        decrementAndDrawWork();
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
        incrementAndDrawReps();
      } else if (event.b && event.dy > 0 && reps > 1) {
        decrementAndDrawReps();
      }
    });
    
    Bangle.on("touch", (btn, touch) => {
      if (touch.y < g.getHeight() / 2 - 30) {
        incrementAndDrawReps();
      } else if (touch.y > g.getHeight() / 2 + 40) {
        decrementAndDrawReps();
      } else if (touch.y >= g.getHeight() / 2 - 30 && touch.y <= g.getHeight() / 2 + 40) {
        workScreen();
      }
    });
  };

  repsScreen();
}