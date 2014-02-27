/**
 * Simple Cache object.
 *
 * @param key - The key of the object
 * @param value - The value to store
 * 
 */
function CacheItem(key, value)
{
    this.key            = key;
    this.value          = value;
    this.lastAccessed   = new Date().getTime();
}