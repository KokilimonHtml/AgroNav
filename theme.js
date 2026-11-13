(function() {
    const designs = ['vintage', 'modern', 'contrast'];
    let currentDesign = localStorage.getItem('agronav_design') || 'vintage';
    let currentAppearance = localStorage.getItem('agronav_appearance') || 'dark';

    if (currentDesign === 'vintage') currentAppearance = 'dark';

    document.body.setAttribute('data-design', currentDesign);
    document.body.setAttribute('data-appearance', currentAppearance);

    function updateThemeButton() {
        const headerRight = document.querySelector('.nav-dash-right') || document.querySelector('.nav-right');
        let btn = document.getElementById('appearance-toggle');

        const isAuthPage = window.location.pathname.includes('login.html') || window.location.pathname.includes('register.html');
        if (currentDesign === 'vintage' || isAuthPage) {
            if (btn) btn.remove();
            return;
        }

        if (headerRight && !btn) {
            btn = document.createElement('button');
            btn.id = 'appearance-toggle';
            btn.className = 'theme-toggle-btn';
            btn.title = "Смени светло/тъмно";
            btn.innerHTML = currentAppearance === 'dark' ? '☀️' : '🌙';
            btn.onclick = window.toggleAppearance;
            headerRight.prepend(btn);
        }
    }

    window.changeDesignTheme = function(newDesign) {
        if (!designs.includes(newDesign)) return;
        localStorage.setItem('agronav_design', newDesign);
        currentDesign = newDesign;
        document.body.setAttribute('data-design', newDesign);

        if (newDesign === 'vintage') {
            currentAppearance = 'dark';
            document.body.setAttribute('data-appearance', 'dark');
        }

        updateThemeButton();

        if (typeof supabaseClient !== 'undefined') {
            supabaseClient.auth.getUser().then(({ data: { user } }) => {
                if (user) supabaseClient.from('profiles').update({ design_theme: newDesign }).eq('id', user.id).then();
            });
        }
    };

    window.toggleAppearance = function() {
        if (currentDesign === 'vintage') return;
        currentAppearance = currentAppearance === 'dark' ? 'light' : 'dark';
        localStorage.setItem('agronav_appearance', currentAppearance);
        document.body.setAttribute('data-appearance', currentAppearance);

        const btn = document.getElementById('appearance-toggle');
        if (btn) btn.innerHTML = currentAppearance === 'dark' ? '☀️' : '🌙';

        if (typeof supabaseClient !== 'undefined') {
            supabaseClient.auth.getUser().then(({ data: { user } }) => {
                if (user) supabaseClient.from('profiles').update({ theme: currentAppearance }).eq('id', user.id).then();
            });
        }
    };

    /* =========================================================
       ГЛОБАЛНИ МОДАЛИ: showAlert / showConfirm / showPrompt
       ========================================================= */
    const MODAL_HTML = `
        <div id="custom-modal-overlay" class="custom-modal-overlay">
            <div class="custom-modal-box">
                <h3 id="custom-modal-title" class="custom-modal-title">Заглавие</h3>
                <p id="custom-modal-message" class="custom-modal-message">Съобщение</p>
                <input type="text" id="custom-modal-input" class="custom-modal-input">
                <div class="custom-modal-actions">
                    <button type="button" id="custom-modal-cancel" class="custom-modal-btn btn-cancel">Отказ</button>
                    <button type="button" id="custom-modal-ok" class="custom-modal-btn btn-ok">ОК</button>
                </div>
            </div>
        </div>`;

    let modalResolver = null;

    function ensureModal() {
        if (document.getElementById("custom-modal-overlay")) return;
        document.body.insertAdjacentHTML("beforeend", MODAL_HTML);
        document.getElementById("custom-modal-ok").addEventListener("click", onModalOk);
        document.getElementById("custom-modal-cancel").addEventListener("click", onModalCancel);
        document.getElementById("custom-modal-overlay").addEventListener("click", (e) => {
            if (e.target.id === "custom-modal-overlay") onModalCancel();
        });
    }

    function els() {
        return {
            overlay: document.getElementById("custom-modal-overlay"),
            title:   document.getElementById("custom-modal-title"),
            message: document.getElementById("custom-modal-message"),
            input:   document.getElementById("custom-modal-input"),
            cancel:  document.getElementById("custom-modal-cancel"),
            ok:      document.getElementById("custom-modal-ok"),
        };
    }

    function closeWith(value) {
        if (!modalResolver) return;
        const r = modalResolver;
        modalResolver = null;
        els().overlay.classList.remove("active");
        r(value);
    }

    function onModalOk() {
        const e = els();
        const isPrompt = e.input.style.display !== "none";
        closeWith(isPrompt ? e.input.value : true);
    }

    function onModalCancel() {
        closeWith(false);
    }

    window.showAlert = function(message, title = "Съобщение") {
        ensureModal();
        const e = els();
        return new Promise((resolve) => {
            e.title.textContent = title;
            e.message.textContent = message;
            e.input.style.display = "none";
            e.cancel.style.display = "none";
            e.ok.textContent = "ОК";
            e.overlay.classList.add("active");
            modalResolver = () => resolve(true);
        });
    };

    window.showConfirm = function(message, title = "Потвърждение") {
        ensureModal();
        const e = els();
        return new Promise((resolve) => {
            e.title.textContent = title;
            e.message.textContent = message;
            e.input.style.display = "none";
            e.cancel.style.display = "";
            e.cancel.textContent = "Отказ";
            e.ok.textContent = "Да";
            e.overlay.classList.add("active");
            modalResolver = (v) => resolve(v === true);
        });
    };

    window.showPrompt = function(message, defaultValue = "", title = "Въвеждане") {
        ensureModal();
        const e = els();
        return new Promise((resolve) => {
            e.title.textContent = title;
            e.message.textContent = message;
            e.input.style.display = "block";
            e.input.value = defaultValue;
            e.cancel.style.display = "";
            e.cancel.textContent = "Отказ";
            e.ok.textContent = "Запази";
            e.overlay.classList.add("active");
            setTimeout(() => e.input.focus(), 50);
            modalResolver = (v) => resolve(v);
        });
    };

    document.addEventListener('DOMContentLoaded', async () => {
        ensureModal();
        updateThemeButton();

        // --- ЛОГИКА ЗА ГЛОБАЛНОТО ЛОГО ---
        const globalLogos = document.querySelectorAll('.global-logo');
        if (globalLogos.length > 0) {
            let isLoggedIn = false;
            if (typeof supabaseClient !== 'undefined') {
                try {
                    const { data: { session } } = await supabaseClient.auth.getSession();
                    isLoggedIn = !!session;
                } catch (e) {
                    console.error("Грешка при проверка на сесията за логото:", e);
                }
            }

            // Проверяваме дали сме в подпапка (pages/), за да сложим правилния път
            const isSubPage = window.location.pathname.includes('/pages/');
            
            // Ако е логнат -> welcome.html, ако не -> index.html
            const targetUrl = isLoggedIn 
                ? (isSubPage ? '../welcome.html' : 'welcome.html') 
                : (isSubPage ? '../index.html' : 'index.html');

            globalLogos.forEach(logo => {
                logo.href = targetUrl;
            });
        }
        // ----------------------------------

        setTimeout(async () => {
            if (typeof supabaseClient !== 'undefined') {
                try {
                    const { data: { user } } = await supabaseClient.auth.getUser();
                    if (user) {
                        const { data } = await supabaseClient.from('profiles').select('theme, design_theme').eq('id', user.id).maybeSingle();
                        if (data) {
                            if (data.design_theme && data.design_theme !== currentDesign) {
                                window.changeDesignTheme(data.design_theme);
                            } else if (data.theme && data.theme !== currentAppearance && currentDesign !== 'vintage') {
                                currentAppearance = data.theme;
                                document.body.setAttribute('data-appearance', currentAppearance);
                                const btn = document.getElementById('appearance-toggle');
                                if (btn) btn.innerHTML = currentAppearance === 'dark' ? '☀️' : '🌙';
                            }
                        }
                    }
                } catch (e) { console.error("Theme sync error:", e); }
            }
        }, 500);
    });
})();