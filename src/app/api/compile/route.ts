import { NextResponse } from "next/server";
import { promises as fs } from "fs";
import { mkdtemp, rm } from "fs/promises";
import path from "path";
import os from "os";
import { spawn } from "child_process";

export const runtime = "nodejs";

type CompileBody = {
	latex: string;
};

async function runPdflatex(workingDir: string): Promise<void> {
	await new Promise<void>((resolve, reject) => {
		const child = spawn(
			"pdflatex",
			["-interaction=nonstopmode", "-halt-on-error", "main.tex"],
			{
				cwd: workingDir,
			}
		);

		let stderr = "";
		child.stderr.on("data", (d) => {
			stderr += String(d);
		});
		child.on("close", (code) => {
			if (code === 0) resolve();
			else reject(new Error(`pdflatex exited with code ${code}: ${stderr}`));
		});
		child.on("error", (err) => reject(err));
	});
}

export async function POST(req: Request) {
	let tmpDir = "";
	try {
		console.log("[compile] Request received");
		const body = (await req.json()) as Partial<CompileBody>;
		if (!body?.latex) {
			console.warn("[compile] Missing latex in body");
			return NextResponse.json(
				{ error: "Missing 'latex' in request body" },
				{ status: 400 }
			);
		}

		// If a LaTeX microservice is configured, delegate compilation to it.
		const serviceUrl = process.env.LATEX_SERVICE_URL;
		if (serviceUrl) {
			console.log("[compile] Delegating to LaTeX service:", serviceUrl);

			// Debug: Log the JSON being sent
			const jsonPayload = JSON.stringify({ latex: body.latex });
			console.log("[compile] JSON payload length:", jsonPayload.length);
			console.log(
				"[compile] JSON payload preview:",
				jsonPayload.substring(0, 200) + "..."
			);

			const res = await fetch(`${serviceUrl.replace(/\/$/, "")}/compile`, {
				method: "POST",
				headers: { "Content-Type": "application/json" },
				body: jsonPayload,
			});
			if (!res.ok) {
				const text = await res.text();
				console.error(
					"[compile] Service responded with error",
					res.status,
					text
				);
				return NextResponse.json(
					{ error: `LaTeX service error (${res.status}): ${text}` },
					{ status: 502 }
				);
			}
			console.log("[compile] Received PDF from service");
			const arrayBuffer = await res.arrayBuffer();
			return new NextResponse(arrayBuffer as ArrayBuffer, {
				status: 200,
				headers: {
					"Content-Type": "application/pdf",
					"Content-Disposition": "inline; filename=CV.pdf",
					"Cache-Control": "no-store",
				},
			});
		}

		// Fallback: compile locally if service is not configured
		console.log("[compile] Service not configured, compiling locally");
		tmpDir = await mkdtemp(path.join(os.tmpdir(), "latex-"));
		console.log("[compile] Created tmp dir", tmpDir);
		const texPath = path.join(tmpDir, "main.tex");
		await fs.writeFile(texPath, body.latex, "utf8");
		console.log("[compile] Wrote main.tex");

		console.log("[compile] Running pdflatex (1/2)");
		await runPdflatex(tmpDir);
		console.log("[compile] Running pdflatex (2/2)");
		await runPdflatex(tmpDir);

		const pdfPath = path.join(tmpDir, "main.pdf");
		const pdfBuffer = await fs.readFile(pdfPath);
		const arrayBuffer = pdfBuffer.buffer.slice(
			pdfBuffer.byteOffset,
			pdfBuffer.byteOffset + pdfBuffer.byteLength
		);

		console.log("[compile] Local compile complete, returning PDF");
		return new NextResponse(arrayBuffer as ArrayBuffer, {
			status: 200,
			headers: {
				"Content-Type": "application/pdf",
				"Content-Disposition": "inline; filename=CV.pdf",
				"Cache-Control": "no-store",
			},
		});
	} catch (error) {
		const message = error instanceof Error ? error.message : "Unknown error";
		console.error("[compile] Error:", message);
		return NextResponse.json({ error: message }, { status: 500 });
	} finally {
		if (tmpDir) {
			try {
				await rm(tmpDir, { recursive: true, force: true });
				console.log("[compile] Cleaned up tmp dir");
			} catch {
				// ignore cleanup errors
			}
		}
	}
}
