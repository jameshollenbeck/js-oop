/**
 * Welcome to the Jungle! This point we hook into our UI!
 *
 */
(function()
 {

    function redraw()
    {
        /*Every click should cause a re-draw of the cache.*/
        document.getElementById('stackElements').innerHTML = '';
        if(!cache.getCurrentSize())
        {
            
            document.getElementById('stackElements').innerHTML = '<li class="plan-feature">Stack Empty</li>';
        }
        else
        {
            var cacheItems = cache.getCacheItems();
            for(var key in cacheItems)
            {
                var li = document.createElement('li');
                li.setAttribute('class', 'plan-feature');
                li.setAttribute('id', 'cacheitem-' + key);
                li.innerHTML = 'Key:' + cacheItems[key].key + ' Value: ' + cacheItems[key].value + ' <br />Last Accessed: ' + cacheItems[key].lastAccessed;
                document.getElementById('stackElements').appendChild(li);
            }
        }

        /*Update cache stats*/
        var currentSize = (undefined == cache.getCurrentSize() || !cache.getCurrentSize())? 0 : cache.getCurrentSize();
        var maxSize     = (undefined == cache.getMaxSize() || !cache.getMaxSize())? 0 : cache.getMaxSize();
        
        document.getElementById('stackSize').innerHTML      = currentSize;
        document.getElementById('stackSizeMax').innerHTML   = maxSize;

    }

    function highliteCacheHit(elem, styleInformation)
    {
        if(elem){ elem.setAttribute('style', styleInformation); }
    }
    /**
     * Create a new list of all the buttons on the form. Each button has a list of the ID's of the
     * elements that contain the values needed for cache interaction.
     *
     */
    var buttonIdList = new Object();
    buttonIdList['btnCreateCache']      = ['createCacheSize', 'cacheEvictionStrategy'];
    buttonIdList['btnNewCacheItem']     = ['newCacheItemKey', 'newCacheItemValue'];
    buttonIdList['btnFindCacheItem']    = ['findCacheItemKey'];
    buttonIdList['btnUpdateCacheItem']  = ['updateCacheItemKey', 'updateCacheItemValue'];
    buttonIdList['btnDestroyCacheItem'] = ['destroyCacheItemKey'];
    buttonIdList['btnCacheItemExists']  = ['cacheItemExistsKey'];

    /**
     * For every button in the above list - let's
     * attach an onclick handler.
     *
     */
    for(var key in buttonIdList)
    {
        $elem = document.getElementById(key);
        if($elem)
        {
            $elem.onclick=function()
                          {
                            /*Take the button ID, hunt down the values attached to that click and then handle cache interaction*/
                            var id = this.getAttribute('id');
                            
                            switch (id) 
                            {
                                case 'btnCreateCache':
                                    var cacheSize           = document.getElementById(buttonIdList[id][0]).value;
                                    var valueList           = document.getElementById(buttonIdList[id][1]);
                                    var evictionStrategy    = valueList.options[valueList.selectedIndex].text;
                                    
                                    document.getElementById('message').innerHTML = '';
                                    document.getElementById('error').innerHTML = '';
                                    document.getElementById('evictionStrategy').innerHTML = evictionStrategy;
                                    
                                    cache.createCache(cacheSize, evictionStrategy);

                                    redraw();

                                    break;

                                case 'btnNewCacheItem':
                                    var key = document.getElementById(buttonIdList[id][0]).value;
                                    var value = document.getElementById(buttonIdList[id][1]).value;
                                    
                                    cache.create(key, value);

                                    redraw();

                                    break;

                                case 'btnFindCacheItem':
                                    var key = document.getElementById(buttonIdList[id][0]).value;
    
                                    redraw();

                                    var cacheItem = document.getElementById('cacheitem-' + key);
                                    highliteCacheHit(cacheItem, excessStyleObj.cache_styles[0].style);

                                    try
                                    {
                                        var value = cache.read(key);
                                        if(value)
                                        {
                                            CacheNotificationManager.notifyAction('Found Cache Value: ' + value + ' From Key: ' + key, 2);
                                        }
                                        else
                                        {
                                            CacheNotificationManager.notifyAction('Could Not Find Cache Item From Key: ' + key + ' Returned: ' + value, 2);
                                        }
                                    }
                                    catch(err)
                                    {
                                        CacheNotificationManager.notifyAction(err, 1);
                                    }

                                    break;

                                case 'btnUpdateCacheItem':
                                    var key = document.getElementById(buttonIdList[id][0]).value;
                                    var value = document.getElementById(buttonIdList[id][1]).value;
                                    
                                    cache.update(key, value);

                                    redraw();

                                    break;

                                case 'btnDestroyCacheItem':
                                    var key = document.getElementById(buttonIdList[id][0]).value;
                                    
                                    cache.destroy(key);

                                    redraw();

                                    break;

                                case 'btnCacheItemExists':
                                    var key = document.getElementById(buttonIdList[id][0]).value;
                                    
                                    var exists = cache.exists(key);
                                    
                                    CacheNotificationManager.notifyAction('Cache Item For Key: ' + key + ' Exists: ' + exists, 2);
                                    break;
                                default:
                                    alert("Stop That, David.");
                                    break;

                            }
                                                      
                            /*Prevent form submission*/
                            return false;
            }
        }
                     
    }
 }
)();