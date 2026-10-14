// Referencias verificadas en la estación 230 de Prefectura el 13/10/2026.
// Alcanzar una altura de referencia no acredita una alerta u orden emitida.
export const HIGH_WATER_REFERENCES = { alert: 4.7, evacuation: 5 } as const;

export type HighWaterNotice = {
  severity: "alert" | "evacuation";
  threshold: number;
  title: string;
  message: string;
};

export function highWaterNotice(level: number | null, simulated = false): HighWaterNotice | null {
  if (level === null || !Number.isFinite(level) || level < HIGH_WATER_REFERENCES.alert) return null;
  const evacuation = level >= HIGH_WATER_REFERENCES.evacuation;
  const threshold = evacuation ? HIGH_WATER_REFERENCES.evacuation : HIGH_WATER_REFERENCES.alert;
  const reference = evacuation ? "evacuación de Paraná (5,00 m)" : "alerta de Paraná (4,70 m)";
  return {
    severity: evacuation ? "evacuation" : "alert",
    threshold,
    title: simulated ? "Simulación con río alto." : evacuation ? "El río está muy alto." : "La isla puede esperar.",
    message: simulated
      ? `Esta altura simulada alcanza la referencia de ${reference}.`
      : `La lectura alcanza la referencia de ${reference}. ${evacuation
        ? "Seguí los avisos y las indicaciones locales."
        : "Consultá los avisos locales antes de acercarte a la costa."}`,
  };
}
