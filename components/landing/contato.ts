// Não é exportado de propósito: o endereço não aparece em lugar nenhum da
// página, só alimenta o link de composição do Gmail abaixo.
const CONTATO_EMAIL = "profissionalba1is1a@gmail.com"

const ASSUNTO = "Quero o kairos na minha barbearia"

const CORPO = `Olá!

Tenho uma barbearia e quero conhecer o kairos.

Nome da barbearia:
Cidade:
Quantos barbeiros atendem:
WhatsApp para contato:`

/**
 * Abre a janela de composição do Gmail já endereçada, com assunto e um
 * roteiro do que precisamos saber — assim a primeira mensagem já chega
 * com as informações para montar a barbearia.
 */
export const LINK_CONTATO =
  "https://mail.google.com/mail/?view=cm&fs=1" +
  `&to=${encodeURIComponent(CONTATO_EMAIL)}` +
  `&su=${encodeURIComponent(ASSUNTO)}` +
  `&body=${encodeURIComponent(CORPO)}`
