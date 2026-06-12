function alerta() {  
  const WEBHOOK = PropertiesService.getScriptProperties().getProperty('SEATALK.WEBHOOK');
  const EMAIL = PropertiesService.getScriptProperties().getProperty('EMAIL');
  const EMAIL2 = PropertiesService.getScriptProperties().getProperty('EMAIL2');
  
  const dia = new Date();  
  const data = Utilities.formatDate(dia, "GMT-3", "dd/MM/yyyy");  
  
  let msg = `\n⏰ *Lembrete - ${data}*\n**ENVIAR REPORT DE PCP**`;  
  
  let lista = [];

    if(EMAIL){

      lista = [EMAIL, EMAIL2];
    }
    else{

      lista = [];

    }

  enviar(WEBHOOK, msg, lista);  
  
  console.log(msg);  
}

function enviar(webhookUrl, msg, lista) {
  UrlFetchApp.fetch(webhookUrl, {
    method: "post",
    contentType: "application/json",
    payload: JSON.stringify({ 
      tag: "text", 
      text: { 
        content: msg,
        at_all: false, 
        mentioned_email_list: lista 
      } 
    }),
    muteHttpExceptions: true
  });
}
