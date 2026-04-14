// ==========================================
// Método de Interpolação de Lagrange
// ==========================================

var LagrangeMethod = {
    id: "lagrange",
    name: "Interpolação de Lagrange",
    hideGenericFunc: true, // We don't use standard f(x) input

    theory: '<div class="theory-block">' +
        '<p>A <strong>Interpolação de Lagrange</strong> é usada para encontrar um polinômio que passe exatamente por um conjunto de pontos dados dados (x<sub>k</sub>, y<sub>k</sub>).</p>' +
        '<p>Se temos <i>n</i> pontos, encontraremos um polinômio construído a partir de polinômios básicos de Lagrange.</p>' +
        '<h3>O Polinômio de Lagrange L(x)</h3>' +
        '<p>O polinômio interpolador é dado por:</p>' +
        '<div class="formula-box"><i>P(x) = &sum; y<sub>k</sub> &times; L<sub>k</sub>(x)</i></div>' +
        '<h3>Polinômios Básicos L<sub>k</sub>(x)</h3>' +
        '<div class="formula-box"><i>L<sub>k</sub>(x) = &prod; (x - x<sub>j</sub>) / (x<sub>k</sub> - x<sub>j</sub>) &nbsp;&nbsp;&nbsp; para j &ne; k</i></div>' +
        '<h3>Sobre os L<sub>k</sub></h3>' +
        '<ul>' +
        '<li><i>L<sub>k</sub>(x<sub>k</sub>) = 1</i></li>' +
        '<li><i>L<sub>k</sub>(x<sub>j</sub>) = 0</i> para qualquer outro ponto <i>j</i>.</li>' +
        '</ul>' +
        '</div>',

    code: '% ========================================================================\n' +
        '% GNU Octave - Interpolação de Lagrange\n' +
        '% ========================================================================\n' +
        '% Palavras Reservadas Utilizadas:\n' +
        '% function ... endfunction : Declara bloco do algoritmo e seus retornos.\n' +
        '% for ... endfor           : Laço iterativo referenciado.\n' +
        '% if ... endif             : Estrutura condicional base.\n' +
        '% length(...)              : Retorna tamanho global do vetor de pontos.\n' +
        '% ========================================================================\n\n' +
        'function [Px] = lagrangeInterpolation(x_points, y_points, target_x)\n' +
        '    % x_points: Vetor contendo as coordenadas X conhecidas\n' +
        '    % y_points: Vetor contendo as coordenadas Y correspondentes\n' +
        '    % target_x: Valor em X para estimar o seu Y interpolado\n' +
        '    \n' +
        '    n = length(x_points);\n' +
        '    Px = 0;\n' +
        '    \n' +
        '    % Itera K de 1 até N construindo a somatória geral de Lagrange\n' +
        '    for k = 1:n\n' +
        '        L_k = 1; % Polinômio de base neutro\n' +
        '        \n' +
        '        % Constrói o Polinômio L_k cruzando todos os J != K\n' +
        '        for j = 1:n\n' +
        '            if (k != j)\n' +
        '                % Produtório Padrão (x - xj) / (xk - xj)\n' +
        '                L_k = L_k * (target_x - x_points(j)) / (x_points(k) - x_points(j));\n' +
        '            endif\n' +
        '        endfor\n' +
        '        \n' +
        '        % Soma a contribuição deste termo k na variável raiz P(x)\n' +
        '        target_y = y_points(k) * L_k;\n' +
        '        Px = Px + target_y;\n' +
        '    endfor\n' +
        'endfunction',

    execute: function (f, params) {
        var pointsStr = (document.getElementById("lagrange-points").value || "").trim();
        var targetXStr = (document.getElementById("lagrange-x").value || "").trim();

        if (!pointsStr) throw new Error("Informe os pontos para interpolação.");

        var pointsArr = pointsStr.split(";");
        var points = [];

        for (var i = 0; i < pointsArr.length; i++) {
            var pt = pointsArr[i].trim();
            if (!pt) continue; // ignora vazios no final

            var coords = pt.split(",");
            if (coords.length !== 2) {
                throw new Error("O ponto '" + pt + "' não é válido. Use o formato: x,y");
            }
            var px = parseFloat(coords[0].trim());
            var py = parseFloat(coords[1].trim());

            if (isNaN(px) || isNaN(py)) {
                throw new Error("Coordenadas inválidas no ponto: " + pt);
            }

            points.push({ x: px, y: py });
        }

        if (points.length < 2) {
            throw new Error("São necessários pelo menos 2 pontos para interpolar.");
        }

        var x_val;
        if (targetXStr !== "") {
            x_val = parseFloat(targetXStr);
        } else {
            throw new Error("Informe o valor de x a ser interpolado.");
        }

        return this.lagrangeInterpolation(points, x_val);
    },

    getParams: function () {
        return {};
    },

    lagrangeInterpolation: function (points, x_val) {
        var n = points.length;
        var finalResult = 0;
        var terms = [];

        for (var k = 0; k < n; k++) {
            var L_k = 1;

            for (var j = 0; j < n; j++) {
                if (k !== j) {
                    L_k *= (x_val - points[j].x) / (points[k].x - points[j].x);
                }
            }

            var termVal = points[k].y * L_k;
            finalResult += termVal;

            terms.push({
                k: k,
                xk: points[k].x,
                yk: points[k].y,
                Lk: L_k,
                term: termVal,
                x_val: x_val
            });
        }

        return {
            root: finalResult, // 'root' here serves as final indicator for UI
            x_val: x_val,
            terms: terms
        };
    },

    renderTable: function (result) {
        var thead = document.querySelector("#results-table thead");
        var tbody = document.querySelector("#results-table tbody");

        var terms = result.terms;
        var x_val = result.x_val;

        // Cabeçalho
        thead.innerHTML =
            "<tr>" +
            "<th>k</th>" +
            "<th>x<sub>k</sub></th>" +
            "<th>y<sub>k</sub></th>" +
            "<th>L<sub>k</sub>(" + x_val.toFixed(2) + ")</th>" +
            "<th>y<sub>k</sub> &times; L<sub>k</sub></th>" +
            "</tr>";

        var rows = "";
        for (var i = 0; i < terms.length; i++) {
            var t = terms[i];
            rows +=
                "<tr>" +
                "<td>" + t.k + "</td>" +
                "<td>" + t.xk.toFixed(5) + "</td>" +
                "<td>" + t.yk.toFixed(5) + "</td>" +
                "<td>" + t.Lk.toFixed(5) + "</td>" +
                '<td style="color:var(--accent); font-weight:600">' + t.term.toFixed(5) + "</td>" +
                "</tr>";
        }
        tbody.innerHTML = rows;

        // Sobrescrever mensagem "Raiz encontrada" no final
        var finalRes = document.getElementById("final-result");
        finalRes.textContent = "P(" + x_val + ") ≈ " + result.root.toFixed(6);
        finalRes.className = "final-result";
    },

    renderStep: function (stepData) {
        var str = "<h3>Calculando o polinômio L<sub>" + stepData.k + "</sub>(x)</h3>";
        str += "<p>O Polinômio Básico de Lagrange é derivado isolando algebraicamente o ponto estudado contra o valor procurado (<strong>" + stepData.x_val + "</strong>).</p>";
        str += '<div class="formula-box">L<sub>' + stepData.k + "</sub>(" + stepData.x_val + ") = " + stepData.Lk.toFixed(5) + "</div>";
        str += "<h3>Multiplicando por Y</h3>";
        str += "<p>A porção que este polinômio acrescenta é multiplicada com o seu y associado:</p>";
        str += '<div class="formula-box">y<sub>' + stepData.k + "</sub> &times; L<sub>" + stepData.k + "</sub> = " + stepData.yk.toFixed(5) + " &times; " + stepData.Lk.toFixed(5) + " = <span class='highlight-val'>" + stepData.term.toFixed(5) + "</span></div>";
        str += "<p>Este valor isolado será somado ao total para formular o P(x) do método de Lagrange.</p>";
        return str;
    }
};
