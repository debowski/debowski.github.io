const translations = {
    en: {
        hero_badge: "Broadcast Edition",
        hero_title: "Professional Control For Your Live Events",
        hero_subtitle: "Application for managing multimedia projection (video, audio, graphics) during live events, shows, presentations, and concerts.",
        download_btn: "Download (.exe)",
        source_btn: "Source Code",
        features_title: "Key Features",
        feat_dual_title: "Dual-Screen Mode",
        feat_dual_desc: "Automatic detection of the second monitor. Operator manages from the first screen, projection runs on the second.",
        feat_vlc_title: "Powerful LibVLC Engine",
        feat_vlc_desc: "Seamless playback of video (MP4, MKV), audio (MP3, WAV) and images with Direct3D11 and WaveOut for utmost stability.",
        feat_fade_title: "Smooth Transitions (Fade Out)",
        feat_fade_desc: "Stop media with a configurable Fade effect (0.2s - 2.0s) - dims video and fades out audio without harsh cuts.",
        feat_playlist_title: "Advanced Playlist",
        feat_playlist_desc: "Drag & drop, live search during playback, per-file overlay toggles and full project saving to JSON.",
        feat_overlay_title: "Overlay System (Logo)",
        feat_overlay_desc: "Independent player allows displaying logos, static graphics, or looping videos silently behind the main projection.",
        feat_safety_title: "Stability & Safety",
        feat_safety_desc: "Self-healing mechanisms, HWND projection window protection against accidental closing, and robust exception handling.",
        themes_title: "Four Interface Themes",
        themes_desc: "Adapt the app to the lighting conditions in your control room.",
        footer_license: "Open-source application (GPL v3 license)."
    },
    pl: {
        hero_badge: "Broadcast Edition",
        hero_title: "Profesjonalna kontrola nad Twoim wydarzeniem",
        hero_subtitle: "Aplikacja do zarządzania projekcją multimediów (wideo, audio, grafika) podczas wydarzeń na żywo, pokazów, prezentacji i koncertów.",
        download_btn: "Pobierz Wersję .exe",
        source_btn: "Kod Źródłowy",
        features_title: "Kluczowe Możliwości",
        feat_dual_title: "Dwuekranowy Tryb Pracy",
        feat_dual_desc: "Operator steruje listą odtwarzania na jednym ekranie (konsola), podczas gdy obraz właściwy wyświetlany jest na drugim monitorze lub projektorze.",
        feat_vlc_title: "Potężny Silnik LibVLC",
        feat_vlc_desc: "Bezproblemowe odtwarzanie wideo (MP4, MKV), audio (MP3, WAV) oraz grafik z wyjściem Direct3D11 i WaveOut dla najwyższej stabilności.",
        feat_fade_title: "Płynne Przejścia (Fade Out)",
        feat_fade_desc: "Zatrzymanie materiału z konfigurowalnym efektem Fade (0.2s - 2.0s) - ściemnienie obrazu i wyciszenie dźwięku bez drastycznych cięć.",
        feat_playlist_title: "Zaawansowana Playlista",
        feat_playlist_desc: "Drag & drop, wyszukiwanie na żywo w trakcie odtwarzania, oznaczanie nakładek per-plik i pełne zapisywanie projektów do JSON.",
        feat_overlay_title: "System Nakładek (Logo)",
        feat_overlay_desc: "Niezależny odtwarzacz pozwala na wyświetlanie logo, grafik statycznych lub wideo w nieskończonej pętli bez dźwięku w tle głównej projekcji.",
        feat_safety_title: "Stabilność i Bezpieczeństwo",
        feat_safety_desc: "Mechanizmy self-healing, ochrona HWND okna projekcji przed przypadkowym zamknięciem i bezbłędna obsługa wyjątków w trakcie trwania eventu.",
        themes_title: "Cztery Motywy Interfejsu",
        themes_desc: "Dopasuj aplikację do warunków oświetleniowych panujących w reżyserce.",
        footer_license: "Aplikacja udostępniana na licencji open-source (GPL v3)."
    }
};

function setLanguage(lang) {
    document.querySelectorAll('[data-i18n]').forEach(el => {
        const key = el.getAttribute('data-i18n');
        if (translations[lang][key]) {
            el.innerText = translations[lang][key];
        }
    });

    document.getElementById('btn-en').classList.toggle('active', lang === 'en');
    document.getElementById('btn-pl').classList.toggle('active', lang === 'pl');
    
    document.documentElement.lang = lang;
}

// Simple entrance animation observer
document.addEventListener("DOMContentLoaded", () => {
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.style.opacity = 1;
                entry.target.style.transform = 'translateY(0)';
            }
        });
    }, { threshold: 0.1 });

    document.querySelectorAll('.feature-card, .section-title, .hero-content, .hero-image').forEach(el => {
        el.style.opacity = 0;
        el.style.transform = 'translateY(20px)';
        el.style.transition = 'opacity 0.6s ease-out, transform 0.6s ease-out';
        observer.observe(el);
    });
});
