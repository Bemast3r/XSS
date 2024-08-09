window.onload = () => {
    const isLoggedIn = document.cookie; 
    const isOnHomePage = window.location.pathname === '/';
    const isOnEchoPage = window.location.pathname === '/Echoinput.html';
    if (!isLoggedIn && !isOnHomePage) {
        location.href = '/';

    }
    else if (isLoggedIn && isOnHomePage) {
        location.href = '/Echoinput.html';
        if (Date.now() >= decode.exp * 1000) {
            window.location.href = "/";
            return null;
        }
        location.href = isOnEchoPage;
    }
}

document.getElementById('delete-jwt').addEventListener('click', () => {
    document.cookie = 'jwt=; max-age=0; path=/';
    window.location.href = '/';
  });