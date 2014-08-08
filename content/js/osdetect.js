function os() {
  var ua = navigator.userAgent.toLowerCase();
  console.log("user agent "+ua);
  var win = ua.indexOf("windows");
  var mac = ua.indexOf("macintosh");
  console.log("test "+win+" "+mac);
  if(win>-1){
    $('.mac').remove();
    $('.sep').remove();
  }
  if(mac>-1){
    $('.win').remove();
    $('.sep').remove();
  }
}