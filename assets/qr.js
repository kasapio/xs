
var error = document.querySelector(".error");

document.querySelectorAll(".action").forEach((element, index) => {
    element.addEventListener('click', () => {
        // Pierwszy element (index 0) to "Zeskanuj kod QR" - przekieruj do qr2.html
        if (index === 0) {
            var params = new URLSearchParams(window.location.search);
            window.location.href = "qr2.html?" + params.toString();
        } 
        // Drugi element (index 1) to "Pokaż kod QR" - pokaż kod QR z cyferkami
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
    // Pobierz dane z parametrów URL, localStorage lub wygeneruj domyślne
    var params = new URLSearchParams(window.location.search);
    var name = params.get('name') || localStorage.getItem('name') || '';
    var surname = params.get('surname') || localStorage.getItem('surname') || '';
    var seria_numer = params.get('seria_numer') || localStorage.getItem('seria_numer') || generateDocumentNumber();
    
    // Jeśli nie ma numeru dokumentu, wygeneruj go
    if (!seria_numer || seria_numer === '') {
        seria_numer = generateDocumentNumber();
    }
    
    // Generuj kod QR z danymi
    var qrData = name + ' ' + surname + ' | ' + seria_numer;
    
    // Utwórz modal z kodem QR
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
    // Usuń istniejący modal jeśli istnieje
    var existingModal = document.getElementById('qr-modal');
    if (existingModal) {
        existingModal.remove();
    }
    
    // Utwórz modal
    var modal = document.createElement('div');
    modal.id = 'qr-modal';
    modal.style.cssText = `
        position: fixed;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
        background-color: rgba(0, 0, 0, 0.7);
        z-index: 1000;
        display: flex;
        justify-content: center;
        align-items: center;
    `;
    
    var modalContent = document.createElement('div');
    modalContent.style.cssText = `
        background-color: white;
        border-radius: 20px;
        padding: 30px;
        max-width: 90%;
        text-align: center;
        box-shadow: 0 4px 20px rgba(0,0,0,0.3);
    `;
    
    var title = document.createElement('p');
    title.textContent = 'Kod QR';
    title.style.cssText = `
        font-size: 24px;
        font-weight: bold;
        margin-bottom: 20px;
        color: var(--text);
    `;
    
    // Kod QR (użyjemy prostego wyświetlacza - w rzeczywistości potrzebna byłaby biblioteka QR)
    var qrContainer = document.createElement('div');
    qrContainer.id = 'qrcode';
    qrContainer.style.cssText = `
        width: 250px;
        height: 250px;
        margin: 20px auto;
        border: 2px solid #ddd;
        border-radius: 10px;
        display: flex;
        align-items: center;
        justify-content: center;
        background-color: #f5f5f5;
    `;
    
    // Wyświetl kod numeryczny
    var codeDisplay = document.createElement('p');
    codeDisplay.textContent = codeNumber;
    codeDisplay.style.cssText = `
        font-size: 24px;
        font-weight: 700;
        color: var(--text);
        margin: 15px 0;
        letter-spacing: 3px;
        font-family: 'Courier New', monospace;
        padding: 10px;
        background-color: #f5f6fb;
        border-radius: 8px;
    `;
    
    // Informacja o kodzie QR
    var info = document.createElement('p');
    info.textContent = 'Zeskanuj ten kod, aby zweryfikować dokument';
    info.style.cssText = `
        font-size: 14px;
        color: #666;
        margin: 15px 0 5px 0;
    `;
    
    // Dodatkowa informacja o kodzie numerycznym
    var codeInfo = document.createElement('p');
    codeInfo.textContent = 'Kod dokumentu:';
    codeInfo.style.cssText = `
        font-size: 12px;
        color: #999;
        margin: 5px 0;
        text-transform: uppercase;
        letter-spacing: 1px;
    `;
    
    // Przycisk zamknij
    var closeBtn = document.createElement('button');
    closeBtn.textContent = 'Zamknij';
    closeBtn.style.cssText = `
        background-color: var(--text);
        color: white;
        border: none;
        border-radius: 25px;
        padding: 12px 30px;
        font-size: 16px;
        font-weight: 600;
        margin-top: 20px;
        cursor: pointer;
    `;
    closeBtn.addEventListener('click', () => {
        modal.remove();
    });
    
    // Użyj biblioteki QRCode do generowania kodu QR
    QRCode.toCanvas(qrData, {
        width: 230,
        margin: 2,
        color: {
            dark: '#000000',
            light: '#FFFFFF'
        }
    }, function (err, canvas) {
        if (err) {
            console.error(err);
            // Fallback - wyświetl prosty wzór QR
            qrContainer.innerHTML = `
                <div style="font-size: 12px; color: #999; padding: 20px;">
                    <div style="font-size: 24px; margin-bottom: 10px;">📱</div>
                    <div>Kod QR</div>
                    <div style="margin-top: 10px; font-weight: 600; color: var(--text);">${codeNumber}</div>
                </div>
            `;
        } else {
            qrContainer.innerHTML = '';
            qrContainer.appendChild(canvas);
        }
    });
    
    modalContent.appendChild(title);
    modalContent.appendChild(qrContainer);
    modalContent.appendChild(codeInfo);
    modalContent.appendChild(codeDisplay);
    modalContent.appendChild(info);
    modalContent.appendChild(closeBtn);
    modal.appendChild(modalContent);
    document.body.appendChild(modal);
    
    // Przesuń modal na wierzch
    modal.style.zIndex = '10000';
    
    // Zamknij po kliknięciu w tło
    modal.addEventListener('click', (e) => {
        if (e.target === modal) {
            modal.remove();
        }
    });
}