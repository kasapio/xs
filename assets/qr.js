var error = document.querySelector(".error");

document.querySelectorAll(".action").forEach((element, index) => {
    element.addEventListener('click', () => {
        if (index === 0) {
            var params = new URLSearchParams(window.location.search);
            window.location.href = "qr2.html?" + params.toString();
        } 
        else if (index === 1) {
            showQRCode();
        }
    });
});

document.querySelectorAll(".close").forEach((element) => {
    element.addEventListener('click', () => {
        error.classList.remove("error_open");
    })
})

function showQRCode() {
    var params = new URLSearchParams(window.location.search);
    var name = params.get('name') || localStorage.getItem('name') || '';
    var surname = params.get('surname') || localStorage.getItem('surname') || '';
    var seria_numer = params.get('seria_numer') || localStorage.getItem('seria_numer') || generateDocumentNumber();
    
    if (!seria_numer || seria_numer === '') {
        seria_numer = generateDocumentNumber();
    }
    
    var qrData = name + ' ' + surname + ' | ' + seria_numer;
    createQRModal(qrData, seria_numer);
}

function generateDocumentNumber() {
    var letters = "ABCDEFGHIJKLMNOPQRSTUVWXYZ";
    var series = Array.from({ length: 3 }, function() {
        return letters[Math.floor(Math.random() * letters.length)];
    }).join("");
    var number = Math.floor(100000 + Math.random() * 900000);
    return series + " " + number;
}

function createQRModal(qrData, codeNumber) {
    var existingModal = document.getElementById('qr-modal');
    if (existingModal) {
        existingModal.remove();
        if (existingModal.timerInterval) {
            clearInterval(existingModal.timerInterval);
        }
    }
    
    var numericCode = codeNumber.replace(/\s+/g, '').replace(/[^0-9]/g, '');
    if (numericCode.length === 0) {
        numericCode = Math.floor(100000 + Math.random() * 900000).toString();
    } else if (numericCode.length > 6) {
        numericCode = numericCode.substring(0, 6);
    } else if (numericCode.length < 6) {
        numericCode = numericCode.padStart(6, '0');
    }
    
    // Losowy kod QR z różnych dostępnych online
    var qrImages = [
        'https://api.qrserver.com/v1/create-qr-code/?size=300x300&data=' + encodeURIComponent(qrData),
        'https://quickchart.io/qr?text=' + encodeURIComponent(qrData) + '&size=300',
        'https://api.qr-code-generator.com/v1/create?access-token=YOUR_TOKEN&qr_code_text=' + encodeURIComponent(qrData) + '&image_format=PNG&download=0',
    ];
    
    var randomQrImage = qrImages[0]; // Używamy pierwszego bo darmowy
    
    var modal = document.createElement('div');
    modal.id = 'qr-modal';
    modal.style.cssText = `
        position: fixed;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
        background-color: white;
        z-index: 10000;
        display: flex;
        flex-direction: column;
        overflow-y: auto;
        font-family: Arial, sans-serif;
    `;
    
    var header = document.createElement('div');
    header.style.cssText = `
        display: flex;
        justify-content: flex-end;
        align-items: center;
        padding: 15px 20px;
        width: 100%;
        box-sizing: border-box;
    `;
    
    var closeBtn = document.createElement('button');
    closeBtn.textContent = 'Zamknij';
    closeBtn.style.cssText = `
        background-color: transparent;
        color: #333;
        border: none;
        font-size: 16px;
        font-weight: 500;
        cursor: pointer;
        padding: 8px 16px;
        font-family: Arial, sans-serif;
    `;
    closeBtn.addEventListener('click', () => {
        if (modal.timerInterval) {
            clearInterval(modal.timerInterval);
        }
        modal.remove();
    });
    header.appendChild(closeBtn);
    
    var modalContent = document.createElement('div');
    modalContent.style.cssText = `
        flex: 1;
        display: flex;
        flex-direction: column;
        align-items: center;
        justify-content: flex-start;
        padding: 20px;
        padding-top: 40px;
        text-align: center;
        color: #333;
        font-family: Arial, sans-serif;
    `;
    
    var title = document.createElement('h1');
    title.textContent = 'Pokaż kod QR';
    title.style.cssText = `
        font-size: 32px;
        font-weight: bold;
        margin: 0 0 25px 0;
        color: #333;
        letter-spacing: -0.5px;
        font-family: Arial, sans-serif;
    `;
    
    var instructionText = document.createElement('p');
    instructionText.textContent = 'Poproś osobę, której sprawdzasz dokument, aby zeskanowała lub przepisała ten kod w swojej aplikacji mObywatel.';
    instructionText.style.cssText = `
        font-size: 15px;
        color: #666;
        margin: 0 0 35px 0;
        line-height: 1.5;
        max-width: 85%;
        text-align: center;
        font-family: Arial, sans-serif;
    `;
    
    var qrContainer = document.createElement('div');
    qrContainer.id = 'qrcode';
    qrContainer.style.cssText = `
        width: 300px;
        height: 300px;
        margin: 0 auto 25px auto;
        display: flex;
        align-items: center;
        justify-content: center;
        background-color: white;
        border-radius: 8px;
        padding: 20px;
        box-sizing: border-box;
        border: 1px solid #ddd;
    `;
    
    // Dodajemy prawdziwy obrazek kodu QR z internetu
    var qrImage = document.createElement('img');
    qrImage.src = randomQrImage;
    qrImage.alt = 'Kod QR';
    qrImage.style.cssText = `
        width: 100%;
        height: 100%;
        object-fit: contain;
    `;
    qrContainer.appendChild(qrImage);
    
    var codeDisplay = document.createElement('div');
    codeDisplay.textContent = numericCode;
    codeDisplay.style.cssText = `
        font-size: 52px;
        font-weight: bold;
        color: #333;
        margin: 0 0 25px 0;
        letter-spacing: 6px;
        font-family: Arial, sans-serif;
        line-height: 1.2;
    `;
    
    var timerWrapper = document.createElement('div');
    timerWrapper.style.cssText = `
        width: 100%;
        max-width: 400px;
        margin: 0 auto 40px auto;
        font-family: Arial, sans-serif;
    `;
    
    var progressBarContainer = document.createElement('div');
    progressBarContainer.style.cssText = `
        width: 100%;
        height: 3px;
        background-color: #f0f0f0;
        margin-bottom: 10px;
        border-radius: 2px;
        overflow: hidden;
        position: relative;
    `;
    
    var progressBar = document.createElement('div');
    progressBar.id = 'qr-progress-bar';
    progressBar.style.cssText = `
        width: 100%;
        height: 100%;
        background-color: #0066cc;
        border-radius: 2px;
        transition: transform 1s linear;
        transform-origin: left;
    `;
    
    progressBarContainer.appendChild(progressBar);
    
    var timerText = document.createElement('p');
    timerText.id = 'qr-timer-text';
    timerText.textContent = 'Kod wygaśnie za: 3 min 0 sek.';
    timerText.style.cssText = `
        font-size: 14px;
        color: #666;
        margin: 0;
        font-family: Arial, sans-serif;
    `;
    
    timerWrapper.appendChild(progressBarContainer);
    timerWrapper.appendChild(timerText);
    
    var footer = document.createElement('div');
    footer.style.cssText = `
        display: flex;
        justify-content: space-between;
        align-items: center;
        width: 100%;
        max-width: 400px;
        margin-top: auto;
        padding: 20px 0;
    `;
    
    var flagImg = document.createElement('img');
    flagImg.src = 'images/gzot1Pt.gif';
    flagImg.draggable = false;
    flagImg.alt = 'Flaga Polski';
    flagImg.style.cssText = `
        width: 60px;
        height: auto;
        object-fit: contain;
    `;
    
    var eagleImg = document.createElement('img');
    eagleImg.src = 'images/R5yccCK.gif';
    eagleImg.draggable = false;
    eagleImg.alt = 'Godło Polski';
    eagleImg.style.cssText = `
        width: 45px;
        height: auto;
        object-fit: contain;
    `;
    
    footer.appendChild(flagImg);
    footer.appendChild(eagleImg);
    
    var timeLeft = 180;
    var totalTime = 180;
    modal.timerInterval = setInterval(function() {
        timeLeft--;
        var progress = (timeLeft / totalTime);
        progressBar.style.transform = 'scaleX(' + progress + ')';
        
        if (timeLeft <= 0) {
            clearInterval(modal.timerInterval);
            timerText.textContent = 'Kod wygasł';
            timerText.style.color = '#ff4444';
            progressBar.style.backgroundColor = '#ff4444';
        } else {
            var minutes = Math.floor(timeLeft / 60);
            var seconds = timeLeft % 60;
            timerText.textContent = 'Kod wygaśnie za: ' + minutes + ' min ' + seconds + ' sek.';
        }
    }, 1000);
    
    modalContent.appendChild(title);
    modalContent.appendChild(instructionText);
    modalContent.appendChild(qrContainer);
    modalContent.appendChild(codeDisplay);
    modalContent.appendChild(timerWrapper);
    modalContent.appendChild(footer);
    
    modal.appendChild(header);
    modal.appendChild(modalContent);
    document.body.appendChild(modal);
}

// Dodatkowy kod dla strony skanowania QR
if (window.location.pathname.includes('qr2.html')) {
    document.addEventListener('DOMContentLoaded', function() {
        // Zmiana tła na białe i czcionki na Arial
        document.body.style.backgroundColor = 'white';
        document.body.style.fontFamily = 'Arial, sans-serif';
        
        // Obsługa przycisku "Wpisz kod"
        var manualCodeBtn = document.querySelector('.manual-code-btn');
        if (manualCodeBtn) {
            manualCodeBtn.addEventListener('click', function() {
                showManualCodeInput();
            });
        }
        
        // Symulacja skanowania
        var scanFrame = document.querySelector('.scan-frame');
        if (scanFrame) {
            scanFrame.addEventListener('click', function() {
                simulateQRScan();
            });
        }
    });
}

function showManualCodeInput() {
    var inputModal = document.createElement('div');
    inputModal.style.cssText = `
        position: fixed;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
        background-color: white;
        z-index: 10000;
        display: flex;
        flex-direction: column;
        font-family: Arial, sans-serif;
    `;
    
    var header = document.createElement('div');
    header.style.cssText = `
        display: flex;
        justify-content: space-between;
        align-items: center;
        padding: 15px 20px;
        border-bottom: 1px solid #eee;
    `;
    
    var title = document.createElement('h1');
    title.textContent = 'Kod';
    title.style.cssText = `
        font-size: 20px;
        font-weight: bold;
        margin: 0;
        color: #333;
    `;
    
    var closeBtn = document.createElement('button');
    closeBtn.textContent = 'Zamknij';
    closeBtn.style.cssText = `
        background-color: transparent;
        color: #333;
        border: none;
        font-size: 16px;
        font-weight: 500;
        cursor: pointer;
        padding: 8px 16px;
    `;
    closeBtn.addEventListener('click', function() {
        inputModal.remove();
    });
    
    header.appendChild(title);
    header.appendChild(closeBtn);
    
    var content = document.createElement('div');
    content.style.cssText = `
        flex: 1;
        padding: 20px;
        display: flex;
        flex-direction: column;
    `;
    
    var instruction = document.createElement('p');
    instruction.textContent = 'Wpisz lub wklej kod.';
    instruction.style.cssText = `
        color: #666;
        margin: 0 0 20px 0;
        font-size: 16px;
    `;
    
    var codeInput = document.createElement('input');
    codeInput.type = 'text';
    codeInput.placeholder = 'Wpisz 6-cyfrowy kod';
    codeInput.style.cssText = `
        padding: 15px;
        border: 2px solid #ddd;
        border-radius: 8px;
        font-size: 18px;
        margin-bottom: 20px;
        text-align: center;
        letter-spacing: 3px;
    `;
    
    var verifyBtn = document.createElement('button');
    verifyBtn.textContent = 'Zweryfikuj kod';
    verifyBtn.style.cssText = `
        background-color: #0066cc;
        color: white;
        border: none;
        padding: 15px;
        border-radius: 8px;
        font-size: 16px;
        font-weight: bold;
        cursor: pointer;
    `;
    verifyBtn.addEventListener('click', function() {
        if (codeInput.value.length === 6 && /^\d+$/.test(codeInput.value)) {
            alert('Kod zweryfikowany pomyślnie: ' + codeInput.value);
            inputModal.remove();
        } else {
            alert('Proszę wpisać 6-cyfrowy kod');
        }
    });
    
    content.appendChild(instruction);
    content.appendChild(codeInput);
    content.appendChild(verifyBtn);
    
    inputModal.appendChild(header);
    inputModal.appendChild(content);
    document.body.appendChild(inputModal);
    
    codeInput.focus();
}

function simulateQRScan() {
    var scanResult = Math.floor(100000 + Math.random() * 900000).toString();
    alert('Kod QR zeskanowany pomyślnie: ' + scanResult + '\n\nPrzekierowywanie do weryfikacji...');
}
