import { PrismaClient, Role, Category, Severity, IssueStatus, ProgressStage, AustralianState } from "@prisma/client";
import bcrypt from "bcryptjs";

const prisma = new PrismaClient();

async function main() {
  console.log("🌱 Seeding NationLovers database...");

  // ─── Users ────────────────────────────────────────────────────────────────
  const passwordHash = await bcrypt.hash("Password123!", 12);
  const adminHash = await bcrypt.hash("Admin1234!", 12);

  const [admin, expert1, expert2, vol1, vol2, vol3, cit1, cit2, cit3, cit4] =
    await Promise.all([
      prisma.user.create({
        data: {
          name: "Admin NationLovers",
          email: "admin@nationlovers.au",
          password: adminHash,
          role: Role.ADMIN,
          state: AustralianState.VIC,
          bio: "Platform administrator for NationLovers Australia.",
        },
      }),
      prisma.user.create({
        data: {
          name: "Dr. Sarah Chen",
          email: "sarah.chen@expert.au",
          password: passwordHash,
          role: Role.EXPERT,
          state: AustralianState.NSW,
          bio: "Urban planning expert with 15 years experience in Sydney. Specialises in housing and transport.",
        },
      }),
      prisma.user.create({
        data: {
          name: "Dr. James Nguyen",
          email: "james.nguyen@health.au",
          password: passwordHash,
          role: Role.EXPERT,
          state: AustralianState.QLD,
          bio: "General practitioner and public health advocate in Brisbane. Focused on Medicare reform.",
        },
      }),
      prisma.user.create({
        data: {
          name: "Priya Sharma",
          email: "priya.sharma@vol.au",
          password: passwordHash,
          role: Role.VOLUNTEER,
          state: AustralianState.VIC,
          bio: "Community organiser in Melbourne's western suburbs. Passionate about affordable housing.",
        },
      }),
      prisma.user.create({
        data: {
          name: "Tom Williams",
          email: "tom.williams@vol.au",
          password: passwordHash,
          role: Role.VOLUNTEER,
          state: AustralianState.WA,
          bio: "Environmental advocate in Perth. Volunteer coordinator for climate action groups.",
        },
      }),
      prisma.user.create({
        data: {
          name: "Emma Rodriguez",
          email: "emma.rodriguez@vol.au",
          password: passwordHash,
          role: Role.VOLUNTEER,
          state: AustralianState.QLD,
          bio: "Youth worker and community volunteer in Brisbane's south.",
        },
      }),
      prisma.user.create({
        data: {
          name: "Michael O'Brien",
          email: "michael.obrien@citizen.au",
          password: passwordHash,
          role: Role.CITIZEN,
          state: AustralianState.NSW,
          bio: "Tradie from Western Sydney dealing with cost of living pressure.",
        },
      }),
      prisma.user.create({
        data: {
          name: "Aisha Patel",
          email: "aisha.patel@citizen.au",
          password: passwordHash,
          role: Role.CITIZEN,
          state: AustralianState.VIC,
          bio: "Single mum in Footscray navigating the rental crisis.",
        },
      }),
      prisma.user.create({
        data: {
          name: "Luke Thompson",
          email: "luke.thompson@citizen.au",
          password: passwordHash,
          role: Role.CITIZEN,
          state: AustralianState.SA,
          bio: "Farmer from the Barossa Valley concerned about water security and energy costs.",
        },
      }),
      prisma.user.create({
        data: {
          name: "Grace Kim",
          email: "grace.kim@citizen.au",
          password: passwordHash,
          role: Role.CITIZEN,
          state: AustralianState.ACT,
          bio: "Public servant in Canberra interested in government transparency.",
        },
      }),
    ]);

  console.log("✅ Users created");

  // ─── Issues ───────────────────────────────────────────────────────────────
  const issueData = [
    // COST OF LIVING
    {
      title: "Grocery prices up 40% — families struggling in Western Sydney",
      description:
        "Families in Western Sydney are being crushed by grocery price inflation. Woolworths and Coles have increased prices by an average of 40% over the past three years while reporting record profits. Single-income households are skipping meals and relying on food banks at unprecedented rates. Local community centres report a 300% increase in emergency food hamper requests since 2021.",
      category: Category.COST_OF_LIVING,
      location: "Penrith, NSW",
      state: AustralianState.NSW,
      severity: Severity.CRITICAL,
      status: IssueStatus.VERIFIED,
      upvotes: 1847,
      authorId: cit1.id,
    },
    {
      title: "Electricity bills hitting $800/quarter — energy poverty spreading",
      description:
        "Average Victorian household electricity bills have reached $800 per quarter following the energy transition price spikes. Low-income families are choosing between heating and eating. The concession system is failing to keep up with real-world costs, leaving hundreds of thousands of Victorians in energy poverty.",
      category: Category.COST_OF_LIVING,
      location: "Melbourne, VIC",
      state: AustralianState.VIC,
      severity: Severity.CRITICAL,
      status: IssueStatus.VERIFIED,
      upvotes: 1523,
      authorId: cit2.id,
    },
    {
      title: "Fuel prices destroying regional families — rural NSW forgotten",
      description:
        "Regional NSW communities are bearing the brunt of fuel price volatility. With no public transport alternatives, residents in areas like Cobar, Bourke, and Lightning Ridge pay 30-40 cents more per litre than city dwellers. For families driving 100+ km daily for work, this adds $200-300 to monthly expenses.",
      category: Category.COST_OF_LIVING,
      location: "Cobar, NSW",
      state: AustralianState.NSW,
      severity: Severity.HIGH,
      status: IssueStatus.VERIFIED,
      upvotes: 934,
      authorId: cit3.id,
    },
    {
      title: "Insurance premiums up 35% — North Queensland uninsurable",
      description:
        "Home insurance premiums in North Queensland have risen 35% in 12 months. In some cyclone-prone suburbs of Cairns and Townsville, premiums have tripled. Many homeowners are being forced to go uninsured or are being denied coverage entirely, creating a systemic financial risk.",
      category: Category.COST_OF_LIVING,
      location: "Cairns, QLD",
      state: AustralianState.QLD,
      severity: Severity.HIGH,
      status: IssueStatus.IN_PROGRESS,
      upvotes: 756,
      authorId: vol3.id,
    },
    // HOUSING
    {
      title: "Melbourne rental vacancy at 0.4% — renters have zero choice",
      description:
        "Melbourne's rental vacancy rate has collapsed to 0.4%, the lowest on record. Renters are applying for 40-50 properties without success, with 100+ applications for each listing. Landlords are holding open inspections like auctions with bidding wars on rent. The human cost is massive — teachers, nurses, and essential workers cannot afford to live near their workplaces.",
      category: Category.HOUSING,
      location: "Melbourne, VIC",
      state: AustralianState.VIC,
      severity: Severity.CRITICAL,
      status: IssueStatus.VERIFIED,
      upvotes: 2341,
      authorId: cit2.id,
    },
    {
      title: "First home buyers permanently priced out of all major cities",
      description:
        "The median Sydney house price is now 14x the median household income. Brisbane has crossed 10x. Even with a 20% deposit, a first home buyer needs 8+ years of combined income saved, with interest rates at their current levels making mortgage stress near-certain. The first home buyer dream is effectively dead for anyone under 35 without family wealth.",
      category: Category.HOUSING,
      location: "Sydney, NSW",
      state: AustralianState.NSW,
      severity: Severity.CRITICAL,
      status: IssueStatus.IN_PROGRESS,
      upvotes: 2108,
      authorId: expert1.id,
    },
    {
      title: "Homeless camps growing near Central Station — invisible crisis",
      description:
        "The number of people sleeping rough near Central Station has tripled since 2021. Services are overwhelmed, with shelters full every night. The visible homelessness is just the tip — hidden homelessness (couch surfing, cars) has skyrocketed. The lack of transitional housing options means people cycle through crisis services with no way out.",
      category: Category.HOUSING,
      location: "Sydney, NSW",
      state: AustralianState.NSW,
      severity: Severity.HIGH,
      status: IssueStatus.VERIFIED,
      upvotes: 1456,
      authorId: vol1.id,
    },
    {
      title: "No social housing built in SA for 10 years — 15,000 on waitlist",
      description:
        "South Australia has not built significant new social housing in over a decade while the waitlist has grown to 15,000+ households. Average wait time is now 7-10 years. Families with children are stuck in inappropriate temporary accommodation for years. The state government's housing targets are aspirational with no funded delivery plan.",
      category: Category.HOUSING,
      location: "Adelaide, SA",
      state: AustralianState.SA,
      severity: Severity.CRITICAL,
      status: IssueStatus.REPORTED,
      upvotes: 987,
      authorId: cit3.id,
    },
    // HEALTHCARE
    {
      title: "6-hour waits at Royal Brisbane — nurses quitting in exhaustion",
      description:
        "Emergency department wait times at the Royal Brisbane Hospital have reached an average of 6 hours, with peak periods hitting 12+ hours. Nursing staff are burning out and leaving the profession entirely. The hospital is running at 115% capacity regularly. Patients in ambulances wait hours outside unable to be admitted — ramping is now routine.",
      category: Category.HEALTHCARE,
      location: "Brisbane, QLD",
      state: AustralianState.QLD,
      severity: Severity.HIGH,
      status: IssueStatus.VERIFIED,
      upvotes: 1234,
      authorId: expert2.id,
    },
    {
      title: "GP shortage in rural SA — towns left without doctors",
      description:
        "47 towns across regional South Australia have no resident GP. Residents drive 2-3 hours for basic medical appointments. Telehealth partially covers some needs but cannot replace physical examinations. Elderly and chronically ill residents are particularly impacted. Medicare bulk billing gaps in rural areas mean those who do have GP access often can't afford it.",
      category: Category.HEALTHCARE,
      location: "Port Augusta, SA",
      state: AustralianState.SA,
      severity: Severity.CRITICAL,
      status: IssueStatus.VERIFIED,
      upvotes: 876,
      authorId: expert2.id,
    },
    {
      title: "Mental health crisis — 18-month wait for public psychiatry",
      description:
        "The average wait time for a public psychiatry appointment in Victoria is now 18 months. Young Australians in acute mental health crisis are being turned away from emergency departments and told to self-manage. Private psychiatry costs $400+ per session with no Medicare rebate reaching realistic levels. The gap between need and available care has never been wider.",
      category: Category.HEALTHCARE,
      location: "Melbourne, VIC",
      state: AustralianState.VIC,
      severity: Severity.CRITICAL,
      status: IssueStatus.IN_PROGRESS,
      upvotes: 1678,
      authorId: vol3.id,
    },
    // TRANSPORT
    {
      title: "Sydney trains: 30% of services cancelled or delayed — daily chaos",
      description:
        "Sydney commuters face a lottery every morning as 30% of train services are cancelled, delayed, or altered without notice. The aging fleet, ongoing industrial action, and infrastructure bottlenecks make the system unreliable. Commuters are reverting to cars, worsening road congestion and emissions. The economic cost of lost productivity is estimated at $2.3 billion annually.",
      category: Category.TRANSPORT,
      location: "Sydney, NSW",
      state: AustralianState.NSW,
      severity: Severity.HIGH,
      status: IssueStatus.VERIFIED,
      upvotes: 1123,
      authorId: cit1.id,
    },
    {
      title: "Zero public transport in outer Melbourne growth corridors",
      description:
        "Suburbs like Clyde North, Wollert, and Donnybrook have tens of thousands of residents with literally no public transport access. Families are trapped in car dependency, spending $15,000+ annually on vehicle costs. Bus routes promised 5 years ago have never materialised. Car-dependent development continues while infrastructure planning remains frozen.",
      category: Category.TRANSPORT,
      location: "Clyde North, VIC",
      state: AustralianState.VIC,
      severity: Severity.HIGH,
      status: IssueStatus.VERIFIED,
      upvotes: 934,
      authorId: vol1.id,
    },
    // EDUCATION
    {
      title: "HECS debt strangling graduates — $100k debt for nursing degree",
      description:
        "Nursing graduates are leaving university with $80,000-$120,000 in HECS debt before earning their first paycheque. With nurses starting at $65,000, debt repayments consume 10%+ of their income for decades. The combination of low wages and high debt is driving graduates overseas or out of the profession entirely — worsening the healthcare workforce crisis.",
      category: Category.EDUCATION,
      location: "Australia-wide",
      state: AustralianState.NSW,
      severity: Severity.HIGH,
      status: IssueStatus.VERIFIED,
      upvotes: 1456,
      authorId: expert1.id,
    },
    {
      title: "Teacher shortage — 1 in 5 classrooms without qualified teacher",
      description:
        "One in five classrooms across Australia now has an unqualified or out-of-field teacher. The teaching workforce crisis has been building for a decade: uncompetitive pay, poor working conditions, and workload intensification have driven mass exits. Rural schools are hardest hit. Student outcomes are declining as a direct result.",
      category: Category.EDUCATION,
      location: "Australia-wide",
      state: AustralianState.QLD,
      severity: Severity.HIGH,
      status: IssueStatus.IN_PROGRESS,
      upvotes: 987,
      authorId: vol3.id,
    },
    // CLIMATE
    {
      title: "Murray-Darling basin crisis — irrigators vs environment",
      description:
        "The Murray-Darling Basin Plan is failing. Water allocations to agriculture continue to drain the basin while downstream communities face water insecurity. Fish kills continue. Wetland ecosystems are collapsing. The political compromise that watered down (literally) the original science-based plan continues to haunt river communities from the High Country to the Murray mouth.",
      category: Category.CLIMATE,
      location: "Murray-Darling Basin",
      state: AustralianState.NSW,
      severity: Severity.HIGH,
      status: IssueStatus.VERIFIED,
      upvotes: 678,
      authorId: vol2.id,
    },
    {
      title: "Perth summer: 14 days above 45°C — heat deaths rising",
      description:
        "Perth experienced 14 days above 45°C in last summer's heatwave, with overnight temperatures failing to drop below 30°C for weeks at a time. Heat-related deaths among the elderly and homeless have risen 40% in 3 years. Many older Perth homes lack insulation or cooling. The health system buckles during heatwaves as vulnerable people flood emergency departments.",
      category: Category.CLIMATE,
      location: "Perth, WA",
      state: AustralianState.WA,
      severity: Severity.HIGH,
      status: IssueStatus.VERIFIED,
      upvotes: 743,
      authorId: vol2.id,
    },
    // SAFETY
    {
      title: "Youth crime surge in Logan — community calls for action",
      description:
        "Logan City is experiencing a surge in youth crime, with car theft, break-ins, and public violence increasing 45% year-on-year. Youth detention is full and rehabilitation programmes have been defunded. Community members report feeling unsafe. The area lacks youth centres, employment pathways, and social support services — conditions that predictably lead to disengagement and crime.",
      category: Category.SAFETY,
      location: "Logan, QLD",
      state: AustralianState.QLD,
      severity: Severity.HIGH,
      status: IssueStatus.REPORTED,
      upvotes: 543,
      authorId: vol3.id,
    },
    // IMMIGRATION
    {
      title: "Skilled migrant visa delays — 3 years for approved applicants",
      description:
        "Skilled migrants with approved visas are waiting 2-3 years for processing to complete, unable to start work in their approved occupation. Australia simultaneously complains of skills shortages in the same fields these people were approved to fill. The Department of Home Affairs backlog exceeds 1 million applications. Employers are desperate; the talent is willing and available; the system blocks both.",
      category: Category.IMMIGRATION,
      location: "Australia-wide",
      state: AustralianState.VIC,
      severity: Severity.HIGH,
      status: IssueStatus.VERIFIED,
      upvotes: 612,
      authorId: expert1.id,
    },
    // GOVERNMENT
    {
      title: "Federal NDIS — 18-month wait while vulnerable Australians suffer",
      description:
        "Australians approved for NDIS support are waiting 18 months to access funding. During that gap, people with severe disability are deteriorating without care. Carers — mostly women — are quitting employment to fill the gap without compensation. The NDIS is structurally sound in design but catastrophically underfunded and mismanaged in delivery.",
      category: Category.GOVERNMENT,
      location: "Australia-wide",
      state: AustralianState.ACT,
      severity: Severity.CRITICAL,
      status: IssueStatus.VERIFIED,
      upvotes: 1345,
      authorId: cit4.id,
    },
  ];

  const issues = await Promise.all(
    issueData.map((d) => prisma.issue.create({ data: d }))
  );

  console.log(`✅ ${issues.length} issues created`);

  // ─── Issue Progress ────────────────────────────────────────────────────────
  const progressData: { issueId: string; stage: ProgressStage; note?: string }[] = [];
  for (const issue of issues) {
    progressData.push({ issueId: issue.id, stage: ProgressStage.REPORTED, note: "Issue submitted by community member." });
    if (issue.status === IssueStatus.VERIFIED || issue.status === IssueStatus.IN_PROGRESS || issue.status === IssueStatus.RESOLVED) {
      progressData.push({ issueId: issue.id, stage: ProgressStage.VERIFIED, note: "Verified by NationLovers moderators." });
    }
    if (issue.status === IssueStatus.IN_PROGRESS) {
      progressData.push({ issueId: issue.id, stage: ProgressStage.SUGGESTIONS_ADDED, note: "Community solutions submitted." });
      progressData.push({ issueId: issue.id, stage: ProgressStage.RANKED, note: "Solutions ranked by community vote." });
    }
  }
  await prisma.issueProgress.createMany({ data: progressData });

  console.log("✅ Issue progress records created");

  // ─── Suggestions ──────────────────────────────────────────────────────────
  const suggestions = await Promise.all([
    // For grocery inflation issue
    prisma.suggestion.create({
      data: {
        issueId: issues[0].id,
        title: "Mandatory supermarket price transparency law",
        description: "Require all major supermarkets to publish weekly unit price data to a government database, making price gouging visible and comparable.",
        solution: "Legislate a Grocery Price Transparency Act requiring Woolworths, Coles, ALDI, and IGA to submit weekly unit pricing data to a public ACCC-administered database. Fund a public-facing comparison app. Create automatic triggers for ACCC investigation when price rises exceed CPI by more than 5%.",
        stepsToImplement: ["Draft Grocery Price Transparency Bill", "ACCC database infrastructure build (6 months)", "Mandatory API reporting for all stores with >50 locations", "Launch public comparison portal", "Annual price gouging audit"],
        costEstimate: "$45M AUD over 3 years",
        feasibilityRating: 8,
        communityImpact: "Could save average family $2,000-$4,000 annually through market competition and informed purchasing.",
        votes: 823,
        authorId: expert1.id,
      },
    }),
    prisma.suggestion.create({
      data: {
        issueId: issues[0].id,
        title: "Expand community food co-ops and direct-from-farm models",
        description: "Fund community-owned food cooperatives that bypass supermarket markups by sourcing directly from farmers.",
        solution: "Provide $500M in low-interest loans to community groups establishing food cooperatives across suburban and regional Australia. Create a direct farm-to-community supply chain marketplace. Fast-track council approvals for co-op retail spaces. Tax incentives for farmers selling direct to community.",
        stepsToImplement: ["$500M Community Food Infrastructure Fund", "Direct-from-farm marketplace platform", "Council planning reform for co-op spaces", "Tax incentive legislation"],
        costEstimate: "$500M AUD initial fund (self-recovering via co-op revenue)",
        feasibilityRating: 7,
        communityImpact: "Direct price reduction of 15-25% for participating households.",
        votes: 456,
        authorId: vol1.id,
      },
    }),
    // For Melbourne rental crisis
    prisma.suggestion.create({
      data: {
        issueId: issues[4].id,
        title: "Build 50,000 modular government-backed homes near transport hubs",
        description: "Fast-track construction of modular, affordable rental housing on government-owned land near train stations and tram stops.",
        solution: "Identify all government-owned land within 800m of train stations across Melbourne. Commission modular construction firms (faster, cheaper, higher quality) to build 50,000 units over 5 years. Set rents at 25% of median income. Partner with superannuation funds for long-term financing at below-market rates.",
        stepsToImplement: ["Government land audit near transport hubs", "Modular construction industry partnership", "Superannuation fund financing agreements", "Fast-track planning approvals via state legislation", "Progressive construction rollout: 10,000 units/year"],
        costEstimate: "$12B AUD over 5 years (partially recovered via rents)",
        feasibilityRating: 9,
        communityImpact: "50,000 Melbourne families directly housed. Market pressure reduction could lower private rents 10-15% across the city.",
        votes: 1245,
        authorId: expert1.id,
      },
    }),
    prisma.suggestion.create({
      data: {
        issueId: issues[4].id,
        title: "Vacancy tax on empty investment properties",
        description: "Annual 5% tax on the unimproved land value of investment properties left vacant for more than 6 months.",
        solution: "Introduce a vacancy tax similar to Melbourne's existing scheme but scaled up statewide and increased to 5% of property value annually for properties vacant >6 months. Use revenue to fund social housing. Create a rental database where tenants can verify vacancy status and report non-compliance.",
        stepsToImplement: ["Vacancy Tax Legislation", "Property registry database integration", "Enforcement agency staffing", "Revenue-to-social-housing pipeline"],
        costEstimate: "Revenue positive — estimated $2B annually from 40,000 vacant properties",
        feasibilityRating: 8,
        communityImpact: "Release of 30,000-50,000 vacant properties into rental market, reducing pressure significantly.",
        votes: 934,
        authorId: cit2.id,
      },
    }),
    // For Brisbane hospital waits
    prisma.suggestion.create({
      data: {
        issueId: issues[8].id,
        title: "700 emergency nurse specialists — 'Urgent Care Surge' program",
        description: "Train and deploy 700 dedicated emergency care nurses with prescribing rights to relieve doctor bottlenecks in EDs.",
        solution: "Fund a 2-year accelerated Nurse Practitioner Emergency Care stream in Queensland's three major nursing universities. Grant provisional prescribing rights on emergency protocols. Deploy 700 graduates to Queensland EDs over 3 years. Pay competitive salaries ($120K-$150K) to retain talent. Measure and publish wait time improvements quarterly.",
        stepsToImplement: ["University partnership agreements", "Accelerated training curriculum design", "Prescribing rights legislation", "Recruitment and retention package", "ED deployment plan with performance metrics"],
        costEstimate: "$890M AUD over 5 years",
        feasibilityRating: 8,
        communityImpact: "Estimated 40% reduction in ED wait times. Prevents 200+ deaths annually from delayed emergency care.",
        votes: 678,
        authorId: expert2.id,
      },
    }),
    // For HECS debt
    prisma.suggestion.create({
      data: {
        issueId: issues[13].id,
        title: "HECS debt cancellation for critical workforce professions",
        description: "Full HECS cancellation after 5 years of full-time employment for nurses, teachers, social workers, and aged care workers.",
        solution: "Legislate a Critical Workforce HECS Forgiveness scheme: after 5 continuous years of registered employment in nursing, teaching, social work, or aged care, all remaining HECS debt is cancelled. Estimated 280,000 Australians would benefit in the first round. Funded through redirecting the existing $4B unused infrastructure contingency.",
        stepsToImplement: ["Eligible profession list legislation", "ATO integration for employment verification", "HECS cancellation processing system", "5-year rolling review of eligible professions"],
        costEstimate: "$3.2B AUD over 5 years",
        feasibilityRating: 9,
        communityImpact: "Retains critical workforce in under-paid essential sectors. Addresses healthcare and education workforce crises simultaneously.",
        votes: 1567,
        authorId: expert1.id,
      },
    }),
    // For Sydney train delays
    prisma.suggestion.create({
      data: {
        issueId: issues[11].id,
        title: "Independent train reliability commissioner with public reporting",
        description: "Establish an independent Train Reliability Commissioner who publishes weekly performance data and has power to recommend penalty payments to affected commuters.",
        solution: "Create the Office of Train Reliability (OTR) with independence from Transport for NSW. Weekly public reporting of on-time performance, cancellations, and causes. Commission authority to fine operators and direct compo to Opal card holders when services fall below 90% on-time threshold. Funded via fines revenue.",
        stepsToImplement: ["Legislation establishing Office of Train Reliability", "Data reporting infrastructure (real-time)", "Compensation calculation and distribution system", "Commissioner recruitment (independent of transport ministry)"],
        costEstimate: "$12M AUD annual operating budget (offset by fines)",
        feasibilityRating: 9,
        communityImpact: "Accountability creates improvement incentives. Direct passenger compensation for poor service.",
        votes: 789,
        authorId: cit4.id,
      },
    }),
    // For mental health
    prisma.suggestion.create({
      data: {
        issueId: issues[10].id,
        title: "1,000 community mental health workers — non-clinical frontline",
        description: "Fund 1,000 non-clinical community mental health workers embedded in GPs, schools, and community centres across Victoria.",
        solution: "A 'Mental Health First Responder' program: train 1,000 community mental health workers (not requiring psychiatry degrees) in evidence-based early intervention. Embed them in GP clinics, secondary schools, community centres, and neighbourhood houses. Primary role: early identification, peer support, GP referral coordination. Secondary role: reducing psychiatry waitlist by preventing escalation.",
        stepsToImplement: ["Training curriculum development (12-month certification)", "University partnership for delivery", "Placement mapping across Victoria", "Supervision structure with qualified psychiatrists", "5-year outcome measurement framework"],
        costEstimate: "$280M AUD over 5 years",
        feasibilityRating: 9,
        communityImpact: "Early intervention prevents 30-40% of cases from escalating to crisis requiring psychiatry. Frees psychiatry capacity for those who need it most.",
        votes: 934,
        authorId: vol3.id,
      },
    }),
    // For NDIS delays
    prisma.suggestion.create({
      data: {
        issueId: issues[19].id,
        title: "NDIS emergency access in 30 days — while full plan is processed",
        description: "Legislate a 30-day Emergency NDIS Access right: approved participants receive 80% of their expected support immediately while the full plan is being finalised.",
        solution: "Amend the NDIS Act to create an 'Emergency Access' tier: once approval is granted, participants access an automatic support package within 30 days based on their disability category. Full plan finalisation can take longer, but basic needs are met immediately. Fund via pre-approved package types rather than individual assessment.",
        stepsToImplement: ["NDIS Act amendment", "Category-based emergency package design", "NDIA system updates for rapid provisioning", "Provider notification and onboarding", "Full plan parallel processing"],
        costEstimate: "$1.8B AUD year 1 (one-off surge cost due to backlog), $400M ongoing",
        feasibilityRating: 8,
        communityImpact: "Immediate relief for 180,000+ Australians waiting. Prevents deterioration while full assessment occurs.",
        votes: 1123,
        authorId: cit4.id,
      },
    }),
    // For GP shortage
    prisma.suggestion.create({
      data: {
        issueId: issues[9].id,
        title: "HECS-free medical degree for GPs who commit to 10 years rural",
        description: "Fund fully subsidised medical degrees for students who commit to working as rural GPs for 10 years after graduation.",
        solution: "The 'Rural GP Bond Scholarship': medical students who sign a 10-year rural GP commitment receive fully funded medical school (zero HECS). Breaching the commitment requires partial repayment on a sliding scale. Annual intake of 500 students nationally. Target: close the rural GP shortage within 15 years.",
        stepsToImplement: ["Scholarship legislation and funding", "University quota expansion for rural-pathway students", "Legal bond framework and breach consequences", "Rural GP training pathway enhancements", "Annual cohort tracking"],
        costEstimate: "$2.1B AUD over 10 years",
        feasibilityRating: 8,
        communityImpact: "5,000 new rural GPs in 15 years. Closes 80% of current rural GP shortfall.",
        votes: 743,
        authorId: expert2.id,
      },
    }),
  ]);

  console.log(`✅ ${suggestions.length} suggestions created`);

  // ─── Comments ─────────────────────────────────────────────────────────────
  const comments = await Promise.all([
    prisma.comment.create({
      data: {
        content: "This is exactly what my family is going through. We're skipping the fruit and veg section now — too expensive. Something has to change.",
        authorId: cit1.id,
        issueId: issues[0].id,
      },
    }),
    prisma.comment.create({
      data: {
        content: "The ACCC has the power to investigate right now but is chronically underfunded. Before new legislation, let's properly fund the existing watchdog.",
        authorId: expert1.id,
        issueId: issues[0].id,
      },
    }),
    prisma.comment.create({
      data: {
        content: "I've applied for 67 rental properties in the last 4 months. I have a stable job, good references, and I still can't get a place. This system is broken.",
        authorId: cit2.id,
        issueId: issues[4].id,
      },
    }),
    prisma.comment.create({
      data: {
        content: "The modular housing suggestion is excellent. Singapore does this at scale. Australia has the land, the capital, and the need — what's missing is political will.",
        authorId: expert1.id,
        issueId: issues[4].id,
      },
    }),
    prisma.comment.create({
      data: {
        content: "As a nurse at Royal Brisbane, I can confirm this is accurate and actually undersells how bad it is. We had a 14-hour wait last Tuesday night. I cried on my break.",
        authorId: expert2.id,
        issueId: issues[8].id,
      },
    }),
    prisma.comment.create({
      data: {
        content: "The modular housing idea for Melbourne is brilliant. We need to move faster than traditional construction. Japan and Scandinavia have proven this works at city scale.",
        authorId: vol1.id,
        issueId: issues[4].id,
      },
    }),
    prisma.comment.create({
      data: {
        content: "My daughter is a first-year nurse with $94,000 in HECS debt. She's already asking about opportunities in the UK and Canada. Australia will lose her if nothing changes.",
        authorId: cit3.id,
        issueId: issues[13].id,
      },
    }),
    prisma.comment.create({
      data: {
        content: "The community mental health worker idea has strong evidence behind it. Ireland ran a similar scheme and reduced ED mental health presentations by 28% in 3 years.",
        authorId: expert2.id,
        issueId: issues[10].id,
      },
    }),
  ]);

  // A couple of replies
  await Promise.all([
    prisma.comment.create({
      data: {
        content: "Agreed on the ACCC — they need $200M extra at minimum to pursue supermarket pricing properly. The transparency law would actually give them the data they need to act.",
        authorId: vol1.id,
        issueId: issues[0].id,
        parentId: comments[1].id,
      },
    }),
    prisma.comment.create({
      data: {
        content: "67 properties — that's horrifying. I'm at 34 and about to give up. How do you keep going?",
        authorId: cit1.id,
        issueId: issues[4].id,
        parentId: comments[2].id,
      },
    }),
  ]);

  console.log("✅ Comments created");

  // ─── Votes ─────────────────────────────────────────────────────────────────
  // Distribute votes across issues (using different users to avoid unique constraint)
  const voteUsers = [admin, expert1, expert2, vol1, vol2, vol3, cit1, cit2, cit3, cit4];
  const topIssues = issues.slice(0, 10);

  const votePromises = [];
  for (let i = 0; i < topIssues.length; i++) {
    const issue = topIssues[i];
    // Each user votes on different issues to avoid constraint violations
    const voter = voteUsers[i % voteUsers.length];
    votePromises.push(
      prisma.vote.create({
        data: {
          userId: voter.id,
          issueId: issue.id,
          type: "UP",
        },
      }).catch(() => {}) // ignore duplicate constraint errors during seed
    );
  }
  await Promise.all(votePromises);

  console.log("✅ Votes created");
  console.log("\n🇦🇺 NationLovers database seeded successfully!");
  console.log("\nAdmin credentials:");
  console.log("  Email: admin@nationlovers.au");
  console.log("  Password: Admin1234!");
  console.log("\nTest user credentials (all use Password123!):");
  console.log("  Expert: sarah.chen@expert.au");
  console.log("  Volunteer: priya.sharma@vol.au");
  console.log("  Citizen: michael.obrien@citizen.au");
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
