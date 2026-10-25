(function() {
    const savedTheme = localStorage.getItem('theme') || 'dark';
    
    function applyTheme(theme) {
        if (theme === 'light') {
            document.body.classList.add('light-theme');
        } else {
            document.body.classList.remove('light-theme');
        }
        document.querySelectorAll('.theme-toggle-btn').forEach(btn => {
            btn.textContent = theme === 'light' ? '☀️' : '🌙';
        });
    }

    // Прилагаме темата веднага щом HTML-ът се зареди
    document.addEventListener('DOMContentLoaded', () => {
        applyTheme(savedTheme);
        
        // --- ИНИЦИАЛИЗАЦИЯ НА ГЛОБАЛНИЯ МОДАЛ ---
        const modalHtml = `
            <div id="custom-modal-overlay" class="custom-modal-overlay">
                <div class="custom-modal-box">
                    <h3 id="custom-modal-title" class="custom-modal-title">Заглавие</h3>
                    <p id="custom-modal-message" class="custom-modal-message">Съобщение</p>
                    <input type="text" id="custom-modal-input" class="custom-modal-input">
                    <div class="custom-modal-actions">
                        <button id="custom-modal-cancel" class="custom-modal-btn btn-cancel">Отказ</button>
                        <button id="custom-modal-ok" class="custom-modal-btn btn-ok">ОК</button>
                    </div>
                </div>
            </div>
        `;
        document.body.insertAdjacentHTML("beforeend", modalHtml);

        let resolvePromise = null;
        const overlay = document.getElementById("custom-modal-overlay");
        const titleEl = document.getElementById("custom-modal-title");
        const msgEl = document.getElementById("custom-modal-message");
        const inputEl = document.getElementById("custom-modal-input");
        const cancelBtn = document.getElementById("custom-modal-cancel");
        const okBtn = document.getElementById("custom-modal-ok");

        window.showAlert = function(message, title = "Съобщение") {
            return new Promise((resolve) => {
                titleEl.textContent = title;
                msgEl.textContent = message;
                inputEl.style.display = "none";
                cancelBtn.style.display = "none";
                okBtn.textContent = "ОК";
                overlay.classList.add("active");
                
                resolvePromise = () => { overlay.classList.remove("active"); resolve(); };
            });
        };

        window.showConfirm = function(message, title = "Потвърждение") {
            return new Promise((resolve) => {
                titleEl.textContent = title;
                msgEl.textContent = message;
                inputEl.style.display = "none";
                cancelBtn.style.display = "block";
                cancelBtn.textContent = "Отказ";
                okBtn.textContent = "Да";
                overlay.classList.add("active");
                
                resolvePromise = (val) => { overlay.classList.remove("active"); resolve(val); };
            });
        };

        window.showPrompt = function(message, defaultText = "", title = "Въвеждане") {
            return new Promise((resolve) => {
                titleEl.textContent = title;
                msgEl.textContent = message;
                inputEl.style.display = "block";
                inputEl.value = defaultText;
                cancelBtn.style.display = "block";
                cancelBtn.textContent = "Отказ";
                okBtn.textContent = "Запази";
                overlay.classList.add("active");
                setTimeout(() => inputEl.focus(), 100);
                
                resolvePromise = (val) => { overlay.classList.remove("active"); resolve(val); };
            });
        };

        okBtn.addEventListener("click", () => {
            if (resolvePromise) {
                const isPrompt = inputEl.style.display === "block";
                const isAlert = cancelBtn.style.display === "none";
                resolvePromise(isPrompt ? inputEl.value : (isAlert ? true : true));
            }
        });

        cancelBtn.addEventListener("click", () => {
            if (resolvePromise) resolvePromise(false);
        });
        
        overlay.addEventListener("click", (e) => {
            if (e.target === overlay && resolvePromise) {
                resolvePromise(false);
            }
        });
        // ----------------------------------------

        setTimeout(async () => {
            if (typeof supabaseClient !== 'undefined') {
                try {
                    const { data: { user } } = await supabaseClient.auth.getUser();
                    if (user) {
                        const { data } = await supabaseClient.from('profiles').select('theme').eq('id', user.id).maybeSingle();
                        if (data && data.theme) {
                            localStorage.setItem('theme', data.theme);
                            applyTheme(data.theme);
                        } else if (data && !data.theme) {
                            await supabaseClient.from('profiles').update({ theme: savedTheme }).eq('id', user.id);
                        }
                    }
                } catch (e) {
                    console.error("Грешка при синхронизация на темата:", e);
                }
            }
        }, 1000);
    });

    window.toggleTheme = async function() {
        const isLight = document.body.classList.toggle('light-theme');
        const newTheme = isLight ? 'light' : 'dark';
        localStorage.setItem('theme', newTheme);
        applyTheme(newTheme);

        if (typeof supabaseClient !== 'undefined') {
            const { data: { user } } = await supabaseClient.auth.getUser();
            if (user) {
                await supabaseClient.from('profiles').update({ theme: newTheme }).eq('id', user.id);
            }
        }
    };

    document.addEventListener('click', (e) => {
        if (e.target.closest('.theme-toggle-btn')) {
            window.toggleTheme();
        }
    });
})();