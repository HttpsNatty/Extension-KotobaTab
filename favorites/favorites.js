import { 
  getFavorites, 
  removeFavorite,
  speakJapanese,
  createSakuraPetals
} from '../shared/utils.js';

document.addEventListener('DOMContentLoaded', async () => {
  createSakuraPetals('sakura-bg', 20);
  await renderFavorites();
});

async function renderFavorites() {
  const favorites = await getFavorites();
  const listContainer = document.getElementById('favorites-list');
  const emptyState = document.getElementById('empty-state');
  const template = document.getElementById('favorite-card-template');
  
  listContainer.innerHTML = '';
  
  if (favorites.length === 0) {
    emptyState.classList.remove('hidden');
    return;
  }
  
  emptyState.classList.add('hidden');
  
  favorites.forEach((phrase, index) => {
    const clone = template.content.cloneNode(true);
    const card = clone.querySelector('.favorite-card');
    
    card.style.animationDelay = `${index * 0.05}s`;
    
    clone.querySelector('.card-jp').textContent = phrase.jp;
    clone.querySelector('.card-romaji').textContent = phrase.romaji;
    clone.querySelector('.card-pt').textContent = phrase.pt;
    
    clone.querySelector('.btn-listen').addEventListener('click', () => {
      speakJapanese(phrase.jp);
    });
    
    clone.querySelector('.btn-remove').addEventListener('click', async () => {
      await removeFavorite(phrase.jp);
      card.style.transform = 'scale(0.9)';
      card.style.opacity = '0';
      setTimeout(() => {
        renderFavorites();
      }, 300);
    });
    
    listContainer.appendChild(clone);
  });
}
