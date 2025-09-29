function toggleMenu() {
    const menu = document.querySelector(".menu-links");
    const icon = document.querySelector(".hamburger-icon");
    menu.classList.toggle("open");
    icon.classList.toggle("open");
}

document.addEventListener("DOMContentLoaded", () => {
  const carousel = document.querySelector(".scrolling-carousel");
  if (!carousel) return;

  const cards = Array.from(carousel.children);
  const containerWidth = carousel.offsetWidth;

  let totalWidth = 0;
  while (true) {
    totalWidth = Array.from(carousel.children).reduce((sum, card) => sum + card.offsetWidth, 0) + 20 * (carousel.children.length - 1);
    if (totalWidth >= containerWidth * 2) break;
    cards.forEach(card => {
      const clone = card.cloneNode(true);
      carousel.appendChild(clone);
    });
  }

  totalWidth = Array.from(carousel.children).reduce((sum, card) => sum + card.offsetWidth, 0) + 20 * (carousel.children.length - 1);

  let speed = 0.5;
  let rafId;

  function step() {
    carousel.scrollLeft += speed;
    if (carousel.scrollLeft >= totalWidth / 2) {
      carousel.scrollLeft -= totalWidth / 2;
    }
    rafId = requestAnimationFrame(step);
  }

  step();

  carousel.addEventListener("mouseenter", () => {
    speed = 0;
  });

  carousel.addEventListener("mouseleave", () => {
    speed = 0.5;
  });
});



