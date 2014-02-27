        /**
         *Let's do some Duck Typing. Since JS has no
         *    concept of Interfaces - let's do the following:
         *       If it walks like a duck and quacks like a duck - it's a duck!
         *       In this case, as long as we can make a cetain cache-purge algorithm purge,
         *       it is, for all intensive purposes - a cache purger
         *       
         * @see function CacheNotificationManager
         * 
         * @param cacheNotificationManager - Global Notification Manager used to route messages to
         *                                      the screen.
         *  
        */
        
        /**
         * CachePurgeLRU - Purge a cache item based on the least recent used principle.
         *                  If the next insert flows out of bounds for the cache -
         *                  find the least recent used item and evict it before adding
         *                  the new item
         */
        function CachePurgeLRU(cnm){ this.cacheNotificationManager = cnm; }
        
        CachePurgeLRU.prototype.setCache = function(cache)
                                           {
                                                this.cache = cache;
                                           };
        /**
         * Cache Purgers are also based off of the observer pattern.
         * When a cache item needs to be purged - alert the cache purger
         * and then have the purger take responisbility to call the nescessary
         * functions on the cache to remove the proper item.
         */
        CachePurgeLRU.prototype.purge = function()
                                        {
                                            try 
                                            {
                                                if (!this.cache.currentCacheSize) 
                                                {
                                                    throw  new Error("Attempted to purge empty cache.");
                                                }
                                            
                                                var cacheArray = new Array();
    
                                                for(var key in this.cache.cacheItems)
                                                {
                                                    cacheArray.push(this.cache.cacheItems[key]);
                                                }

                                                cacheArray = cacheArray.sort(function(a, b) 
                                                { 
                                                    return a.lastAccessed - b.lastAccessed;
                                                });
                                                
                                                var itemToGo = cacheArray[0];
                                                this.cache.destroy(itemToGo.key);
                                                
                                                this.cacheNotificationManager.notifyAction('Purging Cache (' + this.algorithmType() + ') Item With Key: ' + itemToGo.key, 2); 
                                            }
                                            catch(err) 
                                            {
                                                this.cacheNotificationManager.notifyAction(err, 1);
                                            }

                                        };
                                        
        CachePurgeLRU.prototype.algorithmType  = function(){ return 'Cache Purge Algorithm: LRU'; }
   
        /**
         * Second module-system for cache purge - this time based on the random
         * principle system. When a cache is too small for the next item -
         * purge a random cache item before adding the new item.
         */
        function CachePurgeRandom(cnm){ this.cacheNotificationManager = cnm; }
        
        CachePurgeRandom.prototype.setCache = function(cache)
                                              {
                                                    this.cache = cache;
                                              };
        CachePurgeRandom.prototype.purge = function()
                                           {
                                            try {
                        
                                                if (!this.cache.currentCacheSize) {
                                                    throw  new Error("Attempted to purge empty cache.");
                                                }
                                                
                                                var cacheArray = new Array();

                                                for (var key in this.cache.cacheItems){
                                                    cacheArray.push(this.cache.cacheItems[key]);
                                                }
                                                
                                                var itemToChoose = Math.round(Math.random(0, (cacheArray.length - 1)));
                                                var itemToGo     = cacheArray[itemToChoose];
                                                
                                                
                                                this.cache.destroy(itemToGo.key);
                                                this.cacheNotificationManager.notifyAction('Purging Cache (' + this.algorithmType() + ') Item With Key: ' + itemToGo.key, 2);
                                            }
                                            catch(err) {
                                                throw err;
                                            }
                                                
                                                
                                           };
        CachePurgeRandom.prototype.algorithmType  = function(){ return 'Cache Purge Algorithm: Random'; }