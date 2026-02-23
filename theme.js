// Apply saved theme on page load
const savedTheme = localStorage.getItem("theme");
if (savedTheme) {
    document.documentElement.setAttribute("data-theme", savedTheme);
}

// Theme toggle buttons (if present on this page)
const lightBtn = document.querySelector(".lightmode");
const darkBtn = document.querySelector(".darkmode");

if (lightBtn && darkBtn) {
    lightBtn.addEventListener("click", () => {
        document.documentElement.setAttribute("data-theme", "light");
        localStorage.setItem("theme", "light");
    });

    darkBtn.addEventListener("click", () => {
        document.documentElement.setAttribute("data-theme", "dark");
        localStorage.setItem("theme", "dark");
    });
}
