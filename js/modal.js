const isOpenClass = "modal-is-open";
const openingClass = "modal-is-opening";
const closingClass = "modal-is-closing";
const scrollbarWidthCssVar = "--scrollbar-width";
const animationDuration = 300;
let visibleModal = null;

const toggleModal = (event) => {
    event.preventDefault();
    const target = event.currentTarget.getAttribute("data-target");
    if (!target) return;
    const modal = document.getElementById(target);
    if (!modal) return;
    modal && (modal.hasAttribute("open") ? closeModal(modal) : openModal(modal));
};

const openModal = (modal) => {
    const { documentElement: html } = document;
    const scrollbarWidth = getScrollbarWidth();
    if (scrollbarWidth) {
        html.style.setProperty(scrollbarWidthCssVar, `${scrollbarWidth}px`);
    }
    html.classList.add(isOpenClass, openingClass);
    modal.setAttribute("open", "");
    modal.querySelector("article").focus(); // Odak yönetimini ekle
    setTimeout(() => {
        visibleModal = modal;
        html.classList.remove(openingClass);
    }, animationDuration);
};

const closeModal = (modal) => {
    visibleModal = null;
    const { documentElement: html } = document;
    html.classList.add(closingClass);
    setTimeout(() => {
        html.classList.remove(closingClass, isOpenClass);
        html.style.removeProperty(scrollbarWidthCssVar);
        modal.removeAttribute("open");
    }, animationDuration);
};

document.addEventListener("click", (event) => {
    if (visibleModal === null) return;
    const modalContent = visibleModal.querySelector("article");
    const isClickInside = modalContent.contains(event.target);
    const isCloseButton = event.target.classList.contains("close-btn");
    if (!isClickInside || isCloseButton) {
        closeModal(visibleModal);
    }
});

document.addEventListener("keydown", (event) => {
    if (event.key === "Escape" && visibleModal) {
        closeModal(visibleModal);
    }
});

const getScrollbarWidth = () => {
    return window.innerWidth > document.documentElement.clientWidth
        ? window.innerWidth - document.documentElement.clientWidth
        : 0;
};