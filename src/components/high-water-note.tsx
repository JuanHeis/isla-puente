import { highWaterNotice } from "../lib/high-water";
import { PREFECTURA_URL } from "../lib/river";

export function HighWaterNote({ level, simulated = false }: { level: number | null; simulated?: boolean }) {
  const notice = highWaterNotice(level, simulated);
  return <div className={notice ? "high-water-note" : "sr-only"} role="status" aria-atomic="true">
    {notice && <>
      <p className="high-water-title">{notice.title}</p>
      <p className="high-water-copy">{notice.message}{" "}
        <a href={PREFECTURA_URL} target="_blank" rel="noreferrer">Referencia de Prefectura</a>
      </p>
    </>}
  </div>;
}
