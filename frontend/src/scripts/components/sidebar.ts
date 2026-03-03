


export function sidebar()
{
const menuBtn = document.getElementById("menu-btn") as HTMLButtonElement;
const sidebar = document.getElementById("sidebar") as HTMLDivElement;
// console.log(menuBtn);
// console.log("dhduihsdjiue");


document.addEventListener("DOMContentLoaded", () => {
  const links = document.querySelectorAll<HTMLAnchorElement>(".sidebar-link");


  const currentPath = window.location.pathname.split("/").pop();


  links.forEach(link => {
    const linkPath = link.getAttribute("href");


    if (linkPath === currentPath) {
      link.classList.add(
        "bg-teal-100",
        "text-teal-700",
        "font-medium"
      );
    } else {
      link.classList.add("hover:bg-gray-100");
    }
  });
});


menuBtn.addEventListener("click", () => {
  sidebar.classList.toggle("-translate-x-full");
});
}
