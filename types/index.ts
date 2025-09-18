export interface Skills {
	Languages: string[];
	Frontend: string[];
	Backend: string[];
	"AI/ML": string[];
	Database: string[];
	"Cloud & DevOps": string[];
	Tools: string[];
}

export interface Achievement {
	title: string;
	description: string;
}

export interface Experience {
	title: string;
	company: string;
	start: string;
	end: string;
	bullets: string[];
}

export interface Education {
	degree: string;
	school: string;
	start: string;
	end: string;
	bullets: string[];
}

export interface Project {
	name: string;
	link?: string;
	bullets: string[];
}

export interface CV {
	name: string;
	email: string;
	phone: string;
	github: string;
	linkedin: string;
	website: string;
	summary: string;
	skills: Skills;
	achievements: Achievement[];
	experience: Experience[];
	education: Education[];
	projects: Project[];
}
