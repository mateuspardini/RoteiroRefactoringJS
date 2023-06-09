function formatarMoeda(valor) {
    const formato = new Intl.NumberFormat("pt-BR", {
      style: "currency",
      currency: "BRL",
      minimumFractionDigits: 2,
    });
  
    return formato.format(valor / 100);
  }
  
  module.exports = formatarMoeda;
  