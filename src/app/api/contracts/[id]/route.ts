import { NextRequest, NextResponse } from "next/server";
import { getContractsCollection } from "@/lib/mongodb";
import { cookies } from "next/headers";
import { ObjectId } from "mongodb";

async function getUserEmail() {
  const cookieStore = await cookies();
  const raw = cookieStore.get("session")?.value;
  if (!raw) return null;
  try {
    return (JSON.parse(raw).email as string) || null;
  } catch {
    return null;
  }
}

export async function GET(_: NextRequest, context: { params: Promise<{ id: string }> }) {
  const email = await getUserEmail();
  if (!email) return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
  const params = await context.params;
  const contractsCol = await getContractsCollection();
  let contract;
  // Try to fetch by MongoDB ObjectId, fallback to string id for legacy/seeded contracts
  try {
    contract = await contractsCol.findOne({ _id: new ObjectId(params.id), vendorEmail: email });
  } catch {
    contract = await contractsCol.findOne({ id: params.id, vendorEmail: email });
  }
  if (!contract) return NextResponse.json({ message: "Not found" }, { status: 404 });
  return NextResponse.json({ ...contract, id: contract._id || contract.id });
}

export async function PUT(req: NextRequest, context: { params: Promise<{ id: string }> }) {
  const email = await getUserEmail();
  if (!email) return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
  const params = await context.params;
  const updates = await req.json();
  const contractsCol = await getContractsCollection();
  let result;
  try {
    result = await contractsCol.findOneAndUpdate(
      { _id: new ObjectId(params.id), vendorEmail: email },
      { $set: { ...updates, updatedAt: new Date().toISOString() } },
      { returnDocument: "after" }
    );
  } catch {
    // fallback for legacy string id
    result = await contractsCol.findOneAndUpdate(
      { id: params.id, vendorEmail: email },
      { $set: { ...updates, updatedAt: new Date().toISOString() } },
      { returnDocument: "after" }
    );
  }
  if (!result || !result.value) return NextResponse.json({ message: "Not found" }, { status: 404 });
  return NextResponse.json({ ...result.value, id: result.value._id || result.value.id });
}


