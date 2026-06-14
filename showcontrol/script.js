const translations = {
    en: {
        hero_badge: "Broadcast Edition • Stable Release",
        hero_title: "Professional Live Multimedia Show Control",
        hero_subtitle: "Rock-solid operator console for instant video, audio, and graphics projection on secondary screens during live events, shows, presentations, and concerts.",
        download_btn: "Download (.exe)",
        source_btn: "Source Code",
        
        sim_title: "Interactive Browser Console",
        sim_subtitle: "Try the operator interface and control the live projection with real-time keyboard commands.",
        playlist_header: "Project Playlist",
        control_header: "Master Controller",
        active_media_label: "Active media:",
        btn_play: "PLAY",
        btn_stop: "STOP",
        fade_label: "Transition Effect (Fade Out):",
        btn_fade: "FADE OUT",
        overlay_header: "Overlay Layer",
        overlay_toggle_label: "Logo Watermark (Loop):",
        overlay_desc_text: "Independent channel rendered on top of active content (no background audio).",
        projection_header: "Projection Output (Screen 2)",
        
        features_title: "Architecture of Stability",
        features_subtitle: "Engineered specifically to avoid failures, crashes, and sync lag in high-stakes event environments.",
        feat_dual_title: "Dual-Screen Workflow",
        feat_dual_desc: "Control interface runs on the operator monitor, while borderless projection output locks automatically to the secondary screen (projector, TV, or LED wall).",
        feat_vlc_title: "LibVLC Core Engine",
        feat_vlc_desc: "Zero codec issues. Seamless hardware-accelerated playback of MP4, MKV, MP3, WAV, and graphics using native Direct3D11 rendering pipelines.",
        feat_fade_title: "Dynamic Fade Transitions",
        feat_fade_desc: "Configurable fade effect (0.2s - 2.0s) dims active video and drops audio levels smoothly, avoiding abrupt cuts that distract live audiences.",
        feat_playlist_title: "Smart Event Playlist",
        feat_playlist_desc: "Live search, drag & drop sorting, JSON-based project saving/loading, and custom triggers configured on a per-file basis.",
        feat_overlay_title: "Autonomous Overlays",
        feat_overlay_desc: "Secondary, silent background player lets you loop watermarks, logos, or standby screens independently from the main show queue.",
        feat_safety_title: "Self-Healing & Window Guard",
        feat_safety_desc: "Prevents accidental closure of the output window, auto-restores display focus if interrupted, and provides resilient stage recovery.",
        
        themes_title: "Four Interface Themes",
        themes_desc: "Switch the colors of the site and application to optimize contrast for the event control room.",
        theme_indigo: "Broadcast Indigo",
        theme_indigo_desc: "Default studio theme",
        theme_dark: "Studio Dark",
        theme_dark_desc: "High contrast workspace",
        theme_red: "Red Night (Stealth)",
        theme_red_desc: "Aviation-safe stealth mode",
        theme_light: "Studio Light",
        theme_light_desc: "Bright room environment",
        
        shortcuts_title: "Instant Keyboard Command Map",
        shortcuts_subtitle: "Professional operators rely on physical keys. Test these hotkeys directly in our browser simulator:",
        sc_space_title: "Play / Pause",
        sc_space_desc: "Launches playback or pauses the currently active playlist file.",
        sc_esc_title: "Instant Stop",
        sc_esc_desc: "Abruptly halts projection, resets timers, and clears the screen.",
        sc_f_title: "Smooth Fade Out",
        sc_f_desc: "Dims active video and fades out audio over the selected duration.",
        sc_o_title: "Toggle Overlay",
        sc_o_desc: "Turns the background watermark logo loop on and off in real-time.",
        sc_arrows_title: "Playlist Navigation",
        sc_arrows_desc: "Selects the next or previous item in the playlist queue.",
        sc_enter_title: "Load Highlighted File",
        sc_enter_desc: "Loads the selected file into the active media slot, ready to play.",
        
        faq_title: "Frequently Asked Questions",
        faq_subtitle: "Everything you need to know about Show Control before going live.",
        faq_q1: "How does the dual-screen mode work?",
        faq_a1: "Show Control automatically scans connected monitors and TVs. Once projection is activated, it locks a borderless output window to the second monitor, while keeping the interactive operator dashboard on the primary monitor.",
        faq_q2: "Why is LibVLC used for media playback?",
        faq_a2: "LibVLC is the industrial-grade framework behind VLC Media Player. It offers unparalleled stability and native format decoding. You can run high-bitrate MP4, MKV, audio files, and high-res slides without worrying about Windows codec packs.",
        faq_q3: "How does the self-healing protection system work?",
        faq_a3: "During a show, distractions happen. If the projection window loses focus, gets covered by another window, or is accidentally minimized, Show Control's thread hooks immediately intercept and restore it back to fullscreen target position within milliseconds.",
        faq_q4: "Is there any installation required?",
        faq_a4: "No. The program compiles into a single, fully portable executable (.exe) file. You can load it onto a USB drive and run it instantly on any Windows show computer without administrative setup.",
        
        footer_license: "Show Control is a free open-source application distributed under the GPL v3 license.",
        footer_author: "Created by Piotr Dębowski • 2026.",
        
        nav_features: "Features",
        nav_demo: "Simulator",
        nav_shortcuts: "Shortcuts",
        nav_faq: "FAQ"
    },
    pl: {
        hero_badge: "Edycja Rekwizytornia • Wydanie Stabilne",
        hero_title: "Profesjonalna reżyseria multimediów na żywo",
        hero_subtitle: "Stabilna konsola operatorska do natychmiastowej projekcji wideo, audio i grafik podczas koncertów, pokazów, prezentacji i eventów na drugim ekranie.",
        download_btn: "Pobierz Wersję .exe",
        source_btn: "Kod Źródłowy",
        
        sim_title: "Interaktywna Konsola w Przeglądarce",
        sim_subtitle: "Wypróbuj interfejs operatora i steruj projekcją na żywo za pomocą skrótów klawiszowych.",
        playlist_header: "Playlista Projektu",
        control_header: "Sterownik Główny",
        active_media_label: "Aktywny plik:",
        btn_play: "PLAY",
        btn_stop: "STOP",
        fade_label: "Efekt wygaszenia (Fade Out):",
        btn_fade: "WYGAŚ (FADE)",
        overlay_header: "Warstwa Nakładki",
        overlay_toggle_label: "Logo w tle (Pętla):",
        overlay_desc_text: "Niezależny kanał wideo/grafiki wyświetlany na pierwszym planie (brak dźwięku).",
        projection_header: "Wyjście Projekcji (Ekran 2)",
        
        features_title: "Architektura Stabilności",
        features_subtitle: "Zaprojektowana celowo, aby unikać awarii, zawieszeń i opóźnień synchronizacji w krytycznych momentach eventów.",
        feat_dual_title: "Dwuekranowy Tryb Pracy",
        feat_dual_desc: "Sterowanie listą odtwarzania odbywa się na monitorze operatora, podczas gdy bezramkowe wyjście projekcji blokuje się automatycznie na drugim ekranie (projektor, telewizor, ekran LED).",
        feat_vlc_title: "Potężny Silnik LibVLC",
        feat_vlc_desc: "Brak problemów z kodekami. Płynne, akcelerowane sprzętowo odtwarzanie formatów MP4, MKV, MP3, WAV oraz grafik dzięki natywnemu renderowaniu Direct3D11.",
        feat_fade_title: "Płynne Przejścia (Fade Out)",
        feat_fade_desc: "Zatrzymanie materiału z płynnym ściemnieniem obrazu i wyciszeniem dźwięku w wybranym czasie (0.2s - 2.0s), eliminujące nagłe cięcia dźwięku i czarne błyski.",
        feat_playlist_title: "Zaawansowana Playlista",
        feat_playlist_desc: "Przeciąganie plików, wyszukiwanie na żywo, oznaczanie nakładek i pełny zapis projektów do elastycznego formatu JSON.",
        feat_overlay_title: "System Nakładek",
        feat_overlay_desc: "Niezależny odtwarzacz w tle umożliwiający ciągłą projekcję logo, banerów sponsorskich lub plansz standby bez zakłócania głównego toku odtwarzania.",
        feat_safety_title: "Ochrona i Autonaprawa",
        feat_safety_desc: "Blokada przed przypadkowym zamknięciem okna wyjściowego, automatyczne przywracanie ostrości ekranu projekcji i bezbłędna obsługa błędów runtime.",
        
        themes_title: "Cztery Motywy Interfejsu",
        themes_desc: "Dopasuj aplikację i stronę do warunków oświetleniowych panujących w reżyserce.",
        theme_indigo: "Broadcast Indigo",
        theme_indigo_desc: "Domyślny motyw reżyserski",
        theme_dark: "Studio Dark",
        theme_dark_desc: "Wysoki kontrast",
        theme_red: "Red Night (Stealth)",
        theme_red_desc: "Tryb nocny chroniący wzrok",
        theme_light: "Studio Light",
        theme_light_desc: "Jasne pomieszczenia",
        
        shortcuts_title: "Skróty Klawiszowe Operatora",
        shortcuts_subtitle: "Profesjonalni operatorzy polegają na skrótach klawiszowych. Przetestuj je w symulatorze:",
        sc_space_title: "Odtwórz / Pauza",
        sc_space_desc: "Uruchamia lub wstrzymuje odtwarzanie aktywnego pliku.",
        sc_esc_title: "Zatrzymaj natychmiast",
        sc_esc_desc: "Natychmiast przerywa projekcję, zeruje czas i czyści ekran.",
        sc_f_title: "Płynne wygaszenie",
        sc_f_desc: "Ściemnia obraz i wycisza dźwięk w czasie wybranego efektu Fade.",
        sc_o_title: "Przełącz nakładkę",
        sc_o_desc: "Włącza lub wyłącza logo wyświetlane w rogu projekcji.",
        sc_arrows_title: "Nawigacja playlisty",
        sc_arrows_desc: "Zaznacza następny lub poprzedni plik na liście.",
        sc_enter_title: "Załaduj plik",
        sc_enter_desc: "Ładuje zaznaczony plik do głównego odtwarzacza.",
        
        faq_title: "Najczęściej Zadawane Pytania",
        faq_subtitle: "Wszystko, co musisz wiedzieć o Show Control przed wydarzeniem.",
        faq_q1: "Na czym polega dwuekranowość?",
        faq_a1: "Aplikacja automatycznie wykrywa podłączone monitory i projektory. Po uruchomieniu projekcji, okno bez obramowania otwiera się na drugim ekranie, podczas gdy panel sterowania pozostaje na pierwszym.",
        faq_q2: "Czym jest silnik LibVLC?",
        faq_a2: "To ten sam silnik, który zasila znany odtwarzacz VLC Media Player. Dzięki temu Show Control odtwarza praktycznie każdy format pliku wideo i audio stabilnie, bez instalacji dodatkowych kodeków.",
        faq_q3: "Jak działa mechanizm self-healing?",
        faq_a3: "Show Control stale monitoruje stan okna projekcyjnego. W razie przypadkowego zminimalizowania, utraty ostrości lub zamknięcia przez system, aplikacja natychmiast przywraca okno projekcji do właściwego stanu i pozycji.",
        faq_q4: "Czy aplikacja wymaga instalacji?",
        faq_a4: "Nie, aplikacja jest w pełni przenośna (portable) i uruchamia się z jednego pliku .exe, co ułatwia pracę na różnych komputerach w reżyserce.",
        
        footer_license: "Aplikacja Show Control udostępniana jest bezpłatnie na licencji open-source (GPL v3).",
        footer_author: "Copyright © 2026 Piotr Dębowski.",
        
        nav_features: "Funkcje",
        nav_demo: "Symulator",
        nav_shortcuts: "Skróty klawiszowe",
        nav_faq: "Najczęstsze pytania"
    }
};

let currentLang = 'pl';

function setLanguage(lang) {
    currentLang = lang;
    document.querySelectorAll('[data-i18n]').forEach(el => {
        const key = el.getAttribute('data-i18n');
        if (translations[lang][key]) {
            el.innerText = translations[lang][key];
        }
    });

    document.getElementById('btn-en').classList.toggle('active', lang === 'en');
    document.getElementById('btn-pl').classList.toggle('active', lang === 'pl');
    
    document.documentElement.lang = lang;
    
    // Update active playlist labels if simulator is initialized
    updateSimulatorPlaylistUI();
    updateSimulatorControllerUI();
}

/* Themes Logic */
const themes = ['indigo', 'dark', 'red', 'light'];

function setTheme(themeName) {
    const root = document.documentElement;
    themes.forEach(t => root.classList.remove(`theme-${t}`));
    root.classList.add(`theme-${themeName}`);
    
    // Update theme selectors active state
    document.querySelectorAll('.theme-card').forEach(card => {
        card.classList.toggle('active', card.getAttribute('data-theme') === themeName);
    });
}

/* Simulator Logic */
const simulatorPlaylist = [
    { id: 1, file: '01_Intro_3D_Promo.mp4', type: 'video', duration: 30, info: 'MP4 Video' },
    { id: 2, file: '02_President_Welcome.png', type: 'image', duration: 0, info: 'PNG Graphic' },
    { id: 3, file: '03_Ambient_Background.mp3', type: 'audio', duration: 120, info: 'MP3 Audio' },
    { id: 4, file: '04_Event_Credits.mkv', type: 'video', duration: 45, info: 'MKV Video' }
];

let simSelectedId = 1;
let simActiveId = null;
let simPlayState = 'idle'; // 'idle', 'playing', 'paused', 'fading'
let simCurrentTime = 0;
let simFadeDuration = 0.5;
let simFadeTimeElapsed = 0;
let simOverlayActive = false;
let simAnimationTime = 0;
let simIntervalId = null;

// DOM Elements
let playlistContainer, activeTitleEl, statusBadgeEl, timeDisplayEl, progressFillEl, playBtn, stopBtn, fadeBtn, overlayToggle, watermarkEl, screenInfoEl, canvas, ctx;

function initSimulator() {
    playlistContainer = document.getElementById('sim-playlist');
    activeTitleEl = document.getElementById('sim-active-title');
    statusBadgeEl = document.getElementById('sim-status-badge');
    timeDisplayEl = document.getElementById('sim-time-display');
    progressFillEl = document.getElementById('sim-progress-fill');
    playBtn = document.getElementById('sim-btn-play');
    stopBtn = document.getElementById('sim-btn-stop');
    fadeBtn = document.getElementById('sim-btn-fade');
    overlayToggle = document.getElementById('sim-overlay-toggle');
    watermarkEl = document.getElementById('projection-watermark');
    screenInfoEl = document.getElementById('projection-info');
    canvas = document.getElementById('projection-canvas');
    ctx = canvas.getContext('2d');
    
    // Setup canvas size
    resizeCanvas();
    window.addEventListener('resize', resizeCanvas);
    
    // Build playlist UI
    updateSimulatorPlaylistUI();
    
    // Bind controls
    playBtn.addEventListener('click', togglePlay);
    stopBtn.addEventListener('click', stopMedia);
    fadeBtn.addEventListener('click', startFadeOut);
    overlayToggle.addEventListener('change', toggleOverlay);
    
    // Bind fade presets
    document.querySelectorAll('.fade-preset').forEach(btn => {
        btn.addEventListener('click', (e) => {
            document.querySelectorAll('.fade-preset').forEach(b => b.classList.remove('active'));
            e.target.classList.add('active');
            simFadeDuration = parseFloat(e.target.getAttribute('data-fade'));
        });
    });
    
    // Start canvas animation frame loop
    requestAnimationFrame(renderLoop);
}

function resizeCanvas() {
    if (canvas) {
        canvas.width = canvas.clientWidth;
        canvas.height = canvas.clientHeight;
    }
}

function updateSimulatorPlaylistUI() {
    if (!playlistContainer) return;
    playlistContainer.innerHTML = '';
    
    simulatorPlaylist.forEach(item => {
        const li = document.createElement('li');
        li.className = `playlist-item ${item.id === simSelectedId ? 'selected' : ''}`;
        li.setAttribute('data-id', item.id);
        
        const typeEmoji = item.type === 'video' ? '🎬' : item.type === 'audio' ? '🎵' : '🖼️';
        const durStr = item.duration > 0 ? formatTime(item.duration) : '--:--';
        
        li.innerHTML = `
            <div class="media-name">${typeEmoji} ${item.file}</div>
            <div class="media-info">${durStr}</div>
        `;
        
        li.addEventListener('click', () => {
            simSelectedId = item.id;
            updateSimulatorPlaylistUI();
            updateSimulatorControllerUI();
            
            // Enable Load/Play
            playBtn.removeAttribute('disabled');
            stopBtn.removeAttribute('disabled');
        });
        playlistContainer.appendChild(li);
    });
}

function updateSimulatorControllerUI() {
    const selectedItem = simulatorPlaylist.find(i => i.id === simSelectedId);
    const activeItem = simulatorPlaylist.find(i => i.id === simActiveId);
    
    if (activeItem) {
        activeTitleEl.innerText = activeItem.file;
    } else if (selectedItem) {
        activeTitleEl.innerText = `[ READY ] ${selectedItem.file}`;
    } else {
        activeTitleEl.innerText = '---';
    }
    
    statusBadgeEl.innerText = simPlayState.toUpperCase();
    statusBadgeEl.className = 'status-indicator';
    if (simPlayState === 'playing') statusBadgeEl.classList.add('playing');
    if (simPlayState === 'paused') statusBadgeEl.classList.add('paused');
    if (simPlayState === 'fading') statusBadgeEl.classList.add('fading');
    
    if (activeItem) {
        timeDisplayEl.innerText = `${formatTime(simCurrentTime)} / ${activeItem.duration > 0 ? formatTime(activeItem.duration) : '--:--'}`;
        const pct = activeItem.duration > 0 ? (simCurrentTime / activeItem.duration) * 100 : 100;
        progressFillEl.style.width = `${pct}%`;
        fadeBtn.removeAttribute('disabled');
    } else {
        timeDisplayEl.innerText = `00:00 / 00:00`;
        progressFillEl.style.width = `0%`;
        fadeBtn.setAttribute('disabled', 'true');
    }
    
    // Play button text update
    if (simPlayState === 'playing') {
        playBtn.innerHTML = `<span class="icon">⏸️</span> PAUSE`;
    } else {
        playBtn.innerHTML = `<span class="icon">▶️</span> PLAY`;
    }
}

function togglePlay() {
    if (simPlayState === 'idle' || simPlayState === 'fading') {
        loadAndPlay(simSelectedId);
    } else if (simPlayState === 'playing') {
        simPlayState = 'paused';
        clearInterval(simIntervalId);
        updateSimulatorControllerUI();
    } else if (simPlayState === 'paused') {
        simPlayState = 'playing';
        startTimer();
        updateSimulatorControllerUI();
    }
}

function loadAndPlay(id) {
    clearInterval(simIntervalId);
    simActiveId = id;
    simPlayState = 'playing';
    simCurrentTime = 0;
    updateSimulatorControllerUI();
    startTimer();
}

function stopMedia() {
    clearInterval(simIntervalId);
    simPlayState = 'idle';
    simActiveId = null;
    simCurrentTime = 0;
    updateSimulatorControllerUI();
}

function startFadeOut() {
    if (simPlayState !== 'playing' && simPlayState !== 'paused') return;
    clearInterval(simIntervalId);
    simPlayState = 'fading';
    simFadeTimeElapsed = 0;
    updateSimulatorControllerUI();
    
    const fadeInterval = 30; // ms
    const fadeTimer = setInterval(() => {
        simFadeTimeElapsed += fadeInterval / 1000;
        if (simFadeTimeElapsed >= simFadeDuration) {
            clearInterval(fadeTimer);
            stopMedia();
        }
    }, fadeInterval);
}

function toggleOverlay(e) {
    simOverlayActive = e.target.checked;
    watermarkEl.classList.toggle('active', simOverlayActive);
    document.getElementById('sim-overlay-badge').innerText = simOverlayActive ? 'ACTIVE' : 'OFF';
    document.getElementById('sim-overlay-badge').className = `badge ${simOverlayActive ? 'active' : ''}`;
}

function startTimer() {
    clearInterval(simIntervalId);
    const activeItem = simulatorPlaylist.find(i => i.id === simActiveId);
    
    simIntervalId = setInterval(() => {
        if (activeItem && activeItem.duration > 0) {
            simCurrentTime += 1;
            if (simCurrentTime >= activeItem.duration) {
                // Loop or stop
                simCurrentTime = activeItem.duration;
                clearInterval(simIntervalId);
                simPlayState = 'idle';
            }
        }
        updateSimulatorControllerUI();
    }, 1000);
}

function formatTime(secs) {
    const m = Math.floor(secs / 60);
    const s = Math.floor(secs % 60);
    return `${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`;
}

// Canvas rendering loop
function renderLoop() {
    simAnimationTime += 0.05;
    
    if (ctx && canvas) {
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        
        let opacity = 1.0;
        if (simPlayState === 'fading') {
            opacity = 1.0 - (simFadeTimeElapsed / simFadeDuration);
            opacity = Math.max(0, Math.min(1, opacity));
        }
        
        const activeItem = simulatorPlaylist.find(i => i.id === simActiveId);
        
        if (simPlayState === 'idle' || !activeItem) {
            // Screen Standby State
            ctx.fillStyle = '#06060c';
            ctx.fillRect(0, 0, canvas.width, canvas.height);
            
            // Draw grid in background
            ctx.strokeStyle = 'rgba(255, 255, 255, 0.03)';
            ctx.lineWidth = 1;
            const gridSz = 30;
            for (let x = 0; x < canvas.width; x += gridSz) {
                ctx.beginPath(); ctx.moveTo(x, 0); ctx.lineTo(x, canvas.height); ctx.stroke();
            }
            for (let y = 0; y < canvas.height; y += gridSz) {
                ctx.beginPath(); ctx.moveTo(0, y); ctx.lineTo(canvas.width, y); ctx.stroke();
            }
            
            // Text info
            screenInfoEl.style.display = 'block';
            screenInfoEl.innerText = currentLang === 'pl' ? 'BRAK SYGNAŁU' : 'NO SIGNAL';
        } else {
            screenInfoEl.style.display = 'none';
            ctx.save();
            ctx.globalAlpha = opacity;
            
            // Render depending on media type
            if (activeItem.type === 'video') {
                renderVideoSimulation();
            } else if (activeItem.type === 'audio') {
                renderAudioSimulation();
            } else if (activeItem.type === 'image') {
                renderImageSimulation(activeItem.file);
            }
            
            ctx.restore();
        }
    }
    
    requestAnimationFrame(renderLoop);
}

function renderVideoSimulation() {
    // Background
    ctx.fillStyle = '#020205';
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    
    // Draw high-tech vector graphics
    const centerX = canvas.width / 2;
    const centerY = canvas.height / 2;
    const isPlaying = simPlayState === 'playing';
    const timeFactor = isPlaying ? simAnimationTime : 1.5;
    
    // Concentric rotating rings
    ctx.lineWidth = 1.5;
    
    // Ring 1
    ctx.strokeStyle = 'rgba(108, 99, 255, 0.3)';
    ctx.beginPath();
    ctx.arc(centerX, centerY, 80 + Math.sin(timeFactor) * 10, 0, Math.PI * 2);
    ctx.stroke();
    
    // Ring 2
    ctx.strokeStyle = 'rgba(0, 195, 255, 0.2)';
    ctx.beginPath();
    ctx.arc(centerX, centerY, 120 + Math.cos(timeFactor * 0.7) * 15, 0, Math.PI * 2);
    ctx.stroke();
    
    // Orbiting particles
    const particleCount = 24;
    for (let i = 0; i < particleCount; i++) {
        const angle = (i / particleCount) * Math.PI * 2 + timeFactor * 0.2;
        const dist = 100 + Math.sin(timeFactor + i) * 15;
        const px = centerX + Math.cos(angle) * dist;
        const py = centerY + Math.sin(angle) * dist;
        
        ctx.fillStyle = i % 2 === 0 ? '#6c63ff' : '#00c3ff';
        ctx.beginPath();
        ctx.arc(px, py, 3, 0, Math.PI * 2);
        ctx.fill();
        
        // Connect to center with thin line
        ctx.strokeStyle = 'rgba(255, 255, 255, 0.04)';
        ctx.beginPath();
        ctx.moveTo(centerX, centerY);
        ctx.lineTo(px, py);
        ctx.stroke();
    }
    
    // Central core
    ctx.fillStyle = '#6c63ff';
    ctx.shadowColor = '#6c63ff';
    ctx.shadowBlur = 15;
    ctx.beginPath();
    ctx.arc(centerX, centerY, 15 + Math.sin(timeFactor * 3) * 3, 0, Math.PI * 2);
    ctx.fill();
    ctx.shadowBlur = 0; // reset
}

function renderAudioSimulation() {
    ctx.fillStyle = '#04020a';
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    
    const isPlaying = simPlayState === 'playing';
    const timeFactor = isPlaying ? simAnimationTime : 0;
    
    // Bouncing spectrum bars
    const barCount = 18;
    const barWidth = 8;
    const gap = 6;
    const startX = (canvas.width - (barCount * (barWidth + gap) - gap)) / 2;
    
    ctx.fillStyle = '#6c63ff';
    
    for (let i = 0; i < barCount; i++) {
        // Calculate dynamic height
        let h = 20;
        if (isPlaying) {
            h = 25 + Math.sin(timeFactor * 2 + i) * 20 + Math.cos(timeFactor * 3.5 - i) * 15;
            h = Math.max(8, h);
        } else {
            h = 12 + Math.sin(i * 0.5) * 6;
        }
        
        const bx = startX + i * (barWidth + gap);
        const by = (canvas.height - h) / 2;
        
        // Gradient color for bars
        const grad = ctx.createLinearGradient(bx, by, bx, by + h);
        grad.addColorStop(0, '#00c3ff');
        grad.addColorStop(0.5, '#6c63ff');
        grad.addColorStop(1, '#ff007f');
        
        ctx.fillStyle = grad;
        ctx.fillRect(bx, by, barWidth, h);
    }
    
    // Waveform line in background
    ctx.strokeStyle = 'rgba(108, 99, 255, 0.1)';
    ctx.lineWidth = 2;
    ctx.beginPath();
    for (let x = 0; x < canvas.width; x += 10) {
        const y = canvas.height / 2 + Math.sin(x * 0.03 + timeFactor * 3) * 30;
        if (x === 0) ctx.moveTo(x, y);
        else ctx.lineTo(x, y);
    }
    ctx.stroke();
}

function renderImageSimulation(filename) {
    // Backdrop
    const grad = ctx.createLinearGradient(0, 0, canvas.width, canvas.height);
    grad.addColorStop(0, '#101224');
    grad.addColorStop(1, '#05060f');
    ctx.fillStyle = grad;
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    
    // Tech borders
    ctx.strokeStyle = 'rgba(108, 99, 255, 0.3)';
    ctx.lineWidth = 1;
    ctx.strokeRect(15, 15, canvas.width - 30, canvas.height - 30);
    
    // Display file name in styled header
    ctx.fillStyle = 'rgba(255, 255, 255, 0.8)';
    ctx.font = 'bold 12px "Outfit", sans-serif';
    ctx.textAlign = 'center';
    ctx.fillText('SLIDE PRESENTATION LAYER', canvas.width / 2, canvas.height / 2 - 30);
    
    ctx.fillStyle = '#6c63ff';
    ctx.font = '16px "Outfit", sans-serif';
    ctx.fillText(filename, canvas.width / 2, canvas.height / 2);
    
    ctx.fillStyle = 'rgba(255, 255, 255, 0.4)';
    ctx.font = '10px monospace';
    ctx.fillText('STATUS: ONLINE  •  RESOLUTION: 1920x1080', canvas.width / 2, canvas.height / 2 + 30);
}

/* Keyboard Shortcut Binding and Card Highlighting */
const shortcutKeyMap = {
    ' ': 'space',
    'spacebar': 'space',
    'escape': 'esc',
    'f': 'f',
    'o': 'o',
    'arrowup': 'arrows',
    'arrowdown': 'arrows',
    'enter': 'enter'
};

function setupKeyboardEvents() {
    window.addEventListener('keydown', (e) => {
        // Ignore if focus is in a form field or switch input
        if (document.activeElement.tagName === 'INPUT' || document.activeElement.tagName === 'TEXTAREA') {
            return;
        }
        
        const keyLower = e.key.toLowerCase();
        let actionKey = shortcutKeyMap[keyLower];
        
        if (keyLower === ' ') {
            // Prevent default page scroll
            e.preventDefault();
            actionKey = 'space';
        }
        
        if (actionKey) {
            triggerPhysicalShortcut(actionKey);
        }
    });
}

function triggerPhysicalShortcut(actionKey) {
    // Highlight the card
    const card = document.getElementById(`sc-${actionKey}`);
    if (card) {
        card.classList.add('active-trigger');
        setTimeout(() => card.classList.remove('active-trigger'), 200);
    }
    
    // Execute simulator action
    if (actionKey === 'space') {
        togglePlay();
    } else if (actionKey === 'esc') {
        stopMedia();
    } else if (actionKey === 'f') {
        startFadeOut();
    } else if (actionKey === 'o') {
        simOverlayActive = !simOverlayActive;
        overlayToggle.checked = simOverlayActive;
        // Trigger manual change
        const event = new Event('change');
        overlayToggle.dispatchEvent(event);
    } else if (actionKey === 'arrows') {
        // Select next/prev
        const currentIdx = simulatorPlaylist.findIndex(item => item.id === simSelectedId);
        let nextIdx = currentIdx + 1;
        if (nextIdx >= simulatorPlaylist.length) nextIdx = 0;
        
        simSelectedId = simulatorPlaylist[nextIdx].id;
        updateSimulatorPlaylistUI();
        updateSimulatorControllerUI();
    } else if (actionKey === 'enter') {
        loadAndPlay(simSelectedId);
    }
}

/* FAQ Accordion Logic */
function initFAQ() {
    document.querySelectorAll('.faq-question').forEach(button => {
        button.addEventListener('click', () => {
            const faqItem = button.parentElement;
            const isActive = faqItem.classList.contains('active');
            
            // Close all items
            document.querySelectorAll('.faq-item').forEach(item => {
                item.classList.remove('active');
                item.querySelector('.faq-answer').style.maxHeight = null;
            });
            
            // If it wasn't active, open it
            if (!isActive) {
                faqItem.classList.add('active');
                const answer = faqItem.querySelector('.faq-answer');
                answer.style.maxHeight = answer.scrollHeight + 'px';
            }
        });
    });
}

/* Entrance Scroll Animation */
function initScrollAnimation() {
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.style.opacity = 1;
                entry.target.style.transform = 'translateY(0)';
            }
        });
    }, { threshold: 0.1 });

    document.querySelectorAll('.feature-card, .shortcut-card, .theme-card, .faq-item, .section-title, .section-subtitle, .hero-content, .hero-image-wrapper, .dual-screen-setup').forEach(el => {
        el.style.opacity = 0;
        el.style.transform = 'translateY(30px)';
        el.style.transition = 'opacity 0.8s cubic-bezier(0.25, 1, 0.5, 1), transform 0.8s cubic-bezier(0.25, 1, 0.5, 1)';
        observer.observe(el);
    });
}

/* DOMContentLoaded Entrypoint */
document.addEventListener("DOMContentLoaded", () => {
    // Default theme class setup on root
    document.documentElement.classList.add('theme-indigo');
    
    // Init modules
    initSimulator();
    setupKeyboardEvents();
    initFAQ();
    initScrollAnimation();
    
    // Set default language
    setLanguage('pl');
    
    // Bind theme card clicks
    document.querySelectorAll('.theme-card').forEach(card => {
        card.addEventListener('click', () => {
            const theme = card.getAttribute('data-theme');
            setTheme(theme);
        });
    });
});
