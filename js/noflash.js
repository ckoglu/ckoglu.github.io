(function() {
    const theme = localStorage.getItem('theme') || 'system';
    const root = document.documentElement;
    function setTheme(newTheme) {
        if (newTheme === 'dark') {
            root.classList.add('dark');
        } else if (newTheme === 'light') {
            root.classList.remove('dark');
        } else if (newTheme === 'system') {
            const isDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
            if (isDark) {
                root.classList.add('dark');
            } else {
                root.classList.remove('dark');
            }
        } else if (newTheme === 'auto') {
            const hour = new Date().getHours();
            const isNight = hour >= 18 || hour < 6;
            if (isNight) {
                root.classList.add('dark');
            } else {
                root.classList.remove('dark');
            }
        }
    }
    setTheme(theme);
})();