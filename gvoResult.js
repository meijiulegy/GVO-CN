
 //parse stored data
const myStoredDataHandle = localStorage.getItem('myDataHandle');
const myDataHandle = JSON.parse(myStoredDataHandle);
console.log(myDataHandle);

const myStoredStepCounter = localStorage.getItem('myStepCounter');
let myStepCounter = JSON.parse(myStoredStepCounter);
const resultCircleDiameter = "10px";
const resultDiagramWidth = 600;
let resultDiagramHeight = resultDiagramWidth * window.innerHeight/window.innerWidth; //change to = resultDiagramWidth for a square diagram
let buttonToShow;
let nextButton = document.getElementById("nextButton");
if (myStepCounter == 0){
  nextButton.disabled = false;
}

function adjustCaliReminder(a) {
  const cali1 = '调整屏幕上卡片大小，距离通过A4纸测量';
  const cali2 = '使用绳子测量的距离';
  const cali3 = '反馈红点何时消失';
  const cali4 = '前后移动头部';

  switch(a) {
    case 1:
      document.getElementById('reminder').textContent = `请根据难易程度为之前的距离校准方法评分（${cali1}）:`;
      break;
    case 2:
      document.getElementById('reminder').textContent = `请根据难易程度为之前的距离校准方法评分（${cali2}）:`;
      break;
    case 3:
      document.getElementById('reminder').textContent = `请根据难易程度为之前的距离校准方法评分（${cali3}）:`;
      break;
    case 4:
      document.getElementById('reminder').textContent = `请根据难易程度为之前的距离校准方法评分（${cali4}）:`;
      break;
    default:
      document.getElementById('reminder').textContent = `请根据难易程度为之前的距离校准方法评分:`;
      break;
  }
}

if (myStepCounter == 0) {
  document.getElementById('userScoreContainer').style.display = 'none';
}


if (myStoredDataHandle) {
  myParsedMatrix = myDataHandle[myStepCounter][1];
  numRows = myDataHandle[0][3];
  numColumns = myDataHandle[0][4];
  console.log(myParsedMatrix); 
} else {
  console.log("No GVO data found. You need to do the GVO first. See /gvo.html"); 
}

//devide the result diagram, then color the sections
const resultDiagram = document.getElementById('resultDiagram');
resultDiagram.style.width = resultDiagramWidth + 'px';
resultDiagram.style.height = resultDiagramHeight + 'px';

function showResults(numRows, numColumns) {
  //const sectionWidth = resultDiagram.offsetWidth / numColumns; 
  //const sectionHeight = resultDiagram.offsetHeight / numRows;

  for (let i = 0; i < numRows; i++) {
    for (let j = 0; j < numColumns; j++) {
      if (myParsedMatrix[i][j][0] === -1) {
        continue;
      }
      const section = document.createElement('div');
      section.classList.add('section');
      section.style.width = resultCircleDiameter; //sectionWidth - 1 + 'px';
      section.style.height = resultCircleDiameter; //sectionHeight - 1 + 'px';
      section.style.borderRadius = "50%";
      //section.style.left = (j + 0.5) * sectionWidth - 2 + 'px';
      //section.style.top = (i + 0.5) * sectionHeight - 2 + 'px';
      section.style.top = myParsedMatrix[i][j][1];
      section.style.left = myParsedMatrix[i][j][2];
      section.style.transform = "translate(-50%, -50%)";
      
      //color missed section black
      if (myParsedMatrix[i][j][0] === 0) {
          section.style.backgroundColor = 'black';
      }
      //overwrite center section with yellow color
      if ((numRows % 2 == 1 && numColumns % 2 == 1) && (i == Math.floor(numRows/2) && j == Math.floor(numColumns/2))){
          section.style.backgroundColor = 'yellow';
      }
      //bundle
      resultDiagram.appendChild(section);
    }
  }

  if (myStepCounter != 0) {
    for (let i = 0; i < 9; i++) {
      const section = document.createElement('div');
      section.classList.add('section');
      section.style.width = resultCircleDiameter; //sectionWidth - 1 + 'px';
      section.style.height = resultCircleDiameter; //sectionHeight - 1 + 'px';
      section.style.borderRadius = "50%";
      section.style.top = myParsedMatrix[numRows][i][1];
      section.style.left = myParsedMatrix[numRows][i][2];
      section.style.transform = "translate(-50%, -50%)";
      
      //color missed section black
      if (myParsedMatrix[numRows][i][0] === 0) {
          section.style.backgroundColor = 'black';
      }
      //bundle
      resultDiagram.appendChild(section);
    }
  }

  //add a center section with yellow color if even by even grid
  if (numRows % 2 == 0 || numColumns % 2 == 0) {
    const midPoint = document.createElement('div');
    midPoint.classList.add('section');
    midPoint.style.width = resultCircleDiameter; //sectionWidth - 1 + 'px';
    midPoint.style.height = resultCircleDiameter; //sectionHeight - 1 + 'px';
    midPoint.style.borderRadius = "50%";
    midPoint.style.left = resultDiagram.offsetWidth / 2 + 'px';
    midPoint.style.top = resultDiagram.offsetHeight / 2 + 'px';
    midPoint.style.transform = "translate(-50%, -50%)";
    midPoint.style.backgroundColor = 'yellow';
    resultDiagram.appendChild(midPoint);
  }

  let userScoreRad = document.querySelectorAll("input[name='userScore']");
  let userScore;

  userScoreRad.forEach(rb => rb.addEventListener("change", function(){
      nextButton.disabled = false;
      userScore = document.querySelector("input[name='userScore']:checked").value;
      console.log('userScore = ' + userScore);
      myDataHandle[myStepCounter][2] = [parseInt(userScore)];
      console.log(myDataHandle);
      localStorage.setItem('myDataHandle', JSON.stringify(myDataHandle));
  }));

  adjustCaliReminder(myStepCounter);
}

function openNewWindow() { 
  let windowName; 
  let methodSeq = myDataHandle[1][3];
  if (myStepCounter == 0) {
    myStepCounter = methodSeq[0];
    windowName = 'calibration' + myStepCounter.toString() + '.html';
  }else{
    let currentIndex = methodSeq.indexOf(myStepCounter);
    myStepCounter = methodSeq[currentIndex + 1];
    if (myStepCounter == 5) {
      windowName = 'scoreRevision.html'
    } else {
      windowName = 'calibration' + myStepCounter.toString() + '.html';
    }
  }

  console.log('updated stepCounter = ' + myStepCounter);
  localStorage.setItem('myStepCounter', JSON.stringify(myStepCounter));

  window.open(
      windowName,
      'newwindow',
      `width=${screen.availWidth},height=${screen.availHeight},scrollbars=no,toolbar=no,location=no,directories=no,status=no,menubar=no`
  );
}

let methodSeq = myDataHandle[1][3];
let testCompleted = methodSeq.indexOf(myStepCounter) + 1;
if (testCompleted == 4) {
  nextButton.textContent = '下一步';
}

showResults(numRows,numColumns);
nextButton.addEventListener('click', openNewWindow)
localStorage.removeItem('myGvoMatrix');