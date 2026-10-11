
const formulario = document.getElementById("formulario-vaga");
const listaVagas = document.getElementById("lista-vagas");
const totalVagas = document.getElementById("total-vagas");
const mensagem = document.getElementById("mensagem");

const chaveArmazenamento = "vagasJaCadastradas";

let vagas = [];

try {
    const dadosSalvos = JSON.parse(
        localStorage.getItem(chaveArmazenamento) || "[]"
    );

    if (Array.isArray(dadosSalvos)) {
        vagas = dadosSalvos.filter(
            vaga =>
                vaga &&
                typeof vaga.id === "string" &&
                typeof vaga.empresa === "string" &&
                typeof vaga.titulo === "string" &&
                typeof vaga.area === "string" &&
                typeof vaga.contrato === "string" &&
                typeof vaga.local === "string" &&
                typeof vaga.descricao === "string"
        );
    }
} catch (erro) {
    vagas = [];
}

// Salva as vagas no navegador.
function salvarVagas() {
    try {
        localStorage.setItem(
            chaveArmazenamento,
            JSON.stringify(vagas)
        );
        return true;
    } catch (erro) {
        mensagem.textContent =
            "Não foi possível salvar os dados neste navegador.";
        return false;
    }
}

// Formata o salário para moeda brasileira.
function formatarSalario(valor) {
    if (valor === "") {
        return "A combinar";
    }

    return Number(valor).toLocaleString("pt-BR", {
        style: "currency",
        currency: "BRL"
    });
}

// Cria uma célula com texto seguro.
function criarCelula(texto) {
    const celula = document.createElement("td");
    celula.textContent = texto;
    return celula;
}

// Mostra todas as vagas cadastradas na tabela.
function mostrarVagas() {
    listaVagas.replaceChildren();

    totalVagas.textContent = vagas.length;

    if (vagas.length === 0) {
        const linha = document.createElement("tr");
        const celula = document.createElement("td");

        celula.colSpan = 8;
        celula.className = "vazio";
        celula.textContent = "Nenhuma vaga cadastrada ainda.";

        linha.appendChild(celula);
        listaVagas.appendChild(linha);
        return;
    }

    vagas.forEach(function (vaga) {
        const linha = document.createElement("tr");

        linha.appendChild(criarCelula(vaga.empresa));
        linha.appendChild(criarCelula(vaga.titulo));
        linha.appendChild(criarCelula(vaga.area));
        linha.appendChild(criarCelula(vaga.contrato));
        linha.appendChild(criarCelula(vaga.local));
        linha.appendChild(criarCelula(
            formatarSalario(vaga.salario)
        ));
        linha.appendChild(criarCelula(vaga.descricao));

        const celulaAcao = document.createElement("td");
        const botaoExcluir = document.createElement("button");

        botaoExcluir.type = "button";
        botaoExcluir.className = "botao-excluir";
        botaoExcluir.textContent = "Excluir";
        botaoExcluir.setAttribute(
            "aria-label",
            "Excluir vaga " + vaga.titulo
        );

        botaoExcluir.addEventListener("click", function () {
            excluirVaga(vaga.id);
        });

        celulaAcao.appendChild(botaoExcluir);
        linha.appendChild(celulaAcao);

        listaVagas.appendChild(linha);
    });
}

// Cadastra uma nova vaga.
formulario.addEventListener("submit", function (evento) {
    evento.preventDefault();

    const empresa = document.getElementById("empresa").value.trim();
    const titulo = document.getElementById("titulo").value.trim();
    const area = document.getElementById("area").value;
    const contrato = document.getElementById("contrato").value;
    const local = document.getElementById("local").value.trim();
    const salario = document.getElementById("salario").value;
    const descricao = document.getElementById("descricao").value.trim();

    if (!empresa || !titulo || !area || !contrato || !local || !descricao) {
        mensagem.textContent = "Preencha todos os campos obrigatórios.";
        return;
    }

    if (salario !== "" && (
        !Number.isFinite(Number(salario)) ||
        Number(salario) < 0
    )) {
        mensagem.textContent = "Informe um salário válido.";
        return;
    }

    const novaVaga = {
        id: crypto.randomUUID(),
        empresa: empresa,
        titulo: titulo,
        area: area,
        contrato: contrato,
        local: local,
        salario: salario,
        descricao: descricao
    };

    vagas.unshift(novaVaga);

    const salvou = salvarVagas();

    mostrarVagas();
    formulario.reset();

    mensagem.textContent = salvou
        ? "Vaga cadastrada com sucesso!"
        : "Vaga adicionada à tabela, mas não foi salva no navegador.";
});

// Exclui uma vaga.
function excluirVaga(id) {
    vagas = vagas.filter(function (vaga) {
        return vaga.id !== id;
    });

    salvarVagas();
    mostrarVagas();

    mensagem.textContent = "Vaga excluída.";
}

// Carrega as vagas quando a página abre.
mostrarVagas();
