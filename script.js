/* =========================================
   AGRO NAV - ОСНОВЕН JAVASCRIPT
   ========================================= */

/* =========================================
   1. СЕЛЕКТИРАНЕ НА DOM ЕЛЕМЕНТИ
   ========================================= */

// Бутони
const registrationButton = document.querySelector("#RegistrationBut");
const gardenButton = document.querySelector("#MyGarden");
const newsButton = document.querySelector("#news-button");
const backButton = document.querySelector("#back-btn");

// Менюта / Секции
const regMenu = document.querySelector(".RegistrationMenu");
const myGardenMenu = document.querySelector(".MyGardenMenu");
const newsMenu = document.querySelector(".NewsMenu");

// Начални елементи на страницата
const hero = document.querySelector(".hero");
const cardOne = document.querySelector(".card-one");
const cardTwo = document.querySelector(".card-two");

// Форми
const registerForm = document.querySelector("#registerForm");
const loginForm = document.querySelector("#loginForm");


/* =========================================
   2. УПРАВЛЕНИЕ НА ИНТЕРФЕЙСА (UI МЕНЮТА)
   ========================================= */

// Отваряне на Меню Регистрация / Вход
if (registrationButton) {
    registrationButton.addEventListener("click", function () {
        if (regMenu) regMenu.style.display = "flex";
        if (cardOne) cardOne.style.display = "none";
        if (cardTwo) cardTwo.style.display = "none";
        if (hero) hero.style.display = "none";
        if (myGardenMenu) myGardenMenu.style.display = "none";
        if (newsMenu) newsMenu.style.display = "none";

        if (backButton) backButton.style.display = "block";
        registrationButton.style.display = "none";

        document.body.classList.add("menu-open");
    });
}

// Отваряне на Меню Моята Градина
if (gardenButton) {
    gardenButton.addEventListener("click", function () {
        if (myGardenMenu) myGardenMenu.style.display = "flex";
        if (cardOne) cardOne.style.display = "none";
        if (cardTwo) cardTwo.style.display = "none";
        if (hero) hero.style.display = "none";
        if (regMenu) regMenu.style.display = "none";
        if (newsMenu) newsMenu.style.display = "none";

        if (backButton) backButton.style.display = "block";
        if (registrationButton) registrationButton.style.display = "none";

        document.body.classList.add("menu-open");
    });
}

// Отваряне на Меню Новини
if (newsButton) {
    newsButton.addEventListener("click", function () {
        if (newsMenu) newsMenu.style.display = "flex";
        if (cardOne) cardOne.style.display = "none";
        if (cardTwo) cardTwo.style.display = "none";
        if (hero) hero.style.display = "none";
        if (regMenu) regMenu.style.display = "none";
        if (myGardenMenu) myGardenMenu.style.display = "none";

        if (backButton) backButton.style.display = "block";
        if (registrationButton) registrationButton.style.display = "none";

        document.body.classList.add("menu-open");
    });
}

// Затваряне на Менюта (Бутон "Назад")
if (backButton) {
    backButton.addEventListener("click", function () {
        const isGardenOpen = myGardenMenu && myGardenMenu.style.display === "flex";
        const isNewsOpen = newsMenu && newsMenu.style.display === "flex";

        // Скриваме всички менюта
        if (regMenu) regMenu.style.display = "none";
        if (myGardenMenu) myGardenMenu.style.display = "none";
        if (newsMenu) newsMenu.style.display = "none";

        // Показваме отново началните картички и Hero
        if (cardOne) cardOne.style.display = "flex";
        if (cardTwo) cardTwo.style.display = "flex";
        if (hero) hero.style.display = "flex";
        if (registrationButton) registrationButton.style.display = "block";

        backButton.style.display = "none";
        document.body.classList.remove("menu-open");

        // Фокусираме скрола върху съответната картичка
        if (isGardenOpen && cardOne) {
            cardOne.scrollIntoView({ behavior: "instant", block: "center" });
        } else if (isNewsOpen && cardTwo) {
            cardTwo.scrollIntoView({ behavior: "instant", block: "center" });
        }
    });
}


/* =========================================
   3. РЕГИСТРАЦИЯ (SUPABASE)
   ========================================= */

if (registerForm) {
    registerForm.addEventListener("submit", async function (event) {
        event.preventDefault();

        const name = document.querySelector("#name") ? document.querySelector("#name").value.trim() : "";
        const email = document.querySelector("#email") ? document.querySelector("#email").value.trim() : "";
        const password = document.querySelector("#password") ? document.querySelector("#password").value : "";
        const profile = document.querySelector("#profile") ? document.querySelector("#profile").value : "";
        const location = document.querySelector("#location") ? document.querySelector("#location").value.trim() : "";
        const crops = document.querySelector("#crops") ? document.querySelector("#crops").value.trim() : "";

        if (!name || !email || !password || !profile || !location) {
            alert("Моля, попълни всички задължителни полета.");
            return;
        }

        if (typeof supabaseClient === "undefined") {
            alert("Грешка: Supabase не е зареден.");
            return;
        }

        // Регистрация в Supabase Auth
        const { data, error } = await supabaseClient.auth.signUp({
            email: email,
            password: password
        });

        if (error) {
            alert("Грешка при регистрацията: " + error.message);
            return;
        }

        if (!data.user) {
            alert("Акаунтът не можа да бъде създаден.");
            return;
        }

        if (!data.session) {
            alert("Регистрацията е успешна. Провери имейла си, за да потвърдиш акаунта.");
            return;
        }

        // Запис на допълнителните данни в таблица "profiles"
        const { error: profileError } = await supabaseClient
            .from("profiles")
            .insert({
                id: data.user.id,
                name: name,
                profile_type: profile,
                location: location
            });

        if (profileError) {
            alert("Акаунтът е създаден, но профилът не можа да бъде записан: " + profileError.message);
            return;
        }

        if (crops) {
            localStorage.setItem("agronavCrops", crops);
        }

        window.location.href = "dashboard.html";
    });
}


/* =========================================
   4. ВХОД / LOGIN (SUPABASE)
   ========================================= */

if (loginForm) {
    loginForm.addEventListener("submit", async function (event) {
        event.preventDefault();

        const email = document.querySelector("#email") ? document.querySelector("#email").value.trim() : "";
        const password = document.querySelector("#password") ? document.querySelector("#password").value : "";

        if (!email || !password) {
            alert("Моля, въведи имейл и парола.");
            return;
        }

        if (typeof supabaseClient === "undefined") {
            alert("Грешка: Supabase не е зареден.");
            return;
        }

        const { data, error } = await supabaseClient.auth.signInWithPassword({
            email: email,
            password: password
        });

        if (error) {
            alert("Грешка при вход: " + error.message);
            return;
        }

        if (!data.user) {
            alert("Входът не беше успешен.");
            return;
        }

        window.location.href = "dashboard.html";
    });
}