// code.gs

/**
 * Adiciona uma nova conta.
 *
 * @param {Object} conta - Objeto contendo os dados da conta.
 * @param {string} tipo - Tipo da conta ('contas_a_pagar', 'contas_a_receber', 'ferias').
 * @returns {Object} Resposta indicando sucesso ou erro.
 */
function adicionarConta(conta, tipo) {
  Logger.log(`Função adicionarConta iniciada para tipo: ${tipo}`);
  Logger.log("Dados recebidos: " + JSON.stringify(conta));

  try {
    const sheetId = '1HvIIrXcP8nGHNJq9AtKB-S4AgzAKPa5E88evzFjpw74'; // ID da planilha
    const spreadsheet = SpreadsheetApp.openById(sheetId);
    const sheet = spreadsheet.getSheetByName(capitalizeFirstLetter(tipo));

    if (!sheet) {
      throw new Error(`A aba '${capitalizeFirstLetter(tipo)}' não foi encontrada na planilha.`);
    }

    // Validação básica dos campos obrigatórios
    const obrigatorios = ['tipo', 'banco', 'data', 'valor', 'controle_pagamento', 'vencimento', 'id'];
    for (let campo of obrigatorios) {
      if (!conta[campo] || (campo === 'valor' && isNaN(conta[campo]))) {
        throw new Error(`Por favor, preencha todos os campos obrigatórios.`);
      }
    }

    // Verificar se o ID já existe para evitar duplicatas
    const data = sheet.getDataRange().getValues();
    const idExists = data.some(row => row[0] === conta.id);
    if (idExists) {
      throw new Error('O ID já existe. Por favor, use um ID único.');
    }

    // Adicionar a nova conta na planilha
    sheet.appendRow([
      conta.id,
      conta.alertas || '',
      conta.vencimento,
      conta.controle_pagamento,
      conta.valor,
      conta.data,
      conta.banco,
      conta.tipo
    ]);

    Logger.log("Conta adicionada com sucesso.");
    return { success: true, message: 'Conta adicionada com sucesso!' };

  } catch (error) {
    Logger.log(`Erro na função adicionarConta: ${error.message}`);
    return { success: false, message: error.message };
  }
}

/**
 * Recupera todas as contas de um tipo específico.
 *
 * @param {string} tipo - Tipo da conta ('contas_a_pagar', 'contas_a_receber', 'ferias').
 * @returns {Array} Dados das contas.
 */
function getContas(tipo) {
  Logger.log(`Função getContas iniciada para tipo: ${tipo}`);
  try {
    const sheetId = '1HvIIrXcP8nGHNJq9AtKB-S4AgzAKPa5E88evzFjpw74';
    const spreadsheet = SpreadsheetApp.openById(sheetId);
    const sheet = spreadsheet.getSheetByName(capitalizeFirstLetter(tipo));

    if (!sheet) {
      throw new Error(`A aba '${capitalizeFirstLetter(tipo)}' não foi encontrada na planilha.`);
    }

    const data = sheet.getDataRange().getValues();
    Logger.log("Dados recuperados: " + JSON.stringify(data));
    return data;

  } catch (error) {
    Logger.log(`Erro na função getContas: ${error.message}`);
    return [];
  }
}

/**
 * Exclui uma conta pelo ID.
 *
 * @param {string} id - ID da conta.
 * @param {string} tipo - Tipo da conta ('contas_a_pagar', 'contas_a_receber', 'ferias').
 * @returns {Object} Resposta indicando sucesso ou erro.
 */
function excluirConta(id, tipo) {
  Logger.log(`Função excluirConta iniciada para ID: ${id} e tipo: ${tipo}`);
  try {
    const sheetId = '1HvIIrXcP8nGHNJq9AtKB-S4AgzAKPa5E88evzFjpw74';
    const spreadsheet = SpreadsheetApp.openById(sheetId);
    const sheet = spreadsheet.getSheetByName(capitalizeFirstLetter(tipo));

    if (!sheet) {
      throw new Error(`A aba '${capitalizeFirstLetter(tipo)}' não foi encontrada na planilha.`);
    }

    const data = sheet.getDataRange().getValues();
    const rowIndex = data.findIndex(row => row[0] === id);

    if (rowIndex === -1) {
      throw new Error('Conta não encontrada.');
    }

    sheet.deleteRow(rowIndex + 1);
    Logger.log("Conta excluída com sucesso.");
    return { success: true, message: 'Conta excluída com sucesso!' };

  } catch (error) {
    Logger.log(`Erro na função excluirConta: ${error.message}`);
    return { success: false, message: error.message };
  }
// Funções específicas para Contas a Receber
}

/**
 * Atualiza uma conta existente.
 *
 * @param {Object} conta - Objeto contendo os dados atualizados da conta.
 * @param {string} tipo - Tipo da conta ('contas_a_pagar', 'contas_a_receber', 'ferias').
 * @returns {Object} Resposta indicando sucesso ou erro.
 */
function atualizarConta(conta, tipo) {
  Logger.log(`Função atualizarConta iniciada para ID: ${conta.id} e tipo: ${tipo}`);
  try {
    const sheetId = '1HvIIrXcP8nGHNJq9AtKB-S4AgzAKPa5E88evzFjpw74';
    const spreadsheet = SpreadsheetApp.openById(sheetId);
    const sheet = spreadsheet.getSheetByName(capitalizeFirstLetter(tipo));

    if (!sheet) {
      throw new Error(`A aba '${capitalizeFirstLetter(tipo)}' não foi encontrada na planilha.`);
    }

    const data = sheet.getDataRange().getValues();
    const rowIndex = data.findIndex(row => row[0] === conta.id);

    if (rowIndex === -1) {
      throw new Error('Conta não encontrada.');
    }

    // Atualizar os dados na planilha
    sheet.getRange(rowIndex + 1, 2, 1, 7).setValues([[
      conta.alertas || '',
      conta.vencimento,
      conta.controle_pagamento,
      conta.valor,
      conta.data,
      conta.banco,
      conta.tipo
    ]]);

    Logger.log("Conta atualizada com sucesso.");
    return { success: true, message: 'Conta atualizada com sucesso!' };

  } catch (error) {
    Logger.log(`Erro na função atualizarConta: ${error.message}`);
    return { success: false, message: error.message };
  }
}

/**
 * Recupera o conteúdo de uma página HTML específica.
 *
 * @param {string} pageName - Nome do arquivo HTML a ser carregado.
 * @returns {string} Conteúdo HTML da página.
 */
function getPage(pageName) {
  Logger.log(`Função getPage chamada para a página: ${pageName}`);
  try {
    return HtmlService.createHtmlOutputFromFile(pageName).getContent();
  } catch (e) {
    Logger.log(`Erro ao carregar a página '${pageName}': ${e.message}`);
    return `<p>Erro ao carregar a página: ${pageName}</p>`;
  }
}

function doGet(e) {
  Logger.log("Função doGet chamada.");
  return HtmlService.createTemplateFromFile('index')
    .evaluate()
    .setTitle('Controle de Contas')
    .setFaviconUrl('https://www.google.com/favicon.ico');
}

function include(filename) {
  Logger.log(`Incluindo arquivo: ${filename}`);
  return HtmlService.createHtmlOutputFromFile(filename).getContent();
}

/**
 * Função auxiliar para capitalizar a primeira letra.
 *
 * @param {string} str - String a ser capitalizada.
 * @returns {string} String com a primeira letra capitalizada.
 */
function capitalizeFirstLetter(str) {
  return str.charAt(0).toUpperCase() + str.slice(1);
}


/**
 * Adiciona uma nova conta a receber.
 *
 * @param {Object} conta - Objeto contendo os dados da conta.
 * @returns {Object} Resposta indicando sucesso ou erro.
 */
function adicionarContaAReceber(conta) {
  return adicionarConta(conta, 'contas_a_receber');
}

/**
 * Recupera todas as contas a receber.
 *
 * @returns {Array} Dados das contas a receber.
 */
function getContasAReceber() {
  return getContas('contas_a_receber');
}

/**
 * Exclui uma conta a receber pelo ID.
 *
 * @param {string} id - ID da conta a receber.
 * @returns {Object} Resposta indicando sucesso ou erro.
 */
function excluirContaAReceber(id) {
  return excluirConta(id, 'contas_a_receber');
}

/**
 * Atualiza uma conta a receber existente.
 *
 * @param {Object} conta - Objeto contendo os dados atualizados da conta.
 * @returns {Object} Resposta indicando sucesso ou erro.
 */
function atualizarContaAReceber(conta) {
  return atualizarConta(conta, 'contas_a_receber');
}

// Funções específicas para Controle de Férias

/**
 * Adiciona uma nova férias.
 *
 * @param {Object} ferias - Objeto contendo os dados das férias.
 * @returns {Object} Resposta indicando sucesso ou erro.
 */
function adicionarFerias(ferias) {
  Logger.log("Função adicionarFerias iniciada.");
  try {
    const sheetId = '1HvIIrXcP8nGHNJq9AtKB-S4AgzAKPa5E88evzFjpw74';
    const spreadsheet = SpreadsheetApp.openById(sheetId);
    const sheet = spreadsheet.getSheetByName('Ferias');

    if (!sheet) {
      throw new Error("A aba 'Ferias' não foi encontrada na planilha.");
    }

    // Validação básica dos campos obrigatórios
    const obrigatorios = ['nome', 'data_inicio', 'data_fim', 'tipo', 'id'];
    for (let campo of obrigatorios) {
      if (!ferias[campo]) {
        throw new Error(`Por favor, preencha o campo ${campo}.`);
      }
    }

    // Verificar se o ID já existe para evitar duplicatas
    const data = sheet.getDataRange().getValues();
    const idExists = data.some(row => row[0] === ferias.id);
    if (idExists) {
      throw new Error('O ID já existe. Por favor, use um ID único.');
    }

    // Adicionar a nova férias na planilha
    sheet.appendRow([
      ferias.id,
      ferias.nome,
      ferias.data_inicio,
      ferias.data_fim,
      ferias.tipo
    ]);

    Logger.log("Férias adicionadas com sucesso.");
    return { success: true, message: 'Férias adicionadas com sucesso!' };

  } catch (error) {
    Logger.log(`Erro na função adicionarFerias: ${error.message}`);
    return { success: false, message: error.message };
  }
}

/**
 * Recupera todas as férias.
 *
 * @returns {Array} Dados das férias.
 */
function getFerias() {
  Logger.log("Função getFerias iniciada.");
  try {
    const sheetId = '1HvIIrXcP8nGHNJq9AtKB-S4AgzAKPa5E88evzFjpw74';
    const spreadsheet = SpreadsheetApp.openById(sheetId);
    const sheet = spreadsheet.getSheetByName('Ferias');

    if (!sheet) {
      throw new Error("A aba 'Ferias' não foi encontrada na planilha.");
    }

    const data = sheet.getDataRange().getValues();
    Logger.log("Dados recuperados: " + JSON.stringify(data));
    return data;

  } catch (error) {
    Logger.log(`Erro na função getFerias: ${error.message}`);
    return [];
  }
}

/**
 * Exclui uma férias pelo ID.
 *
 * @param {string} id - ID da férias.
 * @returns {Object} Resposta indicando sucesso ou erro.
 */
function excluirFerias(id) {
  Logger.log(`Função excluirFerias iniciada para ID: ${id}`);
  try {
    const sheetId = '1HvIIrXcP8nGHNJq9AtKB-S4AgzAKPa5E88evzFjpw74';
    const spreadsheet = SpreadsheetApp.openById(sheetId);
    const sheet = spreadsheet.getSheetByName('Ferias');

    if (!sheet) {
      throw new Error("A aba 'Ferias' não foi encontrada na planilha.");
    }

    const data = sheet.getDataRange().getValues();
    const rowIndex = data.findIndex(row => row[0] === id);

    if (rowIndex === -1) {
      throw new Error('Férias não encontradas.');
    }

    sheet.deleteRow(rowIndex + 1);
    Logger.log("Férias excluídas com sucesso.");
    return { success: true, message: 'Férias excluídas com sucesso!' };

  } catch (error) {
    Logger.log(`Erro na função excluirFerias: ${error.message}`);
    return { success: false, message: error.message };
  }
}

/**
 * Atualiza uma férias existente.
 *
 * @param {Object} ferias - Objeto contendo os dados atualizados das férias.
 * @param {string} tipo - Tipo da conta ('ferias').
 * @returns {Object} Resposta indicando sucesso ou erro.
 */
function atualizarFerias(ferias) {
  Logger.log(`Função atualizarFerias iniciada para ID: ${ferias.id}`);
  try {
    const sheetId = '1HvIIrXcP8nGHNJq9AtKB-S4AgzAKPa5E88evzFjpw74';
    const spreadsheet = SpreadsheetApp.openById(sheetId);
    const sheet = spreadsheet.getSheetByName('Ferias');

    if (!sheet) {
      throw new Error("A aba 'Ferias' não foi encontrada na planilha.");
    }

    const data = sheet.getDataRange().getValues();
    const rowIndex = data.findIndex(row => row[0] === ferias.id);

    if (rowIndex === -1) {
      throw new Error('Férias não encontradas.');
    }

    // Atualizar os dados na planilha
    sheet.getRange(rowIndex + 1, 2, 1, 4).setValues([[
      ferias.nome,
      ferias.data_inicio,
      ferias.data_fim,
      ferias.tipo
    ]]);

    Logger.log("Férias atualizadas com sucesso.");
    return { success: true, message: 'Férias atualizadas com sucesso!' };

  } catch (error) {
    Logger.log(`Erro na função atualizarFerias: ${error.message}`);
    return { success: false, message: error.message };
  }
}

/**
 * Recupera todas as contas a pagar.
 *
 * @returns {Array} Dados das contas a pagar.
 */
function getContasAPagar() {
  Logger.log("Função getContasAPagar iniciada.");
  try {
    const contas = getContas('contas_a_pagar');
    Logger.log("Contas a pagar recuperadas com sucesso.");
    return contas;
  } catch (error) {
    Logger.log(`Erro na função getContasAPagar: ${error.message}`);
    throw error;
  }
}

/**
 * Adiciona uma nova conta a pagar.
 *
 * @param {Object} conta - Objeto contendo os dados da conta.
 * @returns {Object} Resposta indicando sucesso ou erro.
 */
function adicionarContaAPagar(conta) {
  Logger.log("Função adicionarContaAPagar iniciada.");
  try {
    const resposta = adicionarConta(conta, 'contas_a_pagar');
    Logger.log("Conta a pagar adicionada com sucesso.");
    return resposta;
  } catch (error) {
    Logger.log(`Erro na função adicionarContaAPagar: ${error.message}`);
    throw error;
  }
}

/**
 * Inicializa as funcionalidades específicas para Contas a Receber.
 */
function initializeContasAReceber() {
  const form = document.getElementById('formContaAReceber');
  if (form) {
    form.addEventListener('submit', handleSubmitContasAReceber);
  } else {
    console.error("Elemento 'formContaAReceber' não encontrado.");
  }

  carregarContasAReceber();
}

/**
 * Manipula a submissão do formulário Contas a Receber.
 *
 * @param {Event} e - Evento de submissão.
 */
function handleSubmitContasAReceber(e) {
  e.preventDefault();
  Logger.log("Submetendo formulário Contas a Receber.");
  // Implementar lógica similar a handleSubmitContasAPagar
  // ...
}

/**
 * Recupera todas as contas a receber.
 *
 * @returns {Array} Dados das contas a receber.
 */
function getContasAReceber() {
  Logger.log("Função getContasAReceber iniciada.");
  try {
    const contas = getContas('contas_a_receber');
    Logger.log("Contas a receber recuperadas com sucesso.");
    return contas;
  } catch (error) {
    Logger.log(`Erro na função getContasAReceber: ${error.message}`);
    throw error;
  }
}

/**
 * Adiciona uma nova conta a receber.
 *
 * @param {Object} conta - Objeto contendo os dados da conta.
 * @returns {Object} Resposta indicando sucesso ou erro.
 */
function adicionarContaAReceber(conta) {
  Logger.log("Função adicionarContaAReceber iniciada.");
  try {
    const resposta = adicionarConta(conta, 'contas_a_receber');
    Logger.log("Conta a receber adicionada com sucesso.");
    return resposta;
  } catch (error) {
    Logger.log(`Erro na função adicionarContaAReceber: ${error.message}`);
    throw error;
  }
}