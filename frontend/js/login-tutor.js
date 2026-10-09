(() => {
const API_URL = "http://localhost:3000/api";


function iniciarLoginTutor() {
    const areaCadastro = document.getElementById("areaCadastro");
    const linkLogin = document.getElementById("abrirLogin");

    if (
        !areaCadastro ||
        !linkLogin ||
        document.getElementById("loginTutorOverlay")
    ) {
        return;
    }

    const estilos = document.createElement("style");

    estilos.textContent = `
        .login-tutor-overlay[hidden] {
            display: none !important;
        }

        .login-tutor-overlay {
            position: fixed;
            inset: 0;
            background: rgba(3, 28, 53, .62);
            display: flex;
            align-items: center;
            justify-content: center;
            padding: 18px;
            z-index: 9999;
        }

        .login-tutor-modal {
            position: relative;
            width: min(100%, 440px);
            max-height: 90vh;
            overflow-y: auto;
            background: #fff;
            border-radius: 20px;
            padding: 30px;
            box-shadow: 0 18px 60px rgba(0, 0, 0, .25);
            font-family: Arial, sans-serif;
            color: #203448;
            box-sizing: border-box;
        }

        .login-tutor-modal h2 {
            color: #044281;
            margin: 0 0 8px;
            font-size: 26px;
        }

        .login-tutor-modal p {
            margin: 0 0 22px;
            color: #617487;
            line-height: 1.5;
        }

        .login-tutor-campo {
            display: flex;
            flex-direction: column;
            gap: 7px;
            margin-bottom: 16px;
        }

        .login-tutor-campo label {
            font-weight: 700;
            color: #163b5c;
        }

        .login-tutor-campo input {
            width: 100%;
            padding: 13px;
            border: 2px solid #b7d7ef;
            border-radius: 10px;
            font-size: 16px;
            box-sizing: border-box;
        }

        .login-tutor-campo input:focus {
            outline: none;
            border-color: #0757a6;
        }

        .login-tutor-senha {
            position: relative;
        }

        .login-tutor-senha input {
            padding-right: 48px;
        }

        .login-tutor-mostrar {
            position: absolute;
            right: 7px;
            top: 6px;
            width: 36px;
            height: 36px;
            border: 0;
            background: transparent;
            color: #0757a6;
            cursor: pointer;
        }

        .login-tutor-acoes {
            display: flex;
            gap: 10px;
            margin-top: 22px;
        }

        .login-tutor-acoes button {
            flex: 1;
            border: 0;
            border-radius: 10px;
            padding: 13px;
            font-weight: 700;
            font-size: 15px;
            cursor: pointer;
        }

        .login-tutor-cancelar {
            background: #eaf3fa;
            color: #044281;
        }

        .login-tutor-enviar {
            background: #0757a6;
            color: #fff;
        }

        .login-tutor-enviar:disabled {
            opacity: .65;
            cursor: wait;
        }

        .login-tutor-erro {
            display: none;
            margin-top: 12px;
            padding: 10px 12px;
            background: #fff0f0;
            color: #a12c2c;
            border-radius: 9px;
            font-size: 14px;
        }

        .login-tutor-fechar {
            position: absolute;
            top: 12px;
            right: 14px;
            border: 0;
            background: transparent;
            font-size: 24px;
            color: #587086;
            cursor: pointer;
        }

        @media (max-width: 480px) {
            .login-tutor-modal {
                padding: 24px 19px;
            }

            .login-tutor-modal h2 {
                font-size: 23px;
            }
        }
    `;

    document.head.appendChild(estilos);

    const overlay = document.createElement("div");
    overlay.id = "loginTutorOverlay";
    overlay.className = "login-tutor-overlay";
    overlay.hidden = true;

    overlay.innerHTML = `
        <section
            class="login-tutor-modal"
            role="dialog"
            aria-modal="true"
            aria-labelledby="tituloLoginTutor"
        >
            <button
                type="button"
                class="login-tutor-fechar"
                aria-label="Fechar"
            >&times;</button>

            <h2 id="tituloLoginTutor">Entrar no Agenda Pet</h2>

            <p>
                Digite o CPF e a senha usados no seu cadastro
                para acessar seus dados e os dos seus pets.
            </p>

            <form id="formLoginTutor">
                <div class="login-tutor-campo">
                    <label for="loginCpfTutor">CPF</label>
                    <input
                        id="loginCpfTutor"
                        type="text"
                        inputmode="numeric"
                        autocomplete="username"
                        placeholder="000.000.000-00"
                        maxlength="14"
                        required
                    >
                </div>

                <div class="login-tutor-campo">
                    <label for="loginSenhaTutor">Senha</label>

                    <div class="login-tutor-senha">
                        <input
                            id="loginSenhaTutor"
                            type="password"
                            autocomplete="current-password"
                            placeholder="Sua senha"
                            required
                        >

                        <button
                            class="login-tutor-mostrar"
                            type="button"
                            aria-label="Mostrar senha"
                        >
                            <i class="fa-solid fa-eye"></i>
                        </button>
                    </div>
                </div>

                <div
                    class="login-tutor-erro"
                    id="erroLoginTutor"
                    role="alert"
                ></div>

                <div class="login-tutor-acoes">
                    <button
                        type="button"
                        class="login-tutor-cancelar"
                    >Cancelar</button>

                    <button
                        type="submit"
                        class="login-tutor-enviar"
                    >Entrar</button>
                </div>
            </form>
        </section>
    `;

    document.body.appendChild(overlay);

    const form = overlay.querySelector("#formLoginTutor");
    const cpf = overlay.querySelector("#loginCpfTutor");
    const senha = overlay.querySelector("#loginSenhaTutor");
    const erro = overlay.querySelector("#erroLoginTutor");
    const enviar = overlay.querySelector(".login-tutor-enviar");

    function fechar() {
        overlay.hidden = true;
        erro.style.display = "none";
        linkLogin.focus();
    }

    function abrir(event) {
        if (event) {
            event.preventDefault();
        }

        overlay.hidden = false;
        erro.style.display = "none";
        cpf.focus();
    }

    linkLogin.addEventListener("click", abrir);

    overlay.querySelector(".login-tutor-fechar")
        .addEventListener("click", fechar);

    overlay.querySelector(".login-tutor-cancelar")
        .addEventListener("click", fechar);

    overlay.addEventListener("click", (event) => {
        if (event.target === overlay) {
            fechar();
        }
    });

    document.addEventListener("keydown", (event) => {
        if (event.key === "Escape" && !overlay.hidden) {
            fechar();
        }
    });

    cpf.addEventListener("input", () => {
        const numeros = cpf.value.replace(/\D/g, "").slice(0, 11);

        cpf.value = numeros
            .replace(/(\d{3})(\d)/, "$1.$2")
            .replace(/(\d{3})(\d)/, "$1.$2")
            .replace(/(\d{3})(\d{1,2})$/, "$1-$2");
    });

    overlay.querySelector(".login-tutor-mostrar")
        .addEventListener("click", (event) => {
            const mostrar = senha.type === "password";

            senha.type = mostrar ? "text" : "password";

            event.currentTarget.innerHTML = mostrar
                ? '<i class="fa-solid fa-eye-slash"></i>'
                : '<i class="fa-solid fa-eye"></i>';

            event.currentTarget.setAttribute(
                "aria-label",
                mostrar ? "Ocultar senha" : "Mostrar senha"
            );
        });

    form.addEventListener("submit", async (event) => {
        event.preventDefault();

        erro.style.display = "none";
        enviar.disabled = true;
        enviar.textContent = "Entrando...";

        try {
            const resposta = await fetch(`${API_URL}/tutores/login`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify({
                    cpf: cpf.value.replace(/\D/g, ""),
                    senha: senha.value
                })
            });

            const dados = await resposta.json().catch(() => ({}));

            if (!resposta.ok) {
                throw new Error(
                    dados.mensagem || "Não foi possível entrar. Confira seus dados."
                );
            }

            const tutor = dados.tutor;

            if (!tutor || !tutor.id) {
                throw new Error(
                    "O servidor não retornou os dados do tutor."
                );
            }

            sessionStorage.setItem(
                "agendaPetTutorId",
                String(tutor.id)
            );

            sessionStorage.setItem(
                "tutor_id",
                String(tutor.id)
            );

            window.location.href =
                `perfil.html?tutor_id=${encodeURIComponent(tutor.id)}`;
        } catch (erroLogin) {
            erro.textContent =
                erroLogin.message ||
                "Não foi possível entrar. Confira seus dados.";

            erro.style.display = "block";
        } finally {
            enviar.disabled = false;
            enviar.textContent = "Entrar";
        }
    });
}

if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", iniciarLoginTutor);
} else {
    iniciarLoginTutor();
}


})();
