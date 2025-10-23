// Utilitário de CPF: valida e formata em 000.000.000-00

export function onlyDigits(input: string | number | null | undefined): string {
  if (input === null || input === undefined) return ''
  return String(input).replace(/\D+/g, '')
}

export function formatCPF(input: string | number | null | undefined): string {
  const digits = onlyDigits(input).padStart(11, '0').slice(-11)
  if (digits.length !== 11) return ''
  return `${digits.slice(0, 3)}.${digits.slice(3, 6)}.${digits.slice(6, 9)}-${digits.slice(9, 11)}`
}

export function isValidCPF(input: string | number | null | undefined): boolean {
  const cpf = onlyDigits(input)
  if (!cpf || cpf.length !== 11) return false
  if (/^(\d)\1{10}$/.test(cpf)) return false
  let sum = 0
  for (let i = 0; i < 9; i++) sum += parseInt(cpf.charAt(i)) * (10 - i)
  let rev = 11 - (sum % 11)
  if (rev === 10 || rev === 11) rev = 0
  if (rev !== parseInt(cpf.charAt(9))) return false
  sum = 0
  for (let i = 0; i < 10; i++) sum += parseInt(cpf.charAt(i)) * (11 - i)
  rev = 11 - (sum % 11)
  if (rev === 10 || rev === 11) rev = 0
  return rev === parseInt(cpf.charAt(10))
}