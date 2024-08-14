document.getElementById('delete-jwt').addEventListener('click', () => {
    document.cookie = 'jwt=; max-age=0; path=/';
    window.location.href = '/';
  });