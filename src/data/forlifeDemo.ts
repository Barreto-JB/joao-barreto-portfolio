export const activity = 'Ginásio Musculação/Cardio Fitness'
export const demoSession = 'DEMO-SESSION-001'
export const operations = ['Apps Script', 'SessionInitializeV2', 'Activity discovery', 'ReservationsGetCurrent', 'Booking window', 'Illustrative booking', 'ReservationsGetCurrent', 'MemberGetIdentifCode', 'Wallet integration', 'Pass preview']
export const routeNames = ['trigger', 'session', 'activities', 'reservations/current', 'booking-window', 'bookings', 'reservations/current', 'identification', 'wallet', 'pass']
const source = [
  'function scheduledRun() {\n  runBookingWorkflow();\n  runAccessWorkflow();\n}',
  'const session = initializeDemoSession();\nif (!session.ok) return { status: "failed" };',
  'const activity = findDemoActivity("Ginásio Musculação/Cardio Fitness");',
  'const reservations = getCurrentReservations();\nconst alreadyBooked = reservations.some(\n  item => item.sessionId === demoSession\n);',
  'const opensAt = sessionStart - allowedAdvanceInterval;\nconst windowOpen = now >= opensAt && now < sessionStart;',
  'if (alreadyBooked || !windowOpen) return;\nsubmitIllustrativeBooking(demoSession);',
  'const reservations = getCurrentReservations();\nconst confirmed = reservations.some(\n  item => item.sessionId === demoSession && item.status === "confirmed"\n);',
  'const currentCode = readDemoIdentificationCode();\nif (!isValid(currentCode, now)) return;',
  'if (currentCode.value !== pass.code && isValid(currentCode, now)) {\n  synchronizeDemoPass(currentCode);\n}',
  'showDemoPass({ code: "DEMO ONLY", updatedAt, validUntil });',
]

export function demoResult(step: number, scenario: number) {
  const failed = step === 1 && scenario === 4
  const skipped = step === 5 && (scenario === 1 || scenario === 2) || step === 6 && scenario === 2
  const waiting = step === 4 && scenario === 2
  const code = scenario === 3 ? 'DEMO-CODE-002' : 'DEMO-CODE-001'
  const confirmed = { id: 'DEMO-RES-001', sessionId: demoSession, status: 'confirmed' }
  const responses = [
    { trigger: 'scheduled', mode: 'simulation' },
    failed ? { success: false, error: 'DEMO_SESSION_UNAVAILABLE' } : { success: true, session: 'DEMO-CONTEXT' },
    { activity, sessionId: demoSession },
    { reservations: scenario === 1 ? [confirmed] : [] },
    { windowOpen: scenario !== 2, openingTime: '2027-01-12T07:00:00Z' },
    skipped ? { submitted: false, reason: scenario === 1 ? 'already_booked' : 'waiting' } : { submitted: true, id: confirmed.id },
    { confirmed: scenario !== 2, reservations: scenario !== 2 ? [confirmed] : [] },
    { code, previousCodeExpired: scenario === 3 },
    { synchronized: true, code, validUntil: '2027-01-12T11:00:00Z' },
    { status: 'ready', updatedAt: '2027-01-12T08:00:00Z', validUntil: '2027-01-12T11:00:00Z' },
  ]
  const status = failed ? 'failed' : skipped ? 'skipped' : waiting ? 'waiting' : 'success'
  const local = [0, 4, 9].includes(step) || skipped
  const request = { mode: 'simulation', activity, sessionId: demoSession, ...(step === 8 ? { code } : {}) }
  return {
    status, code,
    request: local ? JSON.stringify({ ...request, transport: null }, null, 2) : [
      'POST https://example.invalid/demo/api/' + routeNames[step],
      'Content-Type: application/json', 'X-Demo-Mode: simulation', '', JSON.stringify(request, null, 2),
    ].join('\n'),
    response: [local ? '' : failed ? 'HTTP/1.1 503 Service Unavailable · 156 ms' : 'HTTP/1.1 200 OK · ' + (70 + step * 13) + ' ms', JSON.stringify(responses[step], null, 2)].filter(Boolean).join('\n\n'),
    source: source[step],
  } as const
}
