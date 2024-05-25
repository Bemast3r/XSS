window.onload = () => {
    if(!document.cookie){
        location.href = '/';
    } else{
        location.href = '/Echoinput.html';
    }
}