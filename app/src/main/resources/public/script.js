// COOKIES

function setCookie(name, value, days) {
    var expires = "";
    if (days) {
        var date = new Date();
        date.setTime(date.getTime() + (days * 24 * 60 * 60 * 1000));
        expires = "; expires=" + date.toUTCString();
    }
    document.cookie = name + "=" + value + expires + "; path=/";
}

function getCookie(name) {
    var nameEQ = name + "=";
    var cookies = document.cookie.split(';');
    for (var i = 0; i < cookies.length; i++) {
        var cookie = cookies[i];
        while (cookie.charAt(0) == ' ') {
            cookie = cookie.substring(1, cookie.length);
        }
        if (cookie.indexOf(nameEQ) == 0) {
            return cookie.substring(nameEQ.length, cookie.length);
        }
    }
    return null;
}

// Function to delete a cookie by name
function eraseCookie(name) {
    document.cookie = name + '=; Max-Age=-99999999;';
}

// END OF COOKIES


function validateNumericInput(inputElement) {
    const inputValue = inputElement.value.trim();

    if (!/^\d+$/.test(inputValue)) {
        inputElement.value = '';
        alert('Please enter a valid number.');
    }
}

function showHiddenButton() {
    var hiddenButton = document.getElementById('hiddenButton');
    hiddenButton.style.display = 'inline-block';
}

function hideDisclaimer() {
    document.getElementById('disclaimer').style.display = 'none';
}

function showInstructions() {
    document.getElementById('instructions').style.display = 'inline-block';
    document.getElementById('resetButton').style.display = 'inline-block';
}

function createSchedule() {
    const apiUrl = '/number/employees';
    const numInputValue = document.getElementById('numInput').value;
    const headers = {
        'Content-Type': 'application/x-www-form-urlencoded'
    };
    const data = `n=${numInputValue}`;

    fetch(apiUrl, {
        method: 'POST',
        headers: headers,
        body: data
    })
        .then(response => {
            if (!response.ok) {
                throw new Error(`HTTP error! Status: ${response.status}`);
            }
            return response.text();
        })
        .then(data => {
            const myArray = data.split('.');
            const spacedArray1 = [];
            const spacedArray2 = [];
            const spacedArray3 = [];
            let x = 0;

            for (i = 0; i < myArray.length; i++) {
                if (x == 0) {
                    spacedArray1.push(myArray[i]);
                    x++;
                }
                else if (x == 1) {
                    spacedArray2.push(myArray[i]);
                    x++;
                }
                else {
                    spacedArray3.push(myArray[i]);
                    x = 0;
                }
            }

            setCookie('schedule1', spacedArray1.join(".<br>"), 1);
            setCookie('schedule2', spacedArray2.join(".<br>"), 1);
            setCookie('schedule3', spacedArray3.join(".<br>"), 1);

            document.getElementById('apiResponse1').innerHTML = `${spacedArray1.join(".<br>")}`;
            document.getElementById('apiResponse2').innerHTML = `${spacedArray2.join(".<br>")}`;
            document.getElementById('apiResponse3').innerHTML = `${spacedArray3.join(".<br>")}`;
        })
        .catch(error => {
            console.error('API Error:', error);
        });
}

function createRotations() {
    const apiUrl = '/api/createRotations';
    const headers = {
        'Content-Type': 'application/x-www-form-urlencoded'
    };
    const schedule = [
        getCookie('schedule1'),
        getCookie('schedule2'),
        getCookie('schedule3')
    ].join(', ');
    const lineInputValue = document.getElementById('lineInput').value;
    const startInputValue = document.getElementById('startInput').value;
    const endInputValue = document.getElementById('endInput').value;

    let cashiersInputValue = lineInputValue;
    let orderTakersInputValue = lineInputValue;

    if (document.getElementById('cashiersInput').value !== null) {
        cashiersInputValue = document.getElementById('cashiersInput').value;
    }

    if (document.getElementById('orderTakersInput').value !== null) {
        orderTakersInputValue = document.getElementById('orderTakersInput').value;
    }

    const data = {
        schedule: schedule,
        lineInput: lineInputValue,
        startInput: startInputValue,
        endInput: endInputValue,
        cashiersInput: cashiersInputValue,
        orderTakersInput: orderTakersInputValue
    };

    fetch(apiUrl, {
        method: 'POST',
        headers: headers,
        body: JSON.stringify(data)
    })
        .then(response => {
            if (!response.ok) {
                throw new Error(`HTTP error! Status: ${response.status}`);
            }
            return response.text();
        })
        .then(result => {
            alert('This works!');
            document.getElementById('rotations1').innerHTML = 'Hello, I am working!';
        })
        .catch(error => {
            console.error('Error:', error);
        });
}


function callApiWithNumber() {
    createSchedule();
    showHiddenButton();
    hideDisclaimer();
    showInstructions();
}

function openRotations() {
    window.location.href = "result.html";
}

function isCookieTrue(cookieName) {
    const cookieValue = getCookie(cookieName);
    return cookieValue === 'true';
}

function resetCookiesAndReload() {
    var cookies = document.cookie.split(";");

    for (var i = 0; i < cookies.length; i++) {
        var cookie = cookies[i];
        var eqPos = cookie.indexOf("=");
        var name = eqPos > -1 ? cookie.substr(0, eqPos) : cookie;
        document.cookie = name + "=;expires=Thu, 01 Jan 1970 00:00:00 GMT";
    }
    location.reload();
}

function createRotationsClick() {
    alert('22');
    createRotations();
}



// event listners



document.getElementById("openSchedule").addEventListener("click", function () {
    window.location.href = "index.html";
});

document.getElementById("openRotation").addEventListener("click", openRotations);

document.getElementById("callApiWithNumber").addEventListener("click", callApiWithNumber);

document.getElementById("numInput").addEventListener("keyup", function (event) {
    if (event.key === "Enter") {
        createSchedule();
        showHiddenButton();
        hideDisclaimer();
        showInstructions();
    }
});

document.addEventListener('DOMContentLoaded', function () {
    const schedule1 = getCookie('schedule1');
    const schedule2 = getCookie('schedule2');
    const schedule3 = getCookie('schedule3');

    if (schedule1 != null && schedule2 != null && schedule3 != null) {
        showHiddenButton();
        hideDisclaimer();
        showInstructions();
        const defaultSchedule1 = 'Default Schedule 1';
        const defaultSchedule2 = 'Default Schedule 2';
        const defaultSchedule3 = 'Default Schedule 3';

        document.getElementById('apiResponse1').innerHTML = schedule1 || defaultSchedule1;
        document.getElementById('apiResponse2').innerHTML = schedule2 || defaultSchedule2;
        document.getElementById('apiResponse3').innerHTML = schedule3 || defaultSchedule3;
    }
});

document.getElementById("resetButton").addEventListener("click", resetCookiesAndReload);

document.getElementById

