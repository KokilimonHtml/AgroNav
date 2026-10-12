/* =========================================
   AGRO NAV - ОСНОВЕН JAVASCRIPT
   ========================================= */
const MainPage = document.querySelector(".main-page");
const RegBut = document.querySelector("#RegistrationBut");
const RegMenu = document.querySelector(".RegistrationMenu");
const Hero = document.querySelector(".hero");
const CardOne = document.querySelector(".card-one");
const CardTwo = document.querySelector(".card-two");
const MyGarden = document.querySelector("#MyGarden");
const MyGardenMenu = document.querySelector(".MyGardenMenu");
const NewsBut = document.querySelector("#news-button");
const NewsMenu = document.querySelector(".NewsMenu");
const BackBtn = document.querySelector("#back-btn");


const MyGardenMenuAlt = document.querySelector("#MyGardenMenu");
const NewsMenuAlt = document.querySelector("#NewsMenu");


function loginAndNavigate(targetPage) {
    sessionStorage.setItem("redirectAfterLogin", targetPage);
    window.location.href = "pages/login.html";
}

function handlePostAuthRedirect() {
    const redirectTo = sessionStorage.getItem("redirectAfterLogin");
    sessionStorage.removeItem("redirectAfterLogin");

    if (redirectTo) {
        window.location.href = redirectTo;
    } else {
        window.location.href = "dashboard.html";
    }
}

async function checkAuthAndNavigate(targetAction, targetPage) {
    if (typeof supabaseClient === "undefined") {
        loginAndNavigate(targetPage);
        return;
    }
    const { data: { session } } = await supabaseClient.auth.getSession();
    if (session) {
        targetAction();
    } else {
        loginAndNavigate(targetPage);
    }
}


if (RegBut) {
    RegBut.addEventListener("click", async function () {
        await checkAuthAndNavigate(function () {
        RegMenu.style.display = "flex";
        CardOne.style.display = "none";
        CardTwo.style.display = "none";
        BackBtn.style.display = "block";
        RegBut.style.display = "none";
        Hero.style.display = "none";
        document.body.classList.add("menu-open");
        }, "RegistrationMenu");
    });
}


if (MyGarden) {
    MyGarden.addEventListener("click", async function () {
        await checkAuthAndNavigate(function () {
        if (RegMenu) RegMenu.style.display = "none";
        if (CardOne) CardOne.style.display = "none";
        if (CardTwo) CardTwo.style.display = "none";
        if (BackBtn) BackBtn.style.display = "block";
        if (RegBut) RegBut.style.display = "none";
        if (Hero) Hero.style.display = "none";
        MyGardenMenu.style.display = "flex";
        document.body.classList.add("menu-open");
        }, "MyGardenMenu");
    });
}


if (NewsBut) {
    NewsBut.addEventListener("click", async function () {
        await checkAuthAndNavigate(function () {
            if (RegMenu) RegMenu.style.display = "none";
            if (CardOne) CardOne.style.display = "none";
            if (CardTwo) CardTwo.style.display = "none";
            if (BackBtn) BackBtn.style.display = "block";
            if (RegBut) RegBut.style.display = "none";
            if (Hero) Hero.style.display = "none";
            if (NewsMenu) NewsMenu.style.display = "flex";
            document.body.classList.add("menu-open");
        }, "NewsMenu");
    });
}


if (BackBtn) {
    BackBtn.addEventListener("click", function () {
        const isGardenOpen = MyGardenMenu && MyGardenMenu.style.display === "flex";
        const isNewsOpen = NewsMenu && NewsMenu.style.display === "flex";

        if (RegMenu) RegMenu.style.display = "none";
        if (CardOne) CardOne.style.display = "flex";
        if (CardTwo) CardTwo.style.display = "flex";
        BackBtn.style.display = "none";
        if (RegBut) RegBut.style.display = "block";
        if (Hero) Hero.style.display = "flex";
        if (MyGardenMenu) MyGardenMenu.style.display = "none";
        if (NewsMenu) NewsMenu.style.display = "none";
        document.body.classList.remove("menu-open");

        if (isGardenOpen && CardOne) {
            CardOne.scrollIntoView({ behavior: "instant", block: "center" });
        } else if (isNewsOpen && CardTwo) {
            CardTwo.scrollIntoView({ behavior: "instant", block: "center" });
        } else {
            window.history.back();
        }
        
    });
}

if(MainPage) {
    BackBtn.style.display = "none";
}


/* =========================================
   SUPABASE ФОРМА ЗА РЕГИСТРАЦИЯ
   ========================================= */

const registerForm = document.querySelector("#registerForm");

if (registerForm) {
    registerForm.addEventListener("submit", async function (event) {
        event.preventDefault();

        const name = document.querySelector("#name").value.trim();
        const email = document.querySelector("#email").value.trim();
        const password = document.querySelector("#password").value;
        const profile = document.querySelector("#profile").value;
        const location = document.querySelector("#location").value.trim();

        if (!name || !email || !password || !profile || !location) {
            alert("Моля, попълни всички задължителни полета.");
            return;
        }

        if (typeof supabaseClient === "undefined") {
            alert("Грешка: Supabase не е зареден.");
            return;
        }

        try {
            const { data, error } = await supabaseClient.auth.signUp({
                email: email,
                password: password,
                options: {
                    data: {
                        name: name,
                        profile_type: profile,
                        location: location
                    }
                }
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

            handlePostAuthRedirect();

        } catch (error) {
            console.error("Registration error:", error);
            alert("Възникна неочаквана грешка: " + error.message);
        }
    });
}


/* =========================================
   SUPABASE ФОРМА ЗА ВХОД (LOGIN)
   ========================================= */

const loginForm = document.querySelector("#loginForm");

if (loginForm) {
    loginForm.addEventListener("submit", async function (event) {
        event.preventDefault();

        const message = document.querySelector("#loginMessage");
        const email = document.querySelector("#email").value.trim();
        const password = document.querySelector("#password").value;

        if (message) message.textContent = "Проверяване...";

        if (!email || !password) {
            if (message) message.textContent = "Моля, въведи имейл и парола.";
            return;
        }

        if (typeof supabaseClient === "undefined") {
            if (message) message.textContent = "Грешка: Supabase не е зареден.";
            return;
        }

        const { data, error } = await supabaseClient.auth.signInWithPassword({
            email: email,
            password: password
        });

        if (error) {
            if (message) message.textContent = "Грешка при вход: " + error.message;
            return;
        }

        if (!data.user) {
            if (message) message.textContent = "Входът не беше успешен.";
            return;
        }

        if (message) message.textContent = "Входът е успешен. Зареждане...";

        handlePostAuthRedirect();
    });
}