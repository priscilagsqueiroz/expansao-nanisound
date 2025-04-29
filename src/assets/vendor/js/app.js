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

// 🔧 Formulários
function configurarCamposFormulario() {
    const formatPhone = (e) => {
        let value = e.target.value.replace(/\D/g, '');
        if (value.length > 11) value = value.slice(0, 11);

        let formatted = value.length > 0 ? `(${value.substring(0, 2)}) ` : '';
        if (value.length >= 3) {
            const rest = value.substring(2);
            formatted += rest.length > 8 ? `${rest.substring(0, 5)}-${rest.substring(5, 9)}` :
                rest.length > 4 ? `${rest.substring(0, 4)}-${rest.substring(4)}` :
                    rest;
        }

        e.target.value = formatted;
    };

    const formatZipCode = (e) => {
        let value = e.target.value.replace(/\D/g, '');
        if (value.length > 8) value = value.slice(0, 8);
        e.target.value = value.length > 5 ? `${value.substring(0, 5)}-${value.substring(5)}` : value;
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



// CEP com cache
const cepCache = {};
document.getElementById("cep")?.addEventListener("blur", function () {
    const pais = document.getElementById("Pais").value;
    if (pais && pais !== "BR") {
        document.getElementById("Estado").value = "EX";
        document.getElementById("ddlCidade").value = "";
        document.getElementById("Cidade").value = "";
        const cidadeInteresse = document.getElementById("cidade_interesse_1");
        if (cidadeInteresse) cidadeInteresse.value = "";
        return;
    }

    const cep = this.value.replace(/\D/g, "");
    if (cep.length !== 8) return;

    if (cepCache[cep]) return preencherDadosCEP(cepCache[cep]);

    fetch(`https://viacep.com.br/ws/${cep}/json/`)
        .then(res => res.json())
        .then(data => {
            if (data.erro) return;
            cepCache[cep] = data;
            preencherDadosCEP(data);
        });
});

function preencherDadosCEP(data) {
    document.getElementById("Estado").value = data.uf;
    buscaCidadesPorEstado(data.uf, cidades => {
        const cidade = cidades.find(c => c.nome.toLowerCase() === data.localidade.toLowerCase());
        if (cidade) {
            document.getElementById("ddlCidade").value = cidade.id;
            document.getElementById("Cidade").value = cidade.nome;
            const cidadeInteresse = document.getElementById("cidade_interesse_1");
            if (cidadeInteresse) cidadeInteresse.value = cidade.id;
        }
    });
}

function buscaCidadesPorEstado(uf, callback) {
    const xhr = new XMLHttpRequest();
    xhr.open("POST", "https://sistema.solutto.com.br/wsUtilitarios.asmx/Retorna_Municipios_Por_Estado_V1", true);
    xhr.setRequestHeader("Content-Type", "application/x-www-form-urlencoded");
    xhr.onreadystatechange = function () {
        if (xhr.readyState === 4 && xhr.status === 200) {
            const xml = xhr.responseXML;
            const texto = xml.getElementsByTagName("string")[0].textContent;
            const lista = texto.split(",").map(item => {
                const [id, nome] = item.split("|");
                return { id, nome };
            });
            callback(lista);
        }
    };
    xhr.send("siglaUF=" + encodeURIComponent(uf));
}

// Inicializar tudo quando DOM estiver pronto
document.addEventListener("DOMContentLoaded", init);
