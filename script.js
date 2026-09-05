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


/* =========================================
   PROFILE → LOGIN
   ========================================= */

if (registrationButton) {

    registrationButton.addEventListener("click", function () {

        window.location.href = "pages/login.html";

    });

}


/* =========================================
   МОЯТА ГРАДИНА → LOGIN
   ========================================= */

if (gardenButton) {

    gardenButton.addEventListener("click", function () {

        window.location.href = "pages/login.html";

    });

}


/* =========================================
   ПОВЕЧЕ НОВИНИ
   ========================================= */

if (newsButton) {

    newsButton.addEventListener("click", function () {

        const newsMenu =
            document.querySelector(".NewsMenu");

        if (newsMenu) {

            newsMenu.style.display = "block";

            newsMenu.scrollIntoView({
                behavior: "smooth"
            });

        }

    });

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

            const crops =
                document.querySelector("#crops").value.trim();


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


            const {
                data,
                error
            } =
                await supabaseClient.auth.signUp({

                    email: email,
                    password: password

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
               на имейла, няма активна сесия.
            */

            if (!data.session) {

                alert(
                    "Регистрацията е успешна. Провери имейла си, за да потвърдиш акаунта."
                );

                return;

            }


            const {
                error: profileError
            } =
                await supabaseClient
                    .from("profiles")
                    .insert({

                        id: data.user.id,

                        name: name,

                        profile_type: profile,

                        location: location

                    });


            if (profileError) {

                alert(
                    "Акаунтът е създаден, но профилът не можа да бъде записан: "
                    + profileError.message
                );

                return;

            }


            if (crops) {

                localStorage.setItem(
                    "agronavCrops",
                    crops
                );

            }


            window.location.href =
                "dashboard.html";

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


            const email =
                document.querySelector("#email").value.trim();

            const password =
                document.querySelector("#password").value;


            if (!email || !password) {

                alert(
                    "Моля, въведи имейл и парола."
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


            const {
                data,
                error
            } =
                await supabaseClient.auth.signInWithPassword({

                    email: email,

                    password: password

                });


            if (error) {

                alert(
                    "Грешка при вход: "
                    + error.message
                );

                return;

            }


            if (!data.user) {

                alert(
                    "Входът не беше успешен."
                );

                return;

            }


            window.location.href =
                "dashboard.html";

        }
    );

}