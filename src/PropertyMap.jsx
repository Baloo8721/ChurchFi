import { useState, useEffect } from "react";

const STORAGE_KEY = "bgt_property_data";

const DEFAULT_DATA = {
  buildings: [
    { id: "church", label: "CHURCH", sublabel: "Sanctuary", x: 125, y: 120, w: 120, h: 100, color: "#22c55e", type: "church", floors: 1 },
    { id: "school", label: "SCHOOL", sublabel: "Academy", x: 125, y: 380, w: 80, h: 65, color: "#38bdf8", type: "school", floors: 1 },
    { id: "home1", label: "HOME", sublabel: "Unit 1", x: 55, y: 290, w: 30, h: 25, color: "#22c55e", type: "residential", floors: 1 },
  ],
  units: [
    { id: 1, label: "U1", building: "home1", rx: 70, ry: 302, floor: 1 },
  ],
  cameras: [
    { id: "cam1", label: "Front", x: 185, y: 120, status: "online", zone: "West" },
    { id: "cam2", label: "Parking", x: 580, y: 200, status: "online", zone: "East" },
  ],
  wifiZones: [
    { id: "wifi1", x: 250, y: 250, radius: 100 },
  ]
};

const loadData = () => {
  try {
    const saved = localStorage.getItem(STORAGE_KEY);
    if (saved) return JSON.parse(saved);
  } catch (e) { console.error("Load error:", e); }
  return DEFAULT_DATA;
};

const saveData = (data) => {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
  } catch (e) { console.error("Save error:", e); }
};

const STATUS_COLOR = { active: "#22c55e", paid: "#38bdf8", expired: "#f87171", offline: "#475569" };
const STATUS_LABEL = { active: "Active", paid: "Paid", expired: "Expired", offline: "No Device" };

function PropertyMap({ users, maint, setMaint, toast2 }) {
  const [propertyData, setPropertyData] = useState(loadData);
  const [editMode, setEditMode] = useState(false);
  const [zoom, setZoom] = useState(1);
  const [expand, setExpand] = useState(false);
  const [selUnit, setSelUnit] = useState(null);
  const [selCam, setSelCam] = useState(null);
  const [layers, setLayers] = useState({ wifi: true, cameras: true, units: true, alerts: true });
  const [pulse, setPulse] = useState(true);
  const [hover, setHover] = useState(null);
  const [selectedForEdit, setSelectedForEdit] = useState(null);
  const [newItemType, setNewItemType] = useState(null);
  const [dragging, setDragging] = useState(null);
  const [drawing, setDrawing] = useState(null);
  const [dragStart, setDragStart] = useState(null);
  const [resizing, setResizing] = useState(null);
  const [resizeStart, setResizeStart] = useState(null);
  const [buildingForm, setBuildingForm] = useState({ label: "NEW", sublabel: "", color: "#22c55e", type: "residential" });
  const [pendingBuilding, setPendingBuilding] = useState(null);

  useEffect(() => { saveData(propertyData); }, [propertyData]);
  useEffect(() => { const t = setInterval(() => setPulse(p => !p), 900); return () => clearInterval(t); }, []);

  const { buildings, units, cameras, wifiZones } = propertyData;

  function uStatus(uid) {
    const u = users.find(x => x.id === uid);
    return u ? u.status : "offline";
  }

  function uMaint(uid) {
    const u = users.find(x => x.id === uid);
    if (!u) return [];
    return maint.filter(r => r.unit === u.unit && r.status !== "resolved");
  }

  function uData(uid) { return users.find(x => x.id === uid) || null; }

  const activeCount = users.filter(u => u.status === "active").length;
  const paidCount = users.filter(u => u.status === "paid").length;
  const expiredCount = users.filter(u => u.status === "expired").length;
  const alertCount = maint.filter(r => r.status !== "resolved").length;
  const camOnline = cameras.filter(c => c.status === "online").length;

  function addBuilding(b) {
    setPropertyData(p => ({ ...p, buildings: [...p.buildings, { ...b, id: "bld_" + Date.now() }] }));
    setNewItemType(null);
  }

  function addUnit(u) {
    setPropertyData(p => ({ ...p, units: [...p.units, { ...u, id: p.units.length + 1 }] }));
    setNewItemType(null);
  }

  function addCamera(c) {
    setPropertyData(p => ({ ...p, cameras: [...p.cameras, { ...c, id: "cam_" + Date.now() }] }));
    setNewItemType(null);
  }

  function addWifiZone(w) {
    setPropertyData(p => ({ ...p, wifiZones: [...p.wifiZones, { ...w, id: "wifi_" + Date.now() }] }));
    setNewItemType(null);
  }

  function deleteItem(type, id) {
    setPropertyData(p => ({ ...p, [type]: p[type].filter(x => x.id !== id) }));
    setSelectedForEdit(null);
  }

  function handleBuildingClick(bld) {
    const bUnits = units.filter(u => u.building === bld.id);
    if (bUnits.length > 0) {
      const firstUnit = bUnits[0];
      const st = uStatus(firstUnit.id);
      const reqs = uMaint(firstUnit.id);
      const ud = uData(firstUnit.id);
      setSelUnit({ ...firstUnit, label: bld.label, buildingName: bld.sublabel, status: st, reqs, userData: ud, isBuilding: true, allBuildingUnits: bUnits });
    }
  }

  function handleUnitClick(unit) {
    const bld = buildings.find(b => b.id === unit.building);
    const st = uStatus(unit.id);
    const reqs = uMaint(unit.id);
    const ud = uData(unit.id);
    setSelUnit({ ...unit, label: bld?.label || unit.label, buildingName: bld?.sublabel, status: st, reqs, userData: ud });
    setSelCam(null);
  }

  function clearAll() { setSelUnit(null); setSelCam(null); setSelectedForEdit(null); setDragging(null); setDrawing(null); }
  function resetData() { if (confirm("Reset to default? All custom buildings will be lost.")) { setPropertyData(DEFAULT_DATA); } }

  function getSvgCoords(e, svg) {
    const rect = svg.getBoundingClientRect();
    const viewBox = svg.viewBox.baseVal;
    const scaleX = viewBox.width / rect.width;
    const scaleY = viewBox.height / rect.height;
    return {
      x: (e.clientX - rect.left) * scaleX,
      y: (e.clientY - rect.top) * scaleY
    };
  }

  function handleSvgMouseDown(e) {
    if (!editMode) return;
    const coords = getSvgCoords(e, e.currentTarget);
    
    if (newItemType === "building") {
      setDrawing({ x: coords.x, y: coords.y, w: 0, h: 0 });
      setDragStart(coords);
    } else if (newItemType === "unit") {
      const defaultBld = buildings[0];
      if (defaultBld) {
        addUnit({ label: `U${units.length + 1}`, building: defaultBld.id, rx: coords.x, ry: coords.y, floor: 1 });
        toast2("Unit added at click position");
      }
    } else if (newItemType === "camera") {
      addCamera({ label: `Cam ${cameras.length + 1}`, x: coords.x, y: coords.y, status: "online", zone: "Property" });
      toast2("Camera added at click position");
    } else if (newItemType === "wifi") {
      addWifiZone({ x: coords.x, y: coords.y, radius: 80 });
      toast2("WiFi zone added at click position");
    }
  }

  function handleSvgMouseMove(e) {
    if (!editMode) return;
    const isTouch = e.touches && e.touches.length > 0;
    const coords = isTouch ? getSvgCoords({ clientX: e.touches[0].clientX, clientY: e.touches[0].clientY }, e.currentTarget) : getSvgCoords(e, e.currentTarget);
    
    if (dragging && dragStart) {
      const dx = coords.x - dragStart.x;
      const dy = coords.y - dragStart.y;
      if (dragging.type === "unit") {
        setPropertyData(p => ({
          ...p,
          units: p.units.map(u => u.id === dragging.id ? { ...u, rx: u.rx + dx, ry: u.ry + dy } : u)
        }));
      } else if (dragging.type === "camera") {
        setPropertyData(p => ({
          ...p,
          cameras: p.cameras.map(c => c.id === dragging.id ? { ...c, x: c.x + dx, y: c.y + dy } : c)
        }));
      } else {
        setPropertyData(p => ({
          ...p,
          buildings: p.buildings.map(b => b.id === dragging.id ? { ...b, x: b.x + dx, y: b.y + dy } : b)
        }));
      }
      setDragStart(coords);
    }
    
    if (resizing && dragStart && resizeStart) {
      const orig = resizeStart;
      const startX = dragStart.x;
      const startY = dragStart.y;
      const curX = coords.x;
      const curY = coords.y;
      const dx = curX - startX;
      const dy = curY - startY;
      
      if (resizing.corner === "se") {
        const newW = Math.max(30, orig.w + dx);
        const newH = Math.max(20, orig.h + dy);
        setPropertyData(p => ({
          ...p,
          buildings: p.buildings.map(bld => bld.id === resizing.id ? { ...bld, w: newW, h: newH } : bld)
        }));
      } else if (resizing.corner === "sw") {
        const newX = orig.x + dx;
        const newW = Math.max(30, orig.w - dx);
        const newH = Math.max(20, orig.h + dy);
        setPropertyData(p => ({
          ...p,
          buildings: p.buildings.map(bld => bld.id === resizing.id ? { ...bld, x: newX, w: newW, h: newH } : bld)
        }));
      }
    }
    
    if (drawing && dragStart) {
      setDrawing({
        x: Math.min(dragStart.x, coords.x),
        y: Math.min(dragStart.y, coords.y),
        w: Math.abs(coords.x - dragStart.x),
        h: Math.abs(coords.y - dragStart.y)
      });
    }
  }

  function handleSvgMouseUp() {
    if (dragging) { setDragging(null); setDragStart(null); }
    if (resizing) { setResizing(null); setResizeStart(null); setDragStart(null); }
    if (drawing && drawing.w > 15 && drawing.h > 15) {
      setPendingBuilding({ ...buildingForm, x: drawing.x, y: drawing.y, w: drawing.w, h: drawing.h });
    }
    setDrawing(null);
    setDragStart(null);
  }

  function confirmBuilding() {
    if (pendingBuilding) {
      addBuilding(pendingBuilding);
      setPendingBuilding(null);
    } else {
      addBuilding({
        ...buildingForm,
        x: 100,
        y: 100,
        w: 80,
        h: 60,
        floors: 1
      });
      setBuildingForm({ label: "NEW", sublabel: "", color: "#22c55e", type: "residential" });
    }
  }

  function cancelBuilding() {
    setPendingBuilding(null);
    setNewItemType(null);
  }

  function startDrag(bld, e) {
    e.stopPropagation();
    e.preventDefault();
    if (editMode) {
      const svg = e.target.ownerSVGElement || e.target.closest("svg");
      const coords = getSvgCoords(e, svg);
      setDragging(bld);
      setDragStart(coords);
    }
  }

  if (expand) {
    return (
      <div style={{ position: "fixed", inset: 0, zIndex: 9999, background: "#f0f2f5", overflow: "auto", padding: 50, paddingTop: 60 }}>
        <div style={{ position: "fixed", top: 10, left: 10, zIndex: 10000, display: "flex", gap: 6, background: "#fff", padding: 8, borderRadius: 8, boxShadow: "0 2px 8px rgba(0,0,0,0.15)" }}>
          <button onClick={() => setEditMode(!editMode)} style={{ padding: "6px 12px", borderRadius: 6, border: "1px solid var(--accent)", background: editMode ? "var(--accent)" : "transparent", color: editMode ? "#fff" : "var(--accent)", fontSize: 11, fontWeight: 700 }}>{editMode ? "✓ EDIT" : "✏ EDIT"}</button>
          <button onClick={() => setExpand(false)} style={{ padding: "6px 12px", borderRadius: 6, border: "1px solid var(--border)", background: "#fff", color: "var(--text)", fontSize: 11, fontWeight: 700 }}>✕ Close</button>
        </div>
        {editMode && (
          <div style={{ position: "fixed", bottom: 10, left: 10, zIndex: 10000, display: "flex", gap: 4, background: "#fff", padding: 8, borderRadius: 8, boxShadow: "0 2px 8px rgba(0,0,0,0.15)" }}>
            <button onClick={() => setNewItemType(newItemType === "building" ? null : "building")} style={{ padding: "6px 10px", borderRadius: 4, border: `1px solid ${newItemType === "building" ? "#22c55e" : "#ddd"}`, background: newItemType === "building" ? "#22c55e" : "#fff", color: newItemType === "building" ? "#fff" : "#22c55e", fontSize: 10, fontWeight: 700 }}>🏢 Bld</button>
            <button onClick={() => setNewItemType(newItemType === "unit" ? null : "unit")} style={{ padding: "6px 10px", borderRadius: 4, border: `1px solid ${newItemType === "unit" ? "#38bdf8" : "#ddd"}`, background: newItemType === "unit" ? "#38bdf8" : "#fff", color: newItemType === "unit" ? "#fff" : "#38bdf8", fontSize: 10, fontWeight: 700 }}>⬤ Unit</button>
            <button onClick={() => setNewItemType(newItemType === "camera" ? null : "camera")} style={{ padding: "6px 10px", borderRadius: 4, border: `1px solid ${newItemType === "camera" ? "#a78bfa" : "#ddd"}`, background: newItemType === "camera" ? "#a78bfa" : "#fff", color: newItemType === "camera" ? "#fff" : "#a78bfa", fontSize: 10, fontWeight: 700 }}>📷 Cam</button>
            <button onClick={() => setNewItemType(newItemType === "wifi" ? null : "wifi")} style={{ padding: "6px 10px", borderRadius: 4, border: `1px solid ${newItemType === "wifi" ? "#fb923c" : "#ddd"}`, background: newItemType === "wifi" ? "#fb923c" : "#fff", color: newItemType === "wifi" ? "#fff" : "#fb923c", fontSize: 10, fontWeight: 700 }}>📶 WiFi</button>
          </div>
        )}
        {editMode && newItemType === "building" && (
          <div style={{ position: "fixed", top: 60, right: 10, zIndex: 10000, background: "#fff", padding: 12, borderRadius: 8, boxShadow: "0 2px 8px rgba(0,0,0,0.15)", maxWidth: 250 }}>
            <div style={{ fontSize: 10, color: "#666", marginBottom: 8 }}>Click and drag on map to draw</div>
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 6, marginBottom: 8 }}>
              <input value={buildingForm.label} onChange={e => setBuildingForm(f => ({ ...f, label: e.target.value }))} placeholder="Label" style={{ padding: "6px", borderRadius: 4, border: "1px solid #ddd", fontSize: 10 }} />
              <input value={buildingForm.sublabel} onChange={e => setBuildingForm(f => ({ ...f, sublabel: e.target.value }))} placeholder="Sublabel" style={{ padding: "6px", borderRadius: 4, border: "1px solid #ddd", fontSize: 10 }} />
              <select value={buildingForm.color} onChange={e => setBuildingForm(f => ({ ...f, color: e.target.value }))} style={{ padding: "6px", borderRadius: 4, border: "1px solid #ddd", fontSize: 10 }}>
                <option value="#22c55e">Green</option>
                <option value="#38bdf8">Blue</option>
                <option value="#fb923c">Orange</option>
                <option value="#a78bfa">Purple</option>
              </select>
              <button onClick={() => { addBuilding({ ...buildingForm, x: 100, y: 100, w: 80, h: 60 }); toast2("Building added"); }} style={{ padding: "6px", borderRadius: 4, border: "none", background: "#22c55e", color: "#fff", fontSize: 10, fontWeight: 700 }}>+ Add Building</button>
            </div>
          </div>
        )}
        {editMode && newItemType === "unit" && (
          <div style={{ position: "fixed", top: 60, right: 10, zIndex: 10000, background: "#fff", padding: 12, borderRadius: 8, boxShadow: "0 2px 8px rgba(0,0,0,0.15)", maxWidth: 200 }}>
            <div style={{ fontSize: 10, marginBottom: 6 }}>Click on map to add unit</div>
            <button onClick={() => { const b = buildings[0]; if(b) { addUnit({ label: `U${units.length+1}`, building: b.id, rx: 100, ry: 100, floor: 1 }); toast2("Unit added at 100,100"); }}} style={{ padding: "6px 12px", borderRadius: 4, border: "none", background: "#38bdf8", color: "#fff", fontSize: 10 }}>+ Add Unit at 100,100</button>
          </div>
        )}
        {editMode && newItemType === "camera" && (
          <div style={{ position: "fixed", top: 60, right: 10, zIndex: 10000, background: "#fff", padding: 12, borderRadius: 8, boxShadow: "0 2px 8px rgba(0,0,0,0.15)", maxWidth: 200 }}>
            <div style={{ fontSize: 10, marginBottom: 6 }}>Click on map to add camera</div>
            <button onClick={() => { addCamera({ label: `Cam${cameras.length+1}`, x: 300, y: 200, status: "online", zone: "Property" }); toast2("Camera added at 300,200"); }} style={{ padding: "6px 12px", borderRadius: 4, border: "none", background: "#a78bfa", color: "#fff", fontSize: 10 }}>+ Add Camera at 300,200</button>
          </div>
        )}
        {editMode && newItemType === "wifi" && (
          <div style={{ position: "fixed", top: 60, right: 10, zIndex: 10000, background: "#fff", padding: 12, borderRadius: 8, boxShadow: "0 2px 8px rgba(0,0,0,0.15)", maxWidth: 200 }}>
            <div style={{ fontSize: 10, marginBottom: 6 }}>Click on map to add WiFi</div>
            <button onClick={() => { addWifiZone({ x: 250, y: 250, radius: 80 }); toast2("WiFi zone added at 250,250"); }} style={{ padding: "6px 12px", borderRadius: 4, border: "none", background: "#fb923c", color: "#fff", fontSize: 10 }}>+ Add WiFi at 250,250</button>
          </div>
)}
        {editMode && selectedForEdit && (
          <div style={{ position: "fixed", bottom: 10, right: 10, zIndex: 10000, background: "#fff", padding: 12, borderRadius: 8, boxShadow: "0 2px 8px rgba(0,0,0,0.15)", maxWidth: 200 }}>
            <div style={{ fontSize: 11, fontWeight: 700, marginBottom: 8 }}>Edit: {selectedForEdit.label}</div>
            <button onClick={() => setSelectedForEdit(null)} style={{ padding: "4px 8px", borderRadius: 4, border: "1px solid #dc2626", background: "#fef2f2", color: "#dc2626", fontSize: 10 }}>🗑 Delete</button>
          </div>
        )}
        <div style={{ background: "#fff", borderRadius: 0, overflow: "hidden" }}>
          <div style={{ position: "absolute", top: 60, left: 10, zIndex: 10, background: "#fff", border: "1px solid #ddd", borderRadius: 8, padding: "5px 12px", display: "flex", alignItems: "center", gap: 8 }}>
            <div style={{ width: 6, height: 6, borderRadius: "50%", background: "#22c55e", boxShadow: `0 0 ${pulse ? 6 : 2}px #22c55e` }} />
            <span style={{ fontSize: 9, color: "#22c55e", fontFamily: "'DM Mono',monospace", fontWeight: 700 }}>LIVE</span>
            <span style={{ fontSize: 9, color: "#3a4a5a", fontFamily: "'DM Mono',monospace" }}>BGT · {units.length}</span>
          </div>
          <svg viewBox="0 0 700 580" style={{ width: "100%", display: "block", cursor: editMode ? (newItemType === "building" ? "crosshair" : "default") : "default" }}
              onMouseDown={handleSvgMouseDown} onMouseMove={handleSvgMouseMove} onMouseUp={handleSvgMouseUp}
              onTouchStart={handleSvgMouseDown} onTouchMove={handleSvgMouseMove} onTouchEnd={handleSvgMouseUp}>
            <rect width="700" height="580" fill="#f0f2f5" />
            <g dangerouslySetInnerHTML={{__html: `
              <rect x="0" y="30" width="700" height="22" fill="#d1d5db" />
              <text x="50" y="44" textAnchor="middle" fontSize="7" fill="#6b7280" fontFamily="monospace">7TH AVE E</text>
              <rect x="0" y="530" width="700" height="22" fill="#d1d5db" />
              <text x="50" y="544" textAnchor="middle" fontSize="7" fill="#6b7280" fontFamily="monospace">8TH AVE E</text>
              <rect x="395" y="52" width="28" height="478" fill="#d1d5db" />
              <text x="409" y="290" textAnchor="middle" fontSize="7" fill="#6b7280" fontFamily="monospace" transform="rotate(-90,409,290)">13TH ST E</text>
              <rect x="660" y="52" width="25" height="478" fill="#d1d5db" />
              <text x="672" y="290" textAnchor="middle" fontSize="7" fill="#6b7280" fontFamily="monospace" transform="rotate(-90,672,290)">14TH ST</text>
              <text x="180" y="60" textAnchor="middle" fontSize="9" fill="#059669" fontFamily="monospace" fontWeight="700" opacity="0.7">WEST ZONE</text>
              <text x="550" y="60" textAnchor="middle" fontSize="9" fill="#0284c7" fontFamily="monospace" fontWeight="700" opacity="0.7">EAST ZONE</text>
              <rect x="50" y="52" width="345" height="478" fill="none" stroke="#059669" strokeWidth="1" strokeDasharray="6,4" opacity="0.4" />
              <rect x="425" y="52" width="235" height="478" fill="none" stroke="#0284c7" strokeWidth="1" strokeDasharray="6,4" opacity="0.4" />
            `}} />
            {layers.wifi && wifiZones.map(wz => (
              <g key={wz.id}>
                <ellipse cx={wz.x} cy={wz.y} rx={wz.radius} ry={wz.radius * 0.8} fill="#22c55e" opacity="0.1" />
                <ellipse cx={wz.x} cy={wz.y} rx={wz.radius * 0.6} ry={wz.radius * 0.5} fill="#22c55e" opacity="0.15" />
              </g>
            ))}
            {layers.wifi && <g><circle cx="250" cy="280" r="10" fill="#fff" stroke="#a78bfa" strokeWidth={pulse ? 2 : 1} /><text x="250" y="284" textAnchor="middle" fontSize="10">📡</text></g>}
            {buildings.map(bld => {
              const isSel = selectedForEdit?.id === bld.id;
              return (
                <g key={bld.id} style={{ cursor: editMode ? "move" : "pointer" }} onClick={(e) => { if (editMode) { e.stopPropagation(); setSelectedForEdit({ ...bld, type: "buildings" }); } else { handleBuildingClick(bld); } }} onMouseDown={(e) => startDrag(bld, e)}>
                  <rect x={bld.x} y={bld.y} width={bld.w} height={bld.h} rx={4} fill="#ffffff" stroke={isSel ? "#000" : bld.color} strokeWidth={isSel ? 3 : 2} />
                  <rect x={bld.x} y={bld.y} width={bld.w} height={12} rx={4} fill={bld.color + "22"} />
                  <text x={bld.x + bld.w / 2} y={bld.y + 9} textAnchor="middle" fontSize={bld.w > 50 ? 8 : 6} fill={bld.color} fontWeight="700">{bld.type === "church" ? "⛪ " : ""}{bld.label}</text>
                  {editMode && (
                    <>
                      <g onMouseDown={(e) => { e.stopPropagation(); e.preventDefault(); const svg = e.target.ownerSVGElement || e.target.closest("svg"); const coords = getSvgCoords(e, svg); setResizing({ ...bld, corner: "se" }); setResizeStart({ ...bld }); setDragStart(coords); }} onTouchStart={(e) => { e.stopPropagation(); const t = e.touches[0]; const svg = e.target.ownerSVGElement || e.target.closest("svg"); const rect = svg.getBoundingClientRect(); const viewBox = svg.viewBox.baseVal; const scaleX = viewBox.width / rect.width; const scaleY = viewBox.height / rect.height; const coords = { x: (t.clientX - rect.left) * scaleX, y: (t.clientY - rect.top) * scaleY }; setResizing({ ...bld, corner: "se" }); setResizeStart({ ...bld }); setDragStart(coords); }}>
                        <circle cx={bld.x + bld.w} cy={bld.y + bld.h} r={10} fill="#3b82f6" stroke="#1d4ed8" strokeWidth={2} style={{ cursor: "se-resize", pointerEvents: "all" }} />
                      </g>
                      <g onMouseDown={(e) => { e.stopPropagation(); e.preventDefault(); const svg = e.target.ownerSVGElement || e.target.closest("svg"); const coords = getSvgCoords(e, svg); setResizing({ ...bld, corner: "sw" }); setResizeStart({ ...bld }); setDragStart(coords); }} onTouchStart={(e) => { e.stopPropagation(); const t = e.touches[0]; const svg = e.target.ownerSVGElement || e.target.closest("svg"); const rect = svg.getBoundingClientRect(); const viewBox = svg.viewBox.baseVal; const scaleX = viewBox.width / rect.width; const scaleY = viewBox.height / rect.height; const coords = { x: (t.clientX - rect.left) * scaleX, y: (t.clientY - rect.top) * scaleY }; setResizing({ ...bld, corner: "sw" }); setResizeStart({ ...bld }); setDragStart(coords); }}>
                        <circle cx={bld.x} cy={bld.y + bld.h} r={10} fill="#3b82f6" stroke="#1d4ed8" strokeWidth={2} style={{ cursor: "sw-resize", pointerEvents: "all" }} />
                      </g>
                    </>
                  )}
                </g>
              );
            })}
            {layers.units && units.map(unit => {
              const st = uStatus(unit.id);
              return (
                <g key={unit.id} onClick={(e) => { if (editMode) { e.stopPropagation(); setSelectedForEdit({ ...unit, type: "units" }); } }}>
                  <circle cx={unit.rx} cy={unit.ry} r={5} fill={STATUS_COLOR[st]} />
                </g>
              );
            })}
            {layers.cameras && cameras.map(cam => (
              <g key={cam.id} onClick={() => { if (!editMode) { setSelCam(cam); } else { setSelectedForEdit({ ...cam, type: "cameras" }); } }}>
                <rect x={cam.x - 9} y={cam.y - 7} width={18} height={12} rx={3} fill="#0d1e30" stroke={cam.status === "online" ? "#38bdf8" : "#f87171"} strokeWidth={1} />
                <circle cx={cam.x + 4} cy={cam.y} r={2.5} fill={cam.status === "online" ? "#38bdf8" : "#f87171"} />
              </g>
            ))}
            <g transform="translate(665,80)">
              <circle cx="0" cy="0" r="11" fill="#fff" stroke="#9ca3af" strokeWidth={1} />
              <polygon points="0,-8 -2.5,2 2.5,2" fill="#ef4444" />
              <polygon points="0,8 -2.5,-2 2.5,-2" fill="#6b7280" />
              <text x="0" y="-11" textAnchor="middle" fontSize="6" fill="#ef4444" fontWeight="700">N</text>
            </g>
          </svg>
        </div>
      </div>
    );
  }

  return (
    <div>
      <div style={{ display: "grid", gridTemplateColumns: "repeat(5,1fr)", gap: 6, marginBottom: 12 }}>
        {[
          { lbl: "Active", val: activeCount, col: "#22c55e" },
          { lbl: "Paid", val: paidCount, col: "#38bdf8" },
          { lbl: "Expired", val: expiredCount, col: "#f87171" },
          { lbl: "Alerts", val: alertCount, col: "#fb923c" },
          { lbl: "Cameras", val: `${camOnline}/${cameras.length}`, col: "#a78bfa" }
        ].map(s => (
          <div key={s.lbl} style={{ background: "var(--card)", border: `1px solid ${s.col}33`, borderRadius: 10, padding: "8px 4px", textAlign: "center" }}>
            <div style={{ fontSize: 17, fontWeight: 700, color: s.col, fontFamily: "'DM Mono',monospace" }}>{s.val}</div>
            <div style={{ fontSize: 9, color: "var(--muted)", marginTop: 2 }}>{s.lbl}</div>
          </div>
        ))}
      </div>

      <div style={{ display: "flex", gap: 6, marginBottom: 10, flexWrap: "wrap", alignItems: "center" }}>
        <button onClick={() => { setEditMode(!editMode); if(!editMode) { setNewItemType(null); setDrawing(null); }}} style={{ 
          padding: "5px 12px", borderRadius: 6, border: "1px solid var(--accent)", 
          background: editMode ? "var(--accent)" : "transparent", 
          color: editMode ? "#fff" : "var(--accent)", fontSize: 10, fontWeight: 700 
        }}>{editMode ? "✓ EDIT MODE ON" : "✏ EDIT MODE"}</button>
        
        {!editMode && [{ id: "units", lbl: "Units", col: "#22c55e" }, { id: "cameras", lbl: "Cameras", col: "#a78bfa" }, { id: "wifi", lbl: "WiFi", col: "#fb923c" }, { id: "alerts", lbl: "Alerts", col: "#f87171" }].map(l => (
          <button key={l.id} onClick={() => setLayers(x => ({ ...x, [l.id]: !x[l.id] }))} style={{
            padding: "4px 11px", borderRadius: 20, border: `1px solid ${layers[l.id] ? l.col : "var(--border)"}`,
            background: layers[l.id] ? l.col + "22" : "transparent", color: layers[l.id] ? l.col : "var(--muted)",
            fontSize: 10, fontWeight: 700, cursor: "pointer", transition: "all .15s"
          }}>{l.lbl}</button>
        ))}
        
        {editMode && (
          <div style={{ display: "flex", gap: 4 }}>
            <button onClick={() => setNewItemType(newItemType === "building" ? null : "building")} style={{ padding: "4px 8px", borderRadius: 4, border: `1px solid ${newItemType === "building" ? "#22c55e" : "#1a3a2a"}`, background: newItemType === "building" ? "#22c55e" : "#22c55e22", color: newItemType === "building" ? "#fff" : "#22c55e", fontSize: 9, fontWeight: 700 }}>🏢 Building</button>
            <button onClick={() => setNewItemType(newItemType === "unit" ? null : "unit")} style={{ padding: "4px 8px", borderRadius: 4, border: `1px solid ${newItemType === "unit" ? "#38bdf8" : "#1a3a2a"}`, background: newItemType === "unit" ? "#38bdf8" : "#38bdf822", color: newItemType === "unit" ? "#fff" : "#38bdf8", fontSize: 9, fontWeight: 700 }}>⬤ Unit</button>
            <button onClick={() => setNewItemType(newItemType === "camera" ? null : "camera")} style={{ padding: "4px 8px", borderRadius: 4, border: `1px solid ${newItemType === "camera" ? "#a78bfa" : "#1a3a2a"}`, background: newItemType === "camera" ? "#a78bfa" : "#a78bfa22", color: newItemType === "camera" ? "#fff" : "#a78bfa", fontSize: 9, fontWeight: 700 }}>📷 Camera</button>
            <button onClick={() => setNewItemType(newItemType === "wifi" ? null : "wifi")} style={{ padding: "4px 8px", borderRadius: 4, border: `1px solid ${newItemType === "wifi" ? "#fb923c" : "#1a3a2a"}`, background: newItemType === "wifi" ? "#fb923c" : "#fb923c22", color: newItemType === "wifi" ? "#fff" : "#fb923c", fontSize: 9, fontWeight: 700 }}>📶 WiFi</button>
          </div>
        )}
        
        <div style={{ marginLeft: "auto", display: "flex", gap: 5, alignItems: "center" }}>
          <button onClick={() => setExpand(e => !e)} style={{ padding: "4px 9px", borderRadius: 7, border: "1px solid #a78bfa", background: expand ? "#a78bfa" : "transparent", color: expand ? "#fff" : "#a78bfa", fontSize: 10, fontWeight: 700, cursor: "pointer" }}>⤢ Expand</button>
          <button onClick={() => setZoom(z => Math.max(0.6, z - 0.2))} style={{ width: 28, height: 28, borderRadius: 7, border: "1px solid var(--border)", background: "var(--surface)", color: "var(--text)", fontSize: 16, cursor: "pointer" }}>−</button>
          <span style={{ fontSize: 10, color: "var(--muted)", fontFamily: "'DM Mono',monospace", minWidth: 34, textAlign: "center" }}>{Math.round(zoom * 100)}%</span>
          <button onClick={() => setZoom(z => Math.min(2.2, z + 0.2))} style={{ width: 28, height: 28, borderRadius: 7, border: "1px solid var(--border)", background: "var(--surface)", color: "var(--text)", fontSize: 16, cursor: "pointer" }}>+</button>
          <button onClick={clearAll} style={{ padding: "4px 9px", borderRadius: 7, border: "1px solid var(--border)", background: "transparent", color: "var(--muted)", fontSize: 10, cursor: "pointer" }}>Reset</button>
        </div>
      </div>

      {/* EDITOR PANEL */}
      {editMode && newItemType && (
        <div style={{ background: "var(--card)", border: "1px solid var(--accent)", borderRadius: 12, padding: 14, marginBottom: 12, animation: "fadeUp .2s" }}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 10 }}>
            <span style={{ fontSize: 13, fontWeight: 700, color: "var(--accent)" }}>Add {newItemType.toUpperCase()}</span>
            <button onClick={() => setNewItemType(null)} style={{ background: "none", border: "none", color: "var(--muted)", cursor: "pointer", fontSize: 16 }}>✕</button>
          </div>
          {newItemType === "building" && <BuildingForm onSave={confirmBuilding} onCancel={() => setNewItemType(null)} pendingBuilding={pendingBuilding} form={buildingForm} setForm={setBuildingForm} />}
          {newItemType === "unit" && <UnitForm onSave={addUnit} onCancel={() => setNewItemType(null)} buildings={buildings} />}
          {newItemType === "camera" && <CameraForm onSave={addCamera} onCancel={() => setNewItemType(null)} />}
          {newItemType === "wifi" && <WifiForm onSave={addWifiZone} onCancel={() => setNewItemType(null)} />}
        </div>
      )}

      {editMode && selectedForEdit && (
        <div style={{ background: "var(--card)", border: "1px solid var(--warn)", borderRadius: 12, padding: 14, marginBottom: 12 }}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 8 }}>
            <span style={{ fontSize: 13, fontWeight: 700, color: "var(--warn)" }}>Edit: {selectedForEdit.label}</span>
            <button onClick={() => setSelectedForEdit(null)} style={{ background: "none", border: "none", color: "var(--muted)", cursor: "pointer", fontSize: 16 }}>✕</button>
          </div>
          {selectedForEdit.type === "buildings" && (
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 8, marginBottom: 10 }}>
              <input 
                value={selectedForEdit.label} 
                onChange={e => setPropertyData(p => ({ ...p, buildings: p.buildings.map(b => b.id === selectedForEdit.id ? { ...b, label: e.target.value } : b) }))}
                style={inpStyle} 
                placeholder="Name"
              />
              <input 
                value={selectedForEdit.sublabel || ""} 
                onChange={e => setPropertyData(p => ({ ...p, buildings: p.buildings.map(b => b.id === selectedForEdit.id ? { ...b, sublabel: e.target.value } : b) }))}
                style={inpStyle} 
                placeholder="Sublabel"
              />
              <select 
                value={selectedForEdit.color}
                onChange={e => setPropertyData(p => ({ ...p, buildings: p.buildings.map(b => b.id === selectedForEdit.id ? { ...b, color: e.target.value } : b) }))}
                style={inpStyle}
              >
                <option value="#22c55e">Green</option>
                <option value="#38bdf8">Blue</option>
                <option value="#fb923c">Orange</option>
                <option value="#a78bfa">Purple</option>
                <option value="#fbbf24">Yellow</option>
                <option value="#64748b">Gray</option>
              </select>
              <select 
                value={selectedForEdit.type}
                onChange={e => setPropertyData(p => ({ ...p, buildings: p.buildings.map(b => b.id === selectedForEdit.id ? { ...b, type: e.target.value } : b) }))}
                style={inpStyle}
              >
                <option value="residential">Residential</option>
                <option value="church">Church</option>
                <option value="school">School</option>
                <option value="commercial">Commercial</option>
                <option value="utility">Utility</option>
              </select>
            </div>
          )}
          <button onClick={() => deleteItem(selectedForEdit.type, selectedForEdit.id)} style={{ padding: "6px 12px", borderRadius: 6, border: "1px solid var(--danger)", background: "#fef2f2", color: "var(--danger)", fontSize: 11, fontWeight: 700, cursor: "pointer" }}>🗑 Delete</button>
        </div>
      )}

      {editMode && (
        <div style={{ background: "var(--surface)", border: "1px solid var(--border)", borderRadius: 10, padding: 10, marginBottom: 10 }}>
          <div style={{ fontSize: 10, color: "var(--muted)", marginBottom: 6 }}>SAVED DATA ({buildings.length} buildings, {units.length} units, {cameras.length} cameras)</div>
          <div style={{ display: "flex", gap: 6, flexWrap: "wrap" }}>
            {buildings.map(b => (
              <div key={b.id} onClick={() => setSelectedForEdit({ ...b, type: "buildings" })} style={{ padding: "4px 8px", borderRadius: 4, background: b.color + "22", border: `1px solid ${b.color}`, fontSize: 9, color: b.color, cursor: "pointer" }}>{b.label}</div>
            ))}
          </div>
          <button onClick={resetData} style={{ marginTop: 8, padding: "4px 10px", borderRadius: 4, border: "1px solid var(--danger)", background: "transparent", color: "var(--danger)", fontSize: 9 }}>Reset All Data</button>
        </div>
      )}

      <div style={{ 
        background: "#ffffff", 
        borderRadius: expand ? 0 : 14, 
        border: expand ? "none" : "1px solid #d1d5db", 
        overflow: "hidden", 
        position: "relative",
        width: "100%",
        maxWidth: "none",
        margin: expand ? 0 : "0 auto"
      }}>
        <div style={{ position: "absolute", top: 10, left: 10, zIndex: 10, background: "#ffffffcc", border: "1px solid #d1d5db", borderRadius: 8, padding: "5px 12px", display: "flex", alignItems: "center", gap: 8, boxShadow: "0 1px 3px rgba(0,0,0,0.1)" }}>
          <div style={{ width: 6, height: 6, borderRadius: "50%", background: "#22c55e", boxShadow: `0 0 ${pulse ? 6 : 2}px #22c55e` }} />
          <span style={{ fontSize: 9, color: "#22c55e", fontFamily: "'DM Mono',monospace", fontWeight: 700 }}>LIVE</span>
          <span style={{ fontSize: 9, color: "#3a4a5a", fontFamily: "'DM Mono',monospace" }}>BGT · {units.length} Units</span>
        </div>

        <div style={{ overflow: "hidden", width: expand ? "100%" : "100%" }}>
          <div style={{ transform: `scale(${zoom})`, transformOrigin: "top center" }}>
            <svg viewBox="0 0 700 580" style={{ width: "100%", display: "block", cursor: editMode ? (newItemType === "building" ? "crosshair" : "default") : "default" }}
                onMouseDown={handleSvgMouseDown}
                onMouseMove={handleSvgMouseMove}
                onMouseUp={handleSvgMouseUp}
                onMouseLeave={handleSvgMouseUp}
                onTouchStart={handleSvgMouseDown}
                onTouchMove={handleSvgMouseMove}
                onTouchEnd={handleSvgMouseUp}>
              <rect width="700" height="580" fill="#f0f2f5" />
              
              {/* Streets */}
              <rect x="0" y="30" width="700" height="22" fill="#d1d5db" />
              <text x="50" y="44" textAnchor="middle" fontSize="7" fill="#6b7280" fontFamily="monospace">7TH AVE E</text>
              <rect x="0" y="530" width="700" height="22" fill="#d1d5db" />
              <text x="50" y="544" textAnchor="middle" fontSize="7" fill="#6b7280" fontFamily="monospace">8TH AVE E</text>
              <rect x="395" y="52" width="28" height="478" fill="#d1d5db" />
              <text x="409" y="290" textAnchor="middle" fontSize="7" fill="#6b7280" fontFamily="monospace" transform="rotate(-90,409,290)">13TH ST E</text>
              <rect x="660" y="52" width="25" height="478" fill="#d1d5db" />
              <text x="672" y="290" textAnchor="middle" fontSize="7" fill="#6b7280" fontFamily="monospace" transform="rotate(-90,672,290)">14TH ST</text>
              
              {/* Zone Labels */}
              <text x="180" y="60" textAnchor="middle" fontSize="9" fill="#059669" fontFamily="monospace" fontWeight="700" opacity="0.7">WEST ZONE</text>
              <text x="550" y="60" textAnchor="middle" fontSize="9" fill="#0284c7" fontFamily="monospace" fontWeight="700" opacity="0.7">EAST ZONE</text>
              
              {/* Property boundaries */}
              <rect x="50" y="52" width="345" height="478" fill="none" stroke="#059669" strokeWidth="1" strokeDasharray="6,4" opacity="0.4" />
              <rect x="425" y="52" width="235" height="478" fill="none" stroke="#0284c7" strokeWidth="1" strokeDasharray="6,4" opacity="0.4" />
              
              {/* WiFi coverage */}
              {layers.wifi && wifiZones.map(wz => (
                <g key={wz.id}>
                  <ellipse cx={wz.x} cy={wz.y} rx={wz.radius} ry={wz.radius * 0.8} fill="#22c55e" opacity="0.1" />
                  <ellipse cx={wz.x} cy={wz.y} rx={wz.radius * 0.6} ry={wz.radius * 0.5} fill="#22c55e" opacity="0.15" />
                </g>
              ))}
              
              {/* Router */}
              {layers.wifi && (
                <g>
                  <circle cx="250" cy="280" r="10" fill="#ffffff" stroke="#a78bfa" strokeWidth={pulse ? 2 : 1} />
                  <text x="250" y="284" textAnchor="middle" fontSize="10">📡</text>
                </g>
              )}
              
              {/* Buildings */}
              {buildings.map(bld => (
                <g key={bld.id} style={{ cursor: editMode ? "move" : "pointer" }} onClick={(e) => { if (editMode) { e.stopPropagation(); setSelectedForEdit({ ...bld, type: "buildings" }); } else { handleBuildingClick(bld); } }} onMouseDown={(e) => startDrag(bld, e)}>
                  <rect x={bld.x} y={bld.y} width={bld.w} height={bld.h} rx={4} fill="#ffffff" stroke={bld.color} strokeWidth={2} />
                  <rect x={bld.x} y={bld.y} width={bld.w} height={12} rx={4} fill={bld.color + "22"} />
                  <text x={bld.x + bld.w / 2} y={bld.y + 9} textAnchor="middle" fontSize={bld.w > 50 ? 8 : 6} fill={bld.color} fontWeight="700">{bld.type === "church" ? "⛪ " : ""}{bld.label}</text>
                </g>
              ))}
              
              {/* Drawing preview */}
              {editMode && drawing && (
                <g>
                  <rect x={drawing.x} y={drawing.y} width={drawing.w} height={drawing.h} fill={buildingForm.color} fillOpacity="0.3" stroke={buildingForm.color} strokeWidth="2" strokeDasharray="6,4" />
                  <text x={drawing.x + drawing.w/2} y={drawing.y + drawing.h/2 + 4} textAnchor="middle" fontSize="10" fill={buildingForm.color} fontWeight="700">{buildingForm.label || "NEW"}</text>
                </g>
              )}
              
              {/* Save/Cancel floating panel for pending building */}
              {pendingBuilding && (
                <g>
                  <rect x={pendingBuilding.x} y={pendingBuilding.y} width={pendingBuilding.w} height={pendingBuilding.h} fill={pendingBuilding.color} fillOpacity="0.4" stroke={pendingBuilding.color} strokeWidth="2" />
                  <foreignObject x={pendingBuilding.x} y={pendingBuilding.y - 35} width={pendingBuilding.w} height={30}>
                    <div style={{ display: "flex", gap: 4, justifyContent: "center" }}>
                      <button onClick={confirmBuilding} style={{ padding: "4px 12px", borderRadius: 4, border: "none", background: "#22c55e", color: "#fff", fontSize: 10, fontWeight: 700, cursor: "pointer" }}>✓ Save</button>
                      <button onClick={cancelBuilding} style={{ padding: "4px 12px", borderRadius: 4, border: "none", background: "#f87171", color: "#fff", fontSize: 10, fontWeight: 700, cursor: "pointer" }}>✕ Cancel</button>
                    </div>
                  </foreignObject>
                </g>
              )}
              
              {/* Buildings with resize handles */}
              {buildings.map(bld => {
                const isSel = selectedForEdit?.id === bld.id;
                return (
                  <g key={bld.id} style={{ cursor: editMode ? "move" : "pointer" }} onClick={(e) => { if (editMode) { e.stopPropagation(); setSelectedForEdit({ ...bld, type: "buildings" }); } else { handleBuildingClick(bld); } }} onMouseDown={(e) => startDrag(bld, e)}>
                    <rect x={bld.x} y={bld.y} width={bld.w} height={bld.h} rx={4} fill="#ffffff" stroke={isSel ? "#000" : bld.color} strokeWidth={isSel ? 3 : 2} />
                    <rect x={bld.x} y={bld.y} width={bld.w} height={12} rx={4} fill={bld.color + "22"} />
                    <text x={bld.x + bld.w / 2} y={bld.y + 9} textAnchor="middle" fontSize={bld.w > 50 ? 8 : 6} fill={bld.color} fontWeight="700">{bld.type === "church" ? "⛪ " : ""}{bld.label}</text>
                    {editMode && (
                      <>
                        <g onMouseDown={(e) => { e.stopPropagation(); e.preventDefault(); const svg = e.target.ownerSVGElement || e.target.closest("svg"); const coords = getSvgCoords(e, svg); setResizing({ ...bld, corner: "se" }); setResizeStart({ ...bld }); setDragStart(coords); }} onTouchStart={(e) => { e.stopPropagation(); const t = e.touches[0]; const svg = e.target.ownerSVGElement || e.target.closest("svg"); const rect = svg.getBoundingClientRect(); const viewBox = svg.viewBox.baseVal; const scaleX = viewBox.width / rect.width; const scaleY = viewBox.height / rect.height; const coords = { x: (t.clientX - rect.left) * scaleX, y: (t.clientY - rect.top) * scaleY }; setResizing({ ...bld, corner: "se" }); setResizeStart({ ...bld }); setDragStart(coords); }}>
                          <circle cx={bld.x + bld.w} cy={bld.y + bld.h} r={8} fill="#3b82f6" stroke="#1d4ed8" strokeWidth={2} style={{ cursor: "se-resize", pointerEvents: "all" }} />
                        </g>
                        <g onMouseDown={(e) => { e.stopPropagation(); e.preventDefault(); const svg = e.target.ownerSVGElement || e.target.closest("svg"); const coords = getSvgCoords(e, svg); setResizing({ ...bld, corner: "sw" }); setResizeStart({ ...bld }); setDragStart(coords); }} onTouchStart={(e) => { e.stopPropagation(); const t = e.touches[0]; const svg = e.target.ownerSVGElement || e.target.closest("svg"); const rect = svg.getBoundingClientRect(); const viewBox = svg.viewBox.baseVal; const scaleX = viewBox.width / rect.width; const scaleY = viewBox.height / rect.height; const coords = { x: (t.clientX - rect.left) * scaleX, y: (t.clientY - rect.top) * scaleY }; setResizing({ ...bld, corner: "sw" }); setResizeStart({ ...bld }); setDragStart(coords); }}>
                          <circle cx={bld.x} cy={bld.y + bld.h} r={8} fill="#3b82f6" stroke="#1d4ed8" strokeWidth={2} style={{ cursor: "sw-resize", pointerEvents: "all" }} />
                        </g>
                      </>
                    )}
                  </g>
                );
              })}
              
              {/* Units */}
              {layers.units && units.map(unit => {
                const st = uStatus(unit.id);
                const col = STATUS_COLOR[st];
                const sel = selUnit?.id === unit.id;
                return (
                  <g key={unit.id} style={{ cursor: editMode ? "move" : "pointer" }} onClick={(e) => { if (editMode) { e.stopPropagation(); setSelectedForEdit({ ...unit, type: "units" }); } else { handleUnitClick(unit); } }} onMouseDown={(e) => { if (editMode) { e.stopPropagation(); setDragging({ ...unit, type: "unit" }); const coords = getSvgCoords(e, e.currentTarget.closest("svg")); setDragStart(coords); } }}>
                    {uMaint(unit.id).length > 0 && layers.alerts && <circle cx={unit.rx} cy={unit.ry} r={10} fill="none" stroke="#fb923c" strokeWidth={pulse ? 2 : 1} opacity={pulse ? 0.9 : 0.4} />}
                    <circle cx={unit.rx} cy={unit.ry} r={5} fill={col} stroke={sel ? "#fff" : "none"} strokeWidth={sel ? 1.5 : 0} />
                  </g>
                );
              })}
              
              {/* Cameras */}
              {layers.cameras && cameras.map(cam => (
                <g key={cam.id} style={{ cursor: editMode ? "move" : "pointer" }} onClick={() => { if (!editMode) { setSelCam(cam); setSelUnit(null); } else { setSelectedForEdit({ ...cam, type: "cameras" }); } }} onMouseDown={(e) => { if (editMode) { e.stopPropagation(); setDragging({ ...cam, type: "camera" }); const coords = getSvgCoords(e, e.currentTarget.closest("svg")); setDragStart(coords); } }}>
                  <rect x={cam.x - 9} y={cam.y - 7} width={18} height={12} rx={3} fill="#0d1e30" stroke={cam.status === "online" ? "#38bdf8" : "#f87171"} strokeWidth={1} />
                  <circle cx={cam.x + 4} cy={cam.y} r={2.5} fill={cam.status === "online" ? "#38bdf8" : "#f87171"} opacity={cam.status === "online" && pulse ? 1 : 0.5} />
                  <text x={cam.x} y={cam.y + 16} textAnchor="middle" fontSize="6" fill="#3d5a7a" fontFamily="monospace">{cam.label}</text>
                </g>
              ))}
              
              {/* Compass */}
              <g transform="translate(665,80)">
                <circle cx="0" cy="0" r="11" fill="#ffffff" stroke="#9ca3af" strokeWidth="1" />
                <polygon points="0,-8 -2.5,2 2.5,2" fill="#ef4444" />
                <polygon points="0,8 -2.5,-2 2.5,-2" fill="#6b7280" />
                <text x="0" y="-11" textAnchor="middle" fontSize="6" fill="#ef4444" fontWeight="700">N</text>
              </g>
              
              <text x="60" y="522" fontSize="6" fill="#9ca3af" fontFamily="monospace">27.4894°N · 82.5748°W · Bradenton, FL</text>
            </svg>
          </div>
        </div>

        {/* Legend */}
        <div style={{ background: "#f9fafb", borderTop: "1px solid #e5e7eb", padding: "8px 14px", display: "flex", gap: 14, flexWrap: "wrap" }}>
          {[
            { col: "#22c55e", lbl: "Active" },
            { col: "#38bdf8", lbl: "Paid" },
            { col: "#f87171", lbl: "Expired" },
            { col: "#475569", lbl: "No Device" },
            { col: "#fb923c", lbl: "Alert" },
          ].map(l => (
            <div key={l.lbl} style={{ display: "flex", alignItems: "center", gap: 4 }}>
              <div style={{ width: 6, height: 6, borderRadius: "50%", background: l.col }} />
              <span style={{ fontSize: 8, color: "#4a5a6a" }}>{l.lbl}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Unit detail */}
      {selUnit && (
        <div style={{ background: "var(--card)", border: `1px solid ${STATUS_COLOR[selUnit.status]}55`, borderRadius: 14, padding: 14, marginTop: 12 }}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 12 }}>
            <div>
              <div style={{ fontSize: 15, fontWeight: 700 }}>{selUnit.userData?.unit || selUnit.label}</div>
              <div style={{ fontSize: 11, color: "var(--muted)" }}>{selUnit.userData?.name || selUnit.buildingName || "Unoccupied"}</div>
            </div>
            <div style={{ display: "flex", gap: 8, alignItems: "center" }}>
              <span style={{ fontSize: 10, fontWeight: 700, padding: "3px 9px", borderRadius: 20, background: STATUS_COLOR[selUnit.status] + "22", color: STATUS_COLOR[selUnit.status] }}>{STATUS_LABEL[selUnit.status]}</span>
              <button onClick={() => setSelUnit(null)} style={{ background: "none", border: "none", color: "var(--muted)", cursor: "pointer", fontSize: 18 }}>✕</button>
            </div>
          </div>
          {selUnit.userData && (
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 8 }}>
              {[{ l: "IP", v: selUnit.userData.ip }, { l: "Data", v: selUnit.userData.dataUsed }, { l: "Last Seen", v: selUnit.userData.lastSeen }, { l: "Used", v: `${selUnit.userData.minutesUsed}/60 min` }].map(f => (
                <div key={f.l}><div style={{ fontSize: 9, color: "var(--muted)", textTransform: "uppercase" }}>{f.l}</div><div style={{ fontSize: 11, fontFamily: "'DM Mono',monospace" }}>{f.v}</div></div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* Camera detail */}
      {selCam && (
        <div style={{ background: "var(--card)", border: `1px solid ${selCam.status === "online" ? "#38bdf833" : "#f8717133"}`, borderRadius: 14, padding: 14, marginTop: 12 }}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
            <div>
              <div style={{ fontSize: 15, fontWeight: 700 }}>📷 {selCam.label}</div>
              <div style={{ fontSize: 11, color: "var(--muted)", fontFamily: "'DM Mono',monospace" }}>{selCam.zone || "Property"}</div>
            </div>
            <div style={{ display: "flex", alignItems: "center", gap: 5 }}>
              <div style={{ width: 6, height: 6, borderRadius: "50%", background: selCam.status === "online" ? "#38bdf8" : "#f87171" }} />
              <span style={{ fontSize: 10, fontWeight: 700, color: selCam.status === "online" ? "#38bdf8" : "#f87171" }}>{selCam.status.toUpperCase()}</span>
              <button onClick={() => setSelCam(null)} style={{ background: "none", border: "none", color: "var(--muted)", cursor: "pointer", fontSize: 18, marginLeft: 8 }}>✕</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

function BuildingForm({ onSave, onCancel, form, setForm }) {
  return (
    <div>
      <div style={{ fontSize: 10, color: "var(--muted)", marginBottom: 8 }}>
        Click and drag on map to draw the building shape
      </div>
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 8 }}>
        <input value={form.label} onChange={e => setForm(f => ({ ...f, label: e.target.value }))} placeholder="Name (e.g. CHURCH)" style={inpStyle} />
        <input value={form.sublabel} onChange={e => setForm(f => ({ ...f, sublabel: e.target.value }))} placeholder="Sublabel" style={inpStyle} />
        <select value={form.color} onChange={e => setForm(f => ({ ...f, color: e.target.value }))} style={inpStyle}>
          <option value="#22c55e">Green</option>
          <option value="#38bdf8">Blue</option>
          <option value="#fb923c">Orange</option>
          <option value="#a78bfa">Purple</option>
          <option value="#fbbf24">Yellow</option>
          <option value="#64748b">Gray</option>
        </select>
        <select value={form.type} onChange={e => setForm(f => ({ ...f, type: e.target.value }))} style={inpStyle}>
          <option value="residential">Residential</option>
          <option value="church">Church</option>
          <option value="school">School</option>
          <option value="commercial">Commercial</option>
          <option value="utility">Utility</option>
        </select>
      </div>
      <div style={{ display: "flex", gap: 8, marginTop: 12 }}>
        <button onClick={onSave} style={{ ...btnStyle, background: "var(--accent)", color: "#fff" }}>Add Building</button>
        <button onClick={onCancel} style={btnStyle}>Cancel</button>
      </div>
    </div>
  );
}

function UnitForm({ onSave, onCancel, buildings }) {
  const [label, setLabel] = useState("U1");
  const [building, setBuilding] = useState(buildings[0]?.id || "");
  const [rx, setRx] = useState(100);
  const [ry, setRy] = useState(100);
  const [floor, setFloor] = useState(1);

  return (
    <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 8 }}>
      <input value={label} onChange={e => setLabel(e.target.value)} placeholder="Unit label (e.g. U1)" style={inpStyle} />
      <select value={building} onChange={e => setBuilding(e.target.value)} style={inpStyle}>
        {buildings.map(b => <option key={b.id} value={b.id}>{b.label}</option>)}
      </select>
      <input type="number" value={rx} onChange={e => setRx(+e.target.value)} placeholder="X position" style={inpStyle} />
      <input type="number" value={ry} onChange={e => setRy(+e.target.value)} placeholder="Y position" style={inpStyle} />
      <input type="number" value={floor} onChange={e => setFloor(+e.target.value)} placeholder="Floor" style={inpStyle} />
      <div></div>
      <button onClick={() => onSave({ label, building, rx, ry, floor })} style={{ ...btnStyle, background: "var(--accent)", color: "#fff" }}>Save Unit</button>
      <button onClick={onCancel} style={btnStyle}>Cancel</button>
    </div>
  );
}

function CameraForm({ onSave, onCancel }) {
  const [label, setLabel] = useState("Camera 1");
  const [x, setX] = useState(200);
  const [y, setY] = useState(200);
  const [status, setStatus] = useState("online");

  return (
    <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 8 }}>
      <input value={label} onChange={e => setLabel(e.target.value)} placeholder="Camera name" style={inpStyle} />
      <select value={status} onChange={e => setStatus(e.target.value)} style={inpStyle}>
        <option value="online">Online</option>
        <option value="offline">Offline</option>
      </select>
      <input type="number" value={x} onChange={e => setX(+e.target.value)} placeholder="X position" style={inpStyle} />
      <input type="number" value={y} onChange={e => setY(+e.target.value)} placeholder="Y position" style={inpStyle} />
      <button onClick={() => onSave({ label, x, y, status, zone: "Property" })} style={{ ...btnStyle, background: "var(--accent)", color: "#fff" }}>Save Camera</button>
      <button onClick={onCancel} style={btnStyle}>Cancel</button>
    </div>
  );
}

function WifiForm({ onSave, onCancel }) {
  const [x, setX] = useState(250);
  const [y, setY] = useState(250);
  const [radius, setRadius] = useState(100);

  return (
    <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 8 }}>
      <input type="number" value={x} onChange={e => setX(+e.target.value)} placeholder="Center X" style={inpStyle} />
      <input type="number" value={y} onChange={e => setY(+e.target.value)} placeholder="Center Y" style={inpStyle} />
      <input type="number" value={radius} onChange={e => setRadius(+e.target.value)} placeholder="Radius" style={inpStyle} />
      <div></div>
      <button onClick={() => onSave({ x, y, radius })} style={{ ...btnStyle, background: "var(--accent)", color: "#fff" }}>Save WiFi Zone</button>
      <button onClick={onCancel} style={btnStyle}>Cancel</button>
    </div>
  );
}

const inpStyle = { padding: "6px 8px", borderRadius: 4, border: "1px solid var(--border)", background: "var(--surface)", color: "var(--text)", fontSize: 11 };
const btnStyle = { padding: "6px 10px", borderRadius: 4, border: "1px solid var(--border)", background: "var(--surface)", color: "var(--text)", fontSize: 11, cursor: "pointer" };

export default PropertyMap;