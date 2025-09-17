import { NextResponse } from "next/server";
import OpenAI from "openai";

export const runtime = "nodejs";

type GenerateBody = {
	cv: unknown;
	jd: string;
};

export async function POST(req: Request) {
	try {
		const body = (await req.json()) as Partial<GenerateBody>;

		if (!body || !body.cv || !body.jd) {
			return NextResponse.json(
				{ error: "Missing 'cv' or 'jd' in request body" },
				{ status: 400 }
			);
		}

		const client = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });
		if (!client.apiKey) {
			return NextResponse.json(
				{ error: "OPENAI_API_KEY is not set" },
				{ status: 500 }
			);
		}

		const system = [
			"You are an expert resume writer and LaTeX typesetter.",
			"Goal: Produce a single, valid LaTeX document optimized for ATS.",
			"Constraints:",
			"- Strict keyword alignment to the job description.",
			"- Clear, simple formatting; no images or graphics.",
			"- Use a modern, clean template (e.g., article class with custom sections).",
			"- No placeholders like TODO; fill with best-fit content from CV data.",
			"- Keep to 1-2 pages, concise bullet points, quantified achievements.",
			"Output: Only LaTeX, starting with \\documentclass and ending with \\end{document}.",
		].join("\n");

		const user = [
			"Here is the base CV data in JSON:",
			"```json",
			JSON.stringify(body.cv, null, 2),
			"```",
			"\nHere is the target job description:",
			body.jd,
			"\nGenerate the tailored LaTeX CV as a single compilable document.",
		].join("\n");

		const completion = await client.chat.completions.create({
			model: "gpt-4o-mini",
			temperature: 0.3,
			messages: [
				{ role: "system", content: system },
				{ role: "user", content: user },
			],
		});

		const latex = completion.choices[0]?.message?.content?.trim();
		if (!latex || !latex.includes("\\documentclass")) {
			return NextResponse.json(
				{ error: "Model did not return valid LaTeX." },
				{ status: 502 }
			);
		}

		return NextResponse.json({ latex });
	} catch (error) {
		const message = error instanceof Error ? error.message : "Unknown error";
		return NextResponse.json({ error: message }, { status: 500 });
	}
}
