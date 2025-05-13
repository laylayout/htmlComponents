
// ===== Language Switcher Function =====
function switchLanguage() {
  const selector = document.getElementById('langSelector');
  const newLang = selector.value;

  if (!newLang) return;

  // Set cookie (expires in 365 days)
  document.cookie = `language=${newLang}; path=/; max-age=${60 * 60 * 24 * 365}`;

  // Reload to apply new language
  location.reload();
}
function setLanguageInSelector() {
  const selector = document.getElementById('langSelector');
  if (selector) {
    const lang = getCookie('language') || 'en';
    selector.value = lang;
  }
}

function getCookie(name) {
  const value = `; ${document.cookie}`;
  const parts = value.split(`; ${name}=`);
  if (parts.length === 2) return parts.pop().split(';').shift();
  return null;
}

const language = getCookie('language') || 'en';


  const basePaths = [
    'https://laylayout.pages.dev/',
    'https://raw.githubusercontent.com/wwwdageparty/htmlComponents/refs/heads/master/'
  ];

  function loadLocalizedComponent(baseName, targetId) {
    const localizedName = (language && language !== 'en') 
      ? `${baseName.replace('.html', '')}-${language}.html` 
      : baseName;

    const fileCandidates = (language && language !== 'en')
      ? [localizedName, baseName]
      : [baseName];

    let fileAttempt = 0;
    let pathAttempt = 0;

    function tryFetch() {
      if (fileAttempt >= fileCandidates.length) {
        console.error(`All file attempts failed for ${baseName}`);
        return;
      }

      const fileName = fileCandidates[fileAttempt];
      const fullUrl = `${basePaths[pathAttempt]}${fileName}`;

      fetch(fullUrl)
        .then(response => {
          if (!response.ok) throw new Error('Fetch failed');
          return response.text();
        })
        .then(html => {
          document.getElementById(targetId).innerHTML = html;
          if (targetId === 'header') {
            setLanguageInSelector();
          }
        })
        .catch(() => {
          pathAttempt++;
          if (pathAttempt < basePaths.length) {
            tryFetch();
          } else {
            pathAttempt = 0;
            fileAttempt++;
            tryFetch();
          }
        });
    }

    tryFetch();
  }

  loadLocalizedComponent('header.html', 'header');
  loadLocalizedComponent('footer.html', 'footer');
