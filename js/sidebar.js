

fetch("components/sidebar.html")
  .then(res => res.text())
  .then(data => {
    document.getElementById("sidebar-container").innerHTML = data;

    const links = document.querySelectorAll(".sidebar nav ul li a");
    links.forEach(link => {
      if (window.location.pathname.endsWith("index.html") && link.getAttribute("href") === "dashboard.html") {
        link.classList.add("active");
      }
      else if (link.href === window.location.href) {
        link.classList.add("active");
      }
    });

    const sidebar = document.querySelector(".sidebar");
    const menuBtn = document.getElementById("menuBtn");
    if (menuBtn) {
      menuBtn.addEventListener("click", () => {
        sidebar.classList.toggle("open");
      });
    }
  });
