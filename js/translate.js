function googleTranslateElementInit() {
    new google.translate.TranslateElement({
        pageLanguage: 'tr',
        includedLanguages: 'az,kk,ky,ar,zh-CN,nl,en,fr,de,hi,id,it,ja,ko,ms,pl,pt,ru,es,th,tr,vi,af,bg,ca,cs,da,et,fi,hu,is,lv,lt,no,ro,sr,sk,sl,sv,uk,he,fa',
        layout: google.translate.TranslateElement.InlineLayout.SIMPLE,
        autoDisplay: false
    }, 'google_translate_element');
}

// style
function changeGoogleStyles() {
    if(typeof document.getElementsByClassName('goog-te-menu-frame')[0] === 'undefined') {
        setTimeout(changeGoogleStyles, 50);
    } else {
        const style = document.createElement('style');
        style.innerHTML = '.goog-te-menu-frame { max-height: 50% !important; overflow: scroll !important; }';
        document.getElementsByTagName('head')[0].appendChild(style);
    }
}
changeGoogleStyles();

// no_load
function restorePageOnTranslation() {
    const iframe = document.querySelector('.goog-te-menu-frame');
    if (iframe) {
        iframe.addEventListener('load', function() {
            const links = iframe.contentDocument.querySelectorAll('a');
            links.forEach(link => {
                link.addEventListener('click', function(e) {
                    e.preventDefault();
                    const lang = this.getAttribute('href').split('=')[1];
                    translatePage(lang);
                });
            });
        });
    } else {
        setTimeout(restorePageOnTranslation, 50);
    }
}
restorePageOnTranslation();

function translatePage(lang) {
    if (typeof google !== 'undefined' && google.translate) {google.translate.translatePage('tr', lang);}
}