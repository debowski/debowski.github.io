// Lightweight i18n map matching data-i18n attributes used in the HTML
const I18N = {
  pl: {
    nav_features: 'Funkcje', nav_demo: 'Symulator', nav_shortcuts: 'Skróty', nav_faq: 'FAQ',
    hero_badge: 'Edycja Rekwizytornia • Wydanie Stabilne', hero_title: 'Profesjonalna reżyseria multimediów na żywo', hero_subtitle: 'Stabilna konsola operatorska do natychmiastowej projekcji wideo, audio i grafik podczas koncertów, pokazów i eventów na drugim ekranie.',
    download_btn: 'Pobierz Wersję .exe', source_btn: 'Kod Źródłowy',
    features_title: 'Architektura Stabilności', features_subtitle: 'Zaprojektowana, aby unikać awarii i opóźnień w krytycznych momentach.',
    feat_dual_title: 'Dwuekranowy Tryb Pracy', feat_dual_desc: 'Panel operatora i niezależne okno projekcji na drugim monitorze.',
    feat_vlc_title: 'Potężny Silnik LibVLC', feat_vlc_desc: 'Odtwarzanie formatów wideo, audio i grafiki z wykorzystaniem python-vlc.',
    feat_fade_title: 'Płynne Przejścia (Fade Out)', feat_fade_desc: 'Fade synchronizuje ściemnienie obrazu i wyciszenie dźwięku (0.2–2.0 s).',
    feat_playlist_title: 'Zaawansowana Playlista', feat_playlist_desc: 'Drag & drop, wyszukiwanie, per-pozycja nakładki, zapis projektu (JSON).',
    feat_overlay_title: 'System Nakładek', feat_overlay_desc: 'Logo lub wideo w pętli wyświetlane niezależnie od głównego odtwarzacza.',
    feat_safety_title: 'Ochrona i Bezpieczeństwo', feat_safety_desc: 'Ochrona okna projekcji przed przypadkowym zamknięciem oraz bezpieczna obsługa błędów runtime.',
    sim_title: 'Interaktywna Konsola w Przeglądarce', sim_subtitle: 'Wypróbuj interfejs operatora i podstawowe skróty.',
    playlist_header: 'Playlista Projektu', control_header: 'Sterownik Główny', active_media_label: 'Aktywny plik:', btn_play: 'PLAY', btn_stop: 'STOP', btn_fade: 'WYGAŚ (FADE)',
    fade_label: 'Efekt wygaszenia (Fade Out):', overlay_header: 'Warstwa Nakładki', overlay_toggle_label: 'Logo w tle (Pętla):', overlay_desc_text: 'Niezależny kanał wideo/grafiki (bez dźwięku).', projection_header: '📺 Wyjście Projekcji (Ekran 2)',
    shortcuts_title: 'Skróty Klawiszowe Operatora', shortcuts_subtitle: 'Profesjonalni operatorzy polegają na skrótach klawiszowych.',
    sc_space_title: 'Pauza (Spacja)', sc_space_desc: 'Przełącz pauzę / wznów odtwarzanie aktywnego pliku (Spacja).',
    sc_f1_title: 'Wygaszanie (F1)', sc_f1_desc: 'Płynne wygaszenie dźwięku i obrazu (konfigurowalny czas).',
    sc_f2_title: 'Fokus na playlistę (F2)', sc_f2_desc: 'Przenieś fokus klawiatury na listę odtwarzania (F2).',
    sc_f3_title: 'Wyszukaj (F3)', sc_f3_desc: 'Ustaw fokus w polu wyszukiwania, aby filtrować playlistę (F3).',
    sc_play_title: 'Odtwórz (F4 / Enter)', sc_play_desc: 'Odtwórz zaznaczony element (F4 lub Enter).',
    sc_stop_title: 'Stop (F5)', sc_stop_desc: 'Zatrzymaj odtwarzanie natychmiast (F5).',
    sc_prev_title: 'Poprzedni (F6 / ↑ lub ←)', sc_prev_desc: 'Przejdź do poprzedniego elementu (F6 lub klawisze nawigacji).',
    sc_next_title: 'Następny (F7 / ↓ lub →)', sc_next_desc: 'Przejdź do następnego elementu (F7 lub klawisze nawigacji).',
    sc_overlay_title: 'Nakładka na obraz (F9)', sc_overlay_desc: 'Przełącz tryb nakładki — pokaż logo/obraz zamiast wideo (F9).',
    sc_image_audio_title: 'Obraz dla audio (F10)', sc_image_audio_desc: 'Pokaż obraz automatycznie podczas odtwarzania pliku audio (F10).',
    sc_fullscreen_title: 'Pełny ekran (F11)', sc_fullscreen_desc: 'Przełącz pełny ekran dla okna projekcji (F11).',
    sc_save_title: 'Zapisz projekt (F12)', sc_save_desc: 'Zapisz aktualną listę i ustawienia do pliku JSON (F12).',
    sc_remove_title: 'Usuń (Del)', sc_remove_desc: 'Usuń zaznaczony element z playlisty (Del).',
    themes_title: 'Cztery Motywy Interfejsu', themes_desc: 'Dopasuj motyw do warunków oświetleniowych.',
    theme_indigo: 'Broadcast Indigo', theme_indigo_desc: 'Domyślny motyw reżyserski', theme_dark: 'Studio Dark', theme_dark_desc: 'Wysoki kontrast',
    theme_red: 'Red Night (Stealth)', theme_red_desc: 'Tryb nocny chroniący wzrok', theme_light: 'Studio Light', theme_light_desc: 'Jasne pomieszczenia',
    faq_title: 'Najczęściej Zadawane Pytania', faq_subtitle: 'Wszystko, co musisz wiedzieć przed wydarzeniem.',
    faq_q1: 'Na czym polega dwuekranowość?', faq_a1: 'Aplikacja otwiera okno projekcji na drugim monitorze, pozostawiając panel sterowania na pierwszym.',
    faq_q2: 'Czym jest silnik LibVLC?', faq_a2: 'Silnik znany z VLC — szerokie wsparcie formatów i stabilne odtwarzanie.',
    faq_q3: 'Jak działa ochrona okna projekcji?', faq_a3: 'Aplikacja zapobiega przypadkowemu zamknięciu okna projekcji i korzysta z bezpiecznej obsługi błędów, aby uniknąć awarii.',
    faq_q4: 'Czy aplikacja wymaga instalacji?', faq_a4: 'Dostępny gotowy plik .exe lub uruchomienie ze źródeł (Python + python-vlc).',
    footer_license: 'Aplikacja Show Control udostępniana jest bezpłatnie na licencji open-source (GPL v3).', footer_author: 'Copyright © 2026 Piotr Dębowski.'
  },
  en: {
    nav_features: 'Features', nav_demo: 'Simulator', nav_shortcuts: 'Shortcuts', nav_faq: 'FAQ',
    hero_badge: 'Operator Edition • Stable Release', hero_title: 'Professional live multimedia direction', hero_subtitle: 'Robust operator console for instant projection of video, audio and graphics during concerts, shows and presentations on a second screen.',
    download_btn: 'Download .exe', source_btn: 'Source Code',
    features_title: 'Reliability Architecture', features_subtitle: 'Designed to avoid crashes, freezes and sync delays during critical moments.',
    feat_dual_title: 'Two-screen Workflow', feat_dual_desc: 'Operator console on the main monitor and a borderless projection window on the second display.',
    feat_vlc_title: 'LibVLC Playback Engine', feat_vlc_desc: 'Hardware-accelerated playback via python-vlc for video, audio and images.',
    feat_fade_title: 'Smooth Transitions (Fade Out)', feat_fade_desc: 'Fade synchronizes image dimming and audio lowering (0.2–2.0 s).',
    feat_playlist_title: 'Advanced Playlist', feat_playlist_desc: 'Drag & drop, live search, per-item overlay controls and JSON project saving.',
    feat_overlay_title: 'Overlay System', feat_overlay_desc: 'Independent overlay player for logo, sponsor banners or standby slides.',
    feat_safety_title: 'Protection & Safety', feat_safety_desc: 'Protects the projection window from accidental closing and handles runtime errors safely.',
    sim_title: 'Interactive Browser Console', sim_subtitle: 'Try the operator UI and basic hotkeys.',
    playlist_header: 'Project Playlist', control_header: 'Main Controller', active_media_label: 'Active file:', btn_play: 'PLAY', btn_stop: 'STOP', btn_fade: 'FADE OUT',
    fade_label: 'Fade Out effect:', overlay_header: 'Overlay Layer', overlay_toggle_label: 'Logo in background (Loop):', overlay_desc_text: 'Independent video/graphic channel displayed without audio.', projection_header: 'Projection Output (Screen 2)',
    shortcuts_title: 'Operator Keyboard Shortcuts', shortcuts_subtitle: 'Experienced operators rely on hotkeys.',
    sc_space_title: 'Pause (Space)', sc_space_desc: 'Toggle Pause / Resume of the active file (Space).',
    sc_f1_title: 'Fade Out (F1)', sc_f1_desc: 'Smooth fade out of audio and picture (configurable duration).',
    sc_f2_title: 'Focus Playlist (F2)', sc_f2_desc: 'Move keyboard focus to the playlist (F2).',
    sc_f3_title: 'Search (F3)', sc_f3_desc: 'Focus the search box to filter the playlist (F3).',
    sc_play_title: 'Play (F4 / Enter)', sc_play_desc: 'Play the selected item (F4 or Enter).',
    sc_stop_title: 'Stop (F5)', sc_stop_desc: 'Stop playback immediately (F5).',
    sc_prev_title: 'Previous (F6 / ↑ or ←)', sc_prev_desc: 'Go to the previous item (F6 or navigation keys).',
    sc_next_title: 'Next (F7 / ↓ or →)', sc_next_desc: 'Advance to the next item (F7 or navigation keys).',
    sc_overlay_title: 'Overlay on image (F9)', sc_overlay_desc: 'Toggle overlay mode — show logo/image instead of video (F9).',
    sc_image_audio_title: 'Image for Audio (F10)', sc_image_audio_desc: 'Show image automatically when an audio file is playing (F10).',
    sc_fullscreen_title: 'Fullscreen (F11)', sc_fullscreen_desc: 'Toggle fullscreen for the projection window (F11).',
    sc_save_title: 'Save Project (F12)', sc_save_desc: 'Save the current playlist and settings to a JSON project file (F12).',
    sc_remove_title: 'Remove (Delete)', sc_remove_desc: 'Remove the selected item from the playlist (Delete).',
    themes_title: 'Four UI Themes', themes_desc: 'Match the UI to the lighting conditions in the control room.',
    theme_indigo: 'Broadcast Indigo', theme_indigo_desc: 'Default production theme', theme_dark: 'Studio Dark', theme_dark_desc: 'High contrast',
    theme_red: 'Red Night (Stealth)', theme_red_desc: 'Night mode to preserve dark adaptation', theme_light: 'Studio Light', theme_light_desc: 'For bright rooms',
    faq_title: 'Frequently Asked Questions', faq_subtitle: 'Everything you need to know before the event.',
    faq_q1: 'What is two-screen mode?', faq_a1: 'App opens the projection window on the second monitor while keeping the operator controls on the first.',
    faq_q2: 'What is LibVLC?', faq_a2: 'The same engine used by VLC media player — wide codec support and stable playback.',
    faq_q3: 'How does the protection work?', faq_a3: 'The app prevents accidental closure of the projection window and uses safe error handling to avoid crashes.',
    faq_q4: 'Does the app require installation?', faq_a4: 'A standalone .exe is available; alternatively run from sources with Python and python-vlc.',
    footer_license: 'Show Control is available as open-source software (GPL v3).', footer_author: 'Copyright © 2026 Piotr Dębowski.'
  }
}

function translatePage(lang){
  document.querySelectorAll('[data-i18n]').forEach(el=>{
    const key = el.getAttribute('data-i18n')
    if(I18N[lang] && I18N[lang][key]) el.textContent = I18N[lang][key]
  })
}

function setLanguage(lang){
  document.querySelectorAll('.lang-switch button').forEach(b=>b.classList.remove('active'))
  const btn = document.getElementById(lang==='pl' ? 'btn-pl' : 'btn-en')
  if(btn) btn.classList.add('active')
  translatePage(lang)
}

// FAQ toggle and initial language setup
function attachFAQ(){
  document.querySelectorAll('.faq-question').forEach(q=>{
    q.setAttribute('role','button')
    q.setAttribute('aria-expanded','false')
    q.addEventListener('click', ()=>{
      const a = q.nextElementSibling
      const isOpen = q.classList.toggle('open')
      if(isOpen){
        a.style.display = 'block'
        q.setAttribute('aria-expanded','true')
      } else {
        a.style.display = 'none'
        q.setAttribute('aria-expanded','false')
      }
    })
    q.addEventListener('keydown', (e)=>{ if(e.key === 'Enter' || e.key === ' ') q.click() })
  })
}

document.addEventListener('DOMContentLoaded', ()=>{
  setLanguage('pl')
  attachFAQ()
  attachMobileMenu()
})

function attachMobileMenu(){
  const toggle = document.getElementById('menu-toggle')
  if(!toggle) return
  // create mobile nav container and clone links
  const navLinks = document.querySelector('.nav-links')
  const mobile = document.createElement('nav')
  mobile.className = 'nav-mobile'
  const panel = document.createElement('div')
  panel.className = 'mobile-panel'
  const ul = document.createElement('ul')
  if(navLinks){
    Array.from(navLinks.querySelectorAll('a')).forEach(a=>{
      const li = document.createElement('li')
      const clone = a.cloneNode(true)
      clone.setAttribute('role','menuitem')
      clone.addEventListener('click', ()=>{ // close on link click
        mobile.style.display = 'none'
        toggle.setAttribute('aria-expanded','false')
        document.body.classList.remove('nav-open')
      })
      li.appendChild(clone)
      ul.appendChild(li)
    })
  }
  panel.appendChild(ul)
  mobile.appendChild(panel)
  const closeBtn = document.createElement('button')
  closeBtn.className = 'close-btn'
  closeBtn.setAttribute('aria-label','Zamknij menu')
  closeBtn.innerHTML = '✕'
  closeBtn.addEventListener('click', ()=>{ mobile.style.display='none'; toggle.setAttribute('aria-expanded','false'); document.body.classList.remove('nav-open') })
  mobile.appendChild(closeBtn)
  document.body.appendChild(mobile)

  toggle.addEventListener('click', ()=>{
    const isOpen = toggle.getAttribute('aria-expanded') === 'true'
    if(isOpen){
      mobile.style.display = 'none'
      toggle.setAttribute('aria-expanded','false')
      document.body.classList.remove('nav-open')
    } else {
      mobile.style.display = 'block'
      toggle.setAttribute('aria-expanded','true')
      document.body.classList.add('nav-open')
      // focus first link for keyboard users
      const firstLink = mobile.querySelector('a')
      if(firstLink) firstLink.focus()
    }
  })

  // hide on resize to larger screens
  window.addEventListener('resize', ()=>{
    if(window.innerWidth > 980){
      mobile.style.display = 'none'
      toggle.setAttribute('aria-expanded','false')
      document.body.classList.remove('nav-open')
    }
  })

  // close on escape
  document.addEventListener('keydown', (e)=>{
    if(e.key === 'Escape'){
      if(mobile.style.display === 'block'){
        mobile.style.display = 'none'
        toggle.setAttribute('aria-expanded','false')
        document.body.classList.remove('nav-open')
      }
    }
  })

  // close when clicking outside panel
  mobile.addEventListener('click', (e)=>{
    if(e.target === mobile){
      mobile.style.display = 'none'
      toggle.setAttribute('aria-expanded','false')
      document.body.classList.remove('nav-open')
    }
  })
}
