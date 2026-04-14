// ==========================================
// Parser de funções matemáticas (100% offline)
// ==========================================

var MathParser = {

    // Converte uma string como "x^2 - 4" em uma função JS executável
    parse: function (expr) {
        var parsedExpr = expr
            .replace(/sen\(/g, "Math.sin(")
            .replace(/seno\(/g, "Math.sin(")
            .replace(/sin\(/g, "Math.sin(")
            .replace(/cos\(/g, "Math.cos(")
            .replace(/tan\(/g, "Math.tan(")
            .replace(/tg\(/g, "Math.tan(")
            .replace(/exp\(/g, "Math.exp(")
            .replace(/log\(/g, "Math.log(")
            .replace(/ln\(/g, "Math.log(")
            .replace(/sqrt\(/g, "Math.sqrt(")
            .replace(/abs\(/g, "Math.abs(")
            .replace(/\bpi\b/g, "Math.PI")
            .replace(/\^/g, "**");

        if (/[;{}[\]\\]/.test(parsedExpr)) {
            throw new Error("Expressão inválida. Use apenas operadores matemáticos.");
        }

        try {
            var f = new Function("x", "return " + parsedExpr + ";");
            var testVal = f(1);
            if (typeof testVal !== "number" || isNaN(testVal)) {
                throw new Error("A função não retornou um número válido.");
            }
            return f;
        } catch (e) {
            throw new Error("Erro de sintaxe na função: " + e.message);
        }
    },

    // Derivada numérica usando diferença central
    numericalDerivative: function (f, x) {
        var h = 1e-7;
        return (f(x + h) - f(x - h)) / (2 * h);
    }
};
