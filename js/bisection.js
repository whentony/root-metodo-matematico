// ==========================================
// Método da Bisseção - Dados e Algoritmo
// ==========================================

var BisectionMethod = {
    id: "bisection",
    name: "Método da Bisseção",

    theory: '<div class="theory-block">' +
        '<p>O <strong>Método da Bisseção</strong> é um algoritmo de busca de raízes que repetidamente divide um intervalo pela metade e então seleciona o subintervalo no qual a raiz deve existir para processamento posterior.</p>' +
        '<p>O método convergirá obrigatoriamente se a função for contínua no intervalo [a, b] e f(a) e f(b) tiverem sinais opostos (Teorema de Bolzano).</p>' +
        '<h3>A Fórmula de Atualização</h3>' +
        '<p>Em cada iteração, o ponto médio c do intervalo é calculado como:</p>' +
        '<div class="formula-box"><i>c = (a + b) / 2</i></div>' +
        '<h3>Critério de Parada</h3>' +
        '<p>O algoritmo para quando a tolerância de erro &epsilon; for alcançada:</p>' +
        '<div class="formula-box"><i>|f(c)| &lt; &epsilon; &nbsp; ou &nbsp; |b - a| / 2 &lt; &epsilon;</i></div>' +
        '<h3>Passo a Passo do Algoritmo</h3>' +
        '<ul>' +
        '<li>1. Determine estimativas iniciais a e b de forma que <i>f(a) &times; f(b) &lt; 0</i>.</li>' +
        '<li>2. Calcule o ponto médio <i>c = (a+b)/2</i>.</li>' +
        '<li>3. Se <i>f(a) &times; f(c) &lt; 0</i>, a raiz está no subintervalo [a, c]. Atribua <i>b = c</i>.</li>' +
        '<li>4. Caso contrário, a raiz está em [c, b]. Atribua <i>a = c</i>.</li>' +
        '<li>5. Repita até que a aproximação seja precisa o suficiente.</li>' +
        '</ul>' +
        '</div>',

    code: '% ========================================================================\n' +
        '% GNU Octave - Método da Bisseção\n' +
        '% ========================================================================\n' +
        '% Palavras Reservadas Utilizadas:\n' +
        '% function ... endfunction : Declara bloco do algoritmo e seus retornos.\n' +
        '% if ... else ... endif    : Estruturas condicionais base.\n' +
        '% while ... endwhile       : Laço de repetição baseado em condição.\n' +
        '% error                    : Lança um erro fatal e interrompe.\n' +
        '% break                    : Sai do laço while de forma antecipada.\n' +
        '% abs(...)                 : Retorna o valor absoluto.\n' +
        '% ========================================================================\n\n' +
        'function [root, iter] = bisectionMethod(f, a, b, tol, maxIter)\n' +
        '    % 1. Verifica consistência dos sinais\n' +
        '    if (f(a) * f(b) >= 0)\n' +
        '        error("f(a) e f(b) devem ter sinais opostos.");\n' +
        '    endif\n' +
        '    \n' +
        '    iter = 0;\n' +
        '    c = a;\n' +
        '    \n' +
        '    % Controle de tolerância de distância ou limite de iterações\n' +
        '    while ((b - a) / 2 > tol && iter < maxIter)\n' +
        '        % 2. Média do intervalo\n' +
        '        c = (a + b) / 2;\n' +
        '        fc = f(c);\n' +
        '        \n' +
        '        % Se a resposta for exata no chute médio\n' +
        '        if (fc == 0)\n' +
        '            break;\n' +
        '        endif\n' +
        '        \n' +
        '        % 3 e 4. Descarta o lado do intervalo de mesmo sinal\n' +
        '        if (f(a) * fc < 0)\n' +
        '            b = c;\n' +
        '        else\n' +
        '            a = c;\n' +
        '        endif\n' +
        '        \n' +
        '        iter = iter + 1;\n' +
        '    endwhile\n' +
        '    \n' +
        '    root = c;\n' +
        'endfunction',

    // Executa o algoritmo de fato
    execute: function (f, params) {
        var a = params.a;
        var b = params.b;
        var tol = params.tol;
        var maxIter = params.maxIter;

        if (f(a) * f(b) >= 0) {
            throw new Error("f(a) e f(b) devem ter sinais opostos. Tente outro intervalo.");
        }
        var iter = 0, c = a, iterations = [];
        while ((b - a) / 2 > tol && iter < maxIter) {
            c = (a + b) / 2;
            var fc = f(c);
            iterations.push({ iter: iter + 1, a: a, b: b, c: c, fc: fc, error: Math.abs(b - a) / 2 });
            if (fc === 0) break;
            if (f(a) * fc < 0) { b = c; }
            else { a = c; }
            iter++;
        }
        return { root: c, iterations: iterations };
    },

    // Lê os inputs do formulário
    getParams: function () {
        return {
            a: parseFloat(document.getElementById("interval-a").value),
            b: parseFloat(document.getElementById("interval-b").value)
        };
    },

    // Renderiza a tabela de resultados
    renderTable: function (iterations) {
        var thead = document.querySelector("#results-table thead");
        var tbody = document.querySelector("#results-table tbody");
        thead.innerHTML =
            "<tr>" +
            "<th>Iter</th>" +
            "<th>a</th>" +
            "<th>b</th>" +
            "<th>c (meio)</th>" +
            "<th>f(c)</th>" +
            "<th>Erro</th>" +
            "</tr>";

        var rows = "";
        for (var i = 0; i < iterations.length; i++) {
            var it = iterations[i];
            rows +=
                "<tr>" +
                "<td>" + it.iter + "</td>" +
                "<td>" + it.a.toFixed(6) + "</td>" +
                "<td>" + it.b.toFixed(6) + "</td>" +
                '<td style="color:var(--accent); font-weight:600">' + it.c.toFixed(6) + "</td>" +
                "<td>" + it.fc.toFixed(6) + "</td>" +
                "<td>" + it.error.toFixed(6) + "</td>" +
                "</tr>";
        }
        tbody.innerHTML = rows;
    },

    // Renderiza passo-a-passo individual
    renderStep: function (stepData, index, allSteps) {
        var str = "<h3>1. Calculando o Ponto Médio</h3>";
        str += '<div class="formula-box">c = (a + b) / 2</div>';
        str += "<p>Substituindo de a = <strong>" + stepData.a.toFixed(6) + "</strong> e b = <strong>" + stepData.b.toFixed(6) + "</strong>:</p>";
        str += '<div class="formula-box">c = (' + stepData.a.toFixed(6) + " + " + stepData.b.toFixed(6) + ") / 2 = <span class='highlight-val'>" + stepData.c.toFixed(6) + "</span></div>";

        str += "<h3>2. Avaliando a Função</h3>";
        str += "<p>Avaliando f(x) no novo ponto médio <strong>c</strong>:</p>";
        str += '<div class="formula-box">f(' + stepData.c.toFixed(6) + ') = ' + stepData.fc.toFixed(6) + '</div>';

        if (stepData.fc === 0) {
            str += "<p class='highlight-val' style='color:var(--success)'>Encontramos a raiz exata porque f(c) = 0!</p>";
        } else {
            str += "<h3>3. Atualizando o Intervalo</h3>";
            str += "<p>O algoritmo verifica o sinal de <i>f(a) &times; f(c)</i> para decidir qual metade descartar.</p>";

            var nextStep = allSteps[index + 1];
            if (nextStep) {
                if (nextStep.a === stepData.c) {
                    str += "<p>A mudança de sinal ocorre na metade superior. Assim, o limite da esquerda passa a ser c.<br>Atualizado: <strong>a = c (" + stepData.c.toFixed(6) + ")</strong>.</p>";
                } else {
                    str += "<p>A mudança de sinal ocorre na metade inferior. Assim, o limite da direita passa a ser c.<br>Atualizado: <strong>b = c (" + stepData.c.toFixed(6) + ")</strong>.</p>";
                }
                str += "<p>A tolerância atual (erro estipulado da medição) é de: " + stepData.error.toFixed(6) + ".</p>";
            } else {
                str += "<p>Avaliando o critério de parada... A tolerância final foi alcançada com Erro do passo atual em: <strong>" + stepData.error.toFixed(6) + "</strong>.</p>";
            }
        }
        return str;
    }
};
