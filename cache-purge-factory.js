/**
 * Cache purge factory. At this point, you have a way
 * to plug in other cache purge objects to use in the system.
 * As long as the cache purge has a purge function - we'll
 * roll with it!
 *
 * @param purgeType - The algorithm to use
 *                      lru - least recently used
 *                      random - random element chosen
 *
 */
function CachePurgeFactory(purgeType){
                                var _CachePurge = null;
                                try 
                                {
                                    switch(true)
                                    {
                                        case('lru' == purgeType):
                                            _CachePurge = new CachePurgeLRU(CacheNotificationManager);
                                            break;
                                        case('random' == purgeType):
                                            _CachePurge = new CachePurgeRandom(CacheNotificationManager);
                                            break;
                                        default:
                                            throw 'Unknown cache purge algorithm: ' + purgeType;
                                            break;
                                    }
                                    return _CachePurge;
                                }
                                catch(err)
                                {
                                    CacheNotificationManager.notifyAction(err, 1);
                                }
                                return null;
                            }