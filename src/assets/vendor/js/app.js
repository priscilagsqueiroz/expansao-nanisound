// imports
import { Modal, Collapse } from "bootstrap";
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

// 🎬 Modal logic
document.addEventListener("DOMContentLoaded", function () {
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

  if (modalPrincipal) {
    modalPrincipal.style.display = "none";

    openModalBtn?.addEventListener("click", function () {
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
    modalSecundario.style.display = "none";

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
});

document.addEventListener('DOMContentLoaded', function () {
    // Função que anima o contador
    function animarContador(id, target, duracao) {
      const el = document.getElementById(id);
      let start = 0;
      const passo = target / (duracao / 20);
      const intervalo = setInterval(() => {
        start += passo;
        if (start >= target) {
          el.textContent = formatarNumero(target);
          clearInterval(intervalo);
        } else {
          el.textContent = formatarNumero(start);
        }
      }, 20);
    }
  
    // Função que formata o número (com ou sem decimal)
    function formatarNumero(numero) {
      return Number(numero).toLocaleString('pt-BR', {
        minimumFractionDigits: numero % 1 !== 0 ? 1 : 0,
        maximumFractionDigits: 1,
      });
    }
  
    // Cria o observer
    const observer = new IntersectionObserver((entries, obs) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          const el = entry.target;
          const target = parseFloat(el.getAttribute('data-target'));
          const id = el.getAttribute('id');
          animarContador(id, target, 2000);
          obs.unobserve(el); // para não reanimar se rolar de novo
        }
      });
    }, {
      threshold: 0.6
    });
  
    // Observa só depois que tudo estiver carregado
    document.querySelectorAll('.contador').forEach(el => observer.observe(el));
  });
  