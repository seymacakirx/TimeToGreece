document.addEventListener("DOMContentLoaded", () => {
  // --- Footer Yılı ---
  const yearEl = document.getElementById("year");
  if (yearEl) yearEl.textContent = new Date().getFullYear();

  // --- Mobil Menü Toggle ---
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

  // --- Smooth Scroll with Offset for Fixed Topbar ---
  const topbar = document.querySelector('.topbar');
  const topbarHeight = topbar ? topbar.offsetHeight : 0;

  document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function(e) {
      const target = document.querySelector(this.getAttribute('href'));
      if (!target) return;

      e.preventDefault();
      const targetPosition = target.getBoundingClientRect().top + window.scrollY - topbarHeight;

      window.scrollTo({
        top: targetPosition,
        behavior: 'smooth'
      });

      // Mobil menüyü kapat
      if (nav && nav.classList.contains('is-open')) {
        nav.classList.remove('is-open');
        toggle.setAttribute('aria-expanded', 'false');
      }
    });
  });

  // --- Form Gönderimi (Formspree) ---
  const contactForm = document.getElementById("contactForm");
  const thankMessage = document.getElementById("thankMessage");

  if (contactForm) {
    contactForm.addEventListener("submit", function(e) {
      e.preventDefault();
      const formData = new FormData(contactForm);

      fetch("https://formspree.io/f/mgonyewa", {
        method: "POST",
        body: formData,
        headers: { "Accept": "application/json" }
      })
      .then(response => {
        if (response.ok) {
          contactForm.reset();
          if (thankMessage) {
            thankMessage.style.display = "block";
            setTimeout(() => { thankMessage.style.display = "none"; }, 5000);
          } else {
            alert("Mesajınız gönderildi, teşekkürler!");
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

  // --- Filolar Slider (Opsiyonel) ---
  const track = document.querySelector(".fleet-track");
  const prev = document.querySelector(".fleet-prev");
  const next = document.querySelector(".fleet-next");

  if (track && prev && next) {
    let position = 0;
    const card = track.querySelector(".fleet-card");
    const cardWidth = card ? card.offsetWidth + 20 : 300; // default genişlik

    const updateSlider = () => {
      const maxPosition = -(track.scrollWidth - track.clientWidth);
      if (position < maxPosition) position = maxPosition;
      if (position > 0) position = 0;
      track.style.transform = `translateX(${position}px)`;
    };

    next.addEventListener("click", () => { position -= cardWidth; updateSlider(); });
    prev.addEventListener("click", () => { position += cardWidth; updateSlider(); });

    // Dokunmatik kaydırma
    let startX = 0, currentX = 0, isDragging = false;

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
      if (Math.abs(diff) > cardWidth / 4) position += diff > 0 ? cardWidth : -cardWidth;
      track.style.transition = "transform 0.4s ease";
      updateSlider();
    };

    track.addEventListener("pointerup", stopDrag);
    track.addEventListener("pointerleave", stopDrag);
  }
});
