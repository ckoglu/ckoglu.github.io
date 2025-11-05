// theme.js content with event delegation for dynamic elements
(function() {
    const root = document.documentElement;
    let mediaQueryListener = null;
    let autoInterval = null;

    function setTheme(newTheme) {
        localStorage.setItem('theme', newTheme);

        // Clean up previous listeners/intervals
        if (mediaQueryListener) {
            mediaQueryListener.removeEventListener('change', handleSystemChange);
            mediaQueryListener = null;
        }
        if (autoInterval) {
            clearInterval(autoInterval);
            autoInterval = null;
        }

        if (newTheme === 'dark') {
            root.classList.add('dark');
        } else if (newTheme === 'light') {
            root.classList.remove('dark');
        } else if (newTheme === 'system') {
            handleSystemChange();
            mediaQueryListener = window.matchMedia('(prefers-color-scheme: dark)');
            mediaQueryListener.addEventListener('change', handleSystemChange);
        } else if (newTheme === 'auto') {
            handleAutoChange();
            // Check every minute for time change
            autoInterval = setInterval(handleAutoChange, 60000);
        }
    }

    function handleSystemChange() {
        const isDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
        if (isDark) {
            root.classList.add('dark');
        } else {
            root.classList.remove('dark');
        }
    }

    function handleAutoChange() {
        const hour = new Date().getHours();
        const isNight = hour >= 18 || hour < 6;
        if (isNight) {
            root.classList.add('dark');
        } else {
            root.classList.remove('dark');
        }
    }

    // Event delegation for clicks on [data-theme] elements
    document.addEventListener('click', (e) => {
        if (e.target.matches('[data-theme]')) {
            e.preventDefault();
            const selectedTheme = e.target.getAttribute('data-theme');
            setTheme(selectedTheme);
        }
    });

    // Initialize based on stored theme
    const currentTheme = localStorage.getItem('theme') || 'system';
    setTheme(currentTheme);
})();