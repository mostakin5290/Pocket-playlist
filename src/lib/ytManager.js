const YT_API = 'https://www.youtube.com/iframe_api';

let loadPromise = null;

function loadScript() {
    if (loadPromise) return loadPromise;
    loadPromise = new Promise((resolve, reject) => {
        if (window.YT && window.YT.Player) return resolve(window.YT);
        const id = 'yt-api';
        if (!document.getElementById(id)) {
            const s = document.createElement('script');
            s.id = id;
            s.src = YT_API;
            s.async = true;
            s.onerror = (e) => reject(e);
            document.body.appendChild(s);
        }

        const t = setInterval(() => {
            if (window.YT && window.YT.Player) {
                clearInterval(t);
                resolve(window.YT);
            }
        }, 100);
    });
    return loadPromise;
}

export async function ensureYT() {
    return loadScript();
}

export async function createPlayer(containerId, options = {}) {
    const YT = await ensureYT();
    const cfg = Object.assign({}, options, {
        playerVars: Object.assign({}, options.playerVars || {}, { origin: window.location.origin })
    });
    return new YT.Player(containerId, cfg);
}

export default { ensureYT, createPlayer };
