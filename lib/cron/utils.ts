export function getTimeAsString(milliseconds: number): string {
  // Calculate hours, minutes, seconds, and remaining milliseconds
  const hours = Math.floor(milliseconds / 3600000);
  milliseconds %= 3600000;
  const minutes = Math.floor(milliseconds / 60000);
  milliseconds %= 60000;
  const seconds = Math.floor(milliseconds / 1000);
  milliseconds %= 1000;

  // Build the time string
  let timeString = "";
  if (hours > 0) timeString += `${hours}ч `;
  if (minutes > 0) timeString += `${minutes}м `;
  if (seconds > 0) timeString += `${seconds}с `;
  if (milliseconds > 0) timeString += `${milliseconds}мс`;

  // Trim any trailing space
  return timeString.trim();
}

export function getReturn(message: string, start: Date) {
  const end = new Date();
  const time = getTimeAsString(end.getTime() - start.getTime());

  return {
    message,
    start: start.toISOString(),
    end: end.toISOString(),
    time,
  };
}
