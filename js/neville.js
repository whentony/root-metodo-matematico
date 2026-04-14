// ==========================================
// Método de Interpolação de Neville
// ==========================================

var NevilleMethod = {
    id: "neville",
    name: "Método de Neville",
    hideGenericFunc: true, // we use points, not f(x)

    theory: '<div class="theory-block">' +
        '<p>O <strong>Algoritmo de Neville</strong> é um procedimento clássico para interpolação polinomial que evita calcular o polinômio interpolar inteiro só para chegar no valor do ponto (diferente da forma explícita de Lagrange).</p>' +
        '<p>Ele constrói a interpolação através de uma tabela, derivando as aproximações de grau <i>k</i> a partir de aproximações de grau <i>k-1</i> recursivamente.</p>' +
        '<h3>A Relação de Recorrência</h3>' +
        '<p>Seja <i>P<sub>i,j</sub></i> o polinômio que interpola os pontos <i>x<sub>i</sub>, x<sub>i+1</sub>, ..., x<sub>j</sub></i>. A recorrência é:</p>' +
        '<div class="formula-box"><i>P<sub>i,i</sub> = y<sub>i</sub></i></div>' +
        '<div class="formula-box"><i>P<sub>i,j</sub> = [ (x - x<sub>j</sub>) &times; P<sub>i, j-1</sub> - (x - x<sub>i</sub>) &times; P<sub>i+1, j</sub> ] / (x<sub>i</sub> - x<sub>j</sub>)</i></div>' +
        '<h3>Resultado Final</h3>' +
        '<p>O interpolante utilizando todos os <i>n</i> pontos será armazenado em <i>P<sub>0, n-1</sub></i>.</p>' +
        '</div>',

    code: '% ========================================================================\n' +
        '% GNU Octave - Método de Neville\n' +
        '% ========================================================================\n' +
        '% Palavras Reservadas Utilizadas:\n' +
        '% function ... endfunction : Declara bloco do algoritmo e seus retornos.\n' +
        '% for ... endfor           : Laço iterativo.\n' +
        '% zeros(M, N)              : Instancia matriz bidimensional zerada.\n' +
        '% length(...)              : Retorna o comprimento primário array.\n' +
        '% ========================================================================\n\n' +
        'function [Px, P_Matrix] = nevilleInterpolation(x_points, y_points, target_x)\n' +
        '    % P_Matrix guardará as subtabelas triangulares interpoladoras\n' +
        '    n = length(x_points);\n' +
        '    P = zeros(n, n);\n' +
        '    \n' +
        '    % 1. O P_i,i inicial equivale ao Y original (primeira coluna j=1)\n' +
        '    for i = 1:n\n' +
        '        P(i, 1) = y_points(i);\n' +
        '    endfor\n' +
        '    \n' +
        '    % 2. Preenchendo sequências P recursivas cruzadas nas colunas j subseq.\n' +
        '    for j = 2:n\n' +
        '        % Limita-se as linhas válidas para formar a escada/triângulo\n' +
        '        for i = 1:(n - j + 1)\n' +
        '            \n' +
        '            % Identificadores da variação X da linha atual a subseq.\n' +
        '            x_i  = x_points(i);\n' +
        '            x_ij = x_points(i + j - 1);\n' +
        '            \n' +
        '            % Relação de Recorrência Básica de Neville\n' +
        '            % Diferença cruzada contra os P(x) previamente descobertos\n' +
        '            P(i, j) = ((target_x - x_ij) * P(i, j - 1) - ...\n' +
        '                       (target_x - x_i)  * P(i + 1, j - 1)) / ...\n' +
        '                      (x_i - x_ij);\n' +
        '        endfor\n' +
        '    endfor\n' +
        '    \n' +
        '    % O resultado no topo da última interação global é a interpolação final\n' +
        '    Px = P(1, n);\n' +
        '    P_Matrix = P;\n' +
        'endfunction',

    execute: function (f, params) {
        var pointsStr = (document.getElementById("neville-points").value || "").trim();
        var targetXStr = (document.getElementById("neville-x").value || "").trim();

        if (!pointsStr) throw new Error("Informe os pontos para interpolação.");

        var pointsArr = pointsStr.split(";");
        var points = [];

        for (var idx = 0; idx < pointsArr.length; idx++) {
            var pt = pointsArr[idx].trim();
            if (!pt) continue;

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

        return this.nevilleInterpolation(points, x_val);
    },

    getParams: function () {
        return {};
    },

    nevilleInterpolation: function (points, x_val) {
        var n = points.length;
        var P = Array.from({ length: n }, () => new Array(n).fill(0));

        for (var i = 0; i < n; i++) {
            P[i][0] = points[i].y;
        }

        var iterations = [];

        for (var j = 1; j < n; j++) {
            for (var i = 0; i < n - j; i++) {
                var x_i = points[i].x;
                var x_ij = points[i + j].x;

                // Prevenção de divisão por zero se houver x idênticos
                if (Math.abs(x_i - x_ij) < 1e-12) {
                    throw new Error("Divisão por zero detectada (pontos x repetidos informados: " + x_i + ")");
                }

                P[i][j] = ((x_val - x_ij) * P[i][j - 1] - (x_val - x_i) * P[i + 1][j - 1]) / (x_i - x_ij);

                iterations.push({
                    i: i,
                    j: j,
                    Pi_j_minus_1: P[i][j - 1],
                    Pi_plus_1_j_minus_1: P[i + 1][j - 1],
                    Pij: P[i][j],
                    x_i: x_i,
                    x_ij: x_ij,
                    x_val: x_val
                });
            }
        }

        return {
            root: P[0][n - 1], // 'root' as global generic identifier
            x_val: x_val,
            n: n,
            table: P,
            points: points
        };
    },

    renderTable: function (result) {
        var thead = document.querySelector("#results-table thead");
        var tbody = document.querySelector("#results-table tbody");

        var n = result.n;
        var P = result.table;
        var points = result.points;
        var x_val = result.x_val;

        // Construindo o header dinâmico: x, y, P_1, P_2...
        var headHTML = "<tr><th>x<sub>i</sub></th><th>y<sub>i</sub> (P<sub>0</sub>)</th>";
        for (var col = 1; col < n; col++) {
            headHTML += "<th>P<sub>" + col + "</sub></th>";
        }
        headHTML += "</tr>";
        thead.innerHTML = headHTML;

        // Construindo a tabela de forma triangular
        var rows = "";
        for (var i = 0; i < n; i++) {
            rows += "<tr>";
            rows += "<td>" + points[i].x.toFixed(4) + "</td>"; // Coluna X

            for (var j = 0; j < n - i; j++) {
                var val = isNaN(P[i][j]) ? "" : P[i][j].toFixed(6);
                var style = (i === 0 && j === n - 1) ? 'style="color:var(--accent); font-weight:bold;"' : "";
                rows += "<td " + style + ">" + val + "</td>";
            }

            // Células vazias para formar o triângulo na matriz
            for (var empty = 0; empty < i; empty++) {
                rows += "<td></td>";
            }
            rows += "</tr>";
        }
        tbody.innerHTML = rows;

        // Sobrescrever mensagem final
        var finalRes = document.getElementById("final-result");
        finalRes.textContent = "P(" + x_val + ") ≈ " + result.root.toFixed(6);
        finalRes.className = "final-result";
    },

    renderStep: function (stepData) {
        var str = "<h3>Trígono de Polinômios Combinados</h3>";
        var idxI = stepData.i;
        var idxJ = stepData.i + stepData.j;
        str += "<p>Para encontrar a aproximação <strong>P<sub>" + idxI + "," + idxJ + "</sub></strong> mesclamos recursivamente referências ao ponto x procurado: <strong>" + stepData.x_val.toFixed(4) + "</strong>.</p>";

        str += '<div class="formula-box" style="font-size:0.95em">P = [ (' + stepData.x_val.toFixed(4) + " - " + stepData.x_ij.toFixed(4) + ") &times; " + stepData.Pi_j_minus_1.toFixed(5) + " - (" + stepData.x_val.toFixed(4) + " - " + stepData.x_i.toFixed(4) + ") &times; " + stepData.Pi_plus_1_j_minus_1.toFixed(5) + " ] / (" + stepData.x_i.toFixed(4) + " - " + stepData.x_ij.toFixed(4) + ")</div>";
        str += '<div class="formula-box">P<sub>' + idxI + "," + idxJ + '</sub> = <span class="highlight-val">' + stepData.Pij.toFixed(6) + '</span></div>';

        return str;
    }
};
