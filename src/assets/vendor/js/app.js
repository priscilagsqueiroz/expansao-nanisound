// Importações
import AOS from 'aos';
AOS.init();

// 🔁 Marquee
function duplicarMarquee() {
    const marqueeWrapper = document.getElementById('marquee');
    if (!marqueeWrapper || !marqueeWrapper.children.length) return;

    const original = marqueeWrapper.children[0];
    const originalHTML = original.outerHTML;
    let contentWidth = marqueeWrapper.scrollWidth;

    while (contentWidth < window.innerWidth * 2) {
        marqueeWrapper.insertAdjacentHTML('beforeend', originalHTML);
        contentWidth = marqueeWrapper.scrollWidth;
    }
}

// Inicialização principal
function init() {
    duplicarMarquee();
    configurarModais();
    configurarContadores();
    configurarCamposFormulario();
    preencherCamposUrl();
    configurarScrollParaHome();
}

// 🎬 Modal logic
function configurarModais() {
    const modalPrincipal = document.getElementById("videoModalPrincipal");
    const videoPrincipalContainer = document.getElementById("meuVideoPrincipal");
    const openModalBtn = document.getElementById("openVideoModal");
    const closeModalBtnPrincipal = document.getElementById("closePrincipalModal");

    const modalSecundario = document.getElementById("videoModalSecundario");
    const videoSecundario = document.getElementById("meuVideoSecundario");
    const videoSourceSecundario = document.getElementById("videoSourceSecundario");
    const closeModalBtnSecundario = document.getElementById("closeSecundarioModal");

    const videoPaths = {
        "video2": "assets/video/1.mp4",
        "video3": "assets/video/2.mp4",
        "video4": "assets/video/3.mp4"
    };

    function fecharModal(modal, video) {
        modal.style.display = "none";
        if (video.tagName === "VIDEO") {
            video.pause();
            video.currentTime = 0;
            video.removeAttribute("src");
            video.load();
        } else {
            video.innerHTML = "";
        }
    }

    function adicionarFechamentoAoClicarFora(modal, video) {
        modal.addEventListener("click", e => {
            if (e.target === modal) fecharModal(modal, video);
        });
    }

    if (modalPrincipal && openModalBtn) {
        openModalBtn.addEventListener("click", () => {
            modalPrincipal.style.display = "flex";
            videoPrincipalContainer.innerHTML = `
                <iframe width="100%" height="405" src="https://www.youtube-nocookie.com/embed/wtcVTflaLTk?autoplay=1"
                    title="YouTube video player" frameborder="0"
                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                    referrerpolicy="strict-origin-when-cross-origin" allowfullscreen>
                </iframe>`;
        });

        closeModalBtnPrincipal?.addEventListener("click", () => fecharModal(modalPrincipal, videoPrincipalContainer));
        adicionarFechamentoAoClicarFora(modalPrincipal, videoPrincipalContainer);
    }

    if (modalSecundario) {
        document.querySelectorAll(".video-thumb").forEach(thumb => {
            thumb.addEventListener("click", function () {
                const key = this.getAttribute("data-video");
                if (videoPaths[key]) {
                    videoSourceSecundario.src = videoPaths[key];
                    videoSecundario.load();
                    videoSecundario.play().catch(err => console.error(err));
                    modalSecundario.style.display = "flex";
                }
            });
        });

        closeModalBtnSecundario?.addEventListener("click", () => fecharModal(modalSecundario, videoSecundario));
        adicionarFechamentoAoClicarFora(modalSecundario, videoSecundario);
    }
}

// 🎯 Contadores
function configurarContadores() {
    function animarContador(id, target, duracao) {
        const el = document.getElementById(id);
        let atual = 0;
        const passo = target / (duracao / 20);

        const intervalo = setInterval(() => {
            atual = Math.min(atual + passo, target);
            el.textContent = formatarNumero(atual);
            if (atual === target) clearInterval(intervalo);
        }, 20);
    }

    function formatarNumero(numero) {
        return Number(numero).toLocaleString('pt-BR', {
            minimumFractionDigits: numero % 1 !== 0 ? 1 : 0,
            maximumFractionDigits: 1,
        });
    }

    const observer = new IntersectionObserver((entries, obs) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const el = entry.target;
                const target = parseFloat(el.getAttribute('data-target'));
                animarContador(el.id, target, 2000);
                obs.unobserve(el);
            }
        });
    }, { threshold: 0.6 });

    document.querySelectorAll('.contador').forEach(el => observer.observe(el));
}

// Scroll suave para seção Home
function configurarScrollParaHome() {
    const scrollToHome = () => {
        const homeSection = document.getElementById("home");
        if (homeSection) {
            homeSection.scrollIntoView({ behavior: "smooth" });
        }
    };

    ["btn-qs", "btn-modelos", "btn-cta"].forEach(id => {
        document.getElementById(id)?.addEventListener("click", scrollToHome);
    });
}

// Countdown e efeito de entrada
document.addEventListener("DOMContentLoaded", function () {
    const timeElement = document.getElementById('time');
    const talkDiv = document.querySelector('.talk');
    if (!timeElement || !talkDiv) return;

    let time = parseInt(timeElement.textContent);

    // Inicializa a talkDiv oculta
    talkDiv.style.opacity = '0';
    talkDiv.style.transform = 'translateX(100%)'; // Começa fora da tela

    const tempo = setInterval(() => {
        timeElement.textContent = --time;
    }, 1000);

    setTimeout(() => {
        clearInterval(tempo);
        // Faz a talkDiv deslizar para dentro e aparecer
        talkDiv.style.transform = 'translateX(0%)';
        talkDiv.style.opacity = '1'; // Torna a talkDiv visível após o contador zerar
    }, 10000);
});


// 🔧 Formulários
function configurarCamposFormulario() {
    const formatPhone = (e) => {
        let value = e.target.value.replace(/\D/g, '');
        if (value.length > 11) value = value.slice(0, 11);

        let formatted = value.length > 0 ? `(${value.substring(0, 2)}) ` : '';
        if (value.length >= 3) {
            const rest = value.substring(2);
            formatted += rest.length > 8
                ? `${rest.substring(0, 5)}-${rest.substring(5, 9)}`
                : rest.length > 4
                    ? `${rest.substring(0, 4)}-${rest.substring(4)}`
                    : rest;
        }

        e.target.value = formatted;
    };

    const formatZipCode = (e) => {
        let value = e.target.value.replace(/\D/g, '');
        if (value.length > 8) value = value.slice(0, 8);
        e.target.value = value.length > 5
            ? `${value.substring(0, 5)}-${value.substring(5)}`
            : value;
    };

    document.getElementById('whatsapp')?.addEventListener('input', formatPhone);
    document.getElementById('cep')?.addEventListener('input', formatZipCode);
}

// Preencher campos da URL
function preencherCamposUrl() {
    const params = new URLSearchParams(window.location.search);
    const fields = [
        'utm_source', 'utm_medium', 'utm_campaign', 'utm_id',
        'utm_media', 'utm_term', 'utm_content'
    ];

    fields.forEach(field => {
        const value = params.get(field);
        if (value) {
            const input = document.getElementById(field);
            if (input) input.value = value;
        }
    });
}

// CEP com cache
const cepCache = {};
document.getElementById("cep")?.addEventListener("blur", function () {
    const cep = this.value.replace(/\D/g, ""); // ✅ aqui corrige o erro
    if (cep.length !== 8) return; // só busca se tiver 8 dígitos

    if (cepCache[cep]) {
        preencherDadosCEP(cepCache[cep]);
        return;
    }

    fetch(`https://viacep.com.br/ws/${cep}/json/`)
        .then(res => res.json())
        .then(data => {
            if (data.erro) return;
            cepCache[cep] = data;
            preencherDadosCEP(data);
        });
});

function preencherDadosCEP(data) {
    // Grava exatamente o que veio do ViaCEP
    document.getElementById("Estado").value = data.uf;
    document.getElementById("Cidade").value = data.localidade;
}

document.addEventListener("DOMContentLoaded", function() {
    const form = document.getElementById('formFranquia');

    // Cria um container para mensagens (uma vez só)
    const msgBox = document.createElement("div");
    msgBox.id = "msgBox";
    document.body.appendChild(msgBox);

    // Função para exibir mensagens
    function showMessage(text, type = "success") {
        msgBox.textContent = text;
        msgBox.className = type; // aplica classe CSS (success ou error)
        msgBox.style.display = "block";

        // Some sozinho após 4s (se for erro)
        if (type === "error") {
            setTimeout(() => msgBox.style.display = "none", 4000);
        }
    }

    if (form) {
        form.addEventListener('submit', function(event) {
            event.preventDefault();

            const formData = new FormData(form);
            const data = Object.fromEntries(formData.entries());

            fetch('assets/php/handler.php', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(data),
            })
            .then(response => response.json())
            .then(result => {
                if (result.success) {
                    showMessage("✅ Seu formulário foi enviado com sucesso!", "success");
                    setTimeout(() => {
                        window.location.href = "https://www.melhorfranquiaautomotiva.com.br/final/";
                    }, 1500);
                } else {
                    showMessage("⚠️ Erro no envio: " + result.message, "error");
                }
            })
            .catch(error => {
                console.error("Erro na comunicação:", error);
                showMessage("❌ Ocorreu um erro de rede. Tente novamente.", "error");
            });
        });
    }
});


// Inicializar tudo quando DOM estiver pronto
document.addEventListener("DOMContentLoaded", init);
