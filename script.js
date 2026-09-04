/* =========================================
НАВИГАЦИЯ ОТ НАЧАЛНАТА СТРАНИЦА
========================================= */

const registrationButton =
document.querySelector("#RegistrationBut");

const gardenButton =
document.querySelector("#MyGarden");

const backButton =
document.querySelector("#back-btn");

/* Profile → Register */

if (registrationButton) {

```
registrationButton.addEventListener("click", function() {

    window.location.href = "pages/register.html";

});
```

}

/* Моята градина → Register */

if (gardenButton) {

```
gardenButton.addEventListener("click", function() {

    window.location.href = "pages/register.html";

});
```

}

/* Назад */

if (backButton) {

```
backButton.addEventListener("click", function() {

    window.history.back();

});
```

}

/* =========================================
РЕГИСТРАЦИЯ
========================================= */

const registerForm =
document.querySelector("form");

if (registerForm) {

```
registerForm.addEventListener(
    "submit",
    async function(event) {

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


        /* Създаваме акаунт в Supabase */

        const {
            data,
            error
        } =
            await supabaseClient.auth.signUp({

                email: email,
                password: password

            });


        /* Проверка за грешка при регистрацията */

        if (error) {

            alert(
                "Грешка при регистрацията: "
                + error.message
            );

            return;

        }


        /* Проверка дали Supabase е върнал потребител */

        if (!data.user) {

            alert(
                "Акаунтът не можа да бъде създаден."
            );

            return;

        }


        /* Създаваме профил в таблицата profiles */

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


        /* Проверка за грешка при профила */

        if (profileError) {

            alert(
                "Акаунтът е създаден, но профилът не можа да бъде записан: "
                + profileError.message
            );

            return;

        }


        /* Културите ще ги прехвърлим в таблицата crops
           в следващата стъпка */

        if (crops) {

            localStorage.setItem(
                "agronavCrops",
                crops
            );

        }


        /* Отиваме към Dashboard */

        window.location.href =
            "dashboard.html";

    }
);
```

}