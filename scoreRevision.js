const myStoredDataHandle = localStorage.getItem('myDataHandle');
const myDataHandle = JSON.parse(myStoredDataHandle);
console.log(myDataHandle);

const cali1 = '<strong>使用卡片进行校准:</strong> 调整屏幕上卡片大小，距离通过A4纸测量';
const cali2 = '<strong>使用绳子进行校准:</strong> 用绳子测量屏幕上箭头的长度';
const cali3 = '<strong>通过一个移动红点校准:</strong> 反馈红点何时消失时';
const cali4 = '<strong>通过前后移动头部校准:</strong> 前后移动头部直到红点消失';

document.addEventListener('DOMContentLoaded', () => {
    const methodSeq = myDataHandle[1][3];
    
    for (let i = 1; i < methodSeq.length; i++) {
        //update text
        let currentPTag = 'method' + i.toString();
        let currentMethod = methodSeq[i-1];

        switch(currentMethod) {
            case 1:
                document.getElementById(currentPTag).innerHTML = cali1;
                break;
            case 2:
                document.getElementById(currentPTag).innerHTML = cali2;
                break;
            case 3:
                document.getElementById(currentPTag).innerHTML = cali3;
                break;
            case 4:
                document.getElementById(currentPTag).innerHTML = cali4;
                break;
        }

        //prefill radio button
        let oldScore = myDataHandle[currentMethod][2];
        let prefillId = 'score' + i.toString() + '-' + oldScore.toString();
        document.getElementById(prefillId).checked = true;
    }

    //eventlistener for changes
    document.getElementById('nextButton').addEventListener('click', function() {
        for (let i = 0; i < methodSeq.length - 1; i++) {
            let currentQuery = "input[name='scoreMethod" + (i+1).toString() + "']:checked";
            let currentScore = document.querySelector(currentQuery).value;
            myDataHandle[methodSeq[i]][2].push(parseInt(currentScore));
        }
        localStorage.setItem('myDataHandle', JSON.stringify(myDataHandle));

        window.open(
            'endInstructions.html',
            'newwindow',
            `width=${screen.availWidth},height=${screen.availHeight},scrollbars=no,toolbar=no,location=no,directories=no,status=no,menubar=no`
        );
    });

});