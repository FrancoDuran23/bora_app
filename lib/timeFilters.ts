// Time filter utilities for plans

export function getTimeRanges() {
  const now = new Date();

  // AHORA: next 60 minutes
  const nowStart = now;
  const nowEnd = new Date(now.getTime() + 60 * 60 * 1000);

  // HOY: from now+60min until end of today (23:59:59)
  const todayStart = nowEnd;
  const todayEnd = new Date(now);
  todayEnd.setHours(23, 59, 59, 999);

  // MAÑANA: tomorrow 00:00 to tomorrow 18:00
  const tomorrowStart = new Date(now);
  tomorrowStart.setDate(tomorrowStart.getDate() + 1);
  tomorrowStart.setHours(0, 0, 0, 0);

  const tomorrowEnd = new Date(tomorrowStart);
  tomorrowEnd.setHours(18, 0, 0, 0);

  return {
    now: { start: nowStart, end: nowEnd },
    today: { start: todayStart, end: todayEnd },
    tomorrow: { start: tomorrowStart, end: tomorrowEnd },
  };
}

export function filterPlansByTimeRange<T extends { start_at: string }>(
  plans: T[],
  range: "now" | "today" | "tomorrow"
): T[] {
  const ranges = getTimeRanges();
  const { start, end } = ranges[range];

  return plans.filter((plan) => {
    const planTime = new Date(plan.start_at);
    return planTime >= start && planTime <= end;
  });
}

export function formatTime(dateString: string): string {
  const date = new Date(dateString);
  return date.toLocaleTimeString("es-AR", {
    hour: "2-digit",
    minute: "2-digit",
    hour12: false,
  });
}

export function formatRelativeTime(dateString: string): string {
  const date = new Date(dateString);
  const now = new Date();
  const diffMs = date.getTime() - now.getTime();
  const diffMins = Math.round(diffMs / 60000);

  if (diffMins < 0) {
    return "En curso";
  } else if (diffMins < 60) {
    return `En ${diffMins} min`;
  } else {
    return formatTime(dateString);
  }
}

export function getQuickTimes(): { label: string; value: Date }[] {
  const now = new Date();

  const plus20 = new Date(now.getTime() + 20 * 60 * 1000);
  const plus60 = new Date(now.getTime() + 60 * 60 * 1000);

  const tonight2030 = new Date(now);
  tonight2030.setHours(20, 30, 0, 0);
  if (tonight2030 < now) tonight2030.setDate(tonight2030.getDate() + 1);

  const tonight2200 = new Date(now);
  tonight2200.setHours(22, 0, 0, 0);
  if (tonight2200 < now) tonight2200.setDate(tonight2200.getDate() + 1);

  const tomorrow0800 = new Date(now);
  tomorrow0800.setDate(tomorrow0800.getDate() + 1);
  tomorrow0800.setHours(8, 0, 0, 0);

  return [
    { label: "+20 min", value: plus20 },
    { label: "+1 hora", value: plus60 },
    { label: "20:30", value: tonight2030 },
    { label: "22:00", value: tonight2200 },
    { label: "Mañana 08:00", value: tomorrow0800 },
  ];
}
