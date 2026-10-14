function beachState(level) {
  if (!Number.isFinite(level)) throw new TypeError('La altura debe ser un número válido.');
  if (level > 2) return 'No hay playa';
  if (level >= 1.9) return 'Casi no hay playa';
  if (level >= 1.6) return 'Hay poca playa';
  if (level >= 1.2) return 'Hay playa';
  return 'Hay mucha playa';
}
