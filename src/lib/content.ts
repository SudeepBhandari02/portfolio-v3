// Everything on the page comes from the resume. Edit here, not in the components.

export const PROFILE = {
  name: 'Sudeep Bhandari',
  role: 'Software Development Engineer',
  location: 'Bengaluru, India',
  email: 'sudeepbhandariwork@gmail.com',
  github: 'https://github.com/SudeepBhandari02',
  linkedin: 'https://www.linkedin.com/in/sudeepbhandari02',
}

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
  },
  {
    name: 'KLYN',
    status: 'In progress',
    summary:
      'Personalized AI tutoring. It works out what a learner already knows, generates a custom course, then adapts concept by concept against a persistent learner knowledge model.',
    points: ['Wrote the Phase 1 product spec', 'Building the LangGraph tutoring agent'],
    stack: ['React Native', 'FastAPI', 'LangGraph'],
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

export const NAV_LINKS = [
  { id: 'work', label: 'Work' },
  { id: 'experience', label: 'Experience' },
  { id: 'toolbox', label: 'Toolbox' },
  { id: 'contact', label: 'Contact' },
] as const

// AxionBI case study. Every number here is counted from the repository or taken from the
// product's demo warehouse; nothing is a customer claim.
export const AXION = {
  name: 'AxionBI',
  line: 'A semantic layer first BI tool. Define a number once, and every dashboard answers with it.',
  meta: [
    { k: 'Role', v: 'Product, design and engineering. Solo.' },
    { k: 'Timeline', v: 'Oct 2026 to present' },
    { k: 'Built at', v: 'StackPro Labs' },
    { k: 'Status', v: 'In active development' },
  ],
  intro:
    'Most BI tools let anyone write the SQL behind a chart, so two dashboards can show two different revenues and both look right. AxionBI turns that around. You connect a warehouse, model its tables and relationships, define measures and dimensions once, then build dashboards by dropping those fields onto charts. Nobody hand writes the query behind a tile.',
  problem: {
    wrong: '40,647,891',
    right: '40,091,424',
    gap: '556,467',
    captions: [
      'Same question. Two answers.',
      'The gap is cancelled orders. One chart counted them.',
      'So the rule is written once, in the model.',
      'Same number. Every chart.',
    ],
  },
  pipeline: [
    { step: 'Connection', text: 'A read only identity on the customer warehouse. Credentials are encrypted at rest and never returned by the API.', code: 'postgres · snowflake · bigquery\n+ 7 more behind one interface' },
    { step: 'Data model', text: 'Tables and relationships on a canvas, with profiling that verifies keys and grain before a join is trusted.', code: 'orders  N : 1  channels\norder_lines  N : 1  orders' },
    { step: 'Measures and dimensions', text: 'The definitions. Written once, versioned, published, and certified when they are the trusted answer.', code: 'net_revenue =\n  SUM(line_amount)\n  WHERE order_status IS NOT Cancelled' },
    { step: 'Dashboard tile', text: 'A tile holds no SQL. It is a small request for fields that already exist in the model.', code: '{ dimensions: [channel],\n  measures: [net_revenue],\n  filters: [] }' },
    { step: 'Semantic query', text: 'The request is resolved against the published model: which tables, which joins, which grain.', code: 'resolve fields\nplan joins\nstitch grains' },
    { step: 'CQO', text: 'An internal query object. Every warehouse dialect compiles from this one shape.', code: 'validate\nmerge filters\nrewrite per dialect' },
    { step: 'SQL', text: 'Guarded output: SELECT only, a statement timeout and a row cap on every run.', code: 'SELECT c.channel_name,\n       SUM(l.line_amount)\nFROM order_lines l ...' },
    { step: 'Warehouse', text: 'The query runs where the data already lives. Nothing is copied out.', code: 'rows back to the tile\ncached per published version' },
  ],
  chapters: [
    {
      title: 'Model builder',
      text: 'A canvas for tables and relationships, with the evidence beside it. Profiling checks keys and grain, join discovery proposes relationships with the numbers that support them, and a formula editor covers measures, time fields and fiscal calendars. Work happens in a draft and ships as a published version.',
      points: ['Draft and publish versions', 'Key and grain verification', 'Join discovery with evidence', 'Formula editor and time intelligence'],
      image: { src: '/work/axionbi/model-builder.webp', alt: 'AxionBI model builder: three tables joined on a canvas, with the Net revenue measure open in the inspector.', w: 2400, h: 1221 },
    },
    {
      title: 'Query engine',
      text: 'A framework free compiler that turns a semantic query into SQL for ten warehouses. It started as a port of an earlier in house engine and grew from there: multi grain stitching, bridge tables for many to many joins, derived SQL tables, and time measures such as to date, rolling and previous period.',
      points: ['Semantic query to CQO to SQL', 'Ten warehouse dialects', 'SELECT only guardrails, timeouts, row caps', 'A purity test keeps app code out of the engine'],
    },
    {
      title: 'Dashboards',
      text: 'A builder where a chart is made by dropping governed fields into wells. Seven chart types, eight filter types, versioned autosave, themes with readability checks, exports to PDF, PNG and XLSX, and share links with optional password and expiry.',
      points: ['Grid canvas with drop wells', 'Top N with Other, drill and filters', 'Themes, exports, share links', 'Tiles query the published model'],
      image: { src: '/work/axionbi/dashboard.webp', alt: 'AxionBI Sales overview dashboard: a net revenue total, revenue by channel and revenue by month.', w: 2400, h: 834 },
    },
    {
      title: 'Stacker, the AI',
      text: 'Three LangGraph agents share one toolbox: one builds data models, one builds dashboards, one answers viewers in a read only panel. Stacker never edits directly. It proposes a change set and a person approves each item. Evals run against real models with code checks and a grader.',
      points: ['Change sets with per item approval', '28 kinds of model edit it can propose', 'Streaming over SSE, Postgres checkpoints', 'OpenAI, Anthropic and Google behind one profile'],
    },
    {
      title: 'Warehouse change detection',
      text: 'AxionBI watches the warehouse itself. A scan reads table and column names, never rows, and notices what was added, removed, retyped or renamed. Lineage turns that into impact: which published models, fields and dashboards are hit. Each change comes with one suggested fix, and fixed is proven by the system instead of clicked.',
      points: ['Scans on demand, on schedule, or after a chart fails', 'Impact through semantic lineage', 'One suggested fix per change', 'Quick fix publishes without dragging in draft work'],
    },
    {
      title: 'Platform',
      text: 'The parts nobody screenshots. Multi tenant orgs, invite only sign in with server side sessions, four roles checked as named permissions on every route and every AI tool, feature flags and limits per org, metered AI credits, a platform console for operators and a developer console with request waterfalls.',
      points: ['Org scoping on every query', 'RBAC on routes and AI tools', 'Entitlements and AI credits', 'Eleven guided product tours'],
    },
  ],
  stats: [
    { n: 1, suffix: '', label: 'Developer' },
    { n: 10, suffix: '', label: 'Warehouses supported' },
    { n: 257, suffix: '', label: 'API operations' },
    { n: 1700, suffix: '+', label: 'Server tests' },
    { n: 630, suffix: '+', label: 'Web tests' },
    { n: 40, suffix: '', label: 'Database migrations' },
    { n: 147, suffix: '', label: 'Commits so far' },
    { n: 170, suffix: 'k', label: 'Lines of Python and TypeScript' },
  ],
  warehouses: ['PostgreSQL', 'Snowflake', 'BigQuery', 'Redshift', 'Databricks', 'Trino', 'Athena', 'MySQL', 'ClickHouse', 'MotherDuck'],
  stack: [
    { k: 'API', v: 'Python 3.12, FastAPI, SQLAlchemy 2, Alembic, Pydantic v2, Redis, Celery, sqlglot' },
    { k: 'AI', v: 'LangGraph with a Postgres checkpointer, provider agnostic model profiles, evals' },
    { k: 'Web', v: 'React 19, TypeScript, Vite, Tailwind v4, TanStack Query, Router and Table, Zustand, React Aria, Recharts' },
    { k: 'Contract', v: 'OpenAPI is the source of truth. The web client is generated from it.' },
  ],
}
