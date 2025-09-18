import { NextRequest, NextResponse } from "next/server";
import { getContractsCollection } from "@/lib/mongodb";
import { cookies } from "next/headers";
import { ObjectId } from "mongodb";

export async function POST(req: NextRequest, context: { params: Promise<{ id: string }> }) {
  const cookieStore = await cookies();
  const raw = cookieStore.get("session")?.value;
  if (!raw) return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
  const email = (() => { try { return JSON.parse(raw).email as string; } catch { return null; } })();
  if (!email) return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
  const body = await req.json();
  const { type, data } = body || {};
  if (!type || !data) return NextResponse.json({ message: "Invalid payload" }, { status: 400 });

  const contractsCol = await getContractsCollection();
  const params = await context.params;
  const result = await contractsCol.findOneAndUpdate(
    { _id: new ObjectId(params.id), vendorEmail: email },
    {
      $set: {
        signature: { type, data, signedAt: new Date().toISOString() },
        status: "signed",
        updatedAt: new Date().toISOString(),
      },
    },
    { returnDocument: "after" }
  );
  if (!result || !result.value) return NextResponse.json({ message: "Not found" }, { status: 404 });
  return NextResponse.json({ ...result.value, id: result.value._id });
}


