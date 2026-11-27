/* ─── SOVEREIGN SOLUTIONS INTERACTIVE COMMAND SANDBOX & ESTIMATOR ─── */
/* Live 3D Natural-Earth Globe + Streaming Citation-Locked Private RAG Simulator + Architecture & Scope Builder */

// Paste your recorded 90-second Loom embed URL here (e.g. 'https://www.loom.com/embed/YOUR_ID')
// to automatically swap the Walkthrough modal from Interactive Tour Mode into your live Loom video player.
const SOV_DEMO_LOOM_URL = '';

(function () {
  const DEG = Math.PI / 180;

  const INDUSTRIES = [
    {
      id: 'logistics',
      code: '01',
      label: 'Logistics & Supply Chain',
      short: 'Logistics',
      color: '#00f5ff',
      rgb: [0, 245, 255],
      pilot: '3–5 Weeks',
      title: 'Live Fleet, Port & Route Risk Command',
      buyers: 'VP Supply Chain · Maritime Operators · 3PLs · Global Procurement',
      layerLabel: 'SAP TMS + MARINETRAFFIC AIS + UKMTO CORRIDORS',
      indexLabel: 'PRIVATE VPC · SAP TMS + 1,420 CARRIER SLAs + MARITIME FEEDS',
      targetLat: 22.0,
      targetLon: 44.0,
      connectors: ['SAP TMS / Oracle ERP', 'AIS Vessel Transponders', 'Carrier SLA PDFs', 'UKMTO & Port Bulletins'],
      pins: [
        { id: 'redsea', lat: 13.1, lon: 43.3, label: 'BAB EL-MANDEB · S4', sub: '3 Containers Inside 150km Zone', color: '#ff2244' },
        { id: 'suez', lat: 29.97, lon: 32.53, label: 'SUEZ TRANSIT · S3', sub: 'GNSS Spoofing Advisory', color: '#ff6b00' },
        { id: 'rotterdam', lat: 51.92, lon: 4.48, label: 'ROTTERDAM HUB', sub: 'ETA +4.2d Cape Reroute', color: '#00f5ff' },
        { id: 'singapore', lat: 1.35, lon: 103.82, label: 'SINGAPORE PORT', sub: 'Berth Utilization 91%', color: '#00ff88' }
      ],
      arcs: [
        { from: [1.35, 103.82], to: [13.1, 43.3], color: '#ff6b00' },
        { from: [13.1, 43.3], to: [29.97, 32.53], color: '#ff2244' },
        { from: [29.97, 32.53], to: [51.92, 4.48], color: '#00f5ff' }
      ],
      prompts: [
        {
          q: 'Which Q4 container shipments pass within 150 km of active Red Sea interference, and what is our backup carrier clause?',
          answer: '<strong>3 active containers</strong> (<code>MAERSK-882</code>, <code>MSC-419</code>, <code>CMA-204</code>) intersect active Bab el-Mandeb GNSS & maritime advisories within the next 36 hours {{1}}. Under <strong>Master Freight Agreement §14.2</strong>, Cape of Good Hope rerouting triggers zero SLA penalty when UKMTO advisories exceed Level 3 {{2}}, adding an estimated <strong>+4.2 transit days</strong> into Rotterdam {{3}}.',
          citations: [
            { num: 1, title: 'SAP TMS Live Feed + Sovereign Maritime Alert #8841', meta: 'Real-Time SQL Sync · Updated 4m ago · Score 0.97', pinId: 'redsea', excerpt: 'Vessels MAERSK-882 (42 FEU), MSC-419 (28 FEU), and CMA-204 (31 FEU) projected within 118 km of UKMTO Advisory 094/26 corridor.' },
            { num: 2, title: 'Master_Freight_Agreement_2026.pdf · §14.2 (p. 14)', meta: 'Private SharePoint Vault · RBAC: SUPPLY_CHAIN_L2 · Score 0.95', pinId: 'suez', excerpt: '"Force Majeure Corridor Diversion: Carrier penalty clauses are waived automatically upon UKMTO Security Level 3+ or Admiralty war-risk surcharge issuance."' },
            { num: 3, title: 'Rotterdam_Port_Buffer_Model_Q4.xlsx · Sheet 2', meta: 'Internal Procurement ERP · Verified · Score 0.92', pinId: 'rotterdam', excerpt: 'Cape rerouting baseline adds 4.2 days mean transit time; Rotterdam terminal buffer stock covers 7.0 days for SKU Tier-A.' }
          ]
        },
        {
          q: 'Compare demurrage exposure across Rotterdam vs. Singapore if customs hold extends 72 hours.',
          answer: '<strong>Rotterdam Gate-4</strong> carries <strong>$18,400/day</strong> combined reefer demurrage exposure across 14 boxes {{1}}, whereas <strong>Singapore PSA Berth-9</strong> remains under free-time allowance for another 96 hours under our 2026 Tier-1 tariff {{2}}.',
          citations: [
            { num: 1, title: 'Rotterdam_Tariff_Schedule_2026.pdf (p. 6)', meta: 'Internal Logistics Vault · Score 0.96', pinId: 'rotterdam', excerpt: 'Reefer container demurrage escalates to EUR 1,210/unit/day after Day 3; 14 active cold-chain units currently on Day 2.' },
            { num: 2, title: 'PSA_Singapore_Enterprise_SLA.pdf · Annex B', meta: 'Private Procurement Vault · Score 0.94', pinId: 'singapore', excerpt: 'Enterprise volume tier grants 7 calendar days port storage free-time prior to demurrage accrual.' }
          ]
        },
        {
          q: 'Draft a 3-bullet executive reroute brief for our Tuesday ops standup with source links.',
          answer: '<strong>1) Immediate Action:</strong> Divert <code>MAERSK-882</code> & <code>CMA-204</code> via Cape before Aden waypoint {{1}}. <strong>2) Financial Impact:</strong> Zero SLA liquidated damages under §14.2; bunker surcharge capped at 6.5% {{2}}. <strong>3) Customer Comms:</strong> Rotterdam Tier-A inventory holds 7 days buffer—no factory line stoppage projected {{3}}.',
          citations: [
            { num: 1, title: 'Live AIS Vessel Telemetry + UKMTO Feed', meta: 'Streaming Connector · Score 0.98', pinId: 'redsea', excerpt: 'Aden corridor diversion decision window closes in 11 hours 20 minutes.' },
            { num: 2, title: 'Master_Freight_Agreement_2026.pdf · §14.2 & Annex C', meta: 'Private SharePoint Vault · Score 0.95', pinId: 'suez', excerpt: 'Emergency bunker adjustment factor capped at 6.5% for contracted annual volume.' },
            { num: 3, title: 'ERP Safety Stock Ledger · EU-West', meta: 'SAP Live Mirror · Score 0.93', pinId: 'rotterdam', excerpt: 'Current EU-West warehouse safety buffer: 7.0 operating days across top 40 SKUs.' }
          ]
        }
      ]
    },
    {
      id: 'legal',
      code: '02',
      label: 'Legal & Compliance',
      short: 'Legal & AI',
      color: '#b366ff',
      rgb: [179, 102, 255],
      pilot: '2–4 Weeks',
      title: 'Cross-Border Regulatory & Contract Intelligence',
      buyers: 'General Counsel · Law Firms · Chief Compliance Officers · Privacy Teams',
      layerLabel: '60+ STATUTORY PROFILES + CLIENT AUDIT REGISTER',
      indexLabel: 'PRIVATE VPC · IMANAGE DMS + EUR-LEX + CA SB 53 + AUDIT SQL',
      targetLat: 48.5,
      targetLon: 10.0,
      connectors: ['iManage / NetDocuments', 'Sovereign 60+ Laws DB', 'Client Compliance Register', 'EUR-Lex & State Feeds'],
      pins: [
        { id: 'brussels', lat: 50.85, lon: 4.35, label: 'BRUSSELS · EU AI ACT', sub: 'Art. 73 Incident Clocks Active', color: '#b366ff' },
        { id: 'sacramento', lat: 38.58, lon: -121.49, label: 'CALIFORNIA · SB 53', sub: '24h / 15d CalOES Threshold', color: '#00f5ff' },
        { id: 'london', lat: 51.51, lon: -0.13, label: 'LONDON · UK AISI', sub: 'Sectoral Safety Audits', color: '#00ff88' },
        { id: 'seoul', lat: 37.56, lon: 126.98, label: 'SEOUL · AI BASIC ACT', sub: 'Local Rep Mandate Active', color: '#ffd22e' }
      ],
      arcs: [
        { from: [50.85, 4.35], to: [38.58, -121.49], color: '#b366ff' },
        { from: [50.85, 4.35], to: [51.51, -0.13], color: '#00f5ff' },
        { from: [50.85, 4.35], to: [37.56, 126.98], color: '#ffd22e' }
      ],
      prompts: [
        {
          q: 'Flag which client AI deployments in Germany and California face mandatory incident-reporting deadlines under 15 days.',
          answer: '<strong>4 active client deployments</strong> fall under binding sub-15-day statutory clocks: <strong>EU AI Act Art. 73</strong> (≤2 days critical infra / ≤15 days standard) {{1}} and <strong>California SB 53</strong> (24h imminent harm / 15d standard to CalOES) {{2}}. Your internal audit register shows <strong>2 deployments missing signed incident SOPs</strong> {{3}}.',
          citations: [
            { num: 1, title: 'Regulation (EU) 2024/1689 · Article 73(2)–(4)', meta: 'Sovereign Statutory Corpus · Verified · Score 0.98', pinId: 'brussels', excerpt: 'Providers of high-risk AI systems shall report serious incidents immediately and no later than 15 days (2 days for widespread critical infrastructure disruption).' },
            { num: 2, title: 'California Senate Bill 53 · §22757.12', meta: 'Sovereign Statutory Corpus · Verified · Score 0.96', pinId: 'sacramento', excerpt: 'Frontier developers must report critical safety incidents to CalOES within 15 days, or within 24 hours where imminent risk of death or serious physical injury exists.' },
            { num: 3, title: 'Client_AI_Compliance_Register.sql · Rows #41, #58', meta: 'Internal Audit DB · RBAC: LEGAL_PARTNER · Score 0.95', pinId: 'london', excerpt: 'Deployments DE-HR-04 (Munich) and US-CA-11 (San Jose) status: Incident Escalation Runbook = PENDING_SIGNOFF.' }
          ]
        },
        {
          q: 'Compare statutory local-representative requirements between the EU AI Act and South Korea AI Basic Act.',
          answer: 'Both statutes require non-domestic high-impact AI providers to appoint a <strong>designated in-jurisdiction legal representative</strong> before market placement: <strong>EU AI Act Art. 22 / Art. 54</strong> {{1}} and <strong>South Korea AI Basic Act Art. 36</strong> (effective Jan 2026) {{2}}.',
          citations: [
            { num: 1, title: 'Regulation (EU) 2024/1689 · Art. 22 & Art. 54', meta: 'Sovereign Statutory Matrix · Score 0.97', pinId: 'brussels', excerpt: 'Prior to making a high-risk or GPAI model available on the Union market, providers established in third countries shall appoint an authorised representative in the Union.' },
            { num: 2, title: 'Republic of Korea AI Basic Act · Art. 36 & Decree 36053', meta: 'Sovereign Statutory Matrix · Score 0.95', pinId: 'seoul', excerpt: 'Overseas AI operators exceeding user/revenue thresholds must designate a domestic agent responsible for regulatory filings and safety notifications.' }
          ]
        },
        {
          q: 'Which active vendor DPAs lack our updated 2026 zero-training AI addendum?',
          answer: 'Scanning 184 vendor contracts in iManage identified <strong>3 active Tier-1 vendors</strong> operating on legacy 2024 DPAs without explicit zero-model-training & RAG subprocessor clauses {{1}}, including 1 EU-hosted analytics supplier subject to Art. 26 deployer obligations {{2}}.',
          citations: [
            { num: 1, title: 'iManage_DPA_Repository · Audit Query #19', meta: 'Private Legal DMS · Score 0.96', pinId: 'london', excerpt: 'Vendors VND-104, VND-219, and VND-308 match clause_version < 2026.1; missing Section 8.4 Zero-Training Covenant.' },
            { num: 2, title: 'EU AI Act Art. 26 Deployer Obligations Checklist', meta: 'Internal Practice Memo · Score 0.93', pinId: 'brussels', excerpt: 'Deployers must verify input data governance and human oversight documentation across all third-party AI subprocessors.' }
          ]
        }
      ]
    },
    {
      id: 'finance',
      code: '03',
      label: 'Finance & Insurance',
      short: 'Finance',
      color: '#ffd22e',
      rgb: [255, 210, 46],
      pilot: '4–6 Weeks',
      title: 'Macro Geopolitical Risk & Underwriting Radar',
      buyers: 'Macro Hedge Funds · Specialty Reinsurers · Credit Risk · Family Offices',
      layerLabel: 'PORTFOLIO ASSET OVERLAY + BIS EXPORT CONTROLS + SANCTIONS',
      indexLabel: 'PRIVATE VPC · IC MEMO VAULT + PORTFOLIO SQL + BIS / OFAC FEEDS',
      targetLat: 31.0,
      targetLon: 112.0,
      connectors: ['Portfolio Holdings DB', 'Investment Committee Vault', 'BIS / OFAC / Trade Feeds', 'Catastrophe & Weather APIs'],
      pins: [
        { id: 'taiwan', lat: 24.4, lon: 119.5, label: 'HSINCHU · FAB CLUSTER', sub: '3 Portfolio Holdings Exposed', color: '#ffd22e' },
        { id: 'zurich', lat: 47.37, lon: 8.54, label: 'ZURICH · REINSURANCE DESK', sub: 'IC Downside Hedge Trigger', color: '#00f5ff' },
        { id: 'dc', lat: 38.9, lon: -77.04, label: 'WASHINGTON · BIS NOTICE', sub: 'Export Control Update S4', color: '#ff2244' },
        { id: 'tokyo', lat: 35.68, lon: 139.69, label: 'TOKYO · LITHOGRAPHY', sub: '16-Week Lead Time Alert', color: '#ff6b00' }
      ],
      arcs: [
        { from: [38.9, -77.04], to: [24.4, 119.5], color: '#ff2244' },
        { from: [35.68, 139.69], to: [24.4, 119.5], color: '#ffd22e' },
        { from: [24.4, 119.5], to: [47.37, 8.54], color: '#00f5ff' }
      ],
      prompts: [
        {
          q: 'Summarize our portfolio exposure to new semiconductor export controls announced this month with our IC thesis notes.',
          answer: '<strong>3 portfolio holdings</strong> (6.8% combined NAV) source advanced packaging & lithography components via hubs covered by this week\'s BIS notice {{1}}. Per your <strong>Q3 Investment Committee Memo</strong>, automatic collar hedging triggers if component lead times exceed 14 weeks—currently tracking at <strong>16 weeks</strong> {{2}} {{3}}.',
          citations: [
            { num: 1, title: 'BIS Export Control Advisory + Sovereign Trade Feed', meta: 'Live Regulatory Signal · Score 0.97', pinId: 'dc', excerpt: 'Expanded licensing thresholds for sub-3nm lithography maintenance and high-bandwidth memory packaging shipments across East Asian hubs.' },
            { num: 2, title: 'IC_Semiconductor_Thesis_Q3_2026.pdf (p. 9)', meta: 'Private Research Vault · RBAC: PM_ANALYST · Score 0.96', pinId: 'zurich', excerpt: '"Risk Trigger: Initiate 40% downside put spread on Semi-Sleeve if verified supplier lead times breach 14 weeks following sovereign export notice."' },
            { num: 3, title: 'SupplyChain_Fab_Tracker_APAC.csv', meta: 'Internal Research DB · Score 0.93', pinId: 'taiwan', excerpt: 'CoWoS packaging queue extended from 12.5 weeks to 16.0 weeks across Hsinchu and Kyushu partner fabs.' }
          ]
        },
        {
          q: 'Which insured marine & property binders have overlapping exposure inside the current storm & sanctions zones?',
          answer: '<strong>7 specialty marine policies</strong> ($42.5M aggregate limit) overlap elevated Red Sea / Strait of Hormuz war-risk bands {{1}}, while <strong>2 APAC fab property binders</strong> sit inside updated seismic & geopolitical accumulation caps {{2}}.',
          citations: [
            { num: 1, title: 'Specialty_Marine_Binder_SQL · Active Exposure', meta: 'Underwriting Core DB · Score 0.96', pinId: 'zurich', excerpt: '7 active hull & cargo policies transiting high-risk maritime exclusion corridors require war-risk endorsement re-pricing.' },
            { num: 2, title: 'APAC_Property_Accumulation_2026.pdf', meta: 'Actuarial Vault · Score 0.94', pinId: 'taiwan', excerpt: 'Hsinchu & Tainan industrial park exposure currently at 88% of Board-approved single-event PML ceiling.' }
          ]
        },
        {
          q: 'Pull our historical macro memo on sovereign sanctions spillover from 2024 vs. current telemetry.',
          answer: 'Your <strong>2024 Sanctions Spillover Playbook</strong> estimated a 19-day equity repricing lag following secondary-sanctions designations {{1}}. Sovereign\'s live feed logged <strong>4 matching secondary-tier filings</strong> in the last 72 hours across energy & dual-use electronics {{2}}.',
          citations: [
            { num: 1, title: 'Macro_Sanctions_Spillover_2024.pdf (p. 22)', meta: 'Private IC Archive · Score 0.95', pinId: 'zurich', excerpt: 'Historical event study (n=38 notices): median equity repricing completes in 19 trading days after initial Federal Register notice.' },
            { num: 2, title: 'Sovereign Live Sanctions & Export Stream', meta: 'Real-Time Verified Feed · Score 0.97', pinId: 'dc', excerpt: '4 newly designated intermediary logistics & electronics entities flagged across BIS/OFAC updates.' }
          ]
        }
      ]
    },
    {
      id: 'energy',
      code: '04',
      label: 'Energy & Infra',
      short: 'Energy',
      color: '#ff6b00',
      rgb: [255, 107, 0],
      pilot: '4–6 Weeks',
      title: 'Asset, Grid & Corridor Operational Intelligence',
      buyers: 'Energy Majors · Utilities · Mining Operators · Grid Resilience Teams',
      layerLabel: 'SCADA ALERTS + SUBSEA CORRIDORS + NASA EONET TRACKS',
      indexLabel: 'PRIVATE VPC · SITE REGISTRY + HSE MANUALS + NOAA / SCADA FEEDS',
      targetLat: 42.0,
      targetLon: -25.0,
      connectors: ['SCADA / Telemetry Feeds', 'Site Asset Registry', 'HSE & Shutdown Manuals', 'NOAA / EONET Weather'],
      pins: [
        { id: 'sabine', lat: 29.73, lon: -93.87, label: 'TERMINAL WEST-04', sub: '48h High-Wind Cone Alert', color: '#ff6b00' },
        { id: 'northsea', lat: 57.5, lon: 2.2, label: 'NORTH SEA PLATFORM', sub: 'Subsea Cable Patrol Active', color: '#00f5ff' },
        { id: 'baltic', lat: 59.4, lon: 21.8, label: 'BALTIC INTERCONNECT', sub: 'Anomalous Vessel Loiter S4', color: '#ff2244' }
      ],
      arcs: [
        { from: [57.5, 2.2], to: [59.4, 21.8], color: '#ff2244' },
        { from: [57.5, 2.2], to: [29.73, -93.87], color: '#ff6b00' }
      ],
      prompts: [
        {
          q: 'Check which coastal terminals sit inside the 72-hour storm track and pull our Level-2 shutdown checklist.',
          answer: '<strong>Terminal West-04 (Gulf Coast)</strong> enters the NOAA/EONET Category-2 wind cone within <strong>48 hours</strong> {{1}}. Per <strong>HSE Protocol OPS-77</strong>, initiate manifold pressure isolation at T-24h, lock down LNG loading arms, and issue written dispatch notice to regional grid control {{2}}.',
          citations: [
            { num: 1, title: 'NASA EONET / NOAA Cone + Internal Site Registry', meta: 'Geospatial Corridor Intersect · Score 0.98', pinId: 'sabine', excerpt: 'Site WEST-04 (29.73°N, 93.87°W) intersects 55 kt sustained wind envelope at T+46 hours.' },
            { num: 2, title: 'HSE_Operations_Manual_OPS-77.pdf · §4.3 (p. 31)', meta: 'Private Operations Vault · Score 0.97', pinId: 'sabine', excerpt: 'Level-2 Tropical Cyclone Shutdown: (1) Depressurize coastal transfer headers at T-24h; (2) Secure mooring arms; (3) Notify ISO Grid Desk.' }
          ]
        },
        {
          q: 'Flag anomalous maritime loitering within 10 km of our Baltic and North Sea subsea energy cables.',
          answer: '<strong>1 unscheduled vessel track</strong> slowed below 2.5 knots for 4.5 hours directly over <strong>Baltic Interconnect Segment B-12</strong> {{1}}. Automatic maritime patrol dispatch & subsea integrity SOP <strong>GRID-SUB-04</strong> has been matched {{2}}.',
          citations: [
            { num: 1, title: 'Sovereign Subsea Cable Layer + AIS Anomaly Feed', meta: 'Live Telemetry · Score 0.96', pinId: 'baltic', excerpt: 'Track MMSI-REDACTED exhibited anchor-drag speed profile (<2.5 kts) within 1.8 km of Segment B-12.' },
            { num: 2, title: 'Subsea_Asset_Protection_SOP_GRID-SUB-04.pdf', meta: 'Private Infra Vault · Score 0.94', pinId: 'northsea', excerpt: 'Escalate vessels loitering >3h within 5 km of HVDC cables to national coastguard liaison and run OTDR fiber continuity sweep.' }
          ]
        },
        {
          q: 'Summarize maintenance deferral risks across our European grid substations for next month.',
          answer: 'Cross-referencing SCADA thermal logs with maintenance tickets highlights <strong>2 North Sea onshore converter stations</strong> overdue for transformer bushing inspection by >21 days {{1}}, coinciding with peak winter reserve demand {{2}}.',
          citations: [
            { num: 1, title: 'SCADA_Maintenance_Backlog_Q4.sql', meta: 'Private Engineering DB · Score 0.95', pinId: 'northsea', excerpt: 'Stations NS-CONV-02 and NS-CONV-05 exceeded 180-day preventive thermal inspection interval.' },
            { num: 2, title: 'ENTSO-E Winter Outlook + Regional Demand Feed', meta: 'Verified Grid Feed · Score 0.92', pinId: 'baltic', excerpt: 'Projected cold snap raises Northern European peak reserve stress by +11% over 10-year norm.' }
          ]
        }
      ]
    },
    {
      id: 'cyber',
      code: '05',
      label: 'Cyber & Security',
      short: 'Cyber / SOC',
      color: '#ff2244',
      rgb: [255, 34, 68],
      pilot: '3–5 Weeks',
      title: 'Geo-Correlated Cyber & Incident Playbook Hub',
      buyers: 'CISOs · Threat Intel Leads · Physical Security Directors · Defense Analysts',
      layerLabel: 'CISA KEV + OONI/IODA OUTAGES + PRIVATE CMDB & SIEM',
      indexLabel: 'AIR-GAPPED / VPC · INTERNAL CMDB + IR PLAYBOOKS + CVE FEEDS',
      targetLat: 50.0,
      targetLon: 18.0,
      connectors: ['Internal CMDB / Asset DB', 'SIEM / SOAR Alerts', 'IR Playbooks (PDF/Wiki)', 'CISA KEV & OONI/IODA'],
      pins: [
        { id: 'frankfurt', lat: 50.11, lon: 8.68, label: 'EU NODE · VLAN-44', sub: '2 Nodes Match Active RCE', color: '#ff2244' },
        { id: 'kyiv', lat: 50.45, lon: 30.52, label: 'KYIV · TELECOM S5', sub: 'BGP & EW Jamming Spike', color: '#ff6b00' },
        { id: 'london', lat: 51.51, lon: -0.13, label: 'LONDON SOC HQ', sub: 'Playbook SEC-09 Ready', color: '#00f5ff' }
      ],
      arcs: [
        { from: [50.45, 30.52], to: [50.11, 8.68], color: '#ff2244' },
        { from: [50.11, 8.68], to: [51.51, -0.13], color: '#00f5ff' }
      ],
      prompts: [
        {
          q: 'Correlate today\'s S4+ zero-day advisories against our production asset inventory and list immediate containment steps.',
          answer: '<strong>1 critical match detected:</strong> Active Cacti RCE PoC impacts <strong>2 EU monitoring nodes</strong> (<code>eu-mon-03</code>, <code>eu-mon-07</code>) registered in your CMDB {{1}}. Execute <strong>IR Playbook SEC-09</strong>: isolate subnet <code>VLAN-44</code>, rotate SNMP v3 credentials, and deploy hotfix within 4 hours {{2}}.',
          citations: [
            { num: 1, title: 'CISA KEV Feed + Internal Production CMDB', meta: 'Automated Asset Match · Score 0.99', pinId: 'frankfurt', excerpt: 'Nodes eu-mon-03 and eu-mon-07 (Frankfurt DC-2) running vulnerable telemetry collector build prior to patched release.' },
            { num: 2, title: 'SOC_Incident_Playbook_SEC-09.md · §2 Containment', meta: 'Air-Gapped Security Wiki · Score 0.97', pinId: 'london', excerpt: 'Priority-1 RCE Containment: (1) Apply ACL quarantine to VLAN-44; (2) Force-rotate SNMP/API secrets; (3) Capture memory snapshot prior to reboot.' }
          ]
        },
        {
          q: 'Are any regional telecom blackouts or BGP anomalies affecting our Eastern European field teams?',
          answer: 'OONI & IODA probes confirm a <strong>34% connectivity drop</strong> across two regional fiber transit corridors over the past 6 hours {{1}}. Field continuity plan <strong>COMMS-ALT-02</strong> authorizes automatic failover to pre-provisioned satellite terminals {{2}}.',
          citations: [
            { num: 1, title: 'Sovereign OONI/IODA Outage Telemetry', meta: 'Live Network Probes · Score 0.96', pinId: 'kyiv', excerpt: 'Sustained BGP route withdrawals and packet-loss spike recorded across eastern regional ASNs.' },
            { num: 2, title: 'Field_Security_Comms_SOP_ALT-02.pdf', meta: 'Private Security Vault · Score 0.94', pinId: 'london', excerpt: 'When terrestrial transit availability falls below 70% for >2 hours, regional teams switch primary check-ins to encrypted satcom.' }
          ]
        },
        {
          q: 'Generate a board-ready cyber threat posture summary citing only verified internal & KEV records.',
          answer: '<strong>Executive Posture (AMBER):</strong> 2 EU monitoring hosts require 4-hour patching under SEC-09 (zero lateral movement detected in SIEM) {{1}}; Eastern Europe satcom failover verified operational {{2}}; zero customer PII systems exposed {{3}}.',
          citations: [
            { num: 1, title: 'CMDB + SIEM Correlation Log #9912', meta: 'Zero-Retention VPC · Score 0.97', pinId: 'frankfurt', excerpt: 'EDR telemetry confirms zero outbound anomalous beacons from VLAN-44.' },
            { num: 2, title: 'OONI/IODA + Field Comms Status', meta: 'Live Verification · Score 0.95', pinId: 'kyiv', excerpt: 'All 12 field terminals checked in via backup encrypted link within SLA.' },
            { num: 3, title: 'Data_Segmentation_Audit_2026.pdf', meta: 'Internal CISO Vault · Score 0.94', pinId: 'london', excerpt: 'Monitoring subnet VLAN-44 is strictly segregated from production customer databases.' }
          ]
        }
      ]
    },
    {
      id: 'ai',
      code: '06',
      label: 'AI & Cloud',
      short: 'AI & Compute',
      color: '#00ff88',
      rgb: [0, 255, 136],
      pilot: '3–4 Weeks',
      title: 'Compute Footprint, Safety & Policy Observatory',
      buyers: 'Frontier AI Policy Teams · Cloud Trust & Safety · Data Center Developers',
      layerLabel: '6,000+ FACILITIES + EPOCH MEGACLUSTERS + MODEL CARDS',
      indexLabel: 'PRIVATE VPC · MODEL CARDS + COMPUTE REGISTRY + 60+ AI LAWS',
      targetLat: 39.0,
      targetLon: -20.0,
      connectors: ['Internal Model Cards', 'Epoch AI Compute Telemetry', '6,000+ Facility Registry', 'Global AISI Safety Filings'],
      pins: [
        { id: 'ashburn', lat: 39.04, lon: -77.49, label: 'N. VIRGINIA · GW HUB', sub: 'Grid Queue & Export Rules', color: '#00ff88' },
        { id: 'dublin', lat: 53.35, lon: -6.26, label: 'DUBLIN · EU AI OFFICE', sub: 'GPAI Code of Practice', color: '#00f5ff' },
        { id: 'singapore', lat: 1.35, lon: 103.82, label: 'SINGAPORE · IMDA', sub: 'Agentic Red-Team Eval', color: '#b366ff' }
      ],
      arcs: [
        { from: [39.04, -77.49], to: [53.35, -6.26], color: '#00ff88' },
        { from: [53.35, -6.26], to: [1.35, 103.82], color: '#00f5ff' }
      ],
      prompts: [
        {
          q: 'Compare regulatory onboarding requirements for deploying our next frontier model across the EU, UK, South Korea, and Singapore.',
          answer: '<strong>EU & South Korea</strong> require binding GPAI technical documentation, systemic-risk assessments, and local representative filings prior to launch {{1}}; <strong>UK AISI & Singapore IMDA</strong> prioritize pre-deployment red-team evaluations—mapping 92% cleanly to our internal <strong>Model Card v4.2</strong> with 1 open CBRN eval gap {{2}}.',
          citations: [
            { num: 1, title: 'Sovereign 60+ Jurisdictions Statutory Matrix', meta: 'EU AI Act Ch. V + KR Art. 32 · Score 0.98', pinId: 'dublin', excerpt: 'Systemic-risk GPAI models (>10^25 FLOPs) require EU AI Office notification, adversarial testing summary, and copyright compliance policy.' },
            { num: 2, title: 'Internal_Model_Card_v4.2_Draft.pdf · §6 Safety Evals', meta: 'Private Trust & Safety Vault · Score 0.96', pinId: 'ashburn', excerpt: 'Completed: Cyber & Autonomy METR suites. Pending: External third-party CBRN uplift verification scheduled for Week 3.' }
          ]
        },
        {
          q: 'Which planned 100MW+ data center corridors face active grid moratoriums or water-use restrictions?',
          answer: 'Overlaying our 14 candidate sites against Sovereign\'s live facility & utility layer flags <strong>Dublin Metro West</strong> (active EirGrid connection freeze until 2028) {{1}}, while <strong>Northern Virginia & Nordic Hydro corridors</strong> retain fast-track clean-power interconnect paths {{2}}.',
          citations: [
            { num: 1, title: 'PeeringDB + EirGrid Utility Moratorium Filings', meta: 'Infrastructure Telemetry · Score 0.97', pinId: 'dublin', excerpt: 'Greater Dublin grid capacity constraints restrict new >50MW gas-backed connections lacking onsite dispatchable generation.' },
            { num: 2, title: 'Site_Selection_Matrix_2026.xlsx', meta: 'Internal Infra Team DB · Score 0.95', pinId: 'ashburn', excerpt: 'Candidate sites NO-02 and US-VA-09 verified <18-month substation upgrade lead times.' }
          ]
        },
        {
          q: 'Audit our internal whistleblower & safety-disclosure policy against peer frontier lab benchmarks.',
          answer: 'Comparing your internal <strong>Trust Policy v3.1</strong> against Sovereign\'s live Frontier Lab Watch confirms full alignment on anonymous internal reporting, but identifies an opportunity to add <strong>explicit non-disparagement carve-outs</strong> matching industry gold standard {{1}}.',
          citations: [
            { num: 1, title: 'Sovereign Frontier Lab Watch + Internal Policy v3.1', meta: 'Comparative Governance Audit · Score 0.96', pinId: 'singapore', excerpt: 'Top-quartile labs explicitly exempt safety disclosures to regulators and AISIs from broad NDA/non-disparagement clauses.' }
          ]
        }
      ]
    },
    {
      id: 'research',
      code: '07',
      label: 'Research & Media',
      short: 'Research / NGO',
      color: '#38bdf8',
      rgb: [56, 189, 248],
      pilot: '2–4 Weeks',
      title: 'Empirical Observatory & Investigative Archive AI',
      buyers: 'Universities · Think Tanks · Investigative Desks · Human Rights Monitors',
      layerLabel: 'ADMIRALTY SOURCE GRADING + FOIA ARCHIVE + TIMELINE REPLAY',
      indexLabel: 'PRIVATE / PUBLIC · COURT FILINGS + FOIA PDFs + OSINT ARCHIVE',
      targetLat: 44.0,
      targetLon: 12.0,
      connectors: ['FOIA & Court Filing PDFs', 'Field Incident Logs', 'Admiralty Source Grading', 'Open CC-BY-4.0 API'],
      pins: [
        { id: 'geneva', lat: 46.2, lon: 6.14, label: 'GENEVA · UNODA / LAWS', sub: 'Treaty Consultations Archive', color: '#38bdf8' },
        { id: 'dc', lat: 38.9, lon: -77.04, label: 'US · PROCUREMENT RECORDS', sub: '18 FOIA Contracts Indexed', color: '#ff2244' },
        { id: 'nairobi', lat: -1.29, lon: 36.82, label: 'NAIROBI · GLOBAL SOUTH', sub: 'CIPESA & Digital Rights Feed', color: '#00ff88' }
      ],
      arcs: [
        { from: [38.9, -77.04], to: [46.2, 6.14], color: '#38bdf8' },
        { from: [46.2, 6.14], to: [-1.29, 36.82], color: '#00ff88' }
      ],
      prompts: [
        {
          q: 'Find every verified procurement record and field incident linking biometric border deployments in our 2023–2026 archive.',
          answer: 'Matched <strong>18 verified records across 7 countries</strong> linking automated biometric targeting systems to border & detention operations {{1}}, with direct verbatim citations to public procurement tenders, UN Human Rights briefings, and field audits {{2}} {{3}}.',
          citations: [
            { num: 1, title: 'FOIA_Procurement_Ledger_2023_2026.csv', meta: 'Admiralty Grade: A1 · Score 0.98', pinId: 'dc', excerpt: '18 awarded municipal & federal biometric surveillance contracts cross-linked by vendor entity, contract ceiling, and deployment county.' },
            { num: 2, title: 'UNODA_GGE_LAWS_Briefing_2026.pdf (p. 11)', meta: 'Public Treaty Archive · Score 0.96', pinId: 'geneva', excerpt: 'Member-state submissions documenting human-control red lines and accountability gaps in algorithmic targeting.' },
            { num: 3, title: 'CIPESA_Biometric_Rights_Report_2026.pdf', meta: 'Civil Society Monitor · Score 0.94', pinId: 'nairobi', excerpt: 'Field documentation across 4 East African border checkpoints detailing absence of statutory redress mechanisms.' }
          ]
        },
        {
          q: 'Export an OSCOLA-formatted citation table for all A1-graded algorithmic accountability filings from Q1–Q2.',
          answer: 'Compiled <strong>11 Admiralty A1 primary sources</strong> (court rulings, parliamentary committee reports, and statutory texts) ready for 1-click BibTeX / OSCOLA / Frictionless DataPackage export with zero secondary-press contamination {{1}}.',
          citations: [
            { num: 1, title: 'Sovereign Verification Engine · Grade A1 Filter', meta: '100% Primary Source Lock · Score 0.99', pinId: 'geneva', excerpt: 'Every record validated with SHA-256 ingestion digest, canonical primary URL, and publication timestamp.' }
          ]
        },
        {
          q: 'Identify geographic blind spots where Global South AI harms are under-reported relative to Northern press.',
          answer: 'Epistemic parity analysis reveals that while <strong>31% of documented rights incidents</strong> occur in Global South jurisdictions, mainstream English feeds cover under 12%—highlighting 6 regional civil-society monitors to prioritize {{1}}.',
          citations: [
            { num: 1, title: 'Sovereign Epistemic Parity Audit · Whitepaper v2.0', meta: 'Live Empirical Dataset · Score 0.97', pinId: 'nairobi', excerpt: 'Integrating CIPESA, SMEX, Derechos Digitales, and MediaNama increases non-Western policy recall by +44%.' }
          ]
        }
      ]
    },
    {
      id: 'health',
      code: '08',
      label: 'Pharma & Global Ops',
      short: 'Pharma / Ops',
      color: '#f472b6',
      rgb: [244, 114, 182],
      pilot: '3–5 Weeks',
      title: 'Clinical Supply, Travel Risk & SOP Copilot',
      buyers: 'Global Pharma Ops · Corporate Security · International NGOs · Logistics',
      layerLabel: 'COLD-CHAIN CORRIDORS + TRAVEL RISK + CLINICAL SOP VAULT',
      indexLabel: 'PRIVATE VPC · CLINICAL LOGISTICS + TRAVEL ADVISORIES + SOPs',
      targetLat: 44.0,
      targetLon: 18.0,
      connectors: ['Cold-Chain IoT Feeds', 'Travel Security Registry', 'Clinical SOP Manuals', 'WHO & Customs Alerts'],
      pins: [
        { id: 'basel', lat: 47.56, lon: 7.59, label: 'BASEL · BIOLOGICS HUB', sub: 'Cold-Chain QA Dispatch', color: '#f472b6' },
        { id: 'boston', lat: 42.36, lon: -71.06, label: 'BOSTON · TRIAL OPS', sub: 'GMP SOP CC-114 Active', color: '#00f5ff' },
        { id: 'doha', lat: 25.29, lon: 51.53, label: 'MENA AIR CORRIDOR', sub: 'Airspace Reroute +14h', color: '#ff6b00' }
      ],
      arcs: [
        { from: [47.56, 7.59], to: [25.29, 51.53], color: '#ff6b00' },
        { from: [42.36, -71.06], to: [47.56, 7.59], color: '#f472b6' }
      ],
      prompts: [
        {
          q: 'Are any regional disruptions impacting our biologics air-freight hub, and what is our cold-chain excursion SOP?',
          answer: '<strong>MENA Air Corridor</strong> airspace rerouting adds <strong>+14 hours transit time</strong> for 2 temperature-sensitive biologics lots out of Basel {{1}}. Per <strong>Cold-Chain SOP CC-114</strong>, trigger dry-ice replenishment at Zurich hub before departure and alert QA lead automatically {{2}}.',
          citations: [
            { num: 1, title: 'Airspace NOTAM Feed + Biologics Lot Manifest #772', meta: 'Live Cold-Chain Monitor · Score 0.98', pinId: 'doha', excerpt: 'Lots BIO-904 & BIO-911 scheduled via affected air corridor; thermal shipper autonomous hold rating = 72h.' },
            { num: 2, title: 'GMP_ColdChain_Excursion_SOP_CC-114.pdf (p. 8)', meta: 'Private Quality Vault · RBAC: QA_OPS · Score 0.97', pinId: 'basel', excerpt: '"When projected transit duration exceeds 75% of thermal container hold limit, mandatory pre-flight dry-ice top-up and QA sign-off are required."' }
          ]
        },
        {
          q: 'Check duty-of-care alerts for clinical field auditors traveling across 4 regions this week.',
          answer: '<strong>18 field personnel</strong> are active across 4 regions: 16 green status, <strong>2 auditors in Region-East</strong> advised to shift airport transfer window due to civic protest & transit shutdown alert {{1}} {{2}}.',
          citations: [
            { num: 1, title: 'Corporate_Travel_Roster_Week48.sql', meta: 'Private Duty-of-Care DB · Score 0.96', pinId: 'boston', excerpt: 'Auditors TRV-41 & TRV-42 scheduled for Thursday 09:00 departure through flagged metro transit hub.' },
            { num: 2, title: 'Sovereign Civic & Transport Risk Feed', meta: 'Verified Advisory · Score 0.95', pinId: 'doha', excerpt: 'Municipal transit strike and arterial road closures verified between 07:00–13:00 local time.' }
          ]
        },
        {
          q: 'Verify whether our Phase-III customs dossier meets updated EU Annex 15 temperature documentation rules.',
          answer: 'Cross-checking <strong>Customs Dossier PH3-EU</strong> against <strong>EU GMP Annex 15</strong> confirms compliant IoT logger calibration certificates, with <strong>1 missing QP electronic signature</strong> on Batch-409 {{1}}.',
          citations: [
            { num: 1, title: 'EU_GMP_Annex15 + Internal Batch_409_Dossier.pdf', meta: 'Private Regulatory QA · Score 0.97', pinId: 'basel', excerpt: 'Batch-409 logger telemetry verified within 2–8°C tolerance; Qualified Person (QP) release field currently unsigned.' }
          ]
        }
      ]
    }
  ];

  const DEPLOY_MODES = {
    vpc: {
      badge: 'MOST POPULAR · ZERO DATA RETENTION',
      title: 'Dedicated Private Cloud VPC',
      sub: 'Deployed directly inside your own AWS, Google Cloud, or Azure tenant. Data, embeddings, and logs never touch shared multi-tenant servers.',
      timeline: '3–6 Weeks to Production',
      ideal: 'Logistics, Finance, Legal, AI Labs, Mid-to-Large Enterprises',
      specs: [
        { k: 'Data Residency', v: '100% inside your chosen AWS / GCP / Azure region (UK, EU, US, APAC)' },
        { k: 'LLM Inference', v: 'Private Bedrock / Vertex AI / Azure OpenAI zero-retention endpoints — zero model training' },
        { k: 'Access Control', v: 'SSO (Okta / Entra ID / Google Workspace) + document-level RBAC enforced pre-retrieval' },
        { k: 'Audit & Provenance', v: 'Immutable query + citation logs with exact document chunk IDs & timestamps' }
      ]
    },
    onprem: {
      badge: 'MAXIMUM SOVEREIGNTY · AIR-GAPPED',
      title: 'Fully Air-Gapped On-Premise',
      sub: 'Packaged as hardened Docker / Kubernetes containers running on your own internal servers or GPU cluster with local open-weights models.',
      timeline: '6–10 Weeks to Production',
      ideal: 'Defense, Critical Infrastructure, Magic Circle Law Firms, Government',
      specs: [
        { k: 'Network Perimeter', v: 'Zero external internet egress required; runs offline inside sealed VLAN / SCIF' },
        { k: 'LLM Inference', v: 'Self-hosted open-weights models (Llama / Mistral / Qwen) on your internal GPUs via vLLM' },
        { k: 'Spatial Maps', v: 'Offline self-hosted Natural Earth + custom tile/GeoJSON servers — zero external tile calls' },
        { k: 'Compliance Alignment', v: 'Architected for ISO 27001, SOC 2, UK Cyber Essentials Plus & GDPR strict localization' }
      ]
    },
    managed: {
      badge: 'FASTEST LAUNCH · 2–4 WEEKS',
      title: 'Managed Single-Tenant Sovereign',
      sub: 'Isolated single-tenant database, dedicated vector schema, and encrypted private connectors managed end-to-end by Sovereign so your IT team stays hands-off.',
      timeline: '2–4 Weeks Working Pilot',
      ideal: 'Fast-Moving Pilots, Research Institutes, Think Tanks, Growth Teams',
      specs: [
        { k: 'Isolation Model', v: 'Dedicated isolated database & vector index per client — zero cross-tenant pooling' },
        { k: 'Zero-IT Burden', v: 'Sovereign handles hosting, connector monitoring, SSL, uptime & RAG quality evals' },
        { k: 'Upgrade Path', v: 'Seamless 1-command migration into your own Cloud VPC whenever procurement scales' },
        { k: 'Cost Efficiency', v: 'Lowest infrastructure overhead — ideal for proving ROI before enterprise rollout' }
      ]
    }
  };

  /* ── 3D HOLOGRAPHIC REAL-EARTH SANDBOX GLOBE (ZERO WEBGL, 60FPS) ── */
  function createSandboxGlobe(canvas) {
    const ctx = canvas.getContext('2d');
    if (!ctx) return null;

    // Precompute Natural Earth rings from SOV_WORLD_RINGS
    const rawRings = Array.isArray(window.SOV_WORLD_RINGS) ? window.SOV_WORLD_RINGS : [];
    const rings = [];
    for (let r = 0; r < rawRings.length; r++) {
      const flat = rawRings[r];
      if (!flat || flat.length < 6) continue;
      const pts = [];
      let cx = 0, cy = 0, cz = 0;
      for (let i = 0; i < flat.length; i += 2) {
        const lon = flat[i] * 0.1 * DEG;
        const lat = flat[i + 1] * 0.1 * DEG;
        const cp = Math.cos(lat);
        const u = [cp * Math.sin(lon), Math.sin(lat), cp * Math.cos(lon)];
        pts.push(u);
        cx += u[0]; cy += u[1]; cz += u[2];
      }
      const len = Math.hypot(cx, cy, cz) || 1;
      rings.push({ pts, center: [cx / len, cy / len, cz / len] });
    }

    let w = 600, h = 460, dpr = 1;
    let curLat = 22 * DEG, curLon = 44 * DEG;
    let tgtLat = 22 * DEG, tgtLon = 44 * DEG;
    let activeIndustry = INDUSTRIES[0];
    let focusedPinId = null;
    let focusPulseUntil = 0;
    let isDragging = false, lastX = 0, lastY = 0, dragAutoResumeAt = 0;
    let projectedPins = [];
    let visible = true;

    function resize() {
      const rect = canvas.parentElement.getBoundingClientRect();
      w = Math.max(260, Math.round(rect.width));
      h = Math.max(280, Math.round(rect.height));
      dpr = Math.min(window.devicePixelRatio || 1, 1.75);
      canvas.width = Math.round(w * dpr);
      canvas.height = Math.round(h * dpr);
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    }

    function llToUnit(latDeg, lonDeg) {
      const phi = latDeg * DEG, lam = lonDeg * DEG, cp = Math.cos(phi);
      return [cp * Math.sin(lam), Math.sin(phi), cp * Math.cos(lam)];
    }

    function project(u, cosLon, sinLon, cosLat, sinLat, cx, cy, R) {
      // Rotate around Y by -curLon, then X by curLat
      const x1 = u[0] * cosLon - u[2] * sinLon;
      const z1 = u[0] * sinLon + u[2] * cosLon;
      const y2 = u[1] * cosLat - z1 * sinLat;
      const z2 = u[1] * sinLat + z1 * cosLat;
      const persp = 4.4 / (4.4 - z2);
      return { x: cx + x1 * R * persp, y: cy - y2 * R * persp, z: z2, persp };
    }

    function setIndustry(ind) {
      activeIndustry = ind;
      tgtLat = ind.targetLat * DEG;
      tgtLon = ind.targetLon * DEG;
      focusedPinId = ind.pins[0] ? ind.pins[0].id : null;
      focusPulseUntil = performance.now() + 2600;
    }

    function focusPin(pinId) {
      const pin = activeIndustry.pins.find((p) => p.id === pinId);
      if (!pin) return;
      focusedPinId = pin.id;
      tgtLat = pin.lat * DEG;
      tgtLon = pin.lon * DEG;
      focusPulseUntil = performance.now() + 3400;
    }

    // Drag to rotate + click pin
    canvas.addEventListener('pointerdown', (e) => {
      isDragging = true;
      lastX = e.clientX;
      lastY = e.clientY;
      dragAutoResumeAt = performance.now() + 7000;
      canvas.setPointerCapture(e.pointerId);
    });
    canvas.addEventListener('pointermove', (e) => {
      if (!isDragging) return;
      const dx = e.clientX - lastX;
      const dy = e.clientY - lastY;
      lastX = e.clientX;
      lastY = e.clientY;
      tgtLon -= dx * 0.0085;
      tgtLat = Math.max(-1.15, Math.min(1.15, tgtLat + dy * 0.0085));
      curLon = tgtLon;
      curLat = tgtLat;
      dragAutoResumeAt = performance.now() + 7000;
    });
    const endDrag = () => { isDragging = false; };
    canvas.addEventListener('pointerup', endDrag);
    canvas.addEventListener('pointercancel', endDrag);

    if ('IntersectionObserver' in window) {
      new IntersectionObserver((entries) => {
        visible = entries[0].isIntersecting;
      }, { threshold: 0.05 }).observe(canvas);
    }

    window.addEventListener('resize', resize, { passive: true });
    resize();

    let t0 = performance.now();
    function frame(now) {
      requestAnimationFrame(frame);
      if (!visible) return;
      const elapsed = (now - t0) * 0.001;

      if (!isDragging) {
        // Gentle orbital drift when not recently dragged
        const drift = now > dragAutoResumeAt ? Math.sin(elapsed * 0.28) * 0.14 : 0;
        let dLon = (tgtLon + drift) - curLon;
        while (dLon > Math.PI) dLon -= Math.PI * 2;
        while (dLon < -Math.PI) dLon += Math.PI * 2;
        curLon += dLon * 0.065;
        curLat += (tgtLat - curLat) * 0.065;
      }

      ctx.clearRect(0, 0, w, h);

      const cx = w * 0.5;
      const cy = h * 0.5;
      const R = Math.min(w, h) * 0.39;
      const [cr, cg, cb] = activeIndustry.rgb;

      // 1. Atmospheric outer halo
      const halo = ctx.createRadialGradient(cx, cy, R * 0.84, cx, cy, R * 1.24);
      halo.addColorStop(0, `rgba(${cr},${cg},${cb},0.22)`);
      halo.addColorStop(0.55, `rgba(${cr},${cg},${cb},0.07)`);
      halo.addColorStop(1, 'rgba(0,0,0,0)');
      ctx.fillStyle = halo;
      ctx.beginPath();
      ctx.arc(cx, cy, R * 1.24, 0, Math.PI * 2);
      ctx.fill();

      // 2. Deep sphere body
      const body = ctx.createRadialGradient(cx - R * 0.28, cy - R * 0.25, R * 0.08, cx, cy, R);
      body.addColorStop(0, `rgba(${Math.round(cr * 0.16)},${Math.round(cg * 0.22)},${Math.round(cb * 0.28)},0.96)`);
      body.addColorStop(0.72, 'rgba(6,11,24,0.98)');
      body.addColorStop(1, 'rgba(3,6,14,1)');
      ctx.fillStyle = body;
      ctx.beginPath();
      ctx.arc(cx, cy, R, 0, Math.PI * 2);
      ctx.fill();

      const cosLon = Math.cos(curLon), sinLon = Math.sin(curLon);
      const cosLat = Math.cos(curLat), sinLat = Math.sin(curLat);

      // 3. Subtle latitude/longitude graticule clipped inside sphere
      ctx.save();
      ctx.beginPath();
      ctx.arc(cx, cy, R, 0, Math.PI * 2);
      ctx.clip();

      ctx.strokeStyle = `rgba(${cr},${cg},${cb},0.08)`;
      ctx.lineWidth = 0.7;
      for (let lat = -60; lat <= 60; lat += 30) {
        ctx.beginPath();
        let pen = false;
        for (let lon = -180; lon <= 180; lon += 12) {
          const p = project(llToUnit(lat, lon), cosLon, sinLon, cosLat, sinLat, cx, cy, R);
          if (p.z > 0) {
            if (!pen) { ctx.moveTo(p.x, p.y); pen = true; } else ctx.lineTo(p.x, p.y);
          } else pen = false;
        }
        ctx.stroke();
      }
      for (let lon = -180; lon < 180; lon += 30) {
        ctx.beginPath();
        let pen = false;
        for (let lat = -84; lat <= 84; lat += 12) {
          const p = project(llToUnit(lat, lon), cosLon, sinLon, cosLat, sinLat, cx, cy, R);
          if (p.z > 0) {
            if (!pen) { ctx.moveTo(p.x, p.y); pen = true; } else ctx.lineTo(p.x, p.y);
          } else pen = false;
        }
        ctx.stroke();
      }

      // 4. Real Natural Earth 3D landmasses
      ctx.fillStyle = `rgba(${cr},${cg},${cb},0.10)`;
      ctx.strokeStyle = `rgba(${cr},${cg},${cb},0.52)`;
      ctx.lineWidth = 0.85;
      for (let i = 0; i < rings.length; i++) {
        const ring = rings[i];
        // Quick center hemisphere cull
        const c = ring.center;
        const cz1 = c[0] * sinLon + c[2] * cosLon;
        const cz2 = c[1] * sinLat + cz1 * cosLat;
        if (cz2 < -0.55) continue;

        ctx.beginPath();
        let started = false;
        let visPts = 0;
        const pts = ring.pts;
        for (let k = 0; k < pts.length; k++) {
          const p = project(pts[k], cosLon, sinLon, cosLat, sinLat, cx, cy, R);
          if (p.z > -0.05) {
            visPts++;
            if (!started) { ctx.moveTo(p.x, p.y); started = true; }
            else ctx.lineTo(p.x, p.y);
          } else {
            started = false;
          }
        }
        if (visPts >= 3) {
          ctx.fill();
          ctx.stroke();
        }
      }

      // 5. Pole-to-pole holographic scan band
      const scanY = cy - R + ((elapsed * 0.24) % 1) * (R * 2);
      const scanGrad = ctx.createLinearGradient(0, scanY - 18, 0, scanY + 18);
      scanGrad.addColorStop(0, 'rgba(0,0,0,0)');
      scanGrad.addColorStop(0.5, `rgba(${cr},${cg},${cb},0.16)`);
      scanGrad.addColorStop(1, 'rgba(0,0,0,0)');
      ctx.fillStyle = scanGrad;
      ctx.fillRect(cx - R, scanY - 18, R * 2, 36);

      ctx.restore();

      // 6. Crisp Fresnel rim ring
      ctx.strokeStyle = `rgba(${cr},${cg},${cb},0.58)`;
      ctx.lineWidth = 1.4;
      ctx.beginPath();
      ctx.arc(cx, cy, R, 0, Math.PI * 2);
      ctx.stroke();

      // 7. Curved 3D Geodesic Arcs with traveling energy comets
      const arcs = activeIndustry.arcs || [];
      for (let a = 0; a < arcs.length; a++) {
        const arc = arcs[a];
        const uA = llToUnit(arc.from[0], arc.from[1]);
        const uB = llToUnit(arc.to[0], arc.to[1]);
        const steps = 28;
        const arcPts = [];
        for (let s = 0; s <= steps; s++) {
          const t = s / steps;
          let mx = uA[0] * (1 - t) + uB[0] * t;
          let my = uA[1] * (1 - t) + uB[1] * t;
          let mz = uA[2] * (1 - t) + uB[2] * t;
          const mLen = Math.hypot(mx, my, mz) || 1;
          const alt = 1 + Math.sin(t * Math.PI) * 0.19;
          arcPts.push(project([(mx / mLen) * alt, (my / mLen) * alt, (mz / mLen) * alt], cosLon, sinLon, cosLat, sinLat, cx, cy, R));
        }
        ctx.strokeStyle = arc.color;
        ctx.globalAlpha = 0.42;
        ctx.lineWidth = 1.3;
        ctx.beginPath();
        let pen = false;
        for (let s = 0; s < arcPts.length; s++) {
          if (arcPts[s].z > -0.1) {
            if (!pen) { ctx.moveTo(arcPts[s].x, arcPts[s].y); pen = true; }
            else ctx.lineTo(arcPts[s].x, arcPts[s].y);
          } else pen = false;
        }
        ctx.stroke();

        // Comet pulse along arc
        const cometIdx = Math.floor(((elapsed * 0.45 + a * 0.33) % 1) * (arcPts.length - 1));
        const cp = arcPts[cometIdx];
        if (cp && cp.z > 0) {
          ctx.globalAlpha = 0.95;
          ctx.fillStyle = '#ffffff';
          ctx.beginPath();
          ctx.arc(cp.x, cp.y, 2.8, 0, Math.PI * 2);
          ctx.fill();
        }
        ctx.globalAlpha = 1;
      }

      // 8. Industry pins + pulsing radar rings + pinned HUD callout badges
      projectedPins = [];
      const pins = activeIndustry.pins || [];
      for (let i = 0; i < pins.length; i++) {
        const pin = pins[i];
        const p = project(llToUnit(pin.lat, pin.lon), cosLon, sinLon, cosLat, sinLat, cx, cy, R);
        if (p.z <= 0.05) continue;
        projectedPins.push({ pin, p });

        const isFocused = pin.id === focusedPinId;
        const pulseSpeed = isFocused && now < focusPulseUntil ? 2.4 : 1.1;
        const pulse = (elapsed * pulseSpeed + i * 0.27) % 1;

        // Expanding radar ring
        ctx.strokeStyle = pin.color;
        ctx.globalAlpha = (1 - pulse) * (isFocused ? 0.95 : 0.6);
        ctx.lineWidth = isFocused ? 1.8 : 1.1;
        ctx.beginPath();
        ctx.arc(p.x, p.y, 5 + pulse * (isFocused ? 24 : 15), 0, Math.PI * 2);
        ctx.stroke();
        ctx.globalAlpha = 1;

        // Pin core
        ctx.fillStyle = pin.color;
        ctx.beginPath();
        ctx.arc(p.x, p.y, isFocused ? 4.8 : 3.6, 0, Math.PI * 2);
        ctx.fill();
        ctx.fillStyle = '#fff';
        ctx.beginPath();
        ctx.arc(p.x, p.y, 1.8, 0, Math.PI * 2);
        ctx.fill();

        // Draw crisp HUD tag on focused pin (or up to 2 front-most pins on desktop)
        if (isFocused || (w > 420 && i < 2)) {
          ctx.font = '700 8.5px "JetBrains Mono", monospace';
          const pillText = '● ' + pin.label;
          const pillW = Math.min(200, Math.max(120, Math.ceil(ctx.measureText(pillText).width) + 16));
          const rightSide = p.x >= cx;
          const ox = rightSide ? 18 : -18;
          const oy = i % 2 === 0 ? -18 : 18;
          const tx = Math.max(10, Math.min(w - pillW - 10, p.x + ox + (rightSide ? 0 : -(pillW - 8))));
          const ty = Math.max(18, Math.min(h - 46, p.y + oy));

          // Leader line
          ctx.strokeStyle = pin.color;
          ctx.globalAlpha = isFocused ? 0.85 : 0.45;
          ctx.lineWidth = 1;
          ctx.beginPath();
          ctx.moveTo(p.x, p.y);
          ctx.lineTo(rightSide ? tx : tx + pillW, ty + 11);
          ctx.stroke();
          ctx.globalAlpha = 1;

          // Pill background
          ctx.fillStyle = 'rgba(5, 9, 20, 0.90)';
          ctx.strokeStyle = isFocused ? pin.color : 'rgba(255,255,255,0.18)';
          ctx.lineWidth = isFocused ? 1.2 : 0.8;
          ctx.beginPath();
          if (ctx.roundRect) ctx.roundRect(tx, ty, pillW, 24, 6);
          else ctx.rect(tx, ty, pillW, 24);
          ctx.fill();
          ctx.stroke();

          ctx.fillStyle = isFocused ? '#ffffff' : '#cbd5e1';
          ctx.fillText(pillText, tx + 8, ty + 15);
        }
      }
    }

    requestAnimationFrame(frame);
    return { setIndustry, focusPin };
  }

  /* ── INIT ALL INTERACTIVE MODULES ON DOM READY ── */
  document.addEventListener('DOMContentLoaded', () => {
    const globeCanvas = document.getElementById('sol-globe-canvas');
    const globe = globeCanvas ? createSandboxGlobe(globeCanvas) : null;

    // Sandbox DOM handles
    const tabBar = document.getElementById('sim-industry-tabs');
    const globeTitle = document.getElementById('sim-globe-title');
    const globeLayer = document.getElementById('sim-globe-layer');
    const ragIndexLabel = document.getElementById('sim-rag-index');
    const promptChipsWrap = document.getElementById('sim-prompt-chips');
    const activeQuestionEl = document.getElementById('sim-active-q');
    const stageStepsWrap = document.getElementById('sim-rag-steps');
    const answerEl = document.getElementById('sim-rag-answer');
    const citeBarEl = document.getElementById('sim-cite-bar');
    const inspectorCard = document.getElementById('sim-inspector');
    const inspectorTitle = document.getElementById('sim-insp-title');
    const inspectorMeta = document.getElementById('sim-insp-meta');
    const inspectorExcerpt = document.getElementById('sim-insp-excerpt');
    const connectorsWrap = document.getElementById('sim-connectors');
    const commissionBtn = document.getElementById('sim-commission-btn');
    const pilotBadge = document.getElementById('sim-pilot-badge');
    const sandboxShell = document.getElementById('sandbox-shell');

    let currentInd = INDUSTRIES[0];
    let currentPromptIdx = 0;
    let streamTimer = null;

    function showCitation(cite) {
      if (!cite || !inspectorCard) return;
      inspectorCard.classList.add('active');
      inspectorTitle.textContent = `[${cite.num}] ${cite.title}`;
      inspectorMeta.textContent = cite.meta;
      inspectorExcerpt.textContent = cite.excerpt;

      // Highlight active citation buttons
      document.querySelectorAll('.sim-cite-pill, .sim-inline-cite').forEach((btn) => {
        btn.classList.toggle('active', String(btn.dataset.cnum) === String(cite.num));
      });
      if (globe && cite.pinId) globe.focusPin(cite.pinId);
    }

    function runPrompt(ind, idx, instant) {
      currentPromptIdx = idx;
      const item = ind.prompts[idx] || ind.prompts[0];
      if (streamTimer) { clearTimeout(streamTimer); streamTimer = null; }

      // Update active prompt chip
      promptChipsWrap.querySelectorAll('.sim-prompt-chip').forEach((btn, i) => {
        btn.classList.toggle('active', i === idx);
      });

      activeQuestionEl.textContent = `"${item.q}"`;

      // Convert {{1}} markers to interactive citation buttons
      const renderedHtml = item.answer.replace(/\{\{(\d+)\}\}/g, (_, n) =>
        `<button type="button" class="sim-inline-cite" data-cnum="${n}" title="Inspect verified source [${n}]">[${n}]</button>`
      );

      // Build bottom citation bar
      citeBarEl.innerHTML = item.citations.map((c) =>
        `<button type="button" class="sim-cite-pill" data-cnum="${c.num}"><span>[${c.num}]</span> ${c.title.split('·')[0].trim()}</button>`
      ).join('');

      const bindCitations = () => {
        sandboxShell.querySelectorAll('[data-cnum]').forEach((el) => {
          el.addEventListener('click', () => {
            const found = item.citations.find((c) => String(c.num) === String(el.dataset.cnum));
            if (found) showCitation(found);
          });
        });
      };

      const steps = stageStepsWrap ? stageStepsWrap.querySelectorAll('.sim-step') : [];
      if (instant) {
        steps.forEach((s) => s.classList.add('done'));
        answerEl.innerHTML = renderedHtml;
        bindCitations();
        showCitation(item.citations[0]);
        return;
      }

      // Snappy animated RAG pipeline sequence (~520ms total)
      steps.forEach((s) => { s.classList.remove('done', 'running'); });
      answerEl.innerHTML = '<span class="sim-thinking">Retrieving verified chunks from isolated private VPC index…</span>';
      if (steps[0]) steps[0].classList.add('running');

      streamTimer = setTimeout(() => {
        if (steps[0]) { steps[0].classList.remove('running'); steps[0].classList.add('done'); }
        if (steps[1]) steps[1].classList.add('running');

        streamTimer = setTimeout(() => {
          if (steps[1]) { steps[1].classList.remove('running'); steps[1].classList.add('done'); }
          if (steps[2]) steps[2].classList.add('running');

          // Smooth chunk reveal
          answerEl.innerHTML = renderedHtml;
          answerEl.classList.remove('sim-reveal');
          void answerEl.offsetWidth;
          answerEl.classList.add('sim-reveal');
          bindCitations();
          showCitation(item.citations[0]);

          streamTimer = setTimeout(() => {
            if (steps[2]) { steps[2].classList.remove('running'); steps[2].classList.add('done'); }
          }, 220);
        }, 240);
      }, 220);
    }

    function selectIndustry(indId, instant = false) {
      const ind = INDUSTRIES.find((x) => x.id === indId) || INDUSTRIES[0];
      currentInd = ind;

      if (sandboxShell) sandboxShell.style.setProperty('--sim-accent', ind.color);

      if (tabBar) {
        tabBar.querySelectorAll('.sim-ind-tab').forEach((t) => {
          const active = t.dataset.ind === ind.id;
          t.classList.toggle('active', active);
          t.setAttribute('aria-selected', active ? 'true' : 'false');
        });
      }

      if (globeTitle) globeTitle.textContent = `${ind.code} // ${ind.title}`;
      if (globeLayer) globeLayer.textContent = ind.layerLabel;
      if (ragIndexLabel) ragIndexLabel.textContent = ind.indexLabel;
      if (pilotBadge) pilotBadge.textContent = `PILOT: ${ind.pilot}`;
      if (commissionBtn) {
        commissionBtn.href = `enterprise.html?usecase=${ind.id}`;
        commissionBtn.textContent = `Commission ${ind.short} Blueprint →`;
      }

      if (connectorsWrap) {
        connectorsWrap.innerHTML = ind.connectors.map((c) => `<span class="pipe-chip">${c}</span>`).join('');
      }

      if (promptChipsWrap) {
        promptChipsWrap.innerHTML = ind.prompts.map((p, i) =>
          `<button type="button" class="sim-prompt-chip ${i === 0 ? 'active' : ''}" data-pidx="${i}">
            <span class="sim-p-idx">Q${i + 1}</span>
            <span>${p.q}</span>
          </button>`
        ).join('');
        promptChipsWrap.querySelectorAll('.sim-prompt-chip').forEach((btn) => {
          btn.addEventListener('click', () => runPrompt(ind, Number(btn.dataset.pidx), false));
        });
      }

      if (globe) globe.setIndustry(ind);
      runPrompt(ind, 0, instant);
    }

    if (tabBar) {
      tabBar.innerHTML = INDUSTRIES.map((ind, i) =>
        `<button type="button" role="tab" class="sim-ind-tab ${i === 0 ? 'active' : ''}" data-ind="${ind.id}" style="--tab-col:${ind.color};" aria-selected="${i === 0 ? 'true' : 'false'}">
          <span class="sim-tab-dot"></span>${ind.short}
        </button>`
      ).join('');
      tabBar.querySelectorAll('.sim-ind-tab').forEach((btn) => {
        btn.addEventListener('click', () => selectIndustry(btn.dataset.ind, false));
      });
      selectIndustry('logistics', true);
    }

    /* ── BLUEPRINT CARDS FILTER + LOAD-IN-SIMULATOR + SPOTLIGHT HOVER ── */
    const filterBtns = document.querySelectorAll('.sol-filter-btn');
    const cards = document.querySelectorAll('.uc-card');

    filterBtns.forEach((btn) => {
      btn.addEventListener('click', () => {
        filterBtns.forEach((b) => b.classList.remove('active'));
        btn.classList.add('active');
        const target = btn.dataset.filter;
        cards.forEach((card) => {
          card.classList.toggle('hidden', target !== 'all' && card.dataset.cat !== target);
        });
      });
    });

    cards.forEach((card) => {
      card.addEventListener('pointermove', (e) => {
        const rect = card.getBoundingClientRect();
        card.style.setProperty('--mx', `${e.clientX - rect.left}px`);
        card.style.setProperty('--my', `${e.clientY - rect.top}px`);
      }, { passive: true });
    });

    document.querySelectorAll('[data-load-sim]').forEach((btn) => {
      btn.addEventListener('click', () => {
        const indId = btn.dataset.loadSim;
        selectIndustry(indId, false);
        const target = document.getElementById('sandbox');
        if (target) target.scrollIntoView({ behavior: 'smooth', block: 'start' });
      });
    });

    /* ── DEPLOYMENT ARCHITECTURE SWITCHER ── */
    const archBtns = document.querySelectorAll('[data-arch]');
    const archPanel = document.getElementById('arch-detail-panel');

    function renderArch(modeKey) {
      const m = DEPLOY_MODES[modeKey] || DEPLOY_MODES.vpc;
      archBtns.forEach((b) => b.classList.toggle('active', b.dataset.arch === modeKey));
      if (!archPanel) return;
      archPanel.innerHTML = `
        <div class="arch-top-meta">
          <span class="arch-badge">${m.badge}</span>
          <span class="arch-time">⏱ ${m.timeline}</span>
        </div>
        <h3>${m.title}</h3>
        <p class="arch-sub">${m.sub}</p>
        <div class="arch-ideal"><strong>Best suited for:</strong> ${m.ideal}</div>
        <div class="arch-spec-grid">
          ${m.specs.map((s) => `
            <div class="arch-spec-item">
              <div class="arch-spec-k">${s.k}</div>
              <div class="arch-spec-v">${s.v}</div>
            </div>
          `).join('')}
        </div>
      `;
    }
    if (archBtns.length) {
      archBtns.forEach((b) => b.addEventListener('click', () => renderArch(b.dataset.arch)));
      renderArch('vpc');
    }

    /* ── INTERACTIVE PILOT SCOPE & TIMELINE ESTIMATOR ── */
    const estConnectors = document.getElementById('est-connectors');
    const estConnectorsVal = document.getElementById('est-connectors-val');
    const estDeploy = document.getElementById('est-deploy');
    const estDocs = document.getElementById('est-docs');
    const estStageEl = document.getElementById('est-stage');
    const estWeeksEl = document.getElementById('est-weeks');
    const estBudgetEl = document.getElementById('est-budget');
    const estSummaryEl = document.getElementById('est-summary');
    const estSendBtn = document.getElementById('est-send-btn');

    function updateEstimator() {
      if (!estConnectors || !estDeploy || !estDocs) return;
      const conns = Number(estConnectors.value);
      const deploy = estDeploy.value;
      const docs = estDocs.value;
      if (estConnectorsVal) estConnectorsVal.textContent = conns === 10 ? '10+ Sources' : `${conns} Source${conns > 1 ? 's' : ''}`;

      let minW = 2, maxW = 4;
      let stage = 'Discovery & Working Pilot';
      let range = '£4,500 – £8,500';

      if (conns >= 5 || deploy === 'onprem' || docs === 'enterprise') {
        stage = 'Production Enterprise Build';
        minW = deploy === 'onprem' ? 7 : 5;
        maxW = deploy === 'onprem' ? 11 : 8;
        range = deploy === 'onprem' ? '£28,000 – £55,000+' : '£15,000 – £35,000';
      } else if (conns >= 3 || deploy === 'vpc' || docs === 'medium') {
        stage = 'Dedicated VPC Pilot → Production';
        minW = 3;
        maxW = 6;
        range = '£7,500 – £18,000';
      }

      if (estStageEl) estStageEl.textContent = stage;
      if (estWeeksEl) estWeeksEl.textContent = `${minW}–${maxW} Weeks`;
      if (estBudgetEl) estBudgetEl.textContent = range;

      const deployName = deploy === 'onprem' ? 'Air-Gapped On-Premise' : (deploy === 'vpc' ? 'Private Cloud VPC' : 'Managed Single-Tenant');
      const docsName = docs === 'enterprise' ? '100k+ Docs / Multi-DB' : (docs === 'medium' ? '5k–100k Docs & SQL' : 'Up to 5,000 Docs');
      if (estSummaryEl) {
        estSummaryEl.textContent = `${conns} live connectors · ${docsName} · ${deployName} · Zero-retention citation-locked RAG AI + custom 3D/2D map layers.`;
      }
      if (estSendBtn) {
        const qs = new URLSearchParams({
          usecase: currentInd.id,
          scope: `${stage} (${minW}-${maxW} wks, ${conns} connectors, ${docsName}, ${deployName})`
        });
        estSendBtn.href = `enterprise.html?${qs.toString()}`;
      }
    }

    if (estConnectors) {
      [estConnectors, estDeploy, estDocs].forEach((el) => el.addEventListener('input', updateEstimator));
      updateEstimator();
    }

    /* ── 90-SECOND WALKTHROUGH MODAL (LOOM-READY OR INTERACTIVE GUIDED TOUR) ── */
    const openWalkBtn = document.getElementById('open-walkthrough-btn');
    const modal = document.getElementById('walkthrough-modal');
    const closeModalBtn = document.getElementById('close-walkthrough-btn');
    const modalBody = document.getElementById('walkthrough-modal-body');

    if (openWalkBtn && modal && modalBody) {
      openWalkBtn.addEventListener('click', () => {
        if (SOV_DEMO_LOOM_URL) {
          modalBody.innerHTML = `
            <div style="position:relative;padding-bottom:56.25%;height:0;border-radius:12px;overflow:hidden;border:1px solid rgba(0,245,255,0.28);">
              <iframe src="${SOV_DEMO_LOOM_URL}" frameborder="0" webkitallowfullscreen mozallowfullscreen allowfullscreen style="position:absolute;top:0;left:0;width:100%;height:100%;"></iframe>
            </div>
          `;
        }
        modal.classList.add('open');
        modal.setAttribute('aria-hidden', 'false');
      });
      const closeModal = () => {
        modal.classList.remove('open');
        modal.setAttribute('aria-hidden', 'true');
      };
      if (closeModalBtn) closeModalBtn.addEventListener('click', closeModal);
      modal.addEventListener('click', (e) => { if (e.target === modal) closeModal(); });
      document.addEventListener('keydown', (e) => { if (e.key === 'Escape') closeModal(); });
    }

    /* ── SCROLL REVEAL ANIMATIONS ── */
    const reveals = document.querySelectorAll('.sol-reveal');
    if ('IntersectionObserver' in window && reveals.length) {
      const io = new IntersectionObserver((entries) => {
        entries.forEach((en) => {
          if (en.isIntersecting) {
            en.target.classList.add('visible');
            io.unobserve(en.target);
          }
        });
      }, { threshold: 0.08 });
      reveals.forEach((el) => io.observe(el));
    } else {
      reveals.forEach((el) => el.classList.add('visible'));
    }
  });
})();
