/* =========================================
   AGRO NAV - ОСНОВЕН JAVASCRIPT
   ========================================= */


/* =========================================
   НАЧАЛНА СТРАНИЦА
   ========================================= */

const registrationButton =
    document.querySelector("#RegistrationBut");

const gardenButton =
    document.querySelector("#MyGarden");

const newsButton =
    document.querySelector("#news-button");

const backButton =
    document.querySelector("#back-btn");

    const MyGardenMenu= document.querySelector("#MyGardenMenu");
    const NewsMenu= document.querySelector("#NewsMenu");
    




/* =========================================
   PROFILE → LOGIN
   ========================================= */

if (registrationButton) {

    registrationButton.addEventListener("click", function () {

        window.location.href = "pages/login.html";

    });

}

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

if (registrationButton) {
    registrationButton.addEventListener("click", function () {
        sessionStorage.removeItem("redirectAfterLogin");
        window.location.href = "pages/login.html";
    });
}


if (gardenButton) {
    gardenButton.addEventListener("click", () => loginAndNavigate("dashboard.html"));
}
if (MyGardenMenu) {
    MyGardenMenu.addEventListener("click", () => loginAndNavigate("dashboard.html"));
}

if (newsButton) {
    newsButton.addEventListener("click", () => loginAndNavigate("news.html"));
}
if (NewsMenu) {
    NewsMenu.addEventListener("click", () => loginAndNavigate("news.html"));
}



/* =========================================
   НАЗАД
   ========================================= */

if (backButton) {

    backButton.addEventListener("click", function () {

        window.history.back();

    });

}


/* =========================================
   REGISTRATION
   ========================================= */

const registerForm =
    document.querySelector("#registerForm");


if (registerForm) {

    registerForm.addEventListener(
        "submit",
        async function (event) {

            event.preventDefault();

            const name =
                document.querySelector("#name").value.trim();

            const email =
                document.querySelector("#email").value.trim();

            const password =
                document.querySelector("#password").value;

            const profile =
                document.querySelector("#profile").value;

            const location =
                document.querySelector("#location").value.trim();


            if (
                !name ||
                !email ||
                !password ||
                !profile ||
                !location
            ) {

                alert(
                    "Моля, попълни всички задължителни полета."
                );

                return;

            }


            if (
                typeof supabaseClient === "undefined"
            ) {

                alert(
                    "Грешка: Supabase не е зареден."
                );

                return;

            }


            try {

                const {
                    data,
                    error
                } =
                    await supabaseClient.auth.signUp({

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

                    alert(
                        "Грешка при регистрацията: "
                        + error.message
                    );

                    return;

                }


                if (!data.user) {

                    alert(
                        "Акаунтът не можа да бъде създаден."
                    );

                    return;

                }


                /*
                   Ако Supabase изисква потвърждение
                   на имейла.
                */

                if (!data.session) {

                    alert(
                        "Регистрацията е успешна. Провери имейла си, за да потвърдиш акаунта."
                    );

                    return;

                }

              handlePostAuthRedirect();
              

            } catch (error) {

                console.error(
                    "Registration error:",
                    error
                );

                alert(
                    "Възникна неочаквана грешка: "
                    + error.message
                );

            }

        }
    );

}


/* =========================================
   LOGIN
   ========================================= */

const loginForm =
    document.querySelector("#loginForm");

    


if (loginForm) {

    loginForm.addEventListener(
        "submit",
        async function (event) {

            event.preventDefault();

            const message =
                document.querySelector("#loginMessage");

            const email =
                document.querySelector("#email").value.trim();

            const password =
                document.querySelector("#password").value;


            message.textContent = "Проверяване...";


            if (!email || !password) {

                message.textContent =
                    "Моля, въведи имейл и парола.";

                return;

            }


            if (
                typeof supabaseClient === "undefined"
            ) {

                message.textContent =
                    "Грешка: Supabase не е зареден.";

                return;

            }


            const {
                data,
                error
            } =
                await supabaseClient.auth.signInWithPassword({

                    email: email,

                    password: password

                });


            if (error) {

                message.textContent =
                    "Грешка при вход: "
                    + error.message;

                return;

            }


            if (!data.user) {

                message.textContent =
                    "Входът не беше успешен.";

                return;

            }


            message.textContent =
                "Входът е успешен. Зареждане...";


            handlePostAuthRedirect();

        }
    );

}

