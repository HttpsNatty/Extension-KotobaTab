import { 
  getPhraseOfTheDay, 
  getRandomPhrase, 
  saveFavorite, 
  removeFavorite,
  isFavorite,
  speakJapanese,
  createSakuraPetals 
} from '../shared/utils.js';

let currentPhrase = null;

async function updateUI(phrase) {
  currentPhrase = phrase;
  
  const container = document.getElementById('phrase-container');
  container.classList.remove('fade-in');
  void container.offsetWidth; // trigger reflow
  container.classList.add('fade-in');

  document.getElementById('text-jp').textContent = phrase.jp;
  document.getElementById('text-romaji').textContent = phrase.romaji;
  document.getElementById('text-pt').textContent = phrase.pt;

  const fav = await isFavorite(phrase.jp);
  document.getElementById('icon-favorite').textContent = fav ? '🌟' : '⭐';
}

document.addEventListener('DOMContentLoaded', async () => {
  createSakuraPetals('sakura-bg', 10);
  
  const phrase = await getPhraseOfTheDay();
  updateUI(phrase);

  // Buttons Event Listeners
  document.getElementById('btn-listen').addEventListener('click', () => {
    if (currentPhrase) {
      speakJapanese(currentPhrase.jp);
    }
  });

  document.getElementById('btn-new').addEventListener('click', async () => {
    const newPhrase = await getRandomPhrase();
    updateUI(newPhrase);
  });

  document.getElementById('btn-favorite').addEventListener('click', async () => {
    if (!currentPhrase) return;
    
    const fav = await isFavorite(currentPhrase.jp);
    if (fav) {
      await removeFavorite(currentPhrase.jp);
    } else {
      await saveFavorite(currentPhrase);
    }
    
    // Refresh star icon
    const isFavNow = await isFavorite(currentPhrase.jp);
    document.getElementById('icon-favorite').textContent = isFavNow ? '🌟' : '⭐';
  });

  document.getElementById('btn-favorites-page').addEventListener('click', () => {
    chrome.tabs.create({ url: chrome.runtime.getURL('favorites/favorites.html') });
  });
});
