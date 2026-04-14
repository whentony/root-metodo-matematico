# Simulador Algorítmico de Métodos Numéricos

Uma ferramenta educacional interativa em formato Web (HTML/JS/CSS) desenvolvida para o ensino prático com demonstrações visuais iterativas de métodos clássicos de Cálculo Numérico.

Este projeto foi desenvolvido como material instrucional para a disciplina de **Métodos Matemáticos e Computacionais** vinculada ao programa de **Doutorado em Modelagem Matemática e Computacional** do CEFET.

## Descrição do Projeto

O Simulador atua como uma interface de apoio de aprendizagem, aproximando o entendimento teórico-matemático à modelagem e programação computacional acadêmica. Compondo uma robusta aplicação client-side local, o projeto permite que os doutorandos e pesquisadores testem livremente diferentes métodos clássicos, simulem os cálculos minuciosos através de iterações passo a passo (enxergando as substituições das fórmulas), e copiem livremente as arquiteturas implementadas em linguagem base.

## Métodos Computacionais Suportados

**Teoria de Busca de Raízes e Zeros de Funções**
- Método da Bisseção
- Método de Newton-Raphson
- Método da Secante

**Aproximações Polinomiais e Interpolações**
- Dispositivo prático de Briot-Ruffini
- Interpolação de Lagrange
- Construção de matrizes do Algoritmo de Neville

## Principais Funcionalidades

- **Dual-Pane UI Responsiva**: Experiência visual onde as fórmulas de base teóricas são lidas em paralelo à zona de teste do algoritmo interativo.
- **Visualizador Semântico em GNU Octave**: Todo o código referencial demonstrativo nos painéis está integralmente escrito dentro da sintaxe científica computacional **GNU Octave**, possuindo fartos comentários instrucionais e glossário dinâmico que exibe aos estudiosos o emprego prático das palavras reservadas.
- **Simulador Interativo Iterador**: Em vez de processar uma tabela seca para atingir a raiz isolada final, as iterações podem ser executadas em "câmera lenta", visualizando a fórmula algorítmica substituída pelos valores literais adotados em linha pelo código rodando na iteração subjacente atual.

## Como Instalar e Executar

Por ser uma aplicação programada inteiramente no laço do cliente (Front-End via JS), não exige ambiente, containers, compiladores ou interpretadores backend para ser visualizada perfeitamente.

Para abri-la e servir todos os recursos visuais no navegador:

1. Clone o repositório ou faça o download para a sua máquina.
2. Usando Node.js, sirva a pasta estática:
```bash
npx -y http-server . -p 8080
```
3. Acesse `http://localhost:8080` utilizando seu browser moderno favorito.
