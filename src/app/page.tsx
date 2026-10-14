import { RiverApp } from "../components/river-app";
import { getRiver } from "../lib/river.server";

export const dynamic = "force-dynamic";

export default async function Home() {
  return <RiverApp initialReport={await getRiver()} />;
}
