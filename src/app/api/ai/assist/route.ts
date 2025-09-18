import { NextRequest, NextResponse } from "next/server";
import { cookies } from "next/headers";

const vendorPrompts: Record<string, string> = {
  photographer:
    "This contract covers photography services, including coverage hours, editing delivery timelines, usage rights, cancellations, rescheduling, and liability limits.",
  caterer:
    "This contract covers catering services, including menu details, guest count, dietary restrictions, setup/cleanup, rentals, payment schedule, cancellations, and liability limits.",
  florist:
    "This contract covers floral services, including proposal scope, substitutions, delivery/setup/strike, rentals, payment schedule, cancellations, and liability limits.",
};

const vendorDisplayNames: Record<string, string> = {
  photographer: "Photographer",
  caterer: "Caterer",
  florist: "Florist",
};

export async function POST(req: NextRequest) {
  const cookieStore = await cookies();
  const raw = cookieStore.get("session")?.value;
  if (!raw) return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
  const email = (() => { try { return JSON.parse(raw).email as string; } catch { return null; } })();
  if (!email) return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
  const { vendorType, clientName, eventDate, eventVenue, servicePackage } = await req
    .json()
    .catch(() => ({}));

  const inferredVendorType = email.split("@")[0];
  const key = (vendorType || inferredVendorType || "photographer").toLowerCase();
  const base = vendorPrompts[key] || vendorPrompts.photographer;
  const vendorName = vendorDisplayNames[key] || "Vendor";

  const text = `Contract between ${vendorName} and ${clientName || "Client"} for services on ${
    eventDate || "[Event Date]"
  } at ${eventVenue || "[Venue]"}. ${base}\n\nPayment: ${
    servicePackage || "[Package/Amount]"
  }. A non-refundable retainer of 25% is due upon signing; remaining balance due 7 days before the event.\n\nCancellation: Client may cancel in writing; fees may apply depending on notice.\n\nForce Majeure: Neither party shall be liable for events beyond reasonable control.\n\nLiability: Limited to refund of fees paid.\n\nAcceptance: By signing below, ${vendorName} and Client agree to the above terms.`;

  return NextResponse.json({ text });
}


