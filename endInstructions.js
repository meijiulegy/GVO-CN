document.addEventListener('DOMContentLoaded', () => {
    const myStoredDataHandle = localStorage.getItem('myDataHandle');
    const myDataHandle = JSON.parse(myStoredDataHandle);
    const emailLink1 = document.getElementById('emailLink1');
    const emailLink2 = document.getElementById('emailLink2');

    function copyToClipboard() {
        var textField = document.getElementById("dataField");
        textField.select();
    
        try {
            var successful = document.execCommand('copy');
            var msg = successful ? 'successful' : 'unsuccessful';
            console.log('Copy was ' + msg);
        } catch (err) {
            console.error('Unable to copy', err);
        }
        window.getSelection().removeAllRanges();
    }
    
    function downloadData() {
        const blob = new Blob([myStoredDataHandle], { type: 'application/json' });
        const url = URL.createObjectURL(blob);
    
        const a = document.createElement('a');
        a.href = url;
        a.download = 'myStoredDataHandle.json';
        document.body.appendChild(a);
        a.click();
    
        document.body.removeChild(a);
        URL.revokeObjectURL(url);
    }

    const email = "y.gu@umcg.nl";
    const subject = "My online visual field test results.";
    const body1 = `Hello:
    
Please paste your data below.
`;
    const body2 = `Hello:
    
Please attach your data file to this email.
`;

    document.getElementById('dataField').value = myStoredDataHandle;
    emailLink1.href = `mailto:${email}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body1)}`;
    emailLink2.href = `mailto:${email}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body2)}`;
    document.getElementById('copyData').addEventListener('click', copyToClipboard);
    document.getElementById('downloadButton').addEventListener('click', downloadData);

    console.log(myDataHandle);
});

