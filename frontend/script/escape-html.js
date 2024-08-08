
/**
 * Funktion escapeHtml, 
 * die einen unsicheren String als Eingabe nimmt und ihn in einen sicheren HTML-String umwandelt.
 * Funktion sucht nacht /<pattern>/ und g als Global Flag(somit hört er nicht beim ersten finden auf)--https://en.wikipedia.org/wiki/Regular_expression
 * und ersetzt diese mit den folgenden Werten.
**/

function escapeHtml(unsafe) {
    return unsafe
      .replace(/&/g, "&amp;")
      .replace(/</g, "&lt;")
      .replace(/>/g, "&gt;")
      .replace(/"/g, "&quot;")
      .replace(/'/g, "&#039;");
  }