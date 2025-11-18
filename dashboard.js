/* dashboard.js
   Shows profiles (mock or from localStorage), search, filters, logout, and routing to profile view.
*/

(function(){
  // Utility keys
  const PROFILES_KEY = 'hs_profiles';
  const SESSION_KEY = 'hs_session';

  // Elements
  const grid = document.getElementById('profilesGrid');
  const searchInput = document.getElementById('searchInput');
  const countryFilter = document.getElementById('countryFilter');
  const ageFilter = document.getElementById('ageFilter');
  const sortSelect = document.getElementById('sortSelect');
  const welcomeName = document.getElementById('welcomeName');
  const logoutBtn = document.getElementById('logoutBtn');

  // Ensure user is logged-in
  const session = JSON.parse(localStorage.getItem(SESSION_KEY) || 'null');
  if(!session){
    // Not logged in but allow browsing in guest mode
    welcomeName.textContent = 'Guest';
  } else {
    welcomeName.textContent = `Hi, ${session.name}`;
  }

  logoutBtn && logoutBtn.addEventListener('click', function(){
    localStorage.removeItem(SESSION_KEY);
    // For pages we've included, redirect to login
    location.href = 'index.html';
  });

  // Load or initialize mock profiles
  function getProfiles(){
    try{
      return JSON.parse(localStorage.getItem(PROFILES_KEY) || '[]');
    }catch(e){ return []; }
  }
  function saveProfiles(list){
    localStorage.setItem(PROFILES_KEY, JSON.stringify(list));
  }

  function ensureMockData(){
    const existing = getProfiles();
    if(existing.length) return;
    // Mock dataset (minimal fields + base64 placeholder or gradient color)
    const mock = [
      {
        id: 'p-'+Date.now()+'-1',
        name: 'Maya R.',
        age: 26,
        city: 'Kathmandu',
        country: 'Nepal',
        bio: 'Mountains & chai lover. Photographer & plant parent.',
        photo: '', // leave empty to use gradient placeholder
        interests: ['hiking','photography','plants'],
        socials: {instagram: 'https://instagram.com/maya', facebook:'', snapchat:''},
        createdAt: Date.now()
      },
      {
        id: 'p-'+(Date.now()+1),
        name: 'Lina P.',
        age: 31,
        city: 'Berlin',
        country: 'Germany',
        bio: 'Community organizer, spoken word poet, coffee addict.',
        photo: '',
        interests: ['poetry','coffee','activism'],
        socials: {instagram:'https://instagram.com/lina',facebook:'',snapchat:''},
        createdAt: Date.now()-1000000
      },
      {
        id: 'p-'+(Date.now()+2),
        name: 'Sofia M.',
        age: 24,
        city: 'Lisbon',
        country: 'Portugal',
        bio: 'Chef in training, loves sunsets & bossa nova.',
        photo: '',
        interests: ['cooking','music','beaches'],
        socials: {instagram:'',facebook:'https://facebook.com/sofia',snapchat:''},
        createdAt: Date.now()-2000000
      }
    ];
    saveProfiles(mock);
  }

  // Render profiles
  function renderProfiles(profiles){
    grid.innerHTML = '';
    if(!profiles.length){
      grid.innerHTML = '<div class="card glass center">No profiles yet. Create one or check back later.</div>';
      return;
    }

    profiles.forEach(p => {
      const card = document.createElement('div');
      card.className = 'card profile-card';
      card.innerHTML = `
        <div class="profile-photo">
          ${p.photo ? `<img src="${p.photo}" alt="${escapeHTML(p.name)}">` : `<div style="width:100%;height:100%;background:linear-gradient(135deg,#ffeff8,#f3e9ff);display:flex;align-items:center;justify-content:center;font-weight:700;color:#4b2a53">${initials(p.name)}</div>`}
        </div>
        <div class="profile-name">${escapeHTML(p.name)}</div>
        <div class="profile-meta">${p.city ? escapeHTML(p.city) + ', ' : ''}${escapeHTML(p.country || '')}</div>
        <div class="muted small">${p.age ? escapeHTML(String(p.age))+' yrs' : ''}</div>
        <div style="display:flex;gap:8px;flex-wrap:wrap;justify-content:center;margin-top:6px">
          ${ (p.interests||[]).slice(0,4).map(i=>`<div class="chip">${escapeHTML(i)}</div>`).join('') }
        </div>
        <div style="width:100%;display:flex;gap:8px;justify-content:center">
          <a class="btn" href="profile.html?id=${encodeURIComponent(p.id)}">View Profile</a>
          <button class="btn btn-ghost" data-id="${p.id}" onclick="window.location.href='create-profile.html'">Message</button>
        </div>
      `;
      grid.appendChild(card);
    });
  }

  // Helpers
  function escapeHTML(s=''){ return String(s).replace(/[&<>"']/g, function(m){ return ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'})[m]; }); }
  function initials(name=''){ return name.split(' ').map(n=>n[0]||'').slice(0,2).join('').toUpperCase(); }

  // Filters & search
  function populateCountryFilter(profiles){
    const countries = Array.from(new Set(profiles.map(p => p.country).filter(Boolean))).sort();
    countryFilter.innerHTML = '<option value="">All countries</option>';
    countries.forEach(c => {
      const opt = document.createElement('option'); opt.value = c; opt.textContent = c; countryFilter.appendChild(opt);
    });
  }

  function applyFilters(){
    let list = getProfiles();

    // search
    const q = (searchInput.value || '').trim().toLowerCase();
    if(q){
      list = list.filter(p => {
        const hay = [p.name, p.city, p.country, p.bio, ...(p.interests||[])].join(' ').toLowerCase();
        return hay.includes(q);
      });
    }

    // country
    const country = countryFilter.value;
    if(country) list = list.filter(p => (p.country||'').toLowerCase() === country.toLowerCase());

    // age
    const ageRange = ageFilter.value;
    if(ageRange){
      if(ageRange === '45+') list = list.filter(p=>p.age>=45);
      else {
        const [a,b] = ageRange.split('-').map(Number);
        list = list.filter(p => p.age >= a && p.age <= b);
      }
    }

    // sort
    const sort = sortSelect.value;
    if(sort === 'recent') list = list.sort((a,b)=> b.createdAt - a.createdAt);
    if(sort === 'age-asc') list = list.sort((a,b)=> (a.age||0) - (b.age||0));
    if(sort === 'age-desc') list = list.sort((a,b)=> (b.age||0) - (a.age||0));
    if(sort === 'name') list = list.sort((a,b)=> a.name.localeCompare(b.name));

    renderProfiles(list);
  }

  // Initialization
  ensureMockData();
  const all = getProfiles();
  populateCountryFilter(all);
  renderProfiles(all);

  // Event listeners
  [searchInput, countryFilter, ageFilter, sortSelect].forEach(el => el && el.addEventListener('input', applyFilters));

  // Expose applyFilters for immediate usage
  window.applyProfileFilters = applyFilters;
})();
