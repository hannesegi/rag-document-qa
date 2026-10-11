import { v4 as uuidv4 } from "uuid";
import { chunkText } from "./chunker";
import type { Document } from "./types";

const companyFAQ = `Acme Corp — Frequently Asked Questions

Q: What does Acme Corp do?
A: Acme Corp is a technology company specializing in cloud-based enterprise solutions. Founded in 2018, we provide SaaS platforms for project management, team collaboration, and workflow automation. Our flagship product, AcmeFlow, serves over 10,000 businesses worldwide.

Q: Where is Acme Corp headquartered?
A: Our headquarters is located in San Francisco, California. We also have regional offices in London, Singapore, and Sydney to support our global customer base.

Q: What products does Acme Corp offer?
A: We offer three main products:
1. AcmeFlow — Project management and workflow automation platform
2. AcmeChat — Enterprise team communication and collaboration tool
3. AcmeVault — Secure document storage and sharing solution

Q: What is the pricing for AcmeFlow?
A: AcmeFlow offers three pricing tiers:
- Starter: $12/user/month — Basic project management features, up to 10 projects
- Professional: $29/user/month — Advanced workflows, unlimited projects, API access
- Enterprise: $59/user/month — Custom integrations, dedicated support, SSO, audit logs

Q: Does Acme Corp offer a free trial?
A: Yes, we offer a 14-day free trial for all products. No credit card is required to start. You can upgrade to a paid plan at any time during or after the trial.

Q: What kind of customer support does Acme Corp provide?
A: We provide multiple levels of support:
- Community support (free) — Access to our knowledge base and community forums
- Standard support (included in all paid plans) — Email support with 24-hour response time
- Priority support (Professional and Enterprise) — Live chat and phone support with 4-hour response time
- Dedicated support (Enterprise only) — Assigned account manager, 1-hour response time, custom SLA

Q: Does Acme Corp have an API?
A: Yes, AcmeFlow offers a comprehensive REST API available on Professional and Enterprise plans. The API allows you to integrate with third-party tools, automate workflows, and build custom applications. Full API documentation is available at docs.acmecorp.com/api.

Q: What security certifications does Acme Corp hold?
A: Acme Corp maintains SOC 2 Type II certification, ISO 27001 certification, and is GDPR compliant. All data is encrypted at rest (AES-256) and in transit (TLS 1.3). We conduct annual third-party security audits and offer a bug bounty program.

Q: How do I contact Acme Corp?
A: You can reach us through:
- Email: support@acmecorp.com
- Phone: +1 (555) 123-4567
- Live chat: Available on our website Monday-Friday, 9AM-6PM PST
- Social media: @AcmeCorp on Twitter, LinkedIn, and Facebook`;

const productManual = `AcmeFlow Product Manual — Version 3.2

Chapter 1: Getting Started

1.1 System Requirements
AcmeFlow is a web-based application accessible through any modern web browser. Recommended browsers include Chrome 90+, Firefox 88+, Safari 14+, and Edge 90+. No desktop installation is required.

1.2 Creating Your Account
To create an account, visit app.acmeflow.com and click "Sign Up." You'll need to provide your email address, create a password (minimum 8 characters, must include uppercase, lowercase, and a number), and verify your email. Organization administrators can also invite users via email.

1.3 Dashboard Overview
Upon logging in, you'll see the main dashboard which includes:
- Project List: All projects you're a member of, sorted by recent activity
- Task Summary: Your assigned tasks across all projects with due dates
- Activity Feed: Recent updates from your team members
- Quick Actions: Shortcuts to create new projects, tasks, or meetings

Chapter 2: Project Management

2.1 Creating a New Project
Click the "+ New Project" button in the top navigation bar. You'll be prompted to:
- Enter a project name and description
- Choose a project template (Kanban, Scrum, Waterfall, or Custom)
- Set the project visibility (Public, Private, or Team-only)
- Invite team members and assign roles (Admin, Editor, Viewer)

2.2 Task Management
Tasks are the core unit of work in AcmeFlow. Each task includes:
- Title and description (supports Markdown formatting)
- Assignee and reviewer
- Priority level (Critical, High, Medium, Low)
- Due date and estimated hours
- Labels and tags for categorization
- Subtasks for breaking down complex work
- Comments and attachments
- Time tracking

2.3 Workflow Automation
AcmeFlow supports custom workflow automation through our Rules Engine:
- Trigger: Define what event starts the automation (task created, status changed, due date approaching)
- Condition: Set criteria that must be met (task priority, assignee, project type)
- Action: Specify what happens (send notification, change status, assign task, create subtask)

Example: When a task marked "Critical" is created, automatically assign it to the team lead and send a Slack notification.

Chapter 3: Collaboration Features

3.1 Real-time Collaboration
Multiple users can edit task descriptions, project docs, and notes simultaneously. Changes are synced in real-time with conflict resolution. You'll see other users' cursors and selections highlighted in different colors.

3.2 Comments and Mentions
Use @mentions in comments to notify specific team members. Comments support:
- Rich text formatting and code blocks
- File attachments (up to 25MB per file)
- Reactions and threaded replies
- Email notifications for mentioned users

3.3 Reporting and Analytics
AcmeFlow provides built-in reporting:
- Burndown charts showing sprint progress
- Velocity tracking across sprints
- Team workload distribution
- Task completion rates and trends
- Custom reports with filters and date ranges
- Export to CSV, PDF, or Google Sheets`;

const hrPolicy = `Acme Corp — Human Resources Policy Handbook

Section 1: Employment Policies

1.1 Equal Employment Opportunity
Acme Corp is committed to providing equal employment opportunities to all employees and applicants. We do not discriminate based on race, color, religion, gender, sexual orientation, national origin, age, disability, or veteran status. All employment decisions are based on merit, qualifications, and business needs.

1.2 Employment Classifications
- Full-time: Employees working 40 hours per week, eligible for all benefits
- Part-time: Employees working 20-39 hours per week, eligible for prorated benefits
- Contract: Fixed-term employment for specific projects, benefits per contract terms
- Intern: Temporary positions for students or recent graduates, stipend and learning-focused

1.3 Probation Period
All new employees undergo a 90-day probation period. During this time, both the employee and the company can assess fit. Regular check-ins will be conducted at 30, 60, and 90 days with the direct manager and HR representative.

Section 2: Compensation and Benefits

2.1 Salary Structure
Salaries are determined based on role, experience, market data, and internal equity. Annual salary reviews occur in January. Performance-based raises range from 3% to 10%. Promotions may include salary adjustments of 10% to 20%.

2.2 Benefits Package
Full-time employees receive:
- Health insurance (medical, dental, vision) — Company covers 80% of premiums
- 401(k) retirement plan with 4% company match
- Life insurance (2x annual salary)
- Short-term and long-term disability coverage
- Employee Assistance Program (EAP)
- Annual wellness stipend of $500

2.3 Paid Time Off (PTO)
- Vacation: 15 days per year (increases to 20 days after 3 years, 25 days after 5 years)
- Sick leave: 10 days per year
- Personal days: 3 days per year
- Holidays: 11 paid holidays per year
- Parental leave: 12 weeks paid for primary caregivers, 4 weeks for secondary caregivers
- Bereavement: 5 days for immediate family, 3 days for extended family

Section 3: Work Policies

3.1 Remote Work Policy
Acme Corp supports a hybrid work model. Employees may work remotely up to 3 days per week with manager approval. Fully remote arrangements are available for certain roles with VP approval. Remote workers must maintain a dedicated workspace, reliable internet connection, and be available during core hours (10AM-3PM in their time zone).

3.2 Working Hours
Standard working hours are 9AM to 5PM, Monday through Friday. Core hours are 10AM to 3PM, during which all employees should be available for meetings and collaboration. Flexible scheduling is available with manager approval for start times between 7AM and 10AM.

3.3 Performance Reviews
Performance reviews are conducted semi-annually in January and July. The review process includes:
- Self-assessment by the employee
- Manager evaluation based on goals and competencies
- Peer feedback (360-degree review for senior roles)
- Goal setting for the next review period
- Development plan discussion

3.4 Code of Conduct
All employees are expected to:
- Act with integrity and professionalism
- Respect colleagues and maintain an inclusive environment
- Protect company confidential information
- Report conflicts of interest
- Follow IT security policies
- Comply with all applicable laws and regulations

Section 4: Learning and Development

4.1 Training Budget
Each employee receives an annual learning budget of $2,000 for professional development. This can be used for:
- Online courses and certifications
- Conference attendance
- Books and learning materials
- Professional memberships

4.2 Internal Mentorship Program
Our mentorship program pairs junior employees with senior leaders for 6-month cycles. Mentors and mentees meet bi-weekly to discuss career goals, skill development, and company culture.`;

function createSampleDoc(name: string, content: string): Document {
  const id = uuidv4();
  const chunks = chunkText(content, id, name);
  return {
    id,
    name,
    content,
    chunks,
    uploadedAt: new Date().toISOString(),
    size: new TextEncoder().encode(content).length,
  };
}

export const sampleDocuments: Document[] = [
  createSampleDoc("Acme Corp FAQ.txt", companyFAQ),
  createSampleDoc("AcmeFlow Product Manual.txt", productManual),
  createSampleDoc("HR Policy Handbook.txt", hrPolicy),
];
