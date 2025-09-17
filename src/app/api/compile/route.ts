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
		const body = (await req.json()) as Partial<CompileBody>;
		if (!body?.latex) {
			return NextResponse.json(
				{ error: "Missing 'latex' in request body" },
				{ status: 400 }
			);
		}

		tmpDir = await mkdtemp(path.join(os.tmpdir(), "latex-"));
		const texPath = path.join(tmpDir, "main.tex");
		await fs.writeFile(texPath, body.latex, "utf8");

		// Run twice to resolve references if any
		await runPdflatex(tmpDir);
		await runPdflatex(tmpDir);

		const pdfPath = path.join(tmpDir, "main.pdf");
		const pdfBuffer = await fs.readFile(pdfPath);
		const arrayBuffer = pdfBuffer.buffer.slice(
			pdfBuffer.byteOffset,
			pdfBuffer.byteOffset + pdfBuffer.byteLength
		);

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
		return NextResponse.json({ error: message }, { status: 500 });
	} finally {
		if (tmpDir) {
			try {
				await rm(tmpDir, { recursive: true, force: true });
			} catch {
				// ignore cleanup errors
			}
		}
	}
}
