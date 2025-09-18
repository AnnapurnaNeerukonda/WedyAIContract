import { NextRequest, NextResponse } from "next/server";
import { cookies } from "next/headers";
import { getContractsCollection } from "@/lib/mongodb";
import { nanoid } from "nanoid";

async function getUserEmailFromCookie() {
  const cookieStore = await cookies();
  const raw = cookieStore.get("session")?.value;
  if (!raw) return null;
  try {
    const parsed = JSON.parse(raw);
    return parsed.email as string;
  } catch {
    return null;
  }
}

export async function GET() {
  const email = await getUserEmailFromCookie();
  if (!email) return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
  const contractsCol = await getContractsCollection();
  const contracts = await contractsCol.find({ vendorEmail: email }).toArray();
  return NextResponse.json(contracts);
}

export async function POST(req: NextRequest) {
  const email = await getUserEmailFromCookie();
  if (!email) return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
  const body = await req.json();
  const now = new Date().toISOString();
  const record = {
    vendorEmail: email,
    clientName: body.clientName || "",
    eventDate: body.eventDate || now,
    eventVenue: body.eventVenue || "",
    servicePackage: body.servicePackage || "",
    contentHtml: body.contentHtml || "",
    status: "draft",
    createdAt: now,
    updatedAt: now,
  };
  const contractsCol = await getContractsCollection();
  const result = await contractsCol.insertOne(record);
  return NextResponse.json({ ...record, id: result.insertedId }, { status: 201 });
}


