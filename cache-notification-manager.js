        /*Simple Global Logger.
        *
        * Cache Notification Manager supplies an easy to use interface for routing
        * messages to certain locations on the screen (or console if need be). By
        * supplying a message and message level.
        *
        * @param boolean logMode - True will allow messages to continue to persist (creating a top-down message system)
        *                          False will only show the most recent message provided.
        */
        function CacheNotificationManager(logMode)
        {
            this.logMode = (undefined == logMode)? false : logMode;
        }
        CacheNotificationManager.prototype.setLogMode  = function(logMode)
                                                           {
                                                                this.logMode = logMode;
                                                           };
        CacheNotificationManager.prototype.notifyAction = function(message, level, cacheItem)
                                                          {
                                                                var $notificationContainer = null;

                                                                switch (level) {
                                                                    case 1:
                                                                        $notificationContainer = document.getElementById('error');
                                                                        break;
                                                                    case 2:
                                                                        $notificationContainer = document.getElementById('message');
                                                                        break;
                                                                    case 3:
                                                                        //$notificationContainer = document.getElementById('cacheitem-');
                                                                        break;
                                                                    default:
                                                                        throw  new Error('Undefined message level: ' + level + '\n');
                                                                }
                                                                
                                                                try
                                                                {
                                                                    if (!$notificationContainer) 
                                                                    {
                                                                        throw new Error('Could not locate container to send notifications.');
                                                                    }
                                                                }
                                                                catch(err){
                                                                    alert(err);
                                                                }
                                                                
                                                                if (this.logMode) {
                                                                    var $notification = document.createElement('span');
                                                                    $notification.innerHTML = '-----' + (new Date()).toString() + '------ ' + message;
                                                                    
                                                                    $notificationContainer.appendChild($notification);
                                                                    $notificationContainer.appendChild(document.createElement('br'));
                                                                }
                                                                else
                                                                {
                                                                    $notificationContainer.innerHTML = '-----' + (new Date()).toString() + '------ ' + message + '<br />';
                                                                }
                                                           };
                                                           
    CacheNotificationManager = new CacheNotificationManager(IS_LOGGED);