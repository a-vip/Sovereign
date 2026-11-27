/* ─── SOVEREIGN WHITE-LABEL DEMO STUDIO ENGINE ─── */
/* Full interactive mini-SovDash workspace: 6 commercial verticals, real-time white-label branding,
   3D Natural-Earth Vector Globe + 2D Equal Earth switch, live overlays, dossier fly-to,
   citation-locked Private RAG AI + client-side Bring-Your-Own-Text live indexing. */

(function () {
  const DEG = Math.PI / 180;

  const ACCENTS = {
    cyan:    { hex: '#00f5ff', rgb: [0, 245, 255],   name: 'Obsidian Cyan' },
    violet:  { hex: '#b366ff', rgb: [179, 102, 255], name: 'Sovereign Violet' },
    emerald: { hex: '#10b981', rgb: [16, 185, 129],  name: 'Bio Emerald' },
    amber:   { hex: '#f59e0b', rgb: [245, 158, 11],  name: 'Editorial Amber' },
    sky:     { hex: '#38bdf8', rgb: [56, 189, 248],  name: 'Cambridge Sky' },
    crimson: { hex: '#ff2d55', rgb: [255, 45, 85],   name: 'Tactical Crimson' }
  };

  const PRESETS = {
    business: {
      id: 'business',
      short: 'Business & Supply Chain',
      brandDefault: 'Vanguard Global Ops',
      subtitle: 'SUPPLY CHAIN & MARITIME COMMAND',
      accentDefault: 'cyan',
      centerLat: 24, centerLon: 38,
      signals: [
        { id: 'b1', sev: 5, cat: 'MARITIME', title: 'Bab el-Mandeb GNSS Spoofing & Diversion Corridor Alert', loc: 'Red Sea / Aden', lat: 13.1, lon: 43.3, time: '14m ago', grade: 'A1', summary: '3 Q4 container ships (MAERSK-882, MSC-419, CMA-204) intersect UKMTO Advisory 094/26 within 36 hours.', source: 'SAP TMS Live Mirror + UKMTO Feed' },
        { id: 'b2', sev: 4, cat: 'PORT OPS', title: 'Rotterdam Automated Terminal Gate-4 Reefer Queue Spike', loc: 'Rotterdam, NL', lat: 51.92, lon: 4.48, time: '42m ago', grade: 'A1', summary: 'Cold-chain demurrage exposure reaches $18,400/day across 14 active reefer units if customs clearance extends 48h.', source: 'Port Telemetry + Rotterdam Tariff 2026' },
        { id: 'b3', sev: 3, cat: 'CORRIDOR', title: 'Panama Canal Neopanamax Draft Slot Adjustment', loc: 'Colon, Panama', lat: 9.35, lon: -79.9, time: '2h ago', grade: 'A2', summary: 'Daily transit reservations adjusted to 32 slots; West Coast reroute buffer verified.', source: 'ACP Maritime Notice + ERP Ledger' },
        { id: 'b4', sev: 2, cat: 'HUB STATUS', title: 'Singapore PSA Berth-9 High Utilization (91%) — Tier-1 Free Time Intact', loc: 'Singapore', lat: 1.35, lon: 103.82, time: '4h ago', grade: 'A1', summary: 'Enterprise SLA guarantees 7 calendar days port storage free time prior to demurrage.', source: 'PSA Singapore SLA Annex B' }
      ],
      arcs: [
        { from: [1.35, 103.82], to: [13.1, 43.3], color: '#ff6b35' },
        { from: [13.1, 43.3], to: [51.92, 4.48], color: '#00f5ff' },
        { from: [1.35, 103.82], to: [9.35, -79.9], color: '#38bdf8' }
      ],
      facilities: [
        { lat: 51.92, lon: 4.48, label: 'EU-WEST HUB' },
        { lat: 1.35, lon: 103.82, label: 'APAC HUB' },
        { lat: 33.74, lon: -118.27, label: 'LA PORT' },
        { lat: 25.01, lon: 55.06, label: 'JEBEL ALI' }
      ],
      geofences: [{ lat: 13.1, lon: 43.3, radiusDeg: 8.5, label: 'RED SEA RISK ZONE' }],
      docs: [
        { id: 'd1', name: 'Master_Freight_Agreement_2026.pdf', meta: '§14.2 · Page 14 · RBAC: OPS_L2', snippet: 'Force Majeure Corridor Diversion: Carrier liquidated damages are automatically waived upon UKMTO Level 3+ advisories; emergency bunker surcharge capped at 6.5%.', pinId: 'b1' },
        { id: 'd2', name: 'Rotterdam_Tariff_Schedule_2026.pdf', meta: 'Sheet 2 · Procurement ERP', snippet: 'Reefer demurrage escalates to EUR 1,210/unit/day after Day 3; Rotterdam EU-West warehouse retains 7.0 days safety stock for Tier-A SKUs.', pinId: 'b2' },
        { id: 'd3', name: 'PSA_Singapore_Enterprise_SLA.pdf', meta: 'Annex B · Verified', snippet: 'Contracted enterprise shippers receive 7 calendar days storage free time at PSA Berth-9 before storage tariff triggers.', pinId: 'b4' }
      ],
      prompts: [
        {
          q: 'Which active shipments face Red Sea rerouting, and do we pay carrier SLA penalties?',
          a: '<strong>3 containers</strong> (<code>MAERSK-882</code>, <code>MSC-419</code>, <code>CMA-204</code>) intersect Bab el-Mandeb advisories within 36h {{1}}. Under <strong>Master Freight Agreement §14.2</strong>, Cape rerouting triggers <strong>zero carrier penalty</strong> at UKMTO Level 3+ with bunker surcharge capped at 6.5% {{2}}, while Rotterdam Tier-A buffer stock covers 7 days {{3}}.',
          cites: ['d1', 'd2']
        },
        {
          q: 'Compare demurrage exposure in Rotterdam vs. Singapore for a 72-hour customs hold.',
          a: '<strong>Rotterdam Gate-4</strong> carries <strong>$18,400/day</strong> reefer demurrage across 14 boxes after Day 3 {{1}}, whereas <strong>Singapore PSA Berth-9</strong> remains under your 7-day enterprise free-time SLA {{2}}.',
          cites: ['d2', 'd3']
        }
      ]
    },

    medical: {
      id: 'medical',
      short: 'Science, Pharma & Medical Labs',
      brandDefault: 'Helix BioLabs Command',
      subtitle: 'CLINICAL TRIALS, COLD-CHAIN & LAB RAG',
      accentDefault: 'emerald',
      centerLat: 42, centerLon: 8,
      signals: [
        { id: 'm1', sev: 5, cat: 'COLD-CHAIN', title: 'MENA Airspace Reroute Adds +14h Transit to Basel Biologics Lots BIO-904 / BIO-911', loc: 'Basel → Doha Corridor', lat: 47.56, lon: 7.59, time: '18m ago', grade: 'A1', summary: 'Thermal shippers rated for 72h autonomous hold approach 75% excursion threshold; GMP SOP CC-114 requires Zurich dry-ice replenishment.', source: 'Cold-Chain IoT + NOTAM Feed' },
        { id: 'm2', sev: 4, cat: 'REGULATORY', title: 'EMA Annex 15 & FDA Draft Guidance Update on AI Biomarker Audit Trails', loc: 'Amsterdam / Bethesda', lat: 52.37, lon: 4.9, time: '1h ago', grade: 'A1', summary: 'Updated Good Clinical Practice validation rules require immutable provenance logs for AI-assisted pathology screening across EU Phase-III sites.', source: 'EMA / FDA Federal Register' },
        { id: 'm3', sev: 3, cat: 'TRIAL OPS', title: 'Phase-III Oncology Enrollment Velocity +22% Across Boston & Munich Sites', loc: 'Boston, MA', lat: 42.36, lon: -71.06, time: '3h ago', grade: 'A1', summary: 'Site BOS-04 & MUN-02 ahead of schedule; reagent kit Batch-409 awaiting Qualified Person (QP) release signature.', source: 'Internal CTMS Mirror' },
        { id: 'm4', sev: 3, cat: 'BIOSAFETY', title: 'Regional Cold-Storage Power Advisory Near Singapore Biomanufacturing Park', loc: 'Tuas, Singapore', lat: 1.32, lon: 103.64, time: '5h ago', grade: 'A2', summary: 'Scheduled utility substation switchover verified covered by N+2 backup cryo-generators.', source: 'Site SCADA + Facility Log' }
      ],
      arcs: [
        { from: [42.36, -71.06], to: [47.56, 7.59], color: '#10b981' },
        { from: [47.56, 7.59], to: [25.29, 51.53], color: '#ff6b35' },
        { from: [25.29, 51.53], to: [1.32, 103.64], color: '#38bdf8' }
      ],
      facilities: [
        { lat: 47.56, lon: 7.59, label: 'BASEL GMP LAB' },
        { lat: 42.36, lon: -71.06, label: 'BOSTON TRIAL HQ' },
        { lat: 52.2, lon: 0.12, label: 'CAMBRIDGE BIO' },
        { lat: 1.32, lon: 103.64, label: 'TUAS CRYO HUB' }
      ],
      geofences: [{ lat: 25.29, lon: 51.53, radiusDeg: 7.5, label: 'AIRSPACE REROUTE' }],
      docs: [
        { id: 'md1', name: 'GMP_ColdChain_Excursion_SOP_CC-114.pdf', meta: 'Section 4.2 · Page 8 · QA Controlled', snippet: 'When projected transit exceeds 75% of thermal shipper hold rating (54h on 72h units), mandatory pre-flight dry-ice top-up and QA Director electronic sign-off are triggered.', pinId: 'm1' },
        { id: 'md2', name: 'EMA_Annex15_PhaseIII_Batch409_Dossier.pdf', meta: 'Clinical QA Vault · RBAC: REG_AFFAIRS', snippet: 'IoT logger calibration certificates verified within 2–8°C tolerance; Batch-409 Qualified Person (QP) release field currently marked UNSIGNED.', pinId: 'm3' },
        { id: 'md3', name: 'FDA_EMA_AI_Biomarker_Validation_2026.pdf', meta: 'Regulatory Intelligence · Verified', snippet: 'AI-assisted diagnostic endpoints in pivotal trials require full dataset lineage, version locking, and auditable model decision citations.', pinId: 'm2' }
      ],
      prompts: [
        {
          q: 'Which biologics lots face cold-chain excursion risk today, and what is our exact GMP SOP?',
          a: '<strong>2 Basel biologics lots</strong> (<code>BIO-904</code>, <code>BIO-911</code>) incur +14h airspace rerouting approaching the 75% thermal shipper hold threshold {{1}}. Per <strong>GMP SOP CC-114 (§4.2)</strong>, execute Zurich dry-ice replenishment prior to departure and log QA Director electronic release {{1}}.',
          cites: ['md1']
        },
        {
          q: 'Audit our Phase-III Batch-409 customs dossier against EMA Annex 15 and AI validation rules.',
          a: 'Batch-409 cold-chain logger calibration satisfies <strong>EMA Annex 15</strong> (2–8°C verified), with <strong>1 open blocker</strong>: missing Qualified Person (QP) release signature {{1}}. Additionally, EU Phase-III AI pathology screening requires immutable provenance logs under updated 2026 EMA/FDA guidance {{2}}.',
          cites: ['md2', 'md3']
        }
      ]
    },

    journalism: {
      id: 'journalism',
      short: 'Journalism & Investigative Research',
      brandDefault: 'Meridian Investigative Desk',
      subtitle: 'OSINT, FOIA ARCHIVE & ADMIRALTY VERIFICATION',
      accentDefault: 'amber',
      centerLat: 36, centerLon: 16,
      signals: [
        { id: 'j1', sev: 5, cat: 'ACCOUNTABILITY', title: '18 Municipal & Federal Biometric Procurement Tenders Cross-Linked Across 7 Countries', loc: 'Washington, D.C. / EU', lat: 38.9, lon: -77.04, time: '28m ago', grade: 'A1', summary: 'FOIA contract ledger reveals overlapping subcontractor chains supplying automated biometric checkpoints without public algorithmic impact assessments.', source: 'FOIA Release #2026-441 + Court Dockets' },
        { id: 'j2', sev: 4, cat: 'DIGITAL RIGHTS', title: 'OONI & IODA Confirm Targeted Mobile Throttling During Regional Elections', loc: 'Nairobi / East Africa', lat: -1.29, lon: 36.82, time: '1h ago', grade: 'A1', summary: 'Independent network measurement probes logged 41% throughput collapse across 3 ASNs with verified PCAP signatures.', source: 'OONI Explorer + CIPESA Field Desk' },
        { id: 'j3', sev: 4, cat: 'TREATY / UN', title: 'Geneva UNODA GGE Consultations on Autonomous Weapons Human-Control Thresholds', loc: 'Geneva, Switzerland', lat: 46.2, lon: 6.14, time: '3h ago', grade: 'A1', summary: '14 state delegations tabled binding red-line language on target-selection autonomy; primary verbatim transcripts indexed.', source: 'UNODA Official Verbatim Archive' },
        { id: 'j4', sev: 3, cat: 'ARCHIVE HIT', title: 'Corporate Registry Link Between Shell Logistics Firm & Sanctioned Dual-Use Exports', loc: 'Limassol / London', lat: 51.51, lon: -0.13, time: '6h ago', grade: 'A2', summary: 'Companies House beneficial-ownership filings match shipping manifest consignee across 4 customs records.', source: 'UK Companies House + Trade Filings' }
      ],
      arcs: [
        { from: [38.9, -77.04], to: [46.2, 6.14], color: '#f59e0b' },
        { from: [46.2, 6.14], to: [-1.29, 36.82], color: '#10b981' },
        { from: [51.51, -0.13], to: [38.9, -77.04], color: '#38bdf8' }
      ],
      facilities: [
        { lat: 51.51, lon: -0.13, label: 'LONDON BUREAU' },
        { lat: 46.2, lon: 6.14, label: 'GENEVA DESK' },
        { lat: 38.9, lon: -77.04, label: 'DC FOIA UNIT' },
        { lat: -1.29, lon: 36.82, label: 'AFRICA DESK' }
      ],
      geofences: [{ lat: -1.29, lon: 36.82, radiusDeg: 7.0, label: 'OONI SHUTDOWN PROBE' }],
      docs: [
        { id: 'jd1', name: 'FOIA_Biometric_Procurement_2023_2026.csv', meta: 'Admiralty Grade: A1 · Verbatim Ledger', snippet: '18 verified contract awards totaling $148.2M cross-linked by legal entity ID, municipal jurisdiction, and absence of published impact assessment.', pinId: 'j1' },
        { id: 'jd2', name: 'UNODA_GGE_LAWS_Verbatim_2026.pdf', meta: 'Page 11 · Official UN Record', snippet: 'Joint working paper affirms that algorithmic targeting systems operating without meaningful human accountability violate IHL proportionality duties.', pinId: 'j3' },
        { id: 'jd3', name: 'CIPESA_OONI_Election_Probes_2026.json', meta: 'Verified Network Measurement · A1', snippet: '41.2% median drop in encrypted messaging handshakes across ASNs 33771 and 36914 confirmed via 640 independent OONI probes.', pinId: 'j2' }
      ],
      prompts: [
        {
          q: 'Pull all Admiralty A1 records linking biometric border procurement and UN legal submissions for our Sunday feature.',
          a: 'Matched <strong>18 Grade-A1 FOIA contracts</strong> totaling <strong>$148.2M</strong> lacking public algorithmic impact assessments {{1}}, alongside official <strong>Geneva UNODA GGE</strong> working-paper citations on meaningful human control {{2}}—formatted for immediate OSCOLA / fact-check export.',
          cites: ['jd1', 'jd2']
        },
        {
          q: 'Verify whether our East Africa internet-throttling tip is backed by independent probe data.',
          a: '<strong>Confirmed (Grade A1):</strong> 640 independent OONI probes corroborate a <strong>41.2% encrypted-handshake drop</strong> across two domestic ASNs during the reported window {{1}}.',
          cites: ['jd3']
        }
      ]
    },

    legal: {
      id: 'legal',
      short: 'Legal, M&A & Regulatory',
      brandDefault: 'Sterling Counsel AI',
      subtitle: '60-JURISDICTION STATUTORY & CONTRACT RAG',
      accentDefault: 'violet',
      centerLat: 47, centerLon: 5,
      signals: [
        { id: 'l1', sev: 5, cat: 'EU AI ACT', title: 'Art. 73 Serious-Incident Reporting Clocks Active for High-Risk Client Deployments', loc: 'Brussels / Munich', lat: 50.85, lon: 4.35, time: '22m ago', grade: 'A1', summary: 'Mandatory 2-day (critical infra) and 15-day (standard) incident deadlines apply to 2 German enterprise deployments missing SOP sign-offs.', source: 'Reg. (EU) 2024/1689 + Client Audit SQL' },
        { id: 'l2', sev: 4, cat: 'US STATE LAW', title: 'California SB 53 CalOES 24-Hour Imminent Harm Clock Mapped to Client Models', loc: 'Sacramento, CA', lat: 38.58, lon: -121.49, time: '1h ago', grade: 'A1', summary: 'Frontier model deployments serving California enterprises require 24h imminent-risk reporting and whistleblower carve-outs.', source: 'CA SB 53 §22757.12' },
        { id: 'l3', sev: 3, cat: 'APAC LAW', title: 'South Korea AI Basic Act Art. 36 Domestic Legal Representative Filing Window', loc: 'Seoul, South Korea', lat: 37.56, lon: 126.98, time: '3h ago', grade: 'A1', summary: 'Overseas AI providers above revenue/user thresholds must designate an in-country legal agent.', source: 'ROK AI Basic Act Decree 36053' },
        { id: 'l4', sev: 3, cat: 'DPA AUDIT', title: '3 Tier-1 Vendor DPAs Missing 2026 Zero-Model-Training Addendum', loc: 'London, UK', lat: 51.51, lon: -0.13, time: '5h ago', grade: 'A1', summary: 'Automated iManage repository audit flagged Vendors VND-104, VND-219, and VND-308 on legacy 2024 clause templates.', source: 'Private iManage DMS' }
      ],
      arcs: [
        { from: [50.85, 4.35], to: [38.58, -121.49], color: '#b366ff' },
        { from: [50.85, 4.35], to: [37.56, 126.98], color: '#00f5ff' },
        { from: [50.85, 4.35], to: [51.51, -0.13], color: '#10b981' }
      ],
      facilities: [
        { lat: 51.51, lon: -0.13, label: 'LONDON HQ' },
        { lat: 50.85, lon: 4.35, label: 'BRUSSELS OFFICE' },
        { lat: 40.71, lon: -74.01, label: 'NEW YORK' },
        { lat: 37.56, lon: 126.98, label: 'SEOUL DESK' }
      ],
      geofences: [{ lat: 50.85, lon: 4.35, radiusDeg: 8.0, label: 'EU AI ACT SCOPE' }],
      docs: [
        { id: 'ld1', name: 'Reg_EU_2024_1689_Art73.pdf', meta: 'Official Journal EU · Verified', snippet: 'Providers of high-risk AI systems placed on the Union market shall report any serious incident within 15 days (or 2 days for widespread critical infrastructure disruption).', pinId: 'l1' },
        { id: 'ld2', name: 'CA_SB53_Transparency_Act.pdf', meta: '§22757.12 · Verified Statute', snippet: 'Covered frontier developers must notify CalOES within 15 days of a critical safety incident, or within 24 hours where imminent risk of severe physical harm exists.', pinId: 'l2' },
        { id: 'ld3', name: 'iManage_Client_DPA_Audit_2026.sql', meta: 'Private DMS · RBAC: PARTNER', snippet: '3 active vendor contracts (VND-104, VND-219, VND-308) lack Section 8.4 Zero-Training Covenant required under Client AI Policy v2026.1.', pinId: 'l4' }
      ],
      prompts: [
        {
          q: 'Which client AI deployments face sub-15-day statutory reporting clocks in Germany and California?',
          a: '<strong>4 active deployments</strong> sit under binding sub-15-day clocks: <strong>EU AI Act Art. 73</strong> (≤2d critical infra / ≤15d standard) {{1}} and <strong>California SB 53</strong> (24h imminent / 15d standard to CalOES) {{2}}.',
          cites: ['ld1', 'ld2']
        },
        {
          q: 'Flag active vendor DPAs missing our 2026 zero-training AI addendum.',
          a: 'Private iManage scan flagged <strong>3 Tier-1 suppliers</strong> (<code>VND-104</code>, <code>VND-219</code>, <code>VND-308</code>) still executing under legacy 2024 DPA templates lacking Section 8.4 Zero-Training covenants {{1}}.',
          cites: ['ld3']
        }
      ]
    },

    finance: {
      id: 'finance',
      short: 'Finance, Insurance & Energy',
      brandDefault: 'Meridian Capital Risk',
      subtitle: 'PORTFOLIO EXPOSURE, SANCTIONS & ENERGY RADAR',
      accentDefault: 'sky',
      centerLat: 34, centerLon: 55,
      signals: [
        { id: 'f1', sev: 5, cat: 'EXPORT CTRL', title: 'BIS Sub-3nm Packaging Notice Impacts 3 Semi-Sleeve Portfolio Holdings (6.8% NAV)', loc: 'Hsinchu, Taiwan', lat: 24.4, lon: 119.5, time: '19m ago', grade: 'A1', summary: 'Supplier packaging lead times crossed 16 weeks—breaching your Q3 IC Memo 14-week collar hedge trigger.', source: 'BIS Notice + IC Vault Q3' },
        { id: 'f2', sev: 4, cat: 'ENERGY / WX', title: 'Terminal West-04 Enters 48h Category-2 Wind Cone — HSE OPS-77 Ready', loc: 'Gulf Coast, USA', lat: 29.73, lon: -93.87, time: '55m ago', grade: 'A1', summary: 'NOAA/EONET track intersects coastal LNG loading headers at T+46h; 24h pre-landfall pressure isolation protocol queued.', source: 'NASA EONET + Site Registry' },
        { id: 'f3', sev: 4, cat: 'REINSURANCE', title: '7 Specialty Marine Binders ($42.5M Limit) Overlap War-Risk Surcharge Band', loc: 'Zurich / Red Sea', lat: 47.37, lon: 8.54, time: '2h ago', grade: 'A1', summary: 'War-risk endorsement repricing threshold crossed across 7 active hull & cargo policies.', source: 'Underwriting Core SQL' },
        { id: 'f4', sev: 3, cat: 'GRID INFRA', title: 'Anomalous Anchor-Drag Loiter Detected 1.8 km From Baltic HVDC Segment B-12', loc: 'Baltic Sea', lat: 59.4, lon: 21.8, time: '4h ago', grade: 'A2', summary: 'Vessel speed <2.5 knots for 4.5h over subsea interconnect; SOP GRID-SUB-04 coastguard escalation triggered.', source: 'Subsea Layer + AIS Anomaly' }
      ],
      arcs: [
        { from: [38.9, -77.04], to: [24.4, 119.5], color: '#ff2d55' },
        { from: [24.4, 119.5], to: [47.37, 8.54], color: '#38bdf8' },
        { from: [47.37, 8.54], to: [59.4, 21.8], color: '#f59e0b' }
      ],
      facilities: [
        { lat: 47.37, lon: 8.54, label: 'ZURICH DESK' },
        { lat: 24.4, lon: 119.5, label: 'HSINCHU FABS' },
        { lat: 29.73, lon: -93.87, label: 'TERMINAL W-04' },
        { lat: 59.4, lon: 21.8, label: 'BALTIC HVDC' }
      ],
      geofences: [{ lat: 24.4, lon: 119.5, radiusDeg: 7.5, label: 'SEMI EXPOSURE ZONE' }],
      docs: [
        { id: 'fd1', name: 'IC_Semiconductor_Thesis_Q3_2026.pdf', meta: 'Page 9 · RBAC: PM_ANALYST', snippet: 'Risk Trigger: Initiate 40% downside put collar on Semi-Sleeve automatically whenever verified packaging lead times breach 14 weeks following sovereign export restrictions.', pinId: 'f1' },
        { id: 'fd2', name: 'HSE_Operations_Manual_OPS-77.pdf', meta: '§4.3 · Page 31 · Energy Ops', snippet: 'Level-2 Storm Shutdown: Depressurize coastal LNG transfer headers at T-24h pre-landfall, lock loading arms, and issue written dispatch notice to ISO Grid Control.', pinId: 'f2' },
        { id: 'fd3', name: 'Specialty_Marine_Binder_2026.sql', meta: 'Actuarial Underwriting DB', snippet: '7 active marine hull & cargo binders ($42.5M aggregate limit) transiting Bab el-Mandeb corridor qualify for 72-hour war-risk notice repricing.', pinId: 'f3' }
      ],
      prompts: [
        {
          q: 'Check our semiconductor portfolio hedge triggers against this week\'s BIS export controls.',
          a: '<strong>3 portfolio holdings</strong> (6.8% NAV) saw packaging lead times hit <strong>16 weeks</strong> following the BIS update—breaching your <strong>Q3 IC Memo</strong> 14-week automatic 40% downside put-collar trigger {{1}}.',
          cites: ['fd1']
        },
        {
          q: 'Pull our storm shutdown checklist for Terminal West-04 and active marine underwriting exposure.',
          a: '<strong>Terminal West-04</strong> enters the 55kt wind cone at T+46h—requiring <strong>HSE OPS-77</strong> manifold isolation at T-24h {{1}}. Separately, <strong>7 specialty marine binders ($42.5M)</strong> require war-risk notice repricing {{2}}.',
          cites: ['fd2', 'fd3']
        }
      ]
    },

    cyber: {
      id: 'cyber',
      short: 'Enterprise CISO & Security',
      brandDefault: 'Apex Security SOC',
      subtitle: 'GEO-CORRELATED THREAT & PLAYBOOK HUB',
      accentDefault: 'crimson',
      centerLat: 50, centerLon: 14,
      signals: [
        { id: 'c1', sev: 5, cat: 'ZERO-DAY', title: 'Active RCE PoC Matches 2 Frankfurt Monitoring Nodes (eu-mon-03 / eu-mon-07)', loc: 'Frankfurt DC-2, DE', lat: 50.11, lon: 8.68, time: '9m ago', grade: 'A1', summary: 'CMDB correlation matched unpatched telemetry collectors on VLAN-44; zero lateral beacons detected in EDR; IR Playbook SEC-09 queued.', source: 'CISA KEV + Internal CMDB' },
        { id: 'c2', sev: 4, cat: 'TELECOM / EW', title: '34% Regional Fiber Transit Drop & BGP Route Withdrawals Across Eastern Hub', loc: 'Kyiv / Eastern EU', lat: 50.45, lon: 30.52, time: '47m ago', grade: 'A1', summary: 'Field continuity SOP COMMS-ALT-02 authorizes automatic satcom check-in failover for all 12 regional personnel.', source: 'OONI/IODA + Field Registry' },
        { id: 'c3', sev: 3, cat: 'DUTY OF CARE', title: '2 Executive Auditors Entering Municipal Transit Strike Window', loc: 'Paris / Regional', lat: 48.85, lon: 2.35, time: '2h ago', grade: 'A2', summary: 'Airport transfer shifted by 90 minutes via verified corporate security advisory.', source: 'Travel Roster SQL + OSINT' }
      ],
      arcs: [
        { from: [50.45, 30.52], to: [50.11, 8.68], color: '#ff2d55' },
        { from: [50.11, 8.68], to: [51.51, -0.13], color: '#00f5ff' }
      ],
      facilities: [
        { lat: 50.11, lon: 8.68, label: 'FRANKFURT DC-2' },
        { lat: 51.51, lon: -0.13, label: 'LONDON SOC HQ' },
        { lat: 48.85, lon: 2.35, label: 'PARIS OFFICE' }
      ],
      geofences: [{ lat: 50.11, lon: 8.68, radiusDeg: 5.5, label: 'VLAN-44 PATCH SCOPE' }],
      docs: [
        { id: 'cd1', name: 'SOC_Incident_Playbook_SEC-09.md', meta: 'Air-Gapped Wiki · Priority-1 RCE', snippet: 'Step 1: Quarantine VLAN-44 ACLs. Step 2: Force-rotate SNMP v3 & collector API tokens. Step 3: Deploy vendor hotfix within 4 hours after memory capture.', pinId: 'c1' },
        { id: 'cd2', name: 'Field_Comms_SOP_ALT-02.pdf', meta: 'Corporate Security Vault', snippet: 'When terrestrial transit availability falls below 70% for >2 hours, regional field personnel switch primary check-ins to pre-provisioned encrypted satcom.', pinId: 'c2' }
      ],
      prompts: [
        {
          q: 'Correlate today\'s CISA KEV zero-day against our CMDB and pull immediate containment steps.',
          a: '<strong>2 Frankfurt hosts</strong> (<code>eu-mon-03</code>, <code>eu-mon-07</code> on <code>VLAN-44</code>) match the active RCE PoC. Execute <strong>IR Playbook SEC-09</strong>: apply VLAN-44 ACL quarantine, force-rotate SNMP v3 secrets, and patch within 4 hours {{1}}.',
          cites: ['cd1']
        },
        {
          q: 'Do Eastern Europe telecom outages trigger our backup satcom protocol?',
          a: '<strong>Yes:</strong> Verified OONI/IODA telemetry logged a 34% drop (66% availability) for >2 hours, automatically satisfying <strong>SOP COMMS-ALT-02</strong> encrypted satcom failover criteria {{1}}.',
          cites: ['cd2']
        }
      ]
    }
  };

  /* ── GLOBAL STATE ── */
  const state = {
    presetId: 'business',
    brandName: '',
    accentKey: 'cyan',
    uiMode: 'dark',       // 'dark' | 'light'
    viewport: '3d',       // '3d' | '2d'
    autoSpin: true,
    overlays: { assets: true, arcs: true, geofences: true, labels: true },
    leftTab: 'signals',   // 'signals' | 'docs' | 'byod'
    sevFilter: 'all',     // 'all' | 'critical'
    searchQ: '',
    selectedSignal: null,
    aiOpen: true,
    userDocTitle: 'Custom_Uploaded_Policy.txt',
    userDocText: ''
  };

  // Parse URL params for pre-branded shareable prospect demos!
  // Example: demo.html?preset=medical&brand=Roche+Clinical+Ops&accent=emerald&theme=dark&embed=1
  const qs = new URLSearchParams(window.location.search);
  const isEmbed = qs.get('embed') === '1';
  if (isEmbed) document.documentElement.classList.add('demo-embed');

  const initPreset = qs.get('preset');
  if (initPreset && PRESETS[initPreset]) state.presetId = initPreset;
  const p0 = PRESETS[state.presetId];
  state.brandName = (qs.get('brand') || p0.brandDefault).slice(0, 36);
  state.accentKey = (qs.get('accent') && ACCENTS[qs.get('accent')]) ? qs.get('accent') : p0.accentDefault;
  if (qs.get('theme') === 'light') state.uiMode = 'light';
  if (qs.get('view') === '2d') state.viewport = '2d';

  /* ── 3D NATURAL-EARTH GLOBE + 2D EQUAL-EARTH MAP ENGINE (ZERO WEBGL, 60FPS) ── */
  function createDemoMapEngine(canvas) {
    const ctx = canvas.getContext('2d');
    if (!ctx) return null;

    const rawRings = Array.isArray(window.SOV_WORLD_RINGS) ? window.SOV_WORLD_RINGS : [];
    const rings = [];
    for (let r = 0; r < rawRings.length; r++) {
      const flat = rawRings[r];
      if (!flat || flat.length < 6) continue;
      const pts = [];
      let cx = 0, cy = 0, cz = 0;
      for (let i = 0; i < flat.length; i += 2) {
        const lon = flat[i] * 0.1;
        const lat = flat[i + 1] * 0.1;
        const cp = Math.cos(lat * DEG);
        const u = [cp * Math.sin(lon * DEG), Math.sin(lat * DEG), cp * Math.cos(lon * DEG)];
        pts.push({ lon, lat, u });
        cx += u[0]; cy += u[1]; cz += u[2];
      }
      const len = Math.hypot(cx, cy, cz) || 1;
      rings.push({ pts, center: [cx / len, cy / len, cz / len] });
    }

    let w = 800, h = 540, dpr = 1;
    let curLat = p0.centerLat * DEG, curLon = p0.centerLon * DEG;
    let tgtLat = curLat, tgtLon = curLon;
    let zoom = 1.0;
    let isDragging = false, lx = 0, ly = 0, moved = false;
    let screenPins = [];

    function resize() {
      const rect = canvas.parentElement.getBoundingClientRect();
      w = Math.max(260, Math.round(rect.width));
      h = Math.max(260, Math.round(rect.height));
      dpr = Math.min(window.devicePixelRatio || 1, 1.75);
      canvas.width = Math.round(w * dpr);
      canvas.height = Math.round(h * dpr);
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    }

    function llUnit(latDeg, lonDeg) {
      const phi = latDeg * DEG, lam = lonDeg * DEG, cp = Math.cos(phi);
      return [cp * Math.sin(lam), Math.sin(phi), cp * Math.cos(lam)];
    }

    function proj3D(u, cLon, sLon, cLat, sLat, cx, cy, R) {
      const x1 = u[0] * cLon - u[2] * sLon;
      const z1 = u[0] * sLon + u[2] * cLon;
      const y2 = u[1] * cLat - z1 * sLat;
      const z2 = u[1] * sLat + z1 * cLat;
      const persp = 4.4 / (4.4 - z2);
      return { x: cx + x1 * R * persp, y: cy - y2 * R * persp, z: z2 };
    }

    function proj2D(latDeg, lonDeg, cx, cy, mapW, mapH) {
      // Clean Robinson-inspired curved pseudo-cylindrical projection
      const phi = latDeg * DEG;
      const cosScale = 0.56 + 0.44 * Math.cos(phi);
      const x = cx + (lonDeg / 180) * (mapW * 0.48) * cosScale;
      const y = cy - (latDeg / 90) * (mapH * 0.46);
      return { x, y, z: 1 };
    }

    function flyTo(latDeg, lonDeg) {
      tgtLat = Math.max(-72, Math.min(72, latDeg)) * DEG;
      tgtLon = lonDeg * DEG;
    }

    function stepZoom(dir) {
      zoom = Math.max(0.78, Math.min(2.4, zoom * (dir > 0 ? 1.2 : 1 / 1.2)));
    }

    function resetView() {
      const pr = PRESETS[state.presetId];
      zoom = 1.0;
      flyTo(pr.centerLat, pr.centerLon);
    }

    canvas.addEventListener('pointerdown', (e) => {
      isDragging = true; moved = false; lx = e.clientX; ly = e.clientY;
      canvas.setPointerCapture(e.pointerId);
    });
    canvas.addEventListener('pointermove', (e) => {
      if (!isDragging) return;
      const dx = e.clientX - lx, dy = e.clientY - ly;
      if (Math.abs(dx) + Math.abs(dy) > 3) moved = true;
      lx = e.clientX; ly = e.clientY;
      if (state.viewport === '3d') {
        tgtLon -= dx * 0.0075 / zoom;
        tgtLat = Math.max(-1.18, Math.min(1.18, tgtLat + dy * 0.0075 / zoom));
        curLon = tgtLon; curLat = tgtLat;
      }
    });
    canvas.addEventListener('pointerup', (e) => {
      if (!isDragging) return;
      isDragging = false;
      if (!moved) {
        const rect = canvas.getBoundingClientRect();
        const mx = e.clientX - rect.left, my = e.clientY - rect.top;
        for (let i = 0; i < screenPins.length; i++) {
          const sp = screenPins[i];
          if (Math.hypot(mx - sp.x, my - sp.y) <= 18) {
            selectSignal(sp.signal);
            return;
          }
        }
      }
    });
    canvas.addEventListener('wheel', (e) => {
      e.preventDefault();
      stepZoom(e.deltaY < 0 ? 1 : -1);
    }, { passive: false });

    window.addEventListener('resize', resize, { passive: true });
    resize();

    const sevColor = (s) => ({ 5: '#ff2d55', 4: '#ff6b35', 3: '#facc15', 2: '#22c55e', 1: '#38bdf8' }[s] || '#00f5ff');

    let t0 = performance.now();
    function frame(now) {
      requestAnimationFrame(frame);
      const elapsed = (now - t0) * 0.001;
      const pr = PRESETS[state.presetId];
      const acc = ACCENTS[state.accentKey] || ACCENTS.cyan;
      const [ar, ag, ab] = acc.rgb;
      const light = state.uiMode === 'light';

      ctx.clearRect(0, 0, w, h);
      const cx = w * 0.5, cy = h * 0.5;
      screenPins = [];

      if (state.viewport === '3d') {
        if (!isDragging) {
          if (state.autoSpin && !state.selectedSignal) tgtLon += 0.0014;
          let dLon = tgtLon - curLon;
          while (dLon > Math.PI) dLon -= Math.PI * 2;
          while (dLon < -Math.PI) dLon += Math.PI * 2;
          curLon += dLon * 0.075;
          curLat += (tgtLat - curLat) * 0.075;
        }
        const R = Math.min(w, h) * 0.40 * zoom;

        // Outer halo
        const halo = ctx.createRadialGradient(cx, cy, R * 0.85, cx, cy, R * 1.22);
        halo.addColorStop(0, light ? `rgba(${ar},${ag},${ab},0.22)` : `rgba(${ar},${ag},${ab},0.24)`);
        halo.addColorStop(1, 'rgba(0,0,0,0)');
        ctx.fillStyle = halo;
        ctx.beginPath(); ctx.arc(cx, cy, R * 1.22, 0, Math.PI * 2); ctx.fill();

        // Ocean body
        const ocean = ctx.createRadialGradient(cx - R * 0.28, cy - R * 0.25, R * 0.08, cx, cy, R);
        if (light) {
          ocean.addColorStop(0, '#dbeafe'); ocean.addColorStop(0.75, '#bfdbfe'); ocean.addColorStop(1, '#93c5fd');
        } else {
          ocean.addColorStop(0, '#1e354d'); ocean.addColorStop(0.72, '#0c1829'); ocean.addColorStop(1, '#040a14');
        }
        ctx.fillStyle = ocean;
        ctx.beginPath(); ctx.arc(cx, cy, R, 0, Math.PI * 2); ctx.fill();

        const cLon = Math.cos(curLon), sLon = Math.sin(curLon), cLat = Math.cos(curLat), sLat = Math.sin(curLat);

        ctx.save();
        ctx.beginPath(); ctx.arc(cx, cy, R, 0, Math.PI * 2); ctx.clip();

        // Graticule
        ctx.strokeStyle = light ? 'rgba(30,41,59,0.09)' : `rgba(${ar},${ag},${ab},0.08)`;
        ctx.lineWidth = 0.7;
        for (let lat = -60; lat <= 60; lat += 30) {
          ctx.beginPath(); let pen = false;
          for (let lon = -180; lon <= 180; lon += 12) {
            const p = proj3D(llUnit(lat, lon), cLon, sLon, cLat, sLat, cx, cy, R);
            if (p.z > 0) { if (!pen) { ctx.moveTo(p.x, p.y); pen = true; } else ctx.lineTo(p.x, p.y); } else pen = false;
          }
          ctx.stroke();
        }

        // Landmasses
        ctx.fillStyle = light ? '#f8fafc' : '#192638';
        ctx.strokeStyle = light ? '#94a3b8' : `rgba(${ar},${ag},${ab},0.46)`;
        ctx.lineWidth = 0.85;
        for (let i = 0; i < rings.length; i++) {
          const ring = rings[i];
          const cz1 = ring.center[0] * sLon + ring.center[2] * cLon;
          const cz2 = ring.center[1] * sLat + cz1 * cLat;
          if (cz2 < -0.55) continue;
          ctx.beginPath(); let pen = false, vis = 0;
          for (let k = 0; k < ring.pts.length; k++) {
            const p = proj3D(ring.pts[k].u, cLon, sLon, cLat, sLat, cx, cy, R);
            if (p.z > -0.05) { vis++; if (!pen) { ctx.moveTo(p.x, p.y); pen = true; } else ctx.lineTo(p.x, p.y); } else pen = false;
          }
          if (vis >= 3) { ctx.fill(); ctx.stroke(); }
        }

        // Geofences overlay
        if (state.overlays.geofences && pr.geofences) {
          pr.geofences.forEach((gf) => {
            const p = proj3D(llUnit(gf.lat, gf.lon), cLon, sLon, cLat, sLat, cx, cy, R);
            if (p.z <= 0.1) return;
            const gr = gf.radiusDeg * (R / 55);
            ctx.fillStyle = 'rgba(255, 45, 85, 0.12)';
            ctx.strokeStyle = 'rgba(255, 45, 85, 0.65)';
            ctx.setLineDash([4, 3]);
            ctx.lineWidth = 1.2;
            ctx.beginPath(); ctx.arc(p.x, p.y, gr, 0, Math.PI * 2); ctx.fill(); ctx.stroke();
            ctx.setLineDash([]);
          });
        }
        ctx.restore();

        // Rim
        ctx.strokeStyle = light ? 'rgba(2,132,199,0.55)' : `rgba(${ar},${ag},${ab},0.58)`;
        ctx.lineWidth = 1.4;
        ctx.beginPath(); ctx.arc(cx, cy, R, 0, Math.PI * 2); ctx.stroke();

        // Geodesic Arcs overlay
        if (state.overlays.arcs && pr.arcs) {
          pr.arcs.forEach((arc, ai) => {
            const uA = llUnit(arc.from[0], arc.from[1]), uB = llUnit(arc.to[0], arc.to[1]);
            const pts = [];
            for (let s = 0; s <= 26; s++) {
              const t = s / 26;
              let mx = uA[0] * (1 - t) + uB[0] * t, my = uA[1] * (1 - t) + uB[1] * t, mz = uA[2] * (1 - t) + uB[2] * t;
              const ml = Math.hypot(mx, my, mz) || 1;
              const alt = 1 + Math.sin(t * Math.PI) * 0.18;
              pts.push(proj3D([(mx / ml) * alt, (my / ml) * alt, (mz / ml) * alt], cLon, sLon, cLat, sLat, cx, cy, R));
            }
            ctx.strokeStyle = arc.color; ctx.globalAlpha = 0.5; ctx.lineWidth = 1.4;
            ctx.beginPath(); let pen = false;
            pts.forEach((pt) => { if (pt.z > -0.05) { if (!pen) { ctx.moveTo(pt.x, pt.y); pen = true; } else ctx.lineTo(pt.x, pt.y); } else pen = false; });
            ctx.stroke();
            const cPt = pts[Math.floor(((elapsed * 0.42 + ai * 0.31) % 1) * (pts.length - 1))];
            if (cPt && cPt.z > 0) {
              ctx.globalAlpha = 0.95; ctx.fillStyle = light ? '#0f172a' : '#fff';
              ctx.beginPath(); ctx.arc(cPt.x, cPt.y, 2.7, 0, Math.PI * 2); ctx.fill();
            }
            ctx.globalAlpha = 1;
          });
        }

        // Facilities overlay
        if (state.overlays.assets && pr.facilities) {
          pr.facilities.forEach((fac) => {
            const p = proj3D(llUnit(fac.lat, fac.lon), cLon, sLon, cLat, sLat, cx, cy, R);
            if (p.z <= 0.08) return;
            ctx.fillStyle = acc.hex;
            ctx.beginPath();
            ctx.moveTo(p.x, p.y - 4.5); ctx.lineTo(p.x + 4.5, p.y); ctx.lineTo(p.x, p.y + 4.5); ctx.lineTo(p.x - 4.5, p.y);
            ctx.closePath(); ctx.fill();
            if (state.overlays.labels) {
              ctx.font = '700 8px "JetBrains Mono", monospace';
              ctx.fillStyle = light ? '#0f172a' : 'rgba(226,232,240,0.82)';
              ctx.fillText(fac.label, p.x + 7, p.y + 3);
            }
          });
        }

        // Signal nodes
        pr.signals.forEach((sig, i) => {
          const p = proj3D(llUnit(sig.lat, sig.lon), cLon, sLon, cLat, sLat, cx, cy, R);
          if (p.z <= 0.05) return;
          const col = sevColor(sig.sev);
          const isSel = state.selectedSignal && state.selectedSignal.id === sig.id;
          screenPins.push({ x: p.x, y: p.y, signal: sig });
          const pulse = (elapsed * (isSel ? 2.1 : 1.1) + i * 0.25) % 1;
          ctx.strokeStyle = col; ctx.globalAlpha = (1 - pulse) * (isSel ? 0.95 : 0.65); ctx.lineWidth = isSel ? 2 : 1.2;
          ctx.beginPath(); ctx.arc(p.x, p.y, 6 + pulse * (isSel ? 22 : 14), 0, Math.PI * 2); ctx.stroke();
          ctx.globalAlpha = 1;
          ctx.fillStyle = col; ctx.beginPath(); ctx.arc(p.x, p.y, isSel ? 6 : 4.8, 0, Math.PI * 2); ctx.fill();
          ctx.strokeStyle = '#ffffff'; ctx.lineWidth = 1.4; ctx.stroke();

          if (isSel || (state.overlays.labels && i === 0)) {
            ctx.font = '700 8.5px "JetBrains Mono", monospace';
            const txt = `● S${sig.sev} · ${sig.loc.toUpperCase()}`;
            const pw = Math.min(200, Math.ceil(ctx.measureText(txt).width) + 16);
            const tx = Math.max(10, Math.min(w - pw - 10, p.x + 14));
            const ty = Math.max(14, Math.min(h - 44, p.y - 24));
            ctx.fillStyle = light ? 'rgba(255,255,255,0.94)' : 'rgba(5,9,20,0.92)';
            ctx.strokeStyle = col; ctx.lineWidth = 1.1;
            ctx.beginPath(); if (ctx.roundRect) ctx.roundRect(tx, ty, pw, 22, 6); else ctx.rect(tx, ty, pw, 22);
            ctx.fill(); ctx.stroke();
            ctx.fillStyle = light ? '#0f172a' : '#fff';
            ctx.fillText(txt, tx + 8, ty + 14);
          }
        });
      } else {
        // 2D EQUAL-EARTH MAP MODE
        const mapW = Math.min(w * 0.92, h * 1.85) * zoom;
        const mapH = mapW * 0.50;
        // Ocean oval
        ctx.fillStyle = light ? '#dbeafe' : '#0b172a';
        ctx.strokeStyle = light ? '#93c5fd' : `rgba(${ar},${ag},${ab},0.35)`;
        ctx.lineWidth = 1.3;
        ctx.beginPath();
        ctx.ellipse(cx, cy, mapW * 0.49, mapH * 0.47, 0, 0, Math.PI * 2);
        ctx.fill(); ctx.stroke();

        // 2D Landmasses
        ctx.fillStyle = light ? '#f8fafc' : '#192638';
        ctx.strokeStyle = light ? '#94a3b8' : `rgba(${ar},${ag},${ab},0.42)`;
        ctx.lineWidth = 0.8;
        for (let i = 0; i < rings.length; i++) {
          const pts = rings[i].pts;
          ctx.beginPath();
          let prevLon = null;
          for (let k = 0; k < pts.length; k++) {
            const p = proj2D(pts[k].lat, pts[k].lon, cx, cy, mapW, mapH);
            if (prevLon === null || Math.abs(pts[k].lon - prevLon) > 150) ctx.moveTo(p.x, p.y);
            else ctx.lineTo(p.x, p.y);
            prevLon = pts[k].lon;
          }
          ctx.fill(); ctx.stroke();
        }

        if (state.overlays.arcs && pr.arcs) {
          pr.arcs.forEach((arc) => {
            const a = proj2D(arc.from[0], arc.from[1], cx, cy, mapW, mapH);
            const b = proj2D(arc.to[0], arc.to[1], cx, cy, mapW, mapH);
            ctx.strokeStyle = arc.color; ctx.globalAlpha = 0.65; ctx.lineWidth = 1.5;
            ctx.beginPath(); ctx.moveTo(a.x, a.y);
            ctx.quadraticCurveTo((a.x + b.x) / 2, Math.min(a.y, b.y) - 28, b.x, b.y);
            ctx.stroke(); ctx.globalAlpha = 1;
          });
        }

        if (state.overlays.assets && pr.facilities) {
          pr.facilities.forEach((fac) => {
            const p = proj2D(fac.lat, fac.lon, cx, cy, mapW, mapH);
            ctx.fillStyle = acc.hex;
            ctx.beginPath(); ctx.arc(p.x, p.y, 3.5, 0, Math.PI * 2); ctx.fill();
            if (state.overlays.labels) {
              ctx.font = '700 8px "JetBrains Mono", monospace';
              ctx.fillStyle = light ? '#0f172a' : '#cbd5e1';
              ctx.fillText(fac.label, p.x + 6, p.y + 3);
            }
          });
        }

        pr.signals.forEach((sig) => {
          const p = proj2D(sig.lat, sig.lon, cx, cy, mapW, mapH);
          const col = sevColor(sig.sev);
          const isSel = state.selectedSignal && state.selectedSignal.id === sig.id;
          screenPins.push({ x: p.x, y: p.y, signal: sig });
          ctx.fillStyle = col;
          ctx.beginPath(); ctx.arc(p.x, p.y, isSel ? 7 : 5.5, 0, Math.PI * 2); ctx.fill();
          ctx.strokeStyle = '#ffffff'; ctx.lineWidth = 1.5; ctx.stroke();
        });
      }
    }
    requestAnimationFrame(frame);
    return { flyTo, stepZoom, resetView };
  }

  let mapEngine = null;

  /* ── UI RENDERING & STATE SYNCHRONIZATION ── */
  function applyThemeVars() {
    const acc = ACCENTS[state.accentKey] || ACCENTS.cyan;
    document.documentElement.style.setProperty('--dm-accent', acc.hex);
    document.documentElement.style.setProperty('--dm-accent-rgb', acc.rgb.join(','));
    document.documentElement.setAttribute('data-demo-theme', state.uiMode);

    const pr = PRESETS[state.presetId];
    const titleEl = document.getElementById('dm-brand-title');
    const subEl = document.getElementById('dm-brand-sub');
    const aiTitle = document.getElementById('dm-ai-title');
    if (titleEl) titleEl.textContent = (state.brandName || pr.brandDefault).toUpperCase();
    if (subEl) subEl.textContent = pr.subtitle;
    if (aiTitle) {
      const b = (state.brandName || pr.brandDefault).trim();
      aiTitle.textContent = /\bAI$/i.test(b) ? `Ask ${b}` : `Ask ${b} AI`;
    }

    // Sync commission CTA link with live brand/preset configuration
    const commBtn = document.getElementById('dm-commission-btn');
    if (commBtn) {
      const scope = `White-Label Demo (${state.brandName || pr.brandDefault} · ${pr.short} · ${state.viewport.toUpperCase()} + ${state.uiMode} theme)`;
      commBtn.href = `enterprise.html?usecase=${pr.id === 'business' ? 'logistics' : pr.id === 'medical' ? 'health' : pr.id === 'journalism' ? 'research' : pr.id}&scope=${encodeURIComponent(scope)}`;
    }
  }

  function renderLeftPane() {
    const pr = PRESETS[state.presetId];
    const body = document.getElementById('dm-left-body');
    if (!body) return;

    document.querySelectorAll('.dm-ltab').forEach((b) => b.classList.toggle('active', b.dataset.ltab === state.leftTab));

    if (state.leftTab === 'signals') {
      const q = state.searchQ.toLowerCase();
      const filtered = pr.signals.filter((s) => {
        if (state.sevFilter === 'critical' && s.sev < 4) return false;
        if (q && !(s.title + s.loc + s.cat + s.summary).toLowerCase().includes(q)) return false;
        return true;
      });
      body.innerHTML = filtered.map((s) => `
        <button type="button" class="dm-sig-card ${state.selectedSignal && state.selectedSignal.id === s.id ? 'selected' : ''}" data-sig="${s.id}">
          <div class="dm-sig-top">
            <span class="dm-cat">${s.cat}</span>
            <span class="dm-sev s${s.sev}">S${s.sev}</span>
            <span class="dm-grade">${s.grade}</span>
            <span class="dm-time">${s.time}</span>
          </div>
          <div class="dm-sig-title">${s.title}</div>
          <div class="dm-sig-loc">📍 ${s.loc}</div>
        </button>
      `).join('') || '<div class="dm-empty">No matching signals.</div>';

      body.querySelectorAll('[data-sig]').forEach((btn) => {
        btn.addEventListener('click', () => {
          const found = pr.signals.find((x) => x.id === btn.dataset.sig);
          if (found) selectSignal(found);
        });
      });
    } else if (state.leftTab === 'docs') {
      const allDocs = [...pr.docs];
      if (state.userDocText.trim()) {
        allDocs.unshift({ id: 'user-doc', name: state.userDocTitle, meta: 'USER PASTED · LOCAL BROWSER INDEX', snippet: state.userDocText.slice(0, 180) + (state.userDocText.length > 180 ? '…' : '') });
      }
      body.innerHTML = `
        <div class="dm-vault-note">🔒 100% isolated VPC vector index (${allDocs.length} sources active). Click any source to query it in Private AI.</div>
        ${allDocs.map((d) => `
          <div class="dm-doc-card">
            <div class="dm-doc-name">📄 ${d.name}</div>
            <div class="dm-doc-meta">${d.meta}</div>
            <div class="dm-doc-snip">${d.snippet}</div>
          </div>
        `).join('')}
      `;
    } else {
      body.innerHTML = `
        <div class="dm-byod">
          <div class="dm-byod-kicker">🧪 TEST WITH YOUR OWN TEXT (100% LOCAL IN BROWSER)</div>
          <p class="dm-byod-sub">Paste any sample policy clause, research note, or operational SOP below. Zero bytes leave your browser—then ask the Private AI drawer on the right about it!</p>
          <input type="text" id="dm-byod-title" class="dm-input" value="${state.userDocTitle.replace(/"/g, '&quot;')}" placeholder="Document title (e.g. Internal_SOP_2026.pdf)" />
          <textarea id="dm-byod-text" class="dm-textarea" placeholder="Paste any paragraph, contract clause, lab SOP, or briefing note here...">${state.userDocText}</textarea>
          <button type="button" id="dm-byod-save" class="dm-btn-accent" style="width:100%;">⚡ Index Into Local Private AI</button>
          <div id="dm-byod-status" class="dm-byod-status"></div>
        </div>
      `;
      const saveBtn = document.getElementById('dm-byod-save');
      if (saveBtn) {
        saveBtn.addEventListener('click', () => {
          state.userDocTitle = (document.getElementById('dm-byod-title').value || 'Uploaded_Document.txt').trim();
          state.userDocText = (document.getElementById('dm-byod-text').value || '').trim();
          const st = document.getElementById('dm-byod-status');
          if (state.userDocText) {
            st.textContent = `✓ Indexed "${state.userDocTitle}" (${state.userDocText.split(/\s+/).length} words). Ask the Private AI drawer any question about it!`;
            state.aiOpen = true;
            syncAiDrawerVisibility();
            appendAiMessage('system', `Indexed your local document <strong>${state.userDocTitle}</strong> into private session memory. Try asking a question referencing keywords from your text!`);
          } else {
            st.textContent = 'Paste some sample text above first.';
          }
        });
      }
    }
  }

  function selectSignal(sig) {
    state.selectedSignal = sig;
    if (mapEngine && sig) mapEngine.flyTo(sig.lat, sig.lon);
    renderLeftPane();
    const card = document.getElementById('dm-dossier');
    if (!card) return;
    if (!sig) { card.classList.remove('open'); return; }
    card.classList.add('open');
    card.innerHTML = `
      <div class="dm-dos-head">
        <div>
          <span class="dm-sev s${sig.sev}">S${sig.sev}</span>
          <span class="dm-cat" style="margin-left:6px;">${sig.cat}</span>
          <span class="dm-grade" style="margin-left:6px;">GRADE ${sig.grade}</span>
        </div>
        <button type="button" class="dm-icon-x" id="dm-dos-close">✕</button>
      </div>
      <h4>${sig.title}</h4>
      <div class="dm-dos-loc">📍 ${sig.loc} · ${sig.time} · Source: ${sig.source}</div>
      <p>${sig.summary}</p>
      <div class="dm-dos-actions">
        <button type="button" id="dm-dos-ask" class="dm-btn-accent">✨ Ask Private AI About This</button>
      </div>
    `;
    document.getElementById('dm-dos-close').addEventListener('click', () => selectSignal(null));
    document.getElementById('dm-dos-ask').addEventListener('click', () => {
      state.aiOpen = true;
      syncAiDrawerVisibility();
      runPrivateAiQuery(`Explain operational impact & verified SOP for: ${sig.title}`);
    });
  }

  /* ── PRIVATE RAG AI DRAWER ENGINE (PREBUILT + LIVE KEYWORD RETRIEVAL OVER USER TEXT) ── */
  function syncAiDrawerVisibility() {
    const drawer = document.getElementById('dm-ai-drawer');
    if (drawer) drawer.classList.toggle('open', state.aiOpen);
  }

  function appendAiMessage(role, html, citations = []) {
    const log = document.getElementById('dm-ai-log');
    if (!log) return;
    const div = document.createElement('div');
    div.className = `dm-msg dm-msg-${role}`;
    div.innerHTML = html;
    if (citations.length) {
      const cWrap = document.createElement('div');
      cWrap.className = 'dm-msg-cites';
      citations.forEach((c, idx) => {
        const b = document.createElement('button');
        b.type = 'button';
        b.className = 'dm-cite-chip';
        b.innerHTML = `<span>[${idx + 1}]</span> ${c.name}`;
        b.addEventListener('click', () => showProvenanceToast(c, idx + 1));
        cWrap.appendChild(b);
      });
      div.appendChild(cWrap);
    }
    log.appendChild(div);
    log.scrollTop = log.scrollHeight;
  }

  function showProvenanceToast(doc, num, openDossier = true) {
    const box = document.getElementById('dm-ai-prov');
    if (!box) return;
    box.classList.add('open');
    box.innerHTML = `
      <div class="dm-prov-top"><span>✓ CITATION [${num}] PROVENANCE</span><button type="button" id="dm-prov-x">✕</button></div>
      <div class="dm-prov-title">${doc.name}</div>
      <div class="dm-prov-meta">${doc.meta}</div>
      <div class="dm-prov-quote">"${doc.snippet}"</div>
    `;
    document.getElementById('dm-prov-x').addEventListener('click', () => box.classList.remove('open'));
    if (doc.pinId) {
      const sig = PRESETS[state.presetId].signals.find((s) => s.id === doc.pinId);
      if (sig) {
        if (openDossier) selectSignal(sig);
        else if (mapEngine) mapEngine.flyTo(sig.lat, sig.lon);
      }
    }
  }

  function runPrivateAiQuery(queryText, autoInit = false) {
    const q = queryText.trim();
    if (!q) return;
    appendAiMessage('user', q.replace(/</g, '&lt;'));
    const pr = PRESETS[state.presetId];

    // 1. Check exact starter prompt match
    const exact = pr.prompts.find((p) => p.q.toLowerCase() === q.toLowerCase());
    if (exact) {
      const cites = exact.cites.map((id) => pr.docs.find((d) => d.id === id)).filter(Boolean);
      const html = exact.a.replace(/\{\{(\d+)\}\}/g, (_, n) => `<span class="dm-ic">[${n}]</span>`);
      setTimeout(() => {
        appendAiMessage('ai', html, cites);
        if (cites[0]) showProvenanceToast(cites[0], 1, !autoInit);
      }, autoInit ? 60 : 280);
      return;
    }

    // 2. Live lexical retrieval across User-Pasted Text + Industry Docs + Signals!
    const words = q.toLowerCase().split(/[^a-z0-9]+/).filter((w) => w.length > 3);
    const pool = [...pr.docs];
    if (state.userDocText.trim()) {
      const sentences = state.userDocText.split(/(?<=[.!?])\s+/).filter(Boolean);
      const bestSent = sentences.sort((a, b) => {
        const sa = words.reduce((acc, w) => acc + (a.toLowerCase().includes(w) ? 1 : 0), 0);
        const sb = words.reduce((acc, w) => acc + (b.toLowerCase().includes(w) ? 1 : 0), 0);
        return sb - sa;
      })[0] || state.userDocText.slice(0, 220);
      pool.unshift({ id: 'user-doc', name: state.userDocTitle, meta: 'USER LOCAL DOCUMENT · ZERO-RETENTION BROWSER INDEX', snippet: bestSent });
    }

    const scored = pool.map((d) => {
      const hay = (d.name + ' ' + d.snippet).toLowerCase();
      let score = words.reduce((acc, w) => acc + (hay.includes(w) ? 2 : 0), 0);
      if (d.id === 'user-doc' && score > 0) score += 3;
      return { doc: d, score };
    }).sort((a, b) => b.score - a.score);

    const top = scored.filter((x) => x.score > 0).slice(0, 2).map((x) => x.doc);
    setTimeout(() => {
      if (top.length) {
        const summary = top.map((d, i) => `Per <strong>${d.name}</strong> <span class="dm-ic">[${i + 1}]</span>: "${d.snippet}"`).join('<br/><br/>');
        appendAiMessage('ai', summary, top);
        showProvenanceToast(top[0], 1);
      } else {
        appendAiMessage('ai', `<strong>Citation-Lock Guardrail Active:</strong> No verified chunk in the current private index directly answers that query (0 hallucinated facts invented). Try one of the industry starter prompts above, or paste your own reference text in the <strong>+ TEST YOUR TEXT</strong> tab!`, []);
      }
    }, 300);
  }

  function loadPreset(presetId, preserveBrand = false) {
    const pr = PRESETS[presetId] || PRESETS.business;
    state.presetId = pr.id;
    if (!preserveBrand) {
      state.brandName = pr.brandDefault;
      state.accentKey = pr.accentDefault;
    }
    state.selectedSignal = null;
    const dos = document.getElementById('dm-dossier');
    if (dos) dos.classList.remove('open');

    document.querySelectorAll('.dm-preset-btn').forEach((b) => b.classList.toggle('active', b.dataset.preset === pr.id));
    const brandIn = document.getElementById('dm-brand-input');
    if (brandIn) brandIn.value = state.brandName;
    document.querySelectorAll('.dm-swatch').forEach((s) => s.classList.toggle('active', s.dataset.accent === state.accentKey));

    applyThemeVars();
    renderLeftPane();
    if (mapEngine) mapEngine.flyTo(pr.centerLat, pr.centerLon);

    // Populate AI starter queries & welcome message
    const starters = document.getElementById('dm-ai-starters');
    const log = document.getElementById('dm-ai-log');
    if (log) log.innerHTML = '';
    if (starters) {
      starters.innerHTML = pr.prompts.map((p, i) =>
        `<button type="button" class="dm-starter-btn" data-st="${i}">${p.q}</button>`
      ).join('');
      starters.querySelectorAll('[data-st]').forEach((btn) => {
        btn.addEventListener('click', () => runPrivateAiQuery(pr.prompts[Number(btn.dataset.st)].q));
      });
    }
    // Automatically run first flagship citation-locked query without obstructing the initial 3D globe
    runPrivateAiQuery(pr.prompts[0].q, true);
  }

  document.addEventListener('DOMContentLoaded', () => {
    const canvas = document.getElementById('dm-map-canvas');
    if (canvas) mapEngine = createDemoMapEngine(canvas);

    // Build preset switcher pills
    const presetBar = document.getElementById('dm-preset-bar');
    if (presetBar) {
      presetBar.innerHTML = Object.values(PRESETS).map((pr) =>
        `<button type="button" class="dm-preset-btn" data-preset="${pr.id}">${pr.short}</button>`
      ).join('');
      presetBar.querySelectorAll('.dm-preset-btn').forEach((btn) => {
        btn.addEventListener('click', () => loadPreset(btn.dataset.preset, false));
      });
    }

    // Left tabs & search/severity filters
    document.querySelectorAll('.dm-ltab').forEach((btn) => {
      btn.addEventListener('click', () => { state.leftTab = btn.dataset.ltab; renderLeftPane(); });
    });
    const searchEl = document.getElementById('dm-search');
    if (searchEl) searchEl.addEventListener('input', (e) => { state.searchQ = e.target.value; renderLeftPane(); });
    document.querySelectorAll('[data-sev]').forEach((btn) => {
      btn.addEventListener('click', () => {
        state.sevFilter = btn.dataset.sev;
        document.querySelectorAll('[data-sev]').forEach((b) => b.classList.toggle('active', b === btn));
        renderLeftPane();
      });
    });

    // Customize popover
    const custBtn = document.getElementById('dm-customize-btn');
    const custPop = document.getElementById('dm-customize-pop');
    if (custBtn && custPop) {
      custBtn.addEventListener('click', (e) => { e.stopPropagation(); custPop.classList.toggle('open'); });
      document.addEventListener('click', (e) => { if (!custPop.contains(e.target) && e.target !== custBtn) custPop.classList.remove('open'); });
    }
    const brandIn = document.getElementById('dm-brand-input');
    if (brandIn) {
      brandIn.addEventListener('input', (e) => {
        state.brandName = e.target.value.slice(0, 36);
        applyThemeVars();
      });
    }
    const swatchRow = document.getElementById('dm-swatches');
    if (swatchRow) {
      swatchRow.innerHTML = Object.entries(ACCENTS).map(([k, v]) =>
        `<button type="button" class="dm-swatch" data-accent="${k}" style="background:${v.hex};" title="${v.name}"></button>`
      ).join('');
      swatchRow.querySelectorAll('.dm-swatch').forEach((b) => {
        b.addEventListener('click', () => {
          state.accentKey = b.dataset.accent;
          swatchRow.querySelectorAll('.dm-swatch').forEach((s) => s.classList.toggle('active', s === b));
          applyThemeVars();
        });
      });
    }
    document.querySelectorAll('[data-uimode]').forEach((b) => {
      b.addEventListener('click', () => {
        state.uiMode = b.dataset.uimode;
        document.querySelectorAll('[data-uimode]').forEach((x) => x.classList.toggle('active', x === b));
        applyThemeVars();
      });
    });
    document.querySelectorAll('[data-vp]').forEach((b) => {
      b.addEventListener('click', () => {
        state.viewport = b.dataset.vp;
        document.querySelectorAll('[data-vp]').forEach((x) => x.classList.toggle('active', x === b));
        applyThemeVars();
      });
    });

    // Share pre-branded URL button
    const shareBtn = document.getElementById('dm-copy-share');
    if (shareBtn) {
      shareBtn.addEventListener('click', () => {
        const u = new URL(window.location.href.split('?')[0]);
        u.searchParams.set('preset', state.presetId);
        u.searchParams.set('brand', state.brandName || PRESETS[state.presetId].brandDefault);
        u.searchParams.set('accent', state.accentKey);
        u.searchParams.set('theme', state.uiMode);
        u.searchParams.set('view', state.viewport);
        navigator.clipboard?.writeText(u.toString()).catch(() => {});
        shareBtn.textContent = '✓ Branded Demo Link Copied!';
        setTimeout(() => { shareBtn.textContent = '🔗 Copy Pre-Branded Share Link'; }, 2200);
      });
    }

    // Map zoom & overlay dock
    document.getElementById('dm-z-in')?.addEventListener('click', () => mapEngine?.stepZoom(1));
    document.getElementById('dm-z-out')?.addEventListener('click', () => mapEngine?.stepZoom(-1));
    document.getElementById('dm-z-rst')?.addEventListener('click', () => mapEngine?.resetView());
    document.querySelectorAll('[data-ov]').forEach((btn) => {
      btn.addEventListener('click', () => {
        const k = btn.dataset.ov;
        if (k === 'spin') { state.autoSpin = !state.autoSpin; btn.classList.toggle('active', state.autoSpin); return; }
        state.overlays[k] = !state.overlays[k];
        btn.classList.toggle('active', state.overlays[k]);
      });
    });

    // AI Drawer toggle & form
    document.getElementById('dm-ai-toggle')?.addEventListener('click', () => {
      state.aiOpen = !state.aiOpen;
      syncAiDrawerVisibility();
    });
    document.getElementById('dm-ai-close')?.addEventListener('click', () => {
      state.aiOpen = false;
      syncAiDrawerVisibility();
    });
    document.getElementById('dm-ai-form')?.addEventListener('submit', (e) => {
      e.preventDefault();
      const inp = document.getElementById('dm-ai-input');
      if (inp && inp.value.trim()) {
        runPrivateAiQuery(inp.value);
        inp.value = '';
      }
    });

    // Initial load (preserve URL brand if provided!)
    if (window.innerWidth < 960) state.aiOpen = false;
    syncAiDrawerVisibility();
    loadPreset(state.presetId, Boolean(qs.get('brand')));
  });
})();
