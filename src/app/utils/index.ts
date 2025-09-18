import { DEFAULT_CV } from "../../../config";
import {
	type CV,
	type Experience,
	type Project,
	type Education,
} from "../../../types";

export function generateLatex(optimizedData: Partial<CV>): string {
	// Merge optimized data with original CV data
	// Handle skills format conversion from AI response (lowercase keys) to expected format (capitalized keys)
	let skills = DEFAULT_CV.skills;
	if (optimizedData.skills) {
		const aiSkills = optimizedData.skills as any;
		skills = {
			Languages:
				aiSkills.languages || aiSkills.Languages || DEFAULT_CV.skills.Languages,
			Frontend:
				aiSkills.frontend || aiSkills.Frontend || DEFAULT_CV.skills.Frontend,
			Backend:
				aiSkills.backend || aiSkills.Backend || DEFAULT_CV.skills.Backend,
			"AI/ML":
				aiSkills["ai/ml"] || aiSkills["AI/ML"] || DEFAULT_CV.skills["AI/ML"],
			Database:
				aiSkills.databases || aiSkills.Database || DEFAULT_CV.skills.Database,
			"Cloud & DevOps":
				aiSkills.cloud ||
				aiSkills["Cloud & DevOps"] ||
				DEFAULT_CV.skills["Cloud & DevOps"],
			Tools: aiSkills.tools || aiSkills.Tools || DEFAULT_CV.skills.Tools,
		};
	}

	const cv: CV = {
		...DEFAULT_CV,
		summary: optimizedData.summary || DEFAULT_CV.summary,
		skills: skills,
		experience: optimizedData.experience || DEFAULT_CV.experience,
	};

	// Generate LaTeX document
	return `\\documentclass[10pt, letterpaper]{article}

% Packages:
\\usepackage[
    ignoreheadfoot,
    top=2 cm,
    bottom=2 cm,
    left=2 cm,
    right=2 cm,
    footskip=1.0 cm
]{geometry}
\\usepackage{titlesec}
\\usepackage{tabularx}
\\usepackage{array}
\\usepackage[dvipsnames]{xcolor}
\\definecolor{primaryColor}{RGB}{0, 0, 0}
\\usepackage{enumitem}
\\usepackage{fontawesome5}
\\usepackage{amsmath}
\\usepackage[
    pdftitle={${escapeLatex(cv.name)}'s CV},
    pdfauthor={${escapeLatex(cv.name)}},
    colorlinks=true,
    urlcolor=primaryColor
]{hyperref}
\\usepackage{calc}
\\usepackage{bookmark}
\\usepackage{lastpage}
\\usepackage{changepage}
\\usepackage{paracol}
\\usepackage{ifthen}
\\usepackage{needspace}
\\usepackage{iftex}

% Ensure that generate pdf is machine readable/ATS parsable:
\\ifPDFTeX
    \\usepackage[T1]{fontenc}
    \\usepackage[utf8]{inputenc}
    \\usepackage{lmodern}
    \\pdfgentounicode=1
\\fi

\\usepackage{charter}

% Some settings:
\\raggedright
\\AtBeginEnvironment{adjustwidth}{\\partopsep0pt}
\\pagestyle{empty}
\\setcounter{secnumdepth}{0}
\\setlength{\\parindent}{0pt}
\\setlength{\\topskip}{0pt}
\\setlength{\\columnsep}{0.15cm}
\\pagenumbering{gobble}

\\titleformat{\\section}{\\needspace{4\\baselineskip}\\bfseries\\large}{}{0pt}{}[\\vspace{1pt}\\titlerule]

\\titlespacing{\\section}{
    -1pt
}{
    0.3 cm
}{
    0.2 cm
}

\\renewcommand\\labelitemi{$\\vcenter{\\hbox{\\small$\\bullet$}}$}
\\newenvironment{highlights}{
    \\begin{itemize}[
        topsep=0.10 cm,
        parsep=0.10 cm,
        partopsep=0pt,
        itemsep=0pt,
        leftmargin=0 cm + 10pt
    ]
}{
    \\end{itemize}
}

\\newenvironment{onecolentry}{
    \\begin{adjustwidth}{
        0 cm + 0.00001 cm
    }{
        0 cm + 0.00001 cm
    }
}{
    \\end{adjustwidth}
}

\\newenvironment{twocolentry}[2][]{
    \\onecolentry
    \\def\\secondColumn{#2}
    \\setcolumnwidth{\\fill, 4.5 cm}
    \\begin{paracol}{2}
}{
    \\switchcolumn \\raggedleft \\secondColumn
    \\end{paracol}
    \\end{onecolentry}
}

\\newenvironment{header}{
    \\setlength{\\topsep}{0pt}\\par\\kern\\topsep\\centering\\linespread{1.5}
}{
    \\par\\kern\\topsep
}

% save the original href command in a new command:
\\let\\hrefWithoutArrow\\href

\\begin{document}
    \\newcommand{\\AND}{\\unskip
        \\cleaders\\copy\\ANDbox\\hskip\\wd\\ANDbox
        \\ignorespaces
    }
    \\newsavebox\\ANDbox
    \\sbox\\ANDbox{$|$}

    \\begin{header}
        \\fontsize{25 pt}{25 pt}\\selectfont ${escapeLatex(cv.name)}

        \\vspace{5 pt}

        \\normalsize
        \\mbox{\\hrefWithoutArrow{mailto:${cv.email}}{${escapeLatex(
		cv.email
	)}}}%
        \\kern 5.0 pt%
        \\AND%
        \\kern 5.0 pt%
        ${
					cv.website
						? `\\kern 5.0 pt%
        \\AND%
        \\kern 5.0 pt%
        \\mbox{\\hrefWithoutArrow{${cv.website}}{${escapeLatex(
								cv.website.replace("https://", "").replace("http://", "")
						  )}}}%`
						: ""
				}
        ${
					cv.linkedin
						? `\\kern 5.0 pt%
        \\AND%
        \\kern 5.0 pt%
        \\mbox{\\hrefWithoutArrow{${cv.linkedin}}{${escapeLatex(
								cv.linkedin.split("/").pop() || ""
						  )}}}%`
						: ""
				}
        ${
					cv.github
						? `\\kern 5.0 pt%
        \\AND%
        \\kern 5.0 pt%
        \\mbox{\\hrefWithoutArrow{${cv.github}}{${escapeLatex(
								cv.github.split("/").pop() || ""
						  )}}}%`
						: ""
				}
    \\end{header}

    \\vspace{5 pt - 0.3 cm}

    \\section{Summary}

    \\begin{onecolentry}
        ${escapeLatex(cv.summary)}
    \\end{onecolentry}
    
    \\section{Skills}

    ${generateSkillsSection(cv.skills)}

    \\section{Experience}

    ${cv.experience
			.map(
				(exp: Experience) => `
    \\begin{twocolentry}{
        ${escapeLatex(exp.start)} – ${escapeLatex(exp.end)}
    }
        \\textbf{${escapeLatex(exp.title)}}, ${escapeLatex(exp.company)}
    \\end{twocolentry}

    \\vspace{0.10 cm}
    \\begin{onecolentry}
        \\begin{highlights}
            ${exp.bullets
							.map((bullet: string) => `\\item ${escapeLatex(bullet)}`)
							.join("\n            ")}
        \\end{highlights}
    \\end{onecolentry}`
			)
			.join("\n\n    \\vspace{0.2 cm}\n")}

    ${
			cv.projects && cv.projects.length > 0
				? `
    \\section{Projects}

    ${cv.projects
			.map(
				(project: Project) => `
    \\begin{twocolentry}{
        ${
					project.link
						? `\\href{${project.link}}{${escapeLatex(
								project.link.replace("https://", "").replace("http://", "")
						  )}}`
						: ""
				}
    }
        \\textbf{${escapeLatex(project.name)}}
    \\end{twocolentry}

    \\vspace{0.10 cm}
    \\begin{onecolentry}
        \\begin{highlights}
            ${project.bullets
							.map((bullet: string) => `\\item ${escapeLatex(bullet)}`)
							.join("\n            ")}
        \\end{highlights}
    \\end{onecolentry}`
			)
			.join("\n\n    \\vspace{0.2 cm}\n")}`
				: ""
		}
    
    \\section{Education}

    ${cv.education
			.map(
				(edu: Education) => `
    \\begin{twocolentry}{
        ${escapeLatex(edu.start)} – ${escapeLatex(edu.end)}
    }
        \\textbf{${escapeLatex(edu.school)}}, ${escapeLatex(edu.degree)}
    \\end{twocolentry}${
			edu.bullets && edu.bullets.length > 0
				? `

    \\vspace{0.10 cm}
    \\begin{onecolentry}
        \\begin{highlights}
            ${edu.bullets
							.map((bullet: string) => `\\item ${escapeLatex(bullet)}`)
							.join("\n            ")}
        \\end{highlights}
    \\end{onecolentry}`
				: ""
		}`
			)
			.join("\n\n    \\vspace{0.2 cm}\n")}

    ${
			cv.achievements && cv.achievements.length > 0
				? `
    \\section{Achievements}

    ${cv.achievements
			.map(
				(achievement: any) => `
    \\begin{onecolentry}
        \\textbf{${escapeLatex(achievement.title)}:} ${escapeLatex(
					achievement.description
				)}
    \\end{onecolentry}`
			)
			.join("\n\n    \\vspace{0.2 cm}\n")}`
				: ""
		}

\\end{document}`;
}

export function generateSkillsSection(skills: CV["skills"]): string {
	if (Array.isArray(skills)) {
		// Old format - backward compatibility
		return `\\begin{onecolentry}
        ${skills.map((s) => escapeLatex(s)).join(", ")}
    \\end{onecolentry}`;
	}

	// New categorized format
	const sections = [];

	if (skills.Languages && skills.Languages.length > 0) {
		sections.push(`\\begin{onecolentry}
        \\textbf{Languages:} ${skills.Languages.map((s) => escapeLatex(s)).join(
					", "
				)}
    \\end{onecolentry}`);
	}

	if (skills.Frontend && skills.Frontend.length > 0) {
		sections.push(`\\begin{onecolentry}
        \\textbf{Frontend:} ${skills.Frontend.map((s) => escapeLatex(s)).join(
					", "
				)}
    \\end{onecolentry}`);
	}

	if (skills.Backend && skills.Backend.length > 0) {
		sections.push(`\\begin{onecolentry}
        \\textbf{Backend:} ${skills.Backend.map((s) => escapeLatex(s)).join(
					", "
				)}
    \\end{onecolentry}`);
	}

	if (skills["AI/ML"] && skills["AI/ML"].length > 0) {
		sections.push(`\\begin{onecolentry}
        \\textbf{AI/ML:} ${skills["AI/ML"]
					.map((s) => escapeLatex(s))
					.join(", ")}
    \\end{onecolentry}`);
	}

	if (skills.Database && skills.Database.length > 0) {
		sections.push(`\\begin{onecolentry}
        \\textbf{Databases:} ${skills.Database.map((s) => escapeLatex(s)).join(
					", "
				)}
    \\end{onecolentry}`);
	}

	if (skills["Cloud & DevOps"] && skills["Cloud & DevOps"].length > 0) {
		sections.push(`\\begin{onecolentry}
        \\textbf{Cloud & DevOps:} ${skills["Cloud & DevOps"]
					.map((s) => escapeLatex(s))
					.join(", ")}
    \\end{onecolentry}`);
	}

	if (skills.Tools && skills.Tools.length > 0) {
		sections.push(`\\begin{onecolentry}
        \\textbf{Tools:} ${skills.Tools.map((s) => escapeLatex(s)).join(", ")}
    \\end{onecolentry}`);
	}

	return sections.join("\n\n    \\vspace{0.2 cm}\n\n    ");
}

export function escapeLatex(text: string): string {
	return text
		.replace(/\\/g, "\\textbackslash{}")
		.replace(/[&%$#_{}]/g, "\\$&")
		.replace(/~/g, "\\textasciitilde{}")
		.replace(/\^/g, "\\textasciicircum{}");
}
