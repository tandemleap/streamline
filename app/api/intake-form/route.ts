import { NextRequest, NextResponse } from "next/server";
import { Resend } from "resend";

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { name, businessType, painPoints, value, contact } = body as {
      name: string;
      businessType: string;
      painPoints: string;
      value: string;
      contact: string;
    };

    const timestamp = new Date().toLocaleString("en-US", {
      timeZone: "America/Chicago",
    });

    const text = `NEW STREAMLINE WORKSHOP INQUIRY (FORM)
======================================
Date: ${timestamp}

Name:          ${name || "Not provided"}
Business Type: ${businessType || "Not provided"}
Contact:       ${contact || "Not provided"}

WHAT'S SLOWING THEM DOWN
-------------------------
${painPoints || "Not provided"}

WHAT SOLVING IT WOULD BE WORTH
--------------------------------
${value || "Not provided"}
`;

    const resend = new Resend(process.env.RESEND_API_KEY);
    const { error } = await resend.emails.send({
      from: "Streamline Workshop <noreply@tandemleap.com>",
      to: "scott@tandemleap.com",
      subject: `New Streamline Workshop Inquiry (Form) — ${timestamp}`,
      text,
    });

    if (error) {
      console.error("Intake form Resend error:", error);
      return NextResponse.json({ error: "Failed to send email" }, { status: 500 });
    }

    return NextResponse.json({ success: true });
  } catch (err) {
    console.error("Intake form error:", err);
    return NextResponse.json({ error: "Failed to process" }, { status: 500 });
  }
}
