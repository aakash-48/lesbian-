/* signup.js
   Handles sign up form, front-end validation and stores users in localStorage.
*/

(function(){
  const form = document.getElementById('signupForm');
  const msg = document.getElementById('signupMsg');

  function getUsers(){
    try{
      return JSON.parse(localStorage.getItem('hs_users')||'[]');
    }catch(e){ return []; }
  }

  function saveUsers(users){
    localStorage.setItem('hs_users', JSON.stringify(users));
  }

  function validEmail(email){
    // Simple email regex
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
  }

  form.addEventListener('submit', function(e){
    e.preventDefault();
    msg.textContent='';

    const name = document.getElementById('name').value.trim();
    const email = document.getElementById('email').value.trim().toLowerCase();
    const password = document.getElementById('password').value;
    const confirmPassword = document.getElementById('confirmPassword').value;

    if(!name || !email || !password || !confirmPassword){
      msg.textContent = 'Please fill all required fields.';
      return;
    }
    if(!validEmail(email)){
      msg.textContent = 'Please enter a valid email address.';
      return;
    }
    if(password.length < 6){
      msg.textContent = 'Password must be at least 6 characters.';
      return;
    }
    if(password !== confirmPassword){
      msg.textContent = 'Passwords do not match.';
      return;
    }

    const users = getUsers();
    if(users.some(u => u.email === email)){
      msg.textContent = 'An account with that email already exists. Try logging in.';
      return;
    }

    // Save user (note: password is stored in plain text for demo only)
    users.push({name, email, password, createdAt: Date.now()});
    saveUsers(users);

    msg.textContent = 'Account created. Redirecting to login...';
    // Redirect after short delay so user sees message
    setTimeout(()=> location.href = 'login.html', 900);
  });
})();
