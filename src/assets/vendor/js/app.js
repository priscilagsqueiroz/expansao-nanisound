import { Modal, Collapse } from "bootstrap";

// Pega o wrapper da marquee
const marqueeWrapper = document.getElementById('marquee');

// Clona o conteúdo original várias vezes para criar o efeito de loop
function duplicarMarquee() {
    const originalContent = marqueeWrapper.children[0]; // Pega o primeiro filho
    const clone = originalContent.cloneNode(true); // Clona ele

    // Adiciona várias cópias para garantir rolagem contínua
    while (marqueeWrapper.scrollWidth < window.innerWidth * 2) {
        marqueeWrapper.appendChild(clone.cloneNode(true));
    }
}

duplicarMarquee(); // Executa a função ao carregar

// Função para animar contagem
function animarContador(elementId, valorFinal, duracao, decimal = false) {
    const contador = document.getElementById(elementId);
    let inicio = 0;
    const incremento = valorFinal / 100; // Dividimos em 100 etapas
    const intervalo = duracao / 100;

    const timer = setInterval(() => {
        inicio += incremento;
        if (inicio >= valorFinal) {
            clearInterval(timer);
            inicio = valorFinal;
        }

        if (decimal) {
            contador.textContent = inicio.toFixed(1);
        } else {
            contador.textContent = Math.floor(inicio);
        }
    }, intervalo);
}

// Função para iniciar animação quando o elemento estiver visível
function iniciarAnimacao() {
    // Pegar os valores finais dos contadores
    const contador1 = document.getElementById('contador1');
    const contador2 = document.getElementById('contador2');
    const contador3 = document.getElementById('contador3');

    const valor1 = parseFloat(contador1.getAttribute('data-valor'));
    const valor2 = parseFloat(contador2.getAttribute('data-valor'));
    const valor3 = parseFloat(contador3.getAttribute('data-valor'));

    // Iniciar animações com durações diferentes
    animarContador('contador1', valor1, 2000);
    animarContador('contador2', valor2, 2500, true);
    animarContador('contador3', valor3, 3000);
}

document.addEventListener("DOMContentLoaded", function () {
    // Modal do primeiro vídeo (individual)
    var modalPrincipal = document.getElementById("videoModalPrincipal");
    var videoPrincipal = document.getElementById("meuVideoPrincipal");
    var openModalBtn = document.getElementById("openVideoModal");
    var closeModalBtnPrincipal = document.getElementById("closePrincipalModal");

    if (modalPrincipal) {
        modalPrincipal.style.display = "none";

        if (openModalBtn) {
            openModalBtn.addEventListener("click", function () {
                modalPrincipal.style.display = "flex";
                videoPrincipal.load();
                videoPrincipal.play().catch(error => console.error("Erro ao iniciar o vídeo:", error));
            });
        }

        if (closeModalBtnPrincipal) {
            closeModalBtnPrincipal.addEventListener("click", function () {
                fecharModal(modalPrincipal, videoPrincipal);
            });
        }

        modalPrincipal.addEventListener("click", function (event) {
            if (event.target === modalPrincipal) {
                fecharModal(modalPrincipal, videoPrincipal);
            }
        });
    }

    // Modal dos três vídeos
    var modalSecundario = document.getElementById("videoModalSecundario");
    var videoSecundario = document.getElementById("meuVideoSecundario");
    var videoSourceSecundario = document.getElementById("videoSourceSecundario");
    var closeModalBtnSecundario = document.getElementById("closeSecundarioModal");

    var videoPaths = {
        "video2": "assets/video/1.mp4",
        "video3": "assets/video/2.mp4",
        "video4": "assets/video/3.mp4"
    };

    if (modalSecundario) {
        modalSecundario.style.display = "none";

        document.querySelectorAll(".video-thumb").forEach(thumb => {
            thumb.addEventListener("click", function () {
                var videoKey = this.getAttribute("data-video");
                if (videoPaths[videoKey]) {
                    videoSourceSecundario.src = videoPaths[videoKey];
                    videoSecundario.load();
                    videoSecundario.play().catch(error => console.error("Erro ao iniciar o vídeo:", error));
                    modalSecundario.style.display = "flex";
                }
            });
        });

        if (closeModalBtnSecundario) {
            closeModalBtnSecundario.addEventListener("click", function () {
                fecharModal(modalSecundario, videoSecundario);
            });
        }

        modalSecundario.addEventListener("click", function (event) {
            if (event.target === modalSecundario) {
                fecharModal(modalSecundario, videoSecundario);
            }
        });
    }

    // 🔹 Função que fecha o modal e para o vídeo corretamente
    function fecharModal(modal, video) {
        modal.style.display = "none";
        video.pause();
        video.currentTime = 0; //  Agora para o vídeo e reseta
        video.removeAttribute("src"); // Remove a fonte para garantir que o vídeo pare
        video.load(); // Recarrega para garantir que o som pare completamente
    }
});


// Iniciar animação quando a página carregar
document.addEventListener('DOMContentLoaded', iniciarAnimacao);