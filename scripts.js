document
  .getElementById("formCadastro")
  .addEventListener("submit", function (event) {
    event.preventDefault(); // Evita o envio do formulário e recarregamento da página

    // Pegando os valores do formulário
    const cliente = document.getElementById("cliente").value;
    const endereco = document.getElementById("endereco").value;
    const quantidade = parseInt(document.getElementById("quantidade").value);
    const responsaveis = Array.from(
      document.getElementById("responsaveis").selectedOptions
    ).map((option) => option.value);
    const tempoStr = document.getElementById("tempo").value;
    const tempo = parseInt(tempoStr.split(":")[0]);

    // Calculando o prazo de entrega
    const dataAtual = new Date();
    const dataEntrega = new Date(dataAtual);
    dataEntrega.setHours(dataAtual.getHours() + tempo); // Calcula a data de entrega

    // Calculando o status baseado no tempo de entrega
    const status = calcularStatus(dataEntrega);

    // Calculando a carga de trabalho
    const cargaTrabalho = (quantidade * tempo) / responsaveis.length;

    // Montando o objeto de dados do cadastro
    const cadastro = {
      cliente,
      endereco,
      quantidade,
      responsaveis,
      tempo,
      dataEntrega,
      status,
      cargaTrabalho,
    };

    // Armazenando no localStorage
    const cadastros = JSON.parse(localStorage.getItem("cadastros")) || [];
    cadastros.push(cadastro);
    localStorage.setItem("cadastros", JSON.stringify(cadastros));

    // Redirecionando para a página de exibição de dados
    window.location.href = "dados.html";
  });

function calcularStatus(dataEntrega) {
  const dataAtual = new Date();
  const diffTime = dataEntrega - dataAtual;
  const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

  let texto, cor;

  if (diffDays <= 1) {
    texto = "Crítico";
    cor = "red";
  } else if (diffDays <= 3) {
    texto = "Pendente";
    cor = "yellow";
  } else {
    texto = "Neutro";
    cor = "green";
  }

  return { texto, cor };
}

document.addEventListener("DOMContentLoaded", function () {
  // Carregar os cadastros do localStorage
  const cadastros = JSON.parse(localStorage.getItem("cadastros")) || [];
  const informacoesDiv = document.getElementById("informacoes");
  informacoesDiv.innerHTML = ""; // Limpar a área de informações

  // Exibir os cadastros
  cadastros.forEach((cadastro) => {
    const divCadastro = document.createElement("div");
    divCadastro.classList.add("cadastro");
    divCadastro.innerHTML = `
          <p><strong>Cliente:</strong> ${cadastro.cliente}</p>
          <p><strong>Endereço:</strong> ${cadastro.endereco}</p>
          <p><strong>Quantidade de Painéis:</strong> ${cadastro.quantidade}</p>
          <p><strong>Responsáveis:</strong> ${cadastro.responsaveis.join(
            ", "
          )}</p>
          <p><strong>Tempo de Finalização:</strong> ${cadastro.tempo} horas</p>
          <p><strong>Data de Entrega:</strong> ${cadastro.dataEntrega.toLocaleString()}</p>
          <div class="status" style="background-color: ${
            cadastro.status.cor
          };">${cadastro.status.texto}</div>
          <p><strong>Carga de Trabalho por Responsável:</strong> ${
            cadastro.cargaTrabalho
          } horas</p>
      `;
    informacoesDiv.appendChild(divCadastro);
  });

  // Caso não haja cadastros, exibe uma mensagem informando
  if (cadastros.length === 0) {
    informacoesDiv.innerHTML = "<p>Não há dados cadastrados.</p>";
  }
});
