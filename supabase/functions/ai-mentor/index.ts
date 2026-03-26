import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers":
    "authorization, x-client-info, apikey, content-type, x-supabase-client-platform, x-supabase-client-platform-version, x-supabase-client-runtime, x-supabase-client-runtime-version",
};

const SYSTEM_PROMPT = `You are DeepProfile AI Mentor — an expert career intelligence assistant. Your role is to provide personalized, actionable career guidance.

CAPABILITIES:
1. **Real-time Learning Recommendations**: Suggest specific, currently available courses, tutorials, bootcamps, and certifications from platforms like Coursera, Udemy, edX, YouTube, freeCodeCamp, Codecademy, LinkedIn Learning, Pluralsight, Khan Academy, MIT OpenCourseWare, etc.
2. **Career Path Guidance**: Analyze skills, goals, and gaps to recommend realistic career paths.
3. **Skill Gap Analysis**: Identify missing skills for target roles and suggest how to fill them.
4. **Industry Insights**: Share current trends, in-demand skills, salary ranges, and job market data.
5. **Personalized Roadmaps**: Create step-by-step learning plans with timelines.

RESPONSE GUIDELINES:
- Always recommend SPECIFIC, REAL resources (course names, URLs when possible, platform names).
- Include a mix of free and paid options.
- Format recommendations clearly with emojis and markdown.
- Consider the user's current skill level when recommending resources.
- Provide difficulty estimates and time commitments for suggested resources.
- Be encouraging but realistic about career transitions.
- When recommending classes/tutorials, include: title, platform, difficulty, estimated duration, and why it's relevant.

USER CONTEXT (if provided):
- Use their skills, goals, strengths, and weaknesses to personalize recommendations.
- Reference their specific dream goals when suggesting resources.`;

serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { messages, userContext } = await req.json();
    const LOVABLE_API_KEY = Deno.env.get("LOVABLE_API_KEY");
    if (!LOVABLE_API_KEY) throw new Error("LOVABLE_API_KEY is not configured");

    let systemContent = SYSTEM_PROMPT;
    if (userContext) {
      systemContent += `\n\nCURRENT USER PROFILE:\n- Skills: ${userContext.skills || "Not provided"}\n- Dream Goals: ${userContext.goals || "Not provided"}\n- Strengths: ${userContext.strengths || "Not provided"}\n- Weaknesses: ${userContext.weaknesses || "Not provided"}`;
    }

    const response = await fetch("https://ai.gateway.lovable.dev/v1/chat/completions", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${LOVABLE_API_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model: "google/gemini-3-flash-preview",
        messages: [
          { role: "system", content: systemContent },
          ...messages,
        ],
        stream: true,
      }),
    });

    if (!response.ok) {
      if (response.status === 429) {
        return new Response(JSON.stringify({ error: "Rate limited. Please try again in a moment." }), {
          status: 429,
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        });
      }
      if (response.status === 402) {
        return new Response(JSON.stringify({ error: "AI credits exhausted. Please add funds." }), {
          status: 402,
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        });
      }
      const t = await response.text();
      console.error("AI gateway error:", response.status, t);
      return new Response(JSON.stringify({ error: "AI service unavailable" }), {
        status: 500,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    return new Response(response.body, {
      headers: { ...corsHeaders, "Content-Type": "text/event-stream" },
    });
  } catch (e) {
    console.error("ai-mentor error:", e);
    return new Response(JSON.stringify({ error: e instanceof Error ? e.message : "Unknown error" }), {
      status: 500,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }
});
