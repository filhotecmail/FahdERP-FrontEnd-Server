// Utilitário de datas/hora reutilizável
// Formata em DD/MM/YYYY, HH:MM:SS AM/PM (locale pt-BR com hour12)

export type DateInput = string | number | Date | null | undefined

function toDate(val: DateInput): Date | null {
  if (val === null || val === undefined || val === '') return null
  if (val instanceof Date) return isNaN(val.getTime()) ? null : val
  if (typeof val === 'number') {
    const ms = String(val).length === 10 ? val * 1000 : val
    const d = new Date(ms)
    return isNaN(d.getTime()) ? null : d
  }
  if (typeof val === 'string') {
    let d = new Date(val)
    if (isNaN(d.getTime())) {
      // tenta normalizar ISO sem T/Z
      const normalized = val.replace('T', ' ').replace('Z', '')
      d = new Date(normalized)
    }
    return isNaN(d.getTime()) ? null : d
  }
  return null
}

export function formatBR12(val: DateInput): string {
  const d = toDate(val);
  if (!d) return '-';

  return d.toLocaleString(undefined, {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
    second: '2-digit',
    hourCycle: 'h12',
    timeZone: 'UTC'
  });
}

export function formatBR24(val: DateInput): string {
  const d = toDate(val);
  if (!d) return '-';

  return d.toLocaleString(undefined, {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
    second: '2-digit',
    hourCycle: 'h23',
    timeZone: 'UTC'
  });
}
