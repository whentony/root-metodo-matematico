// ==========================================
// Método de Newton-Raphson - Dados e Algoritmo
// ==========================================

var NewtonMethod = {
    id: "newton",
    name: "Método de Newton-Raphson",

    theory: '<div class="theory-block">' +
        '<p>O <strong>Método de Newton-Raphson</strong> (ou Método de Newton) produz aproximações sucessivamente melhores para as raízes de uma função com valor real usando também sua derivada.</p>' +
        '<p>Ele requer o cálculo da derivada da função f\'(x) e sua convergência é muito mais rápida (convergência quadrática) do que o método da bisseção, desde que o chute inicial esteja próximo o suficiente da raiz verdadeira.</p>' +
        '<h3>A Fórmula de Atualização</h3>' +
        '<p>Dado um chute atual x<sub>n</sub>, a próxima aproximação x<sub>n+1</sub> é computada seguindo a reta tangente:</p>' +
        '<div class="formula-box"><i>x<sub>n+1</sub> = x<sub>n</sub> - f(x<sub>n</sub>) / f\'(x<sub>n</sub>)</i></div>' +
        '<h3>Critério de Parada</h3>' +
        '<p>O algoritmo é interrompido no momento em que:</p>' +
        '<div class="formula-box"><i>|x<sub>n+1</sub> - x<sub>n</sub>| &lt; &epsilon; &nbsp; ou &nbsp; |f(x<sub>n</sub>)| &lt; &epsilon;</i></div>' +
        '<h3>Requisitos</h3>' +
        '<ul>' +
        '<li>1. Precisamos de um único chute inicial x<sub>0</sub>.</li>' +
        '<li>2. A derivada f\'(x) não deve ser nula nas iterações (evita divisão por zero).</li>' +
        '<li>3. Diferentemente da Bisseção, a convergência global não é garantida se x<sub>0</sub> estiver longe.</li>' +
        '</ul>' +
        '</div>',

    code: '% ========================================================================\n' +
        '% GNU Octave - Método de Newton-Raphson\n' +
        '% ========================================================================\n' +
        '% Palavras Reservadas Utilizadas:\n' +
        '% function ... endfunction : Declara bloco do algoritmo e seus retornos.\n' +
        '% if ... endif             : Estrutura condicional base.\n' +
        '% while ... endwhile       : Laço de repetição baseado em condição.\n' +
        '% error                    : Lança um erro fatal ou exceção.\n' +
        '% return                   : Devolve o resultado imediato.\n' +
        '% abs(...)                 : Função raiz de módulo algebraico.\n' +
        '% ========================================================================\n\n' +
        'function [root, iter] = newtonMethod(f, df, x0, tol, maxIter)\n' +
        '    x = x0;\n' +
        '    iter = 0;\n' +
        '    \n' +
        '    while (iter < maxIter)\n' +
        '        fx = f(x);\n' +
        '        dfx = df(x);\n' +
        '        \n' +
        '        % Se a inclinação tender a zero corremos risco de Div/0\n' +
        '        if (abs(dfx) < 1e-10)\n' +
        '            error("Derivada próxima de zero.");\n' +
        '        endif\n' +
        '        \n' +
        '        % Aplicação da Fórmula da Intersecção Tangente\n' +
        '        x_next = x - fx / dfx;\n' +
        '        err = abs(x_next - x);\n' +
        '        \n' +
        '        % Convergiu à raiz na tolerância fixada?\n' +
        '        if (err < tol || abs(fx) < tol)\n' +
        '            root = x_next;\n' +
        '            return;\n' +
        '        endif\n' +
        '        \n' +
        '        % Substitui o último x para ser avaliado no próximo ciclo\n' +
        '        x = x_next;\n' +
        '        iter = iter + 1;\n' +
        '    endwhile\n' +
        '    \n' +
        '    error("Máximo de iterações atingido sem convergência.");\n' +
        'endfunction',

    // Executa o algoritmo
    execute: function (f, params) {
        var x = params.x0;
        var tol = params.tol;
        var maxIter = params.maxIter;
        var iter = 0, iterations = [];

        while (iter < maxIter) {
            var fx = f(x);
            var dfx = MathParser.numericalDerivative(f, x);
            if (Math.abs(dfx) < 1e-10) {
                throw new Error("Derivada próxima de zero = possível divisão por zero.");
            }
            var x_next = x - fx / dfx;
            var error = Math.abs(x_next - x);

            iterations.push({ iter: iter + 1, x: x, fx: fx, dfx: dfx, x_next: x_next, error: error });
            if (error < tol || Math.abs(fx) < tol) {
                return { root: x_next, iterations: iterations };
            }
            x = x_next;
            iter++;
        }
        throw new Error("Máximo de iterações atingido sem convergência.");
    },

    // Lê os inputs do formulário
    getParams: function () {
        return {
            x0: parseFloat(document.getElementById("initial-guess").value)
        };
    },

    // Renderiza a tabela de resultados
    renderTable: function (iterations) {
        var thead = document.querySelector("#results-table thead");
        var tbody = document.querySelector("#results-table tbody");
        thead.innerHTML =
            "<tr>" +
            "<th>Iter</th>" +
            "<th>x<sub>n</sub></th>" +
            "<th>f(x<sub>n</sub>)</th>" +
            "<th>f'(x<sub>n</sub>)</th>" +
            "<th>x<sub>n+1</sub></th>" +
            "<th>Erro</th>" +
            "</tr>";

        var rows = "";
        for (var i = 0; i < iterations.length; i++) {
            var it = iterations[i];
            rows +=
                "<tr>" +
                "<td>" + it.iter + "</td>" +
                "<td>" + it.x.toFixed(6) + "</td>" +
                "<td>" + it.fx.toFixed(6) + "</td>" +
                "<td>" + it.dfx.toFixed(6) + "</td>" +
                '<td style="color:var(--accent); font-weight:600">' + it.x_next.toFixed(6) + "</td>" +
                "<td>" + it.error.toFixed(6) + "</td>" +
                "</tr>";
        }
        tbody.innerHTML = rows;
    },

    // Renderiza passo-a-passo individual
    renderStep: function (stepData, index, allSteps) {
        var str = "<h3>1. Calculando f(x) e f'(x)</h3>";
        str += "<p>As avaliações no chute atual <strong>x<sub>" + index + "</sub> = " + stepData.x.toFixed(6) + "</strong> resultam em:</p>";
        str += '<div class="formula-box">f(' + stepData.x.toFixed(6) + ') = ' + stepData.fx.toFixed(6) + '</div>';
        str += '<div class="formula-box">f\'(' + stepData.x.toFixed(6) + ') = ' + stepData.dfx.toFixed(6) + '</div>';

        str += "<h3>2. Encontrando a intersecção da reta tangente (Newton)</h3>";
        str += '<div class="formula-box">x<sub>' + (index + 1) + '</sub> = x<sub>' + index + '</sub> - f(x<sub>' + index + '</sub>) / f\'(x<sub>' + index + '</sub>)</div>';
        str += "<p>Substituindo os valores calculados na iteração:</p>";
        str += '<div class="formula-box">x<sub>' + (index + 1) + '</sub> = ' + stepData.x.toFixed(6) + " - (" + stepData.fx.toFixed(6) + ") / (" + stepData.dfx.toFixed(6) + ") = <span class='highlight-val'>" + stepData.x_next.toFixed(6) + "</span></div>";

        if (index === allSteps.length - 1) {
            str += "<p>Avaliando o critério de parada... A convergência final foi alcançada com Erro de passo: <strong>" + stepData.error.toFixed(6) + "</strong>.</p>";
        } else {
            str += "<p>O Erro do passo iterativo (diferença absoluta para o 'x' anterior) foi: <strong>" + stepData.error.toFixed(6) + "</strong> (Ainda necessita continuar rodando).</p>";
        }

        return str;
    }
};
