let startTime = new Date().getTime();
let redirecttime = 5000;
let redirect = setTimeout(() => {
  gotoStudy();
}, redirecttime);

let second = setInterval(() => {
  document.getElementById("second").innerHTML =
    Math.floor((redirecttime + startTime - new Date().getTime()) / 1000) + 1;
}, 1000);

const gotoStudy = () => {
  let url = "http://storytelling.jorislodewijks.nl";
  // let url = "http://localhost:8080/";
  url += "?token=" + (parseInt(new Date().getTime()) + 10 * 1000);
  url += "&id=" + DF.participant.id;

  ///////////////////////////////////////////////////////
  // TO SWITCH TO TEST GROUP INSTEAD OF CONTROL GROUP.
  // url += "&sgstv";
  ///////////////////////////////////////////////////////

  window.location.replace(url);
};
