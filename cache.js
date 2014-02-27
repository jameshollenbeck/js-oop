/**
 * The beast from the east! This is our cache sytem.
 * At this point we'll create an emtpy cach object.
 *
 */
function Cache(){};

/**
 * Every time we create a new cache - we use a size and eviction strategy.
 *
 * @param int maxCacheSize - How many elements can be in the cache at any time
 * @param string evictionStrategy - the text representation of what eviction strategy
 *                                    to use while purging the cache.
 *
 */
Cache.prototype.createCache = function(maxCacheSize, evictionStrategy)
                                {
                                    this.cacheItems                 = {};
                                    this.currentCacheSize           = 0;
                                    this.maxCacheSize               = parseInt(maxCacheSize);
                                    this.cacheNotificationManager   = CacheNotificationManager;
                                    
                                    try 
                                    {
                                        this.cachePurgeStrategy = CachePurgeFactory(evictionStrategy);
                                    } 
                                    catch(err) 
                                    {
                                        this.cacheNotificationManager.notifyAction(err, 1);
                                    }
                                    
                                    this.cachePurgeStrategy.setCache(this);
                                    
                                    
                                };
/*
*   Function to add a new item to the cache.
*   If the item exists - update, otherwise, add.
*
*   @param mixed key - The key of the item
*   @param midex value - The value to add
*   @return
*/
Cache.prototype.create     = function(key, value)
                             {
                                //Start easy - work up:
                                
                                /*Check if key exists:
                                 * True - remove old and re-add
                                 * False - check size of array
                                 *          - If cache is maxed out:purge
                                 *          - otherwise add item
                                 */
                                try 
                                {
                                    if ((!key) || (!value)) 
                                    {
                                        throw new Error("Key/Value pair must contain non-null values");
                                    }
                                    
                                    if(!this.getMaxSize())
                                    {
                                        throw new Error("No cache space allocated. Did you create a cache with a non-0 size?");
                                    }
                                    
                                    if(this.exists(key))
                                    {
                                        this.update(key, value);
                                        return;
                                    }
                                    else
                                    {
                                        if(this.isMaxed())
                                        {
                                            try
                                            {
                                                this.cachePurgeStrategy.purge();
                                            }
                                            catch(err)
                                            {
                                                throw err;
                                            }
                                        }
                                    }
                                    
                                    this.add(key, value);
                                    this.increaseCacheCount();
                                }
                                catch(err)
                                {
                                    this.cacheNotificationManager.notifyAction(err, 1);
                                }

                             };
/*
*   Function to add a new item to the cache.
*   If the item exists - update, otherwise, add.
*
*   @param mixed key - The key of the item
*   @param midex value - The value to add
*/
Cache.prototype.add        = function(key, value)
                             {
                                this.cacheItems[key] = new CacheItem(key, value);
                                this.cacheNotificationManager.notifyAction('Adding Cache Item Key: ' + key + ' With Value: ' + value, 2);
                             };
/**
 *
 * Read is a mutator function to retrieve a cache item
 * as well as update the last accessed time.
 * Realalisticall, getValue would be private and contain the
 * heavy lifting to get the value and mutate the last accessed time.
 *
 * @param mixed key - the key of the cache item to retrieve.
 *
 * @return mixed value - Could be null of key is not found or value is null
 *
 */
Cache.prototype.read       = function(key)
                             {
                                try
                                {
                                    if(undefined == key || null == key || '' == key)
                                    {
                                        throw new Error('No key supplied for cache read.');
                                    }
                                    return this.getValue(key);
                                }
                                catch(err)
                                {
                                   throw err;
                                }
                                
                             };
/**
 * If we have a cache-hit with a key, we will update
 * the value of the key and then update the last access time.
 *
 * @param mixed key - The key to look up
 * @param mixed value - the value to update the key to
 *
 */
Cache.prototype.update     = function(key, value)
                             {
                                try
                                {
                                    if (this.exists(key)) 
                                    {
                                       var cacheElement = this.cacheItems[key];
                                       cacheElement.value =  value;
                                       cacheElement.lastAccessed = new Date().getTime();
                                       
                                       this.cacheNotificationManager.notifyAction('Update Cache Item With Key: ' + key + ' To Value: ' + value, 2);
                                    }
                                    else
                                    {
                                       throw  new Error('Attempted update of non-existent key: ' + key);
                                    }
                                }
                                catch(err)
                                {
                                    throw err;
                                }
                             };
/**
 * This is the heave lifting function to remove
 * a cache item from cache if the key exists.
 *
 * @param mixed key - The key of the item to find and remove.
 */
Cache.prototype.destroy    = function(key)
                             {
                                try
                                {
                                    if(!this.getCurrentSize())
                                    {
                                        throw  new Error('Attempted destroy on empty cache using Key: ' + key);
                                    }
                                    if (!key) 
                                    {
                                        throw  new Error('Attempted removal using empty key\n');
                                    }
                                    
                                    if(this.exists(key))
                                    {
                                        this.cacheNotificationManager.notifyAction('Removing Cache Item With Key: ' + key, 2);
                                        delete this.cacheItems[key];
                                        this.decreaseCacheCount();
                                    }
                                    else
                                    {
                                        throw  new Error('Attempted removal of non-existent item with key: ' + key + '\n');
                                    }
                                }
                                catch(err) 
                                {
                                    throw err
                                }
                             };
/**
 * Function to determine if a key exists in the cache system.
 * Very important to make sure to use hasOwnProperty - incase someone
 * ever prototypes this off of another object or prototypes in other values: we don't want
 * to iterate of non-cache items.
 *
 * @param mixed key - The key to lookup on.
 * @return boolean true if key exists, false otherwise.
 */
Cache.prototype.exists     = function(key)
                             {
                                if(this.getCurrentSize() && this.cacheItems.hasOwnProperty(key))
                                {
                                    return true;
                                }
                                return false;
                             };
/**
 * Function used to determine if the cache is maxed out in size.
 *
 * @return boolean true if maxed out, false otherwise.
 */
Cache.prototype.isMaxed    = function()
                             {
                                return (this.getCurrentSize() >= this.maxCacheSize);
                             }
/**
 * Function used to decrease the count of cache when we remove elements.
 *
 */
Cache.prototype.decreaseCacheCount = function()
                                     {
                                         this.currentCacheSize--;
                                     };
/**
 * Function used to increase the count of cache when we add elemets.
 *
 */
Cache.prototype.increaseCacheCount = function()
                                     {
                                         this.currentCacheSize++;
                                     };
/**
 * Function used to get the value from cache attached to a given key.
 *
 * @param mixed key - the key used for lookup.
 * @return mixed value if key exists, null otherwise.
 *
 */
Cache.prototype.getValue           = function(key)
                                     {
                                        var value = null;
                                        try
                                        {
                                            if (this.exists(key)) 
                                            {
                                                value = this.cacheItems[key].value;
                                                this.cacheItems[key].lastAccessed = new Date().getTime();
                                            }
                                            else
                                            {
                                                if(!this.getCurrentSize())
                                                { 
                                                    throw  new Error('Attempted to read empty cache.');
                                                }
                                            }
                                        }
                                        catch(err)
                                        {
                                            this.cacheNotificationManager.notifyAction(err, 1);
                                        }
                                        
                                        return value;
                                     };
/**
 * Function used to print out a simple
 * unordered list of the current cache.
 *
 */
Cache.prototype.toString           = function()
                                     {
                                        var ul = '<ul>';
                                        for (var key in this.cacheItems) 
                                        {
                                            var currentItem = this.cacheItems[key];
                                            
                                            ul += '<li>Cache Data ------ Cache Key: ' + key + ' Cache Value: ' + currentItem.value + '</li>';
                                        }
                                        
                                        ul += '</ul>';
                                        return ul;
                                     };
/**
 * Getter function for the current cache size.
 *
 * @return int The current cache size. 
 */
Cache.prototype.getCurrentSize     = function()
                                     {
                                        return this.currentCacheSize;
                                     };
/**
 * Getter function for the current cache max size.
 *
 * @return int The current cache max size. 
 */                               
Cache.prototype.getMaxSize         = function()
                                     {
                                        return this.maxCacheSize;
                                     };
/**
 * Getter function for the current cache item set.
 *
 * @return Object cash items. 
 */
Cache.prototype.getCacheItems      = function()
                                     {
                                         return this.cacheItems;
                                     };
                                     
/**
 * The last thing we will do is create a new Cache and
 * then wait for the final instantiation.
 *
 */
var cache = new Cache();