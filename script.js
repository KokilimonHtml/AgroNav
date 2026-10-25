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

function handlePostAuthRedirect() {
    window.location.href = "../welcome.html";
}

async function checkAuthAndNavigate(targetAction) {
    if (typeof supabaseClient === "undefined") {
        window.location.href = "pages/login.html";
        return;
    }
    const { data: { session } } = await supabaseClient.auth.getSession();
    if (session) {
        targetAction();
    } else {
        window.location.href = "pages/login.html";
    }
}

if (RegBut) {
    RegBut.addEventListener("click", async function () {
        await checkAuthAndNavigate(function () {
            if (RegMenu) RegMenu.style.display = "flex";
            if (CardOne) CardOne.style.display = "none";
            if (CardTwo) CardTwo.style.display = "none";
            if (BackBtn) BackBtn.style.display = "block";
            if (RegBut) RegBut.style.display = "none";
            if (Hero) Hero.style.display = "none";
            document.body.classList.add("menu-open");
        });
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
            if (MyGardenMenu) MyGardenMenu.style.display = "flex";
            document.body.classList.add("menu-open");
        });
    });
}

if (NewsBut) {
    NewsBut.addEventListener("click", async function () {
        await checkAuthAndNavigate(function () {
            window.location.href = "news.html";
        });
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
    if (BackBtn) BackBtn.style.display = "none";
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
            await showAlert("Моля, попълни всички задължителни полета.", "Грешка");
            return;
        }

        if (typeof supabaseClient === "undefined") {
            await showAlert("Грешка: Supabase не е зареден.", "Системна грешка");
            return;
        }

        try {
            const { data, error } = await supabaseClient.auth.signUp({
                email: email, password: password,
                options: { data: { name: name, profile_type: profile, location: location } }
            });

            if (error) { 
                await showAlert("Грешка при регистрацията: " + error.message, "Грешка");
                return; 
            }
            if (!data.user) { 
                await showAlert("Акаунтът не можа да бъде създаден.", "Грешка");
                return; 
            }
            if (!data.session) {
                await showAlert("Регистрацията е успешна. Провери имейла си, за да потвърдиш акаунта.", "Успешна регистрация");
                return;
            }
            handlePostAuthRedirect();
        } catch (error) {
            console.error("Registration error:", error);
            await showAlert("Възникна неочаквана грешка: " + error.message, "Грешка");
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
        const { data, error } = await supabaseClient.auth.signInWithPassword({ email: email, password: password });

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