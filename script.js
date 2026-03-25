window.addEventListener("load", () => {

  // --- Yıl otomatik ---
  const yearEl = document.getElementById("year");
  if (yearEl) yearEl.textContent = new Date().getFullYear();


  // --- Nav toggle ---
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


  // --- Smooth scroll ---
  const topbar = document.querySelector('.topbar');

  document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function(e) {
      e.preventDefault();

      const target = document.querySelector(this.getAttribute('href'));
      if (!target) return;

      const topbarHeight = topbar ? topbar.offsetHeight : 0;

      const targetPosition =
        target.getBoundingClientRect().top +
        window.scrollY -
        topbarHeight;

      window.scrollTo({
        top: targetPosition,
        behavior: 'smooth'
      });

      if (nav && nav.classList.contains('is-open')) {
        nav.classList.remove('is-open');
        toggle.setAttribute('aria-expanded', 'false');
      }
    });
  });


  // --- SLIDER ---
  const track = document.querySelector(".fleet-track");
  const prev = document.querySelector(".fleet-prev");
  const next = document.querySelector(".fleet-next");

  if (track && prev && next) {

    let position = 0;
    let cardWidth = 0;

    const getCardWidth = () => {
      const card = track.querySelector(".fleet-card");
      if (!card) return 0;

      const gap = parseInt(getComputedStyle(track).gap) || 20;
      return card.offsetWidth + gap;
    };

    const updateSlider = () => {
      const maxScroll = track.scrollWidth - track.clientWidth;

      if (position > 0) position = 0;
      if (position < -maxScroll) position = -maxScroll;

      track.style.transform = `translateX(${position}px)`;
    };

    const recalc = () => {
      cardWidth = getCardWidth();
      updateSlider();
    };

    // İlk hesaplama
    recalc();
    window.addEventListener("resize", recalc);

    // Butonlar
    next.addEventListener("click", () => {
      position -= cardWidth;
      updateSlider();
    });

    prev.addEventListener("click", () => {
      position += cardWidth;
      updateSlider();
    });

    // Drag
    let startX = 0;
    let isDragging = false;
    let lastPosition = 0;

    track.addEventListener("pointerdown", e => {
      isDragging = true;
      startX = e.clientX;
      lastPosition = position;

      track.style.cursor = "grabbing";
      track.style.transition = "none";

      track.setPointerCapture(e.pointerId);
    });

    track.addEventListener("pointermove", e => {
      if (!isDragging) return;

      const diff = e.clientX - startX;
      track.style.transform = `translateX(${lastPosition + diff}px)`;
    });

    const stopDrag = (e) => {
      if (!isDragging) return;

      isDragging = false;

      const diff = (e.clientX || startX) - startX;

      if (Math.abs(diff) > cardWidth / 4) {
        position = lastPosition + (diff > 0 ? cardWidth : -cardWidth);
      } else {
        position = lastPosition;
      }

      track.style.transition = "transform 0.4s ease";
      track.style.cursor = "grab";

      updateSlider();
    };

    track.addEventListener("pointerup", stopDrag);
    track.addEventListener("pointerleave", stopDrag);
    track.addEventListener("pointercancel", stopDrag);
  }


  // --- AJAX FORMSPREE ---
  const form = document.querySelector('form.contact-form.card');
  const thankMessage = document.getElementById("thankMessage");

  if (form) {
    form.addEventListener('submit', e => {
      e.preventDefault();

      const formData = new FormData(form);

      fetch("https://formspree.io/f/mgonyewa", {
        method: "POST",
        body: formData,
        headers: { 'Accept': 'application/json' }
      })
      .then(response => {
        if (response.ok) {
          form.reset();
          form.style.display = "none";

          if (thankMessage) {
            thankMessage.style.display = "block";
          }
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
