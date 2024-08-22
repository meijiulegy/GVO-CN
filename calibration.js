/*
method 1: fixed distance in cm
method 2: relative distance
method 3: blindspot with moving dot
method 4: blindspot with fixed dot
*/

const myStoredStepCounter = localStorage.getItem('myStepCounter');
let myStepCounter = JSON.parse(myStoredStepCounter);
//myStepCounter = 3; //for development
console.log('myStepCounter = ' + myStepCounter);
localStorage.setItem('myStepCounter', JSON.stringify(myStepCounter)); // for development
let blindSpotX;
const myStoredDataHandle = localStorage.getItem('myDataHandle');
const myDataHandle = JSON.parse(myStoredDataHandle);

function openNewWindow() {  
    window.open(
        'gvo.html',
        'newwindow',
        `width=${screen.availWidth},height=${screen.availHeight},scrollbars=no,toolbar=no,location=no,directories=no,status=no,menubar=no`
    );
}

if (myStepCounter == 1){
    /*
    standard ID card = 86*54mm, A4 paper = 297*210mm, 
    tan(15 deg) = 0.268,  297mm*tan(15deg) = 79.6mm, 300mm*tan(15deg) = 80.38mm
    let user resize a rectangle, length = x pixel, calibration: (x/86) pixel/mm
    at distance = 297mm
    +15 deg blindspot horizontal position: + (79.6/86)*x pixel
    */
    document.addEventListener('DOMContentLoaded', () => {
            
        const myCardImg = document.getElementById('bankCard');
        const smallerButton = document.getElementById('smaller');
        const biggerButton = document.getElementById('bigger');
        const startGVOButton = document.getElementById("startGVO");
        const readyCheckbox = document.getElementById("ready");
        
        if (myDataHandle[0][2] == -1) {
            document.getElementById("chosenEye").innerHTML = '准备好后，遮盖您的右眼，<strong>勾选“我已准备好”，然后按下空格键</strong>以开始视野测试。';
        }else if(myDataHandle[0][2] == 1) {
            document.getElementById("chosenEye").innerHTML = '准备好后，遮盖您的左眼，<strong>勾选“我已准备好”，然后按下空格键</strong>以开始视野测试。';
        }else{
            document.getElementById("chosenEye").innerHTML = '准备好后，遮盖不被测试的眼睛，<strong>勾选“我已准备好”，然后按下空格键</strong>以开始视野测试。';
        }

        let currentWidth = myCardImg.width;
        console.log(currentWidth);

        smallerButton.addEventListener("click", () => {
            makeSmaller();
            calculateBlindSpot();
        });
        biggerButton.addEventListener("click", () => {
            makeBigger();
            calculateBlindSpot();
        });

        function makeSmaller(){
            currentWidth -= 10;
            myCardImg.style.width = currentWidth + 'px';
            console.log('card width = ' + currentWidth);
        }
        function makeBigger(){
            currentWidth += 10;
            myCardImg.style.width = currentWidth + 'px';
            console.log('card width = ' + currentWidth);
        }

        function storeBlindSpotX(){
            blindSpotX = Math.floor(currentWidth * 300 / 86 * getTanDeg(15));
            myDataHandle[1][0] = blindSpotX;
            localStorage.setItem('myDataHandle', JSON.stringify(myDataHandle));
        }

        function getTanDeg(deg) {
            const rad = (deg * Math.PI) / 180;
            return Math.tan(rad);
        }

        document.addEventListener('keydown', function(event) {
            if (event.key === '-') {
                makeSmaller();
                calculateBlindSpot();
            } else if (event.key === '+' || event.key === '=') {
                makeBigger();
                calculateBlindSpot();
            }
        });

        function calculateBlindSpot(){
            blindSpotX = Math.floor(currentWidth * 300 / 86 * getTanDeg(15));
            if (blindSpotX > window.innerWidth * 0.3){
                document.addEventListener('keydown', disableSpacebar)
                document.removeEventListener('keydown', spacebarPressed);
                document.getElementById('startGVO').disabled = true;
                document.getElementById('errorMsg').textContent = '错误：请正确调整图像大小。建议使用更大的屏幕。';
            
            }else{
                document.addEventListener('keydown', spacebarPressed);
                document.getElementById('startGVO').disabled = false;
                document.getElementById('errorMsg').textContent = '';
            }
        }

        function spacebarPressed(event) {
            event.preventDefault();
            if (readyCheckbox.checked && (event.code === 'Space' || event.key === ' ')) {
                console.log('spacebar pressed');
                startButtonClicked();
            }
        }

        function disableSpacebar(event) {
            event.preventDefault();
        }

        function startButtonClicked(event) {
            //event.preventDefault();
            storeBlindSpotX();
            openNewWindow();
        }

        startGVOButton.style.display = 'none';
        startGVOButton.addEventListener('click', startButtonClicked);
        document.addEventListener('keydown', spacebarPressed);
    });




} else if (myStepCounter == 2){
    /*
    display k pixels on screen
    blindspot horizontal position: + 0.268*k pixel
    blindspot vertical position: - 0.0262*k pixel
    */
    document.addEventListener('DOMContentLoaded', (event) => {
        const startGVOButton = document.getElementById("startGVO");
        const readyCheckbox = document.getElementById("ready");
        if (myDataHandle[0][2] == -1) {
            document.getElementById("chosenEye").innerHTML = '准备好后，遮盖您的右眼，<strong>勾选“我已准备好”，然后按下空格键</strong>以开始视野测试。';
        }else if(myDataHandle[0][2] == 1) {
            document.getElementById("chosenEye").innerHTML = '准备好后，遮盖您的左眼，<strong>勾选“我已准备好”，然后按下空格键</strong>以开始视野测试。';
        }else{
            document.getElementById("chosenEye").innerHTML = '准备好后，遮盖不被测试的眼睛，<strong>勾选“我已准备好”，然后按下空格键</strong>以开始视野测试。';
        }

        document.getElementById('lineDiv').style.height = 0.2*window.innerWidth + 'px'
        document.getElementById('doubleArrow').style.width = 0.75*window.innerWidth + 'px';
        blindSpotX = Math.floor(0.75*0.268*window.innerWidth);
        myDataHandle[2][0] = blindSpotX;
        localStorage.setItem('myDataHandle', JSON.stringify(myDataHandle));
        console.log(myDataHandle);
        console.log('blindSpotX = ' + blindSpotX);
        
        function buttonClicked(event) {
            //event.preventDefault();
            openNewWindow();
        }
        
        startGVOButton.style.display = 'none';
        startGVOButton.addEventListener('click', buttonClicked);
        document.addEventListener('keydown', function(event) {
            event.preventDefault();
            if (readyCheckbox.checked && (event.code === 'Space' || event.key === ' ')) {
                console.log('spacebar pressed');
                event.preventDefault();
                buttonClicked();
            }
        });
    });

} else if (myStepCounter == 3){
    document.addEventListener("DOMContentLoaded", () => {
        if (myDataHandle[3][5] != 1) {
            myDataHandle[3][3] = [];
        }
        console.log('window.innerWidth = ' + window.innerWidth);
        console.log(myDataHandle);
        document.getElementById('startBlindSpotCalibration').style.display = 'block';
        document.getElementById('repeatInfo').textContent = `按下按钮以开始校准`;
        const startGVOButton = document.getElementById('blindSpotCalibrationStartGVO');
        const readyCheckbox = document.getElementById("ready");
        readyCheckbox.style.display = 'none';
        document.getElementById("readyLabel").style.display = 'none';
        const root = document.documentElement;
        root.style.setProperty('--blindSpotMovement', myDataHandle[0][2] * window.innerWidth / 2 + "px");
        let fixationPositionX;
        let blindSpotPositionX;
        let arrayBS = [];
        const beep = document.getElementById("beep");

        if (myDataHandle[0][2] == -1) {
            document.getElementById("chosenEye1").innerHTML = '遮盖右眼，并用左眼盯住下方的黄色目标。';
            document.getElementById("chosenEye2").innerHTML = '保持左眼盯住中间黄色目标，<strong>在红点消失时鼠标点击按钮。</strong>';
        }else if(myDataHandle[0][2] == 1) {
            document.getElementById("chosenEye1").innerHTML = '遮盖左眼，并用右眼盯住下方的黄色目标。';
            document.getElementById("chosenEye2").innerHTML = '保持右眼盯住中间黄色目标，<strong>在红点消失时鼠标点击按钮。</strong>';
        }else{
            document.getElementById("chosenEye1").innerHTML = '用测试眼盯住下方的黄色目标，并遮盖另一只眼睛。';
            document.getElementById("chosenEye2").innerHTML = '保持测试眼盯住中间黄色目标，<strong>在红点消失时鼠标点击按钮。</strong>';
        }
    
        console.log('fixationPoint is at ' + document.getElementById('fixationPoint').getBoundingClientRect().left);
    
        //The three measurements are separately coded due to bugs which I'm unable to fix. Consider simplifying later.
        function startCalibration1() {
            document.getElementById('startBlindSpotCalibration').style.display = 'none';
            document.getElementById('now1').style.display = 'block';
            document.getElementById('repeatInfo').textContent = `当红点消失时，点击上方的按钮`;
            document.getElementById('blindSpotLocator1').style.display = 'block';
            document.getElementById('blindSpotLocator1').classList.add('locatorStartMoving');
    
            setTimeout(() => {
                stopCalibration1();
            }, 10000);
            //document.addEventListener("keydown", processBlindSpotX1);
            document.getElementById('now1').addEventListener("click", processBlindSpotX1);
        }
    
        function stopCalibration1() {
            document.getElementById('blindSpotLocator1').classList.remove('locatorStartMoving');
            document.getElementById('blindSpotLocator1').style.display = 'none';
        }
    
        function processBlindSpotX1() {
            playAudio();
            document.getElementById('now1').style.display = 'none';
            document.removeEventListener('keydown', processBlindSpotX1);
    
            fixationPositionX = document.getElementById('fixationPoint').getBoundingClientRect().left;
            blindSpotPositionX = document.getElementById('blindSpotLocator1').getBoundingClientRect().left;
            const currentBlindSpotX = Math.abs(Math.round(blindSpotPositionX - fixationPositionX));
            
            document.getElementById('blindSpotLocator1').style.display = 'none';
            document.getElementById('blindSpotLocator1').classList.remove('locatorStartMoving');
    
            arrayBS[0] = currentBlindSpotX;
            document.getElementById('repeatInfo').textContent = `再重复2次`;
            document.getElementById('repeatCalibration2').style.display = 'block';
        }
    
        function startCalibration2() {
            document.getElementById('repeatCalibration2').style.display = 'none';
            document.getElementById('now2').style.display = 'block';
            document.getElementById('repeatInfo').textContent = `当红点消失时，点击上方的按钮`;
            document.getElementById('blindSpotLocator2').style.display = 'block';
            document.getElementById('blindSpotLocator2').classList.add('locatorStartMoving');
    
            setTimeout(() => {
                stopCalibration2();
            }, 10000);
            //document.addEventListener("keydown", processBlindSpotX2);
            document.getElementById('now2').addEventListener("click", processBlindSpotX2);
        }
        function stopCalibration2() {
            document.getElementById('blindSpotLocator2').classList.remove('locatorStartMoving');
            document.getElementById('blindSpotLocator2').style.display = 'none';
        }
    
        function processBlindSpotX2() {
            playAudio();
            document.getElementById('now2').style.display = 'none';
            document.removeEventListener('keydown', processBlindSpotX2);
    
            fixationPositionX = document.getElementById('fixationPoint').getBoundingClientRect().left;
            blindSpotPositionX = document.getElementById('blindSpotLocator2').getBoundingClientRect().left;
            const currentBlindSpotX = Math.abs(Math.round(blindSpotPositionX - fixationPositionX));
            
            document.getElementById('blindSpotLocator2').style.display = 'none';
            document.getElementById('blindSpotLocator2').classList.remove('locatorStartMoving');
    
            arrayBS[1] = currentBlindSpotX;
            document.getElementById('repeatInfo').textContent = `再重复1次`;
            document.getElementById('repeatCalibration3').style.display = 'block';
        }
    
        function startCalibration3() {
            document.getElementById('repeatCalibration3').style.display = 'none';
            document.getElementById('now3').style.display = 'block';
            document.getElementById('repeatInfo').textContent = `当红点消失时，点击上方的按钮`;
            document.getElementById('blindSpotLocator3').style.display = 'block';
            document.getElementById('blindSpotLocator3').classList.add('locatorStartMoving');
    
            setTimeout(() => {
                stopCalibration3();
            }, 10000);
            //document.addEventListener("keydown", processBlindSpotX3);
            document.getElementById('now3').addEventListener("click", processBlindSpotX3);
        }
    
        function stopCalibration3() {
            document.getElementById('blindSpotLocator3').classList.remove('locatorStartMoving');
            document.getElementById('blindSpotLocator3').style.display = 'none';
        }
    
        function processBlindSpotX3() {
            playAudio();
            document.getElementById('now3').style.display = 'none';
            document.removeEventListener('keydown', processBlindSpotX3);
    
            fixationPositionX = document.getElementById('fixationPoint').getBoundingClientRect().left;
            blindSpotPositionX = document.getElementById('blindSpotLocator3').getBoundingClientRect().left;
            const currentBlindSpotX = Math.abs(Math.round(blindSpotPositionX - fixationPositionX));
            
            document.getElementById('blindSpotLocator3').style.display = 'none';
            document.getElementById('blindSpotLocator3').classList.remove('locatorStartMoving');
    
            arrayBS[2] = currentBlindSpotX;
            console.log(arrayBS);
            myDataHandle[3][3].push(arrayBS);
    
            document.getElementById('repeatInfo').textContent = ``;
            document.getElementById('repeatCalibration3').style.display = 'none';

            let mySortedArr = arrayBS;
            mySortedArr.sort(function(a, b) {
                return a-b;
            });
            console.log(mySortedArr);

            if (myDataHandle[3][5] == 1) {
                if (mySortedArr[0] > window.innerWidth * 0.3) {
                    //mark as failed cali, use width/4
                    myDataHandle[3][4]='failed calibration. smallest measured blindspot in both rounds > 0.3 * innerWidth or no response. Using 0.25 * innerWidth as blindspot';
                    const blindSpotX = window.innerWidth * 0.25;
                    myDataHandle[3][0] = blindSpotX;
                    processData();
                } else if (mySortedArr[1] > window.innerWidth * 0.3 && mySortedArr[0] < window.innerWidth * 0.3) {
                    myDataHandle[3][4] = '2nd round smallest value used for blindspot; median value > 0.3 * innerWidth';
                    //use smallest value
                    const blindSpotX = mySortedArr[0];
                    myDataHandle[3][0] = blindSpotX;
                    processData();
                } else {
                    myDataHandle[3][4] = '2nd round median value used for blindspot';
                    //use median
                    const blindSpotX = mySortedArr[1];
                    myDataHandle[3][0] = blindSpotX;
                    processData();
                }

            } else {
                if (mySortedArr[0] > window.innerWidth * 0.3) {
                    //error msg: move closer to screen, redo test. 
                    myDataHandle[3][4]='first round calibration failed; small value > 0.3 * innerWidth or no response.';
                    document.getElementById('errorBS1').textContent = '请将头部移近屏幕，然后点击上方的按钮以重新进行校准';
                    document.getElementById('redoBlindSpotCalibration').style.display = 'block';
                } else if (mySortedArr[1] > window.innerWidth * 0.3 && mySortedArr[0] < window.innerWidth * 0.3) {
                    myDataHandle[3][4] = 'first round smallest value used for blindspot; median value > 0.3 * innerWidth';
                    //use smallest value
                    const blindSpotX = mySortedArr[0];
                    myDataHandle[3][0] = blindSpotX;
                    processData();
                } else {
                    myDataHandle[3][4] = 'first round median value used for blindspot';
                    //use median
                    const blindSpotX = mySortedArr[1];
                    myDataHandle[3][0] = blindSpotX;
                    processData();
                }

            }


            function processData(){
                localStorage.setItem('myDataHandle', JSON.stringify(myDataHandle));
                console.log(myDataHandle[3][4]);
                console.log('registered blindspot = ' + myDataHandle[3][0]);
                //document.getElementById('blindSpotCalibrationStartGVO').style.display = 'block';
                readyCheckbox.style.display = 'inline';
                document.getElementById("readyLabel").style.display = 'inline';
                document.getElementById('repeatInfo').textContent = `勾选“我已准备好”，然后按下空格键以开始测试。`;
                startGVOButton.addEventListener('click', buttonClicked);
                document.addEventListener('keydown', function(event) {
                    event.preventDefault();
                    if (readyCheckbox.checked && (event.code === 'Space' || event.key === ' ')) {
                        console.log('spacebar pressed');
                        event.preventDefault();
                        buttonClicked();
                    }
                });
            }

            function buttonClicked(event) {
                //event.preventDefault();
                openNewWindow();
            }
    

            //code for implementing statistical tests for measurements outliers
            /* 
            if(sDtest(arrayBS, 2)) { //call SD test, 2nd parameter is sd threshold
            //if(dixonsQTest(arrayBS)) { //call dixons Q test
                const blindSpotX = Math.round(arrayBS.reduce((a, b) => a + b, 0) / arrayBS.length);
                myDataHandle[3][0] = blindSpotX;
                if(blindSpotX > window.innerWidth * 0.3){
                    document.getElementById('redoBlindSpotCalibration').style.display = 'block';
                    document.getElementById('errorBS1').textContent = 'Please move your head closer to the screen and redo calibration by pressing the button above.';
                }else{
                    localStorage.setItem('myDataHandle', JSON.stringify(myDataHandle));
                    console.log('blindSpotX = ' + blindSpotX);
                    document.getElementById('blindSpotCalibrationStartGVO').style.display = 'block';
                    document.getElementById('redoBlindSpotCalibration').style.display = 'block';
                }
            } else {
                document.getElementById('redoBlindSpotCalibration').style.display = 'block';
                document.getElementById('errorBS1').textContent = 'Low consistency among the 3 measurements. Please redo the calibration by pressing the button above.';
                document.getElementById('errorBS2').textContent = 'Make sure that you are keeping your head still in the entire process.'
            }
            */

        }
    
        function dixonsQTest(a) {
            if (a.length !== 3) {
                throw new Error("The array must contain exactly three elements");
            }
    
            const myCurrentArray = a;
            myCurrentArray.sort(function(a, b) {
                return a-b;
            });
            console.log(myCurrentArray);
            const qRange = myCurrentArray[2] - myCurrentArray[0];
            const q1 = (myCurrentArray[1] - myCurrentArray[0])/ qRange;
            const q2 = (myCurrentArray[2] - myCurrentArray[1])/ qRange;
            if (q1 < 0.941 && q2 < 0.941){
                console.log('dixon q test passed');
                return true; 
            }else{
                console.log('dixon q test failed, redo calibration');
                return false;
            }
        }

        function sDtest(arr, acceptedThreshold) {
            const avg = arr.reduce((a, b) => a + b, 0) / arr.length;
            const sqDiff = arr.map(a => Math.pow(a-avg, 2));
            const sD = Math.sqrt(sqDiff.reduce((a, b) => a + b, 0) / arr.length);
            console.log('avg = ' + avg);
            console.log('SD = ' + sD);
            for (let i = 0; i < arr.length; i ++) {
                if (Math.abs((arr[i] - avg) / sD) > acceptedThreshold) {
                    return false;
                }
            }
            return true;
        }
    
        function redoCalibration() {
            myDataHandle[3][5] = 1;
            localStorage.setItem('myDataHandle', JSON.stringify(myDataHandle));
            window.location.reload();
        }
    
        function playAudio() {
            beep.play();
        }

        document.getElementById('startBlindSpotCalibration').addEventListener('click', startCalibration1);
        document.getElementById('repeatCalibration2').addEventListener('click', startCalibration2);
        document.getElementById('repeatCalibration3').addEventListener('click', startCalibration3);
        document.getElementById('redoBlindSpotCalibration').addEventListener('click', redoCalibration);
    });

} else if (myStepCounter == 4){
    document.addEventListener('DOMContentLoaded', () => {

        if (myDataHandle[0][2] == -1) {
            document.getElementById("chosenEye").innerHTML = '遮盖右眼，并用左眼盯住下方的黄色目标。';
        }else if(myDataHandle[0][2] == 1) {
            document.getElementById("chosenEye").innerHTML = '遮盖左眼，并用右眼盯住下方的黄色目标。';
        }else{
            document.getElementById("chosenEye").innerHTML = '用测试眼盯住下方的黄色目标，并遮盖另一只眼睛。';
        }

        const startGVOButton = document.getElementById('blindSpotCalibrationStartGVO');
        const readyCheckbox = document.getElementById("ready");
        let fixationPositionX;
        let blindSpotPositionX;
        let blindSpotXPercent;
        blindSpotXPercent = 50 + myDataHandle[0][2] * 25
        document.getElementById('blindSpotLocator1').style.left = blindSpotXPercent.toString() + '%';
        document.getElementById('blindSpotLocator1').style.display = 'block';
        fixationPositionX = document.getElementById('fixationPoint').getBoundingClientRect().left;
        blindSpotPositionX = document.getElementById('blindSpotLocator1').getBoundingClientRect().left;
        blindSpotX = Math.abs(Math.floor(blindSpotPositionX - fixationPositionX));
        myDataHandle[4][0] = blindSpotX;
        localStorage.setItem('myDataHandle', JSON.stringify(myDataHandle));
        console.log(myDataHandle);
        console.log('blindSpotX = ' + blindSpotX);

        function buttonClicked(event) {
            //event.preventDefault();
            openNewWindow();
        }
    
        startGVOButton.style.display = 'none';
        startGVOButton.addEventListener('click', buttonClicked);
        document.addEventListener('keydown', function(event) {
            event.preventDefault();
            if (readyCheckbox.checked && (event.code === 'Space' || event.key === ' ')) {
                console.log('spacebar pressed');
                event.preventDefault();
                buttonClicked();
            }
        });
    });


    


} else {
    console.log("Error. Please start over at /index.html. Do not return to previous page.")
}

