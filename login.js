/* login.js
   Logs user in by checking email & password against localStorage.
*/

(function(){
  const form = document.getElementById('loginForm');
  const msg = document.getElementById('loginMsg');

  function getUsers(){
    try{ return JSON.parse(localStorage.getItem('hs_users')||'[]'); } catch(e){ return []; }
  }

  form.addEventListener('submit', function(e){
    e.preventDefault();
    msg.textContent = '';

    const email = document.getElementById('email').value.trim().toLowerCase();
    const password = document.getElementById('password').value;

    if(!email || !password){
      msg.textContent = 'Enter email and password.';
      return;
    }

    const users = getUsers();
    const found = users.find(u => u.email === email && u.password === password);
    if(!found){
      msg.textContent = 'Invalid credentials. Please try again.';
      return;
    }

    // Save session
    localStorage.setItem('hs_session', JSON.stringify({email: found.email, name: found.name, loggedAt: Date.now()}));
    msg.textContent = 'Login successful. Redirecting...';

    setTimeout(()=> location.href = 'dashboard.html', 600);
  });
})();
