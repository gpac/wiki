function getCache(key) {
    let cache = localStorage.getItem(key);
    return cache ? JSON.parse(cache) : {};
}

function setCache(key, value) {
    localStorage.setItem(key, JSON.stringify(value));
}