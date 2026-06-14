export function emailBoasVindas({ nome, barbeariaNome }: { nome: string; barbeariaNome: string }) {
  const primeiroNome = nome.trim().split(" ")[0] || "tudo bem"

  return `
  <div style="font-family: Arial, sans-serif; max-width: 480px; margin: 0 auto; padding: 24px; color: #1a1a1a;">
    <h2 style="color: #b8860b; margin-bottom: 8px;">Bem-vindo(a), ${primeiroNome}!</h2>
    <p style="font-size: 15px; line-height: 1.6;">
      Sua conta na <strong>${barbeariaNome}</strong> foi criada com sucesso.
    </p>
    <p style="font-size: 15px; line-height: 1.6;">
      Agora você pode agendar seus horários, acompanhar seus agendamentos e avaliar
      os atendimentos direto pelo nosso site.
    </p>
    <p style="font-size: 15px; line-height: 1.6; margin-top: 24px;">
      Até breve!<br/>
      Equipe ${barbeariaNome}
    </p>
  </div>
  `
}
