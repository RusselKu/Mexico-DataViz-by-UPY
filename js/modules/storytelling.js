/**
 * Módulo de Storytelling, Narración por Voz (Web Speech API), Auto-Tour y Notificaciones
 */
window.DataStoryApp = window.DataStoryApp || {};

window.DataStoryApp.storytelling = (function() {
  let isNarrating = false;
  let isPresentationRunning = false;
  let presentationTimer = null;

  function showToast(msg) {
    const toast = document.getElementById('toastMsg');
    const text = document.getElementById('toastText');
    if (toast && text) {
      text.innerText = msg;
      toast.classList.add('show');
      setTimeout(() => {
        toast.classList.remove('show');
      }, 3200);
    }
  }

  function toggleAudioNarration(currentData) {
    if (!('speechSynthesis' in window)) {
      alert("Tu navegador no soporta síntesis de voz (Web Speech API).");
      return;
    }

    const btn = document.getElementById('narrateBtn');

    if (isNarrating) {
      stopAudioNarration();
    } else {
      if (!currentData) return;
      const textToRead = `${currentData.storyTitle}. ${currentData.storyDesc}`;
      const utterance = new SpeechSynthesisUtterance(textToRead);
      utterance.lang = 'es-MX';
      utterance.rate = 1.0;

      utterance.onend = () => {
        stopAudioNarration();
      };

      window.speechSynthesis.speak(utterance);
      isNarrating = true;
      if (btn) {
        btn.classList.add('playing');
        btn.innerHTML = `<i class="fa-solid fa-pause"></i> Detener`;
      }
    }
  }

  function stopAudioNarration() {
    if ('speechSynthesis' in window) {
      window.speechSynthesis.cancel();
    }
    isNarrating = false;
    const btn = document.getElementById('narrateBtn');
    if (btn) {
      btn.classList.remove('playing');
      btn.innerHTML = `<i class="fa-solid fa-play"></i> Escuchar`;
    }
  }

  function togglePresentationMode(onNextStep) {
    isPresentationRunning = !isPresentationRunning;
    const btnText = document.getElementById('presText');
    const btnIcon = document.getElementById('presIcon');

    if (isPresentationRunning) {
      if (btnText) btnText.innerText = "Pausar Tour";
      if (btnIcon) btnIcon.className = "fa-solid fa-pause";
      showToast("Modo Auto-Tour iniciado (8s por capítulo)");
      presentationTimer = setInterval(() => {
        if (typeof onNextStep === 'function') onNextStep();
      }, 8000);
    } else {
      if (btnText) btnText.innerText = "Auto-Tour";
      if (btnIcon) btnIcon.className = "fa-solid fa-play";
      clearInterval(presentationTimer);
      presentationTimer = null;
      showToast("Modo Auto-Tour pausado");
    }
  }

  return {
    showToast,
    toggleAudioNarration,
    stopAudioNarration,
    togglePresentationMode
  };
})();
