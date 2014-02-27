/*Turn on/off the logging system*/
var logSetter = document.getElementById('logStatus');
logSetter.onclick = function(){
    IS_LOGGED = (this.checked)? true : false;
    CacheNotificationManager.setLogMode(IS_LOGGED);
};

//Make use of the global message handler
window.onerror = function(msg, uri, line)
                 {
                    if(msg.indexOf('TypeError') != -1){
                        msg = 'Cache Error: Did you remember to create the cache?';
                    }
                    CacheNotificationManager.notifyAction(msg, 1);
                    return true;
                 }