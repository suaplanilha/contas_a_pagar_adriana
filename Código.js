// code.gs

/**
 * Adiciona uma nova conta a pagar na planilha.
 *
 * @param {Object} conta - Objeto contendo os dados da conta a pagar.
 * @returns {Object} Resposta indicando sucesso ou erro.
 */
function adicionarContaAPagar(conta) {
  Logger.log("Função adicionarContaAPagar iniciada.");
  Logger.log("Dados recebidos: " + JSON.stringify(conta));

  try {
    // Substitua 'ID_DA_PLANILHA' pelo ID real da sua planilha do Google Sheets sem a barra no final
    const sheetId = '1HvIIrXcP8nGHNJq9AtKB-S4AgzAKPa5E88evzFjpw74'; // <-- ID correto sem '/'
    Logger.log("Abrindo planilha com ID: " + sheetId);
    const spreadsheet = SpreadsheetApp.openById(sheetId);
    Logger.log("Planilha aberta com sucesso.");
    const sheet = spreadsheet.getSheetByName('ContasAPagar');

    if (!sheet) {
      throw new Error("A aba 'ContasAPagar' não foi encontrada na planilha.");
    }

    // Validação básica dos campos obrigatórios
    if (!conta || !conta.tipo || !conta.banco || !conta.data || !conta.valor || !conta.controle_pagamento || !conta.vencimento || !conta.id) {
      throw new Error('Por favor, preencha todos os campos obrigatórios.');
    }

    Logger.log("Verificando duplicidade do ID: " + conta.id);
    // Verificar se o ID já existe para evitar duplicatas
    const data = sheet.getDataRange().getValues();
    const idExists = data.some(row => row[0] === conta.id); // Supondo que o ID esteja na 1ª coluna (índice 0)
    if (idExists) {
      throw new Error('O ID já existe. Por favor, use um ID único.');
    }

    Logger.log("Adicionando nova conta à planilha.");
    // Adicionar a nova conta na planilha
    sheet.appendRow([
      conta.id,
      conta.alertas || '', // Campo opcional
      conta.vencimento,
      conta.controle_pagamento,
      conta.valor,
      conta.data,
      conta.banco,
      conta.tipo
    ]);

    Logger.log("Conta adicionada com sucesso.");
    // Retornar uma resposta de sucesso
    return { success: true, message: 'Conta adicionada com sucesso!' };

  } catch (error) {
    Logger.log("Erro na função adicionarContaAPagar: " + error.message);
    // Retornar uma resposta de erro
    return { success: false, message: error.message };
  }
}

/**
 * Recupera todas as contas a pagar da planilha.
 *
 * @returns {Array} Dados das contas a pagar.
 */
function getContasAPagar() {
  Logger.log("Função getContasAPagar iniciada.");
  try {
    const sheetId = '1HvIIrXcP8nGHNJq9AtKB-S4AgzAKPa5E88evzFjpw74'; // <-- ID correto sem '/'
    Logger.log("Abrindo planilha com ID: " + sheetId);
    const spreadsheet = SpreadsheetApp.openById(sheetId);
    Logger.log("Planilha aberta com sucesso.");
    const sheet = spreadsheet.getSheetByName('ContasAPagar');

    if (!sheet) {
      throw new Error("A aba 'ContasAPagar' não foi encontrada na planilha.");
    }

    const data = sheet.getDataRange().getValues();
    Logger.log("Dados recuperados: " + JSON.stringify(data));
    return data;

  } catch (error) {
    Logger.log("Erro na função getContasAPagar: " + error.message);
    return [];
  }
}

/**
 * Recupera o conteúdo de uma página HTML específica.
 *
 * @param {string} pageName - Nome do arquivo HTML a ser carregado.
 * @returns {string} Conteúdo HTML da página.
 */
function getPage(pageName) {
  Logger.log("Função getPage chamada para a página: " + pageName);
  try {
    return HtmlService.createHtmlOutputFromFile(pageName).getContent();
  } catch (e) {
    Logger.log("Erro ao carregar a página '" + pageName + "': " + e.message);
    return `<p>Erro ao carregar a página: ${pageName}</p>`;
  }
}

function doGet(e) {
  Logger.log("Função doGet chamada.");
  return HtmlService.createTemplateFromFile('index')
    .evaluate()
    .setTitle('Meu Projeto GAS')
    .setFaviconUrl('https://www.google.com/favicon.ico');
}

function include(filename) {
  Logger.log("Incluindo arquivo: " + filename);
  return HtmlService.createHtmlOutputFromFile(filename).getContent();
}
