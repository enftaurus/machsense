'use client'

import { useMemo, useState } from 'react'
import {
  Activity,
  AlertTriangle,
  ArrowRight,
  Bell,
  BrainCircuit,
  CheckCircle2,
  ChevronDown,
  CircleHelp,
  Cpu,
  Factory,
  Gauge,
  LineChart,
  LockKeyhole,
  Menu,
  Moon,
  MoreHorizontal,
  Network,
  Play,
  Radar,
  Search,
  Settings2,
  ShieldCheck,
  Siren,
  Sparkles,
  Sun,
  Thermometer,
  Timer,
  UserRound,
  Wrench,
  X,
  Zap,
} from 'lucide-react'

type Role = 'admin' | 'engineer'
type MachineStatus = 'Healthy' | 'Warning' | 'Critical' | 'Offline'

const machines = [
  { id: 'CNC-04', name: 'CNC Milling Cell 04', line: 'Machining / Line A', status: 'Critical' as MachineStatus, health: 42, temp: 86, vibration: 9.8, uptime: '91.4%', issue: 'Bearing degradation', accent: 'critical' },
  { id: 'PMP-12', name: 'Hydraulic Pump 12', line: 'Assembly / Line B', status: 'Warning' as MachineStatus, health: 71, temp: 69, vibration: 5.2, uptime: '96.8%', issue: 'Temperature drift', accent: 'warning' },
  { id: 'ROB-02', name: 'Robot Arm 02', line: 'Assembly / Line B', status: 'Healthy' as MachineStatus, health: 94, temp: 54, vibration: 2.1, uptime: '99.2%', issue: 'Within baseline', accent: 'healthy' },
  { id: 'CMP-07', name: 'Air Compressor 07', line: 'Utilities / Plant 1', status: 'Healthy' as MachineStatus, health: 89, temp: 58, vibration: 2.8, uptime: '98.7%', issue: 'Within baseline', accent: 'healthy' },
]

const alerts = [
  { level: 'Critical', title: 'Bearing failure probability elevated', machine: 'CNC-04', time: '2 min ago', detail: 'Vibration harmonic energy is 3.4× above its learned baseline.' },
  { level: 'Warning', title: 'Thermal trend outside baseline', machine: 'PMP-12', time: '18 min ago', detail: 'Discharge temperature has drifted steadily for 46 minutes.' },
  { level: 'Info', title: 'Maintenance window approaching', machine: 'ROB-02', time: '1 hr ago', detail: 'Scheduled calibration is due in 3 days.' },
]

const navItems = [
  { label: 'Overview', icon: Factory },
  { label: 'Machines', icon: Cpu },
  { label: 'Alerts', icon: Siren, count: 2 },
  { label: 'Maintenance', icon: Wrench },
  { label: 'Reports', icon: LineChart },
]

function Logo() {
  return <div className="flex items-center gap-3"><div className="brand-mark"><Radar className="size-5" /></div><span className="text-lg font-semibold tracking-tight">Mach<span className="text-primary">Sense</span></span></div>
}

function StatusBadge({ status }: { status: MachineStatus | string }) {
  const style = status.toLowerCase()
  return <span className={`status-badge ${style}`}><span className="status-dot" />{status}</span>
}

function MiniChart({ critical = false, warning = false }: { critical?: boolean; warning?: boolean }) {
  const points = critical ? '0,40 12,35 24,38 36,28 48,31 60,21 72,26 84,16 96,19 108,4 120,14 132,2 144,10 156,0' : warning ? '0,36 12,34 24,29 36,31 48,25 60,24 72,21 84,19 96,22 108,15 120,16 132,11 144,12 156,5' : '0,31 12,27 24,29 36,25 48,27 60,21 72,23 84,19 96,21 108,15 120,17 132,12 144,14 156,10'
  return <svg viewBox="0 0 156 42" className="mini-chart" aria-hidden="true"><polyline points={points} fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" /></svg>
}

function TrendChart() {
  return <div className="trend-chart"><div className="chart-grid" /><svg viewBox="0 0 700 260" preserveAspectRatio="none" aria-label="CNC-04 vibration and temperature trend"><path d="M0 210 C44 204 52 179 86 186 S132 162 170 174 S212 139 248 154 S283 127 320 136 S360 102 402 118 S443 84 480 99 S514 69 552 77 S596 37 630 52 S663 18 700 27" fill="none" stroke="var(--chart-blue)" strokeWidth="3" /><path d="M0 225 C40 222 62 216 92 220 S145 204 182 211 S237 191 276 196 S330 177 365 188 S417 164 454 172 S507 145 544 151 S598 134 632 136 S670 119 700 121" fill="none" stroke="var(--chart-amber)" strokeWidth="3" strokeDasharray="7 7" /></svg><div className="chart-label left">12:00</div><div className="chart-label mid">14:00</div><div className="chart-label right">16:00</div></div>
}

function App() {
  const [role, setRole] = useState<Role | null>(null)
  const [activeNav, setActiveNav] = useState('Overview')
  const [selectedMachine, setSelectedMachine] = useState(machines[0])
  const [simulation, setSimulation] = useState<'normal' | 'warning' | 'critical'>('critical')
  const [alertOpen, setAlertOpen] = useState(false)
  const [shutdownOpen, setShutdownOpen] = useState(false)
  const [shutdownDone, setShutdownDone] = useState(false)
  const [mobileNav, setMobileNav] = useState(false)

  const simulatedMachines = useMemo(() => machines.map((m) => simulation === 'normal' && m.id === 'CNC-04' ? { ...m, status: 'Healthy' as MachineStatus, health: 93, temp: 57, vibration: 2.4, issue: 'Within baseline', accent: 'healthy' } : simulation === 'warning' && m.id === 'CNC-04' ? { ...m, status: 'Warning' as MachineStatus, health: 69, temp: 70, vibration: 5.7, issue: 'Vibration drift', accent: 'warning' } : m), [simulation])

  if (!role) return <Landing onLogin={setRole} />

  const currentMachine = simulatedMachines.find((m) => m.id === selectedMachine.id) ?? simulatedMachines[0]

  return <div className="app-shell">
    <aside className={`sidebar ${mobileNav ? 'mobile-open' : ''}`}>
      <div className="sidebar-top"><Logo /><button className="icon-button mobile-only" aria-label="Close navigation" onClick={() => setMobileNav(false)}><X /></button></div>
      <div className="workspace-switcher"><div className="workspace-icon"><Factory className="size-4" /></div><div><div className="eyebrow">Workspace</div><div className="font-medium">Northstar Factory</div></div><ChevronDown className="ml-auto size-4 text-muted-foreground" /></div>
      <nav className="nav-list" aria-label="Main navigation">{navItems.map(({ label, icon: Icon, count }) => <button key={label} className={`nav-item ${activeNav === label ? 'active' : ''}`} onClick={() => { setActiveNav(label); setMobileNav(false) }}><Icon className="size-4" /><span>{label}</span>{count && <span className="nav-count">{count}</span>}</button>)}</nav>
      <div className="sidebar-bottom"><button className="nav-item"><Settings2 className="size-4" /><span>Settings</span></button><div className="user-card"><div className="avatar">{role === 'admin' ? 'AM' : 'JD'}</div><div className="min-w-0"><div className="truncate text-sm font-medium">{role === 'admin' ? 'Alex Morgan' : 'Jordan Diaz'}</div><div className="text-xs text-muted-foreground">{role === 'admin' ? 'Plant Admin' : 'Reliability Eng.'}</div></div><MoreHorizontal className="ml-auto size-4 text-muted-foreground" /></div></div>
    </aside>
    <main className="main-content">
      <header className="topbar"><button className="icon-button mobile-only" aria-label="Open navigation" onClick={() => setMobileNav(true)}><Menu /></button><div className="breadcrumb"><span>Northstar Factory</span><ArrowRight className="size-3" /><strong>{activeNav}</strong></div><div className="topbar-actions"><div className="simulation-control"><span className="pulse-dot" /> Simulation <select value={simulation} onChange={(e) => setSimulation(e.target.value as typeof simulation)} aria-label="Simulation mode"><option value="normal">Normal operation</option><option value="warning">Warning drift</option><option value="critical">Critical anomaly</option></select><Play className="size-3 fill-current" /></div><button className="icon-button" aria-label="Notifications" onClick={() => setAlertOpen(true)}><Bell /><span className="notification-dot" /></button><div className="avatar">{role === 'admin' ? 'AM' : 'JD'}</div></div></header>
      <div className="content-wrap">
        <section className="page-heading"><div><div className="eyebrow">{role === 'admin' ? 'Plant command center' : 'Reliability workspace'}</div><h1>{activeNav === 'Overview' ? `Good morning, ${role === 'admin' ? 'Alex' : 'Jordan'}.` : activeNav}</h1><p>{activeNav === 'Overview' ? 'Here is what is happening across your operation today.' : `Review and manage ${activeNav.toLowerCase()} across Northstar Factory.`}</p></div><div className="heading-actions"><button className="button secondary"><Search className="size-4" /> Search</button><button className="button primary" onClick={() => setAlertOpen(true)}><Siren className="size-4" /> Raise alert</button></div></section>
        <section className="metric-grid"><Metric icon={Activity} label="Fleet health" value="82.4%" trend="+4.8%" detail="vs last 24 hours" tone="blue" /><Metric icon={AlertTriangle} label="Active alerts" value="02" trend="1 critical" detail="needs attention" tone="red" /><Metric icon={Timer} label="Predicted uptime" value="98.1%" trend="+1.2%" detail="next 7 days" tone="amber" /><Metric icon={Wrench} label="Maintenance due" value="04" trend="2 this week" detail="scheduled tasks" tone="violet" /></section>
        <section className="dashboard-grid"><div className="panel machine-panel"><PanelHeader title="Fleet overview" subtitle="Live machine health across your plant" action="View all machines" /><div className="machine-list">{simulatedMachines.map((machine) => <button className={`machine-row ${currentMachine.id === machine.id ? 'selected' : ''}`} key={machine.id} onClick={() => setSelectedMachine(machine)}><div className={`machine-icon ${machine.accent}`}><Cpu className="size-4" /></div><div className="machine-main"><div className="flex items-center gap-2"><strong>{machine.id}</strong><StatusBadge status={machine.status} /></div><div className="text-xs text-muted-foreground">{machine.name}</div></div><div className="machine-spark"><MiniChart critical={machine.status === 'Critical'} warning={machine.status === 'Warning'} /></div><div className="machine-health"><strong>{machine.health}%</strong><span>health</span></div><ArrowRight className="size-4 text-muted-foreground" /></button>)}</div></div><div className="panel alert-panel"><PanelHeader title="Attention required" subtitle="Signals that need a decision" action="Open alerts" /><div className="alert-list">{alerts.slice(0, 2).map((alert) => <div className="alert-row" key={alert.title}><div className={`alert-icon ${alert.level.toLowerCase()}`}>{alert.level === 'Critical' ? <Siren className="size-4" /> : <Thermometer className="size-4" />}</div><div className="min-w-0 flex-1"><div className="flex items-center justify-between gap-2"><strong className="truncate">{alert.title}</strong><span className="text-xs text-muted-foreground">{alert.time}</span></div><div className="mt-1 text-xs text-muted-foreground">{alert.machine} · {alert.detail}</div></div></div>)}<button className="button secondary full" onClick={() => setAlertOpen(true)}>Review all alerts <ArrowRight className="size-4" /></button></div></div></section>
        <section className="dashboard-grid lower"><div className="panel signal-panel"><PanelHeader title={`${currentMachine.id} signal health`} subtitle="Live telemetry compared to baseline" action="Open investigation" /><div className="signal-head"><div><StatusBadge status={currentMachine.status} /><h2>{currentMachine.name}</h2><p>{currentMachine.line}</p></div><div className="health-score"><span>Health score</span><strong>{currentMachine.health}<small>/100</small></strong></div></div><TrendChart /><div className="signal-legend"><span><i className="legend-dot blue" /> Vibration RMS</span><span><i className="legend-dot amber" /> Temperature</span><span><i className="legend-line" /> Learned baseline</span></div></div><div className="panel ai-panel"><div className="ai-heading"><div className="ai-icon"><Sparkles className="size-5" /></div><div><div className="eyebrow">MachSense intelligence</div><h2>Signal summary</h2></div></div><p className="ai-copy">The current signal pattern is consistent with <strong>early-stage bearing degradation</strong>. Harmonic energy is rising faster than the learned baseline.</p><div className="evidence"><div className="evidence-row"><span>Model confidence</span><strong>94.2%</strong></div><div className="evidence-bar"><span style={{ width: '94%' }} /></div><div className="evidence-row"><span>Last model update</span><span className="text-muted-foreground">Today, 16:02</span></div><div className="evidence-row"><span>Recommended action</span><span className="recommendation">Inspect within 24h</span></div></div><div className="human-note"><ShieldCheck className="size-4" /><span>AI detects and recommends. A human decides.</span></div><button className="button primary full" onClick={() => setShutdownOpen(true)}>Open machine controls <ArrowRight className="size-4" /></button></div></section>
        <section className="panel timeline-panel"><PanelHeader title="Recent activity" subtitle="A human-readable audit trail of decisions and events" action="View audit log" /><div className="timeline">{[{ icon: Siren, title: 'Critical alert acknowledged', meta: 'Alex Morgan · CNC-04', time: '16:08', tone: 'red' }, { icon: BrainCircuit, title: 'AI recommendation generated', meta: 'MachSense model · 94.2% confidence', time: '16:02', tone: 'blue' }, { icon: Wrench, title: 'Maintenance task completed', meta: 'Jordan Diaz · ROB-02', time: '14:41', tone: 'green' }].map((item) => <div className="timeline-item" key={item.title}><div className={`timeline-icon ${item.tone}`}><item.icon className="size-4" /></div><div className="flex-1"><strong>{item.title}</strong><div className="text-xs text-muted-foreground">{item.meta}</div></div><span className="text-xs text-muted-foreground">{item.time}</span></div>)}</div></section>
      </div>
    </main>
    {alertOpen && <Modal title="Raise an alert" onClose={() => setAlertOpen(false)}><div className="modal-callout warning"><AlertTriangle className="size-4" /><span>This alert will notify the assigned engineer and be added to the audit trail.</span></div><label className="field-label">Machine<select className="field-input" defaultValue={currentMachine.id}>{simulatedMachines.map((m) => <option key={m.id}>{m.id} — {m.name}</option>)}</select></label><label className="field-label">Priority<select className="field-input" defaultValue="Critical"><option>Critical</option><option>Warning</option><option>Info</option></select></label><label className="field-label">Message<textarea className="field-input" defaultValue={`Review ${currentMachine.id}: signal trend is outside the learned baseline.`} /></label><div className="modal-actions"><button className="button secondary" onClick={() => setAlertOpen(false)}>Cancel</button><button className="button primary" onClick={() => setAlertOpen(false)}>Send alert</button></div></Modal>}
    {shutdownOpen && <Modal title="Machine controls" onClose={() => setShutdownOpen(false)}><div className="modal-machine"><div className="machine-icon critical"><Cpu className="size-5" /></div><div><strong>{currentMachine.id}</strong><div className="text-sm text-muted-foreground">{currentMachine.name}</div></div><StatusBadge status={shutdownDone ? 'Offline' : currentMachine.status} /></div><div className="modal-callout critical"><LockKeyhole className="size-4" /><span>Manual shutdown requires human confirmation. This action will stop the machine and notify the plant team.</span></div><div className="modal-actions"><button className="button secondary" onClick={() => setShutdownOpen(false)}>Cancel</button><button className="button danger" onClick={() => { setShutdownDone(true); setTimeout(() => setShutdownOpen(false), 900) }}>{shutdownDone ? <CheckCircle2 className="size-4" /> : <Zap className="size-4" />} {shutdownDone ? 'Shutdown logged' : 'Confirm shutdown'}</button></div></Modal>}
  </div>
}

function Metric({ icon: Icon, label, value, trend, detail, tone }: { icon: typeof Activity; label: string; value: string; trend: string; detail: string; tone: string }) { return <div className="metric-card"><div className={`metric-icon ${tone}`}><Icon className="size-4" /></div><div className="metric-copy"><span>{label}</span><strong>{value}</strong><div><b>{trend}</b> <em>{detail}</em></div></div></div> }
function PanelHeader({ title, subtitle, action }: { title: string; subtitle: string; action: string }) { return <div className="panel-header"><div><h2>{title}</h2><p>{subtitle}</p></div><button className="text-button">{action} <ArrowRight className="size-3" /></button></div> }
function Modal({ title, children, onClose }: { title: string; children: React.ReactNode; onClose: () => void }) { return <div className="modal-backdrop" role="presentation" onMouseDown={(e) => e.target === e.currentTarget && onClose()}><div className="modal" role="dialog" aria-modal="true" aria-labelledby="modal-title"><div className="modal-header"><h2 id="modal-title">{title}</h2><button className="icon-button" aria-label="Close dialog" onClick={onClose}><X /></button></div>{children}</div></div> }
function Landing({ onLogin }: { onLogin: (role: Role) => void }) { return <main className="landing"><div className="landing-nav"><Logo /><button className="button secondary" onClick={() => onLogin('engineer')}>Open demo <ArrowRight className="size-4" /></button></div><div className="landing-grid"><section className="landing-copy"><div className="eyebrow"><span className="pulse-dot" /> Industrial intelligence, made accountable</div><h1>Know what your machines are telling you.</h1><p>MachSense turns noisy industrial signals into clear, explainable decisions — before downtime becomes a crisis.</p><div className="landing-actions"><button className="button primary large" onClick={() => onLogin('admin')}>Enter command center <ArrowRight className="size-4" /></button><button className="button ghost large" onClick={() => onLogin('engineer')}><Wrench className="size-4" /> Engineer demo</button></div><div className="trust-row"><span><ShieldCheck className="size-4" /> Human-in-the-loop by design</span><span><Network className="size-4" /> Connects to your fleet</span></div></section><section className="hero-visual"><div className="visual-glow" /><div className="hero-console"><div className="console-top"><span className="console-lights"><i /><i /><i /></span><span>LIVE / NORTHSTAR FACTORY</span><span>16:08:42</span></div><div className="console-body"><div className="console-title"><div><div className="eyebrow">Fleet signal map</div><h2>Operational clarity</h2></div><StatusBadge status="Monitoring" /></div><div className="console-radar"><div className="radar-ring one" /><div className="radar-ring two" /><div className="radar-sweep" /><div className="radar-node n1" /><div className="radar-node n2" /><div className="radar-node n3" /></div><div className="console-stats"><div><span>Machines online</span><strong>47 <small>/ 48</small></strong></div><div><span>Fleet health</span><strong>82.4%</strong></div><div><span>Decisions today</span><strong>126</strong></div></div><div className="console-alert"><div className="alert-icon critical"><Siren className="size-4" /></div><div><strong>Attention: CNC-04</strong><p>Pattern anomaly detected · 94.2% confidence</p></div><ArrowRight className="ml-auto size-4" /></div></div></div></section></div><div className="landing-footer"><span>Built for teams who cannot afford black boxes.</span><span>MachSense / v2.4.0</span></div></main> }

export default App
