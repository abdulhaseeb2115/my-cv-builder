import { NextResponse } from "next/server";
import OpenAI from "openai";
import Anthropic from "@anthropic-ai/sdk";
import { GoogleGenerativeAI } from "@google/generative-ai";
import { SYSTEM_PROMPT } from "../../../../config";

export const runtime = "nodejs";

type Provider = "openai" | "claude" | "gemini";

type GenerateBody = {
	cv: unknown;
	jd: string;
	provider?: Provider;
};

export async function POST(req: Request) {
	try {
		console.log("[generate] Request received");
		const body = (await req.json()) as Partial<GenerateBody>;

		if (!body || !body.cv || !body.jd) {
			console.warn("[generate] Missing cv or jd in body");
			return NextResponse.json(
				{ error: "Missing 'cv' or 'jd' in request body" },
				{ status: 400 }
			);
		}

		const provider: Provider = (body.provider as Provider) ?? "openai";
		console.log("[generate] Using provider:", provider);

		const system = SYSTEM_PROMPT;
		const user = [
			"Here is the base CV data in JSON:",
			"```json",
			JSON.stringify(body.cv, null, 2),
			"```",
			"\nHere is the target job description:",
			body.jd,
			"\nGenerate the tailored LaTeX CV as a single compilable document.",
		].join("\n");

		let latex: string | undefined;

		if (provider === "openai") {
			console.log("[generate] Calling OpenAI");
			const client = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });
			if (!client.apiKey) {
				console.error("[generate] OPENAI_API_KEY not set");
				return NextResponse.json(
					{ error: "OPENAI_API_KEY is not set" },
					{ status: 500 }
				);
			}
			const completion = await client.chat.completions.create({
				model: "gpt-4o",
				temperature: 0.2,
				messages: [
					{ role: "system", content: system },
					{ role: "user", content: user },
				],
			});
			latex = completion.choices[0]?.message?.content?.trim();
			latex = latex
				?.replace(/^```latex/, "")
				.replace(/^```/, "")
				.replace(/```$/, "")
				.trim();
		} else if (provider === "claude") {
			console.log("[generate] Calling Anthropic Claude");
			const anthropic = new Anthropic({
				apiKey: process.env.ANTHROPIC_API_KEY,
			});
			if (!anthropic.apiKey) {
				console.error("[generate] ANTHROPIC_API_KEY not set");
				return NextResponse.json(
					{ error: "ANTHROPIC_API_KEY is not set" },
					{ status: 500 }
				);
			}
			const msg = await anthropic.messages.create({
				model: "claude-3-7-sonnet-latest",
				max_tokens: 4000,
				system,
				messages: [{ role: "user", content: user }],
			});
			const text =
				msg.content
					?.map((c: any) => (c.type === "text" ? c.text : ""))
					.join("") ?? "";
			latex = text.trim();
		} else if (provider === "gemini") {
			console.log("[generate] Calling Google Gemini");
			const apiKey = process.env.GOOGLE_API_KEY;
			if (!apiKey) {
				console.error("[generate] GOOGLE_API_KEY not set");
				return NextResponse.json(
					{ error: "GOOGLE_API_KEY is not set" },
					{ status: 500 }
				);
			}
			const genAI = new GoogleGenerativeAI(apiKey);
			const model = genAI.getGenerativeModel({ model: "gemini-1.5-pro" });
			const prompt = [system, "\n\n", user].join("");
			const resp = await model.generateContent(prompt);
			const text = resp.response.text();
			latex = text.trim();
		}

		if (!latex || !latex.includes("\\documentclass")) {
			console.warn("[generate] Model did not return valid LaTeX");
			return NextResponse.json(
				{ error: "Model did not return valid LaTeX." },
				{ status: 502 }
			);
		}

		console.log(
			"[generate] Successfully generated LaTeX (length)",
			latex.length
		);
		return NextResponse.json({ latex });
	} catch (error) {
		const message = error instanceof Error ? error.message : "Unknown error";
		console.error("[generate] Error:", message);
		return NextResponse.json({ error: message }, { status: 500 });
	}
}
