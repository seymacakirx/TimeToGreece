document.addEventListener("DOMContentLoaded", () => {
  const yearEl = document.getElementById("year");
  if (yearEl) yearEl.textContent = new Date().getFullYear();

  const toggle = document.querySelector(".nav__toggle");
  const nav = document.querySelector(".nav");

  if (toggle && nav) {
    toggle.addEventListener("click", () => {
      const isOpen = nav.classList.toggle("is-open");
      toggle.setAttribute("aria-expanded", String(isOpen));
    });

    nav.querySelectorAll("a").forEach(a => {
      a.addEventListener("click", () => {
        nav.classList.remove("is-open");
        toggle.setAttribute("aria-expanded", "false");
      });
    });
  }

  // Smooth scroll with offset for fixed topbar
  const topbarHeight = document.querySelector('.topbar').offsetHeight;

  document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function(e) {
      e.preventDefault();
      const target = document.querySelector(this.getAttribute('href'));
      if (target) {
        const targetPosition = target.getBoundingClientRect().top + window.scrollY - topbarHeight;
        window.scrollTo({
          top: targetPosition,
          behavior: 'smooth'
        });
      }

      if (nav.classList.contains('is-open')) {
        nav.classList.remove('is-open');
        toggle.setAttribute('aria-expanded', 'false');
      }
    });
  });

  // --- FİLO SLIDER KODU ---
  const track = document.querySelector(".fleet-track");
  const prev = document.querySelector(".fleet-prev");
  const next = document.querySelector(".fleet-next");

  if (track && prev && next) {
    let position = 0;
    const cardWidth = track.querySelector(".fleet-card").offsetWidth + 20;

    const updateSlider = () => {
      const maxPosition = -(track.scrollWidth - track.clientWidth);
      if (position < maxPosition) position = maxPosition;
      if (position > 0) position = 0;
      track.style.transform = `translateX(${position}px)`;
    };

    next.addEventListener("click", () => {
      position -= cardWidth;
      updateSlider();
    });

    prev.addEventListener("click", () => {
      position += cardWidth;
      updateSlider();
    });

    // Mobil parmakla kaydırma
    let startX = 0;
    let currentX = 0;
    let isDragging = false;

    track.addEventListener("pointerdown", e => {
      isDragging = true;
      startX = e.clientX;
      track.style.cursor = "grabbing";
      track.style.transition = "none";
    });

    track.addEventListener("pointermove", e => {
      if (!isDragging) return;
      currentX = e.clientX;
      const diff = currentX - startX;
      track.style.transform = `translateX(${position + diff}px)`;
    });

    const stopDrag = () => {
      if (!isDragging) return;
      isDragging = false;
      track.style.cursor = "grab";
      const diff = currentX - startX;
      if (Math.abs(diff) > cardWidth / 4) {
        position += diff > 0 ? cardWidth : -cardWidth;
      }
      track.style.transition = "transform .4s ease";
      updateSlider();
    };

    track.addEventListener("pointerup", stopDrag);
    track.addEventListener("pointerleave", stopDrag);
  }

  // --- AJAX FORMSPREE GÖNDERİMİ ---
  const form = document.querySelector('form.contact-form.card');
  const thankMessage = document.getElementById("thankMessage");

  if(form) {
    form.addEventListener('submit', function(e) {
      e.preventDefault(); // Sayfanın yenilenmesini engelle

      const formData = new FormData(form);

      fetch("https://formspree.io/f/mgonyewa", {
        method: "POST",
        body: formData,
        headers: { 'Accept': 'application/json' }
      })
      .then(response => {
        if (response.ok) {
          form.style.display = "none";       // formu gizle
          thankMessage.style.display = "block"; // teşekkür mesajını göster
        } else {
          return response.json().then(data => {
            throw new Error(data.error || "Bir hata oluştu!");
          });
        }
      })
      .catch(error => {
        console.error("Form gönderilemedi:", error);
        alert("Mesaj gönderilemedi, lütfen tekrar deneyin.");
      });
    });
  }
});
