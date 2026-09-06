export function senhaValidaServidor(senha: string): boolean {
  const temTamanho = senha.length >= 8
  const temMaiuscula = /[A-Z]/.test(senha)
  const temNumero = /[0-9]/.test(senha)
  const temEspecial = /[^A-Za-z0-9]/.test(senha)
  return temTamanho && temMaiuscula && temNumero && temEspecial
}

export const ERRO_SENHA_FRACA =
  "A senha precisa ter no mínimo 8 caracteres, com letra maiúscula, número e caractere especial."
