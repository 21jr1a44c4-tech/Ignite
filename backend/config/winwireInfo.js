/**
 * WinWire Company Information File
 * Contains all company data: team, services, benefits, culture, etc.
 * This is the ONLY source of truth for employee chatbot - NO WEB SEARCH
 */

const winwireInfo = {
  company: {
    name: "WinWire",
    tagline: "Transforming Business Through Innovation",
    mission: "To empower businesses with cutting-edge technology solutions and exceptional talent",
    vision: "To be the leading technology partner for digital transformation",
    founded: "2015",
    headquarters: "Cloud Solutions Hub, Tech Park",
    website: "www.winwire.com",
    phone: "+1-800-WIN-WIRE",
    email: "careers@winwire.com",
  },

  services: [
    {
      id: "cloud-solutions",
      name: "Cloud Solutions",
      description: "Enterprise cloud infrastructure, migration, and management services",
      technologies: ["AWS", "Azure", "Google Cloud", "Kubernetes", "Docker"],
      clients: "500+ enterprises across industries",
      revenue: "40% of company revenue",
    },
    {
      id: "ai-ml",
      name: "AI & Machine Learning",
      description: "Custom AI solutions, predictive analytics, and intelligent automation",
      technologies: ["Python", "TensorFlow", "PyTorch", "Natural Language Processing", "Computer Vision"],
      clients: "200+ AI implementation projects",
      revenue: "35% of company revenue",
    },
    {
      id: "web-development",
      name: "Web & Mobile Development",
      description: "Full-stack web and mobile application development",
      technologies: ["React", "Node.js", "Flutter", "iOS/Android", "Progressive Web Apps"],
      clients: "300+ successful projects",
      revenue: "15% of company revenue",
    },
    {
      id: "consulting",
      name: "Digital Transformation Consulting",
      description: "Strategy, planning, and implementation of digital transformation initiatives",
      technologies: ["Process Automation", "Change Management", "Business Intelligence"],
      clients: "100+ consulting engagements",
      revenue: "10% of company revenue",
    },
  ],

  departments: [
    {
      name: "Engineering",
      description: "Develops and maintains all technical solutions",
      teams: ["Cloud Infrastructure", "AI/ML Platform", "Web Development", "DevOps"],
      headcount: "150 engineers",
    },
    {
      name: "Sales & Marketing",
      description: "Drives business growth and client relationships",
      teams: ["Enterprise Sales", "Marketing", "Business Development"],
      headcount: "30 professionals",
    },
    {
      name: "Human Resources",
      description: "Manages recruitment, onboarding, and employee development",
      teams: ["Recruitment", "Onboarding", "Learning & Development", "Employee Relations"],
      headcount: "15 professionals",
    },
    {
      name: "Finance & Operations",
      description: "Manages finances, operations, and administrative functions",
      teams: ["Accounting", "Financial Planning", "Operations", "Procurement"],
      headcount: "20 professionals",
    },
    {
      name: "Product & Design",
      description: "Creates innovative products and world-class user experiences",
      teams: ["Product Management", "UX/UI Design", "Design Systems"],
      headcount: "25 professionals",
    },
  ],

  adminTeam: [
    {
      name: "Ashu Goel",
      title: "Chief Executive Officer (CEO)",
      email: "Ashu@winwire.com",
      phone: "+1-800-WIN-0001",
      background: "20+ years in tech leadership, founded 3 startups",
      office: "Floor 10, Main Building",
    },
    {
      name: "Priya Sharma",
      title: "Chief Technology Officer (CTO)",
      email: "priya@winwire.com",
      phone: "+1-800-WIN-0002",
      background: "15+ years in cloud and AI, ex-Amazon engineer",
      office: "Floor 10, Tech Building",
    },
    {
      name: "Aditya Patel",
      title: "Chief Financial Officer (CFO)",
      email: "aditya@winwire.com",
      phone: "+1-800-WIN-0003",
      background: "18+ years in finance, IIM graduate",
      office: "Floor 9, Main Building",
    },
    {
      name: "Sarah Johnson",
      title: "VP - Human Resources",
      email: "sarah@winwire.com",
      phone: "+1-800-WIN-0004",
      background: "12+ years in HR, certified SHRM-CP",
      office: "Floor 8, HR Building",
    },
    {
      name: "Marcus Chen",
      title: "VP - Engineering",
      email: "marcus@winwire.com",
      phone: "+1-800-WIN-0005",
      background: "16+ years in software development, ex-Google",
      office: "Floor 7, Tech Building",
    },
  ],

  benefits: [
    {
      category: "Health & Wellness",
      items: [
        "Comprehensive health insurance (medical, dental, vision)",
        "Mental health counseling and support",
        "Fitness center membership",
        "Annual health checkups",
        "COVID-19 vaccination support",
      ],
    },
    {
      category: "Financial Benefits",
      items: [
        "Competitive salary packages",
        "Performance bonuses (up to 20% of salary)",
        "Stock options for senior staff",
        "Retirement planning assistance",
        "Life insurance coverage",
      ],
    },
    {
      category: "Work-Life Balance",
      items: [
        "Flexible work hours (8am-10am start time)",
        "Remote work options (up to 3 days/week)",
        "Unlimited paid time off (PTO)",
        "Parental leave (6 months for both parents)",
        "Sabbatical programs",
      ],
    },
    {
      category: "Learning & Development",
      items: [
        "Annual training budget ($5000/employee)",
        "Certification reimbursement (AWS, Azure, GCP, etc.)",
        "Online course subscriptions (Coursera, Udemy, etc.)",
        "Internal mentorship programs",
        "Conference attendance support",
      ],
    },
    {
      category: "Perks & Facilities",
      items: [
        "Free meals and beverages in office",
        "Gaming and recreation areas",
        "Shuttle service to major locations",
        "Pet-friendly office policy",
        "On-site gym and yoga classes",
      ],
    },
  ],

  culture: {
    values: [
      "Innovation - We embrace creative thinking and new ideas",
      "Integrity - We conduct business with highest ethical standards",
      "Collaboration - We work together across teams and departments",
      "Excellence - We strive for quality in everything we do",
      "Diversity - We celebrate different backgrounds and perspectives",
    ],
    workEnvironment:
      "WinWire is a fast-paced, dynamic workplace where innovation thrives. We believe in empowering our employees, encouraging experimentation, and learning from failures. Our culture is built on trust, transparency, and mutual respect.",
    diversity:
      "We are committed to building an inclusive workplace. Our team includes members from 25+ countries, speaking 30+ languages. We actively promote diversity in hiring, leadership, and company policies.",
    socialResponsibility:
      "WinWire dedicates 2% of profits to community development, environmental sustainability, and education initiatives. All employees get 2 paid days/year for volunteer work.",
  },

  onboarding: {
    duration: "30-90 days structured program",
    week1: [
      "Welcome and orientation",
      "Office tour and access setup",
      "Meet your manager and team",
      "System training (email, VPN, tools)",
      "Company culture and values overview",
    ],
    week2to4: [
      "Technical training and setup",
      "Project assignments",
      "Meet stakeholders and other teams",
      "Attend team meetings and events",
      "Complete compliance training",
    ],
    month2to3: [
      "Independent project ownership",
      "Build relationships across company",
      "Receive first performance feedback",
      "Onboarding completion assessment",
      "Plan career development goals",
    ],
  },

  faqs: [
    {
      question: "What is the application process?",
      answer:
        "Apply through our website (www.winwire.com/careers), submit resume and cover letter. Selected candidates go through phone screening, technical interview, and final round with leadership. Process takes 2-4 weeks.",
    },
    {
      question: "What are the salary ranges?",
      answer:
        "Salaries are competitive and based on experience, skills, and role. Fresh graduates start at ₹6-8 LPA, mid-level engineers at ₹12-18 LPA, seniors at ₹20-30 LPA. We also offer equity options.",
    },
    {
      question: "What is the work culture like?",
      answer:
        "WinWire fosters an inclusive, innovative culture. We encourage experimentation, cross-team collaboration, and continuous learning. Flexibility, transparency, and integrity are core values.",
    },
    {
      question: "Do you offer remote work?",
      answer:
        "Yes! We offer flexible work arrangements - up to 3 days/week remote. You can work from home, office, or any location with good internet. No strict dress code, focus on output quality.",
    },
    {
      question: "What are career growth opportunities?",
      answer:
        "Clear career paths with growth opportunities every 2 years. We offer promotions based on merit, internal mobility programs, leadership training, and mentorship opportunities.",
    },
    {
      question: "How much time off do I get?",
      answer:
        "Unlimited paid time off (PTO) + 12 public holidays + 6 weeks parental leave. We encourage employees to take at least 20 days leave/year to maintain work-life balance.",
    },
    {
      question: "What is the interview process?",
      answer:
        "Typically 3 rounds: (1) Phone screening with recruiter, (2) Technical interview with engineers, (3) Final round with VP/Leadership. For freshers, there may be a coding test. Total time: 2-4 weeks.",
    },
    {
      question: "Do you sponsor visas?",
      answer:
        "Yes, we sponsor visas for international candidates. We have offices in India, USA, UK, and Singapore. Relocation support is provided.",
    },
  ],

  offices: [
    {
      location: "Hyderabad, India",
      address: "Tech Park, Gachibowli, Hyderabad 500032",
      employees: "300+",
      facilities: ["Gym", "Cafeteria", "Recreation Area", "Meeting Rooms", "Training Center"],
    },
    {
      location: "Bangalore, India",
      address: "Innovation Hub, Whitefield, Bangalore 560066",
      employees: "200+",
      facilities: ["Gym", "Cafeteria", "Gaming Area", "Lounge", "Parking"],
    },
    {
      location: "New York, USA",
      address: "Times Square, Manhattan, NY 10036",
      employees: "100+",
      facilities: ["Gym", "Cafeteria", "Recreation Area", "Client Meeting Rooms"],
    },
    {
      location: "London, UK",
      address: "Tech Hub, Shoreditch, London EC1V 6PB",
      employees: "50+",
      facilities: ["Meeting Rooms", "Cafeteria", "Collaboration Space"],
    },
  ],

  contactInfo: {
    recruitment: {
      email: "careers@winwire.com",
      phone: "+1-800-WIN-HIRE",
      message: "Send your resume and query about open positions",
    },
    hr: {
      email: "hr@winwire.com",
      phone: "+1-800-WIN-0404",
      message: "Contact for employee-related queries",
    },
    support: {
      email: "support@winwire.com",
      phone: "+1-800-WIN-HELP",
      message: "General support and inquiries",
    },
  },

  announcements: [
    {
      date: "2025-12-20",
      title: "Welcome to WinWire Family!",
      message: "We are excited to have new team members joining us. Orientation starts tomorrow!",
    },
    {
      date: "2025-12-15",
      title: "Year-End Celebration",
      message: "Join us for our virtual year-end celebration on Dec 22. Exciting prizes and awards!",
    },
    {
      date: "2025-12-10",
      title: "New AI/ML Project Launch",
      message: "We are launching 5 new AI projects next quarter. Interested engineers should reach out to CTO office.",
    },
  ],
};

module.exports = winwireInfo;
