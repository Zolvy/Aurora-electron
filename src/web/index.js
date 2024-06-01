function handleLogin() {
localStorage.setItem('SetupComplete', '1');
window.location.href = '/home';
}

const complete = localStorage.getItem('SetupComplete');
if (complete === '1') {
    console.log('Setup Is Complete');
    if (window.location.pathname !== '/home') {
        window.location.replace('/home');
    }
} else {
    console.log('Setup Is Not Complete');
    if (window.location.pathname !== '/') {
        window.location.replace('/');
    }
}
