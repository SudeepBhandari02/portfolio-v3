// Everything on the page comes from the resume. Edit here, not in the components.

export const PROFILE = {
  name: 'Sudeep Bhandari',
  role: 'Software Development Engineer',
  location: 'Bengaluru, India',
  email: 'sudeepbhandariwork@gmail.com',
  github: 'https://github.com/SudeepBhandari02',
  linkedin: 'https://www.linkedin.com/in/sudeepbhandari02',
}

// Every section runs one operation on the page as you scroll. Ids match section ids.
// The query is what the fixed query bar types when that section is on screen.
export const STOPS = [
  { id: 'top', label: 'Intro', query: 'SELECT * FROM raw_tables' },
  { id: 'why', label: 'Why', query: 'SELECT answer FROM your_data' },
  { id: 'work', label: 'StackPro', query: 'DRILL INTO stackpro' },
  { id: 'systems', label: 'Systems', query: 'EXPLAIN ANALYZE pipeline' },
  { id: 'projects', label: 'Projects', query: 'SELECT * FROM projects' },
  { id: 'toolbox', label: 'Toolbox', query: 'GROUP BY category' },
  { id: 'education', label: 'Education', query: 'ORDER BY year DESC' },
  { id: 'contact', label: 'Contact', query: 'SELECT * FROM above LIMIT 1' },
] as const

export type StopId = (typeof STOPS)[number]['id']

export const NAV_LINKS: { id: StopId; label: string }[] = [
  { id: 'work', label: 'Work' },
  { id: 'systems', label: 'Systems' },
  { id: 'projects', label: 'Projects' },
  { id: 'toolbox', label: 'Toolbox' },
  { id: 'contact', label: 'Contact' },
]

export const ROUTE = [
  { year: '2020', place: 'Siddapur', title: 'Pre University Course', org: 'Government PU College' },
  { year: '2022', place: 'Bengaluru', title: 'B.E. Computer Science', org: 'Acharya Institute of Technology' },
  { year: 'Jun 2025', place: 'StackPro', title: 'Full Stack Developer Intern', org: 'StackPro Technologies' },
  { year: 'Jun 2026', place: 'StackPro', title: 'Software Development Engineer 1', org: 'StackPro Technologies', current: true },
]

export const CURRENT_ROLE = {
  title: 'Software Development Engineer 1',
  dates: 'Jun 2026 to present',
  points: [
    {
      lead: 'BI platform',
      text: 'A client project that connects to customer data warehouses through a central service, so business users can build charts on raw warehouse data without waiting on engineering.',
    },
    {
      lead: 'Data semantic layer',
      text: 'Maps raw warehouse schemas into reusable metrics, dimensions and relationships that power self serve analytics.',
    },
    {
      lead: 'Embeddable dashboards',
      text: 'A BI function library for aggregations, filters and drill downs, mixing warehouse charts with live REST API data inside client products.',
    },
  ],
}

export const INTERNSHIP = {
  title: 'Full Stack Developer Intern',
  dates: 'Jun 2025 to May 2026',
  items: [
    {
      title: 'Warehouse query engine refactor',
      text: 'Replaced a hardcoded Snowflake query system with a multi warehouse engine built on Factory and Adapter patterns. A new warehouse is now a drop in extension, not a rewrite.',
      tags: ['Design patterns', 'Snowflake'],
    },
    {
      title: 'Metadata mapping AI agents',
      text: 'Agents built with Google ADK that normalize and enrich table schemas across SAP and Odoo ERPs, then generate warehouse specific queries.',
      tags: ['Google ADK', 'LLM agents'],
    },
    {
      title: 'AWS to GCP migration',
      text: 'Moved a client’s full AWS footprint to GCP: compute, storage, networking and managed services, with zero data loss. Then ran the GCP infrastructure day to day.',
      tags: ['AWS', 'GCP'],
    },
    {
      title: 'SOC 2 compliance',
      text: 'Cleared the AWS side control tasks in Scrut to bring a client application’s infrastructure in line with SOC 2 standards.',
      tags: ['Scrut', 'AWS'],
    },
    {
      title: 'Test automation',
      text: 'Wrote and maintained Playwright end to end suites for a Medical AI product, covering critical workflows and catching regressions before release.',
      tags: ['Playwright'],
    },
    {
      title: 'Feature store',
      text: 'A React, Tailwind and Zustand client for a partner owned backend. I built the UI on mock data first so both teams could ship in parallel, then wired up the REST APIs.',
      tags: ['React', 'Zustand'],
    },
    {
      title: 'Multi college survey platform',
      text: 'Architected and shipped a full stack platform where multiple colleges create, manage and analyze surveys. Also led the v3 design system migration of an existing client product.',
      tags: ['Full stack', 'Design systems'],
    },
  ],
}

export const PIPELINE = [
  {
    step: 'Schemas',
    title: 'Metadata mapping agents',
    text: 'Agents built with Google ADK read table schemas from SAP and Odoo, normalize and enrich them, and write warehouse specific queries.',
    chips: ['SAP', 'Odoo', 'Google ADK'],
  },
  {
    step: 'Meaning',
    title: 'Semantic layer',
    text: 'Raw schemas become reusable metrics, dimensions and relationships, so analytics can be self serve.',
    chips: ['Metrics', 'Dimensions', 'Relationships'],
  },
  {
    step: 'Execution',
    title: 'Query engine',
    text: 'Factory and Adapter patterns pick the right warehouse. Adding one means writing an adapter. Nothing else changes.',
    chips: ['Snowflake', 'Next adapter'],
  },
  {
    step: 'Answers',
    title: 'Embeddable dashboards',
    text: 'Aggregations, filters and drill downs from a BI function library, mixed with live REST API data inside client products.',
    chips: ['Charts', 'Drill downs', 'REST'],
  },
]

export const FEATURED_PROJECTS = [
  {
    name: 'WayGo',
    status: 'In progress',
    summary: 'A commuter app for live bus search and tracking, inspired by Uber. Built with a three person team.',
    points: [
      'JWT auth across guest and signed in flows',
      'GPS tracking with a cell tower fallback',
      'WebSocket driven ETAs behind a step by step journey view and a full map mode',
    ],
    stack: ['React Native', 'FastAPI', 'Zustand', 'TanStack Query', 'WebSockets'],
    visual: 'route' as const,
  },
  {
    name: 'KLYN',
    status: 'In progress',
    summary:
      'Personalized AI tutoring. It works out what a learner already knows, generates a custom course, then adapts concept by concept against a persistent learner knowledge model.',
    points: ['Wrote the Phase 1 product spec', 'Building the LangGraph tutoring agent'],
    stack: ['React Native', 'FastAPI', 'LangGraph'],
    visual: 'knowledge' as const,
  },
]

export const OTHER_PROJECTS = [
  { name: 'Frnd Tracker', text: 'Real time location sharing, chat and emergency contact reach out.', stack: 'React Native · Expo · FastAPI' },
  { name: 'Financial Stock Analyser', text: 'A multi agent market analyzer with live web search.', stack: 'PhiData · Grok · DuckDuckGo' },
  { name: 'Notes Taker', text: 'Cross platform notes with live sync between web and mobile.', stack: 'MERN · React Native' },
]

export const TOOLBOX = [
  { line: 'L1', category: 'Languages', tools: ['JavaScript', 'Python', 'C++', 'SQL'] },
  { line: 'L2', category: 'Frontend', tools: ['React', 'React Native', 'Expo', 'Tailwind CSS', 'ShadCN', 'Zustand', 'TanStack Query', 'GSAP'] },
  { line: 'L3', category: 'Backend', tools: ['Node.js', 'Express', 'FastAPI', 'Django', 'DRF', 'REST APIs', 'WebSockets'] },
  { line: 'L4', category: 'Data and cloud', tools: ['PostgreSQL', 'MySQL', 'MongoDB', 'Firebase', 'Snowflake', 'AWS', 'GCP', 'Docker', 'CI/CD', 'Jenkins'] },
  { line: 'L5', category: 'AI and agents', tools: ['LangChain', 'LangGraph', 'Google ADK', 'RAG pipelines', 'Vector databases', 'Embeddings'] },
  { line: 'L6', category: 'Testing and tools', tools: ['Playwright', 'Git', 'GitHub', 'Bitbucket', 'Postman', 'GitHub Copilot', 'Claude Code'] },
]

export const EDUCATION = [
  { title: 'B.E. Computer Science', org: 'Acharya Institute of Technology, Bengaluru', dates: '2022 to 2026' },
  { title: 'Pre University Course', org: 'Government PU College, Siddapur', dates: '2020 to 2022' },
]

export const CERTIFICATIONS = [
  { title: 'Programming with Python', issuer: 'OpenEDG' },
  { title: 'Ethical Hacking', issuer: 'NPTEL' },
  { title: 'GitHub Foundations', issuer: 'GitHub' },
  { title: 'Agile with Jira', issuer: 'Coursera' },
]

// Every row of content on the page. The contact section counts these down to one.
export const ROW_COUNT =
  ROUTE.length +
  CURRENT_ROLE.points.length +
  INTERNSHIP.items.length +
  PIPELINE.length +
  FEATURED_PROJECTS.length +
  OTHER_PROJECTS.length +
  TOOLBOX.reduce((n, g) => n + g.tools.length, 0) +
  EDUCATION.length +
  CERTIFICATIONS.length
