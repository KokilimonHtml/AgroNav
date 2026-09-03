const registerForm = document.querySelector("form");

if (registerForm) {

    registerForm.addEventListener("submit", function(event) {

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

        if (!name || !email || !password || !profile || !location) {

            alert("Моля, попълни всички задължителни полета.");

            return;
        }


        /* Запазваме данните */

        localStorage.setItem(
            "agronavName",
            name
        );

        localStorage.setItem(
            "agronavEmail",
            email
        );

        localStorage.setItem(
            "agronavProfile",
            profile
        );

        localStorage.setItem(
            "agronavLocation",
            location
        );

        localStorage.setItem(
            "agronavCrops",
            crops
        );


        /* Отиваме към Dashboard */

        window.location.href =
            "dashboard.html";

    });

}