window.onload = () => {
    const isLoggedIn = document.cookie; 
    const isOnHomePage = window.location.pathname === '/';
    const isOnEchoPage = window.location.pathname === '/Echoinput.html';
    
    if (!isLoggedIn && !isOnHomePage) {
        location.href = '/';
    }
    else if (isLoggedIn && isOnHomePage) {
        location.href = '/Echoinput.html';
    }
}
