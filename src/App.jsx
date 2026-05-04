import { useState, useEffect, useRef, createContext, useContext } from "react";

const CHURCH_LOGO = "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAANwAAACUCAYAAAD4UUeAAAAAtGVYSWZJSSoACAAAAAYAEgEDAAEAAAABAAAAGgEFAAEAAABWAAAAGwEFAAEAAABeAAAAKAEDAAEAAAACAAAAEwIDAAEAAAABAAAAaYcEAAEAAABmAAAAAAAAADhjAADoAwAAOGMAAOgDAAAGAACQBwAEAAAAMDIxMAGRBwAEAAAAAQIDAACgBwAEAAAAMDEwMAGgAwABAAAA//8AAAKgBAABAAAA3AAAAAOgBAABAAAAlAAAAAAAAABGv70LAAAACXBIWXMAAAPoAAAD6AG1e1JrAAAgAElEQVR4nOy9CZgU1dU+fqqHxX2J0RhN1LjELYmJYkxcEqMxxqhxCcjODLugoIAKKNvA7PvAsO+ggaCICyCKEHYGhoGZYfZep/e1upau6q6qXv7nVncPzUiM+b7/80O/1Hme+1R39e1bt26d95733HvuLQBNNNFEE0000UQTTTTRRBNNNNFEE0000UQTTTTRRBNNNNFEE0000UQTTTTRRBNNNNFEE0000UQTTTTRRBNNNNFEE0000UQTTTTRRBNNNNFEE0000UQTTTTRRBNNNNFEE000OS8ybd0amLpmHaZ3YerqDee7Oppo8n9Thi8ogsfGvQIz332fgvvvhl+PngRDCsth0qq157tqmmjyf0sm1SCorrsRSncfhGlr34M7Bg7o/YfJ03sPQBC+lFcIb2zcdL6rqIkm/3cku7Aacrdtg2nv/h3GVC7qN7ayZsnY6sUT/jhnQdZd06bD5FXrz3cVNdHk/4aMKVsB46qWUMNLqmDg/OIbRxZVHhhVUpUYXV6947nc/Mufzl0AoyprYPIazZ/TRJP/tUxdvRGmFlTBzNJFkF1Unp9TVBHLLihPDM8vXTZ+/kIYX7CIemX5yvNdTU00+e7LrM3bAIFF9Z+VC0MWFP8KwWbJKaxIkDRsQemeAXPyf9B/Vh5MWLiCOt911UST77TkbtkE/WcVwmtLaqg6rgkGzSssT4FNIcfswvLgsPzSPw3NLwU86mas33y+q6yJJt9dmfvuuzB5ySrdy5WLYcCsBQ8gjbSlABclaWRxZWJkafXUmWvfhSlLV1GTV64731XWRJPvpkytWQUvly9Ofsm6GcaV1yzKAFtM/VxUISPghoypqIFxlUt00zdoUwOaaPI/kucnz4JXF6+kXkkC7/6RRZWObsAVVcSGzC2UB8/J3zW4oPTagUVlMGX1Bs2H00ST/6nMWLUenpsyE34zeOzFw+aXbFZ9toLyKAIvPjS3ONp/+lzroNzCl4bOLYBh84opuPGO811lTTT57sljE/PhtSWrqREFZTA0r/yGwXML14zIK+NS1i02Ir8s9uKbc9wDZuYW5JRXXjTzw3/AkNxCmPPulvNddU00+W7JjHWbICe/HKau3QytiQQMmL2gKAW0uOq3IZUcvqA0MfCdvFqklLcMnV8KmKjSffXnu+qaaPLdkxkrVqtzbkPmF8KLM+c+ghTSnTlQgt/jQ+cVKUPnF096pWIhjCmppnIKy893tTXR5LspE6oXQ+Xuo/DkmAk6BNKKjDk3YuGi2fnliWELSnY+O23m5U+/OQsGzsmnxi9Zdb6rrYkm3z2p2LoVxpRW6caUVkBOcfmDCLCzrNuw+SXxIXOL7KOKq//4avUyGFlQSc1+T5vo1kST/5FMXr4GXpiXBy8tKOqN1m35WXNuBRXxwXMKo4Nm58+47ekRcNl9T8DrS1af7yprosl3U2as3wSj0R8bWVQB2YXlv+lh3aIj8koTQ+eX7BmcW/KjkUXVgIl6pXoJTKqogRlLV8OMZavhrZVr4a01G+HNlRtg+lqyGnwDTMP0xur1+HktzHxvDczQJsY1+W+XtzauB/TLYHTxQuqdmm0IuLLKngMlQ+YWioPnFb3e/51cG...";

const AppCtx = createContext(null);

const INITIAL_USERS = [
  { id:1,  unit:"Unit 1",  name:"Maria G.",  mac:"AA:BB:CC:DD:EE:01", ip:"192.168.1.101", minutesUsed:60, status:"expired", paid:false, lastSeen:"2 min ago",  joined:"Apr 10", dataUsed:"1.2 GB" },
  { id:2,  unit:"Unit 7",  name:"James T.",  mac:"AA:BB:CC:DD:EE:07", ip:"192.168.1.107", minutesUsed:34, status:"active",  paid:false, lastSeen:"now",        joined:"Apr 12", dataUsed:"340 MB" },
  { id:3,  unit:"Unit 12", name:"Luisa M.",  mac:"AA:BB:CC:DD:EE:12", ip:"192.168.1.112", minutesUsed:60, status:"paid",   paid:true,  lastSeen:"now",        joined:"Apr 1",  dataUsed:"4.7 GB",  plan:"Day Pass",  paidHoursTotal:24,  paidHoursUsed:6   },
  { id:4,  unit:"Unit 3",  name:"Deon P.",   mac:"AA:BB:CC:DD:EE:03", ip:"192.168.1.103", minutesUsed:12, status:"active",  paid:false, lastSeen:"now",        joined:"Apr 15", dataUsed:"88 MB"  },
  { id:5,  unit:"Unit 19", name:"Susan K.",  mac:"AA:BB:CC:DD:EE:19", ip:"192.168.1.119", minutesUsed:60, status:"expired", paid:false, lastSeen:"8 min ago", joined:"Apr 9",  dataUsed:"2.1 GB" },
  { id:6,  unit:"Unit 4",  name:"Andre W.",  mac:"AA:BB:CC:DD:EE:04", ip:"192.168.1.104", minutesUsed:60, status:"paid",   paid:true,  lastSeen:"now",        joined:"Apr 3",  dataUsed:"9.3 GB",  plan:"Week Pass", paidHoursTotal:168, paidHoursUsed:51  },
  { id:7,  unit:"Unit 22", name:"Tina R.",   mac:"AA:BB:CC:DD:EE:22", ip:"192.168.1.122", minutesUsed:45, status:"active",  paid:false, lastSeen:"now",        joined:"Apr 14", dataUsed:"210 MB" },
  { id:8,  unit:"Unit 8",  name:"Carlos F.", mac:"AA:BB:CC:DD:EE:08", ip:"192.168.1.108", minutesUsed:60, status:"expired", paid:false, lastSeen:"15 min ago", joined:"Apr 7",  dataUsed:"3.4 GB" },
  { id:9,  unit:"Unit 15", name:"Priya N.",  mac:"AA:BB:CC:DD:EE:15", ip:"192.168.1.115", minutesUsed:60, status:"paid",   paid:true,  lastSeen:"now",        joined:"Apr 2",  dataUsed:"11.2 GB", plan:"Monthly",   paidHoursTotal:730, paidHoursUsed:180 },
  { id:10, unit:"Unit 31", name:"Bobby H.",  mac:"AA:BB:CC:DD:EE:31", ip:"192.168.1.131", minutesUsed:5,  status:"active",  paid:false, lastSeen:"now",        joined:"Apr 17", dataUsed:"12 MB"  },
];

const INITIAL_EVENTS = [
  { id:1, title:"Sunday Morning Service",   date:"Every Sunday",    time:"10:30 AM", desc:"Join us for worship, prayer and the Word.", category:"service" },
  { id:2, title:"Wednesday Bible Study",    date:"Every Wednesday", time:"7:00 PM",  desc:"Deep dive into scripture together.",         category:"study"   },
  { id:3, title:"Community Outreach Day",   date:"Apr 26, 2026",   time:"9:00 AM",  desc:"Serving our neighborhood together.",         category:"event"   },
  { id:4, title:"Easter Sunrise Service",  date:"Apr 20, 2026",   time:"6:30 AM",  desc:"Celebrate the resurrection at dawn.",        category:"special" },
  { id:5, title:"Youth Group Friday Night", date:"Every Friday",    time:"6:00 PM",  desc:"Fun, faith and fellowship for ages 13-18.", category:"youth"   },
];

const INITIAL_TENANT_POSTS = [
  { id:1, category:"announcement", title:"Welcome to Community Board!", body:"Use this board for property news, maintenance schedules and community updates.", date:"Apr 19" },
  { id:2, category:"maintenance",  title:"Water Shutoff — Apr 22",      body:"Water off 9 AM–12 PM for main line repairs. Please store water in advance.",   date:"Apr 19" },
  { id:3, category:"parking",      title:"Parking Lot Restriping",      body:"Lot closed Sat Apr 25 for restriping. Please park on side street.",             date:"Apr 18" },
  { id:4, category:"packages",     title:"Package Pickup Hours",        body:"Packages held in office Mon–Fri 9 AM–5 PM. Ring bell after hours.",            date:"Apr 17" },
  { id:5, category:"marketplace", title:"Free: Box of Books",          body:"Box of books available in laundry room — first come first served.",             date:"Apr 16" },
  { id:6, category:"meeting",     title:"Tenant Meeting — May 1",     body:"Monthly tenant meeting in common area 6 PM. Topics: parking, AC, landscaping.", date:"Apr 15" },
];

const INITIAL_MAINT = [
  { id:1, unit:"Unit 7",  category:"plumbing", message:"Kitchen sink draining slowly, been like this 3 days.", date:"Apr 19", status:"new"        },
  { id:2, unit:"Unit 12", category:"electric",  message:"Outlet in bathroom stopped working after the storm.",  date:"Apr 18", status:"in_progress" },
  { id:3, unit:"Unit 3",  category:"ac",       message:"AC not cooling properly, room stays above 80 degrees.",date:"Apr 17", status:"resolved"   },
];

const PLANS = [
  { id:"day",   label:"Day Pass",  hours:24,  price:1.00 },
  { id:"week",  label:"Week Pass", hours:168, price:5.00 },
  { id:"month", label:"Monthly",   hours:730, price:15.00 },
];

const VALID_CODES  = { "CHURCH24":"day", "BLESS724":"week", "GRACE301":"month" };
const CODE_LENGTH  = 8;
const TENANT_CATS  = [
  { id:"announcement", label:"📢 Announcements", color:"#22c55e" },
  { id:"maintenance",  label:"🔧 Maintenance",   color:"#fb923c" },
  { id:"marketplace",  label:"🛒 Marketplace",   color:"#a78bfa" },
  { id:"meeting",      label:"📅 Meetings",       color:"#38bdf8" },
  { id:"packages",     label:"📦 Packages",       color:"#fbbf24" },
  { id:"parking",      label:"🚗 Parking",        color:"#f472b6" },
];
const MAINT_CATS   = ["plumbing","electric","ac","general","pest","appliance"];
const UNITS        = Array.from({length:60},(_,i)=>`Unit ${i+1}`);
const SCRIPTURES   = [
  { verse:"Share with the Lord's people who are in need. Practice hospitality.", ref:"Romans 12:13" },
  { verse:"For where two or three gather in my name, there am I with them.",       ref:"Matthew 18:20" },
  { verse:"Let us not become weary in doing good, for at the proper time we will reap a harvest.", ref:"Galatians 6:9" },
  { verse:"Be kind and compassionate to one another, forgiving each other.",       ref:"Ephesians 4:32" },
  { verse:"A generous person will prosper; whoever refreshes others will be refreshed.", ref:"Proverbs 11:25" },
];
const EVT_COLOR = { service:"#22c55e", study:"#38bdf8", event:"#fb923c", special:"#a78bfa", youth:"#fbbf24" };
const DONATION_PLANS = [
  { id:"d5",  label:"$5 Blessing",   hours:48,  price:5  },
  { id:"d10", label:"$10 Gift",      hours:96,  price:10 },
  { id:"d25", label:"$25 Offering",  hours:240, price:25 },
  { id:"d50", label:"$50 Blessing",  hours:480, price:50 },
];

const css = `
  @import url('https://fonts.googleapis.com/css2?family=DM+Mono:wght@400;500&family=Sora:wght@300;400;600;700&display=swap');
  *,*::before,*::after{box-sizing:border-box;margin:0;padding:0;}

  :root{
    --bg:#0d0f14;--surface:#13161e;--border:#1e2230;--accent:#22c55e;
    --accent2:#38bdf8;--warn:#fb923c;--danger:#f87171;--text:#e2e8f0;
    --muted:#64748b;--card:#181c27;--sbg:#0b1a0f;--sbd:#1a3a20;--stx:#86efac;
    --grad:radial-gradient(ellipse 70% 60% at 50% 0%,#0f2318 0%,#0d0f14 70%);
  }
  body.light{
    --bg:#f0f4f0;--surface:#fff;--border:#d1ddd1;--accent:#16a34a;
    --accent2:#0284c7;--warn:#ea580c;--danger:#dc2626;--text:#1a2e1a;
    --muted:#4b6358;--card:#fff;--sbg:#dcfce7;--sbd:#86efac;--stx:#15803d;
    --grad:radial-gradient(ellipse 70% 60% at 50% 0%,#dcfce7 0%,#f0f4f0 70%);
  }
  body{background:var(--bg);color:var(--text);font-family:'Sora',sans-serif;min-height:100vh;transition:background .25s,color .25s;}
  .mono{font-family:'DM Mono',monospace;}

  .scr{background:var(--sbg);border:1px solid var(--sbd);border-radius:12px;padding:12px 14px;margin-bottom:12px;text-align:center;}
  .scr-v{font-size:12px;color:var(--stx);line-height:1.7;font-style:italic;margin-bottom:3px;}
  .scr-r{font-size:10px;color:var(--muted);letter-spacing:.06em;text-transform:uppercase;}

  .tog{width:40px;height:22px;border-radius:11px;border:none;cursor:pointer;background:var(--border);position:relative;transition:background .2s;flex-shrink:0;}
  .tog::after{content:'';position:absolute;top:3px;left:3px;width:16px;height:16px;border-radius:50%;background:var(--accent);transition:transform .2s;}
  body.light .tog::after{transform:translateX(18px);}

  .nav{display:flex;align-items:center;justify-content:space-between;padding:0 12px;height:52px;background:var(--surface);border-bottom:1px solid var(--border);position:sticky;top:0;z-index:100;gap:6px;}
  .nav-logo{display:flex;align-items:center;gap:6px;flex-shrink:0;text-decoration:none;}
  .nav-logo img{height:30px;width:auto;object-fit:contain;}
  .nav-name{font-size:11px;font-weight:700;color:var(--accent);line-height:1.2;max-width:110px;}
  .nav-tabs{display:flex;gap:2px;}
  .nav-tab{padding:5px 10px;border-radius:6px;font-size:11px;font-weight:600;cursor:pointer;border:none;background:transparent;color:var(--muted);transition:all .15s;white-space:nowrap;}
  .nav-tab.active{background:var(--border);color:var(--text);}

  .wrap{min-height:calc(100vh - 52px);display:flex;align-items:flex-start;justify-content:center;padding:20px 14px 40px;background:var(--grad);}
  .card{background:var(--card);border:1px solid var(--border);border-radius:16px;padding:22px 18px;width:100%;max-width:420px;box-shadow:0 4px 24px rgba(0,0,0,.08);animation:fadeUp .4s ease both;}
  @keyframes fadeUp{from{opacity:0;transform:translateY(14px)}to{opacity:1;transform:translateY(0)}}

  .tblock{background:var(--surface);border:1px solid var(--border);border-radius:12px;padding:13px 16px;margin-bottom:12px;}
  .tlbl{font-size:10px;color:var(--muted);margin-bottom:5px;letter-spacing:.06em;text-transform:uppercase;}
  .trow{display:flex;align-items:center;justify-content:space-between;margin-bottom:8px;}
  .tval{font-size:28px;font-weight:700;font-family:'DM Mono',monospace;color:var(--accent);}
  .tval.warn{color:var(--warn)}.tval.exp{color:var(--danger)}
  .tbadge{font-size:10px;font-weight:600;padding:3px 10px;border-radius:20px;letter-spacing:.06em;text-transform:uppercase;}
  .tbadge.active{background:var(--sbg);color:var(--accent);border:1px solid var(--sbd);}
  .tbadge.warn{background:#2a1a0a;color:var(--warn);border:1px solid #5a3010;}
  .tbadge.exp{background:#2a0a0a;color:var(--danger);border:1px solid #5a1010;}
  body.light .tbadge.warn{background:#fff7ed;border-color:#fed7aa;}
  body.light .tbadge.exp{background:#fef2f2;border-color:#fecaca;}
  .pbar{height:4px;border-radius:2px;background:var(--border);overflow:hidden;}
  .pfill{height:100%;border-radius:2px;transition:width .5s;background:var(--accent);}
  .pfill.warn{background:var(--warn)}.pfill.exp{background:var(--danger);width:100%!important;}

  .btn{width:100%;padding:13px;border-radius:10px;border:none;cursor:pointer;font-size:14px;font-weight:700;font-family:'Sora',sans-serif;background:var(--accent);color:#fff;transition:opacity .15s,transform .1s;}
  .btn:hover{opacity:.9}.btn:active{transform:scale(.98)}.btn:disabled{opacity:.4;cursor:not-allowed;}
  .btn.sec{background:transparent;color:var(--text);border:1px solid var(--border);margin-top:8px;}
  .btn.warn-btn{background:transparent;color:var(--warn);border:1px solid var(--warn);}
  .donate-btn{width:100%;padding:14px 8px;border-radius:12px;border:2px solid var(--sbd);background:var(--sbg);color:var(--accent);font-size:14px;font-weight:700;cursor:pointer;font-family:'Sora',sans-serif;transition:all .15s;}
  .donate-btn:hover{border-color:var(--accent);opacity:.9;}
  .offer-btn{width:100%;padding:14px;border-radius:12px;border:1px solid var(--border);background:var(--surface);color:var(--text);font-size:13px;font-weight:700;cursor:pointer;font-family:'Sora',sans-serif;transition:all .15s;}
  .offer-btn:disabled{opacity:.4;cursor:not-allowed;}

  .evt{background:var(--surface);border:1px solid var(--border);border-radius:10px;padding:11px 13px;margin-bottom:8px;}
  .evt-badge{font-size:9px;font-weight:700;padding:2px 8px;border-radius:10px;text-transform:uppercase;letter-spacing:.05em;display:inline-block;margin-bottom:5px;}
  .evt-title{font-size:13px;font-weight:700;margin-bottom:2px;}
  .evt-meta{font-size:11px;color:var(--muted);}
  .evt-desc{font-size:11px;color:var(--muted);margin-top:3px;line-height:1.5;}

  .post{background:var(--surface);border:1px solid var(--border);border-left:3px solid var(--accent);border-radius:10px;padding:11px 13px;margin-bottom:8px;}
  .post-cat{font-size:9px;font-weight:700;margin-bottom:3px;}
  .post-title{font-size:13px;font-weight:700;margin-bottom:3px;}
  .post-body{font-size:11px;color:var(--muted);line-height:1.6;}
  .post-date{font-size:10px;color:var(--muted);margin-top:4px;}

  .admin{padding:16px;max-width:700px;margin:0 auto;}
  .stats{display:grid;grid-template-columns:repeat(2,1fr);gap:10px;margin-bottom:16px;}
  .stat{background:var(--card);border:1px solid var(--border);border-radius:12px;padding:13px 15px;}
  .slbl{font-size:10px;color:var(--muted);text-transform:uppercase;letter-spacing:.06em;margin-bottom:5px;}
  .sval{font-size:26px;font-weight:700;font-family:'DM Mono',monospace;}
  .sval.g{color:var(--accent)}.sval.b{color:var(--accent2)}.sval.o{color:var(--warn)}.sval.r{color:var(--danger)}

  .tabs{display:flex;gap:6px;margin-bottom:14px;flex-wrap:wrap;}
  .tab{padding:5px 12px;border-radius:20px;border:1px solid;font-size:11px;font-weight:700;cursor:pointer;font-family:'Sora',sans-serif;transition:all .15s;white-space:nowrap;}
  .sec-lbl{font-size:10px;color:var(--muted);text-transform:uppercase;letter-spacing:.06em;margin-bottom:10px;}

  .ucards{display:flex;flex-direction:column;gap:10px;}
  .uc{background:var(--card);border:1px solid var(--border);border-radius:12px;padding:13px;transition:border-color .15s;}
  .uc:hover{border-color:var(--accent);}
  .uc-top{display:flex;align-items:center;justify-content:space-between;margin-bottom:10px;}
  .uc-name{font-size:14px;font-weight:700;}.uc-unit{font-size:11px;color:var(--muted);margin-top:1px;}
  .spill{display:inline-flex;align-items:center;gap:4px;font-size:10px;font-weight:700;padding:3px 9px;border-radius:20px;letter-spacing:.04em;white-space:nowrap;}
  .spill::before{content:'';width:5px;height:5px;border-radius:50%;background:currentColor;flex-shrink:0;}
  .sp-active{color:var(--accent);background:var(--sbg);border:1px solid var(--sbd);}
  .sp-expired{color:var(--danger);background:#fef2f2;border:1px solid #fecaca;}
  .sp-paid{color:var(--accent2);background:#eff6ff;border:1px solid #bfdbfe;}
  body:not(.light) .sp-expired{background:#1a0b0b;border-color:#3a1e1e;}
  body:not(.light) .sp-paid{background:#0a1520;border-color:#1a2f50;}

  .ugrid{display:grid;grid-template-columns:1fr 1fr;gap:7px 10px;margin-bottom:10px;}
  .ufl{font-size:9px;color:var(--muted);text-transform:uppercase;letter-spacing:.05em;margin-bottom:2px;}
  .ufv{font-size:11px;font-weight:500;}.ufv.mono{font-family:'DM Mono',monospace;font-size:10px;color:var(--muted);}
  .ubar-row{margin-bottom:9px;}
  .ubar-top{display:flex;justify-content:space-between;margin-bottom:4px;}
  .ubar-lbl{font-size:9px;color:var(--muted);text-transform:uppercase;letter-spacing:.05em;}
  .ubar-val{font-size:10px;font-family:'DM Mono',monospace;color:var(--muted);}
  .ubar{height:4px;border-radius:2px;background:var(--border);overflow:hidden;}
  .ufill{height:100%;border-radius:2px;background:var(--accent);transition:width .4s;}
  .ufill.full{background:var(--danger);}
  .uactions{display:flex;gap:8px;}
  .abtn{flex:1;font-size:11px;font-weight:700;padding:7px 0;border-radius:8px;border:none;cursor:pointer;font-family:'Sora',sans-serif;transition:opacity .15s;}
  .abtn:hover{opacity:.8;}
  .abtn-g{background:var(--sbg);color:var(--accent);border:1px solid var(--sbd);}
  .abtn-r{background:#fef2f2;color:var(--danger);border:1px solid #fecaca;}
  body:not(.light) .abtn-r{background:#2a0a0a;border-color:#5a1a1a;}

  .aform{background:var(--card);border:1px solid var(--border);border-radius:12px;padding:14px;margin-bottom:12px;}
  .finput{flex:1;min-width:100px;padding:8px 11px;border-radius:8px;border:1px solid var(--border);background:var(--surface);color:var(--text);font-size:12px;font-family:'Sora',sans-serif;outline:none;}
  .finput:focus{border-color:var(--accent);}
  .fsel{padding:8px 11px;border-radius:8px;border:1px solid var(--border);background:var(--surface);color:var(--text);font-size:12px;font-family:'Sora',sans-serif;outline:none;}
  .fta{width:100%;padding:8px 11px;border-radius:8px;border:1px solid var(--border);background:var(--surface);color:var(--text);font-size:12px;font-family:'Sora',sans-serif;outline:none;resize:vertical;min-height:56px;}

  .mcard{background:var(--card);border:1px solid var(--border);border-radius:12px;padding:13px;margin-bottom:10px;}
  .mst{font-size:10px;font-weight:700;padding:3px 9px;border-radius:20px;text-transform:uppercase;letter-spacing:.05em;}
  .mst-new{background:#fef2f2;color:var(--danger);border:1px solid #fecaca;}
  .mst-in_progress{background:#fff7ed;color:var(--warn);border:1px solid #fed7aa;}
  .mst-resolved{background:var(--sbg);color:var(--accent);border:1px solid var(--sbd);}
  body:not(.light) .mst-new{background:#1a0b0b;border-color:#3a1e1e;}
  body:not(.light) .mst-in_progress{background:#1a1000;border-color:#4a2e00;}

  .toast{position:fixed;bottom:24px;left:50%;transform:translateX(-50%);background:var(--accent);color:#fff;padding:10px 20px;border-radius:8px;font-size:13px;font-weight:700;z-index:999;animation:tIn .3s ease;white-space:nowrap;}
  @keyframes tIn{from{opacity:0;transform:translateX(-50%) translateY(10px)}to{opacity:1;transform:translateX(-50%) translateY(0)}}
  @keyframes shake{0%,100%{transform:translateX(0)}20%{transform:translateX(-8px)}40%{transform:translateX(8px)}60%{transform:translateX(-5px)}80%{transform:translateX(5px)}}

  @media(max-width:600px){
    .stats{grid-template-columns:repeat(2,1fr);}
    .card{padding:18px 14px;}
    .nav-name{display:none;}
  }
`;

function Logo({ size=32 }) {
  return <img src={CHURCH_LOGO} alt="BGT" style={{height:size,width:"auto",objectFit:"contain",flexShrink:0}}/>;
}

function Scripture() {
  const s = SCRIPTURES[new Date().getDay() % SCRIPTURES.length];
  return (
    <div className="scr">
      <div className="scr-v">"{s.verse}"</div>
      <div className="scr-r">{s.ref}</div>
    </div>
  );
}

function EventsList({ events }) {
  if (!events.length) return <div style={{fontSize:12,color:"var(--muted)",textAlign:"center",padding:"10px 0"}}>No upcoming events</div>;
  return (
    <div>
      {events.slice(0,5).map(e => {
        const col = EVT_COLOR[e.category] || "#64748b";
        return (
          <div className="evt" key={e.id}>
            <span className="evt-badge" style={{background:col+"22",color:col,border:`1px solid ${col}44`}}>{e.category}</span>
            <div className="evt-title">{e.title}</div>
            <div className="evt-meta">{e.date} · {e.time}</div>
            {e.desc && <div className="evt-desc">{e.desc}</div>}
          </div>
        );
      })}
    </div>
  );
}

function VenmoScreen({ onBack, onCodeEntry }) {
  const [amt, setAmt] = useState("");
  const v = parseFloat(amt)||0, days = v>0?Math.floor(v/0.5):0;
  const mo=Math.floor(days/30),rem=days%30,wk=Math.floor(rem/7),dy=rem%7;
  const parts=[]; if(mo) parts.push(`${mo} month${mo>1?"s":""}`); if(wk) parts.push(`${wk} week${wk>1?"s":""}`); if(dy) parts.push(`${dy} day${dy>1?"s":""}`);
  const tLabel = parts.join(" + ");
  return (
    <div className="wrap">
      <div className="card">
        <button onClick={onBack} style={{background:"none",border:"none",color:"var(--muted)",fontSize:13,cursor:"pointer",marginBottom:12,padding:0,fontFamily:"'Sora',sans-serif"}}>← Back</button>
        <div style={{fontSize:21,marginBottom:6}}>📱</div>
        <div style={{fontSize:19,fontWeight:700,marginBottom:4}}>Venmo or Cash App</div>
        <div style={{fontSize:13,color:"var(--muted)",marginBottom:14,lineHeight:1.6}}>Send any amount — your code arrives automatically within 2 minutes.</div>

        <div style={{background:"var(--surface)",border:"1px solid var(--border)",borderRadius:12,padding:13,marginBottom:14}}>
          <div style={{fontSize:10,color:"var(--muted)",textTransform:"uppercase",letterSpacing:".06em",marginBottom:8}}>How much are you sending?</div>
          <div style={{display:"flex",alignItems:"center",gap:6,marginBottom:10}}>
            <span style={{fontSize:24,fontWeight:700,color:"var(--accent)",fontFamily:"'DM Mono',monospace"}}>$</span>
            <input type="number" min="1" step="1" value={amt} onChange={e=>setAmt(e.target.value)} placeholder="0"
              style={{flex:1,background:"var(--bg)",border:"2px solid var(--border)",borderRadius:8,padding:"10px 12px",fontSize:24,fontWeight:700,fontFamily:"'DM Mono',monospace",color:"var(--text)",outline:"none",width:"100%"}}/>
          </div>
          <div style={{display:"flex",gap:5,marginBottom:12}}>
            {[1,5,10,15,30].map(n=>(
              <button key={n} onClick={()=>setAmt(String(n))} style={{flex:1,padding:"6px 0",borderRadius:7,border:"1px solid",fontSize:11,fontWeight:700,cursor:"pointer",fontFamily:"'DM Mono',monospace",
                background:amt===String(n)?"var(--accent)":"var(--surface)",color:amt===String(n)?"#fff":"var(--muted)",borderColor:amt===String(n)?"var(--accent)":"var(--border)",transition:"all .15s"}}>${n}</button>
            ))}
          </div>
          <div style={{background:days>0?"var(--sbg)":"var(--bg)",border:`1px solid ${days>0?"var(--sbd)":"var(--border)"}`,borderRadius:8,padding:"12px",textAlign:"center",minHeight:46,display:"flex",alignItems:"center",justifyContent:"center",transition:"all .25s"}}>
            {days>0
              ? <div><div style={{fontSize:10,color:"var(--muted)",marginBottom:3}}>YOU GET</div><div style={{fontSize:17,fontWeight:700,color:"var(--accent)",fontFamily:"'DM Mono',monospace"}}>{tLabel}</div><div style={{fontSize:10,color:"var(--muted)",marginTop:2}}>{days} days · $0.50/day</div></div>
              : <div style={{fontSize:12,color:"var(--muted)"}}>Enter an amount to see your time</div>
            }
          </div>
        </div>

        <div style={{display:"flex",flexDirection:"column",gap:7,marginBottom:13}}>
          {[{lbl:"VENMO",handle:"@ChurchWiFi",col:"var(--accent2)"},{lbl:"CASH APP",handle:"$ChurchWiFi",col:"var(--accent)"}].map(p=>(
            <div key={p.lbl} style={{background:"var(--bg)",borderRadius:9,padding:"10px 13px",display:"flex",justifyContent:"space-between",alignItems:"center"}}>
              <div><div style={{fontSize:9,color:"var(--muted)",marginBottom:2}}>{p.lbl}</div><div style={{fontSize:16,fontWeight:700,color:p.col,fontFamily:"'DM Mono',monospace"}}>{p.handle}</div></div>
              <div style={{fontSize:10,color:"var(--muted)"}}>Note: your unit #</div>
            </div>
          ))}
        </div>
        <div style={{background:"var(--surface)",border:"1px solid var(--border)",borderRadius:8,padding:"9px 12px",marginBottom:13}}>
          <div style={{fontSize:9,color:"var(--muted)",marginBottom:3}}>EXAMPLE NOTE</div>
          <div style={{fontSize:14,fontWeight:700,color:"var(--text)",fontFamily:"'DM Mono',monospace"}}>Unit 7</div>
          <div style={{fontSize:11,color:"var(--muted)",marginTop:2}}>That's all — code goes to the email on file for your unit.</div>
        </div>
        <button className="btn" onClick={onCodeEntry} style={{fontSize:13,padding:"12px"}}>I sent payment — enter my code →</button>
        <div style={{fontSize:11,color:"var(--muted)",textAlign:"center",marginTop:9}}>No code after 5 min? Call <strong style={{color:"var(--text)"}}>555-123-4567</strong></div>
      </div>
    </div>
  );
}

function CardScreen({ onBack, plans, onSuccess }) {
  const [sel, setSel]   = useState(plans[0].id);
  const [paying, setPay]= useState(false);
  const plan = plans.find(p=>p.id===sel);
  function pay(){ setPay(true); setTimeout(()=>{ setPay(false); onSuccess(plan); },1800); }
  return (
    <div className="wrap">
      <div className="card">
        <button onClick={onBack} style={{background:"none",border:"none",color:"var(--muted)",fontSize:13,cursor:"pointer",marginBottom:12,padding:0,fontFamily:"'Sora',sans-serif"}}>← Back</button>
        <div style={{fontSize:21,marginBottom:6}}>💳</div>
        <div style={{fontSize:19,fontWeight:700,marginBottom:4}}>Apple Pay or Card</div>
        <div style={{fontSize:13,color:"var(--muted)",marginBottom:14,lineHeight:1.6}}>Pick your plan. Instant access, no account needed.</div>
        <div style={{display:"flex",flexDirection:"column",gap:8,marginBottom:14}}>
          {plans.map(p=>(
            <div key={p.id} onClick={()=>setSel(p.id)} style={{border:`2px solid ${sel===p.id?"var(--accent)":"var(--border)"}`,background:sel===p.id?"var(--sbg)":"var(--surface)",borderRadius:12,padding:"12px 14px",cursor:"pointer",display:"flex",alignItems:"center",justifyContent:"space-between",transition:"all .15s"}}>
              <div style={{display:"flex",alignItems:"center",gap:10}}>
                <div style={{width:18,height:18,borderRadius:"50%",flexShrink:0,border:`2px solid ${sel===p.id?"var(--accent)":"var(--muted)"}`,background:sel===p.id?"var(--accent)":"transparent",display:"flex",alignItems:"center",justifyContent:"center"}}>
                  {sel===p.id&&<div style={{width:7,height:7,borderRadius:"50%",background:"#fff"}}/>}
                </div>
                <div><div style={{fontSize:15,fontWeight:700}}>{p.label}</div><div style={{fontSize:11,color:"var(--muted)"}}>{p.hours<48?p.hours+"h":p.hours<200?"7 days":"30 days"}</div></div>
              </div>
              <div style={{fontSize:20,fontWeight:700,fontFamily:"'DM Mono',monospace",color:"var(--accent)"}}>${p.price.toFixed(2)}</div>
            </div>
          ))}
        </div>
        <button onClick={pay} disabled={paying} style={{width:"100%",padding:"14px",borderRadius:12,border:"none",background:"#fff",color:"#000",fontSize:15,fontWeight:700,cursor:"pointer",marginBottom:8,display:"flex",alignItems:"center",justifyContent:"center",gap:7,fontFamily:"'Sora',sans-serif",opacity:paying?.5:1,transition:"opacity .15s"}}>
          <span style={{fontSize:18}}></span>{paying?"Processing…":`Pay $${plan.price.toFixed(2)} with Apple Pay`}
        </button>
        <div style={{display:"flex",alignItems:"center",gap:8,marginBottom:8}}><div style={{flex:1,height:1,background:"var(--border)"}}/><span style={{fontSize:10,color:"var(--muted)"}}>or card</span><div style={{flex:1,height:1,background:"var(--border)"}}/></div>
        <button className="btn" onClick={pay} disabled={paying} style={{fontSize:13,padding:"12px"}}>{paying?"Processing…":`Pay $${plan.price.toFixed(2)} with Card →`}</button>
        <div style={{display:"flex",alignItems:"center",justifyContent:"center",gap:5,marginTop:10,fontSize:10,color:"var(--muted)"}}><span>🔒</span><span>Square · Nonprofit rate · No account needed</span></div>
        <div style={{fontSize:11,color:"var(--muted)",textAlign:"center",marginTop:7}}>💚 Payments go directly to Bradenton Gospel Tabernacle</div>
      </div>
    </div>
  );
}

function VoucherScreen({ onBack, onSuccess }) {
  const [code, setCode]   = useState("");
  const [err,  setErr]    = useState("");
  const [act,  setAct]    = useState(false);
  const [scan, setScan]   = useState(false);
  const vidRef  = useRef(null);
  const strmRef = useRef(null);
  const inpRef  = useRef(null);

  function stopCam(){ if(strmRef.current){strmRef.current.getTracks().forEach(t=>t.stop());strmRef.current=null;} setScan(false); }
  useEffect(()=>{ return ()=>stopCam(); },[]);

  function tryCode(c){
    const v=c.trim().toUpperCase();
    if(v.length<CODE_LENGTH) return;
    if(VALID_CODES[v]){ setAct(true); setTimeout(()=>{ setAct(false); onSuccess(VALID_CODES[v]); },900); }
    else setErr("Code not recognized. Double-check and try again.");
  }
  function onChange(val){
    const cl=val.toUpperCase().replace(/[^A-Z0-9]/g,"").slice(0,CODE_LENGTH);
    setCode(cl); setErr("");
    if(cl.length===CODE_LENGTH) tryCode(cl);
  }
  async function startScan(){
    setScan(true);
    try{
      const s=await navigator.mediaDevices.getUserMedia({video:{facingMode:"environment"}});
      strmRef.current=s; if(vidRef.current) vidRef.current.srcObject=s;
      setTimeout(()=>{ stopCam(); const dc="CHURCH24"; setCode(dc); setAct(true); setTimeout(()=>{setAct(false);onSuccess(VALID_CODES[dc]);},900); },2500);
    }catch{ setScan(false); setErr("Camera unavailable — type your code instead."); }
  }

  return (
    <div className="wrap">
      <div className="card">
        <button onClick={onBack} style={{background:"none",border:"none",color:"var(--muted)",fontSize:13,cursor:"pointer",marginBottom:12,padding:0,fontFamily:"'Sora',sans-serif"}}>← Back</button>
        <div style={{fontSize:21,marginBottom:6}}>🏷️</div>
        <div style={{fontSize:19,fontWeight:700,marginBottom:4}}>Enter Your Code</div>
        <div style={{fontSize:13,color:"var(--muted)",marginBottom:14,lineHeight:1.6}}>Paste, type, or scan. Auto-activates on last character.</div>

        {act && <div style={{textAlign:"center",padding:"22px 0",animation:"fadeUp .2s ease"}}><div style={{fontSize:38,marginBottom:10}}>⚡</div><div style={{fontSize:17,fontWeight:700,color:"var(--accent)"}}>Activating…</div></div>}

        {!act && !scan && <>
          <div style={{position:"relative",marginBottom:8}}>
            <input ref={inpRef} value={code} onChange={e=>onChange(e.target.value)}
              onPaste={e=>{ e.preventDefault(); const p=e.clipboardData.getData("text").trim().toUpperCase().replace(/[^A-Z0-9]/g,"").slice(0,CODE_LENGTH); onChange(p); }}
              placeholder="CHURCH24" maxLength={CODE_LENGTH} autoCapitalize="characters" autoCorrect="off" spellCheck={false}
              style={{width:"100%",padding:"17px 14px",borderRadius:12,border:`2px solid ${err?"var(--danger)":"var(--border)"}`,background:"var(--surface)",color:"var(--text)",fontSize:24,fontFamily:"'DM Mono',monospace",fontWeight:700,textAlign:"center",letterSpacing:".12em",outline:"none",transition:"border-color .2s",boxSizing:"border-box"}}/>
            <div style={{position:"absolute",bottom:-15,left:0,right:0,display:"flex",justifyContent:"center",gap:4}}>
              {Array.from({length:CODE_LENGTH}).map((_,i)=>(
                <div key={i} style={{width:5,height:5,borderRadius:"50%",background:i<code.length?"var(--accent)":"var(--border)",transition:"background .1s"}}/>
              ))}
            </div>
          </div>
          {err && <div style={{fontSize:12,color:"var(--danger)",textAlign:"center",marginTop:18,marginBottom:4}}>⚠ {err}</div>}
          <div style={{display:"flex",gap:8,marginTop:20,marginBottom:14}}>
            <button onClick={async()=>{ try{const t=await navigator.clipboard.readText();onChange(t);}catch{inpRef.current?.focus();} }} style={{flex:1,padding:"10px 6px",borderRadius:10,border:"1px solid var(--border)",background:"var(--surface)",color:"var(--text)",fontSize:12,fontWeight:700,cursor:"pointer",fontFamily:"'Sora',sans-serif",display:"flex",alignItems:"center",justifyContent:"center",gap:5}}>📋 Paste</button>
            <button onClick={startScan} style={{flex:1,padding:"10px 6px",borderRadius:10,border:"1px solid var(--accent)",background:"var(--sbg)",color:"var(--accent)",fontSize:12,fontWeight:700,cursor:"pointer",fontFamily:"'Sora',sans-serif",display:"flex",alignItems:"center",justifyContent:"center",gap:5}}>📷 Scan QR</button>
          </div>
          <div style={{background:"var(--surface)",border:"1px solid var(--border)",borderRadius:8,padding:"9px 12px",fontSize:11,color:"var(--muted)",lineHeight:1.6}}>
            <strong style={{color:"var(--text)"}}>Demo codes:</strong> CHURCH24 · BLESS724 · GRACE301
          </div>
        </>}

        {scan && !act && (
          <div style={{textAlign:"center"}}>
            <div style={{borderRadius:14,overflow:"hidden",border:"2px solid var(--accent)",marginBottom:12,position:"relative",background:"#000",aspectRatio:"1"}}>
              <video ref={vidRef} autoPlay playsInline muted style={{width:"100%",height:"100%",objectFit:"cover"}}/>
              <div style={{position:"absolute",inset:0,display:"flex",alignItems:"center",justifyContent:"center"}}>
                <div style={{width:"55%",height:"55%",border:"3px solid var(--accent)",borderRadius:10,boxShadow:"0 0 0 9999px rgba(0,0,0,.45)"}}/>
              </div>
              <div style={{position:"absolute",bottom:12,left:0,right:0,fontSize:11,color:"#fff",textAlign:"center",fontWeight:600}}>Point camera at QR code</div>
            </div>
            <div style={{fontSize:11,color:"var(--muted)",marginBottom:10}}>Demo: auto-reads in 2.5 sec</div>
            <button onClick={stopCam} style={{padding:"8px 20px",borderRadius:8,border:"1px solid var(--border)",background:"transparent",color:"var(--muted)",cursor:"pointer",fontSize:12,fontFamily:"'Sora',sans-serif"}}>Cancel</button>
          </div>
        )}
      </div>
    </div>
  );
}

function TenantPortal({ events, posts }) {
  const DS = 4;
  const [secs,    setSecs]    = useState(DS);
  const [expired, setExpired] = useState(false);
  const [payM,    setPayM]    = useState(null);
  const [okPlan,  setOkPlan]  = useState(null);
  const [mOpen,   setMOpen]   = useState(false);
  const [mUnit,   setMUnit]   = useState("Unit 1");
  const [mCat,    setMCat]    = useState("general");
  const [mMsg,    setMMsg]    = useState("");
  const [mSent,   setMSent]   = useState(false);
  const { addMaint } = useContext(AppCtx);
  const tmr = useRef(null);

  useEffect(()=>{
    tmr.current = setInterval(()=>{
      setSecs(s=>{ if(s<=1){ clearInterval(tmr.current); setExpired(true); return 0; } return s-1; });
    },1000);
    return ()=>clearInterval(tmr.current);
  },[]);

  const mm=Math.floor(secs/60), ss=String(secs%60).padStart(2,"0");
  const pct=Math.min(100,((DS-secs)/DS)*100);
  const td=`${mm}:${ss}`;
  const tstate = expired?"exp":secs<5?"warn":"active";

  function reset(){ setPayM(null); }
  function submitMaint(){
    if(!mMsg.trim()) return;
    addMaint({unit:mUnit,category:mCat,message:mMsg.trim(),date:"Just now",status:"new"});
    setMSent(true); setMMsg("");
    setTimeout(()=>{ setMOpen(false); setMSent(false); },2500);
  }

  if(payM==="voucher") return <VoucherScreen onBack={reset} onSuccess={plan=>{ setOkPlan(PLANS.find(p=>p.id===plan)||PLANS[0]); setExpired(false); setSecs(DS*10); reset(); }}/>;
  if(payM==="venmo")   return <VenmoScreen   onBack={reset} onCodeEntry={()=>setPayM("voucher")}/>;
  if(payM==="card")    return <CardScreen     onBack={reset} plans={PLANS} onSuccess={plan=>{ setOkPlan(plan); setExpired(false); setSecs(DS*10); reset(); }}/>;

  return (
    <div className="wrap" style={{alignItems:"flex-start"}}>
      <div className="card">
        <div style={{display:"flex",alignItems:"center",gap:10,marginBottom:14}}>
          <Logo size={38}/>
          <div><div style={{fontSize:14,fontWeight:700}}>Bradenton Gospel Tabernacle</div><div style={{fontSize:11,color:"var(--muted)"}}>Resident WiFi Portal</div></div>
        </div>
        <Scripture/>

        <div className="tblock" style={{border:`1px solid ${expired&&!okPlan?"var(--danger)":okPlan?"var(--sbd)":"var(--border)"}`,background:expired&&!okPlan?"#1a0505":okPlan?"var(--sbg)":"var(--surface)",transition:"all .4s"}}>

          {!expired && !okPlan && <>
            <div className="tlbl">Your Free Session — Connected Automatically</div>
            <div className="trow">
              <div className={`tval mono ${tstate}`}>{td}</div>
              <div className={`tbadge ${tstate}`}>{tstate==="warn"?"Ending Soon":"Connected ✓"}</div>
            </div>
            <div className="pbar"><div className={`pfill ${tstate}`} style={{width:`${pct}%`}}/></div>
            <div style={{fontSize:11,color:"var(--muted)",marginTop:8,textAlign:"center"}}>Close this page and browse freely — payment screen will appear here when time runs out.</div>
          </>}

          {okPlan && <>
            <div className="tlbl">Paid Session Active</div>
            <div className="trow">
              <div className="tval mono active">✓ Online</div>
              <div className="tbadge active">Paid · {okPlan.label}</div>
            </div>
            <div className="pbar"><div className="pfill" style={{width:"100%"}}/></div>
            <div style={{fontSize:11,color:"var(--stx)",marginTop:8,textAlign:"center"}}>
              {okPlan.id==="day"?"24 hours":okPlan.id==="week"?"7 days":"30 days"} of WiFi active. 💚 Thank you for supporting BGT.
            </div>
            <button onClick={()=>{setOkPlan(null);setExpired(false);setSecs(DS);}} style={{marginTop:10,width:"100%",padding:"8px",borderRadius:8,border:"1px solid var(--sbd)",background:"transparent",color:"var(--stx)",fontSize:11,cursor:"pointer",fontFamily:"'Sora',sans-serif"}}>↩ Restart Demo</button>
          </>}

          {expired && !okPlan && <>
            <div className="tlbl" style={{color:"var(--danger)"}}>⏰ Your free time is up — choose how to continue</div>
            <div style={{display:"flex",flexDirection:"column",gap:8,marginTop:8}}>
              {[
                {m:"voucher",icon:"🏷️",title:"Voucher Code",     sub:"Got a paper code? Enter it.",       bd:"var(--accent)", bg:"var(--sbg)",    col:"var(--accent)"},
                {m:"venmo",  icon:"📱",title:"Venmo / Cash App", sub:"Send any amount — auto code.",      bd:"var(--border)", bg:"var(--surface)",col:"var(--text)"},
                {m:"card",   icon:"💳",title:"Apple Pay / Card", sub:"Instant access via Square.",        bd:"var(--border)", bg:"var(--surface)",col:"var(--text)"},
              ].map(b=>(
                <button key={b.m} onClick={()=>setPayM(b.m)} style={{background:b.bg,border:`2px solid ${b.bd}`,borderRadius:11,padding:"12px 14px",cursor:"pointer",textAlign:"left",width:"100%",display:"flex",alignItems:"center",gap:12,transition:"all .15s"}}>
                  <span style={{fontSize:26,flexShrink:0}}>{b.icon}</span>
                  <div><div style={{fontSize:14,fontWeight:700,color:b.col,fontFamily:"'Sora',sans-serif"}}>{b.title}</div><div style={{fontSize:11,color:"var(--muted)",marginTop:1,fontFamily:"'Sora',sans-serif"}}>{b.sub}</div></div>
                </button>
              ))}
            </div>
            <div style={{fontSize:10,color:"var(--muted)",textAlign:"center",marginTop:10}}>💚 Payments go directly to Bradenton Gospel Tabernacle · Call 555-123-4567 for help</div>
          </>}
        </div>

        {!expired && !okPlan && (
          <div style={{background:"var(--surface)",border:"1px solid var(--border)",borderRadius:12,padding:"11px 13px",marginBottom:12}}>
            <div style={{fontSize:10,color:"var(--muted)",textTransform:"uppercase",letterSpacing:".06em",marginBottom:8}}>Need more time? Plans start at</div>
            <div style={{display:"flex",gap:7}}>
              {PLANS.map(p=>(
                <div key={p.id} style={{flex:1,textAlign:"center",background:"var(--bg)",borderRadius:8,padding:"8px 4px"}}>
                  <div style={{fontSize:17,fontWeight:700,color:"var(--accent)",fontFamily:"'DM Mono',monospace"}}>${p.price.toFixed(2)}</div>
                  <div style={{fontSize:10,color:"var(--muted)",marginTop:2}}>{p.label}</div>
                </div>
              ))}
            </div>
          </div>
        )}

        {events.length>0 && <>
          <div style={{fontSize:10,color:"var(--muted)",textTransform:"uppercase",letterSpacing:".06em",marginBottom:8}}>📅 Church Events & News</div>
          <EventsList events={events}/>
        </>}

        {posts.length>0 && <>
          <div style={{fontSize:10,color:"var(--muted)",textTransform:"uppercase",letterSpacing:".06em",margin:"12px 0 8px"}}>🏠 Community Board</div>
          {posts.slice(0,3).map(p=>{
            const cat=TENANT_CATS.find(c=>c.id===p.category);
            return (
              <div className="post" key={p.id} style={{borderLeftColor:cat?.color||"var(--accent)"}}>
                <div className="post-cat" style={{color:cat?.color||"var(--accent)"}}>{cat?.label||p.category}</div>
                <div className="post-title">{p.title}</div>
                <div className="post-body">{p.body}</div>
                <div className="post-date">{p.date}</div>
              </div>
            );
          })}
        </>}

        {!mOpen && !mSent && (
          <button className="btn warn-btn" onClick={()=>setMOpen(true)} style={{fontSize:12,padding:"10px",marginTop:8,marginBottom:6}}>🔧 Submit Maintenance Request</button>
        )}
        {mSent && <div style={{background:"var(--sbg)",border:"1px solid var(--sbd)",borderRadius:10,padding:"9px 13px",marginBottom:6,fontSize:12,color:"var(--accent)",textAlign:"center",fontWeight:600}}>✓ Request submitted! We will be in touch soon.</div>}
        {mOpen && !mSent && (
          <div className="aform" style={{marginTop:8,marginBottom:6}}>
            <div style={{fontSize:13,fontWeight:700,marginBottom:10}}>🔧 Maintenance Request</div>
            <div style={{display:"flex",gap:7,marginBottom:8}}>
              <select className="fsel" value={mUnit} onChange={e=>setMUnit(e.target.value)} style={{flex:1}}>
                {UNITS.map(u=><option key={u}>{u}</option>)}
              </select>
              <select className="fsel" value={mCat} onChange={e=>setMCat(e.target.value)}>
                {MAINT_CATS.map(c=><option key={c} value={c}>{c}</option>)}
              </select>
            </div>
            <textarea className="fta" placeholder="Describe the issue…" value={mMsg} onChange={e=>setMMsg(e.target.value)} style={{marginBottom:8}}/>
            <div style={{display:"flex",gap:7}}>
              <button className="btn" onClick={submitMaint} style={{fontSize:12,padding:"9px"}}>Send Request</button>
              <button className="btn sec" onClick={()=>setMOpen(false)} style={{fontSize:12,padding:"9px",marginTop:0}}>Cancel</button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

function GuestPortal({ events }) {
  const DS = 4;
  const [secs,    setSecs]    = useState(DS);
  const [expired, setExpired] = useState(false);
  const [payM,    setPayM]    = useState(null);
  const [offUsed, setOffUsed] = useState(false);
  const [okMsg,   setOkMsg]   = useState("");
  const tmr = useRef(null);

  useEffect(()=>{
    tmr.current = setInterval(()=>{
      setSecs(s=>{ if(s<=1){ clearInterval(tmr.current); setExpired(true); return 0; } return s-1; });
    },1000);
    return ()=>clearInterval(tmr.current);
  },[]);

  const mm=Math.floor(secs/60), ss=String(secs%60).padStart(2,"0"), td=`${mm}:${ss}`;
  const pct=Math.min(100,((DS-secs)/DS)*100);
  const tstate=expired?"exp":secs<5?"warn":"active";
  function reset(){ setPayM(null); }

  if(payM==="venmo")   return <VenmoScreen  onBack={reset} onCodeEntry={()=>setPayM("voucher")}/>;
  if(payM==="voucher") return <VoucherScreen onBack={reset} onSuccess={()=>{ setOkMsg("donation"); setExpired(false); setSecs(DS*10); reset(); }}/>;
  if(payM==="card")    return <CardScreen    onBack={reset} plans={DONATION_PLANS} onSuccess={()=>{ setOkMsg("donation"); setExpired(false); setSecs(DS*10); reset(); }}/>;

  return (
    <div className="wrap" style={{alignItems:"flex-start"}}>
      <div className="card">
        <div style={{textAlign:"center",marginBottom:14}}>
          <Logo size={52}/>
          <div style={{fontSize:16,fontWeight:700,marginTop:8}}>Bradenton Gospel Tabernacle</div>
          <div style={{fontSize:12,color:"var(--muted)",marginTop:3}}>Welcome, friend — we're glad you're here. 🕊️</div>
        </div>
        <Scripture/>

        <div className="tblock" style={{border:`1px solid ${expired&&!okMsg?"var(--danger)":okMsg?"var(--sbd)":"var(--border)"}`,background:expired&&!okMsg?"#1a0505":okMsg?"var(--sbg)":"var(--surface)",transition:"all .4s"}}>

          {!expired && !okMsg && <>
            <div className="tlbl">Your Free Guest Session — Connected</div>
            <div className="trow">
              <div className={`tval mono ${tstate}`}>{td}</div>
              <div className={`tbadge ${tstate}`}>{tstate==="warn"?"Ending Soon":"Connected ✓"}</div>
            </div>
            <div className="pbar"><div className={`pfill ${tstate}`} style={{width:`${pct}%`}}/></div>
            <div style={{fontSize:11,color:"var(--muted)",marginTop:8,textAlign:"center"}}>You're online — close this page and browse freely.</div>
          </>}

          {okMsg && <>
            <div className="tlbl">{okMsg==="offering"?"🙏 Offering Extension":"💚 Thank You for Giving!"}</div>
            <div className="trow">
              <div className="tval mono active">{okMsg==="offering"?"+30 min":"✓ Online"}</div>
              <div className="tbadge active">{okMsg==="offering"?"Extended":"Gave"}</div>
            </div>
            <div className="pbar"><div className="pfill" style={{width:"100%"}}/></div>
            <div style={{fontSize:11,color:"var(--stx)",marginTop:8,textAlign:"center"}}>
              {okMsg==="offering"
                ? "Your WiFi is extended. We look forward to seeing you at the offering 🙏"
                : "Your gift goes directly to BGT. God bless you! 💚"}
            </div>
            <button onClick={()=>{setOkMsg("");setExpired(false);setSecs(DS);}} style={{marginTop:10,width:"100%",padding:"8px",borderRadius:8,border:"1px solid var(--sbd)",background:"transparent",color:"var(--stx)",fontSize:11,cursor:"pointer",fontFamily:"'Sora',sans-serif"}}>↩ Restart Demo</button>
          </>}

          {expired && !okMsg && <>
            <div className="tlbl" style={{color:"var(--danger)"}}>⏰ Your free session has ended</div>
            <div style={{fontSize:12,color:"var(--muted)",marginBottom:10,lineHeight:1.5}}>
              Blessed to have you with us. If you'd like to give back to the church, any amount is appreciated. 🙏
            </div>

            <div style={{display:"grid",gridTemplateColumns:"repeat(4,1fr)",gap:6,marginBottom:10}}>
              {[{l:"$5"},{l:"$10"},{l:"$25"},{l:"Other"}].map(d=>(
                <button key={d.l} onClick={()=>setPayM("card")} style={{padding:"9px 4px",borderRadius:9,border:"1px solid var(--sbd)",background:"var(--sbg)",color:"var(--stx)",fontSize:12,fontWeight:700,cursor:"pointer",fontFamily:"'Sora',sans-serif",textAlign:"center"}}>
                  {d.l}
                </button>
              ))}
            </div>

            <div style={{display:"flex",gap:6,marginBottom:10}}>
              <button onClick={()=>setPayM("venmo")} style={{flex:1,padding:"9px 4px",borderRadius:9,border:"1px solid var(--border)",background:"var(--surface)",color:"var(--text)",fontSize:11,fontWeight:700,cursor:"pointer",fontFamily:"'Sora',sans-serif"}}>📱 Venmo / Cash App</button>
              <button onClick={()=>setPayM("card")}  style={{flex:1,padding:"9px 4px",borderRadius:9,border:"1px solid var(--border)",background:"var(--surface)",color:"var(--text)",fontSize:11,fontWeight:700,cursor:"pointer",fontFamily:"'Sora',sans-serif"}}>💳 Card / Apple Pay</button>
            </div>

            <button className="offer-btn" disabled={offUsed} onClick={()=>{
              if(offUsed) return;
              setOffUsed(true); setOkMsg("offering"); setExpired(false); setSecs(DS*10);
            }} style={{marginBottom:6}}>
              {offUsed ? "✓ Already used today" : "🙏 I'll give at the offering → +30 min free"}
            </button>
            <div style={{fontSize:10,color:"var(--muted)",textAlign:"center"}}>💚 All gifts go directly to Bradenton Gospel Tabernacle</div>
          </>}
        </div>

        {!expired && !okMsg && (
          <div style={{background:"var(--surface)",border:"1px solid var(--sbd)",borderRadius:12,padding:"12px 13px",marginBottom:12}}>
            <div style={{fontSize:11,fontWeight:700,color:"var(--accent)",marginBottom:3}}>💚 Feel Led to Give?</div>
            <div style={{fontSize:11,color:"var(--muted)",marginBottom:9,lineHeight:1.5}}>Your generosity helps us serve this community.</div>
            <div style={{display:"grid",gridTemplateColumns:"repeat(4,1fr)",gap:6,marginBottom:7}}>
              {["$5","$10","$25","Other"].map(l=>(
                <button key={l} onClick={()=>setPayM("card")} style={{padding:"8px 4px",borderRadius:8,border:"1px solid var(--sbd)",background:"var(--sbg)",color:"var(--stx)",fontSize:11,fontWeight:700,cursor:"pointer",fontFamily:"'Sora',sans-serif",textAlign:"center"}}>{l}</button>
              ))}
            </div>
            <div style={{display:"flex",gap:6}}>
              <button onClick={()=>setPayM("venmo")} style={{flex:1,padding:"7px 4px",borderRadius:8,border:"1px solid var(--border)",background:"transparent",color:"var(--muted)",fontSize:10,fontWeight:600,cursor:"pointer",fontFamily:"'Sora',sans-serif"}}>📱 Venmo / Cash App</button>
              <button onClick={()=>setPayM("card")}  style={{flex:1,padding:"7px 4px",borderRadius:8,border:"1px solid var(--border)",background:"transparent",color:"var(--muted)",fontSize:10,fontWeight:600,cursor:"pointer",fontFamily:"'Sora',sans-serif"}}>💳 Card / Apple Pay</button>
            </div>
          </div>
        )}

        {events.length>0 && <>
          <div style={{fontSize:10,color:"var(--muted)",textTransform:"uppercase",letterSpacing:".06em",marginBottom:8}}>📅 This Week at BGT</div>
          <EventsList events={events}/>
        </>}

        <div style={{background:"var(--surface)",border:"1px solid var(--border)",borderRadius:12,padding:"11px 13px",marginTop:12}}>
          <div style={{fontSize:11,fontWeight:700,marginBottom:8,color:"var(--accent)"}}>ℹ️ Visitor Info</div>
          {[
            {icon:"📍",text:"1234 Church Street, Bradenton, FL 34205"},
            {icon:"📞",text:"(555) 123-4567"},
            {icon:"🌐",text:"www.bgt-church.org"},
            {icon:"🅿️",text:"Free parking — main lot & side street"},
          ].map((x,i)=>(
            <div key={i} style={{display:"flex",gap:8,alignItems:"flex-start",marginBottom:i<3?5:0}}>
              <span style={{fontSize:13,flexShrink:0,marginTop:1}}>{x.icon}</span>
              <span style={{fontSize:12,color:"var(--muted)",lineHeight:1.4}}>{x.text}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

function AdminLogin({ onLogin }) {
  const [pin,setPin]=useState(""), [err,setErr]=useState(false), [shake,setShake]=useState(false);
  function attempt(){ if(pin==="1234"){onLogin();}else{setErr(true);setShake(true);setPin("");setTimeout(()=>setShake(false),500);} }
  return (
    <div className="wrap" style={{background:"radial-gradient(ellipse 60% 50% at 50% 0%,#0a1020 0%,var(--bg) 70%)"}}>
      <div className="card" style={{maxWidth:340}}>
        <div style={{textAlign:"center",marginBottom:14}}><Logo size={44}/></div>
        <div style={{fontSize:19,fontWeight:700,marginBottom:4,textAlign:"center"}}>Admin Access</div>
        <div style={{fontSize:12,color:"var(--muted)",marginBottom:18,textAlign:"center"}}>Enter your PIN to manage the network from anywhere.</div>
        <div style={{background:"var(--surface)",border:`1px solid ${err?"var(--danger)":"var(--border)"}`,borderRadius:10,padding:"13px",marginBottom:10,textAlign:"center",letterSpacing:".3em",fontSize:24,fontFamily:"'DM Mono',monospace",color:err?"var(--danger)":"var(--text)",animation:shake?"shake .4s ease":"none"}}>
          {pin?"•".repeat(pin.length):<span style={{color:"var(--muted)",fontSize:13,letterSpacing:"normal"}}>Enter PIN</span>}
        </div>
        {err&&<div style={{fontSize:11,color:"var(--danger)",textAlign:"center",marginBottom:8}}>Incorrect PIN — try again</div>}
        <div style={{display:"grid",gridTemplateColumns:"repeat(3,1fr)",gap:8,marginBottom:12}}>
          {[1,2,3,4,5,6,7,8,9,"⌫",0,"→"].map(k=>(
            <button key={k} onClick={()=>{ if(k==="⌫"){setPin(p=>p.slice(0,-1));setErr(false);}else if(k==="→")attempt();else if(pin.length<6){setPin(p=>p+k);setErr(false);}}}
              style={{padding:"13px 0",borderRadius:10,border:"1px solid var(--border)",background:k==="→"?"var(--accent)":"var(--surface)",color:k==="→"?"#fff":"var(--text)",fontSize:k==="→"||k==="⌫"?17:20,fontWeight:700,cursor:"pointer",fontFamily:"'DM Mono',monospace",transition:"all .1s"}}>
              {k}
            </button>
          ))}
        </div>
        <div style={{fontSize:10,color:"var(--muted)",textAlign:"center"}}>Demo PIN: 1234</div>
      </div>
    </div>
  );
}

function Admin({ events, setEvents, posts, setPosts, maint, setMaint }) {
  const [users,  setUsers]  = useState(INITIAL_USERS);
  const [toast,  setToast]  = useState(null);
  const [filter, setFilter] = useState("all");
  const [tab,    setTab]    = useState("sessions");

  const [vcodes, setVcodes] = useState([]);
  const [vtype,  setVtype]  = useState("day");
  const [vqty,   setVqty]   = useState(5);
  const VP = { day:{label:"Day Pass",price:"$1.00"}, week:{label:"Week Pass",price:"$5.00"}, month:{label:"Monthly",price:"$15.00"} };
  function mkCode(t){ const w={day:["BLESS","GRACE","FAITH","PEACE"],week:["GOSPEL","PRAYER"],month:["ETERNAL","COVENANT"]}; return w[t][Math.floor(Math.random()*w[t].length)]+Math.floor(10+Math.random()*90); }
  function genBatch(){ const c=Array.from({length:vqty},()=>({code:mkCode(vtype),type:vtype,used:false,date:new Date().toLocaleDateString()})); setVcodes(x=>[...c,...x]); toast2(`✓ ${vqty} codes generated`); }

  const EVT_BLANK = {title:"",date:"",time:"",desc:"",category:"service"};
  const [evtF, setEvtF]   = useState(EVT_BLANK);
  const [evtE, setEvtE]   = useState(null);

  const POST_BLANK = {title:"",body:"",category:"announcement"};
  const [postF,setPostF]  = useState(POST_BLANK);
  const [postE,setPostE]  = useState(null);

  const active  = users.filter(u=>u.status==="active").length;
  const expired = users.filter(u=>u.status==="expired").length;
  const paid    = users.filter(u=>u.status==="paid").length;
  const revenue = users.filter(u=>u.paid).length*5;
  const newMaint= maint.filter(r=>r.status==="new").length;
  const filtered= filter==="all"?users:users.filter(u=>u.status===filter);

  function toast2(m){ setToast(m); setTimeout(()=>setToast(null),2200); }
  function grantTime(id){ setUsers(u=>u.map(x=>x.id===id?{...x,minutesUsed:0,status:"active"}:x)); toast2("✓ 60 minutes granted"); }
  function kickUser(id){  setUsers(u=>u.map(x=>x.id===id?{...x,status:"expired",minutesUsed:60}:x)); toast2("User disconnected"); }

  const TABS = [
    { id:"sessions", lbl:"📊 Sessions" },
    { id:"vouchers", lbl:"🏷️ Vouchers" },
    { id:"events",   lbl:"📋 Church & Events" },
    { id:"board",    lbl:"🏠 Tenant Board" },
    { id:"maint",    lbl:`🔧 Maintenance${newMaint>0?` (${newMaint})`:""}`},
    { id:"map",      lbl:"🗺️ Property Map" },
  ];

  return (
    <div className="admin">
      <div style={{display:"flex",alignItems:"center",gap:10,marginBottom:14}}>
        <Logo size={30}/>
        <div><div style={{fontSize:19,fontWeight:700}}>Admin Dashboard</div><div style={{fontSize:12,color:"var(--muted)",fontFamily:"'DM Mono',monospace"}}>Bradenton Gospel Tabernacle</div></div>
      </div>

      <div className="stats">
        <div className="stat"><div className="slbl">Active</div><div className="sval g">{active}</div></div>
        <div className="stat"><div className="slbl">Paid</div><div className="sval b">{paid}</div></div>
        <div className="stat"><div className="slbl">Expired</div><div className="sval r">{expired}</div></div>
        <div className="stat"><div className="slbl">Revenue</div><div className="sval o">${revenue}</div></div>
      </div>

      <div className="tabs">
        {TABS.map(t=>(
          <button key={t.id} className="tab" onClick={()=>setTab(t.id)}
            style={{background:tab===t.id?"var(--accent)":"transparent",color:tab===t.id?"#fff":"var(--muted)",borderColor:tab===t.id?"var(--accent)":"var(--border)"}}>
            {t.lbl}
          </button>
        ))}
      </div>

      {tab==="sessions" && <>
        <div className="tabs" style={{marginBottom:12}}>
          {["all","active","paid","expired"].map(f=>(
            <button key={f} className="tab" onClick={()=>setFilter(f)}
              style={{background:filter===f?"var(--accent)":"transparent",color:filter===f?"#fff":"var(--muted)",borderColor:filter===f?"var(--accent)":"var(--border)",textTransform:"capitalize"}}>
              {f==="all"?`All (${users.length})`:`${f[0].toUpperCase()+f.slice(1)} (${users.filter(u=>u.status===f).length})`}
            </button>
          ))}
        </div>
        <div className="sec-lbl">Users — {filtered.length} shown</div>
        <div className="ucards">
          {filtered.map(u=>{
            const pct=Math.min(100,(u.minutesUsed/60)*100);
            return (
              <div className="uc" key={u.id}>
                <div className="uc-top">
                  <div><div className="uc-name">{u.name}</div><div className="uc-unit">{u.unit}</div></div>
                  <span className={`spill sp-${u.status}`}>{u.status==="paid"?`Paid · ${u.plan}`:u.status[0].toUpperCase()+u.status.slice(1)}</span>
                </div>
                <div className="ugrid">
                  <div><div className="ufl">IP</div><div className="ufv mono">{u.ip}</div></div>
                  <div><div className="ufl">Data</div><div className="ufv mono">{u.dataUsed}</div></div>
                  <div><div className="ufl">MAC</div><div className="ufv mono">{u.mac}</div></div>
                  <div><div className="ufl">Last Seen</div><div className="ufv">{u.lastSeen}</div></div>
                </div>
                <div className="ubar-row">
                  <div className="ubar-top"><span className="ubar-lbl">Free Daily (60 min)</span><span className="ubar-val">{u.minutesUsed}/60</span></div>
                  <div className="ubar"><div className={`ufill ${u.minutesUsed>=60?"full":""}`} style={{width:`${pct}%`}}/></div>
                </div>
                {u.paid&&u.paidHoursTotal&&(()=>{
                  const hL=u.paidHoursTotal-u.paidHoursUsed, pp=Math.min(100,(u.paidHoursUsed/u.paidHoursTotal)*100);
                  const dL=Math.floor(hL/24),hR=hL%24, rem=dL>0?`${dL}d ${hR}h left`:`${hL}h left`;
                  return (
                    <div className="ubar-row">
                      <div className="ubar-top"><span className="ubar-lbl" style={{color:"var(--accent2)"}}>{u.plan}</span><span className="ubar-val" style={{color:"var(--accent2)"}}>{rem}</span></div>
                      <div className="ubar"><div className="ufill" style={{width:`${100-pp}%`,background:hL<6?"var(--warn)":"var(--accent2)"}}/></div>
                    </div>
                  );
                })()}
                <div className="uactions">
                  <button className="abtn abtn-g" onClick={()=>grantTime(u.id)}>+ Grant 60 min</button>
                  <button className="abtn abtn-r" onClick={()=>kickUser(u.id)}>Disconnect</button>
                </div>
              </div>
            );
          })}
        </div>
      </>}

      {tab==="vouchers" && <>
        <div className="aform">
          <div style={{fontSize:13,fontWeight:700,marginBottom:4}}>Generate Voucher Codes</div>
          <div style={{fontSize:11,color:"var(--muted)",marginBottom:12}}>Print and sell at the church office. Each code works once.</div>
          <div style={{display:"flex",gap:7,marginBottom:12,flexWrap:"wrap"}}>
            {Object.entries(VP).map(([id,p])=>(
              <button key={id} className="tab" onClick={()=>setVtype(id)} style={{flex:1,minWidth:80,padding:"10px 6px",textAlign:"center",border:"2px solid",background:vtype===id?"var(--sbg)":"var(--surface)",color:vtype===id?"var(--accent)":"var(--muted)",borderColor:vtype===id?"var(--accent)":"var(--border)"}}>
                <div style={{fontSize:11,fontWeight:700}}>{p.label}</div><div style={{fontSize:15,marginTop:2}}>{p.price}</div>
              </button>
            ))}
          </div>
          <div style={{display:"flex",gap:7,alignItems:"center",marginBottom:12}}>
            <span style={{fontSize:11,color:"var(--muted)"}}>Qty:</span>
            {[1,5,10,20].map(n=>(
              <button key={n} className="tab" onClick={()=>setVqty(n)} style={{padding:"5px 12px",background:vqty===n?"var(--accent)":"transparent",color:vqty===n?"#fff":"var(--muted)",borderColor:vqty===n?"var(--accent)":"var(--border)"}}>{n}</button>
            ))}
          </div>
          <button className="abtn abtn-g" onClick={genBatch} style={{width:"100%",padding:"10px",fontSize:12,borderRadius:9}}>
            Generate {vqty} × {VP[vtype].label} Codes ({VP[vtype].price} each)
          </button>
        </div>
        {vcodes.length>0&&<>
          <div className="sec-lbl">Generated — Print & Sell</div>
          {vcodes.map((c,i)=>(
            <div key={i} style={{background:"var(--card)",border:`1px solid ${c.used?"var(--border)":"var(--sbd)"}`,borderRadius:10,padding:"11px 13px",marginBottom:8,display:"flex",alignItems:"center",justifyContent:"space-between"}}>
              <div>
                <div style={{fontFamily:"'DM Mono',monospace",fontSize:16,fontWeight:700,color:c.used?"var(--muted)":"var(--accent)",letterSpacing:".08em",textDecoration:c.used?"line-through":"none"}}>{c.code}</div>
                <div style={{fontSize:10,color:"var(--muted)",marginTop:2}}>{VP[c.type].label} · {VP[c.type].price} · {c.date}</div>
              </div>
              <span style={{fontSize:9,fontWeight:700,padding:"3px 9px",borderRadius:20,background:c.used?"#1a0b0b":"var(--sbg)",color:c.used?"var(--danger)":"var(--accent)",border:`1px solid ${c.used?"#3a1e1e":"var(--sbd)"}`}}>{c.used?"REDEEMED":"ACTIVE"}</span>
            </div>
          ))}
          <div style={{fontSize:10,color:"var(--muted)",textAlign:"center",marginTop:6}}>Status updates automatically when a code is redeemed.</div>
        </>}
        {vcodes.length===0&&<div style={{textAlign:"center",padding:"26px 0",color:"var(--muted)",fontSize:13}}>No codes yet. Choose a plan and tap Generate.</div>}
      </>}

      {tab==="events" && <>
        <div className="aform">
          <div style={{fontSize:13,fontWeight:700,marginBottom:12}}>{evtE?"✏️ Edit Event":"➕ Add Event"}</div>
          <div style={{display:"flex",gap:7,marginBottom:8,flexWrap:"wrap"}}>
            <input className="finput" placeholder="Event title" value={evtE?evtE.title:evtF.title} onChange={e=>evtE?setEvtE({...evtE,title:e.target.value}):setEvtF({...evtF,title:e.target.value})}/>
            <select className="fsel" value={evtE?evtE.category:evtF.category} onChange={e=>evtE?setEvtE({...evtE,category:e.target.value}):setEvtF({...evtF,category:e.target.value})}>
              {["service","study","event","special","youth"].map(c=><option key={c}>{c}</option>)}
            </select>
          </div>
          <div style={{display:"flex",gap:7,marginBottom:8}}>
            <input className="finput" placeholder="Date (e.g. Every Sunday)" value={evtE?evtE.date:evtF.date} onChange={e=>evtE?setEvtE({...evtE,date:e.target.value}):setEvtF({...evtF,date:e.target.value})}/>
            <input className="finput" placeholder="Time" value={evtE?evtE.time:evtF.time} onChange={e=>evtE?setEvtE({...evtE,time:e.target.value}):setEvtF({...evtF,time:e.target.value})} style={{maxWidth:110}}/>
          </div>
          <textarea className="fta" placeholder="Description (optional)" value={evtE?evtE.desc:evtF.desc} onChange={e=>evtE?setEvtE({...evtE,desc:e.target.value}):setEvtF({...evtF,desc:e.target.value})} style={{marginBottom:9}}/>
          <div style={{display:"flex",gap:7}}>
            <button className="abtn abtn-g" style={{padding:"9px",fontSize:12,borderRadius:8}} onClick={()=>{
              if(evtE){ setEvents(ev=>ev.map(e=>e.id===evtE.id?evtE:e)); setEvtE(null); toast2("✓ Event updated"); }
              else if(evtF.title){ setEvents(ev=>[...ev,{...evtF,id:Date.now()}]); setEvtF(EVT_BLANK); toast2("✓ Event added"); }
            }}>{evtE?"Save Changes":"Add Event"}</button>
            {evtE&&<button className="abtn abtn-r" style={{flex:"unset",padding:"9px 14px",fontSize:12,borderRadius:8}} onClick={()=>setEvtE(null)}>Cancel</button>}
          </div>
        </div>
        <div className="sec-lbl">Events — shows on Guest & Resident pages ({events.length})</div>
        {events.map(e=>(
          <div className="evt" key={e.id} style={{display:"flex",justifyContent:"space-between",alignItems:"flex-start"}}>
            <div style={{flex:1}}>
              <div style={{fontSize:9,color:EVT_COLOR[e.category]||"#64748b",fontWeight:700,marginBottom:3}}>{e.category} · {e.date} · {e.time}</div>
              <div className="evt-title">{e.title}</div>
              {e.desc&&<div className="evt-desc">{e.desc}</div>}
            </div>
            <div style={{display:"flex",gap:5,marginLeft:8,flexShrink:0}}>
              <button className="abtn abtn-g" style={{flex:"unset",padding:"4px 9px",fontSize:9}} onClick={()=>setEvtE({...e})}>Edit</button>
              <button className="abtn abtn-r" style={{flex:"unset",padding:"4px 9px",fontSize:9}} onClick={()=>{ setEvents(ev=>ev.filter(x=>x.id!==e.id)); toast2("Event removed"); }}>Del</button>
            </div>
          </div>
        ))}
        {events.length===0&&<div style={{textAlign:"center",padding:"22px 0",color:"var(--muted)",fontSize:13}}>No events. Add one above.</div>}
      </>}

      {tab==="board" && <>
        <div className="aform">
          <div style={{fontSize:13,fontWeight:700,marginBottom:12}}>{postE?"✏️ Edit Post":"➕ Add Post"}</div>
          <div style={{display:"flex",gap:7,marginBottom:8,flexWrap:"wrap"}}>
            <input className="finput" placeholder="Post title" value={postE?postE.title:postF.title} onChange={e=>postE?setPostE({...postE,title:e.target.value}):setPostF({...postF,title:e.target.value})}/>
            <select className="fsel" value={postE?postE.category:postF.category} onChange={e=>postE?setPostE({...postE,category:e.target.value}):setPostF({...postF,category:e.target.value})}>
              {TENANT_CATS.map(c=><option key={c.id} value={c.id}>{c.label}</option>)}
            </select>
          </div>
          <textarea className="fta" placeholder="Post content…" value={postE?postE.body:postF.body} onChange={e=>postE?setPostE({...postE,body:e.target.value}):setPostF({...postF,body:e.target.value})} style={{marginBottom:9}}/>
          <div style={{display:"flex",gap:7}}>
            <button className="abtn abtn-g" style={{padding:"9px",fontSize:12,borderRadius:8}} onClick={()=>{
              if(postE){ setPosts(p=>p.map(x=>x.id===postE.id?postE:x)); setPostE(null); toast2("✓ Post updated"); }
              else if(postF.title&&postF.body){ setPosts(p=>[{...postF,id:Date.now(),date:"Today"},...p]); setPostF(POST_BLANK); toast2("✓ Post added"); }
            }}>{postE?"Save Changes":"Post to Board"}</button>
            {postE&&<button className="abtn abtn-r" style={{flex:"unset",padding:"9px 14px",fontSize:12,borderRadius:8}} onClick={()=>setPostE(null)}>Cancel</button>}
          </div>
        </div>
        <div className="sec-lbl">Community Board — tenant-only ({posts.length} posts)</div>
        {posts.map(p=>{
          const cat=TENANT_CATS.find(c=>c.id===p.category);
          return (
            <div className="post" key={p.id} style={{borderLeftColor:cat?.color||"var(--accent)",display:"flex",justifyContent:"space-between",alignItems:"flex-start"}}>
              <div style={{flex:1}}>
                <div className="post-cat" style={{color:cat?.color||"var(--accent)"}}>{cat?.label||p.category} · {p.date}</div>
                <div className="post-title">{p.title}</div>
                <div className="post-body">{p.body}</div>
              </div>
              <div style={{display:"flex",gap:5,marginLeft:8,flexShrink:0}}>
                <button className="abtn abtn-g" style={{flex:"unset",padding:"4px 9px",fontSize:9}} onClick={()=>setPostE({...p})}>Edit</button>
                <button className="abtn abtn-r" style={{flex:"unset",padding:"4px 9px",fontSize:9}} onClick={()=>{ setPosts(ps=>ps.filter((_,j)=>j!==i)); toast2("Post removed"); }}>Del</button>
              </div>
            </div>
          );
        })}
        {posts.length===0&&<div style={{textAlign:"center",padding:"22px 0",color:"var(--muted)",fontSize:13}}>No posts. Add one above.</div>}
      </>}

      {tab==="map" && <PropertyMap users={users} maint={maint} setMaint={setMaint} setUsers={setUsers} toast2={toast2}/>}

      {tab==="maint" && <>
        <div className="sec-lbl">Maintenance Requests — {maint.length} total · {newMaint} new</div>
        {maint.length===0&&<div style={{textAlign:"center",padding:"26px 0",color:"var(--muted)",fontSize:13}}>No maintenance requests yet.</div>}
        {maint.map((r,i)=>(
          <div className="mcard" key={r.id||i}>
            <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:8}}>
              <div><div style={{fontSize:13,fontWeight:700}}>{r.unit}</div><div style={{fontSize:11,color:"var(--muted)",marginTop:1,textTransform:"capitalize"}}>{r.category} · {r.date}</div></div>
              <span className={`mst mst-${r.status}`}>{r.status.replace("_"," ")}</span>
            </div>
            <div style={{fontSize:12,color:"var(--muted)",lineHeight:1.6,marginBottom:10}}>{r.message}</div>
            <div style={{display:"flex",gap:6}}>
              {r.status!=="in_progress"&&<button className="abtn" style={{background:"#fff7ed",color:"var(--warn)",border:"1px solid #fed7aa",padding:"6px 0",fontSize:10}} onClick={()=>setMaint(rs=>rs.map((x,j)=>j===i?{...x,status:"in_progress"}:x))}>In Progress</button>}
              {r.status!=="resolved"&&<button className="abtn abtn-g" style={{padding:"6px 0",fontSize:10}} onClick={()=>setMaint(rs=>rs.map((x,j)=>j===i?{...x,status:"resolved"}:x))}>Mark Resolved</button>}
              <button className="abtn abtn-r" style={{flex:"unset",padding:"6px 12px",fontSize:10}} onClick={()=>setMaint(rs=>rs.filter((_,j)=>j!==i))}>Remove</button>
            </div>
          </div>
        ))}
      </>}

      {toast&&<div className="toast">{toast}</div>}
    </div>
  );
}

// Legacy wrapper
import PropertyMap from './PropertyMap';

export default function App() {
  const [view,    setView]   = useState("resident");
  const [dark,    setDark]   = useState(true);
  const [authed,  setAuthed] = useState(false);
  const [events,  setEvents] = useState(INITIAL_EVENTS);
  const [posts,   setPosts]  = useState(INITIAL_TENANT_POSTS);
  const [maint,   setMaint]  = useState(INITIAL_MAINT);

  useEffect(()=>{ document.body.classList.toggle("light",!dark); },[dark]);

  function addMaint(req){ setMaint(r=>[{...req,id:Date.now()},...r]); }

  const showAdmin = view==="admin" && authed;
  const showLogin = view==="admin" && !authed;

  return (
    <AppCtx.Provider value={{addMaint}}>
      <style>{css}</style>
      <nav className="nav">
        <div className="nav-logo">
          <Logo size={28}/>
          <span className="nav-name">Bradenton Gospel Tabernacle</span>
        </div>

        <div className="nav-tabs">
          <button className={`nav-tab ${view==="resident"?"active":""}`} onClick={()=>setView("resident")}>Resident</button>
          <button className={`nav-tab ${view==="guest"   ?"active":""}`} onClick={()=>setView("guest")}>Guest</button>
          <button className={`nav-tab ${view==="admin"   ?"active":""}`} onClick={()=>setView("admin")}>{authed?"🟢 Admin":"Admin"}</button>
        </div>

        <div style={{display:"flex",alignItems:"center",gap:8,flexShrink:0}}>
          <span style={{fontSize:13}}>{dark?"🌙":"☀️"}</span>
          <button className="tog" onClick={()=>setDark(d=>!d)}/>
          {authed&&<>
            <div style={{width:1,height:18,background:"var(--border)"}}/>
            <button onClick={()=>setAuthed(false)} style={{fontSize:10,padding:"3px 9px",borderRadius:6,border:"1px solid var(--border)",background:"transparent",color:"var(--muted)",cursor:"pointer",fontFamily:"'Sora',sans-serif",whiteSpace:"nowrap"}}>Sign out</button>
          </>}
        </div>
      </nav>

      {view==="resident" && <TenantPortal events={events} posts={posts}/>}
      {view==="guest"    && <GuestPortal  events={events}/>}
      {showLogin         && <AdminLogin   onLogin={()=>setAuthed(true)}/>}
      {showAdmin         && <Admin events={events} setEvents={setEvents} posts={posts} setPosts={setPosts} maint={maint} setMaint={setMaint}/>}
    </AppCtx.Provider>
  );
}