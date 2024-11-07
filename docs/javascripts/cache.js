function getCache(key) {
    try {
        let cache = localStorage.getItem(key);
        return cache ? JSON.parse(cache) : {};
    } catch (error) {
        console.error(`Error getting cache for key "${key}":`, error);
        return {};
    }
}

function setCache(key, value) {
    try {
        localStorage.setItem(key, JSON.stringify(value));
    } catch (error) {
        console.error(`Error setting cache for key "${key}":`, error);
    }
}