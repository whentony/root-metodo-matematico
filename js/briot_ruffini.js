// ==========================================
// Método de Briot-Ruffini - Divisão de Polinômios
// ==========================================

var BriotRuffiniMethod = {
    id: "briot-ruffini",
    name: "Método de Briot-Ruffini",
    hideGenericFunc: true, // we hide the standard f(x) input for this method

    theory: '<div class="theory-block">' +
        '<p>O <strong>Dispositivo Prático de Briot-Ruffini</strong> é um algoritmo eficiente para a divisão de um polinômio P(x) por um binômio da forma (x - a).</p>' +
        '<p>Ele permite encontrar o polinômio quociente Q(x) e o resto R da divisão, além de avaliar P(a) (pelo Teorema do Resto, P(a) = R).</p>' +
        '<h3>O Algoritmo</h3>' +
        '<p>Dado o polinômio <i>P(x) = c<sub>n</sub>x<sup>n</sup> + ... + c<sub>1</sub>x + c<sub>0</sub></i> e o divisor <i>(x - a)</i>:</p>' +
        '<ul>' +
        '<li>1. O coeficiente líder desce diretamente: <i>b<sub>n-1</sub> = c<sub>n</sub></i>.</li>' +
        '<li>2. Cada coeficiente subsequente é gerado multiplicando o último resultado por <i>a</i> e somando com o coeficiente atual de P(x): <i>b<sub>k-1</sub> = b<sub>k</sub> &times; a + c<sub>k</sub></i>.</li>' +
        '<li>3. O último valor calculado é o Resto da divisão (se for 0, "a" é uma raiz).</li>' +
        '</ul>' +
        '</div>',

    code: '% ========================================================================\n' +
        '% GNU Octave - Dispositivo Prático de Briot-Ruffini\n' +
        '% ========================================================================\n' +
        '% Palavras Reservadas Utilizadas:\n' +
        '% function ... endfunction : Declara bloco do algoritmo e seus retornos.\n' +
        '% for ... endfor           : Laço iterativo indexado.\n' +
        '% zeros(...)               : Instancia um array preenchido por zeros.\n' +
        '% length(...)              : Retorna tamanho/comprimento de um array.\n' +
        '% ========================================================================\n\n' +
        'function [quotient, remainder] = briotRuffini(coeffs, a)\n' +
        '    % coeffs: vetor de coeficientes [c_n, c_n-1, ..., c_0]\n' +
        '    % a: raiz a testar no formato do divisor (x - a)\n' +
        '    \n' +
        '    n = length(coeffs);\n' +
        '    b = zeros(1, n);\n' +
        '    \n' +
        '    % 1. O primeiro coeficiente líder escorrega direto para a base\n' +
        '    b(1) = coeffs(1);\n' +
        '    \n' +
        '    % 2. Loop cruzado iterando pelos coeficientes restantes (de 2 até final)\n' +
        '    for i = 2:n\n' +
        '        % Multiplica a cruzada horizontal-inferior do termo anterior pela\n' +
        '        % provável raiz e soma imediatamente na coluna coeficiente c\n' +
        '        b(i) = b(i - 1) * a + coeffs(i);\n' +
        '    endfor\n' +
        '    \n' +
        '    % 3. Extrair os componentes do resultado consolidado\n' +
        '    % O último valor empilhado é o Resto da divisão.\n' +
        '    remainder = b(n);\n' +
        '    % Os demais pertencem ao longo do polinômio rebaixado do Quociente.\n' +
        '    quotient = b(1:(n-1));\n' +
        'endfunction',

    execute: function (f, params) {
        // Here `f` is ignored since we have `hideGenericFunc: true`
        var coeffsStr = (document.getElementById("br-coeffs").value || "").trim();
        var a = parseFloat(document.getElementById("br-a").value);

        if (!coeffsStr) throw new Error("Informe os coeficientes do polinômio.");

        // Parse coefficients: split by comma, ensure they are numbers
        var coeffs = coeffsStr.split(",").map(function (s) { return parseFloat(s.trim()); });
        for (var i = 0; i < coeffs.length; i++) {
            if (isNaN(coeffs[i])) throw new Error("Coeficiente inválido encontrado na posição " + (i + 1));
        }

        if (coeffs.length < 2) {
            throw new Error("O polinômio deve ter pelo menos grau 1 (dois coeficientes).");
        }

        return this.briotRuffini(coeffs, a);
    },

    getParams: function () {
        return {}; // Handled directly in execute for this specific method format
    },

    briotRuffini: function (coeffs, a) {
        var b = [];
        var steps = [];

        b.push(coeffs[0]);
        steps.push({ isStart: true, c: coeffs[0] });

        for (var i = 1; i < coeffs.length; i++) {
            var next_b = b[i - 1] * a + coeffs[i];
            steps.push({ isStart: false, c: coeffs[i], prev_b: b[i - 1], a: a, next_b: next_b });
            b.push(next_b);
        }
        var remainder = b.pop();
        var quotient = b;
        return {
            root: remainder,
            a: a,
            coeffs: coeffs,
            quotient: quotient,
            remainder: remainder,
            steps: steps
        };
    },

    renderTable: function (result) {
        var thead = document.querySelector("#results-table thead");
        var tbody = document.querySelector("#results-table tbody");

        var coeffs = result.coeffs;
        var q = result.quotient;
        var r = result.remainder;
        var a = result.a;

        // Custom Tabela de Briot-Ruffini
        var headHTML = "<tr><th>x = " + a + "</th><th style='width:10px; border-right:2px solid var(--panel-border)'>|</th>";
        for (var i = 0; i < coeffs.length; i++) {
            headHTML += "<th style='text-align: center'>" + coeffs[i] + "</th>";
        }
        headHTML += "</tr>";
        thead.innerHTML = headHTML;

        var bodyHTML = "<tr><td></td><td style='border-right:2px solid var(--panel-border)'></td>";

        // Quociente
        for (var j = 0; j < q.length; j++) {
            bodyHTML += "<td style='text-align: center; color:var(--accent); font-weight:600'>" + q[j] + "</td>";
        }
        // Resto
        bodyHTML += "<td style='text-align: center; color:var(--danger); font-weight:600'>" + r + "</td>";
        bodyHTML += "</tr>";

        tbody.innerHTML = bodyHTML;

        // Sobrescrever mensagem "Raiz encontrada" no final
        var finalRes = document.getElementById("final-result");
        if (r === 0) {
            finalRes.textContent = "Resto = 0. Logo, x = " + a + " é raiz!";
            finalRes.className = "final-result"; // success
        } else {
            finalRes.textContent = "Resto = " + r + ". Logo, x = " + a + " NÃO é raiz.";
            finalRes.className = "final-result error";
        }
    },

    renderStep: function (stepData, index, allSteps) {
        if (stepData.isStart) {
            return "<h3>O Primeiro Coeficiente</h3><p>O algoritmo começa apenas abaixando diretamente o coeficiente líder: <strong>" + stepData.c + "</strong>.</p>";
        }
        var str = "<h3>Multiplica e Soma</h3>";
        str += "<p>O valor iterativo anterior (<i>" + stepData.prev_b + "</i>) é multiplicado pela raiz sendo testada (<i>a = " + stepData.a + "</i>) e somado ao próximo coeficiente (<i>" + stepData.c + "</i>).</p>";
        str += '<div class="formula-box">b = ' + stepData.prev_b + " &times; " + stepData.a + " + " + stepData.c + " = <span class='highlight-val'>" + stepData.next_b + "</span></div>";

        if (index === allSteps.length - 1) {
            if (stepData.next_b === 0) {
                str += "<p class='highlight-val' style='color:var(--success)'>Esse foi o último coeficiente validado. O valor convergiu para 0, comprovando que é uma raiz verdadeira do polinômio!</p>";
            } else {
                str += "<p>Esse foi o último coeficiente. Portanto, esse valor final (<strong>" + stepData.next_b + "</strong>) é o Resto da divisão e prova que não é uma raiz.</p>";
            }
        } else {
            str += "<p>O coeficiente resultante <strong>" + stepData.next_b + "</strong> passará a fazer parte do polinômio quociente Q(x).</p>";
        }
        return str;
    }
};
