import { getRiver } from "../../../lib/river.server";

export const dynamic = "force-dynamic";

export async function GET() {
  const report = await getRiver();
  return Response.json(report, {
    status: report.current ? 200 : 503,
    headers: { "Cache-Control": "no-store" },
  });
}
