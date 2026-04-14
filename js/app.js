// ==========================================
// Aplicação Principal - Orquestra os métodos
// ==========================================

document.addEventListener("DOMContentLoaded", function () {

    // Registro de todos os métodos disponíveis
    var METHODS = {
        bisection: BisectionMethod,
        newton: NewtonMethod,
        secant: SecantMethod,
        "briot-ruffini": BriotRuffiniMethod,
        lagrange: LagrangeMethod,
        neville: NevilleMethod
    };

    var currentMethod = "bisection";

    // Elementos do DOM
    var buttons = document.querySelectorAll(".method-selector button");
    var theoryContent = document.getElementById("theory-content");
    var codeBlock = document.getElementById("code-block");
    var form = document.getElementById("calc-form");

    // UI Simulador
    var btnSimulate = document.getElementById("btn-simulate");
    var tableView = document.getElementById("table-view");
    var simView = document.getElementById("simulator-view");
    var btnSimPrev = document.getElementById("btn-sim-prev");
    var btnSimNext = document.getElementById("btn-sim-next");
    var btnStopSim = document.getElementById("btn-stop-sim");
    var simContent = document.getElementById("sim-content");
    var simStepTitle = document.getElementById("sim-step-title");

    // Estado da Simulação
    var simStepsArray = [];
    var currentSimIndex = 0;
    var isSimulating = false;

    // Grupo do input de função
    var funcInputGroup = document.getElementById("func-input-group");
    var funcInput = document.getElementById("func-input");

    // Todos os painéis de inputs específicos por método
    var inputSets = {
        bisection: document.getElementById("bisection-inputs"),
        newton: document.getElementById("newton-inputs"),
        secant: document.getElementById("secant-inputs"),
        "briot-ruffini": document.getElementById("briot-ruffini-inputs"),
        lagrange: document.getElementById("lagrange-inputs"),
        neville: document.getElementById("neville-inputs")
    };

    // ---- Alternar Método ----
    function applyMethod(methodId) {
        currentMethod = methodId;
        var method = METHODS[methodId];

        // Botões ativos
        buttons.forEach(function (btn) {
            if (btn.dataset.method === methodId) {
                btn.classList.add("active");
            } else {
                btn.classList.remove("active");
            }
        });

        // Preencher teoria e código
        theoryContent.innerHTML = method.theory;
        codeBlock.textContent = method.code;

        // Esconder o form genérico f(x) para métodos que não precisam dele
        if (method.hideGenericFunc) {
            funcInputGroup.classList.add("hidden");
            funcInput.required = false;
        } else {
            funcInputGroup.classList.remove("hidden");
            funcInput.required = true;
        }

        // Esconder todos os inputs específicos, mostrar o ativo
        Object.keys(inputSets).forEach(function (key) {
            var el = inputSets[key];
            if (el) {
                el.classList.add("hidden");
                el.querySelectorAll("input").forEach(function (i) { i.required = false; });
            }
        });
        var activeInputs = inputSets[methodId];
        if (activeInputs) {
            activeInputs.classList.remove("hidden");
            activeInputs.querySelectorAll("input").forEach(function (i) { i.required = true; });
        }

        clearResults();
        stopSimulation();
    }

    // Listeners dos botões de navegação de métodos
    buttons.forEach(function (btn) {
        btn.addEventListener("click", function () {
            applyMethod(btn.dataset.method);
        });
    });

    // Estado inicial
    applyMethod("bisection");

    // Engine base
    function runAlgorithm() {
        var method = METHODS[currentMethod];
        var f = null;

        if (!method.hideGenericFunc) {
            var funcStr = document.getElementById("func-input").value;
            f = MathParser.parse(funcStr);
        }

        var tol = parseFloat(document.getElementById("tolerance").value);
        var maxIter = parseInt(document.getElementById("max-iter").value);

        var params = method.getParams();
        params.tol = tol;
        params.maxIter = maxIter;

        return method.execute(f, params);
    }

    // ---- Submissão do Formulário ----
    form.addEventListener("submit", function (e) {
        e.preventDefault();

        if (e.submitter && e.submitter.id === "btn-simulate") {
            startSimulation();
            return;
        }

        clearResults();
        stopSimulation();

        try {
            var result = runAlgorithm();
            var method = METHODS[currentMethod];

            tableView.classList.remove("hidden");

            // Renderizar tabela (Métodos customizados lidam com a própria renderização inteira opcionalmente)
            if (["briot-ruffini", "lagrange", "neville"].includes(currentMethod)) {
                method.renderTable(result);
            } else {
                method.renderTable(result.iterations);
                showFinalResult("Raiz encontrada: " + result.root.toFixed(6), false);
            }

        } catch (error) {
            showFinalResult("Erro: " + error.message, true);
        }
    });

    // Simulador Logic
    btnSimulate.addEventListener("click", function () {
        if (!form.checkValidity()) {
            form.reportValidity();
            return;
        }
        startSimulation();
    });

    function startSimulation() {
        clearResults();
        try {
            var result = runAlgorithm();
            var method = METHODS[currentMethod];

            if (currentMethod === "briot-ruffini") simStepsArray = result.steps || [];
            else if (currentMethod === "lagrange") simStepsArray = result.terms || [];
            else simStepsArray = result.iterations || [];

            if (!simStepsArray || simStepsArray.length === 0) {
                showFinalResult("Não há passos para simular neste cálculo.", true);
                return;
            }

            isSimulating = true;
            currentSimIndex = 0;

            tableView.classList.add("hidden");
            simView.classList.remove("hidden");
            var finalRes = document.getElementById("final-result");
            finalRes.style.display = "none";

            updateSimulationUI();
        } catch (error) {
            showFinalResult("Erro: " + error.message, true);
        }
    }

    function stopSimulation() {
        isSimulating = false;
        simView.classList.add("hidden");
        simStepsArray = [];
        currentSimIndex = 0;

        // Se a tabela tiver conteudo, pode reexibir (por enquanto apenas limpa e força o usuário a apertar "calcular" de novo)
    }

    function updateSimulationUI() {
        var method = METHODS[currentMethod];
        var stepData = simStepsArray[currentSimIndex];

        simStepTitle.textContent = "Passo " + (currentSimIndex + 1) + " de " + simStepsArray.length;

        if (method.renderStep) {
            simContent.innerHTML = method.renderStep(stepData, currentSimIndex, simStepsArray);
        } else {
            simContent.innerHTML = "<p>O simulador visual ainda não foi implementado para este método.</p>";
        }

        btnSimPrev.disabled = (currentSimIndex === 0);
        btnSimNext.disabled = (currentSimIndex === simStepsArray.length - 1);
    }

    btnSimNext.addEventListener("click", function () {
        if (currentSimIndex < simStepsArray.length - 1) {
            currentSimIndex++;
            updateSimulationUI();
        }
    });

    btnSimPrev.addEventListener("click", function () {
        if (currentSimIndex > 0) {
            currentSimIndex--;
            updateSimulationUI();
        }
    });

    btnStopSim.addEventListener("click", stopSimulation);

    // ---- Helpers de UI ----
    function clearResults() {
        var finalRes = document.getElementById("final-result");
        finalRes.style.display = "none";
        document.querySelector("#results-table thead").innerHTML = "";
        document.querySelector("#results-table tbody").innerHTML = "";
    }

    function showFinalResult(msg, isError) {
        var finalRes = document.getElementById("final-result");
        finalRes.textContent = msg;
        finalRes.className = "final-result" + (isError ? " error" : "");
        finalRes.style.display = "block";
    }
});
