let startTime = new Date().getTime();
let redirecttime = 5000;
let redirect = setTimeout(() => {
  window.location.replace("http://storytelling.jorislodewijks.nl");
}, redirecttime);

let second = setInterval(() => {
  document.getElementById("second").innerHTML =
    Math.floor((redirecttime + startTime - new Date().getTime()) / 1000) + 1;
}, 1000);
