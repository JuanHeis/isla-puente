import { IslandMap } from "../components/island-map";

export default function Loading() {
  return <main className="isla-app" aria-busy="true">
    <header className="masthead"><span>Isla Puente</span><span className="brand-dot" aria-hidden="true" /></header>
    <h1 className="status" data-initial="C">Consultando el río</h1>
    <p className="current-reading" role="status">Buscamos la última lectura de Prefectura.</p>
    <IslandMap level={null} />
  </main>;
}
