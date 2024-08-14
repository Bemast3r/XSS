    // Event-Listener für das Klick-Ereignis auf den Abmelden-Button
    document.getElementById('delete-jwt').addEventListener('click', () => {
        // Das JWT-Cookie wird gelöscht
        document.cookie = 'jwt=; max-age=0; path=/';
        // Umleitung zur Startseite
        window.location.href = '/';
      });