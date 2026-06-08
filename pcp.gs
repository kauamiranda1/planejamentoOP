function pcp() {
  const WEBHOOK = PropertiesService.getScriptProperties().getProperty('SEATALK_WEBHOOK');
  
  const SS = SpreadsheetApp.getActiveSpreadsheet();

  const dia = new Date(); 
  const dataFormatada = Utilities.formatDate(dia, "GMT-3", "dd/MM/yyyy");
  let hora = dia.getHours();
  
  let pag = "";
  if(hora >= 6 && hora < 15){ pag = "PCP"; } else if(hora >= 15 && hora < 23){ pag = "PCP" } else { pag = "PCP" }
  
  const aba = SS.getSheetByName(pag);
  if (!aba) {
    return;
  }

  let hcPlanejado = aba.getRange("N6").getDisplayValue();         
  let hcReal = aba.getRange("O6").getDisplayValue();             
  let diaristasPlanejados = aba.getRange("P6").getDisplayValue();
  let diaristasReal = aba.getRange("Q6").getDisplayValue();       
  
  let esteiraVermelha = aba.getRange("R6").getDisplayValue();     
  let esteiraAmarela = aba.getRange("S6").getDisplayValue();      
  let esteiraAzul = aba.getRange("T6").getDisplayValue();         
  let esteiraTermo = aba.getRange("U6").getDisplayValue();        
  let adOp = aba.getRange("N7").getDisplayValue();  
  let adDia =  aba.getRange("P7").getDisplayValue();
  let msg = `📋 *Planejamento do Quadro Operacional – ${pag} | ${dataFormatada}*\n\n`;

  msg += `🔹 👥 *Planejado x Real*\n`;
  msg += `HC Fixo Planejado: ${hcPlanejado}\n`;
  msg += `HC Fixo Real: ${hcReal}\n\n`;
  
  msg += `👨‍🔧 *Diaristas Planejados*\n`;
  msg += `Planejado: ${diaristasPlanejados}\n`;
  msg += `Real: ${diaristasReal}\n\n`;
  
  msg += `🔹 🛠️ *Configuração das Esteiras – Planejado*\n\n`;
  msg += `🔴 Esteira : Operadores planejados: ${esteiraVermelha}\n`;
  msg += `🟡 Esteira : Operadores planejados: ${esteiraAmarela}\n`;
  msg += `🔵 Esteira : Operadores planejados: ${esteiraAzul}\n`;
  msg += `🟢 Esteira Termoplástica : Operadores planejados ${esteiraTermo}\n\n`;
  msg += `🔹 📊 *Aderência DW (Eventuais)*\n\n`;
  msg += `•  *Aderência Operadores : ${adOp}* ${parseFloat(adOp.replace("%", "")) >= 100 ? "✅" : "⚠️"}\n`;
  msg += `•  *Aderência Diaristas : ${adDia}* ${parseFloat(adDia.replace("%", "")) >= 100 ? "✅" : "❌"}\n`;

  if(hcPlanejado === "#REF!" || hcPlanejado === "#DIV/0!") {
    msg = "Erro na Base";
  }

  enviar_seatalk(WEBHOOK, msg);

  console.log(msg);
}

function enviar_seatalk(url, conteudo) {
  // Segurança extra: se você errar o nome da propriedade, o script avisa em vez de quebrar bruto
  if (!url) {
    Logger.log("Erro: A propriedade 'SEATALK_WEBHOOK' não foi encontrada nas configurações.");
    return;
  }

  const response = UrlFetchApp.fetch(url, {
    method: "post",
    contentType: "application/json",
    payload: JSON.stringify({ tag: "text", text: { content: conteudo } }),
    muteHttpExceptions: true
  });

  Logger.log(response.getContentText());
}
