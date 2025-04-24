import { Modal } from "bootstrap";
import AOS from 'aos';
AOS.init();

// 🔁 Marquee
const marqueeWrapper = document.getElementById('marquee');
function duplicarMarquee() {
    const originalContent = marqueeWrapper.children[0];
    const clone = originalContent.cloneNode(true);
    while (marqueeWrapper.scrollWidth < window.innerWidth * 2) {
        marqueeWrapper.appendChild(clone.cloneNode(true));
    }
}
duplicarMarquee();

// Função de inicialização geral
function init() {
    configurarModais();
    configurarContadores();
    configurarCamposFormulario();
    preencherCamposUrl();
}

// 🎬 Modal logic
function configurarModais() {
    const modalPrincipal = document.getElementById("videoModalPrincipal");
    const videoPrincipal = document.getElementById("meuVideoPrincipal");
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
        video.pause();
        video.currentTime = 0;
        video.removeAttribute("src");
        video.load();
    }

    if (modalPrincipal && openModalBtn) {
        openModalBtn.addEventListener("click", () => {
            modalPrincipal.style.display = "flex";
            videoPrincipal.load();
            videoPrincipal.play().catch(err => console.error(err));
        });

        closeModalBtnPrincipal?.addEventListener("click", () => fecharModal(modalPrincipal, videoPrincipal));
        modalPrincipal.addEventListener("click", e => {
            if (e.target === modalPrincipal) fecharModal(modalPrincipal, videoPrincipal);
        });
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
        modalSecundario.addEventListener("click", e => {
            if (e.target === modalSecundario) fecharModal(modalSecundario, videoSecundario);
        });
    }
}

// 🎯 Contadores
function configurarContadores() {
    function animarContador(id, target, duracao) {
        const el = document.getElementById(id);
        let start = 0;
        const passo = target / (duracao / 20);
        const intervalo = setInterval(() => {
            start += passo;
            el.textContent = formatarNumero(start >= target ? target : start);
            if (start >= target) clearInterval(intervalo);
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

// Preencher os campos de URL
function preencherCamposUrl() {
    const params = new URLSearchParams(window.location.search);
    const fields = [
        'utm_source', 'utm_medium', 'utm_campaign', 'utm_id', 
        'utm_media', 'utm_term', 'utm_content'
    ];

    fields.forEach(field => {
        const value = params.get(field);
        if (value) {
            document.getElementById(field).value = value;
        }
    });
}

// Chama a inicialização quando a página estiver carregada
document.addEventListener("DOMContentLoaded", init);

// CEP e cidade
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

    fetch(`https://viacep.com.br/ws/${cep}/json/`)
        .then(response => response.json())
        .then(data => {
            if (data.erro) return;
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
        });
});

function buscaCidadesPorEstado(uf, callback) {
    const xhr = new XMLHttpRequest();
    xhr.open("POST", "https://sistema.solutto.com.br/wsUtilitarios.asmx/Retorna_Municipios_Por_Estado_V1", true);
    xhr.setRequestHeader("Content-Type", "application/x-www-form-urlencoded");
    xhr.onreadystatechange = function () {
        if (xhr.readyState === 4 && xhr.status === 200) {
            const xml = xhr.responseXML;
            const texto = xml.getElementsByTagName("string")[0].textContent;
            const lista = texto.split(",").map(item => {
                const partes = item.split("|");
                return { id: partes[0], nome: partes[1] };
            });
            callback(lista);
        }
    };
    xhr.send("siglaUF=" + encodeURIComponent(uf));
}
