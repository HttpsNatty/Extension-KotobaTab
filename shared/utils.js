export async function loadPhrases() {
  try {
    const response = await fetch('https://docs.google.com/spreadsheets/d/e/2PACX-1vR1gDpZMC9of4d6iU6k5pITxQrjX3zMcwjGNI9nz3c9g7x0sAkw8cTMNbJYL2yodCdeMyM6UAnauZEa/pub?output=tsv', { cache: 'no-store' });
    const text = await response.text();
    
    if (!text || text.trim().length === 0) {
      throw new Error("Google Sheets returned empty TSV data");
    }

    const lines = text.split('\n').map(line => line.trim()).filter(line => line.length > 0);
    const phrases = lines.map(line => {
      const [jp, romaji, pt] = line.split('\t');
      return { 
        jp: jp?.trim() || '', 
        romaji: romaji?.trim() || '', 
        pt: pt?.trim() || '' 
      };
    }).filter(p => p.jp && p.pt); // Filtrar linhas inválidas
    
    if (phrases.length > 0 && (phrases[0].jp.toLowerCase().includes('jp') || phrases[0].jp.toLowerCase().includes('japonês'))) {
      phrases.shift();
    }
    
    if (phrases.length === 0) throw new Error("No valid phrases found in TSV");
    return phrases;
  } catch (err) {
    console.warn("Failed to fetch from sheets or empty data, using fallback:", err.message);
    const response = await fetch(chrome.runtime.getURL('data/phrases.json'));
    return await response.json();
  }
}

export async function getPhraseOfTheDay() {
  const phrases = await loadPhrases();
  const today = new Date();
  const index = (today.getFullYear() + today.getMonth() + today.getDate()) % phrases.length;
  return phrases[index];
}

export async function getRandomPhrase() {
  const phrases = await loadPhrases();
  const index = Math.floor(Math.random() * phrases.length);
  return phrases[index];
}

export async function saveFavorite(phrase) {
  return new Promise((resolve) => {
    chrome.storage.local.get({ favorites: [] }, (result) => {
      const favorites = result.favorites;
      if (!favorites.find(f => f.jp === phrase.jp)) {
        favorites.push(phrase);
        chrome.storage.local.set({ favorites }, resolve);
      } else {
        resolve();
      }
    });
  });
}

export async function removeFavorite(jp) {
  return new Promise((resolve) => {
    chrome.storage.local.get({ favorites: [] }, (result) => {
      const favorites = result.favorites.filter(f => f.jp !== jp);
      chrome.storage.local.set({ favorites }, resolve);
    });
  });
}

export async function isFavorite(jp) {
  return new Promise((resolve) => {
    chrome.storage.local.get({ favorites: [] }, (result) => {
      resolve(result.favorites.some(f => f.jp === jp));
    });
  });
}

export async function getFavorites() {
  return new Promise((resolve) => {
    chrome.storage.local.get({ favorites: [] }, (result) => {
      resolve(result.favorites);
    });
  });
}

export function speakJapanese(text) {
  if (!('speechSynthesis' in window)) {
    console.error("Web Speech API not supported.");
    return;
  }
  const utterance = new SpeechSynthesisUtterance(text);
  utterance.lang = 'ja-JP';
  utterance.rate = 0.8; 
  window.speechSynthesis.speak(utterance);
}

export function createSakuraPetals(containerId, count = 15) {
  const container = document.getElementById(containerId);
  if (!container) return;
  
  for (let i = 0; i < count; i++) {
    const petal = document.createElement('div');
    petal.classList.add('sakura-petal');
    
    const startX = Math.random() * 100;
    const size = Math.random() * 8 + 6;
    const animDuration = Math.random() * 8 + 6;
    const animDelay = Math.random() * 5;
    const opacity = Math.random() * 0.5 + 0.3;
    
    petal.style.left = `${startX}vw`;
    petal.style.width = `${size}px`;
    petal.style.height = `${size}px`;
    petal.style.animationDuration = `${animDuration}s`;
    petal.style.animationDelay = `-${animDelay}s`;
    petal.style.opacity = opacity;
    
    container.appendChild(petal);
  }
}
