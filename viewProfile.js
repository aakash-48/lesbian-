/* viewProfile.js
   Loads profile by id from query string and renders profile view
*/

(function(){
  const PROFILES_KEY = 'hs_profiles';

  function qs(name){
    const params = new URLSearchParams(location.search);
    return params.get(name);
  }

  function getProfiles(){
    try{ return JSON.parse(localStorage.getItem(PROFILES_KEY) || '[]'); } catch(e){ return []; }
  }

  function escapeHTML(s=''){ return String(s).replace(/[&<>"']/g, function(m){ return ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'})[m]; }); }

  const id = qs('id');
  const profiles = getProfiles();
  const profile = profiles.find(p => p.id === id);

  const header = document.getElementById('profileHeader');
  const aboutText = document.getElementById('aboutText');
  const interestsList = document.getElementById('interestsList');
  const socialLinks = document.getElementById('socialLinks');

  if(!profile){
    header.innerHTML = '<div class="card glass center">Profile not found.</div>';
    return;
  }

  // header
  header.innerHTML = `
    <div class="photo">
      ${profile.photo ? `<img src="${profile.photo}" alt="${escapeHTML(profile.name)}">` : `<div style="width:100%;height:100%;background:linear-gradient(135deg,#ffe7f6,#f0e8ff);display:flex;align-items:center;justify-content:center;font-weight:700;color:#4b2a53;font-size:2rem">${profile.name.split(' ').map(n=>n[0]||'').slice(0,2).join('')}</div>`}
    </div>
    <div class="meta">
      <h2 style="margin:0">${escapeHTML(profile.name)} <span class="muted" style="font-weight:600"> · ${escapeHTML(String(profile.age))}</span></h2>
      <div class="muted">${escapeHTML(profile.city || '')}${profile.country ? ', ' + escapeHTML(profile.country) : ''}</div>
      <div style="margin-top:12px;display:flex;gap:8px;flex-wrap:wrap">
        ${(profile.interests||[]).slice(0,6).map(i=>`<div class="chip">${escapeHTML(i)}</div>`).join('')}
      </div>
    </div>
  `;

  aboutText.textContent = profile.bio || 'No bio provided.';

  // interests
  interestsList.innerHTML = (profile.interests || []).map(i => `<div class="chip">${escapeHTML(i)}</div>`).join('');

  // socials
  const s = profile.socials || {};
  socialLinks.innerHTML = '';
  if(s.facebook) socialLinks.innerHTML += `<a href="${escapeHTML(s.facebook)}" target="_blank" rel="noopener">Facebook</a>`;
  if(s.instagram) socialLinks.innerHTML += `<a href="${escapeHTML(s.instagram)}" target="_blank" rel="noopener">Instagram</a>`;
  if(s.snapchat) socialLinks.innerHTML += `<a href="${escapeHTML(s.snapchat)}" target="_blank" rel="noopener">Snapchat</a>`;

})();
