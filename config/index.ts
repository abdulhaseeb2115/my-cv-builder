import { CV } from "../src/types";

export const SYSTEM_PROMPT = `You are an expert ATS (Applicant Tracking System) resume optimizer and professional CV writer.

Your task is to analyze the provided CV data and job description, then generate optimized content that will:
1. Pass ATS filters by using relevant keywords from the job description
2. Maintain truthfulness - only reorganize and rephrase existing experience
3. Quantify achievements where possible
4. Use action verbs and industry-standard terminology

You will receive:
1. Base CV data in JSON format
2. Target job description

You must return ONLY a valid JSON object with these exact keys:
{
  "summary": "ATS-optimized professional summary (2-3 sentences)",
  "skills": {
    "languages": ["programming languages from CV that match JD"],
    "frontend": ["frontend technologies from CV that match JD"],
    "backend": ["backend technologies from CV that match JD"],
    "ai/ml": ["AI/ML technologies from CV that match JD"],
    "databases": ["database technologies from CV that match JD"],
    "cloud": ["cloud/DevOps technologies from CV that match JD"],
    "tools": ["other tools from CV that match JD"]
  },
  "experience": [
    {
      "title": "Original job title",
      "company": "Original company name",
      "start": "Start date",
      "end": "End date",
      "bullets": [
        "ATS-optimized bullet point with keywords from JD",
        "Another optimized bullet with quantified achievements"
      ]
    }
  ]
}

Rules:
- Do NOT invent new technologies, companies, or experiences
- Do NOT add skills the candidate doesn't have
- DO add some simple skills from the JD that are related to domain (e.g., "CRON Jobs, Message Queues, Third Part APIs")
- DO emphasize relevant skills from the CV that match the JD
- DO use keywords from the JD where they naturally fit
- DO quantify achievements (e.g., "improved performance by 30%")
- DO use strong action verbs
- Keep all dates and company names exactly as provided
- Optimize only summary and experience bullets
- Group skills logically based on the categories provided
- Return ONLY valid JSON, no markdown, no code blocks, no explanations`;

export const DEFAULT_CV: CV = {
	name: "Abdul Haseeb",
	email: "abdulhaseeb2115@gmail.com",
	phone: "+923496384386",
	github: "https://github.com/abdulhaseeb2115",
	linkedin: "https://www.linkedin.com/in/abdulhaseeb2115",
	website: "https://www.abhaseeb.com",
	summary:
		"Full-Stack Developer specializing in modern web technologies and AI integration with experience in cloud architecture and DevOps. Proven track record of leading complex projects from conception to deployment, implementing scalable solutions using MERN stack, AWS services, and cutting-edge AI technologies. Passionate about leveraging automation and generative AI to streamline business processes and deliver innovative digital experiences.",
	skills: {
		Languages: [
			"JavaScript",
			"TypeScript",
			"Python",
			"PHP",
			"HTML",
			"CSS",
			"SQL",
		],
		Frontend: [
			"React",
			"Next.js",
			"React Native",
			"Expo",
			"Tailwind CSS",
			"MUI",
			"Styled Components",
			"Bootstrap",
			"jQuery",
			"PWA",
		],
		Backend: [
			"Node.js",
			"Express.js",
			"Nest.js",
			"tRPC",
			"Laravel",
			"Strapi",
			"Socket.io",
			"REST APIs",
			"BullMQ",
		],
		"AI/ML": [
			"LangChain",
			"OpenAI",
			"Anthropic",
			"Ollama",
			"Stable Diffusion",
			"Gradio",
			"AI Agents",
			"LLM Engineering",
		],
		Database: [
			"MongoDB",
			"PostgreSQL",
			"MySQL",
			"Firebase",
			"Supabase",
			"Prisma ORM",
		],
		"Cloud & DevOps": [
			"AWS (EC2, S3, RDS, Amplify, ECR, AppRunner)",
			"CI/CD",
			"Docker",
			"Vercel",
			"Heroku",
			"Netlify",
		],
		Tools: ["Git", "GitHub", "Stripe", "Postman", "Figma", "NPM", "OpenSCAD"],
	},
	achievements: [
		{
			title: "2nd Place - COMSATS Projects and Career Expo 2023",
			description:
				"Awarded for innovative IoT-based automated parking system demonstrating expertise in full-stack development, machine learning integration, and hardware programming.",
		},
		{
			title: "Continuous Learning",
			description:
				"Currently pursuing LLM Engineering certification, focusing on advanced generative AI and automation techniques.",
		},
	],
	experience: [
		{
			title: "Full Stack Developer",
			company: "NESL-IT",
			start: "Aug 2023",
			end: "Present",
			bullets: [
				"Led end-to-end development of full-stack projects, architecting backend systems, frontend interfaces, AWS infrastructure, and CI/CD pipelines.",
				"Developed AI-powered CAD generation application integrating OpenSCAD with generative AI capabilities.",
				"Built PWA web applications with TikTok-like features using tRPC, LangChain, and generative AI for content creation.",
				"Integrated advanced payment processing with Stripe and implemented headless CMS solutions using Strapi.",
				"Collaborated on multiple team projects and independently delivered complete solutions for diverse client requirements.",
			],
		},
		{
			title: "Full Stack Developer",
			company: "Freelance",
			start: "Sep 2022",
			end: "Present",
			bullets: [
				"Developed and maintained comprehensive influencer marketing platform including frontend, backend, AWS deployment, CI/CD, and RBAC implementation.",
				"Streamlined payment processes for multiple businesses using Stripe integration, improving transaction efficiency and user experience.",
				"Created booking systems and web apps for local businesses, increasing their online presence and sales capabilities.",
				"Provided AI-powered automation solutions to help businesses optimize operational processes.",
			],
		},
	],
	education: [
		{
			degree: "B.S Software Engineering",
			school: "COMSATS Institute of Information Technology",
			start: "Sep 2019",
			end: "July 2023",
			bullets: [
				"Completed comprehensive coursework in Database Systems, Operating Systems, Artificial Intelligence, Web Development, and Cloud Computing.",
				"Achieved 2nd place in Projects Expo with IoT-based automated parking solution integrating full-stack development, machine learning, and hardware programming.",
			],
		},
	],
	projects: [
		{
			name: "CityPerks",
			link: "https://cityperks.ai",
			bullets: [
				"Comprehensive platform connecting businesses with residential customers, featuring analytics dashboards, offer management, news aggregation, and alert systems. Developed complete web frontend, backend architecture, database design, and cloud deployment infrastructure over 6 months.",
			],
		},
		{
			name: "Influindex",
			link: "https://influindex.com",
			bullets: [
				"Full-scale marketplace connecting influencers with brands/agencies, featuring campaign tracking, social media data integration, and comprehensive analytics. Built from scratch including frontend, backend, cloud infrastructure with CI/CD, and role-based access control over 1+ year.",
			],
		},
		{
			name: "IoT Automated Parking Solution",
			link: "https://airr-space.netlify.app",
			bullets: [
				"IoT-based parking system using MERN stack, Expo, Socket.io, Python, and Arduino for real-time monitoring with ML-powered computer vision capabilities.",
			],
		},
	],
};
