const { invoke } = window.__TAURI__.tauri;

window.addEventListener(`contextmenu`, (e) => {
    e.preventDefault();
});

const buttons = document.querySelectorAll('.server');
buttons.forEach(sub => sub.addEventListener('click', event => {
    window.location.replace(sub.getAttribute("url"))
}));

particlesJS.load('particles', 'assets/particles.json', function() {
    console.log('callback - particles.js config loaded');
});

let stats = []

async function connect() {
    function heartbeat() {
        clearTimeout(this.pingTimeout);

        this.pingTimeout = setTimeout(() => {
            this.terminate();
        }, 30000 + 1000);
    }

    const ws = new WebSocket(`ws://localhost:3000`);

    console.log(ws)

    ws.onopen = function() {
        let status = document.querySelector('#status')

        if (status) {
            status.textContent = "Connected"
            status.style.color = "green"
        }

        console.log("connected")
    }

    ws.onmessage = function(e) {
        stats = JSON.parse(e.data);
    };

    ws.onclose = function() {
        clearTimeout(this.pingTimeout);

        let status = document.querySelector('#status')

        if (status) {
            status.textContent = "Connecting.."
            status.style.color = "red"
        }

        return setTimeout(connect, 2000);
    };

    ws.onerror = function(error) {
        try {
            ws.close()
        } catch {}
    };
};

connect()

function updateStats(div) {
    let id = div.getAttribute("id")
    let userCount = div.querySelector("h3")

    userCount.textContent = stats[id] || "0/0"
}

setInterval(function() {
    buttons.forEach(function(btn) {
        let type = btn.getAttribute("type")
        if (type == "status") {
            updateStats(btn)
        }
    })
}, 1000)