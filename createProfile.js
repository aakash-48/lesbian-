/* createProfile.js
   Create profile page: uploads photo preview, manages interests chips, saves profile to localStorage.
*/

(function(){
  const PROFILES_KEY = 'hs_profiles';
  const SESSION_KEY = 'hs_session';

  const form = document.getElementById('profileForm');
  const avatarInput = document.getElementById('avatarInput');
  const avatarImg = document.getElementById('avatarImg');
  const avatarPreview = document.getElementById('avatarPreview');
  const interestInput = document.getElementById('interestInput');
  const addInterestBtn = document.getElementById('addInterestBtn');
  const interestsWrap = document.getElementById('interestsWrap');
  const profileMsg = document.getElementById('profileMsg');
  const logoutBtn = document.getElementById('logoutBtn');

  // Session check
  const session = JSON.parse(localStorage.getItem(SESSION_KEY) || 'null');
  if(!session){
    // allow creating profile in guest mode but encourage login
    // optional redirect commented out for demo
    // location.href = 'login.html';
  }

  // Manage interests state
  let interests = [];

  function renderInterests(){
    interestsWrap.innerHTML = '';
    interests.forEach((i, idx) => {
      const chip = document.createElement('div');
      chip.className = 'chip';
      chip.innerHTML = `${escapeHTML(i)} <button class="remove" data-idx="${idx}">✕</button>`;
      interestsWrap.appendChild(chip);
    });
    // attach delete handlers
    interestsWrap.querySelectorAll('.remove').forEach(btn=>{
      btn.addEventListener('click', function(){
        const idx = Number(this.dataset.idx);
        interests.splice(idx,1);
        renderInterests();
      });
    });
  }
  function escapeHTML(s=''){ return String(s).replace(/[&<>"']/g, function(m){ return ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'})[m]; }); }

  // Interest add
  addInterestBtn.addEventListener('click', function(){
    const v = interestInput.value.trim();
    if(!v) return;
    if(interests.includes(v.toLowerCase())) { interestInput.value=''; return; }
    interests.push(v);
    interestInput.value='';
    renderInterests();
  });
  interestInput.addEventListener('keydown', function(e){
    if(e.key === 'Enter'){ e.preventDefault(); addInterestBtn.click(); }
  });

  // Avatar upload preview (store as dataURL)
  let avatarDataURL = '';
  avatarPreview.addEventListener('click', ()=> avatarInput.click());
  avatarInput.addEventListener('change', function(){
    const file = this.files && this.files[0];
    if(!file) return;
    if(!file.type.startsWith('image/')) { profileMsg.textContent = 'Please select an image.'; return; }
    const reader = new FileReader();
    reader.onload = function(ev){
      avatarDataURL = ev.target.result;
      avatarImg.src = avatarDataURL;
    };
    reader.readAsDataURL(file);
  });

  // Logout for convenience
  logoutBtn && logoutBtn.addEventListener('click', ()=> { localStorage.removeItem(SESSION_KEY); location.href='index.html'; });

  // Form submit
  form.addEventListener('submit', function(e){
    e.preventDefault();
    profileMsg.textContent = '';

    const name = document.getElementById('name').value.trim();
    const age = Number(document.getElementById('age').value);
    const city = document.getElementById('city').value.trim();
    const country = document.getElementById('country').value.trim();
    const bio = document.getElementById('bio').value.trim();
    const facebook = document.getElementById('facebook').value.trim();
    const instagram = document.getElementById('instagram').value.trim();
    const snapchat = document.getElementById('snapchat').value.trim();

    if(!name){ profileMsg.textContent = 'Please enter a display name.'; return; }
    if(!age || age < 18){ profileMsg.textContent = 'Please enter a valid age (18+).'; return; }

    // Build profile object
    const id = 'p-' + Date.now() + '-' + Math.floor(Math.random()*9999);
    const profile = {
      id, name, age, city, country, bio,
      photo: avatarDataURL || '', // store base64 if uploaded
      interests: interests.slice(),
      socials: {facebook, instagram, snapchat},
      ownerEmail: session ? session.email : null,
      createdAt: Date.now()
    };

    // Save to localStorage
    try{
      const list = JSON.parse(localStorage.getItem(PROFILES_KEY) || '[]');
      list.unshift(profile);
      localStorage.setItem(PROFILES_KEY, JSON.stringify(list));
      profileMsg.textContent = 'Profile saved. Redirecting to dashboard...';
      setTimeout(()=> location.href = 'dashboard.html', 700);
    }catch(err){
      profileMsg.textContent = 'Could not save profile. Try again.';
      console.error(err);
    }
  });

  // Small helper to import existing profile info if user already had one (optional)
  function autoFillFromSession(){
    if(!session) return;
    // If user has a profile, prefill name
    document.getElementById('name').value = session.name || '';
  }
  autoFillFromSession();
})();
