"use client";

import dynamic from "next/dynamic";
import { CV } from "../../types";
import { DEFAULT_CV } from "../../config";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";

const MonacoEditor = dynamic(() => import("@monaco-editor/react"), {
	ssr: false,
});

export default function Home() {
	const [cvJson, setCvJson] = useState<string>(
		JSON.stringify(DEFAULT_CV, null, 2)
	);
	const [jd, setJd] = useState<string>("");
	const [provider, setProvider] = useState<"openai" | "claude" | "gemini">(
		"claude" // Default to Claude for best results
	);
	const [latex, setLatex] = useState<string>(
		"% Click 'Generate ATS-Optimized CV' to create your tailored resume\n% The system will:\n% 1. Analyze your CV and the job description\n% 2. Optimize content with relevant keywords\n% 3. Generate a professional LaTeX document\n% 4. Compile it to PDF automatically\n"
	);
	const [pdfUrl, setPdfUrl] = useState<string>("");
	const [loading, setLoading] = useState<boolean>(false);
	const [compiling, setCompiling] = useState<boolean>(false);
	const [error, setError] = useState<string>("");
	const compileTimer = useRef<number | null>(null);

	const safeParse = useCallback((text: string): CV | null => {
		try {
			return JSON.parse(text) as CV;
		} catch {
			return null;
		}
	}, []);

	const generate = useCallback(async () => {
		console.log("[ui] Generate clicked");

		if (!jd.trim()) {
			setError("Please enter a job description");
			return;
		}

		setLoading(true);
		setError("");

		try {
			const cv = safeParse(cvJson);
			if (!cv) {
				console.warn("[ui] CV JSON invalid");
				throw new Error("CV JSON is invalid. Please check the format.");
			}

			const res = await fetch("/api/generate", {
				method: "POST",
				headers: { "Content-Type": "application/json" },
				body: JSON.stringify({ jd, provider }),
			});

			const data = await res.json();

			if (!res.ok) {
				console.error("[ui] Generate failed", data);
				throw new Error(data?.error || "Failed to generate optimized CV");
			}

			setLatex(String(data.latex));
			if (data.optimizedData) {
				console.log("Optimized Data:", data.optimizedData);
			}
			console.log("[ui] LaTeX set (length)", String(data.latex).length);
		} catch (e: unknown) {
			setError(e instanceof Error ? e.message : "Unknown error");
		} finally {
			setLoading(false);
		}
	}, [cvJson, jd, provider, safeParse]);

	const compile = useCallback(async (source: string) => {
		// Don't compile if it's just the placeholder text
		if (source.includes("Click 'Generate ATS-Optimized CV'")) {
			return;
		}

		console.log("[ui] Compile triggered (debounced)", source.length);
		setCompiling(true);
		setError("");

		try {
			const res = await fetch("/api/compile", {
				method: "POST",
				headers: { "Content-Type": "application/json" },
				body: JSON.stringify({ latex: source }),
			});

			if (!res.ok) {
				const data = await res.json().catch(() => ({}));
				console.error("[ui] Compile failed", data);
				throw new Error(data?.error || "Failed to compile LaTeX");
			}

			const blob = await res.blob();
			const url = URL.createObjectURL(blob);
			setPdfUrl((prev) => {
				if (prev) URL.revokeObjectURL(prev);
				return url;
			});
			console.log("[ui] PDF URL set");
		} catch (e: unknown) {
			setError(e instanceof Error ? e.message : "Unknown error");
		} finally {
			setCompiling(false);
		}
	}, []);

	const debouncedCompile = useMemo(() => {
		return (source: string) => {
			if (compileTimer.current) window.clearTimeout(compileTimer.current);
			compileTimer.current = window.setTimeout(() => compile(source), 800);
		};
	}, [compile]);

	useEffect(() => {
		console.log("[ui] Effect: compile on latex change");
		if (latex && !latex.includes("Click 'Generate ATS-Optimized CV'")) {
			debouncedCompile(latex);
		}
		return () => {
			if (compileTimer.current) window.clearTimeout(compileTimer.current);
		};
	}, [latex, debouncedCompile]);

	useEffect(() => {
		return () => {
			if (pdfUrl) URL.revokeObjectURL(pdfUrl);
		};
	}, []);

	const downloadPdf = useCallback(async () => {
		if (!pdfUrl) return;
		const a = document.createElement("a");
		a.href = pdfUrl;
		a.download = "CV_ATS_Optimized.pdf";
		a.click();
		console.log("[ui] Download clicked");
	}, [pdfUrl]);

	return (
		<div className="min-h-screen grid grid-cols-1 lg:grid-cols-4 gap-4 p-4 sm:p-6 text-gray-800">
			<section className="flex flex-col gap-3 border rounded-md p-3 bg-white">
				<h2 className="font-semibold">Data Input</h2>
				<label className="text-sm font-medium">CV JSON</label>
				<textarea
					className="border rounded p-2 font-mono text-sm h-48"
					spellCheck={false}
					value={cvJson}
					onChange={(e) => setCvJson(e.target.value)}
				/>

				<label className="text-sm font-medium">Job Description</label>
				<textarea
					className="border rounded p-2 text-sm h-48"
					value={jd}
					onChange={(e) => setJd(e.target.value)}
				/>

				<div className="flex items-center gap-4 py-1">
					<span className="text-sm font-medium">Provider:</span>
					<label className="text-sm flex items-center gap-1">
						<input
							type="radio"
							name="provider"
							value="openai"
							checked={provider === "openai"}
							onChange={() => setProvider("openai")}
						/>
						OpenAI
					</label>
					<label className="text-sm flex items-center gap-1">
						<input
							type="radio"
							name="provider"
							value="claude"
							checked={provider === "claude"}
							onChange={() => setProvider("claude")}
						/>
						Claude
					</label>
					<label className="text-sm flex items-center gap-1">
						<input
							type="radio"
							name="provider"
							value="gemini"
							checked={provider === "gemini"}
							onChange={() => setProvider("gemini")}
						/>
						Gemini
					</label>
				</div>

				<div className="flex gap-2">
					<button
						className="px-3 py-2 rounded bg-black text-white text-sm disabled:opacity-60 hover:scale-[98%]"
						onClick={generate}
						disabled={loading}
					>
						{loading ? "Generating..." : "Generate CV"}
					</button>
				</div>
				{error && <p className="text-red-600 text-sm">Error: {error}</p>}
			</section>

			<section className="flex flex-col border rounded-md overflow-hidden bg-white">
				<div className="flex items-center justify-between p-2 border-b">
					<h2 className="font-semibold">LaTeX Editor</h2>
					<div className="text-xs text-gray-500">
						{compiling ? "Compiling..." : ""}
					</div>
				</div>
				<div className="flex-1 min-h-[400px]">
					<MonacoEditor
						height="100%"
						defaultLanguage="latex"
						theme="vs-light"
						value={latex}
						onChange={(v) => setLatex(v ?? "")}
						options={{
							fontSize: 11,
							minimap: { enabled: false },
							wordWrap: "on",
							scrollBeyondLastLine: false,
							automaticLayout: true,
						}}
						onMount={(editor, monaco) => {
							const langs = (monaco.languages as any).getLanguages?.() ?? [];
							if (!langs.some((l: any) => l.id === "latex")) {
								monaco.languages.register({ id: "latex" });
							}
							(monaco.languages as any).setMonarchTokensProvider("latex", {
								tokenizer: {
									root: [
										[/\\\\[a-zA-Z@]+\*?/, "keyword"],
										[/%.*/, "comment"],
										[/\{[^}]*\}/, "string"],
									],
								},
							});
						}}
					/>
				</div>
			</section>

			<section className="flex flex-col border rounded-md overflow-hidden bg-white col-span-2">
				<div className="flex items-center justify-between p-2 border-b">
					<h2 className="font-semibold">Preview</h2>
					<div className="flex items-center gap-2">
						<button
							className="px-3 py-1 rounded border text-sm"
							onClick={() => compile(latex)}
						>
							Recompile
						</button>
						<button
							className="px-3 py-1 rounded bg-black text-white text-sm disabled:opacity-60"
							onClick={downloadPdf}
							disabled={!pdfUrl}
						>
							Download PDF
						</button>
					</div>
				</div>
				<div className="flex-1 min-h-[400px] bg-gray-50">
					{pdfUrl ? (
						<iframe
							title="PDF Preview"
							src={pdfUrl}
							className="w-full h-full"
						/>
					) : (
						<div className="p-4 text-sm text-gray-600">
							PDF will appear here after compile.
						</div>
					)}
				</div>
			</section>
		</div>
	);
}
