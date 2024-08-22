localStorage.removeItem('myDataHandle');
let myStepCounter = 0;
let blindSpotX = screen.availWidth/4;

const myDataHandle = Array.from({length: 5}, () => Array.from({ length: 6}, () => []));
console.log('myStepCounter = ' + myStepCounter);
console.log('myDataHandle = ' + myDataHandle);

document.addEventListener('DOMContentLoaded', function() {
    const questionnaireForm = document.getElementById('questionnaireContainer');
    const submitButton = document.getElementById('questionnaireSubmit');
    const questions = questionnaireForm.querySelectorAll('input[type="radio"]');
    
    function checkCompletion() {
        const isComplete = Array.from({ length: 3 }, (_, i) => 
            questionnaireForm.querySelector(`input[name="question${i+1}"]:checked`)
        ).every(input => input !== null);
        submitButton.disabled = !isComplete;
    }
    
    questions.forEach(question => {
        question.addEventListener('change', checkCompletion);
    });

    questionnaireForm.addEventListener('submit', function(event) {
        event.preventDefault(); 

        const firstChoicesPicked = Array.from({ length: 3 }, (_, i) => 
            questionnaireForm.querySelector(`input[name="question${i+1}"]:checked`).value === '1'
        );

        if (firstChoicesPicked.some(isFirstChoice => isFirstChoice)) {
            document.getElementById('questionnaireContainer').style.display = 'none';
            document.getElementById('exclusionMessage').style.display = 'block';
        } else {
            document.getElementById('questionnaireContainer').style.display = 'none';
            document.getElementById('demographicForm').style.display = 'block';
        }

    });
});

document.addEventListener('DOMContentLoaded', function() {
    const ageInput = document.getElementById('age');
    const genderInputs = document.querySelectorAll('input[name="gender"]');
    const ethnicityInputs = document.querySelectorAll('input[name="ethnicity"]');
    const demoSubmit = document.getElementById('demoSubmit');
    const demographicForm = document.getElementById('demographicForm');
    const errorAge = document.getElementById('errorAge');
    
    function checkInputs() {
        const age = ageInput.value;
        const isGenderSelected = Array.from(genderInputs).some(input => input.checked);
        const isEthnicitySelected = Array.from(ethnicityInputs).some(input => input.checked);

        const isAgeValid = age && age >= 0 && age <= 120;
        demoSubmit.disabled = !(isAgeValid && isGenderSelected && isEthnicitySelected);
        
        if (!isAgeValid && age !== "") {
            errorAge.textContent = "请输入有效的年龄。";
        } else {
            errorAge.textContent = "";
        }
    }
    
    ageInput.addEventListener('input', checkInputs);
    genderInputs.forEach(input => input.addEventListener('change', checkInputs));
    ethnicityInputs.forEach(input => input.addEventListener('change', checkInputs));
    
    demographicForm.addEventListener('submit', function(event) {
        event.preventDefault(); 
        const age = ageInput.value;
        const gender = document.querySelector('input[name="gender"]:checked').value;
        const ethnicity = document.querySelector('input[name="ethnicity"]:checked').value;

        if (age < 18) {
            document.getElementById('demographicForm').style.display = 'none';
            document.getElementById('ageExclusionMessage').style.display = 'block';
        } else {
            myDataHandle[0][5] = [gender, age, ethnicity];
            console.log(myDataHandle[0][5]);
            document.getElementById('demographicForm').style.display = 'none';
            document.getElementById('instructionContainer').style.display = 'block';
            
        }
    });
});

// Add event listener to the button when the DOM is fully loaded
document.addEventListener('DOMContentLoaded', (event) => {
    const practiceRoundButton = document.getElementById("practiceRoundButton");
    let testEyeRad = document.querySelectorAll("input[name='testEye']");
    const readyCheckbox = document.getElementById("ready");
    let testEye;

    function openNewWindow() {  
        window.open(
            'gvo.html',
            'newwindow',
            `width=${screen.availWidth},height=${screen.availHeight},scrollbars=no,toolbar=no,location=no,directories=no,status=no,menubar=no`
        );
    }
    
    function buttonClicked(event) {
        //event.preventDefault();
        registerTestEye(); //also registers default blindspot location and calibration method sequence
        openNewWindow();
    }

    testEyeRad.forEach(rb => rb.addEventListener("change", function(){
        readyCheckbox.disabled = false;
        practiceRoundButton.disabled = false;
        testEye = document.querySelector("input[name='testEye']:checked").value;
        console.log('testEye = ' + testEye);
    }));

    document.addEventListener('keydown', function(event) {
        if (event.code === 'Space' || event.key === ' ') {
            event.preventDefault();
        }

        if (readyCheckbox.checked && (event.code === 'Space' || event.key === ' ')) {
            console.log('spacebar pressed');
            event.preventDefault();
            buttonClicked();
        }
    });

    //also registers default blindspot location and calibration method sequence
    function registerTestEye(){
        myDataHandle[0][0] = blindSpotX;
        myDataHandle[0][2] = parseInt(testEye);
        let randomInt = Math.floor(Math.random() * 4) + 1;
        switch(randomInt) {
            case 1:
                myDataHandle[1][3] = [1,2,3,4,5];
                break;
            case 2:
                myDataHandle[1][3] = [2,1,4,3,5];
                break;
            case 3:
                myDataHandle[1][3] = [3,4,1,2,5];
                break;
            case 4:
                myDataHandle[1][3] = [4,3,2,1,5];
                break;
          }
        console.log(myDataHandle);
        console.log(myDataHandle[1][3]);
        localStorage.setItem('myStepCounter', JSON.stringify(myStepCounter));
        localStorage.setItem('blindSpotX', JSON.stringify(blindSpotX));
        localStorage.setItem('myDataHandle', JSON.stringify(myDataHandle));
    }

    practiceRoundButton.style.display = 'none';
    practiceRoundButton.addEventListener('click', buttonClicked);
});
