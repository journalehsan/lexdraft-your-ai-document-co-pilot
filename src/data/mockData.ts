export interface ProjectFile {
  id: string;
  name: string;
  type: 'md' | 'tex' | 'txt';
}

export interface Project {
  id: string;
  name: string;
  lastUpdated: string;
  files: ProjectFile[];
}

export interface ChatMessage {
  id: string;
  role: 'user' | 'assistant' | 'system';
  content: string;
  timestamp: string;
}

export type AgentStep = 'Ask questions' | 'Research' | 'Draft' | 'Refine' | 'Export';

export const projects: Project[] = [
  {
    id: '1',
    name: 'Merger Agreement - Acme Corp',
    lastUpdated: '2 hours ago',
    files: [
      { id: '1a', name: 'merger-agreement.md', type: 'md' },
      { id: '1b', name: 'due-diligence-notes.md', type: 'md' },
      { id: '1c', name: 'schedules.tex', type: 'tex' },
      { id: '1d', name: 'closing-checklist.md', type: 'md' },
    ],
  },
  {
    id: '2',
    name: 'Employment Contract - TechStart',
    lastUpdated: '5 hours ago',
    files: [
      { id: '2a', name: 'employment-contract.md', type: 'md' },
      { id: '2b', name: 'non-compete.md', type: 'md' },
      { id: '2c', name: 'benefits-schedule.tex', type: 'tex' },
    ],
  },
  {
    id: '3',
    name: 'NDA - Confidential Deal',
    lastUpdated: 'Yesterday',
    files: [
      { id: '3a', name: 'mutual-nda.md', type: 'md' },
      { id: '3b', name: 'exhibit-a.md', type: 'md' },
      { id: '3c', name: 'revision-notes.txt', type: 'txt' },
    ],
  },
  {
    id: '4',
    name: 'Real Estate Purchase - 123 Main St',
    lastUpdated: '2 days ago',
    files: [
      { id: '4a', name: 'purchase-agreement.md', type: 'md' },
      { id: '4b', name: 'title-search.md', type: 'md' },
      { id: '4c', name: 'inspection-report.md', type: 'md' },
      { id: '4d', name: 'closing-statement.tex', type: 'tex' },
      { id: '4e', name: 'amendments.md', type: 'md' },
    ],
  },
  {
    id: '5',
    name: 'Licensing Agreement - SoftwareCo',
    lastUpdated: '3 days ago',
    files: [
      { id: '5a', name: 'license-agreement.md', type: 'md' },
      { id: '5b', name: 'fee-schedule.tex', type: 'tex' },
      { id: '5c', name: 'support-terms.md', type: 'md' },
    ],
  },
  {
    id: '6',
    name: 'Partnership Agreement - Law Firm LLP',
    lastUpdated: '1 week ago',
    files: [
      { id: '6a', name: 'partnership-agreement.md', type: 'md' },
      { id: '6b', name: 'capital-contributions.tex', type: 'tex' },
      { id: '6c', name: 'voting-rights.md', type: 'md' },
      { id: '6d', name: 'exit-provisions.md', type: 'md' },
    ],
  },
];

export const sampleChatMessages: ChatMessage[] = [
  {
    id: 'c1',
    role: 'user',
    content: 'I need to draft a merger agreement for the acquisition of Acme Corp by BigTech Industries.',
    timestamp: '10:30 AM',
  },
  {
    id: 'c2',
    role: 'assistant',
    content: "I'd be happy to help you draft this merger agreement. Before I begin, I have a few clarifying questions:\n\n1. **Deal Structure**: Is this a stock purchase, asset purchase, or statutory merger?\n2. **Consideration**: What is the purchase price and form of consideration (cash, stock, or combination)?\n3. **Key Parties**: Are there any key shareholders or stakeholders whose consent is required?\n4. **Timeline**: What is the expected closing date?",
    timestamp: '10:31 AM',
  },
  {
    id: 'c3',
    role: 'user',
    content: "It's a stock purchase. $50M cash consideration. The board has already approved. We're targeting a 60-day close.",
    timestamp: '10:33 AM',
  },
  {
    id: 'c4',
    role: 'assistant',
    content: "Thank you for those details. I'm now researching relevant precedents and standard clauses for stock purchase agreements in your jurisdiction. I'll draft the agreement with the following key sections:\n\n- Recitals and Definitions\n- Purchase and Sale of Shares\n- Representations and Warranties\n- Covenants and Agreements\n- Conditions to Closing\n- Indemnification\n- Termination Rights\n\nGenerating draft now...",
    timestamp: '10:34 AM',
  },
];

export const sampleDocumentContent = `# STOCK PURCHASE AGREEMENT

**This Stock Purchase Agreement** ("Agreement") is entered into as of [DATE], by and between:

**BUYER:** BigTech Industries, Inc., a Delaware corporation ("Buyer")

**SELLER:** The shareholders of Acme Corp listed on Exhibit A hereto (collectively, "Sellers")

**COMPANY:** Acme Corp, a Delaware corporation (the "Company")

---

## ARTICLE I - DEFINITIONS

**1.1** "Affiliate" means, with respect to any Person, any other Person that directly or indirectly controls, is controlled by, or is under common control with, such Person.

**1.2** "Business Day" means any day other than a Saturday, Sunday, or a day on which banks in New York, New York are authorized or required to close.

**1.3** "Closing" has the meaning set forth in Section 2.2.

**1.4** "Closing Date" means the date on which the Closing occurs.

---

## ARTICLE II - PURCHASE AND SALE

**2.1 Purchase and Sale of Shares.** Subject to the terms and conditions of this Agreement, at the Closing, each Seller shall sell, transfer, convey, and deliver to Buyer, and Buyer shall purchase from each Seller, all of the Shares owned by such Seller, free and clear of all Encumbrances.

**2.2 Closing.** The closing of the transactions contemplated by this Agreement (the "Closing") shall take place at the offices of [LAW FIRM], located at [ADDRESS], at 10:00 a.m. local time on the date that is sixty (60) days after the date hereof, or at such other time, date, and place as the parties may mutually agree in writing.

**2.3 Purchase Price.** The aggregate purchase price for all of the Shares shall be Fifty Million Dollars ($50,000,000) in cash (the "Purchase Price").

---

## ARTICLE III - REPRESENTATIONS AND WARRANTIES OF SELLERS

Each Seller, severally and not jointly, represents and warrants to Buyer as follows:

**3.1 Organization and Authority.** Such Seller has full power and authority to execute and deliver this Agreement and to perform its obligations hereunder.

**3.2 Title to Shares.** Such Seller is the record and beneficial owner of the Shares set forth opposite such Seller's name on Exhibit A, free and clear of all Encumbrances.

[*Citation: Del. Code Ann. tit. 8, § 251*]

---

## ARTICLE IV - REPRESENTATIONS AND WARRANTIES OF BUYER

Buyer represents and warrants to Sellers as follows:

**4.1 Organization.** Buyer is a corporation duly organized, validly existing, and in good standing under the laws of the State of Delaware.

**4.2 Authority.** Buyer has full corporate power and authority to execute and deliver this Agreement and to consummate the transactions contemplated hereby.

[*Citation: Model Stock Purchase Agreement, ABA Section of Business Law*]
`;

export const agentSteps: AgentStep[] = ['Ask questions', 'Research', 'Draft', 'Refine', 'Export'];
