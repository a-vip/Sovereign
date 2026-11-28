/* ─── SOVEREIGN WHITE-LABEL DEMO STUDIO ENGINE v2 (100% 3D GLOBE + REAL INDUSTRY WORKFLOWS) ─── */
/* Functional client demonstration: 6 verticals with interactive live operations tables,
   dynamic computed KPIs, real client-side CSV/TXT/JSON import plotting pins directly onto
   the deep-zoom 3D Natural-Earth Vector Globe, custom logo/brand/module white-labeling,
   branded executive brief export, and citation-locked Private RAG AI. */

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
      opsTitle: 'LIVE SHIPMENT & CONTAINER MANIFEST',
      sampleCsv: `name,lat,lon,category,metric,notes
Rotterdam Cold-Vault Annex,51.91,4.45,PORT OPS,$12400/day,14 Tier-A pharma reefers awaiting customs release
Suez South Anchorage,29.92,32.55,MARITIME,36h Hold,Container vessel MAERSK-882 evaluating Cape reroute
Port of Felixstowe Berth 7,51.95,1.31,HUB,94% Util,UK import gateway operating within 48h SLA buffer
Jebel Ali Distribution Node,25.01,55.06,HUB,Active,Middle East transshipment buffer stock 11.5 days`,
      signals: [
        { id: 'b1', sev: 5, cat: 'MARITIME', title: 'Bab el-Mandeb GNSS Spoofing & Diversion Corridor Alert', loc: 'Red Sea / Aden', lat: 13.1, lon: 43.3, time: '14m ago', grade: 'A1', exposureUsd: 420000, actionLabel: 'Authorize Cape Reroute', resolvedLabel: 'Cape Reroute Active', summary: '3 Q4 container ships (MAERSK-882, MSC-419, CMA-204) intersect UKMTO Advisory 094/26 within 36 hours.', source: 'SAP TMS Live Mirror + UKMTO Feed' },
        { id: 'b2', sev: 4, cat: 'PORT OPS', title: 'Rotterdam Automated Terminal Gate-4 Reefer Queue Spike', loc: 'Rotterdam, NL', lat: 51.92, lon: 4.48, time: '42m ago', grade: 'A1', exposureUsd: 184000, actionLabel: 'Dispatch Priority Customs', resolvedLabel: 'Customs Expedited', summary: 'Cold-chain demurrage exposure reaches $18,400/day across 14 active reefer units if clearance extends 48h.', source: 'Port Telemetry + Rotterdam Tariff 2026' },
        { id: 'b3', sev: 3, cat: 'CORRIDOR', title: 'Panama Canal Neopanamax Draft Slot Adjustment', loc: 'Colon, Panama', lat: 9.35, lon: -79.9, time: '2h ago', grade: 'A2', exposureUsd: 65000, actionLabel: 'Lock Slot Buffer', resolvedLabel: 'Slot Confirmed', summary: 'Daily transit reservations adjusted to 32 slots; West Coast reroute buffer verified.', source: 'ACP Maritime Notice + ERP Ledger' },
        { id: 'b4', sev: 2, cat: 'HUB STATUS', title: 'Singapore PSA Berth-9 High Utilization (91%) — Tier-1 Free Time Intact', loc: 'Singapore', lat: 1.35, lon: 103.82, time: '4h ago', grade: 'A1', exposureUsd: 0, actionLabel: 'Confirm 7-Day SLA', resolvedLabel: 'SLA Verified', summary: 'Enterprise SLA guarantees 7 calendar days port storage free time prior to demurrage.', source: 'PSA Singapore SLA Annex B' }
      ],
      opsRows: [
        { id: 'MAERSK-882', label: 'Vessel MAERSK-882 · 420 TEU', route: 'Singapore → Rotterdam', lat: 13.1, lon: 43.3, risk: 'crit', statusText: 'UKMTO L3 ALERT', doneText: 'REROUTED CAPE', exposure: 195000, detail: 'Bunker cap 6.5% verified under MFA §14.2 · 0 carrier SLA penalty.', actionText: 'Execute Cape Reroute' },
        { id: 'MSC-419', label: 'Vessel MSC-419 · 310 TEU', route: 'Jebel Ali → Felixstowe', lat: 14.5, lon: 42.1, risk: 'crit', statusText: 'GNSS SPOOF RISK', doneText: 'REROUTED CAPE', exposure: 145000, detail: 'AIS drift detected 18nm N of Perim Island · backup INS active.', actionText: 'Execute Cape Reroute' },
        { id: 'RTM-RFR-14', label: '14x Reefer Batch (Gate-4)', route: 'Rotterdam EU-West', lat: 51.92, lon: 4.48, risk: 'warn', statusText: '$18.4k/DAY RISK', doneText: 'PRIORITY CLEARED', exposure: 92000, detail: 'Day-3 tariff escalation at EUR 1,210/unit/day · Tier-A buffer 7d.', actionText: 'Expedite Customs' },
        { id: 'PSA-B09', label: 'PSA Berth-9 Inventory', route: 'Singapore APAC Hub', lat: 1.35, lon: 103.82, risk: 'ok', statusText: 'SLA COVERED', doneText: 'SLA VERIFIED', exposure: 0, detail: '7 calendar days contracted storage free-time verified.', actionText: 'Verify SLA', defaultDone: true }
      ],
      arcs: [
        { from: [1.35, 103.82], to: [13.1, 43.3], color: '#ff6b35', label: 'Asia–Red Sea Trunk' },
        { from: [13.1, 43.3], to: [51.92, 4.48], color: '#00f5ff', label: 'Suez–Rotterdam Line' },
        { from: [1.35, 103.82], to: [9.35, -79.9], color: '#38bdf8', label: 'Trans-Pacific Corridor' }
      ],
      facilities: [
        { lat: 51.92, lon: 4.48, label: 'EU-WEST HUB', role: 'Automated Cold-Chain Terminal · 94% Cap' },
        { lat: 1.35, lon: 103.82, label: 'APAC HUB', role: 'PSA Berth-9 Consolidation · 7d Free SLA' },
        { lat: 33.74, lon: -118.27, label: 'LA PORT', role: 'US West Coast Gateway · Operational' },
        { lat: 25.01, lon: 55.06, label: 'JEBEL ALI', role: 'MENA Buffer Depot · 11.5d Stock' }
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
          a: '<strong>3 containers</strong> (<code>MAERSK-882</code>, <code>MSC-419</code>, <code>CMA-204</code>) intersect Bab el-Mandeb advisories within 36h {{1}}. Under <strong>Master Freight Agreement §14.2</strong>, Cape rerouting triggers <strong>zero carrier penalty</strong> at UKMTO Level 3+ with bunker surcharge capped at 6.5% {{1}}, while Rotterdam Tier-A buffer stock covers 7 days {{2}}.',
          cites: ['d1', 'd2']
        },
        {
          q: 'Compare demurrage exposure in Rotterdam vs. Singapore for a 72-hour customs hold.',
          a: '<strong>Rotterdam Gate-4</strong> carries <strong>$18,400/day</strong> reefer demurrage across 14 boxes after Day 3 {{1}}, whereas <strong>Singapore PSA Berth-9</strong> remains under your 7-day enterprise free-time SLA {{2}}.',
          cites: ['d2', 'd3']
        }
      ],
      computeKpis(pr, doneOps, customPins) {
        const remExposure = pr.opsRows.reduce((s, r) => s + (doneOps.has(r.id) ? 0 : (r.exposure || 0)), 0);
        const mitigated = pr.opsRows.filter((r) => doneOps.has(r.id)).length;
        return [
          { label: 'Active Exposure', val: `$${(remExposure / 1000).toFixed(0)}k`, cls: remExposure > 0 ? 'danger' : 'good', sub: remExposure > 0 ? 'Click Live Ops to mitigate' : 'All corridors mitigated' },
          { label: 'Ops Mitigated', val: `${mitigated} / ${pr.opsRows.length}`, cls: mitigated === pr.opsRows.length ? 'good' : 'accent', sub: 'Live ERP actions' },
          { label: 'Active Sites', val: String(pr.facilities.length + customPins.length), cls: 'accent', sub: customPins.length ? `+${customPins.length} CSV pins` : '4 hubs online' },
          { label: 'Private Vault', val: `${pr.docs.length + (state.userDocs.length)} docs`, cls: 'good', sub: '0-retention RAG' }
        ];
      }
    },

    medical: {
      id: 'medical',
      short: 'Science, Pharma & Medical Labs',
      brandDefault: 'Helix BioLabs Command',
      subtitle: 'CLINICAL TRIALS, COLD-CHAIN & LAB RAG',
      accentDefault: 'emerald',
      centerLat: 42, centerLon: 8,
      opsTitle: 'COLD-CHAIN BIOLOGICS & GMP LOT MONITOR',
      sampleCsv: `name,lat,lon,category,metric,notes
Zurich Dry-Ice Depot,47.46,8.55,COLD-CHAIN,2.8C Nominal,Pre-flight dry ice recharge station for Lot BIO-904
Cambridge Genomics Core,52.20,0.12,TRIAL OPS,Phase-III,48 patient biomarker samples cleared EMA Annex 15
Munich Oncology Site MUN-02,48.14,11.58,TRIAL OPS,+22% Enrol,Awaiting QP electronic sign-off on Batch-409`,
      signals: [
        { id: 'm1', sev: 5, cat: 'COLD-CHAIN', title: 'MENA Airspace Reroute Adds +14h Transit to Basel Biologics Lots BIO-904 / BIO-911', loc: 'Basel → Doha Corridor', lat: 47.56, lon: 7.59, time: '18m ago', grade: 'A1', actionLabel: 'Authorize Dry-Ice Top-Up', resolvedLabel: 'Dry-Ice Scheduled', summary: 'Thermal shippers rated for 72h autonomous hold approach 75% excursion threshold; GMP SOP CC-114 requires Zurich dry-ice replenishment.', source: 'Cold-Chain IoT + NOTAM Feed' },
        { id: 'm2', sev: 4, cat: 'REGULATORY', title: 'EMA Annex 15 & FDA Draft Guidance Update on AI Biomarker Audit Trails', loc: 'Amsterdam / Bethesda', lat: 52.37, lon: 4.9, time: '1h ago', grade: 'A1', actionLabel: 'Log Provenance Audit', resolvedLabel: 'Audit Logged', summary: 'Updated Good Clinical Practice validation rules require immutable provenance logs for AI-assisted pathology screening across EU Phase-III sites.', source: 'EMA / FDA Federal Register' },
        { id: 'm3', sev: 3, cat: 'TRIAL OPS', title: 'Phase-III Oncology Enrollment Velocity +22% Across Boston & Munich Sites', loc: 'Boston, MA', lat: 42.36, lon: -71.06, time: '3h ago', grade: 'A1', actionLabel: 'Issue QP Release', resolvedLabel: 'QP Released', summary: 'Site BOS-04 & MUN-02 ahead of schedule; reagent kit Batch-409 awaiting Qualified Person (QP) release signature.', source: 'Internal CTMS Mirror' },
        { id: 'm4', sev: 3, cat: 'BIOSAFETY', title: 'Regional Cold-Storage Power Advisory Near Singapore Biomanufacturing Park', loc: 'Tuas, Singapore', lat: 1.32, lon: 103.64, time: '5h ago', grade: 'A2', actionLabel: 'Confirm N+2 Genset', resolvedLabel: 'N+2 Confirmed', summary: 'Scheduled utility substation switchover verified covered by N+2 backup cryo-generators.', source: 'Site SCADA + Facility Log' }
      ],
      opsRows: [
        { id: 'BIO-904', label: 'Lot BIO-904 (mAb Cold-Chain)', route: 'Basel → Doha · 7.1°C', lat: 47.56, lon: 7.59, risk: 'crit', statusText: '75% HOLD LIMIT', doneText: 'DRY-ICE TOPPED', spark: [3.2, 3.8, 4.4, 5.2, 6.3, 7.1], detail: '2–8°C spec · +14h airspace reroute triggers SOP CC-114 §4.2.', actionText: 'Authorize Dry-Ice' },
        { id: 'BIO-911', label: 'Lot BIO-911 (Cryo Biologics)', route: 'Basel → Singapore · 6.6°C', lat: 25.29, lon: 51.53, risk: 'warn', statusText: '68% HOLD LIMIT', doneText: 'QA CLEARED', spark: [3.0, 3.3, 4.1, 4.8, 5.7, 6.6], detail: 'Zurich transit top-up extends autonomous hold to 108h.', actionText: 'Sign Off SOP CC-114' },
        { id: 'BATCH-409', label: 'Reagent Batch-409 (Phase-III)', route: 'Boston → Munich · 4.1°C', lat: 42.36, lon: -71.06, risk: 'warn', statusText: 'QP UNSIGNED', doneText: 'QP RELEASED', spark: [4.0, 4.1, 4.0, 4.2, 4.1, 4.1], detail: 'Logger calibration verified · requires Qualified Person release.', actionText: 'Apply QP Sign-Off' },
        { id: 'TUAS-CRYO', label: 'Tuas Cryo Vault Bank-B', route: 'Singapore · -78.4°C', lat: 1.32, lon: 103.64, risk: 'ok', statusText: 'N+2 NOMINAL', doneText: 'N+2 VERIFIED', spark: [-79, -78.8, -78.5, -78.6, -78.4, -78.4], detail: 'Backup cryo-generators tested and online during grid switchover.', actionText: 'Verified', defaultDone: true }
      ],
      arcs: [
        { from: [42.36, -71.06], to: [47.56, 7.59], color: '#10b981', label: 'Boston–Basel Trial Supply' },
        { from: [47.56, 7.59], to: [25.29, 51.53], color: '#ff6b35', label: 'Basel–Doha Biologics Air' },
        { from: [25.29, 51.53], to: [1.32, 103.64], color: '#38bdf8', label: 'Doha–Tuas Cryo Link' }
      ],
      facilities: [
        { lat: 47.56, lon: 7.59, label: 'BASEL GMP LAB', role: 'Primary Biologics Manufacturing · ISO-7' },
        { lat: 42.36, lon: -71.06, label: 'BOSTON TRIAL HQ', role: 'Phase-III Oncology Site BOS-04' },
        { lat: 52.2, lon: 0.12, label: 'CAMBRIDGE BIO', role: 'AI Biomarker Validation Lab' },
        { lat: 1.32, lon: 103.64, label: 'TUAS CRYO HUB', role: 'APAC Cold-Storage · N+2 Backup' }
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
      ],
      computeKpis(pr, doneOps, customPins) {
        const openRisk = pr.opsRows.filter((r) => !doneOps.has(r.id)).length;
        const cleared = pr.opsRows.length - openRisk;
        return [
          { label: 'Excursion Alerts', val: String(openRisk), cls: openRisk > 0 ? 'danger' : 'good', sub: openRisk ? 'SOP CC-114 pending' : 'All lots within 2–8°C' },
          { label: 'GMP Sign-Offs', val: `${cleared} / ${pr.opsRows.length}`, cls: cleared === pr.opsRows.length ? 'good' : 'accent', sub: 'Annex 15 compliant' },
          { label: 'Clinical Sites', val: String(pr.facilities.length + customPins.length), cls: 'accent', sub: 'Active trial telemetry' },
          { label: 'SOP Vault', val: `${pr.docs.length + state.userDocs.length} docs`, cls: 'good', sub: 'Audit-locked RAG' }
        ];
      }
    },

    journalism: {
      id: 'journalism',
      short: 'Journalism & Investigative Research',
      brandDefault: 'Meridian Investigative Desk',
      subtitle: 'OSINT, FOIA ARCHIVE & ADMIRALTY VERIFICATION',
      accentDefault: 'amber',
      centerLat: 36, centerLon: 16,
      opsTitle: 'FOIA EVIDENCE & OSCOLA CITATION LEDGER',
      sampleCsv: `name,lat,lon,category,metric,notes
Brussels Tender Registry,50.85,4.35,ACCOUNTABILITY,$34.2M,Municipal facial-recognition contract without published DPIA
Nairobi ASN-33771 Probe Node,-1.29,36.82,DIGITAL RIGHTS,41.2% Drop,640 OONI measurements corroborating encrypted handshake throttling`,
      signals: [
        { id: 'j1', sev: 5, cat: 'ACCOUNTABILITY', title: '18 Municipal & Federal Biometric Procurement Tenders Cross-Linked Across 7 Countries', loc: 'Washington, D.C. / EU', lat: 38.9, lon: -77.04, time: '28m ago', grade: 'A1', actionLabel: 'Verify & Lock Fact-Check', resolvedLabel: 'Fact-Check Cleared', summary: 'FOIA contract ledger reveals overlapping subcontractor chains supplying automated biometric checkpoints without public algorithmic impact assessments.', source: 'FOIA Release #2026-441 + Court Dockets' },
        { id: 'j2', sev: 4, cat: 'DIGITAL RIGHTS', title: 'OONI & IODA Confirm Targeted Mobile Throttling During Regional Elections', loc: 'Nairobi / East Africa', lat: -1.29, lon: 36.82, time: '1h ago', grade: 'A1', actionLabel: 'Verify PCAP Hash', resolvedLabel: 'PCAP Verified', summary: 'Independent network measurement probes logged 41% throughput collapse across 3 ASNs with verified PCAP signatures.', source: 'OONI Explorer + CIPESA Field Desk' },
        { id: 'j3', sev: 4, cat: 'TREATY / UN', title: 'Geneva UNODA GGE Consultations on Autonomous Weapons Human-Control Thresholds', loc: 'Geneva, Switzerland', lat: 46.2, lon: 6.14, time: '3h ago', grade: 'A1', actionLabel: 'Cite Verbatim Record', resolvedLabel: 'Citation Indexed', summary: '14 state delegations tabled binding red-line language on target-selection autonomy; primary verbatim transcripts indexed.', source: 'UNODA Official Verbatim Archive' },
        { id: 'j4', sev: 3, cat: 'ARCHIVE HIT', title: 'Corporate Registry Link Between Shell Logistics Firm & Sanctioned Dual-Use Exports', loc: 'Limassol / London', lat: 51.51, lon: -0.13, time: '6h ago', grade: 'A2', actionLabel: 'Cross-Check Registry', resolvedLabel: 'Ownership Matched', summary: 'Companies House beneficial-ownership filings match shipping manifest consignee across 4 customs records.', source: 'UK Companies House + Trade Filings' }
      ],
      opsRows: [
        { id: 'FOIA-441', label: 'FOIA Release #2026-441 ($148.2M)', route: 'Washington D.C. · Grade A1', lat: 38.9, lon: -77.04, risk: 'crit', statusText: 'A1 · VERIFY', doneText: 'FACT-CHECKED', citation: 'US Dept. of Homeland Security, FOIA Release #2026-441 (18 Biometric Procurement Awards, 2023–2026), Admiralty Grade A1.', detail: '18 contracts lacking public algorithmic impact assessments.', actionText: 'Verify Record' },
        { id: 'OONI-KE-640', label: 'OONI Election Throttling Dataset', route: 'Nairobi AS33771 · Grade A1', lat: -1.29, lon: 36.82, risk: 'warn', statusText: '41.2% DROP', doneText: 'CORROBORATED', citation: 'OONI Explorer & CIPESA Field Desk, Measurement Batch AS33771/AS36914 (640 probes, 2026), Admiralty Grade A1.', detail: 'Independent PCAP verification of encrypted messaging throttling.', actionText: 'Corroborate' },
        { id: 'UNODA-GGE', label: 'UNODA GGE LAWS Verbatim Record', route: 'Geneva · Grade A1', lat: 46.2, lon: 6.14, risk: 'ok', statusText: 'A1 PRIMARY', doneText: 'CITED OSCOLA', citation: 'UNODA Group of Governmental Experts on LAWS, Verbatim Working Paper (Geneva, 2026) p 11.', detail: '14 delegations affirming binding human-control IHL thresholds.', actionText: 'Mark Cited', defaultDone: true },
        { id: 'UKCH-884', label: 'Companies House Ownership Chain', route: 'London / Limassol · Grade A2', lat: 51.51, lon: -0.13, risk: 'warn', statusText: 'A2 · REVIEW', doneText: 'LEGAL CLEARED', citation: 'UK Companies House Filing #14889210 & EU Dual-Use Customs Manifest Cross-Link (2026), Admiralty Grade A2.', detail: 'Beneficial owner match across 4 maritime export declarations.', actionText: 'Clear Editorial' }
      ],
      arcs: [
        { from: [38.9, -77.04], to: [46.2, 6.14], color: '#f59e0b', label: 'DC–Geneva Treaty Desk' },
        { from: [46.2, 6.14], to: [-1.29, 36.82], color: '#10b981', label: 'Geneva–Nairobi OONI Feed' },
        { from: [51.51, -0.13], to: [38.9, -77.04], color: '#38bdf8', label: 'London–DC FOIA Corroboration' }
      ],
      facilities: [
        { lat: 51.51, lon: -0.13, label: 'LONDON BUREAU', role: 'Companies House & Corporate Registry Unit' },
        { lat: 46.2, lon: 6.14, label: 'GENEVA DESK', role: 'UNODA & Humanitarian Treaty Coverage' },
        { lat: 38.9, lon: -77.04, label: 'DC FOIA UNIT', role: 'Federal Contract & Court Docket Archive' },
        { lat: -1.29, lon: 36.82, label: 'AFRICA DESK', role: 'OONI / IODA Digital Rights Verification' }
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
      ],
      computeKpis(pr, doneOps, customPins) {
        const verified = pr.opsRows.filter((r) => doneOps.has(r.id)).length;
        return [
          { label: 'Fact-Checked', val: `${verified} / ${pr.opsRows.length}`, cls: verified === pr.opsRows.length ? 'good' : 'accent', sub: 'Admiralty A1/A2' },
          { label: 'Linked Tenders', val: '$148.2M', cls: 'warn', sub: '18 FOIA contracts' },
          { label: 'Bureaus & Pins', val: String(pr.facilities.length + customPins.length), cls: 'accent', sub: 'Geo-verified sources' },
          { label: 'OSCOLA Ready', val: `${pr.docs.length + state.userDocs.length} docs`, cls: 'good', sub: '1-click citation copy' }
        ];
      }
    },

    legal: {
      id: 'legal',
      short: 'Legal, M&A & Regulatory',
      brandDefault: 'Sterling Counsel AI',
      subtitle: '60-JURISDICTION STATUTORY & CONTRACT RAG',
      accentDefault: 'violet',
      centerLat: 47, centerLon: 5,
      opsTitle: 'STATUTORY CLOCKS & VENDOR DPA SIGN-OFF',
      sampleCsv: `name,lat,lon,category,metric,notes
Munich Client Deployment DE-02,48.14,11.58,EU AI ACT,48h Clock,High-risk HR screening module pending Art. 73 SOP sign-off
Sacramento CalOES Filing,38.58,-121.49,US STATE LAW,24h Clock,California SB 53 safety framework notification desk`,
      signals: [
        { id: 'l1', sev: 5, cat: 'EU AI ACT', title: 'Art. 73 Serious-Incident Reporting Clocks Active for High-Risk Client Deployments', loc: 'Brussels / Munich', lat: 50.85, lon: 4.35, time: '22m ago', grade: 'A1', actionLabel: 'Sign Off Art. 73 SOP', resolvedLabel: 'Art. 73 Signed Off', summary: 'Mandatory 2-day (critical infra) and 15-day (standard) incident deadlines apply to 2 German enterprise deployments missing SOP sign-offs.', source: 'Reg. (EU) 2024/1689 + Client Audit SQL' },
        { id: 'l2', sev: 4, cat: 'US STATE LAW', title: 'California SB 53 CalOES 24-Hour Imminent Harm Clock Mapped to Client Models', loc: 'Sacramento, CA', lat: 38.58, lon: -121.49, time: '1h ago', grade: 'A1', actionLabel: 'Verify CalOES Playbook', resolvedLabel: 'CalOES Verified', summary: 'Frontier model deployments serving California enterprises require 24h imminent-risk reporting and whistleblower carve-outs.', source: 'CA SB 53 §22757.12' },
        { id: 'l3', sev: 3, cat: 'APAC LAW', title: 'South Korea AI Basic Act Art. 36 Domestic Legal Representative Filing Window', loc: 'Seoul, South Korea', lat: 37.56, lon: 126.98, time: '3h ago', grade: 'A1', actionLabel: 'Confirm ROK Agent', resolvedLabel: 'Agent Designated', summary: 'Overseas AI providers above revenue/user thresholds must designate an in-country legal agent.', source: 'ROK AI Basic Act Decree 36053' },
        { id: 'l4', sev: 3, cat: 'DPA AUDIT', title: '3 Tier-1 Vendor DPAs Missing 2026 Zero-Model-Training Addendum', loc: 'London, UK', lat: 51.51, lon: -0.13, time: '5h ago', grade: 'A1', actionLabel: 'Issue §8.4 Addendum', resolvedLabel: 'Addendum Issued', summary: 'Automated iManage repository audit flagged Vendors VND-104, VND-219, and VND-308 on legacy 2024 clause templates.', source: 'Private iManage DMS' }
      ],
      opsRows: [
        { id: 'EU-ART73', label: 'EU AI Act Art. 73 Incident SOP', route: 'Brussels / Munich · ≤2d / 15d', lat: 50.85, lon: 4.35, risk: 'crit', statusText: '2 GAPS OPEN', doneText: 'PARTNER SIGNED', detail: 'High-risk enterprise deployments require statutory incident escalation.', actionText: 'Sign Off SOP' },
        { id: 'CA-SB53', label: 'California SB 53 CalOES Protocol', route: 'Sacramento, CA · 24h Clock', lat: 38.58, lon: -121.49, risk: 'warn', statusText: 'REVIEW DUE', doneText: 'COMPLIANT', detail: 'Whistleblower shield & frontier safety publication verified.', actionText: 'Approve Filing' },
        { id: 'DPA-VND', label: 'Vendor DPAs (VND-104/219/308)', route: 'London iManage · §8.4 Gap', lat: 51.51, lon: -0.13, risk: 'warn', statusText: '3 LEGACY DPAs', doneText: 'ADDENDUM SENT', detail: 'Missing 2026 Zero-Model-Training covenant on legacy 2024 templates.', actionText: 'Send Addendum' },
        { id: 'ROK-ART36', label: 'South Korea Domestic Agent Filing', route: 'Seoul MSIT · Art. 36', lat: 37.56, lon: 126.98, risk: 'ok', statusText: 'FILED', doneText: 'DESIGNATED', detail: 'In-country legal representative registered with MSIT.', actionText: 'Verified', defaultDone: true }
      ],
      arcs: [
        { from: [50.85, 4.35], to: [38.58, -121.49], color: '#b366ff', label: 'EU–California Transatlantic Scope' },
        { from: [50.85, 4.35], to: [37.56, 126.98], color: '#00f5ff', label: 'EU–Korea Statutory Alignment' },
        { from: [50.85, 4.35], to: [51.51, -0.13], color: '#10b981', label: 'Brussels–London Counsel Desk' }
      ],
      facilities: [
        { lat: 51.51, lon: -0.13, label: 'LONDON HQ', role: 'iManage Private DMS · Partner Review' },
        { lat: 50.85, lon: 4.35, label: 'BRUSSELS OFFICE', role: 'EU AI Office Regulatory Practice' },
        { lat: 40.71, lon: -74.01, label: 'NEW YORK', role: 'US Federal & State AI Litigation' },
        { lat: 37.56, lon: 126.98, label: 'SEOUL DESK', role: 'APAC Statutory Representative' }
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
      ],
      computeKpis(pr, doneOps, customPins) {
        const gaps = pr.opsRows.filter((r) => !doneOps.has(r.id)).length;
        return [
          { label: 'Open Legal Gaps', val: String(gaps), cls: gaps > 0 ? 'danger' : 'good', sub: gaps ? 'Action required in Ops' : '100% signed off' },
          { label: 'Signed-Off Items', val: `${pr.opsRows.length - gaps} / ${pr.opsRows.length}`, cls: 'accent', sub: 'Partner audit trail' },
          { label: 'Jurisdictions', val: String(60 + customPins.length), cls: 'accent', sub: 'Live statutory feed' },
          { label: 'DMS Vault', val: `${pr.docs.length + state.userDocs.length} files`, cls: 'good', sub: 'Zero-training VPC' }
        ];
      }
    },

    finance: {
      id: 'finance',
      short: 'Finance, Insurance & Energy',
      brandDefault: 'Meridian Capital Risk',
      subtitle: 'PORTFOLIO EXPOSURE, SANCTIONS & ENERGY RADAR',
      accentDefault: 'sky',
      centerLat: 34, centerLon: 55,
      opsTitle: 'PORTFOLIO HEDGE & ENERGY TRIGGER MATRIX',
      sampleCsv: `name,lat,lon,category,metric,notes
Hsinchu Packaging Cluster,24.80,120.97,EXPORT CTRL,6.8% NAV,Lead times crossed 16w triggering 40% downside put collar
Sabine Pass LNG Terminal,29.73,-93.87,ENERGY / WX,T+46h Cone,HSE OPS-77 manifold isolation ready`,
      signals: [
        { id: 'f1', sev: 5, cat: 'EXPORT CTRL', title: 'BIS Sub-3nm Packaging Notice Impacts 3 Semi-Sleeve Portfolio Holdings (6.8% NAV)', loc: 'Hsinchu, Taiwan', lat: 24.4, lon: 119.5, time: '19m ago', grade: 'A1', actionLabel: 'Execute 40% Put Collar', resolvedLabel: 'Collar Executed', summary: 'Supplier packaging lead times crossed 16 weeks—breaching your Q3 IC Memo 14-week collar hedge trigger.', source: 'BIS Notice + IC Vault Q3' },
        { id: 'f2', sev: 4, cat: 'ENERGY / WX', title: 'Terminal West-04 Enters 48h Category-2 Wind Cone — HSE OPS-77 Ready', loc: 'Gulf Coast, USA', lat: 29.73, lon: -93.87, time: '55m ago', grade: 'A1', actionLabel: 'Queue OPS-77 Isolation', resolvedLabel: 'OPS-77 Armed', summary: 'NOAA/EONET track intersects coastal LNG loading headers at T+46h; 24h pre-landfall pressure isolation protocol queued.', source: 'NASA EONET + Site Registry' },
        { id: 'f3', sev: 4, cat: 'REINSURANCE', title: '7 Specialty Marine Binders ($42.5M Limit) Overlap War-Risk Surcharge Band', loc: 'Zurich / Red Sea', lat: 47.37, lon: 8.54, time: '2h ago', grade: 'A1', actionLabel: 'Issue 72h War-Risk Notice', resolvedLabel: 'Repricing Sent', summary: 'War-risk endorsement repricing threshold crossed across 7 active hull & cargo policies.', source: 'Underwriting Core SQL' },
        { id: 'f4', sev: 3, cat: 'GRID INFRA', title: 'Anomalous Anchor-Drag Loiter Detected 1.8 km From Baltic HVDC Segment B-12', loc: 'Baltic Sea', lat: 59.4, lon: 21.8, time: '4h ago', grade: 'A2', actionLabel: 'Escalate Coastguard SOP', resolvedLabel: 'Coastguard Alerted', summary: 'Vessel speed <2.5 knots for 4.5h over subsea interconnect; SOP GRID-SUB-04 coastguard escalation triggered.', source: 'Subsea Layer + AIS Anomaly' }
      ],
      opsRows: [
        { id: 'SEMI-HEDGE', label: 'Semi-Sleeve Downside Collar', route: 'Hsinchu · 6.8% NAV ($54M)', lat: 24.4, lon: 119.5, risk: 'crit', statusText: '16W BREACH', doneText: '40% COLLAR LIVE', detail: 'Breached Q3 IC Memo 14-week lead-time automatic hedge threshold.', actionText: 'Trigger 40% Collar' },
        { id: 'LNG-OPS77', label: 'Terminal West-04 Storm Isolation', route: 'Gulf Coast · T+46h Wind', lat: 29.73, lon: -93.87, risk: 'warn', statusText: 'CAT-2 CONE', doneText: 'OPS-77 ARMED', detail: 'Depressurize coastal LNG transfer headers at T-24h pre-landfall.', actionText: 'Arm HSE OPS-77' },
        { id: 'MAR-BIND', label: '7 Specialty Marine Binders', route: 'Zurich Desk · $42.5M Limit', lat: 47.37, lon: 8.54, risk: 'warn', statusText: 'REPRICE DUE', doneText: '72H NOTICE SENT', detail: 'Red Sea corridor policies qualify for 72h war-risk surcharge notice.', actionText: 'Issue Notice' },
        { id: 'HVDC-B12', label: 'Baltic HVDC Interconnect B-12', route: 'Baltic Sea · AIS Loiter', lat: 59.4, lon: 21.8, risk: 'ok', statusText: 'MONITORED', doneText: 'SOP ESCALATED', detail: 'Anomalous slow vessel tracked at 1.8km · SOP GRID-SUB-04 logged.', actionText: 'Escalate SOP', defaultDone: true }
      ],
      arcs: [
        { from: [38.9, -77.04], to: [24.4, 119.5], color: '#ff2d55', label: 'BIS Policy → Taiwan Fabs' },
        { from: [24.4, 119.5], to: [47.37, 8.54], color: '#38bdf8', label: 'Asia Semi → Zurich Risk Desk' },
        { from: [47.37, 8.54], to: [59.4, 21.8], color: '#f59e0b', label: 'Zurich → Baltic HVDC Asset' }
      ],
      facilities: [
        { lat: 47.37, lon: 8.54, label: 'ZURICH DESK', role: 'Portfolio & Specialty Reinsurance Core' },
        { lat: 24.4, lon: 119.5, label: 'HSINCHU FABS', role: 'Sub-3nm Packaging Exposure · 6.8% NAV' },
        { lat: 29.73, lon: -93.87, label: 'TERMINAL W-04', role: 'Coastal LNG Export · HSE OPS-77' },
        { lat: 59.4, lon: 21.8, label: 'BALTIC HVDC', role: 'Subsea Power Interconnect B-12' }
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
      ],
      computeKpis(pr, doneOps, customPins) {
        const hedges = pr.opsRows.filter((r) => doneOps.has(r.id)).length;
        return [
          { label: 'Triggers Actioned', val: `${hedges} / ${pr.opsRows.length}`, cls: hedges === pr.opsRows.length ? 'good' : 'warn', sub: 'Hedge & HSE SOPs' },
          { label: 'Marine Binders', val: '$42.5M', cls: doneOps.has('MAR-BIND') ? 'good' : 'danger', sub: doneOps.has('MAR-BIND') ? 'Repricing issued' : '7 policies exposed' },
          { label: 'Tracked Assets', val: String(pr.facilities.length + customPins.length), cls: 'accent', sub: 'Geo-correlated NAV' },
          { label: 'IC Memo Vault', val: `${pr.docs.length + state.userDocs.length} docs`, cls: 'good', sub: 'Citation-verified' }
        ];
      }
    },

    cyber: {
      id: 'cyber',
      short: 'Enterprise CISO & Security',
      brandDefault: 'Apex Security SOC',
      subtitle: 'GEO-CORRELATED THREAT & PLAYBOOK HUB',
      accentDefault: 'crimson',
      centerLat: 50, centerLon: 14,
      opsTitle: 'CMDB VULNERABILITY & CONTAINMENT QUEUE',
      sampleCsv: `name,lat,lon,category,metric,notes
Frankfurt Collector eu-mon-03,50.11,8.68,ZERO-DAY,CVE-2026-8841,Unpatched SNMP collector on VLAN-44 requiring immediate ACL quarantine
London SOC Failover Core,51.51,-0.13,SOC OPS,Nominal,Primary SIEM + air-gapped playbook server online`,
      signals: [
        { id: 'c1', sev: 5, cat: 'ZERO-DAY', title: 'Active RCE PoC Matches 2 Frankfurt Monitoring Nodes (eu-mon-03 / eu-mon-07)', loc: 'Frankfurt DC-2, DE', lat: 50.11, lon: 8.68, time: '9m ago', grade: 'A1', actionLabel: 'Quarantine VLAN-44', resolvedLabel: 'VLAN-44 Quarantined', summary: 'CMDB correlation matched unpatched telemetry collectors on VLAN-44; zero lateral beacons detected in EDR; IR Playbook SEC-09 queued.', source: 'CISA KEV + Internal CMDB' },
        { id: 'c2', sev: 4, cat: 'TELECOM / EW', title: '34% Regional Fiber Transit Drop & BGP Route Withdrawals Across Eastern Hub', loc: 'Kyiv / Eastern EU', lat: 50.45, lon: 30.52, time: '47m ago', grade: 'A1', actionLabel: 'Engage Satcom Failover', resolvedLabel: 'Satcom Active', summary: 'Field continuity SOP COMMS-ALT-02 authorizes automatic satcom check-in failover for all 12 regional personnel.', source: 'OONI/IODA + Field Registry' },
        { id: 'c3', sev: 3, cat: 'DUTY OF CARE', title: '2 Executive Auditors Entering Municipal Transit Strike Window', loc: 'Paris / Regional', lat: 48.85, lon: 2.35, time: '2h ago', grade: 'A2', actionLabel: 'Confirm Reroute SMS', resolvedLabel: 'Travelers Cleared', summary: 'Airport transfer shifted by 90 minutes via verified corporate security advisory.', source: 'Travel Roster SQL + OSINT' }
      ],
      opsRows: [
        { id: 'EU-MON-03', label: 'Host eu-mon-03 (VLAN-44)', route: 'Frankfurt DC-2 · CVE-2026-8841', lat: 50.11, lon: 8.68, risk: 'crit', statusText: 'RCE EXPOSED', doneText: 'ACL QUARANTINED', detail: 'Playbook SEC-09: isolate VLAN-44 ACL + rotate SNMP v3 tokens.', actionText: 'Quarantine Host' },
        { id: 'EU-MON-07', label: 'Host eu-mon-07 (VLAN-44)', route: 'Frankfurt DC-2 · CVE-2026-8841', lat: 50.15, lon: 8.75, risk: 'crit', statusText: 'RCE EXPOSED', doneText: 'ACL QUARANTINED', detail: 'Zero EDR lateral beacons · vendor hotfix staged for <4h rollout.', actionText: 'Quarantine Host' },
        { id: 'KYIV-SAT', label: 'Eastern EU Field Comms (12 Staff)', route: 'Kyiv Hub · 66% Transit', lat: 50.45, lon: 30.52, risk: 'warn', statusText: 'BGP DROP -34%', doneText: 'SATCOM FAILOVER', detail: 'Threshold <70% >2h triggers SOP COMMS-ALT-02 encrypted satcom.', actionText: 'Switch to Satcom' },
        { id: 'PAR-EXEC', label: 'Executive Travel Roster (2 Staff)', route: 'Paris CDG · Transit Strike', lat: 48.85, lon: 2.35, risk: 'ok', statusText: 'ADVISED', doneText: 'ROUTE CONFIRMED', detail: 'Airport transfer shifted +90m via Duty-of-Care SMS alert.', actionText: 'Confirm Safe', defaultDone: true }
      ],
      arcs: [
        { from: [50.45, 30.52], to: [50.11, 8.68], color: '#ff2d55', label: 'BGP Telemetry → Frankfurt DC-2' },
        { from: [50.11, 8.68], to: [51.51, -0.13], color: '#00f5ff', label: 'Frankfurt → London SOC Core' }
      ],
      facilities: [
        { lat: 50.11, lon: 8.68, label: 'FRANKFURT DC-2', role: 'EU Telemetry Tier · VLAN-44 Scope' },
        { lat: 51.51, lon: -0.13, label: 'LONDON SOC HQ', role: '24/7 Incident Command · SIEM Core' },
        { lat: 48.85, lon: 2.35, label: 'PARIS OFFICE', role: 'Regional Audit Team · Duty of Care' }
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
      ],
      computeKpis(pr, doneOps, customPins) {
        const exposed = pr.opsRows.filter((r) => !doneOps.has(r.id)).length;
        return [
          { label: 'Uncontained Risks', val: String(exposed), cls: exposed > 0 ? 'danger' : 'good', sub: exposed ? 'Playbook SEC-09 ready' : 'All hosts contained' },
          { label: 'Actions Completed', val: `${pr.opsRows.length - exposed} / ${pr.opsRows.length}`, cls: 'accent', sub: 'CMDB live state' },
          { label: 'Monitored Nodes', val: String(pr.facilities.length + customPins.length), cls: 'accent', sub: 'SIEM + Geo-Fence' },
          { label: 'Playbook Vault', val: `${pr.docs.length + state.userDocs.length} docs`, cls: 'good', sub: 'Air-gapped RAG' }
        ];
      }
    }
  };

  /* ── GLOBAL WORKSPACE STATE (100% 3D GLOBE) ── */
  const state = {
    presetId: 'business',
    brandName: '',
    subtitle: '',
    logoDataUrl: '',
    monogram: '⬡',
    accentKey: 'cyan',
    uiMode: 'dark',
    autoSpin: true,
    overlays: { assets: true, arcs: true, geofences: true, labels: true },
    leftTab: 'signals', // 'signals' | 'ops' | 'docs' | 'byod'
    sevFilter: 'all',   // 'all' | 'critical' | 'open'
    searchQ: '',
    selectedItem: null,
    aiOpen: true,
    doneOpsByPreset: {},
    resolvedSignals: new Set(),
    customPins: [],     // Real geo-parsed CSV rows plotted live on the 3D globe!
    userDocs: [],       // Real uploaded / pasted local documents indexed into Private AI!
    selectedModules: ['3D Spatial Engine', 'Private Citation-Locked RAG AI', 'Live CSV/SQL/ERP Ingestion', 'Statutory & Audit Exports'],
    mobileView: 'globe'
  };

  // Seed default completed ops per preset
  Object.values(PRESETS).forEach((pr) => {
    const s = new Set();
    pr.opsRows.forEach((r) => { if (r.defaultDone) s.add(r.id); });
    state.doneOpsByPreset[pr.id] = s;
  });

  // Parse URL params for pre-branded shareable client demos
  const qs = new URLSearchParams(window.location.search);
  const isEmbed = qs.get('embed') === '1';
  if (isEmbed) document.documentElement.classList.add('demo-embed');

  const initPreset = qs.get('preset');
  if (initPreset && PRESETS[initPreset]) state.presetId = initPreset;
  const p0 = PRESETS[state.presetId];
  state.brandName = (qs.get('brand') || p0.brandDefault).slice(0, 40);
  state.subtitle = (qs.get('sub') || p0.subtitle).slice(0, 56);
  state.accentKey = (qs.get('accent') && ACCENTS[qs.get('accent')]) ? qs.get('accent') : p0.accentDefault;
  if (qs.get('theme') === 'light') state.uiMode = 'light';

  function showToast(msg) {
    const el = document.getElementById('dm-toast');
    if (!el) return;
    el.textContent = msg;
    el.classList.add('show');
    clearTimeout(showToast._t);
    showToast._t = setTimeout(() => el.classList.remove('show'), 2600);
  }

  /* ── CSV / TEXT PARSER FOR REAL LIVE GLOBE PINNING + RAG INDEXING ── */
  function parseCsvText(rawText, fileName) {
    const lines = rawText.split(/\r?\n/).map((l) => l.trim()).filter(Boolean);
    if (lines.length < 2) return { pins: [], rowsCount: 0 };

    const splitRow = (line) => {
      const out = [];
      let cur = '', inQ = false;
      for (let i = 0; i < line.length; i++) {
        const ch = line[i];
        if (ch === '"') inQ = !inQ;
        else if (ch === ',' && !inQ) { out.push(cur.trim()); cur = ''; }
        else cur += ch;
      }
      out.push(cur.trim());
      return out;
    };

    const headers = splitRow(lines[0]).map((h) => h.toLowerCase());
    const idxLat = headers.findIndex((h) => h === 'lat' || h === 'latitude');
    const idxLon = headers.findIndex((h) => h === 'lon' || h === 'lng' || h === 'longitude');
    if (idxLat < 0 || idxLon < 0) return { pins: [], rowsCount: 0 };

    const idxName = headers.findIndex((h) => ['name', 'title', 'site', 'asset', 'facility', 'vessel', 'id'].includes(h));
    const idxCat = headers.findIndex((h) => ['category', 'type', 'status', 'cat'].includes(h));
    const idxMetric = headers.findIndex((h) => ['metric', 'value', 'exposure', 'temp', 'risk'].includes(h));
    const idxNotes = headers.findIndex((h) => ['notes', 'summary', 'description', 'detail'].includes(h));

    const pins = [];
    for (let i = 1; i < lines.length && pins.length < 60; i++) {
      const cols = splitRow(lines[i]);
      const lat = parseFloat(cols[idxLat]);
      const lon = parseFloat(cols[idxLon]);
      if (!Number.isFinite(lat) || !Number.isFinite(lon) || Math.abs(lat) > 90 || Math.abs(lon) > 180) continue;
      const title = (idxName >= 0 && cols[idxName]) ? cols[idxName] : `Imported Asset #${i}`;
      const cat = (idxCat >= 0 && cols[idxCat]) ? cols[idxCat].toUpperCase() : 'CSV IMPORT';
      const metric = (idxMetric >= 0 && cols[idxMetric]) ? cols[idxMetric] : 'Custom Data';
      const summary = (idxNotes >= 0 && cols[idxNotes]) ? cols[idxNotes] : `Imported from ${fileName} (${lat.toFixed(2)}, ${lon.toFixed(2)}).`;
      pins.push({
        id: `csv-${Date.now()}-${i}`,
        isCustomPin: true,
        sev: 4,
        cat,
        grade: 'LOCAL',
        time: 'Imported',
        title,
        loc: `${lat.toFixed(2)}°, ${lon.toFixed(2)}° · ${metric}`,
        lat,
        lon,
        metric,
        summary,
        source: `Client File: ${fileName}`
      });
    }
    return { pins, rowsCount: pins.length };
  }

  /* ── DEEP-ZOOM 3D NATURAL-EARTH VECTOR GLOBE ENGINE (60FPS, PINCH + CURSOR HOVER) ── */
  function createDemoGlobeEngine(canvas) {
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
    let zoom = 1.0, tgtZoom = 1.0;
    let screenHits = [];
    const activePtrs = new Map();
    let moved = false, startX = 0, startY = 0, lx = 0, ly = 0, prevPinch = null;
    const hoverTip = document.getElementById('dm-hover-tip');
    const zoomReadout = document.getElementById('dm-zoom-readout');

    function syncZoomText() {
      if (zoomReadout) zoomReadout.textContent = `${tgtZoom.toFixed(1)}x`;
    }

    function resize() {
      const rect = canvas.parentElement.getBoundingClientRect();
      w = Math.max(240, Math.round(rect.width));
      h = Math.max(240, Math.round(rect.height));
      dpr = Math.min(window.devicePixelRatio || 1, 2);
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
      const persp = 4.5 / (4.5 - z2);
      return { x: cx + x1 * R * persp, y: cy - y2 * R * persp, z: z2 };
    }

    function flyTo(latDeg, lonDeg, desiredZoom) {
      tgtLat = Math.max(-72, Math.min(72, latDeg)) * DEG;
      tgtLon = lonDeg * DEG;
      if (desiredZoom) {
        tgtZoom = Math.max(0.75, Math.min(6.0, desiredZoom));
        syncZoomText();
      }
    }

    function stepZoom(dir) {
      tgtZoom = Math.max(0.72, Math.min(6.0, tgtZoom * (dir > 0 ? 1.32 : 1 / 1.32)));
      syncZoomText();
    }

    function resetView() {
      const pr = PRESETS[state.presetId];
      tgtZoom = 1.0;
      syncZoomText();
      flyTo(pr.centerLat, pr.centerLon);
    }

    function findHit(mx, my, pad = 0) {
      let best = null, bestScore = -Infinity;
      for (let i = 0; i < screenHits.length; i++) {
        const sp = screenHits[i];
        const d = Math.hypot(mx - sp.x, my - sp.y);
        if (d <= sp.r + pad) {
          const score = sp.priority * 100 - d;
          if (score > bestScore) { bestScore = score; best = sp; }
        }
      }
      return best;
    }

    canvas.addEventListener('pointerdown', (e) => {
      activePtrs.set(e.pointerId, { x: e.clientX, y: e.clientY, type: e.pointerType });
      try { canvas.setPointerCapture(e.pointerId); } catch {}
      if (activePtrs.size === 1) {
        moved = false; startX = lx = e.clientX; startY = ly = e.clientY; prevPinch = null;
      } else if (activePtrs.size === 2) {
        moved = true;
        const [a, b] = Array.from(activePtrs.values());
        prevPinch = Math.hypot(b.x - a.x, b.y - a.y);
      }
    });

    canvas.addEventListener('pointermove', (e) => {
      const rect = canvas.getBoundingClientRect();
      const mx = e.clientX - rect.left, my = e.clientY - rect.top;

      if (activePtrs.has(e.pointerId)) {
        activePtrs.set(e.pointerId, { x: e.clientX, y: e.clientY, type: e.pointerType });
        if (activePtrs.size >= 2) {
          const [a, b] = Array.from(activePtrs.values());
          const dist = Math.hypot(b.x - a.x, b.y - a.y);
          if (prevPinch && prevPinch > 8 && dist > 8) {
            tgtZoom = Math.max(0.72, Math.min(6.0, tgtZoom * (dist / prevPinch)));
            zoom = tgtZoom;
            syncZoomText();
          }
          prevPinch = dist;
          return;
        }
        const dx = e.clientX - lx, dy = e.clientY - ly;
        if (Math.hypot(e.clientX - startX, e.clientY - startY) > 4) moved = true;
        lx = e.clientX; ly = e.clientY;
        tgtLon -= (dx * 0.0068) / Math.max(0.7, zoom);
        tgtLat = Math.max(-1.22, Math.min(1.22, tgtLat + (dy * 0.0068) / Math.max(0.7, zoom)));
        curLon = tgtLon; curLat = tgtLat;
        if (hoverTip) hoverTip.classList.remove('open');
        return;
      }

      // Desktop live hover telemetry tooltip
      if (e.pointerType !== 'touch' && hoverTip) {
        const hit = findHit(mx, my, 4);
        if (hit) {
          canvas.style.cursor = 'pointer';
          hoverTip.innerHTML = `<div class="dm-hover-tip-title">${hit.tipTitle}</div><div class="dm-hover-tip-meta">${hit.tipMeta}</div>`;
          const tx = Math.min(w - 256, Math.max(10, mx + 14));
          const ty = Math.min(h - 74, Math.max(10, my - 14));
          hoverTip.style.left = `${tx}px`;
          hoverTip.style.top = `${ty}px`;
          hoverTip.classList.add('open');
        } else {
          canvas.style.cursor = 'grab';
          hoverTip.classList.remove('open');
        }
      }
    });

    const onPtrEnd = (e) => {
      if (!activePtrs.has(e.pointerId)) return;
      const isTouch = activePtrs.get(e.pointerId)?.type === 'touch';
      activePtrs.delete(e.pointerId);
      try { canvas.releasePointerCapture(e.pointerId); } catch {}
      if (activePtrs.size === 1) {
        const rem = Array.from(activePtrs.values())[0];
        lx = rem.x; ly = rem.y; prevPinch = null;
        return;
      }
      prevPinch = null;
      if (!moved) {
        const rect = canvas.getBoundingClientRect();
        const mx = e.clientX - rect.left, my = e.clientY - rect.top;
        const hit = findHit(mx, my, isTouch ? 12 : 4);
        if (hit) selectItem(hit.payload);
      }
    };

    canvas.addEventListener('pointerup', onPtrEnd);
    canvas.addEventListener('pointercancel', onPtrEnd);
    canvas.addEventListener('pointerleave', () => { if (hoverTip) hoverTip.classList.remove('open'); });
    canvas.addEventListener('dblclick', () => stepZoom(1));
    canvas.addEventListener('wheel', (e) => {
      e.preventDefault();
      const clamped = Math.max(-180, Math.min(180, e.deltaY));
      tgtZoom = Math.max(0.72, Math.min(6.0, tgtZoom * Math.exp(-clamped * 0.0022)));
      syncZoomText();
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
      screenHits = [];

      if (activePtrs.size === 0) {
        if (state.autoSpin && !state.selectedItem) tgtLon += 0.0013;
        let dLon = tgtLon - curLon;
        while (dLon > Math.PI) dLon -= Math.PI * 2;
        while (dLon < -Math.PI) dLon += Math.PI * 2;
        curLon += dLon * 0.085;
        curLat += (tgtLat - curLat) * 0.085;
      }
      zoom += (tgtZoom - zoom) * 0.14;

      const R = Math.min(w, h) * 0.40 * zoom;
      const limbVisible = R < Math.hypot(w, h) * 1.1;

      if (limbVisible) {
        const halo = ctx.createRadialGradient(cx, cy, R * 0.85, cx, cy, R * 1.22);
        halo.addColorStop(0, `rgba(${ar},${ag},${ab},0.23)`);
        halo.addColorStop(1, 'rgba(0,0,0,0)');
        ctx.fillStyle = halo;
        ctx.beginPath(); ctx.arc(cx, cy, R * 1.22, 0, Math.PI * 2); ctx.fill();
      }

      ctx.save();
      if (limbVisible) {
        const ocean = ctx.createRadialGradient(cx - R * 0.28, cy - R * 0.25, R * 0.08, cx, cy, R);
        if (light) {
          ocean.addColorStop(0, '#dbeafe'); ocean.addColorStop(0.75, '#bfdbfe'); ocean.addColorStop(1, '#93c5fd');
        } else {
          ocean.addColorStop(0, '#1e354d'); ocean.addColorStop(0.72, '#0c1829'); ocean.addColorStop(1, '#040a14');
        }
        ctx.fillStyle = ocean;
        ctx.beginPath(); ctx.arc(cx, cy, R, 0, Math.PI * 2); ctx.fill();
        ctx.clip();
      } else {
        ctx.fillStyle = light ? '#bfdbfe' : '#0c1829';
        ctx.fillRect(0, 0, w, h);
      }

      const cLon = Math.cos(curLon), sLon = Math.sin(curLon), cLat = Math.cos(curLat), sLat = Math.sin(curLat);

      // Graticule
      ctx.strokeStyle = light ? 'rgba(30,41,59,0.09)' : `rgba(${ar},${ag},${ab},0.085)`;
      ctx.lineWidth = 0.7;
      for (let lat = -60; lat <= 60; lat += 30) {
        ctx.beginPath(); let pen = false;
        for (let lon = -180; lon <= 180; lon += 10) {
          const p = proj3D(llUnit(lat, lon), cLon, sLon, cLat, sLat, cx, cy, R);
          if (p.z > 0) { if (!pen) { ctx.moveTo(p.x, p.y); pen = true; } else ctx.lineTo(p.x, p.y); } else pen = false;
        }
        ctx.stroke();
      }

      // Landmasses
      ctx.fillStyle = light ? '#f8fafc' : '#192638';
      ctx.strokeStyle = light ? '#94a3b8' : `rgba(${ar},${ag},${ab},0.48)`;
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

      // Geofences overlay (interactive hover!)
      if (state.overlays.geofences && pr.geofences) {
        pr.geofences.forEach((gf) => {
          const p = proj3D(llUnit(gf.lat, gf.lon), cLon, sLon, cLat, sLat, cx, cy, R);
          if (p.z <= 0.1) return;
          const gr = gf.radiusDeg * (R / 55);
          ctx.fillStyle = 'rgba(255, 45, 85, 0.13)';
          ctx.strokeStyle = 'rgba(255, 45, 85, 0.7)';
          ctx.setLineDash([4, 3]);
          ctx.lineWidth = 1.25;
          ctx.beginPath(); ctx.arc(p.x, p.y, gr, 0, Math.PI * 2); ctx.fill(); ctx.stroke();
          ctx.setLineDash([]);
          screenHits.push({
            x: p.x, y: p.y, r: Math.max(14, gr * 0.5), priority: 1,
            tipTitle: `◎ Geofence: ${gf.label}`,
            tipMeta: `Monitored perimeter · Radius ${gf.radiusDeg}° · Click nearby signals for dossier`,
            payload: pr.signals[0]
          });
        });
      }
      ctx.restore();

      // Atmospheric Rim
      if (limbVisible) {
        ctx.strokeStyle = light ? 'rgba(2,132,199,0.55)' : `rgba(${ar},${ag},${ab},0.58)`;
        ctx.lineWidth = 1.4;
        ctx.beginPath(); ctx.arc(cx, cy, R, 0, Math.PI * 2); ctx.stroke();
      }

      // Animated Geodesic Corridors
      if (state.overlays.arcs && pr.arcs) {
        pr.arcs.forEach((arc, ai) => {
          const uA = llUnit(arc.from[0], arc.from[1]), uB = llUnit(arc.to[0], arc.to[1]);
          const pts = [];
          for (let s = 0; s <= 28; s++) {
            const t = s / 28;
            let mx = uA[0] * (1 - t) + uB[0] * t, my = uA[1] * (1 - t) + uB[1] * t, mz = uA[2] * (1 - t) + uB[2] * t;
            const ml = Math.hypot(mx, my, mz) || 1;
            const alt = 1 + Math.sin(t * Math.PI) * 0.17;
            pts.push(proj3D([(mx / ml) * alt, (my / ml) * alt, (mz / ml) * alt], cLon, sLon, cLat, sLat, cx, cy, R));
          }
          ctx.strokeStyle = arc.color; ctx.globalAlpha = 0.56; ctx.lineWidth = 1.5;
          ctx.beginPath(); let pen = false;
          pts.forEach((pt) => { if (pt.z > -0.05) { if (!pen) { ctx.moveTo(pt.x, pt.y); pen = true; } else ctx.lineTo(pt.x, pt.y); } else pen = false; });
          ctx.stroke();
          const cPt = pts[Math.floor(((elapsed * 0.42 + ai * 0.31) % 1) * (pts.length - 1))];
          if (cPt && cPt.z > 0) {
            ctx.globalAlpha = 0.95; ctx.fillStyle = light ? '#0f172a' : '#fff';
            ctx.beginPath(); ctx.arc(cPt.x, cPt.y, 2.8, 0, Math.PI * 2); ctx.fill();
          }
          ctx.globalAlpha = 1;
        });
      }

      // Interactive Facilities / Assets Diamonds
      if (state.overlays.assets && pr.facilities) {
        pr.facilities.forEach((fac) => {
          const p = proj3D(llUnit(fac.lat, fac.lon), cLon, sLon, cLat, sLat, cx, cy, R);
          if (p.z <= 0.08) return;
          ctx.fillStyle = acc.hex;
          ctx.beginPath();
          ctx.moveTo(p.x, p.y - 5); ctx.lineTo(p.x + 5, p.y); ctx.lineTo(p.x, p.y + 5); ctx.lineTo(p.x - 5, p.y);
          ctx.closePath(); ctx.fill();
          ctx.strokeStyle = light ? '#0f172a' : '#ffffff'; ctx.lineWidth = 1; ctx.stroke();
          if (state.overlays.labels) {
            ctx.font = '700 8px "JetBrains Mono", monospace';
            ctx.fillStyle = light ? '#0f172a' : 'rgba(226,232,240,0.88)';
            ctx.fillText(fac.label, p.x + 8, p.y + 3);
          }
          screenHits.push({
            x: p.x, y: p.y, r: 10, priority: 3,
            tipTitle: `◆ ${fac.label}`,
            tipMeta: fac.role || 'Monitored Enterprise Facility',
            payload: {
              id: `fac-${fac.label}`,
              sev: 2,
              cat: 'FACILITY',
              grade: 'LIVE',
              time: 'Online',
              title: fac.label,
              loc: `${fac.lat.toFixed(2)}°, ${fac.lon.toFixed(2)}°`,
              lat: fac.lat,
              lon: fac.lon,
              summary: fac.role || 'Active enterprise site synchronized with private asset registry.',
              source: 'Private Asset Registry'
            }
          });
        });
      }

      // User-Imported CSV Live Pins (Glowing Gold Stars ★)
      state.customPins.forEach((cp, idx) => {
        const p = proj3D(llUnit(cp.lat, cp.lon), cLon, sLon, cLat, sLat, cx, cy, R);
        if (p.z <= 0.05) return;
        const isSel = state.selectedItem && state.selectedItem.id === cp.id;
        const pulse = (elapsed * 1.4 + idx * 0.2) % 1;
        ctx.strokeStyle = '#f59e0b'; ctx.globalAlpha = (1 - pulse) * 0.8; ctx.lineWidth = 1.5;
        ctx.beginPath(); ctx.arc(p.x, p.y, 6 + pulse * 14, 0, Math.PI * 2); ctx.stroke();
        ctx.globalAlpha = 1;
        ctx.fillStyle = '#f59e0b';
        ctx.beginPath(); ctx.arc(p.x, p.y, isSel ? 6.5 : 5.2, 0, Math.PI * 2); ctx.fill();
        ctx.strokeStyle = '#ffffff'; ctx.lineWidth = 1.5; ctx.stroke();
        if (state.overlays.labels) {
          ctx.font = '800 8px "JetBrains Mono", monospace';
          ctx.fillStyle = light ? '#b45309' : '#fde68a';
          ctx.fillText(`★ ${cp.title.slice(0, 22)}`, p.x + 8, p.y + 3);
        }
        screenHits.push({
          x: p.x, y: p.y, r: 12, priority: 7,
          tipTitle: `★ ${cp.title}`,
          tipMeta: `${cp.cat} · ${cp.metric} · Imported from local CSV`,
          payload: cp
        });
      });

      // Live Industry Signal Nodes
      pr.signals.forEach((sig, i) => {
        const p = proj3D(llUnit(sig.lat, sig.lon), cLon, sLon, cLat, sLat, cx, cy, R);
        if (p.z <= 0.05) return;
        const isResolved = state.resolvedSignals.has(sig.id);
        const col = isResolved ? '#10b981' : sevColor(sig.sev);
        const isSel = state.selectedItem && state.selectedItem.id === sig.id;
        const pulse = (elapsed * (isSel ? 2.1 : 1.1) + i * 0.25) % 1;

        ctx.strokeStyle = col; ctx.globalAlpha = (1 - pulse) * (isSel ? 0.95 : 0.65); ctx.lineWidth = isSel ? 2 : 1.2;
        ctx.beginPath(); ctx.arc(p.x, p.y, 6 + pulse * (isSel ? 22 : 14), 0, Math.PI * 2); ctx.stroke();
        ctx.globalAlpha = 1;
        ctx.fillStyle = col; ctx.beginPath(); ctx.arc(p.x, p.y, isSel ? 6.2 : 5, 0, Math.PI * 2); ctx.fill();
        ctx.strokeStyle = '#ffffff'; ctx.lineWidth = 1.4; ctx.stroke();

        screenHits.push({
          x: p.x, y: p.y, r: 13, priority: 10 + sig.sev,
          tipTitle: `${isResolved ? '✓' : '●'} [S${sig.sev}] ${sig.title}`,
          tipMeta: `${sig.loc} · ${sig.source} · Click to inspect`,
          payload: sig
        });

        if (isSel || (state.overlays.labels && i === 0)) {
          ctx.font = '700 8.5px "JetBrains Mono", monospace';
          const txt = `${isResolved ? '✓' : '●'} S${sig.sev} · ${sig.loc.toUpperCase()}`;
          const pw = Math.min(210, Math.ceil(ctx.measureText(txt).width) + 16);
          const tx = Math.max(10, Math.min(w - pw - 10, p.x + 14));
          const ty = Math.max(14, Math.min(h - 60, p.y - 24));
          ctx.fillStyle = light ? 'rgba(255,255,255,0.95)' : 'rgba(5,9,20,0.92)';
          ctx.strokeStyle = col; ctx.lineWidth = 1.1;
          ctx.beginPath(); if (ctx.roundRect) ctx.roundRect(tx, ty, pw, 22, 6); else ctx.rect(tx, ty, pw, 22);
          ctx.fill(); ctx.stroke();
          ctx.fillStyle = light ? '#0f172a' : '#fff';
          ctx.fillText(txt, tx + 8, ty + 14);
        }
      });
    }
    requestAnimationFrame(frame);
    return { flyTo, stepZoom, resetView };
  }

  let mapEngine = null;

  function renderSparkSvg(arr) {
    if (!Array.isArray(arr) || arr.length < 2) return '';
    const min = Math.min(...arr), max = Math.max(...arr);
    const span = Math.max(0.1, max - min);
    const pts = arr.map((v, i) => {
      const x = (i / (arr.length - 1)) * 68;
      const y = 18 - ((v - min) / span) * 14;
      return `${x.toFixed(1)},${y.toFixed(1)}`;
    }).join(' ');
    return `<svg width="70" height="20" viewBox="0 0 70 20" style="flex-shrink:0;"><polyline fill="none" stroke="var(--dm-accent)" stroke-width="1.8" points="${pts}"/></svg>`;
  }

  function renderKpiStrip() {
    const pr = PRESETS[state.presetId];
    const strip = document.getElementById('dm-kpi-strip');
    if (!strip || !pr.computeKpis) return;
    const doneOps = state.doneOpsByPreset[pr.id] || new Set();
    const kpis = pr.computeKpis(pr, doneOps, state.customPins);
    strip.innerHTML = kpis.map((k) => `
      <div class="dm-kpi-card">
        <div>
          <div class="dm-kpi-label">${k.label}</div>
          <div class="dm-kpi-val ${k.cls || ''}">${k.val}</div>
        </div>
        <div class="dm-kpi-sub">${k.sub}</div>
      </div>
    `).join('');
  }

  function applyThemeVars() {
    const acc = ACCENTS[state.accentKey] || ACCENTS.cyan;
    document.documentElement.style.setProperty('--dm-accent', acc.hex);
    document.documentElement.style.setProperty('--dm-accent-rgb', acc.rgb.join(','));
    document.documentElement.setAttribute('data-demo-theme', state.uiMode);

    const pr = PRESETS[state.presetId];
    const titleEl = document.getElementById('dm-brand-title');
    const subEl = document.getElementById('dm-brand-sub');
    const aiTitle = document.getElementById('dm-ai-title');
    const crest = document.getElementById('dm-crest');
    if (titleEl) titleEl.textContent = (state.brandName || pr.brandDefault).toUpperCase();
    if (subEl) subEl.textContent = (state.subtitle || pr.subtitle).toUpperCase();
    if (aiTitle) {
      const b = (state.brandName || pr.brandDefault).trim();
      aiTitle.textContent = /\bAI$/i.test(b) ? `Ask ${b}` : `Ask ${b} AI`;
    }
    if (crest) {
      if (state.logoDataUrl) {
        crest.innerHTML = `<img src="${state.logoDataUrl}" alt="Custom client logo" />`;
      } else {
        crest.textContent = state.monogram || '⬡';
      }
    }

    const commBtn = document.getElementById('dm-commission-btn');
    if (commBtn) {
      const mods = state.selectedModules.join(', ');
      const scope = `White-Label Build (${state.brandName || pr.brandDefault} · ${pr.short} · ${state.uiMode} UI · Modules: ${mods})`;
      const uc = pr.id === 'business' ? 'logistics' : pr.id === 'medical' ? 'health' : pr.id === 'journalism' ? 'research' : pr.id;
      commBtn.href = `enterprise.html?usecase=${uc}&scope=${encodeURIComponent(scope)}`;
    }
  }

  function renderLeftPane() {
    const pr = PRESETS[state.presetId];
    const body = document.getElementById('dm-left-body');
    const tools = document.getElementById('dm-left-tools');
    const leftPane = document.getElementById('dm-left-pane');
    if (!body) return;

    document.querySelectorAll('.dm-ltab').forEach((b) => b.classList.toggle('active', b.dataset.ltab === state.leftTab));
    if (tools) tools.style.display = (state.leftTab === 'signals' || state.leftTab === 'ops') ? 'flex' : 'none';
    if (leftPane) leftPane.classList.toggle('wide-ops', state.leftTab === 'ops');

    const q = state.searchQ.toLowerCase();

    if (state.leftTab === 'signals') {
      const combined = [...state.customPins, ...pr.signals];
      const filtered = combined.filter((s) => {
        if (state.sevFilter === 'critical' && s.sev < 4) return false;
        if (state.sevFilter === 'open' && state.resolvedSignals.has(s.id)) return false;
        if (q && !(s.title + s.loc + s.cat + s.summary).toLowerCase().includes(q)) return false;
        return true;
      });
      body.innerHTML = filtered.map((s) => {
        const res = state.resolvedSignals.has(s.id);
        return `
          <button type="button" class="dm-sig-card ${state.selectedItem && state.selectedItem.id === s.id ? 'selected' : ''} ${res ? 'resolved' : ''}" data-sig="${s.id}">
            <div class="dm-sig-top">
              <span class="dm-cat">${s.isCustomPin ? '★ CSV' : s.cat}</span>
              <span class="dm-sev s${s.sev}">${res ? '✓ OK' : `S${s.sev}`}</span>
              <span class="dm-grade">${s.grade}</span>
              <span class="dm-time">${s.time}</span>
            </div>
            <div class="dm-sig-title">${s.title}</div>
            <div class="dm-sig-loc">📍 ${s.loc}</div>
          </button>
        `;
      }).join('') || '<div style="font-size:10px;color:var(--dm-muted);padding:14px;text-align:center;">No matching signals.</div>';

      body.querySelectorAll('[data-sig]').forEach((btn) => {
        btn.addEventListener('click', () => {
          const found = [...state.customPins, ...pr.signals].find((x) => x.id === btn.dataset.sig);
          if (found) selectItem(found);
        });
      });
    } else if (state.leftTab === 'ops') {
      const doneSet = state.doneOpsByPreset[pr.id] || new Set();
      const rows = pr.opsRows.filter((r) => {
        if (state.sevFilter === 'critical' && r.risk !== 'crit') return false;
        if (state.sevFilter === 'open' && doneSet.has(r.id)) return false;
        if (q && !(r.id + r.label + r.route + r.detail).toLowerCase().includes(q)) return false;
        return true;
      });

      body.innerHTML = `
        <div class="dm-ops-head">
          <strong style="color:var(--dm-accent);">${pr.opsTitle}</strong>
          <span>${doneSet.size}/${pr.opsRows.length} actioned</span>
        </div>
        ${rows.map((r) => {
          const isDone = doneSet.has(r.id);
          const statusCls = isDone ? 'ok' : r.risk;
          return `
            <div class="dm-ops-row ${isDone ? 'done' : ''}">
              <div class="dm-ops-top">
                <span class="dm-ops-id">${r.id}</span>
                <span class="dm-ops-status ${statusCls}">${isDone ? `✓ ${r.doneText}` : r.statusText}</span>
              </div>
              <div style="display:flex;align-items:center;justify-content:space-between;gap:8px;">
                <div class="dm-ops-detail"><strong>${r.label}</strong><br/><span style="color:var(--dm-muted);font-size:9px;">${r.route}</span></div>
                ${r.spark ? renderSparkSvg(r.spark) : ''}
              </div>
              <div style="font-size:9.2px;color:var(--dm-muted);line-height:1.45;">${r.detail}</div>
              <div class="dm-ops-actions">
                <button type="button" class="dm-mini-btn ${isDone ? 'done' : 'primary'}" data-ops-act="${r.id}">
                  ${isDone ? `✓ ${r.doneText} (Undo)` : `⚡ ${r.actionText}`}
                </button>
                <button type="button" class="dm-mini-btn" data-ops-fly="${r.id}">📍 Locate 3D</button>
                ${r.citation ? `<button type="button" class="dm-mini-btn" data-ops-cite="${r.id}">📋 Copy OSCOLA</button>` : ''}
              </div>
            </div>
          `;
        }).join('')}
      `;

      body.querySelectorAll('[data-ops-act]').forEach((btn) => {
        btn.addEventListener('click', () => {
          const id = btn.dataset.opsAct;
          const set = state.doneOpsByPreset[pr.id];
          if (set.has(id)) {
            set.delete(id);
            showToast(`Reopened operational item ${id}`);
          } else {
            set.add(id);
            showToast(`✓ Executed workflow action on ${id} — KPIs updated live`);
          }
          renderKpiStrip();
          renderLeftPane();
        });
      });

      body.querySelectorAll('[data-ops-fly]').forEach((btn) => {
        btn.addEventListener('click', () => {
          const r = pr.opsRows.find((x) => x.id === btn.dataset.opsFly);
          if (r && mapEngine) {
            mapEngine.flyTo(r.lat, r.lon, 2.2);
            if (window.innerWidth <= 760) setMobileView('globe');
          }
        });
      });

      body.querySelectorAll('[data-ops-cite]').forEach((btn) => {
        btn.addEventListener('click', () => {
          const r = pr.opsRows.find((x) => x.id === btn.dataset.opsCite);
          if (r?.citation) {
            navigator.clipboard?.writeText(r.citation).catch(() => {});
            showToast('✓ Copied OSCOLA primary-source citation to clipboard');
          }
        });
      });
    } else if (state.leftTab === 'docs') {
      const allDocs = [...state.userDocs, ...pr.docs];
      body.innerHTML = `
        <div class="dm-vault-note">🔒 100% isolated VPC vector index (${allDocs.length} sources active). Click any source card to query it immediately in Private AI.</div>
        ${allDocs.map((d) => `
          <div class="dm-doc-card" data-doc-q="${d.name.replace(/"/g, '&quot;')}">
            <div class="dm-doc-name">📄 ${d.name}</div>
            <div class="dm-doc-meta">${d.meta}</div>
            <div class="dm-doc-snip">${d.snippet}</div>
          </div>
        `).join('')}
      `;
      body.querySelectorAll('[data-doc-q]').forEach((card) => {
        card.addEventListener('click', () => {
          state.aiOpen = true;
          syncAiDrawerVisibility();
          if (window.innerWidth <= 760) setMobileView('ai');
          runPrivateAiQuery(`Summarize verified evidence from ${card.dataset.docQ}`);
        });
      });
    } else {
      body.innerHTML = `
        <div class="dm-byod">
          <div class="dm-byod-kicker">⬆ REAL CLIENT-SIDE DATA IMPORT (0 BYTES LEAVE BROWSER)</div>
          <p class="dm-byod-sub">Upload a real <strong>.CSV</strong> (with <code>lat, lon</code> columns) to plot your own sites live onto the 3D globe, or upload/paste any <strong>.TXT / .MD / .JSON</strong> policy to query it with Private RAG AI!</p>
          <label class="dm-dropzone">
            <strong>Click to Upload .CSV / .TXT / .MD / .JSON</strong><br/>
            <span style="font-size:8.6px;color:var(--dm-muted);">Geo CSV rows auto-pin as ★ markers on the 3D globe</span>
            <input type="file" id="dm-file-upload" accept=".csv,.txt,.md,.json" style="display:none;" />
          </label>
          <div style="display:flex;gap:6px;">
            <button type="button" id="dm-load-sample-csv" class="dm-btn" style="flex:1;justify-content:center;">⚡ Load Sample Geo-CSV</button>
            ${state.customPins.length ? `<button type="button" id="dm-clear-csv" class="dm-btn" style="color:#ff2d55;">Clear (${state.customPins.length})</button>` : ''}
          </div>
          <input type="text" id="dm-byod-title" class="dm-input" value="Client_Assets_2026.csv" placeholder="File or document title..." />
          <textarea id="dm-byod-text" class="dm-textarea" placeholder="Paste CSV rows (name,lat,lon,category,metric,notes) or any policy/SOP text here..."></textarea>
          <button type="button" id="dm-byod-save" class="dm-btn-accent" style="width:100%;">🌐 Plot on 3D Globe &amp; Index into Private AI</button>
          <div id="dm-byod-status" class="dm-byod-status"></div>
        </div>
      `;

      const ingestRaw = (title, text, isSample = false) => {
        const cleanTitle = (title || 'Imported_Data.txt').trim();
        const cleanText = (text || '').trim();
        const st = document.getElementById('dm-byod-status');
        if (!cleanText) { if (st) st.textContent = 'Upload a file or paste CSV / policy text first.'; return; }

        const parsed = parseCsvText(cleanText, cleanTitle);
        if (parsed.pins.length > 0) {
          const tagged = parsed.pins.map((p) => ({ ...p, isSample }));
          state.customPins = [...tagged, ...state.customPins.filter((p) => !(isSample && p.isSample))].slice(0, 60);
          if (mapEngine) mapEngine.flyTo(tagged[0].lat, tagged[0].lon, 2.0);
        }

        const docObj = {
          id: `udoc-${Date.now()}`,
          name: cleanTitle,
          meta: `CLIENT LOCAL IMPORT · ${parsed.pins.length ? `${parsed.pins.length} 3D GLOBE PINS · ` : ''}ZERO-RETENTION`,
          snippet: cleanText.slice(0, 260) + (cleanText.length > 260 ? '…' : ''),
          fullText: cleanText
        };
        state.userDocs = [docObj, ...state.userDocs.filter((x) => x.name !== cleanTitle)].slice(0, 10);

        renderKpiStrip();
        if (st) {
          st.textContent = parsed.pins.length
            ? `✓ Plotted ${parsed.pins.length} live ★ pins on the 3D globe & indexed "${cleanTitle}" into Private AI!`
            : `✓ Indexed "${cleanTitle}" (${cleanText.split(/\s+/).length} words) into local Private AI!`;
        }
        showToast(parsed.pins.length ? `★ Plotted ${parsed.pins.length} live CSV pins on the 3D globe!` : `✓ Indexed ${cleanTitle} into Private AI`);
        state.aiOpen = true;
        syncAiDrawerVisibility();
        appendAiMessage(
          'system',
          `Ingested <strong>${cleanTitle}</strong> locally in browser memory${parsed.pins.length ? ` and plotted <strong>${parsed.pins.length} ★ geo-pins</strong> directly on the 3D globe` : ''}. Ask any question about its rows or terms!`
        );
      };

      document.getElementById('dm-file-upload')?.addEventListener('change', (e) => {
        const file = e.target.files?.[0];
        if (!file) return;
        const reader = new FileReader();
        reader.onload = () => {
          const txt = String(reader.result || '');
          const tIn = document.getElementById('dm-byod-title');
          const bIn = document.getElementById('dm-byod-text');
          if (tIn) tIn.value = file.name;
          if (bIn) bIn.value = txt.slice(0, 8000);
          ingestRaw(file.name, txt);
        };
        reader.readAsText(file);
      });

      document.getElementById('dm-load-sample-csv')?.addEventListener('click', () => {
        const tIn = document.getElementById('dm-byod-title');
        const bIn = document.getElementById('dm-byod-text');
        const fname = `${pr.id}_live_assets_sample.csv`;
        if (tIn) tIn.value = fname;
        if (bIn) bIn.value = pr.sampleCsv;
        ingestRaw(fname, pr.sampleCsv, true);
      });

      document.getElementById('dm-clear-csv')?.addEventListener('click', () => {
        state.customPins = [];
        renderKpiStrip();
        renderLeftPane();
        showToast('Cleared imported CSV pins');
      });

      document.getElementById('dm-byod-save')?.addEventListener('click', () => {
        ingestRaw(document.getElementById('dm-byod-title')?.value, document.getElementById('dm-byod-text')?.value);
      });
    }
  }

  function selectItem(item) {
    state.selectedItem = item;
    if (mapEngine && item) mapEngine.flyTo(item.lat, item.lon, Math.max(1.8, 2.0));
    renderLeftPane();
    const card = document.getElementById('dm-dossier');
    if (!card) return;
    if (!item) { card.classList.remove('open'); return; }
    const isResolved = state.resolvedSignals.has(item.id);
    card.classList.add('open');
    card.innerHTML = `
      <div class="dm-dos-head">
        <div>
          <span class="dm-sev s${item.sev || 3}">${isResolved ? '✓ OK' : `S${item.sev || 3}`}</span>
          <span class="dm-cat" style="margin-left:5px;">${item.cat}</span>
          <span class="dm-grade" style="margin-left:5px;">${item.grade || 'LIVE'}</span>
        </div>
        <button type="button" class="dm-icon-x" id="dm-dos-close">✕</button>
      </div>
      <h4>${item.title}</h4>
      <div class="dm-dos-loc">📍 ${item.loc} · ${item.time || 'Live'} · ${item.source}</div>
      <p>${item.summary}</p>
      <div class="dm-dos-actions">
        ${item.actionLabel ? `<button type="button" id="dm-dos-act" class="dm-mini-btn ${isResolved ? 'done' : 'primary'}">${isResolved ? `✓ ${item.resolvedLabel || 'Mitigated'}` : `⚡ ${item.actionLabel}`}</button>` : ''}
        <button type="button" id="dm-dos-ask" class="dm-btn-accent" style="padding:5px 9px;font-size:9px;">✨ Ask Private AI</button>
      </div>
    `;
    document.getElementById('dm-dos-close')?.addEventListener('click', () => selectItem(null));
    document.getElementById('dm-dos-act')?.addEventListener('click', () => {
      if (state.resolvedSignals.has(item.id)) state.resolvedSignals.delete(item.id);
      else state.resolvedSignals.add(item.id);
      showToast(state.resolvedSignals.has(item.id) ? `✓ ${item.resolvedLabel || 'Action recorded'}` : 'Alert reopened');
      selectItem(item);
    });
    document.getElementById('dm-dos-ask')?.addEventListener('click', () => {
      state.aiOpen = true;
      syncAiDrawerVisibility();
      if (window.innerWidth <= 760) setMobileView('ai');
      runPrivateAiQuery(`Explain operational impact & verified SOP for: ${item.title}`);
    });
  }

  /* ── PRIVATE CITATION-LOCKED RAG AI DRAWER ── */
  function syncAiDrawerVisibility() {
    const drawer = document.getElementById('dm-ai-drawer');
    if (drawer) drawer.classList.toggle('open', state.aiOpen);
  }

  function setMobileView(view) {
    state.mobileView = view;
    const left = document.getElementById('dm-left-pane');
    const ai = document.getElementById('dm-ai-drawer');
    if (left) left.classList.toggle('mob-open', view === 'ops');
    if (ai) ai.classList.toggle('open', view === 'ai');
    state.aiOpen = view === 'ai';
    document.querySelectorAll('[data-mview]').forEach((b) => b.classList.toggle('active', b.dataset.mview === view));
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
    document.getElementById('dm-prov-x')?.addEventListener('click', () => box.classList.remove('open'));
    if (doc.pinId) {
      const sig = PRESETS[state.presetId].signals.find((s) => s.id === doc.pinId);
      if (sig) {
        if (openDossier) selectItem(sig);
        else if (mapEngine) mapEngine.flyTo(sig.lat, sig.lon);
      }
    }
  }

  function runPrivateAiQuery(queryText, autoInit = false) {
    const q = queryText.trim();
    if (!q) return;
    appendAiMessage('user', q.replace(/</g, '&lt;'));
    const pr = PRESETS[state.presetId];

    const exact = pr.prompts.find((p) => p.q.toLowerCase() === q.toLowerCase());
    if (exact) {
      const cites = exact.cites.map((id) => pr.docs.find((d) => d.id === id)).filter(Boolean);
      const html = exact.a.replace(/\{\{(\d+)\}\}/g, (_, n) => `<span class="dm-ic">[${n}]</span>`);
      setTimeout(() => {
        appendAiMessage('ai', html, cites);
        if (cites[0]) showProvenanceToast(cites[0], 1, !autoInit);
      }, autoInit ? 60 : 260);
      return;
    }

    const words = q.toLowerCase().split(/[^a-z0-9]+/).filter((w) => w.length > 2);
    const pool = [...state.userDocs, ...pr.docs];
    const scored = pool.map((d) => {
      const hay = `${d.name} ${d.meta} ${d.fullText || d.snippet}`.toLowerCase();
      let score = words.reduce((acc, w) => acc + (hay.includes(w) ? 2 : 0), 0);
      if (String(d.id).startsWith('udoc-') && score > 0) score += 3;
      return { doc: d, score };
    }).sort((a, b) => b.score - a.score);

    const top = scored.filter((x) => x.score > 0).slice(0, 2).map((x) => x.doc);
    setTimeout(() => {
      if (top.length) {
        const summary = top.map((d, i) => `Per <strong>${d.name}</strong> <span class="dm-ic">[${i + 1}]</span>: "${d.snippet}"`).join('<br/><br/>');
        appendAiMessage('ai', summary, top);
        showProvenanceToast(top[0], 1);
      } else {
        appendAiMessage('ai', `<strong>Citation-Lock Guardrail Active:</strong> No verified chunk in the current private index directly answers that query (0 hallucinated facts invented). Try a starter prompt above or import your own CSV/SOP in <strong>+ IMPORT</strong>!`, []);
      }
    }, 260);
  }

  function exportBrandedBrief() {
    const pr = PRESETS[state.presetId];
    const doneSet = state.doneOpsByPreset[pr.id] || new Set();
    const kpis = pr.computeKpis(pr, doneSet, state.customPins);
    const lines = [
      `==================================================================`,
      `${(state.brandName || pr.brandDefault).toUpperCase()} — EXECUTIVE INTELLIGENCE BRIEF`,
      `${(state.subtitle || pr.subtitle).toUpperCase()}`,
      `Generated via Sovereign White-Label Studio · ${new Date().toUTCString()}`,
      `==================================================================`,
      ``,
      `LIVE OPERATIONAL KPI SNAPSHOT`,
      ...kpis.map((k) => `  • ${k.label}: ${k.val} (${k.sub})`),
      ``,
      `SELECTED PRIVATE DEPLOYMENT MODULES`,
      ...state.selectedModules.map((m) => `  [x] ${m}`),
      ``,
      `ACTIVE PRIORITY SIGNALS (${pr.signals.length + state.customPins.length})`,
      ...[...state.customPins, ...pr.signals].map((s, i) => `  ${i + 1}. [S${s.sev} · ${s.cat}] ${s.title} — ${s.loc}\n     ${s.summary} (Source: ${s.source})`),
      ``,
      `OPERATIONS WORKFLOW STATUS`,
      ...pr.opsRows.map((r) => `  • ${r.id} (${r.label}): ${doneSet.has(r.id) ? 'COMPLETED — ' + r.doneText : 'OPEN — ' + r.statusText}`),
      ``,
      `------------------------------------------------------------------`,
      `Commission your private VPC / On-Prem build: https://sovdash.com/enterprise.html`
    ];
    const blob = new Blob([lines.join('\n')], { type: 'text/plain;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${(state.brandName || pr.brandDefault).toLowerCase().replace(/[^a-z0-9]+/g, '-')}-brief.txt`;
    document.body.appendChild(a);
    a.click();
    a.remove();
    setTimeout(() => URL.revokeObjectURL(url), 1000);
    showToast('✓ Downloaded Branded Executive Brief (.txt)');
  }

  function loadPreset(presetId, preserveBrand = false) {
    const pr = PRESETS[presetId] || PRESETS.business;
    state.presetId = pr.id;
    state.customPins = state.customPins.filter((p) => !p.isSample);
    if (!preserveBrand) {
      state.brandName = pr.brandDefault;
      state.subtitle = pr.subtitle;
      state.accentKey = pr.accentDefault;
    }
    state.selectedItem = null;
    document.getElementById('dm-dossier')?.classList.remove('open');
    document.querySelectorAll('.dm-preset-btn').forEach((b) => b.classList.toggle('active', b.dataset.preset === pr.id));

    const brandIn = document.getElementById('dm-brand-input');
    const subIn = document.getElementById('dm-sub-input');
    if (brandIn) brandIn.value = state.brandName;
    if (subIn) subIn.value = state.subtitle;
    document.querySelectorAll('.dm-swatch').forEach((s) => s.classList.toggle('active', s.dataset.accent === state.accentKey));

    applyThemeVars();
    renderKpiStrip();
    renderLeftPane();
    if (mapEngine) mapEngine.flyTo(pr.centerLat, pr.centerLon, 1.0);

    const starters = document.getElementById('dm-ai-starters');
    const log = document.getElementById('dm-ai-log');
    if (log) log.innerHTML = '';
    if (starters) {
      starters.innerHTML = pr.prompts.map((p, i) => `<button type="button" class="dm-starter-btn" data-st="${i}">${p.q}</button>`).join('');
      starters.querySelectorAll('[data-st]').forEach((btn) => {
        btn.addEventListener('click', () => runPrivateAiQuery(pr.prompts[Number(btn.dataset.st)].q));
      });
    }
    runPrivateAiQuery(pr.prompts[0].q, true);
  }

  document.addEventListener('DOMContentLoaded', () => {
    const canvas = document.getElementById('dm-map-canvas');
    if (canvas) mapEngine = createDemoGlobeEngine(canvas);

    const presetBar = document.getElementById('dm-preset-bar');
    if (presetBar) {
      presetBar.innerHTML = Object.values(PRESETS).map((pr) =>
        `<button type="button" class="dm-preset-btn" data-preset="${pr.id}">${pr.short}</button>`
      ).join('');
      presetBar.querySelectorAll('.dm-preset-btn').forEach((btn) => {
        btn.addEventListener('click', () => loadPreset(btn.dataset.preset, false));
      });
    }

    document.querySelectorAll('.dm-ltab').forEach((btn) => {
      btn.addEventListener('click', () => { state.leftTab = btn.dataset.ltab; renderLeftPane(); });
    });
    document.getElementById('dm-search')?.addEventListener('input', (e) => { state.searchQ = e.target.value; renderLeftPane(); });
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
      document.addEventListener('click', (e) => { if (!custPop.contains(e.target) && !custBtn.contains(e.target)) custPop.classList.remove('open'); });
    }
    document.getElementById('dm-brand-input')?.addEventListener('input', (e) => { state.brandName = e.target.value.slice(0, 40); applyThemeVars(); });
    document.getElementById('dm-sub-input')?.addEventListener('input', (e) => { state.subtitle = e.target.value.slice(0, 56); applyThemeVars(); });
    document.getElementById('dm-monogram-input')?.addEventListener('input', (e) => { state.logoDataUrl = ''; state.monogram = (e.target.value || '⬡').toUpperCase(); applyThemeVars(); });
    document.getElementById('dm-logo-upload')?.addEventListener('change', (e) => {
      const f = e.target.files?.[0];
      if (!f) return;
      const r = new FileReader();
      r.onload = () => { state.logoDataUrl = String(r.result || ''); applyThemeVars(); showToast('✓ Custom client logo applied live'); };
      r.readAsDataURL(f);
    });
    document.getElementById('dm-logo-clear')?.addEventListener('click', () => { state.logoDataUrl = ''; state.monogram = '⬡'; applyThemeVars(); });

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

    document.querySelectorAll('[data-mod]').forEach((chk) => {
      chk.addEventListener('change', () => {
        state.selectedModules = Array.from(document.querySelectorAll('[data-mod]:checked')).map((c) => c.dataset.mod);
        applyThemeVars();
      });
    });

    document.getElementById('dm-copy-share')?.addEventListener('click', () => {
      const u = new URL(window.location.href.split('?')[0]);
      u.searchParams.set('preset', state.presetId);
      u.searchParams.set('brand', state.brandName || PRESETS[state.presetId].brandDefault);
      u.searchParams.set('sub', state.subtitle || PRESETS[state.presetId].subtitle);
      u.searchParams.set('accent', state.accentKey);
      u.searchParams.set('theme', state.uiMode);
      navigator.clipboard?.writeText(u.toString()).catch(() => {});
      showToast('✓ Pre-branded client demo link copied!');
    });

    document.getElementById('dm-export-brief')?.addEventListener('click', exportBrandedBrief);

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

    document.getElementById('dm-ai-toggle')?.addEventListener('click', () => {
      if (window.innerWidth <= 760) { setMobileView(state.mobileView === 'ai' ? 'globe' : 'ai'); return; }
      state.aiOpen = !state.aiOpen;
      syncAiDrawerVisibility();
    });
    document.getElementById('dm-ai-close')?.addEventListener('click', () => {
      if (window.innerWidth <= 760) { setMobileView('globe'); return; }
      state.aiOpen = false;
      syncAiDrawerVisibility();
    });
    document.getElementById('dm-ai-form')?.addEventListener('submit', (e) => {
      e.preventDefault();
      const inp = document.getElementById('dm-ai-input');
      if (inp && inp.value.trim()) { runPrivateAiQuery(inp.value); inp.value = ''; }
    });

    document.querySelectorAll('[data-mview]').forEach((btn) => {
      btn.addEventListener('click', () => setMobileView(btn.dataset.mview));
    });

    if (window.innerWidth < 1080) state.aiOpen = false;
    syncAiDrawerVisibility();
    loadPreset(state.presetId, Boolean(qs.get('brand')));
  });
})();
