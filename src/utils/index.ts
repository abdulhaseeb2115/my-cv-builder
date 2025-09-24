import { DEFAULT_CV } from "../../config";
import {
	type CV,
	type Experience,
	type Project,
	type Education,
} from "../types";

export function generateLatex(optimizedData: Partial<CV>): string {
	// Merge optimized data with original CV data
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
    ignoreheadfoot, % set margins without considering header and footer
    top=2 cm, % seperation between body and page edge from the top
    bottom=2 cm, % seperation between body and page edge from the bottom
    left=2 cm, % seperation between body and page edge from the left
    right=2 cm, % seperation between body and page edge from the right
    footskip=1.0 cm, % seperation between body and footer
    % showframe % for debugging 
]{geometry} % for adjusting page geometry
\\usepackage{titlesec} % for customizing section titles
\\usepackage{tabularx} % for making tables with fixed width columns
\\usepackage{array} % tabularx requires this
\\usepackage[dvipsnames]{xcolor} % for coloring text
\\definecolor{primaryColor}{RGB}{0, 0, 0} % define primary color
\\usepackage{enumitem} % for customizing lists
\\usepackage{fontawesome5} % for using icons
\\usepackage{amsmath} % for math
\\usepackage[
    pdftitle={${escapeLatex(cv.name)}'s CV},
    pdfauthor={${escapeLatex(cv.name)}},
	pdfcreator={${escapeLatex(cv.name)}},
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

% Ensure that generated PDF is machine readable / ATS parsable:
\\ifPDFTeX
    \\input{glyphtounicode}
    \\pdfgentounicode=1
    \\usepackage[T1]{fontenc}
    \\usepackage[utf8]{inputenc}
    \\usepackage{lmodern}
\\fi

\\usepackage{charter}

% Some settings:
\\raggedright
\\AtBeginEnvironment{adjustwidth}{\\partopsep0pt}
\\pagestyle{empty}
\\setcounter{secnumdepth}{0}
\\setlength{\\parindent}{0pt}
\\setlength{\\topskip}{0pt}
\\setlength{\\columnsep}{0.15 cm}
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


\\newenvironment{highlightsforbulletentries}{
    \\begin{itemize}[
        topsep=0.10 cm,
        parsep=0.10 cm,
        partopsep=0pt,
        itemsep=0pt,
        leftmargin=10pt
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
} % new environment for one column entries

\\newenvironment{twocolentry}[2][]{
    \\onecolentry
    \\def\\secondColumn{#2}
    \\setcolumnwidth{\\fill, 4.5 cm}
    \\begin{paracol}{2}
}{
    \\switchcolumn \\raggedleft \\secondColumn
    \\end{paracol}
    \\endonecolentry
} % new environment for two column entries

\\newenvironment{threecolentry}[3][]{
    \\onecolentry
    \\def\\thirdColumn{#3}
    \\setcolumnwidth{, \\fill, 4.5 cm}
    \\begin{paracol}{3}
    {\\raggedright #2} \\switchcolumn
}{
    \\switchcolumn \\raggedleft \\thirdColumn
    \\end{paracol}
    \\endonecolentry
} % new environment for three column entries


\\newenvironment{header}{
    \\setlength{\\topsep}{0pt}\\par\\kern\\topsep\\centering\\linespread{1.5}
}{
    \\par\\kern\\topsep
} % new environment for the header

\\newcommand{\\placelastupdatedtext}{% \\placetextbox{<horizontal pos>}{<vertical pos>}{<stuff>}
  \\AddToShipoutPictureFG*{% Add <stuff> to current page foreground
    \\put(
        \\LenToUnit{\\paperwidth-2 cm-0 cm+0.05cm},
        \\LenToUnit{\\paperheight-1.0 cm}
    ){\\vtop{{\\null}\\makebox[0pt][c]{
        \\small\\color{gray}\\textit{Last updated in September 2024}\\hspace{\\widthof{Last updated in September 2024}}
    }}}%
  }%
}%


% save the original href command in a new command:
\\let\\hrefWithoutArrow\\href

% new command for external links:

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
        \\mbox{\\hrefWithoutArrow{mailto:${escapeLatex(
					cv.email
				)}}{${escapeLatex(cv.email)}}}%
        \\kern 5.0 pt
        \\AND%
        \\kern 5.0 pt
        ${
					cv.website
						? `\\mbox{\\hrefWithoutArrow{${cv.website}}{${escapeLatex(
								cv.website
									.replace("https://www.", "")
									.replace("http://www.", "")
						  )}}} 
                                \\kern 5.0 pt 
                                \\AND
                                \\kern 5.0 pt`
						: ""
				}
        ${
					cv.linkedin
						? `\\mbox{\\hrefWithoutArrow{${cv.linkedin}}{${escapeLatex(
								"linkedin.com/in/" + cv.linkedin.split("/").pop() || ""
						  )}}} 
                                \\kern 5.0 pt
                                \\AND
                                \\kern 5.0 pt`
						: ""
				}
        ${
					cv.github
						? `\\mbox{\\hrefWithoutArrow{${cv.github}}{${escapeLatex(
								"github.com/" + cv.github.split("/").pop() || ""
						  )}}}`
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
			.map((exp: Experience) => {
				const bullets = (exp.bullets || [])
					.map((b) => `\\item ${escapeLatex(b)}`)
					.join("\n            ");
				return `
    \\begin{twocolentry}{
        ${escapeLatex(exp.start)} – ${escapeLatex(exp.end)}
    }
        ${(() => {
					const label = `\\textbf{${escapeLatex(exp.title)}}, ${escapeLatex(
						exp.company
					)}`;
					return exp.website
						? `\\hrefWithoutArrow{${exp.website}}{${label}}`
						: label;
				})()}
    \\end{twocolentry}

    \\vspace{0.10 cm}
    \\begin{onecolentry}
        \\begin{highlights}
            ${bullets}
        \\end{highlights}
    \\end{onecolentry}`;
			})
			.join("\n\n    \\vspace{0.2 cm}\n")}

    ${
			cv.projects && cv.projects.length > 0
				? `
    \\section{Projects}
    ${cv.projects
			.map((project: Project) => {
				const bullets = (project.bullets || [])
					.map((b) => `\\item ${escapeLatex(b)}`)
					.join("\n            ");
				const linkText = project.link
					? `\\href{${project.link}}{${escapeLatex(
							project.link.replace("https://", "").replace("http://", "")
					  )}}`
					: "";
				return `
    \\begin{twocolentry}{
        ${linkText}
    }
        \\textbf{${escapeLatex(project.name)}}
    \\end{twocolentry}

    \\vspace{0.10 cm}
    \\begin{onecolentry}
        \\begin{highlights}
            ${bullets}
        \\end{highlights}
    \\end{onecolentry}`;
			})
			.join("\n\n    \\vspace{0.2 cm}\n")}`
				: ""
		}

    \\section{Education}
    ${cv.education
			.map((edu: Education) => {
				const bullets = (edu.bullets || [])
					.map((b) => `\\item ${escapeLatex(b)}`)
					.join("\n            ");
				return `
    \\begin{twocolentry}{
        ${escapeLatex(edu.start)} – ${escapeLatex(edu.end)}
    }
        \\textbf{${escapeLatex(edu.school)}}, ${escapeLatex(edu.degree)}
    \\end{twocolentry}

    ${
			bullets
				? `\\vspace{0.10 cm}
    \\begin{onecolentry}
        \\begin{highlights}
            ${bullets}
        \\end{highlights}
    \\end{onecolentry}`
				: ""
		}`;
			})
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
	// New categorized format
	const sections: string[] = [];

	const addSection = (label: string, items?: string[]) => {
		if (!items || items.length === 0) return;
		sections.push(`\\begin{onecolentry}
        \\textbf{${escapeLatex(label)}:} ${items
			.map((s) => escapeLatex(s))
			.join(", ")}
    \\end{onecolentry}`);
	};

	addSection("Languages", skills.Languages);
	addSection("Frontend", skills.Frontend);
	addSection("Backend", skills.Backend);
	addSection("AI/ML", skills["AI/ML"]);
	addSection("Databases", skills.Database);
	addSection("Cloud & DevOps", skills["Cloud & DevOps"]); // ensure label uses escaped ampersand
	addSection("Tools", skills.Tools);

	return sections.join("\n\n    \\vspace{0.2 cm}\n\n    ");
}

export function escapeLatex(text: unknown): string {
	if (text === null || text === undefined) return "";
	const s = String(text);
	const x = s
		.replace(/\\/g, "\\textbackslash{}")
		.replace(/&/g, "\\&")
		.replace(/%/g, "\\%")
		.replace(/\$/g, "\\$")
		.replace(/#/g, "\\#")
		.replace(/_/g, "\\_")
		.replace(/{/g, "\\{")
		.replace(/}/g, "\\}")
		.replace(/~/g, "\\textasciitilde{}")
		.replace(/\^/g, "\\textasciicircum{}");

	return x.replace(/\*\*(.+?)\*\*/g, "\\textbf{$1}");
}
