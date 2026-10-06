// Course progress: fills the top bar and the path line as you scroll,
// and checks off each module once you've scrolled past its takeaway.
(function () {
  const root = document.documentElement;
  const pct = document.querySelector(".progress__pct");
  const path = document.querySelector(".path");
  const lineFill = document.querySelector(".path__line-fill");
  const modules = [...document.querySelectorAll(".module")];
  const complete = document.querySelector(".complete");

  document.getElementById("year").textContent = new Date().getFullYear();

  function update() {
    const max = root.scrollHeight - window.innerHeight;
    const p = max > 0 ? Math.min(1, Math.max(0, window.scrollY / max)) : 1;
    root.style.setProperty("--p", p);
    pct.textContent = Math.round(p * 100) + "%";

    // A module counts as "done" once its takeaway rises above 60% of the viewport.
    const mark = window.innerHeight * 0.6;
    modules.forEach((m) => {
      const takeaway = m.querySelector(".module__takeaway");
      m.classList.toggle("is-done", takeaway.getBoundingClientRect().bottom < mark);
    });

    // Path line grows down to the reading mark.
    const box = path.getBoundingClientRect();
    const line = Math.min(1, Math.max(0, (mark - box.top) / box.height));
    lineFill.parentElement.style.setProperty("--line", line);
  }

  // Fade cards in as they enter the screen.
  const io = new IntersectionObserver(
    (entries) => entries.forEach((e) => e.isIntersecting && e.target.classList.add("is-visible")),
    { threshold: 0.2 }
  );
  modules.forEach((m) => io.observe(m));
  io.observe(complete);

  let ticking = false;
  window.addEventListener("scroll", () => {
    if (!ticking) {
      requestAnimationFrame(() => { update(); ticking = false; });
      ticking = true;
    }
  }, { passive: true });
  window.addEventListener("resize", update);
  update();
})();
