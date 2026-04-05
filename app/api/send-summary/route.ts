import { NextRequest, NextResponse } from "next/server";
import { Resend } from "resend";

interface Message {
  role: "user" | "assistant";
  content: string;
}

function extractName(messages: Message[]): string {
  // Look for the user's first substantive reply — often contains their name
  const userMessages = messages.filter((m) => m.role === "user");
  if (userMessages.length === 0) return "Unknown";

  // The assistant typically asks for name first; user's first reply often is their name
  const firstUserMsg = userMessages[0].content;
  // Simple heuristic: if the first user message is short (under 40 chars), likely a name
  if (firstUserMsg.length < 40 && !firstUserMsg.includes(" is ")) {
    return firstUserMsg.trim();
  }

  // Try to find "my name is X" or "I'm X" patterns
  const namePatterns = [
    /(?:my name is|i'm|i am|call me)\s+([A-Z][a-z]+(?:\s+[A-Z][a-z]+)?)/i,
    /^([A-Z][a-z]+(?:\s+[A-Z][a-z]+)?)[\s,!.]*$/,
  ];
  for (const msg of userMessages) {
    for (const pattern of namePatterns) {
      const match = msg.content.match(pattern);
      if (match) return match[1].trim();
    }
  }

  return "Not captured";
}

function extractBusinessType(messages: Message[]): string {
  const userMessages = messages.filter((m) => m.role === "user");

  const businessPatterns = [
    /(?:i (?:run|own|have|operate)|my business is|we(?:'re| are) a?)\s+(.{5,60}?)(?:\.|,|$)/i,
    /(?:it's|its|a|an)\s+([\w\s]{3,40}(?:business|company|shop|studio|firm|agency|service|store|restaurant|salon|clinic|practice))/i,
  ];

  for (const msg of userMessages) {
    for (const pattern of businessPatterns) {
      const match = msg.content.match(pattern);
      if (match) return match[1].trim();
    }
  }

  // Fall back to second user message if short enough
  if (userMessages.length >= 2 && userMessages[1].content.length < 80) {
    return userMessages[1].content.trim();
  }

  return "Not captured";
}

function extractPainPoints(messages: Message[]): string[] {
  const userMessages = messages.filter((m) => m.role === "user");
  const points: string[] = [];

  const painKeywords =
    /(?:takes? too long|manually|by hand|wish|hate|frustrat|slow|tedious|annoying|problem|issue|challenge|difficult|hard|pain|struggle|mess|chaos|confusing|waste)/i;

  for (const msg of userMessages) {
    if (painKeywords.test(msg.content) && msg.content.length > 20) {
      points.push(msg.content.trim());
    }
  }

  return points.length > 0 ? points : ["See full transcript below."];
}

function formatTranscript(messages: Message[]): string {
  return messages
    .map((m) => {
      const label = m.role === "user" ? "Business Owner" : "Streamline Workshop";
      return `${label}:\n${m.content}`;
    })
    .join("\n\n---\n\n");
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const messages: Message[] = body.messages || [];

    const now = new Date();
    const timestamp = now.toLocaleString("en-US", {
      timeZone: "America/New_York",
      dateStyle: "full",
      timeStyle: "short",
    });

    const name = extractName(messages);
    const businessType = extractBusinessType(messages);
    const painPoints = extractPainPoints(messages);

    const painPointsHtml = painPoints
      .map((p) => `<li style="margin-bottom:8px;">${p}</li>`)
      .join("");

    const transcriptHtml = messages
      .map((m) => {
        const label =
          m.role === "user"
            ? '<strong style="color:#1a1a1a;">Business Owner</strong>'
            : '<strong style="color:#D4A574;">Streamline Workshop</strong>';
        const bg = m.role === "user" ? "#f5f1ed" : "#1a1a1a";
        const color = m.role === "user" ? "#1a1a1a" : "#f0f0f0";
        return `<div style="background:${bg};color:${color};padding:12px 16px;border-radius:4px;margin-bottom:12px;">
  ${label}<br/><span style="white-space:pre-wrap;">${m.content.replace(/</g, "&lt;").replace(/>/g, "&gt;")}</span>
</div>`;
      })
      .join("");

    const htmlBody = `
<!DOCTYPE html>
<html>
<head><meta charset="UTF-8"></head>
<body style="font-family:'DM Sans',Arial,sans-serif;max-width:680px;margin:0 auto;padding:24px;color:#1a1a1a;">
  <div style="border-bottom:3px solid #D4A574;padding-bottom:16px;margin-bottom:24px;">
    <h1 style="font-family:Georgia,serif;color:#1a1a1a;margin:0;">Streamline Workshop</h1>
    <p style="color:#888;margin:4px 0 0;">New Inquiry</p>
  </div>

  <table style="width:100%;border-collapse:collapse;margin-bottom:24px;">
    <tr>
      <td style="padding:8px 0;color:#888;font-size:13px;width:140px;">Date &amp; Time</td>
      <td style="padding:8px 0;font-weight:500;">${timestamp}</td>
    </tr>
    <tr>
      <td style="padding:8px 0;color:#888;font-size:13px;">Name</td>
      <td style="padding:8px 0;font-weight:500;">${name}</td>
    </tr>
    <tr>
      <td style="padding:8px 0;color:#888;font-size:13px;">Business Type</td>
      <td style="padding:8px 0;font-weight:500;">${businessType}</td>
    </tr>
  </table>

  <h2 style="font-family:Georgia,serif;font-size:18px;border-bottom:1px solid #eee;padding-bottom:8px;margin-bottom:16px;">Pain Points</h2>
  <ul style="padding-left:20px;margin:0 0 24px;">${painPointsHtml}</ul>

  <h2 style="font-family:Georgia,serif;font-size:18px;border-bottom:1px solid #eee;padding-bottom:8px;margin-bottom:16px;">Full Conversation</h2>
  ${transcriptHtml}

  <p style="color:#aaa;font-size:12px;margin-top:32px;border-top:1px solid #eee;padding-top:16px;">
    Sent automatically by Streamline Workshop intake bot.
  </p>
</body>
</html>`;

    const textBody = `NEW STREAMLINE WORKSHOP INQUIRY
================================
Date: ${timestamp}
Name: ${name}
Business Type: ${businessType}

PAIN POINTS
-----------
${painPoints.map((p, i) => `${i + 1}. ${p}`).join("\n")}

FULL TRANSCRIPT
---------------
${formatTranscript(messages)}
`;

    const resend = new Resend(process.env.RESEND_API_KEY);
    const { data, error } = await resend.emails.send({
      from: "Streamline Workshop <noreply@tandemleap.com>",
      to: "scott@tandemleap.com",
      subject: `New Streamline Workshop Inquiry — ${timestamp}`,
      html: htmlBody,
      text: textBody,
    });

    if (error) {
      console.error("Resend error:", error);
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    console.log("Email sent:", data?.id);
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Send summary error:", error);
    return NextResponse.json(
      { error: "Failed to send summary" },
      { status: 500 }
    );
  }
}
