const measureBtn = document.getElementById('measureBtn');
const resultText = document.getElementById('resultText');
const hearts = document.getElementById('hearts');
const btnText = measureBtn.querySelector('.btn-text');

let isMeasuring = false;

measureBtn.addEventListener('click', () => {
    if (isMeasuring) return;
    
    isMeasuring = true;
    measureBtn.classList.add('measuring');
    
    // Change button to "Measuring..."
    btnText.textContent = 'Measuring...';
    
    // Clear previous results
    hearts.innerHTML = '';
    resultText.textContent = '';
    resultText.classList.remove('show');
    
    // Ölçüm animasyonu
    setTimeout(() => {
        // 5 kalp ekle
        for (let i = 0; i < 5; i++) {
            const heart = document.createElement('span');
            heart.className = 'heart';
            heart.textContent = '❤️';
            hearts.appendChild(heart);
        }
        
        // Sonucu göster
        setTimeout(() => {
            resultText.textContent = 'Kaan';
            resultText.classList.add('show');
            
            // Reactivate button
            setTimeout(() => {
                measureBtn.classList.remove('measuring');
                btnText.textContent = 'Measure Again';
                isMeasuring = false;
            }, 500);
        }, 800);
    }, 1500);
});

