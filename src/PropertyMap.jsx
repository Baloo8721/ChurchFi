import { useState, useEffect } from "react";

const CAMERAS = [
  { id: "cam1", label: "Front Entrance", zone: "North", x: 310, y: 58, status: "online" },
  { id: "cam2", label: "Parking Lot", zone: "East", x: 565, y: 185, status: "online" },
  { id: "cam3", label: "Church Rear", zone: "West", x: 148, y: 330, status: "online" },
  { id: "cam4", label: "13th St Gate", zone: "Center", x: 408, y: 295, status: "offline" },
  { id: "cam5", label: "School Entry", zone: "Center", x: 298, y: 148, status: "online" },
  { id: "cam6", label: "South Perimeter", zone: "South", x: 460, y: 475, status: "online" },
];

const STATUS_COLOR = { active: "#22c55e", paid: "#38bdf8", expired: "#f87171", offline: "#334155" };
const STATUS_LABEL = { active: "Active", paid: "Paid", expired: "Expired", offline: "No Device" };

const generateUnits = () => {
  const units = [];
  
  // Church - 40 units (20 per floor, 2 floors)
  for (let i = 1; i <= 40; i++) {
    const floor = i <= 20 ? 1 : 2;
    const row = Math.ceil((i % 20 || 20) / 5);
    const col = ((i - 1) % 5) + 1;
    units.push({
      id: i,
      label: `U${i}`,
      building: "CHURCH",
      floor,
      row,
      col,
      rx: 140 + (col - 1) * 22 + (floor === 2 ? 0 : 0),
      ry: floor === 1 ? 95 + (row - 1) * 22 : 175 + (row - 1) * 22
    });
  }
  
  // Block A - 8 units
  for (let i = 1; i <= 8; i++) {
    const row = Math.ceil(i / 2);
    const col = (i % 2) || 2;
    units.push({
      id: 40 + i,
      label: `U${40 + i}`,
      building: "BLOCK A",
      rx: 67 + (col - 1) * 20,
      ry: 130 + (row - 1) * 45
    });
  }
  
  // Block B - 8 units
  for (let i = 1; i <= 8; i++) {
    const row = Math.ceil(i / 2);
    const col = (i % 2) || 2;
    units.push({
      id: 48 + i,
      label: `U${48 + i}`,
      building: "BLOCK B",
      rx: 645 + (col - 1) * 20,
      ry: 130 + (row - 1) * 45
    });
  }
  
  // Trailer Park - 20 units
  for (let i = 1; i <= 20; i++) {
    const row = Math.ceil(i / 10);
    const col = (i % 10) || 10;
    units.push({
      id: 56 + i,
      label: `U${56 + i}`,
      building: "TRAILER",
      rx: 165 + (col - 1) * 42,
      ry: row === 1 ? 486 : 512
    });
  }
  
  return units;
};

const ALL_UNITS = generateUnits();

const BUILDINGS_DATA = [
  { id: "church", label: "CHURCH", sublabel: "40 Units · 2 Floors", x: 110, y: 70, w: 130, h: 180, type: "church", color: "#22c55e", units: ALL_UNITS.filter(u => u.building === "CHURCH") },
  { id: "blockA", label: "BLOCK A", sublabel: "8 Units", x: 38, y: 105, w: 58, h: 370, type: "residential", color: "#22c55e", units: ALL_UNITS.filter(u => u.building === "BLOCK A") },
  { id: "blockB", label: "BLOCK B", sublabel: "8 Units", x: 616, y: 105, w: 58, h: 370, type: "residential", color: "#22c55e", units: ALL_UNITS.filter(u => u.building === "BLOCK B") },
  { id: "trailer", label: "TRAILER", sublabel: "20 Units", x: 135, y: 460, w: 452, h: 70, type: "mobile", color: "#22c55e", units: ALL_UNITS.filter(u => u.building === "TRAILER") },
  { id: "school", label: "SCHOOL", sublabel: "BGT Academy", x: 232, y: 112, w: 112, h: 75, type: "school", color: "#38bdf8", units: [] },
  { id: "parking", label: "PARKING", sublabel: "50 Spaces", x: 418, y: 90, w: 148, h: 108, type: "parking", color: "#64748b", units: [] },
  { id: "storeA", label: "STORE A", sublabel: "Commercial", x: 418, y: 248, w: 78, h: 58, type: "commercial", color: "#fbbf24", units: [] },
  { id: "storeB", label: "STORE B", sublabel: "Commercial", x: 508, y: 248, w: 78, h: 58, type: "commercial", color: "#fbbf24", units: [] },
];

function PropertyMap({ users, maint, setMaint, toast2 }) {
  const [zoom, setZoom] = useState(1);
  const [viewMode, setViewMode] = useState("2d");
  const [selUnit, setSelUnit] = useState(null);
  const [selCam, setSelCam] = useState(null);
  const [camFeed, setCamFeed] = useState(null);
  const [layers, setLayers] = useState({ wifi: true, cameras: true, units: true, alerts: true });
  const [pulse, setPulse] = useState(true);
  const [perspective, setPerspective] = useState({ x: 0, y: 0, rotY: 0, rotX: 0 });

  useEffect(() => {
    const t = setInterval(() => setPulse(p => !p), 900);
    return () => clearInterval(t);
  }, []);

  function uStatus(uid) {
    const u = users.find(x => x.id === uid - 100);
    return u ? u.status : "offline";
  }

  function uMaint(uid) {
    const u = users.find(x => x.id === uid - 100);
    if (!u) return [];
    return maint.filter(r => r.unit === u.unit && r.status !== "resolved");
  }

  function uData(uid) {
    return users.find(x => x.id === uid - 100) || null;
  }

  const activeCount = users.filter(u => u.status === "active").length;
  const paidCount = users.filter(u => u.status === "paid").length;
  const expiredCount = users.filter(u => u.status === "expired").length;
  const alertCount = maint.filter(r => r.status !== "resolved").length;
  const camOnline = CAMERAS.filter(c => c.status === "online").length;

  function handleUnitClick(unit) {
    const st = uStatus(unit.id);
    const reqs = uMaint(unit.id);
    const ud = uData(unit.id);
    setSelUnit({ ...unit, status: st, reqs, userData: ud });
    setSelCam(null);
    setCamFeed(null);
  }

  function clearAll() {
    setSelUnit(null);
    setSelCam(null);
    setCamFeed(null);
  }

  function bldSummary(bld) {
    if (!bld.units.length) return { color: bld.color, alerts: 0 };
    const statuses = bld.units.map(u => uStatus(u.id));
    const alerts = bld.units.reduce((a, u) => a + uMaint(u.id).length, 0);
    let color = "#334155";
    if (statuses.includes("active")) color = "#22c55e";
    if (statuses.includes("paid")) color = "#38bdf8";
    if (statuses.some(s => s === "expired")) color = "#f87171";
    if (alerts > 0) color = "#fb923c";
    return { color, alerts };
  }

  const renderBuilding3D = (bld, idx) => {
    if (viewMode === "2d") return null;
    
    const offsetX = perspective.x;
    const offsetY = perspective.y;
    const skewY = perspective.rotY * 0.5;
    const depth = viewMode === "3d" ? 25 : 0;
    
    const baseX = bld.x + offsetX;
    const baseY = bld.y + offsetY;
    
    if (bld.type === "church") {
      const topColor = bld.color + "88";
      const sideColor = bld.color + "44";
      
      return (
        <g key={bld.id}>
          {/* Floor 2 */}
          <polygon points={`${baseX + 10},${baseY + 20 + skewY} ${baseX + 60},${baseY + 20 - 8 + skewY} ${baseX + 110},${baseY + 20 + skewY} ${baseX + 60},${baseY + 20 + 8 + skewY}`} fill={topColor} stroke={bld.color} strokeWidth="1"/>
          <polygon points={`${baseX + 10},${baseY + 20 + skewY} ${baseX + 60},${baseY + 20 + 8 + skewY} ${baseX + 60},${baseY + 70 + 8 + skewY} ${baseX + 10},${baseY + 70 + skewY}`} fill={sideColor} stroke="none"/>
          
          {/* Floor 1 */}
          <polygon points={`${baseX + 10},${baseY + 80 + skewY} ${baseX + 60},${baseY + 80 - 8 + skewY} ${baseX + 110},${baseY + 80 + skewY} ${baseX + 60},${baseY + 80 + 8 + skewY}`} fill={topColor} stroke={bld.color} strokeWidth="1"/>
          <polygon points={`${baseX + 10},${baseY + 80 + skewY} ${baseX + 60},${baseY + 80 + 8 + skewY} ${baseX + 60},${baseY + 140 + 8 + skewY} ${baseX + 10},${baseY + 140 + skewY}`} fill={sideColor} stroke="none"/>
        </g>
      );
    }
    
    if (bld.units.length > 0) {
      return (
        <g key={bld.id}>
          <polygon points={`${baseX + 5},${baseY + 5 + skewY} ${baseX + bld.w / 2},${baseY + 5 - 5 + skewY} ${baseX + bld.w - 5},${baseY + 5 + skewY} ${baseX + bld.w / 2},${baseY + 5 + 5 + skewY}`} fill={bld.color + "88"} stroke={bld.color} strokeWidth="1"/>
          <polygon points={`${baseX + 5},${baseY + 5 + skewY} ${baseX + bld.w / 2},${baseY + 5 + 5 + skewY} ${baseX + bld.w / 2},${baseY + bld.h + 5 + skewY} ${baseX + 5},${baseY + bld.h + skewY}`} fill={bld.color + "44"} stroke="none"/>
        </g>
      );
    }
    
    return (
      <g key={bld.id}>
        <polygon points={`${baseX + 5},${baseY + 5 + skewY} ${baseX + bld.w / 2},${baseY + 5 - 3 + skewY} ${baseX + bld.w - 5},${baseY + 5 + skewY} ${baseX + bld.w / 2},${baseY + 5 + 3 + skewY}`} fill={bld.color + "88"} stroke={bld.color} strokeWidth="1"/>
        <polygon points={`${baseX + 5},${baseY + 5 + skewY} ${baseX + bld.w / 2},${baseY + 5 + 3 + skewY} ${baseX + bld.w / 2},${baseY + bld.h + 3 + skewY} ${baseX + 5},${baseY + bld.h + skewY}`} fill={bld.color + "44"} stroke="none"/>
      </g>
    );
  };

  return (
    <div>
      <div style={{ display: "grid", gridTemplateColumns: "repeat(5,1fr)", gap: 6, marginBottom: 12 }}>
        {[
          { lbl: "Active", val: activeCount, col: "#22c55e" },
          { lbl: "Paid", val: paidCount, col: "#38bdf8" },
          { lbl: "Expired", val: expiredCount, col: "#f87171" },
          { lbl: "Alerts", val: alertCount, col: "#fb923c" },
          { lbl: "Cameras", val: `${camOnline}/${CAMERAS.length}`, col: "#a78bfa" }
        ].map(s => (
          <div key={s.lbl} style={{ background: "var(--card)", border: `1px solid ${s.col}33`, borderRadius: 10, padding: "8px 4px", textAlign: "center" }}>
            <div style={{ fontSize: 17, fontWeight: 700, color: s.col, fontFamily: "'DM Mono',monospace" }}>{s.val}</div>
            <div style={{ fontSize: 9, color: "var(--muted)", marginTop: 2 }}>{s.lbl}</div>
          </div>
        ))}
      </div>

      <div style={{ display: "flex", gap: 6, marginBottom: 10, flexWrap: "wrap", alignItems: "center" }}>
        <button onClick={() => setViewMode("2d")} style={{ padding: "5px 12px", borderRadius: 6, border: "1px solid var(--border)", background: viewMode === "2d" ? "var(--accent)" : "transparent", color: viewMode === "2d" ? "#fff" : "var(--muted)", fontSize: 10, fontWeight: 700 }}>2D</button>
        <button onClick={() => setViewMode("3d")} style={{ padding: "5px 12px", borderRadius: 6, border: "1px solid var(--border)", background: viewMode === "3d" ? "var(--accent)" : "transparent", color: viewMode === "3d" ? "#fff" : "var(--muted)", fontSize: 10, fontWeight: 700 }}>3D</button>
        
        {[{ id: "units", lbl: "Units", col: "#22c55e" }, { id: "cameras", lbl: "Cameras", col: "#38bdf8" }, { id: "wifi", lbl: "WiFi", col: "#a78bfa" }, { id: "alerts", lbl: "Alerts", col: "#fb923c" }].map(l => (
          <button key={l.id} onClick={() => setLayers(x => ({ ...x, [l.id]: !x[l.id] }))} style={{
            padding: "4px 11px", borderRadius: 20, border: `1px solid ${layers[l.id] ? l.col : "var(--border)"}`,
            background: layers[l.id] ? l.col + "22" : "transparent", color: layers[l.id] ? l.col : "var(--muted)",
            fontSize: 10, fontWeight: 700, cursor: "pointer", fontFamily: "'Sora',sans-serif", transition: "all .15s"
          }}>{l.lbl}</button>
        ))}
        
        <div style={{ marginLeft: "auto", display: "flex", gap: 5, alignItems: "center" }}>
          <button onClick={() => setZoom(z => Math.max(0.6, z - 0.2))} style={{ width: 28, height: 28, borderRadius: 7, border: "1px solid var(--border)", background: "var(--surface)", color: "var(--text)", fontSize: 16, cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center" }}>−</button>
          <span style={{ fontSize: 10, color: "var(--muted)", fontFamily: "'DM Mono',monospace", minWidth: 34, textAlign: "center" }}>{Math.round(zoom * 100)}%</span>
          <button onClick={() => setZoom(z => Math.min(2.2, z + 0.2))} style={{ width: 28, height: 28, borderRadius: 7, border: "1px solid var(--border)", background: "var(--surface)", color: "var(--text)", fontSize: 16, cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center" }}>+</button>
          <button onClick={() => { setZoom(1); clearAll(); }} style={{ padding: "4px 9px", borderRadius: 7, border: "1px solid var(--border)", background: "transparent", color: "var(--muted)", fontSize: 10, cursor: "pointer", fontFamily: "'Sora',sans-serif" }}>Reset</button>
        </div>
      </div>

      <div style={{ background: "#070d14", borderRadius: 14, border: "1px solid #1a2a3a", overflow: "hidden", position: "relative" }}>
        <div style={{ position: "absolute", top: 10, left: 10, zIndex: 10, background: "#070d14cc", border: "1px solid #1a2a3a", borderRadius: 8, padding: "4px 10px", display: "flex", alignItems: "center", gap: 6 }}>
          <div style={{ width: 6, height: 6, borderRadius: "50%", background: "#22c55e", boxShadow: `0 0 ${pulse ? 6 : 2}px #22c55e`, transition: "box-shadow .4s" }} />
          <span style={{ fontSize: 9, color: "#22c55e", fontFamily: "'DM Mono',monospace", fontWeight: 700 }}>LIVE</span>
          <span style={{ fontSize: 9, color: "#374151", fontFamily: "'DM Mono',monospace" }}>BGT · {viewMode.toUpperCase()} · 76 Units</span>
        </div>

        <div style={{ overflow: "hidden", width: "100%" }}>
          <div style={{ transform: `scale(${zoom})`, transformOrigin: "top center", transition: "transform .2s" }}>
            <svg viewBox="0 0 712 540" style={{ width: "100%", display: "block" }}>
              <rect width="712" height="540" fill="#080e18" />
              
              {/* Streets */}
              <rect x="0" y="516" width="712" height="24" fill="#0e1620" />
              <text x="356" y="531" textAnchor="middle" fontSize="8" fill="#2d3f55" fontFamily="monospace" letterSpacing="2">8TH AVE E</text>
              <rect x="385" y="22" width="26" height="494" fill="#0e1620" />
              <text x="398" y="270" textAnchor="middle" fontSize="8" fill="#2d3f55" fontFamily="monospace" transform="rotate(-90,398,270)" letterSpacing="1">13TH ST E</text>
              <rect x="0" y="0" width="712" height="22" fill="#0e1620" />
              
              {/* Property boundary */}
              <rect x="28" y="26" width="652" height="484" fill="none" stroke="#1a3a2a" strokeWidth="1" strokeDasharray="8,5" />
              <rect x="29" y="27" width="650" height="482" fill="#0b1610" opacity="0.5" />
              
              {/* WiFi coverage */}
              {layers.wifi && (
                <>
                  <ellipse cx="398" cy="90" rx="270" ry="210" fill="#22c55e" opacity="0.03" />
                  <ellipse cx="398" cy="90" rx="185" ry="145" fill="#22c55e" opacity="0.04" />
                  <ellipse cx="398" cy="90" rx="95" ry="80" fill="#22c55e" opacity="0.06" />
                  {[58, 115, 185].map((r, i) => (
                    <ellipse key={i} cx="398" cy="90" rx={r} ry={r * 0.75} fill="none" stroke="#a78bfa" strokeWidth="0.6" opacity={0.12 - i * 0.03} strokeDasharray="5,8" />
                  ))}
                </>
              )}
              
              {/* 3D layer */}
              {viewMode === "3d" && BUILDINGS_DATA.map(renderBuilding3D)}
              
              {/* Church - 2 floors shown in 2D */}
              {viewMode === "2d" && (
                <g>
                  <rect x="110" y="70" width="130" height="180" rx="5" fill="#091a10" stroke="#22c55e" strokeWidth="1.5" />
                  <rect x="110" y="70" width="130" height="22" rx="5" fill="#0d2a18" />
                  <text x="175" y="85" textAnchor="middle" fontSize="10" fill="#22c55e" fontFamily="sans-serif" fontWeight="700">⛪ CHURCH</text>
                  <text x="175" y="148" textAnchor="middle" fontSize="8" fill="#1e4a2a" fontFamily="sans-serif">40 Units · 2 Floors</text>
                  
                  {/* Floor divider */}
                  <line x1="115" y1="155" x2="235" y2="155" stroke="#22c55e" strokeWidth="1" opacity="0.5" />
                  <text x="175" y="115" textAnchor="middle" fontSize="7" fill="#22c55e" opacity="0.7">FLOOR 1 (20)</text>
                  <text x="175" y="190" textAnchor="middle" fontSize="7" fill="#22c55e" opacity="0.7">FLOOR 2 (20)</text>
                </g>
              )}
              
              {/* School */}
              <rect x="232" y="112" width="112" height="75" rx="4" fill="#091520" stroke="#38bdf8" strokeWidth="1.5" />
              <rect x="232" y="112" width="112" height="18" rx="4" fill="#0d2030" />
              <text x="288" y="125" textAnchor="middle" fontSize="9" fill="#38bdf8" fontFamily="sans-serif" fontWeight="700">🎓 SCHOOL</text>
              
              {/* Parking */}
              <rect x="418" y="90" width="148" height="108" rx="4" fill="#0c1520" stroke="#1e2a3a" strokeWidth="1" />
              {[0, 1, 2, 3, 4].map(i => <line key={i} x1={440 + i * 26} y1="95" x2={440 + i * 26} y2="193" stroke="#1a2a3a" strokeWidth="0.8" />)}
              
              {/* Store A */}
              <rect x="418" y="248" width="78" height="58" rx="4" fill="#1a1500" stroke="#fbbf24" strokeWidth="1.5" />
              <text x="457" y="262" textAnchor="middle" fontSize="9" fill="#fbbf24" fontFamily="sans-serif" fontWeight="700">STORE A</text>
              
              {/* Store B */}
              <rect x="508" y="248" width="78" height="58" rx="4" fill="#1a1500" stroke="#fbbf24" strokeWidth="1.5" />
              <text x="547" y="262" textAnchor="middle" fontSize="9" fill="#fbbf24" fontFamily="sans-serif" fontWeight="700">STORE B</text>
              
              {/* Router */}
              <circle cx="398" cy="90" r="14" fill="#100d1e" stroke="#a78bfa" strokeWidth={pulse ? 2 : 1.5} />
              <text x="398" y="95" textAnchor="middle" fontSize="12">📡</text>
              <text x="398" y="113" textAnchor="middle" fontSize="7" fill="#6d48d8" fontFamily="monospace">ROUTER</text>
              
              {/* Block A */}
              {viewMode === "2d" && (() => {
                const bld = BUILDINGS_DATA.find(b => b.id === "blockA");
                const { color, alerts } = bldSummary(bld);
                return (
                  <g>
                    <rect x={bld.x} y={bld.y} width={bld.w} height={bld.h} rx="5" fill="#0a1a10" stroke={color} strokeWidth="1" />
                    <rect x={bld.x} y={bld.y} width={bld.w} height={16} rx="5" fill={color + "22"} />
                    <text x={bld.x + bld.w / 2} y={bld.y + 11} textAnchor="middle" fontSize="8" fill={color} fontFamily="sans-serif" fontWeight="700">{bld.label}</text>
                    {alerts > 0 && layers.alerts && (
                      <circle cx={bld.x + bld.w - 6} cy={bld.y + 6} r={7} fill="#fb923c" opacity={pulse ? 1 : 0.7} />
                    )}
                  </g>
                );
              })()}
              
              {/* Block B */}
              {viewMode === "2d" && (() => {
                const bld = BUILDINGS_DATA.find(b => b.id === "blockB");
                const { color, alerts } = bldSummary(bld);
                return (
                  <g>
                    <rect x={bld.x} y={bld.y} width={bld.w} height={bld.h} rx="5" fill="#0a1a10" stroke={color} strokeWidth="1" />
                    <rect x={bld.x} y={bld.y} width={bld.w} height={16} rx="5" fill={color + "22"} />
                    <text x={bld.x + bld.w / 2} y={bld.y + 11} textAnchor="middle" fontSize="8" fill={color} fontFamily="sans-serif" fontWeight="700">{bld.label}</text>
                    {alerts > 0 && layers.alerts && (
                      <circle cx={bld.x + bld.w - 6} cy={bld.y + 6} r={7} fill="#fb923c" opacity={pulse ? 1 : 0.7} />
                    )}
                  </g>
                );
              })()}
              
              {/* Trailer Park */}
              {viewMode === "2d" && (() => {
                const bld = BUILDINGS_DATA.find(b => b.id === "trailer");
                const { color, alerts } = bldSummary(bld);
                return (
                  <g>
                    <rect x={bld.x} y={bld.y} width={bld.w} height={bld.h} rx="5" fill="#0a1a10" stroke={color} strokeWidth="1" />
                    <rect x={bld.x} y={bld.y} width={bld.w} height={16} rx="5" fill={color + "22"} />
                    <text x={bld.x + bld.w / 2} y={bld.y + 11} textAnchor="middle" fontSize="8" fill={color} fontFamily="sans-serif" fontWeight="700">{bld.label}</text>
                    {alerts > 0 && layers.alerts && (
                      <circle cx={bld.x + bld.w - 6} cy={bld.y + 6} r={7} fill="#fb923c" opacity={pulse ? 1 : 0.7} />
                    )}
                  </g>
                );
              })()}
              
              {/* Unit dots - 2D only */}
              {viewMode === "2d" && layers.units && ALL_UNITS.map(unit => {
                if (!unit.rx || !unit.ry) return null;
                const st = uStatus(unit.id);
                const col = STATUS_COLOR[st];
                const reqs = uMaint(unit.id);
                const has = reqs.length > 0;
                const sel = selUnit?.id === unit.id;
                return (
                  <g key={unit.id} style={{ cursor: "pointer" }} onClick={(e) => { e.stopPropagation(); handleUnitClick(unit); }}>
                    {has && layers.alerts && <circle cx={unit.rx} cy={unit.ry} r={12} fill="none" stroke="#fb923c" strokeWidth={pulse ? 2 : 1} opacity={pulse ? 0.9 : 0.4} />}
                    <circle cx={unit.rx} cy={unit.ry} r={6} fill={col} opacity={sel ? 1 : 0.82} />
                    {sel && <circle cx={unit.rx} cy={unit.ry} r={10} fill="none" stroke={col} strokeWidth={2} />}
                  </g>
                );
              })}
              
              {/* Cameras */}
              {layers.cameras && CAMERAS.map((cam) => {
                const sel = selCam?.id === cam.id;
                const online = cam.status === "online";
                return (
                  <g key={cam.id} style={{ cursor: "pointer" }} onClick={() => { setSelCam(sel ? null : cam); setSelUnit(null); setCamFeed(null); }}>
                    {online && <path d={`M${cam.x},${cam.y} L${cam.x - 16},${cam.y + 20} L${cam.x + 16},${cam.y + 20} Z`} fill={sel ? "#38bdf820" : "#38bdf80d"} stroke="none" />}
                    <rect x={cam.x - 10} y={cam.y - 8} width={20} height={14} rx={3} fill={sel ? "#1a3a5f" : "#0d1e30"} stroke={online ? "#38bdf8" : "#f87171"} strokeWidth={sel ? 2 : 1} />
                    <circle cx={cam.x + 5} cy={cam.y} r={3} fill={online ? "#38bdf8" : "#f87171"} opacity={online && pulse ? 1 : 0.5} />
                    <rect x={cam.x - 8} y={cam.y - 5} width={9} height={8} rx={1} fill={online ? "#0c2a3a" : "#2a0a0a"} />
                    <text x={cam.x} y={cam.y + 18} textAnchor="middle" fontSize="7" fill={sel ? "#38bdf8" : "#3d5a7a"} fontFamily="monospace">{cam.label.split(" ")[0]}</text>
                  </g>
                );
              })}
              
              {/* Compass */}
              <g transform="translate(685,48)">
                <circle cx="0" cy="0" r="12" fill="#0d1620" stroke="#1e2a3a" strokeWidth="1" />
                <polygon points="0,-9 -3,2 3,2" fill="#f87171" />
                <polygon points="0,9 -3,-2 3,-2" fill="#374151" />
                <text x="0" y="-12" textAnchor="middle" fontSize="7" fill="#f87171" fontFamily="monospace">N</text>
              </g>
              <text x="32" y="510" fontSize="7" fill="#1e2a3a" fontFamily="monospace">27.4894°N  82.5748°W  ·  Bradenton, FL</text>
            </svg>
          </div>
        </div>

        {/* Legend */}
        <div style={{ background: "#0a1018", borderTop: "1px solid #1a2a3a", padding: "7px 14px", display: "flex", gap: 12, flexWrap: "wrap" }}>
          {[
            { col: "#22c55e", lbl: "Active" },
            { col: "#38bdf8", lbl: "Paid" },
            { col: "#f87171", lbl: "Expired" },
            { col: "#334155", lbl: "No Device" },
            { col: "#fb923c", lbl: "Alert" },
            { col: "#38bdf8", lbl: "Cam Online" },
            { col: "#f87171", lbl: "Cam Offline" }
          ].map(l => (
            <div key={l.lbl} style={{ display: "flex", alignItems: "center", gap: 4 }}>
              <div style={{ width: 6, height: 6, borderRadius: "50%", background: l.col }} />
              <span style={{ fontSize: 9, color: "#4a5a6a", fontFamily: "monospace" }}>{l.lbl}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Unit detail */}
      {selUnit && (
        <div style={{ background: "var(--card)", border: `1px solid ${STATUS_COLOR[selUnit.status]}55`, borderRadius: 14, padding: 14, marginTop: 12, animation: "fadeUp .25s ease" }}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 12 }}>
            <div>
              <div style={{ fontSize: 15, fontWeight: 700 }}>{selUnit.userData?.unit || selUnit.label}</div>
              <div style={{ fontSize: 11, color: "var(--muted)" }}>{selUnit.userData?.name || "Unoccupied"} · {selUnit.building}</div>
              {selUnit.floor && <div style={{ fontSize: 10, color: "#38bdf8" }}>Floor {selUnit.floor}</div>}
            </div>
            <div style={{ display: "flex", gap: 8, alignItems: "center" }}>
              <span style={{ fontSize: 10, fontWeight: 700, padding: "3px 9px", borderRadius: 20, background: STATUS_COLOR[selUnit.status] + "22", color: STATUS_COLOR[selUnit.status], border: `1px solid ${STATUS_COLOR[selUnit.status]}44` }}>{STATUS_LABEL[selUnit.status]}</span>
              <button onClick={() => setSelUnit(null)} style={{ background: "none", border: "none", color: "var(--muted)", cursor: "pointer", fontSize: 18 }}>✕</button>
            </div>
          </div>
          {selUnit.userData && (
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 8, marginBottom: 12 }}>
              {[{ l: "IP", v: selUnit.userData.ip }, { l: "Data", v: selUnit.userData.dataUsed }, { l: "Last Seen", v: selUnit.userData.lastSeen }, { l: "Free Used", v: `${selUnit.userData.minutesUsed}/60 min` }].map(f => (
                <div key={f.l}><div style={{ fontSize: 9, color: "var(--muted)", textTransform: "uppercase", letterSpacing: ".05em", marginBottom: 2 }}>{f.l}</div><div style={{ fontSize: 11, fontWeight: 600, fontFamily: "'DM Mono',monospace" }}>{f.v}</div></div>
              ))}
            </div>
          )}
          {selUnit.reqs.length > 0 && (
            <>
              <div style={{ fontSize: 10, color: "#fb923c", textTransform: "uppercase", letterSpacing: ".05em", marginBottom: 8 }}>🔧 Open Requests ({selUnit.reqs.length})</div>
              {selUnit.reqs.map((r, i) => (
                <div key={i} style={{ background: "var(--surface)", border: "1px solid #fb923c33", borderRadius: 9, padding: "9px 11px", marginBottom: 7 }}>
                  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 4 }}>
                    <span style={{ fontSize: 12, fontWeight: 700, textTransform: "capitalize" }}>{r.category}</span>
                    <span style={{ fontSize: 9, padding: "2px 8px", borderRadius: 20, fontWeight: 700, background: r.status === "new" ? "#1a0b0b" : "#1a1000", color: r.status === "new" ? "#f87171" : "#fb923c", border: `1px solid ${r.status === "new" ? "#3a1e1e" : "#4a3000"}` }}>{r.status.replace("_", " ")}</span>
                  </div>
                  <div style={{ fontSize: 11, color: "var(--muted)", lineHeight: 1.5, marginBottom: 7 }}>{r.message}</div>
                  <div style={{ display: "flex", gap: 6 }}>
                    {r.status === "new" && <button style={{ background: "var(--sbg)", color: "var(--accent)", border: "1px solid var(--sbd)", padding: "5px 10px", borderRadius: 6, fontSize: 10, cursor: "pointer" }} onClick={() => { setMaint(rs => rs.map(x => x.message === r.message ? { ...x, status: "in_progress" } : x)); toast2("Marked in progress"); }}>In Progress</button>}
                    {r.status !== "resolved" && <button style={{ background: "var(--sbg)", color: "var(--accent)", border: "1px solid var(--sbd)", padding: "5px 10px", borderRadius: 6, fontSize: 10, cursor: "pointer" }} onClick={() => { setMaint(rs => rs.map(x => x.message === r.message ? { ...x, status: "resolved" } : x)); setSelUnit(s => ({ ...s, reqs: s.reqs.filter((_, j) => j !== i) })); toast2("✓ Resolved"); }}>Resolve</button>}
                  </div>
                </div>
              ))}
            </>
          )}
          {selUnit.reqs.length === 0 && <div style={{ fontSize: 11, color: "var(--muted)", textAlign: "center", padding: "6px 0" }}>✓ No open maintenance requests</div>}
        </div>
      )}

      {/* Camera detail */}
      {selCam && !camFeed && (
        <div style={{ background: "var(--card)", border: `1px solid ${selCam.status === "online" ? "#38bdf833" : "#f8717133"}`, borderRadius: 14, padding: 14, marginTop: 12, animation: "fadeUp .25s ease" }}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 12 }}>
            <div>
              <div style={{ fontSize: 15, fontWeight: 700 }}>📷 {selCam.label}</div>
              <div style={{ fontSize: 11, color: "var(--muted)", fontFamily: "'DM Mono',monospace" }}>{selCam.id.toUpperCase()} · Zone: {selCam.zone}</div>
            </div>
            <div style={{ display: "flex", gap: 8, alignItems: "center" }}>
              <div style={{ display: "flex", alignItems: "center", gap: 5, padding: "3px 9px", borderRadius: 20, background: selCam.status === "online" ? "#0a1520" : "#1a0b0b", border: `1px solid ${selCam.status === "online" ? "#1a3050" : "#3a1e1e"}` }}>
                <div style={{ width: 6, height: 6, borderRadius: "50%", background: selCam.status === "online" ? "#38bdf8" : "#f87171", boxShadow: selCam.status === "online" && pulse ? "0 0 5px #38bdf8" : "none" }} />
                <span style={{ fontSize: 10, fontWeight: 700, color: selCam.status === "online" ? "#38bdf8" : "#f87171" }}>{selCam.status.toUpperCase()}</span>
              </div>
              <button onClick={() => setSelCam(null)} style={{ background: "none", border: "none", color: "var(--muted)", cursor: "pointer", fontSize: 18 }}>✕</button>
            </div>
          </div>
          <button style={{ width: "100%", padding: "12px", borderRadius: 10, border: "none", background: selCam.status === "online" ? "var(--accent)" : "#333", color: "#fff", fontSize: 13, fontWeight: 700, cursor: selCam.status === "online" ? "pointer" : "not-allowed" }} onClick={() => selCam.status === "online" && setCamFeed(selCam)} disabled={selCam.status !== "online"}>
            {selCam.status === "online" ? "▶ View Live Feed" : "⚠ Camera Offline"}
          </button>
        </div>
      )}
    </div>
  );
}

export default PropertyMap;