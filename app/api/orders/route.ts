import { NextRequest, NextResponse } from "next/server";
import { createSupabaseServer } from "@/lib/supabase/server";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json().catch(() => null);
    if (!body) return NextResponse.json({ error: "Invalid JSON" }, { status: 400 });

    const { listingId, phone, message, specs } = body as {
      listingId?: string;
      phone?: string;
      message?: string;
      specs?: any;
    };

    if (!listingId || !phone || !message) {
      return NextResponse.json({ error: "listingId, phone and message are required" }, { status: 400 });
    }

    const supabase = await createSupabaseServer();

    const { error } = await supabase
      .from("orders")
      .insert({
        listing_id: listingId,
        phone,
        message,
        specs,
      });

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    return NextResponse.json({ status: "ok" }, { status: 200 });
  } catch (err: any) {
    return NextResponse.json({ error: err?.message || "Unknown error" }, { status: 500 });
  }
}
