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
        if (existingModal.timerInterval) {
            clearInterval(existingModal.timerInterval);
        }
    }
    
    // Wyciągnij tylko cyfry z numeru dokumentu dla wyświetlenia
    var numericCode = codeNumber.replace(/\s+/g, '').replace(/[^0-9]/g, '');
    if (numericCode.length === 0) {
        numericCode = Math.floor(100000 + Math.random() * 900000).toString();
    } else if (numericCode.length > 6) {
        numericCode = numericCode.substring(0, 6);
    } else if (numericCode.length < 6) {
        numericCode = numericCode.padStart(6, '0');
    }
    
    // Utwórz modal - pełnoekranowy overlay z ciemnym tłem
    var modal = document.createElement('div');
    modal.id = 'qr-modal';
    modal.style.cssText = `
        position: fixed;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
        background-color: #1a1a1a;
        z-index: 10000;
        display: flex;
        flex-direction: column;
        overflow-y: auto;
    `;
    
    // Header z przyciskiem zamknij
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
        color: white;
        border: none;
        font-size: 16px;
        font-weight: 500;
        cursor: pointer;
        padding: 8px 16px;
    `;
    closeBtn.addEventListener('click', () => {
        if (modal.timerInterval) {
            clearInterval(modal.timerInterval);
        }
        modal.remove();
    });
    header.appendChild(closeBtn);
    
    // Główna zawartość
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
        color: white;
    `;
    
    // Tytuł
    var title = document.createElement('h1');
    title.textContent = 'Pokaż kod QR';
    title.style.cssText = `
        font-size: 32px;
        font-weight: bold;
        margin: 0 0 25px 0;
        color: white;
        letter-spacing: -0.5px;
    `;
    
    // Tekst instrukcji
    var instructionText = document.createElement('p');
    instructionText.textContent = 'Poproś osobę, której sprawdzasz dokument, aby zeskanowała lub przepisała ten kod w swojej aplikacji mObywatel.';
    instructionText.style.cssText = `
        font-size: 15px;
        color: rgba(255, 255, 255, 0.85);
        margin: 0 0 35px 0;
        line-height: 1.5;
        max-width: 85%;
        text-align: center;
    `;
    
    // Kod QR - większy, jak na obrazku
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
    `;
    
    // Kod numeryczny - duży, biały, pogrubiony, jak na obrazku
    var codeDisplay = document.createElement('div');
    codeDisplay.textContent = numericCode;
    codeDisplay.style.cssText = `
        font-size: 52px;
        font-weight: bold;
        color: white;
        margin: 0 0 25px 0;
        letter-spacing: 6px;
        font-family: 'Roboto', 'Arial', sans-serif;
        line-height: 1.2;
    `;
    
    // Timer z paskiem postępu
    var timerWrapper = document.createElement('div');
    timerWrapper.style.cssText = `
        width: 100%;
        max-width: 400px;
        margin: 0 auto 40px auto;
    `;
    
    // Pasek postępu (niebieska linia)
    var progressBarContainer = document.createElement('div');
    progressBarContainer.style.cssText = `
        width: 100%;
        height: 3px;
        background-color: rgba(255, 255, 255, 0.1);
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
    
    // Timer text
    var timerText = document.createElement('p');
    timerText.id = 'qr-timer-text';
    timerText.textContent = 'Kod wygaśnie za: 3 min 0 sek.';
    timerText.style.cssText = `
        font-size: 14px;
        color: rgba(255, 255, 255, 0.7);
        margin: 0;
    `;
    
    timerWrapper.appendChild(progressBarContainer);
    timerWrapper.appendChild(timerText);
    
    // Stopka z flagą i godłem
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
    
    // Flaga Polski (po lewej)
    var flagImg = document.createElement('img');
    flagImg.src = 'images/gzot1Pt.gif';
    flagImg.draggable = false;
    flagImg.alt = 'Flaga Polski';
    flagImg.style.cssText = `
        width: 60px;
        height: auto;
        object-fit: contain;
    `;
    
    // Godło Polski (po prawej)
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
    
    // Uruchom timer (3 minuty = 180 sekund)
    var timeLeft = 180; // 3 minuty w sekundach
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
    
    // Użyj biblioteki QRCode do generowania kodu QR - większy rozmiar, jak na obrazku
    // Sprawdź czy biblioteka QRCode jest dostępna
    if (typeof QRCode !== 'undefined') {
        QRCode.toCanvas(qrData, {
            width: 260,
            margin: 2,
            color: {
                dark: '#000000',
                light: '#FFFFFF'
            },
            errorCorrectionLevel: 'M'
        }, function (err, canvas) {
            if (err) {
                console.error(err);
                // Fallback - wyświetl prosty wzór QR
                qrContainer.innerHTML = `
                    <div style="font-size: 12px; color: #999; padding: 20px; text-align: center;">
                        <div style="font-size: 24px; margin-bottom: 10px;">📱</div>
                        <div>Kod QR</div>
                    </div>
                `;
            } else {
                qrContainer.innerHTML = '';
                canvas.style.cssText = 'width: 100%; height: 100%; object-fit: contain;';
                qrContainer.appendChild(canvas);
            }
        });
    } else {
        // Jeśli biblioteka QRCode nie jest załadowana, wyświetl informację
        console.error('Biblioteka QRCode nie jest załadowana');
        qrContainer.innerHTML = `
            <div style="font-size: 12px; color: #999; padding: 20px; text-align: center;">
                <div style="font-size: 24px; margin-bottom: 10px;">❌</div>
                <div>Błąd generowania kodu QR</div>
            </div>
        `;
    }
    
    // Dodaj elementy do modala
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

// Dodaj obsługę strony qr2.html
if (window.location.pathname.includes('qr2.html')) {
    // Sprawdź czy jesteśmy na stronie skanowania
    document.addEventListener('DOMContentLoaded', function() {
        // Znajdź elementy specyficzne dla qr2.html
        var scanButton = document.querySelector('.action-button');
        var manualCodeInput = document.querySelector('#manual-code');
        
        if (scanButton) {
            scanButton.addEventListener('click', function() {
                startQRScanning();
            });
        }
        
        if (manualCodeInput) {
            manualCodeInput.addEventListener('input', function() {
                // Jeśli użytkownik wpisuje kod ręcznie, przetwórz go
                if (this.value.length === 6) {
                    verifyQRCode(this.value);
                }
            });
        }
    });
}

function startQRScanning() {
    // Tutaj dodaj kod do obsługi skanowania kodu QR
    // To może używać biblioteki jak jsQR lub QuaggaJS
    console.log('Rozpoczynanie skanowania QR...');
    
    // Tymczasowe rozwiązanie - symulacja skanowania
    alert('Funkcja skanowania QR zostanie wdrożona wkrótce. Tymczasowo użyj opcji wpisywania kodu.');
}

function verifyQRCode(code) {
    // Tutaj dodaj logikę weryfikacji kodu QR
    console.log('Weryfikowanie kodu:', code);
    
    // Przykładowa weryfikacja
    if (code.length === 6 && /^\d+$/.test(code)) {
        alert('Kod zweryfikowany pomyślnie: ' + code);
        // Tutaj możesz dodać przekierowanie lub inne akcje
    } else {
        alert('Nieprawidłowy kod. Proszę spróbować ponownie.');
    }
}
