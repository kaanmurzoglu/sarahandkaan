const sarahToggle = document.getElementById('sarah-toggle');
const kaanToggle = document.getElementById('kaan-toggle');
const output = document.getElementById('output');

function updateOutput() {
    const sarahChecked = sarahToggle.checked;
    const kaanChecked = kaanToggle.checked;
    
    // Boolean değerlerini güncelle
    const sarahBoolean = sarahToggle.parentElement.querySelector('.boolean');
    const kaanBoolean = kaanToggle.parentElement.querySelector('.boolean');
    
    sarahBoolean.textContent = sarahChecked ? 'true' : 'false';
    sarahBoolean.setAttribute('data-checked', sarahChecked);
    
    kaanBoolean.textContent = kaanChecked ? 'true' : 'false';
    kaanBoolean.setAttribute('data-checked', kaanChecked);
    
    // Sonucu hesapla ve göster
    if (sarahChecked && kaanChecked) {
        output.innerHTML = '→ true <span class="heart-emoji">❤️</span>';
        output.classList.add('love');
    } else {
        output.textContent = '→ "nothing"';
        output.classList.remove('love');
    }
}

// Checkbox değişikliklerini dinle
sarahToggle.addEventListener('change', updateOutput);
kaanToggle.addEventListener('change', updateOutput);

// İlk durumu ayarla
updateOutput();

