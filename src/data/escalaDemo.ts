const staffCode = 'DEMO-014'
export const firstDay = 1
export const lastDay = 30
export const sampleDay = 15

export function calendarDate(day: number) {
  return new Date(Date.UTC(2026, 5, day))
}

function dateKey(day: number) {
  return calendarDate(day).toISOString().slice(0, 10)
}

type Place = 'North' | 'South' | 'Parking'
type Shift = { date: string; code: string; place: Place; starts: string; ends: string }

function shift(day: number, place: Place, starts: string, ends: string, code = staffCode): Shift {
  return { date: dateKey(day), code, place, starts, ends }
}

const attachments = [
  { name: 'rota-a-demo.pdf', rows: [
    shift(2, 'North', '09:00', '15:00'), shift(8, 'South', '13:00', '19:00'),
    shift(15, 'North', '08:00', '14:00'), shift(23, 'South', '13:00', '19:00'),
    shift(16, 'North', '09:00', '15:00', 'DEMO-039'),
  ] },
  { name: 'rota-b-demo.pdf', rows: [
    shift(5, 'Parking', '08:00', '14:00'), shift(12, 'Parking', '14:00', '20:00'),
    shift(18, 'Parking', '08:00', '14:00'), shift(27, 'Parking', '14:00', '20:00'),
  ] },
]

const matchingShifts = attachments
  .flatMap(file => file.rows)
  .filter(row => row.code === staffCode)
  .sort((a, b) => a.date.localeCompare(b.date))

export function getDay(day: number) {
  const date = dateKey(day)
  return {
    date,
    shift: matchingShifts.find(item => item.date === date),
    next: matchingShifts.find(item => item.date > date),
  }
}

export function samplePayload(step: number, day: number) {
  const files = attachments.map(file => file.name)
  const result = getDay(day)
  const payloads = [
    { from: 'rota@example.invalid', attachments: files },
    { expected: 2, found: files, valid: true },
    { files: attachments.map(file => ({ name: file.name, count: file.rows.length, example: file.rows[0] })) },
    { code: staffCode, count: matchingShifts.length, firstMatch: matchingShifts[0] },
    { month: '2026-06', workingDays: matchingShifts.map(item => item.date), daysOff: lastDay - matchingShifts.length },
    { date: result.date, status: result.shift ? 'working' : 'day_off', shift: result.shift ?? null, next: result.next?.date ?? null },
  ]
  return JSON.stringify(payloads[step], null, 2)
}
