/* =========================================================
   EVENT CONFIGURATION
========================================================= */

const EVENT_DATE =
    new Date("2026-09-17T20:30:00+03:00");


/* =========================================================
   ELEMENTS
========================================================= */

const body =
    document.body;

const themeButton =
    document.getElementById("themeButton");

const themeIcon =
    document.getElementById("themeIcon");

const menuButton =
    document.getElementById("menuButton");

const closeMenuButton =
    document.getElementById("closeMenu");

const sideMenu =
    document.getElementById("sideMenu");

const menuOverlay =
    document.getElementById("menuOverlay");

const modalLayer =
    document.getElementById("modalLayer");

const menuOptions =
    document.querySelectorAll(".menu-option");

const modalCloseButtons =
    document.querySelectorAll(".modal-close");

const shareButton =
    document.getElementById("shareButton");

const days =
    document.getElementById("days");

const hours =
    document.getElementById("hours");

const minutes =
    document.getElementById("minutes");

const seconds =
    document.getElementById("seconds");

const toast =
    document.getElementById("toast");

const toastMessage =
    document.getElementById("toastMessage");


/* =========================================================
   THEME
========================================================= */

function getStoredTheme() {

    try {
        return localStorage.getItem(
            "nutrition-theme"
        );
    } catch {
        return null;
    }
}


function setStoredTheme(theme) {

    try {
        localStorage.setItem(
            "nutrition-theme",
            theme
        );
    } catch {
        // Ignore storage errors.
    }
}


function applyTheme(theme) {

    const dark =
        theme === "dark";

    body.classList.toggle(
        "dark",
        dark
    );

    themeIcon.textContent =
        dark ? "☾" : "☼";
}


const savedTheme =
    getStoredTheme();

if (savedTheme) {

    applyTheme(savedTheme);

} else {

    applyTheme("light");

}


themeButton.addEventListener(
    "click",
    () => {

        const dark =
            body.classList.contains("dark");

        const newTheme =
            dark ? "light" : "dark";

        applyTheme(newTheme);
        setStoredTheme(newTheme);

    }
);


/* =========================================================
   MENU
========================================================= */

function openMenu() {

    sideMenu.classList.add("active");

    menuOverlay.classList.add("active");

    menuButton.setAttribute(
        "aria-expanded",
        "true"
    );

    body.style.overflow = "hidden";
}


function closeMenu() {

    sideMenu.classList.remove("active");

    menuOverlay.classList.remove("active");

    menuButton.setAttribute(
        "aria-expanded",
        "false"
    );

    body.style.overflow = "";
}


menuButton.addEventListener(
    "click",
    openMenu
);

closeMenuButton.addEventListener(
    "click",
    closeMenu
);

menuOverlay.addEventListener(
    "click",
    closeMenu
);


/* =========================================================
   MODALS
========================================================= */

function openModal(id) {

    const modal =
        document.getElementById(id);

    if (!modal) {
        return;
    }

    document
        .querySelectorAll(".modal")
        .forEach((item) => {
            item.classList.remove("active");
        });

    modal.classList.add("active");

    modalLayer.classList.add("active");

    body.style.overflow = "hidden";
}


function closeModal() {

    modalLayer.classList.remove("active");

    document
        .querySelectorAll(".modal")
        .forEach((item) => {
            item.classList.remove("active");
        });

    body.style.overflow = "";
}


menuOptions.forEach((option) => {

    option.addEventListener(
        "click",
        () => {

            const modalId =
                option.dataset.modal;

            closeMenu();

            openModal(modalId);

        }
    );

});


modalCloseButtons.forEach((button) => {

    button.addEventListener(
        "click",
        closeModal
    );

});


modalLayer.addEventListener(
    "click",
    (event) => {

        if (
            event.target === modalLayer
        ) {
            closeModal();
        }

    }
);


/* =========================================================
   ESC KEY
========================================================= */

document.addEventListener(
    "keydown",
    (event) => {

        if (event.key !== "Escape") {
            return;
        }

        closeMenu();
        closeModal();

    }
);


/* =========================================================
   COUNTDOWN
========================================================= */

function pad(value) {

    return String(value)
        .padStart(2, "0");

}


function updateCountdown() {

    const now =
        new Date();

    const difference =
        EVENT_DATE.getTime() -
        now.getTime();


    if (difference <= 0) {

        days.textContent = "00";
        hours.textContent = "00";
        minutes.textContent = "00";
        seconds.textContent = "00";

        return;
    }


    const totalSeconds =
        Math.floor(
            difference / 1000
        );


    const dayValue =
        Math.floor(
            totalSeconds / 86400
        );


    const hourValue =
        Math.floor(
            (totalSeconds % 86400) / 3600
        );


    const minuteValue =
        Math.floor(
            (totalSeconds % 3600) / 60
        );


    const secondValue =
        totalSeconds % 60;


    days.textContent =
        pad(dayValue);

    hours.textContent =
        pad(hourValue);

    minutes.textContent =
        pad(minuteValue);

    seconds.textContent =
        pad(secondValue);

}


updateCountdown();


/*
    Only one lightweight timer.
    No continuous visual animations.
*/
const countdownTimer =
    setInterval(
        updateCountdown,
        1000
    );


/* =========================================================
   TOAST
========================================================= */

let toastTimer = null;


function showToast(message) {

    toastMessage.textContent =
        message;

    toast.classList.add("show");

    clearTimeout(toastTimer);

    toastTimer =
        setTimeout(
            () => {
                toast.classList.remove(
                    "show"
                );
            },
            2200
        );
}


/* =========================================================
   SHARE
========================================================= */

async function shareEvent() {

    const data = {

        title:
            "Dr. Enas Madkour — Nutrition & Immunity",

        text:
            "Nutrition & Immunity presentation by Dr. Enas Madkour — Thursday, 17 September 2026 at 8:30 PM.",

        url:
            window.location.href
    };


    try {

        if (
            navigator.share
        ) {

            await navigator.share(data);

            return;
        }


        if (
            navigator.clipboard
        ) {

            await navigator.clipboard.writeText(
                window.location.href
            );

            showToast(
                "Event link copied successfully."
            );

            return;
        }


        showToast(
            "Copy the page link from your browser."
        );

    } catch (error) {

        if (
            error.name !== "AbortError"
        ) {

            console.error(
                "Share error:",
                error
            );

            showToast(
                "Sharing is unavailable right now."
            );

        }

    }

}


shareButton.addEventListener(
    "click",
    shareEvent
);


/* =========================================================
   CLEANUP
========================================================= */

window.addEventListener(
    "beforeunload",
    () => {

        clearInterval(
            countdownTimer
        );

    }
);