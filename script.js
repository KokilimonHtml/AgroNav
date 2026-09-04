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
   PROFILE → REGISTER
   ========================================= */

if (registrationButton) {

    registrationButton.addEventListener("click", function () {

        window.location.href = "pages/register.html";

    });

}


/* =========================================
   МОЯТА ГРАДИНА → REGISTER
   ========================================= */

if (gardenButton) {

    gardenButton.addEventListener("click", function () {

        window.location.href = "pages/register.html";

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
   РЕГИСТРАЦИЯ
   ========================================= */

const registerForm =
    document.querySelector("form");


if (registerForm) {

    registerForm.addEventListener(
        "submit",
        async function (event) {

            event.preventDefault();


            /* Вземаме стойностите от формата */

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


            /* Проверка на задължителните полета */

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


            /* Проверка дали Supabase е зареден */

            if (
                typeof supabaseClient === "undefined"
            ) {

                alert(
                    "Грешка: Supabase не е зареден."
                );

                return;

            }


            /* =========================================
               СЪЗДАВАНЕ НА АКАУНТ
               ========================================= */

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


            /* =========================================
               СЪЗДАВАНЕ НА ПРОФИЛ
               ========================================= */

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


            /* =========================================
               ЗАПАЗВАНЕ НА КУЛТУРИТЕ ВРЕМЕННО
               ========================================= */

            if (crops) {

                localStorage.setItem(
                    "agronavCrops",
                    crops
                );

            }


            /* =========================================
               DASHBOARD
               ========================================= */

            window.location.href =
                "dashboard.html";

        }
    );

}