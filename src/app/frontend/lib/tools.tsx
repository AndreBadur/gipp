import { redirect } from 'next/navigation'

export function validarSenha(senha: string, confirmaSenha: string): string {
  if (!senha || senha.length < 8) {
    return 'A senha deve ter no mínimo 8 caracteres'
  }
  if (!/[!@#$%^&*(),.?":{}|<>]/.test(senha)) {
    return 'A senha deve conter pelo menos um caractere especial'
  }
  if (senha !== confirmaSenha) {
    return 'As senhas não coincidem'
  }

  return ''
}

export function validarCpf(cpf: string) {
  let soma
  let resto
  soma = 0

  if (cpf === '00000000000') {
    return false
  }
  if (cpf.length !== 11 || /^(\d)\1+$/.test(cpf)) {
    return false
  }
  for (let i = 1; i <= 9; i++) {
    soma = soma + parseInt(cpf.substring(i - 1, i)) * (11 - i)
  }
  resto = (soma * 10) % 11
  if (resto === 10 || resto === 11) {
    resto = 0
  }
  if (resto !== parseInt(cpf.substring(9, 10))) {
    return false
  }
  soma = 0
  for (let i = 1; i <= 10; i++) {
    soma = soma + parseInt(cpf.substring(i - 1, i)) * (12 - i)
  }
  resto = (soma * 10) % 11
  if (resto == 10 || resto == 11) {
    resto = 0
  }
  if (resto != parseInt(cpf.substring(10, 11))) {
    return false
  }
  return true
}

export const regexCNPJ = /^\d{2}.\d{3}.\d{3}\/\d{4}-\d{2}$/

export function validCNPJ(value: string | number | number[] = '') {
  if (!value) return false

  const isString = typeof value === 'string'
  const validTypes = isString || Number.isInteger(value) || Array.isArray(value)

  if (!validTypes) return false

  if (isString) {
    const digitsOnly = /^\d{14}$/.test(value)
    const validFormat = regexCNPJ.test(value)
    const isValid = digitsOnly || validFormat

    if (!isValid) return false
  }

  const numbers = matchNumbers(value)

  if (numbers.length !== 14) return false

  const items = [...new Set(numbers)]
  if (items.length === 1) return false

  const digits = numbers.slice(12)

  const digit0 = validCalc(12, numbers)
  if (digit0 !== digits[0]) return false

  const digit1 = validCalc(13, numbers)
  return digit1 === digits[1]
}

export function formatCNPJ(value: string | number | number[] = '') {
  const valid = validCNPJ(value)

  if (!valid) return ''

  const numbers = matchNumbers(value)
  const text = numbers.join('')

  const format = text.replace(
    /(\d{2})(\d{3})(\d{3})(\d{4})(\d{2})/,
    '$1.$2.$3/$4-$5'
  )

  return format
}

function validCalc(x: number, numbers: number[]) {
  const slice = numbers.slice(0, x)
  let factor = x - 7
  let sum = 0

  for (let i = x; i >= 1; i--) {
    const n = slice[x - i]
    sum += n * factor--
    if (factor < 2) factor = 9
  }

  const result = 11 - (sum % 11)

  return result > 9 ? 0 : result
}

function matchNumbers(value: string | number | number[] = '') {
  const match = value.toString().match(/\d/g)
  return Array.isArray(match) ? match.map(Number) : []
}

export function redirectSignIn() {
  redirect('/sign/in')
}
export function redirectSignUp() {
  redirect('/sign/up')
}
