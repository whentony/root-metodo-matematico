// ==========================================
// Método da Secante - Dados e Algoritmo
// ==========================================

var SecantMethod = {
    id: "secant",
    name: "Método da Secante",

    theory: '<div class="theory-block">' +
        '<p>O <strong>Método da Secante</strong> é uma variação do Método de Newton que <strong>não requer o cálculo da derivada</strong>. Em vez de usar f\'(x), ele aproxima a derivada usando dois pontos anteriores.</p>' +
        '<p>Isso o torna muito prático quando a derivada é difícil de calcular analiticamente. A convergência é superlinear (ordem ~1.618, a razão áurea).</p>' +
        '<h3>A Fórmula de Atualização</h3>' +
        '<p>Dados dois chutes x<sub>n-1</sub> e x<sub>n</sub>, a próxima aproximação é:</p>' +
        '<div class="formula-box"><i>x<sub>n+1</sub> = x<sub>n</sub> - f(x<sub>n</sub>) &middot; (x<sub>n</sub> - x<sub>n-1</sub>) / (f(x<sub>n</sub>) - f(x<sub>n-1</sub>))</i></div>' +
        '<h3>Critério de Parada</h3>' +
        '<p>O algoritmo para quando:</p>' +
        '<div class="formula-box"><i>|x<sub>n+1</sub> - x<sub>n</sub>| &lt; &epsilon; &nbsp; ou &nbsp; |f(x<sub>n</sub>)| &lt; &epsilon;</i></div>' +
        '<h3>Comparação com Newton</h3>' +
        '<ul>' +
        '<li>1. Precisa de <strong>dois</strong> chutes iniciais x<sub>0</sub> e x<sub>1</sub> (em vez de um).</li>' +
        '<li>2. <strong>Não precisa</strong> calcular f\'(x) &mdash; a derivada é aproximada pela reta secante.</li>' +
        '<li>3. Convergência superlinear (~1.618), mais lenta que Newton (quadrática) mas mais rápida que Bisseção (linear).</li>' +
        '</ul>' +
        '</div>',

    code: '% ========================================================================\n' +
        '% GNU Octave - Método da Secante\n' +
        '% ========================================================================\n' +
        '% Palavras Reservadas Utilizadas:\n' +
        '% function ... endfunction : Declara bloco do algoritmo e seus retornos.\n' +
        '% for ... endfor           : Laço de iteração fixo ou até intervenção.\n' +
        '% if ... endif             : Estrutura condicional base.\n' +
        '% error                    : Lança erro fatal por violação matemática.\n' +
        '% return                   : Devolve o resultado imediato.\n' +
        '% abs(...)                 : Função raiz de módulo algebraico.\n' +
        '% ========================================================================\n\n' +
        'function [root, iter] = secantMethod(f, x0, x1, tol, maxIter)\n' +
        '    for iter = 0:(maxIter-1)\n' +
        '        fx0 = f(x0);\n' +
        '        fx1 = f(x1);\n' +
        '        \n' +
        '        % Se f(x0) e f(x1) forem muito próximos causará divisão por 0\n' +
        '        if (abs(fx1 - fx0) < 1e-10)\n' +
        '            error("f(x0) e f(x1) muito próximos (Divisão por zero).");\n' +
        '        endif\n' +
        '        \n' +
        '        % Aplicação da Fórmula da Secante (Aproximação Linear)\n' +
        '        x2 = x1 - fx1 * (x1 - x0) / (fx1 - fx0);\n' +
        '        err = abs(x2 - x1);\n' +
        '        \n' +
        '        % Checagem de critério de parada\n' +
        '        if (err < tol || abs(fx1) < tol)\n' +
        '            root = x2;\n' +
        '            return;\n' +
        '        endif\n' +
        '        \n' +
        '        % Avança os pontos para frente descartando o mais antigo\n' +
        '        x0 = x1;\n' +
        '        x1 = x2;\n' +
        '    endfor\n' +
        '    \n' +
        '    error("Máximo de iterações atingido sem convergência.");\n' +
        'endfunction',

    // Executa o algoritmo
    execute: function (f, params) {
        var x0 = params.x0;
        var x1 = params.x1;
        var tol = params.tol;
        var maxIter = params.maxIter;
        var iterations = [];

        for (var iter = 0; iter < maxIter; iter++) {
            var fx0 = f(x0);
            var fx1 = f(x1);
            if (Math.abs(fx1 - fx0) < 1e-10) {
                throw new Error("f(x0) e f(x1) muito próximos = divisão por zero.");
            }
            var x2 = x1 - fx1 * (x1 - x0) / (fx1 - fx0);
            var error = Math.abs(x2 - x1);
            iterations.push({ iter: iter + 1, x0: x0, x1: x1, fx0: fx0, fx1: fx1, x2: x2, error: error });
            if (error < tol || Math.abs(fx1) < tol) {
                return { root: x2, iterations: iterations };
            }
            x0 = x1;
            x1 = x2;
        }
        throw new Error("Máximo de iterações atingido sem convergência.");
    },

    // Lê os inputs do formulário
    getParams: function () {
        return {
            x0: parseFloat(document.getElementById("secant-x0").value),
            x1: parseFloat(document.getElementById("secant-x1").value)
        };
    },

    // Renderiza a tabela de resultados
    renderTable: function (iterations) {
        var thead = document.querySelector("#results-table thead");
        var tbody = document.querySelector("#results-table tbody");
        thead.innerHTML =
            "<tr>" +
            "<th>Iter</th>" +
            "<th>x<sub>n-1</sub></th>" +
            "<th>x<sub>n</sub></th>" +
            "<th>f(x<sub>n-1</sub>)</th>" +
            "<th>f(x<sub>n</sub>)</th>" +
            "<th>x<sub>n+1</sub></th>" +
            "<th>Erro</th>" +
            "</tr>";

        var rows = "";
        for (var i = 0; i < iterations.length; i++) {
            var it = iterations[i];
            rows +=
                "<tr>" +
                "<td>" + it.iter + "</td>" +
                "<td>" + it.x0.toFixed(6) + "</td>" +
                "<td>" + it.x1.toFixed(6) + "</td>" +
                "<td>" + it.fx0.toFixed(6) + "</td>" +
                "<td>" + it.fx1.toFixed(6) + "</td>" +
                '<td style="color:var(--accent); font-weight:600">' + it.x2.toFixed(6) + "</td>" +
                "<td>" + it.error.toFixed(6) + "</td>" +
                "</tr>";
        }
        tbody.innerHTML = rows;
    },

    // Renderiza passo-a-passo individual
    renderStep: function (stepData, index, allSteps) {
        var str = "<h3>1. Avaliando f(x) nos pontos correntes</h3>";
        str += "<p>Em <strong>x<sub>n-1</sub> = " + stepData.x0.toFixed(6) + "</strong> e <strong>x<sub>n</sub> = " + stepData.x1.toFixed(6) + "</strong>, as saídas são:</p>";
        str += '<div class="formula-box">f(' + stepData.x0.toFixed(6) + ') = ' + stepData.fx0.toFixed(6) + '</div>';
        str += '<div class="formula-box">f(' + stepData.x1.toFixed(6) + ') = ' + stepData.fx1.toFixed(6) + '</div>';

        str += "<h3>2. Encontrando x<sub>n+1</sub> através da Reta Secante</h3>";
        str += "<p>Aplicando os dois pontos avaliados na fórmula da aproximação linear (secante):</p>";
        str += '<div class="formula-box">x<sub>n+1</sub> = ' + stepData.x1.toFixed(6) + " - (" + stepData.fx1.toFixed(6) + " &times; (" + stepData.x1.toFixed(6) + " - " + stepData.x0.toFixed(6) + ")) / (" + stepData.fx1.toFixed(6) + " - " + stepData.fx0.toFixed(6) + ")</div>";
        str += '<div class="formula-box">x<sub>n+1</sub> = <span class="highlight-val">' + stepData.x2.toFixed(6) + '</span></div>';

        if (index === allSteps.length - 1) {
            str += "<p>A tolerância final foi alcançada com Erro Absoluto: <strong>" + stepData.error.toFixed(6) + "</strong>.</p>";
        } else {
            str += "<p>Erro na iteração: <strong>" + stepData.error.toFixed(6) + "</strong> (Ainda acima da tolerância). No próximo passo, <i>x<sub>n-1</sub></i> vira o antigo <i>x<sub>n</sub></i> e usaremos o novo <i>x<sub>n+1</sub></i>.</p>";
        }

        return str;
    }
};
