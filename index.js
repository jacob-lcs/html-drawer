class Animator {
  constructor() {
    this.durationTime = 0;
    this.easingFn = k => k;
    this.eventHandlers = new Map();
  }

  easing(fn) {
    if (typeof fn !== "function") {
      throw new Error("Easing must be a function, such as k => k");
    }
    this.easingFn = fn;
    return this;
  }

  duration(time) {
    if (typeof time !== "number") {
      throw new Error("Duration must be a number");
    }
    this.durationTime = time;
    return this;
  }

  on(type, handler) {
    if (typeof handler !== "function") {
      throw new Error("Handler must be a function");
    }
    this.eventHandlers.set(type, handler);
    return this;
  }

  animate() {
    const duration = this.durationTime;
    const easing = this.easingFn;
    const update = this.eventHandlers.get("update") || (t => t);
    const complete = this.eventHandlers.get("complete") || (() => {});
    let timer = null;
    const startTime = +new Date();
    function step() {
      const percent = Math.min(1, (+new Date() - startTime) / duration);
      if (percent < 1) {
        update(easing(percent));
        timer = requestAnimationFrame(step);
      } else {
        cancelAnimationFrame(timer);
        update(easing(1));
        complete();
      }
    }
    timer = requestAnimationFrame(step);
  }
}

var move = function(start, step, el) {
  new Animator()
    .duration(200)
    .easing(k => k)
    .on("update", t => {
      el.style.right = String(start + t * step) + "%";
    })
    .animate();
};

var drawStack = [];
var clickButton = function(num) {
  var draws = document.getElementsByClassName("draw");
  var overlay = document.getElementsByClassName("overlay")[0];
  if(drawStack.length==0) overlay.style.display='flex'
  if (drawStack.includes(num - 1)) {
    console.log("在");
    if (draws[num - 1].style.right == "0%") {
      if(drawStack.length==0) overlay.style.display='flex'
      overlay.style.zIndex = 9400;
      move(0, -80, draws[num - 1]);
      drawStack.splice(drawStack.indexOf(num - 1), 1);
      if(drawStack.length != 0){
        move(20, -20, draws[drawStack[drawStack.length - 1]]);
        draws[drawStack[drawStack.length - 1]].style.zIndex = 9500;
      }else{
        overlay.style.display='none'
      }
    } else if (draws[num - 1].style.right == "20%") {
      move(20, -20, draws[num - 1]);
      draws[num - 1].style.zIndex = 9500;
      draws[drawStack[drawStack.length - 1]].style.zIndex = 9300;
      move(0, 20, draws[drawStack[drawStack.length - 1]]);
      drawStack.splice(drawStack.indexOf(num - 1), 1);
      drawStack.push(num - 1);
    }
  } else {
    console.log("不在");
    for (let item of drawStack) {
      if (draws[item].style.right == "0%") {
        move(0, 20, draws[item]);
        draws[item].style.zIndex = 9300;
      }
    }
    draws[num - 1].style.zIndex = 9500;
    move(-80, 80, draws[num - 1]);
    drawStack.push(num - 1);
  }
  
  console.log(drawStack)
};
window.onload = function() {
  var draw_1 = document.getElementById("draw_1");
  var draw_2 = document.getElementById("draw_2");
  var draw_3 = document.getElementById("draw_3");
  var draw_4 = document.getElementById("draw_4");
  var draw = document.getElementById("draw");
  var overlay = document.getElementsByClassName("overlay")[0];
  draw_1.addEventListener("click", () => {
    clickButton(1);
  });
  draw_2.addEventListener("click", () => {
    clickButton(2);
  });
  draw_3.addEventListener("click", () => {
    clickButton(3);
  });
  draw_4.addEventListener("click", () => {
    clickButton(4);
  });
  draw.addEventListener("click", () => {
    var draws = document.getElementsByClassName("draw");
    for (let item of drawStack) {
      if (draws[item].style.right == "0%") {
        move(0, -80, draws[item]);
      } else if (draws[item].style.right == "20%") {
        move(20, -100, draws[item]);
      }
    }
    overlay.style.display='none'
    drawStack = [];
  });
  overlay.addEventListener("click", () => {
    var draws = document.getElementsByClassName("draw");
    var overlay = document.getElementsByClassName("overlay")[0];
    console.log(drawStack[drawStack.length-1])
    move(0, -80, draws[drawStack[drawStack.length-1]]);
    drawStack.pop();
    if(drawStack.length>=1){
      draws[drawStack[drawStack.length-1]].style.zIndex=9500;
      move(20, -20, draws[drawStack[drawStack.length-1]]);
    }
    else overlay.style.display='none';
    console.log(drawStack)
  });
};
