(function() {
    const output = document.getElementById('output');
    const cmdInput = document.getElementById('cmd-input');
    const suggestions = document.getElementById('suggestions');
    const user = 'visitor';
    const host = 'coldmarbtight';

    const commands = {
        help: {
            desc: 'Affiche toutes les commandes disponibles',
            fn: function() {
                let out = '\n<span class="highlight">Commandes disponibles :</span>\n\n';
                for (const [name, cmd] of Object.entries(commands)) {
                    out += `  <span class="highlight">${name.padEnd(12)}</span> <span class="dim">—</span> ${cmd.desc}\n`;
                }
                return out;
            }
        },
        about: {
            desc: 'À propos',
            fn: function() {
                return `
<span class="highlight">À propos de moi</span>

Développeur fullstack passionné par la création d'expériences web innovantes.
Spécialisé en architectures modernes et en conception d'interfaces performantes.

<span class="dim">Location :</span> France
<span class="dim">Focus :</span> Web, APIs, UX/UI, DevOps
<span class="dim">Philosophie :</span> Less is more — code minimal, impact maximal.
`;
            }
        },
        projects: {
            desc: 'Projets récents',
            fn: function() {
                return `
<span class="highlight">Projets</span>

  <span class="highlight">neo/engine</span>       Moteur de rendu 3D WebGL — temps réel, zéro dépendance
  <span class="highlight">flux/api</span>         Gateway API ultra-rapide en Go — < 1ms de latence
  <span class="highlight">void/chat</span>        Messagerie chiffrée P2P — WebRTC + E2EE
  <span class="highlight">dash/ops</span>         Dashboard DevOps — monitoring clusters Kubernetes
  <span class="highlight">kyro/cli</span>         CLI tool pour scaffolding de projets — Node.js

<span class="dim">Plus de détails ? Tapez "project <nom>"</span>
`;
            }
        },
        'project neo/engine': {
            desc: '',
            fn: function() {
                return `
<span class="highlight">neo/engine</span>

Moteur de rendu 3D temps réel utilisant WebGL 2.0.
- Rendu PBR (Physically Based Rendering)
- Shadows mapping cascadé
- Post-processing stack (bloom, SSAO, motion blur)
- Scene graph optimisé
- Zéro dépendance externe

<span class="dim">Stack :</span> TypeScript, WebGL 2.0, GLSL
<span class="dim">Repo :</span> <a href="https://coldmarbtight.com/neo-engine" target="_blank">coldmarbtight.com/neo-engine</a>
`;
            }
        },
        'project flux/api': {
            desc: '',
            fn: function() {
                return `
<span class="highlight">flux/api</span>

Gateway API écrite en Go avec routage dynamique.
- Latence < 1ms (p99)
- Rate limiting distribué
- Circuit breaker intégré
- Hot reload de configuration
- Support gRPC + REST

<span class="dim">Stack :</span> Go, Redis, gRPC, Docker
<span class="dim">Repo :</span> <a href="https://coldmarbtight.com/flux-api" target="_blank">coldmarbtight.com/flux-api</a>
`;
            }
        },
        skills: {
            desc: 'Compétences techniques',
            fn: function() {
                return `
<span class="highlight">Compétences</span>

<span class="highlight">Langages</span>
  TypeScript    ████████████████    expert
  Go            ██████████████      avancé
  Rust          ██████████          intermédiaire
  Python        ███████████████     avancé
  SQL           ██████████████      avancé

<span class="highlight">Frontend</span>
  React / Next.js    ████████████████    expert
  Vue / Nuxt         ████████████        avancé
  Tailwind / CSS     ██████████████      avancé

<span class="highlight">Backend / Infra</span>
  Node.js / Bun      ███████████████     avancé
  Docker / K8s       ██████████████      avancé
  AWS / GCP          ████████████        avancé
  CI/CD / Terraform  ████████████        avancé
`;
            }
        },
        contact: {
            desc: 'Me contacter',
            fn: function() {
                return `
<span class="highlight">Contact</span>

  <span class="dim">Email  :</span> <a href="mailto:hello@coldmarbtight.com">hello@coldmarbtight.com</a>
  <span class="dim">Web    :</span> <a href="https://coldmarbtight.com" target="_blank">coldmarbtight.com</a>
  <span class="dim">GitHub :</span> <a href="https://github.com/M9n2vs0zb2bw7" target="_blank">github.com/M9n2vs0zb2bw7</a>
  <span class="dim">X      :</span> <a href="https://x.com/coldmarbtight" target="_blank">@coldmarbtight</a>

<span class="dim">Tapez "exit" ou "bye" pour fermer cette session.</span>
`;
            }
        },
        clear: {
            desc: 'Effacer le terminal',
            fn: function() {
                output.innerHTML = '';
                return '';
            }
        },
        cls: {
            desc: 'Effacer le terminal (alias)',
            fn: function() {
                output.innerHTML = '';
                return '';
            }
        },
        banner: {
            desc: 'Afficher la bannière',
            fn: function() {
                return bannerText;
            }
        },
        exit: {
            desc: 'Quitter',
            fn: function() {
                return '\n<span class="dim">Session terminée. Rafraîchissez la page pour recommencer.</span>\n';
            }
        },
        bye: {
            desc: 'Quitter (alias)',
            fn: function() {
                return '\n<span class="dim">Session terminée. Rafraîchissez la page pour recommencer.</span>\n';
            }
        },
        date: {
            desc: 'Affiche la date actuelle',
            fn: function() {
                return '\n' + new Date().toString() + '\n';
            }
        },
        whoami: {
            desc: 'Qui êtes-vous ?',
            fn: function() {
                return '\n' + user + '@' + host + '\n';
            }
        },
        echo: {
            desc: 'Affiche le texte donné',
            fn: function(args) {
                return '\n' + (args.join(' ') || '') + '\n';
            }
        },
        sudo: {
            desc: 'sudo make me a sandwich',
            fn: function() {
                return '\n<span class="error">Permission denied.</span> (mais tu peux taper "help")\n';
            }
        },
        neofetch: {
            desc: 'Infos système (factices)',
            fn: function() {
                return `
     <span class="highlight">.-/+oossssoo+/-.</span>               <span class="highlight">visitor</span>@<span class="highlight">coldmarbtight</span>
     <span class="highlight">.:+ssssssssssssssssss+:.</span>           <span class="dim">-----------------------</span>
   <span class="highlight">-+ssssssssssssssssssssssssso:</span>        <span class="dim">OS :</span> NixOS ∞ (unstable)
  <span class="highlight">/sssssssssssssssssssssssssssss+</span>       <span class="dim">Kernel :</span> zen-kernel
 <span class="highlight">+sssssssssssssssssssssssssssssss/</span>      <span class="dim">Shell :</span> zsh + starship
<span class="highlight">.sssssssssssssssssssssssssssssssss+</span>     <span class="dim">Editor :</span> Neovim (btw)
<span class="highlight">-sssssssssssssssssssssssssssssssss-</span>    <span class="dim">Uptime :</span> 420 jours
 <span class="highlight">/sssssssssssssssssoooooooosssssssss</span>    <span class="dim">Packages :</span> ∞
  <span class="highlight">+sssssssssssoooooooooooooooossssss</span>    
   <span class="highlight">.osssssooooooooooooooooooooossss</span>
     <span class="highlight">./oooooooooooooooooooooooosss</span>
       <span class="highlight">-+ooooooooooooooooooooo+:</span>
         <span class="highlight">.-:/++oooo++/:-.</span>
`;
            }
        },
        cowsay: {
            desc: 'Une vache qui parle',
            fn: function(args) {
                const msg = args.join(' ') || 'moo !';
                const line = '-'.repeat(msg.length + 2);
                return `
 <span class="dim">${line}</span>
<span class="dim">< ${msg} ></span>
 <span class="dim">${line}</span>
        \\   ^__^
         \\  (oo)\\_______
            (__)\\       )\\/\\
                ||----w |
                ||     ||
`;
            }
        }
    };

    const bannerText = `
<span class="banner">
 ██████  ██████  ██    ██ ██ ████████ ██    ██ ██████  
██      ██    ██ ██    ██ ██    ██    ██    ██ ██   ██ 
██      ██    ██ ██    ██ ██    ██    ██    ██ ██████  
██      ██    ██  ██  ██  ██    ██    ██    ██ ██   ██ 
 ██████  ██████    ████   ██    ██     ██████  ██████  
</span>
<span class="dim">Portfolio Interactif — v1.0.0</span>
<span class="dim">Tapez "help" pour commencer.</span>
`;

    const history = [];
    let historyIndex = -1;

    function addLine(html, cls) {
        if (html === '') return;
        const div = document.createElement('div');
        div.className = 'line ' + (cls || '');
        div.innerHTML = html;
        output.appendChild(div);
    }

    function addPrompt(cmd) {
        const div = document.createElement('div');
        div.className = 'line';
        div.innerHTML = '<span class="prompt">' + user + '@' + host + ':~$</span> <span class="cmd">' + escapeHtml(cmd) + '</span>';
        output.appendChild(div);
    }

    function escapeHtml(str) {
        const d = document.createElement('div');
        d.textContent = str;
        return d.innerHTML;
    }

    function scrollBottom() {
        const term = document.getElementById('terminal');
        term.scrollTop = term.scrollHeight;
    }

    function showSuggestions(input) {
        if (!input) {
            suggestions.textContent = '';
            return;
        }
        const matches = Object.keys(commands).filter(function(c) {
            return c.startsWith(input) && c !== input && commands[c].desc;
        });
        if (matches.length > 0 && matches.length <= 5) {
            suggestions.textContent = matches.join('  |  ');
        } else if (matches.length > 5) {
            suggestions.textContent = matches.slice(0, 5).join('  |  ') + '  ...';
        } else {
            suggestions.textContent = '';
        }
    }

    function execute(raw) {
        const trimmed = raw.trim();
        if (!trimmed) return;

        if (trimmed !== history[history.length - 1]) {
            history.push(trimmed);
        }
        historyIndex = history.length;

        addPrompt(trimmed);

        const parts = trimmed.split(/\s+/);
        const cmdName = parts[0].toLowerCase();
        const args = parts.slice(1);

        let result = '';

        if (trimmed.startsWith('project ')) {
            const key = trimmed.toLowerCase();
            if (commands[key]) {
                result = commands[key].fn(args);
            } else {
                result = '\n<span class="error">Projet inconnu : ' + escapeHtml(trimmed.slice(8)) + '</span>\n<span class="dim">Projets disponibles : neo/engine, flux/api</span>\n';
            }
        } else if (commands[cmdName]) {
            result = commands[cmdName].fn(args);
        } else {
            result = '\n<span class="error">Commande inconnue : ' + escapeHtml(cmdName) + '</span>\n<span class="dim">Tapez "help" pour voir les commandes disponibles.</span>\n';
        }

        addLine(result, 'result');
        suggestions.textContent = '';
        cmdInput.value = '';
        scrollBottom();
    }

    cmdInput.addEventListener('keydown', function(e) {
        if (e.key === 'Enter') {
            e.preventDefault();
            execute(cmdInput.value);
        } else if (e.key === 'ArrowUp') {
            e.preventDefault();
            if (historyIndex > 0) {
                historyIndex--;
                cmdInput.value = history[historyIndex];
            }
        } else if (e.key === 'ArrowDown') {
            e.preventDefault();
            if (historyIndex < history.length - 1) {
                historyIndex++;
                cmdInput.value = history[historyIndex];
            } else {
                historyIndex = history.length;
                cmdInput.value = '';
            }
        } else if (e.key === 'Tab') {
            e.preventDefault();
            const val = cmdInput.value.toLowerCase();
            const matches = Object.keys(commands).filter(function(c) {
                return c.startsWith(val) && commands[c].desc;
            });
            if (matches.length === 1) {
                cmdInput.value = matches[0];
                suggestions.textContent = '';
            }
        }
    });

    cmdInput.addEventListener('input', function() {
        showSuggestions(this.value.toLowerCase());
    });

    document.getElementById('terminal').addEventListener('click', function() {
        cmdInput.focus();
    });

    cmdInput.addEventListener('paste', function() {
        setTimeout(function() {
            const lines = cmdInput.value.split('\n');
            if (lines.length > 1) {
                cmdInput.value = lines[0];
                execute(lines[0]);
            }
        }, 0);
    });

    addLine(bannerText, 'banner');
    cmdInput.focus();

    window.addEventListener('load', function() {
        scrollBottom();
        cmdInput.focus();
    });
})();
