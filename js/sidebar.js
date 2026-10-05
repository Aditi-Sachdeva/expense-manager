
fetch("components/sidebar.html")
  .then(res => res.text())
  .then(data => {
    document.getElementById("sidebar-container").innerHTML = data;

    const currentPage = window.location.pathname.split("/").pop() || "index.html";

    const links = document.querySelectorAll(".sidebar nav ul li a");
    links.forEach(link => {
      const page = link.getAttribute("href");
      if (page === currentPage || (currentPage === "index.html" && page === "dashboard.html")) {
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
  })
  .catch(err => console.error("Could not load sidebar : ", err));