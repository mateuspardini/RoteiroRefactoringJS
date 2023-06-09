const { readFileSync } = require("fs");

class ServicoCalculoFatura {
  calcularCredito(pecas, apre) {
    let creditos = 0;
    creditos += Math.max(apre.audiencia - 30, 0);
    if (this.getPeca(apre, pecas).tipo === "comedia")
      creditos += Math.floor(apre.audiencia / 5);
    return creditos;
  }

  calcularTotalCreditos(fatura, pecas) {
    let totalCreditos = 0;
    for (let apre of fatura.apresentacoes) {
      totalCreditos += this.calcularCredito(pecas, apre);
    }
    return totalCreditos;
  }

  calcularTotalApresentacao(pecas, apre) {
    let total = 0;

    switch (this.getPeca(apre, pecas).tipo) {
      case "tragedia":
        total = 40000;
        if (apre.audiencia > 30) {
          total += 1000 * (apre.audiencia - 30);
        }
        break;
      case "comedia":
        total = 30000;
        if (apre.audiencia > 20) {
          total += 10000 + 500 * (apre.audiencia - 20);
        }
        total += 300 * apre.audiencia;
        break;
      default:
        throw new Error(`Peça desconhecida: ${this.getPeca(apre, pecas).tipo}`);
    }

    return total;
  }

  calcularTotalFatura(fatura, pecas) {
    let totalFatura = 0;
    for (let apre of fatura.apresentacoes) {
      totalFatura += this.calcularTotalApresentacao(pecas, apre);
    }
    return totalFatura;
  }

  getPeca(apresentacao, pecas) {
    return pecas[apresentacao.id];
  }
}

function formatarMoeda(valor) {
  const formato = new Intl.NumberFormat("pt-BR", {
    style: "currency",
    currency: "BRL",
    minimumFractionDigits: 2,
  });

  return formato.format(valor / 100);
}

const faturas = JSON.parse(readFileSync("./faturas.json"));
const pecas = JSON.parse(readFileSync("./pecas.json"));
const calc = new ServicoCalculoFatura();
const faturaStr = gerarFaturaStr(faturas, pecas);
console.log(faturaStr);

function gerarFaturaStr(fatura, pecas) {
  let faturaStr = `Fatura ${fatura.cliente}\n`;
  const formato = new Intl.NumberFormat("pt-BR", {
    style: "currency",
    currency: "BRL",
    minimumFractionDigits: 2,
  }).format;

  const calc = new ServicoCalculoFatura();

  for (let apre of fatura.apresentacoes) {
    faturaStr += `  ${calc.getPeca(apre, pecas).nome}: ${formatarMoeda(
      calc.calcularTotalApresentacao(pecas, apre)
    )} (${apre.audiencia} assentos)\n`;
  }
  faturaStr += `Valor total: ${formatarMoeda(
    calc.calcularTotalFatura(fatura, pecas)
  )}\n`;
  faturaStr += `Créditos acumulados: ${calc.calcularTotalCreditos(fatura, pecas)} \n`;
  return faturaStr;
}