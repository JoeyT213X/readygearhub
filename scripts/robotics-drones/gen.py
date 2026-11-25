#!/usr/bin/env python3
"""Generates src/data/robotics-drones.ts from selection.py. Run: python3 scripts/robotics-drones/gen.py [--verify]"""
import sys,re,json,os,urllib.request
from concurrent.futures import ThreadPoolExecutor
sys.path.insert(0,os.path.dirname(os.path.abspath(__file__)))
from selection import *
ASOF='Nov 25, 2026'
items=[]
def slug(s): return re.sub(r'[^a-z0-9]+','-',s.lower()).strip('-')
def usd(v):
    v=float(v)
    return f'${v:,.0f}' if abs(v-round(v))<0.005 or v>=1000 else f'${v:,.2f}'
# ---- Robots International
def ri_label(n):
    l=n.lower()
    if 'fire' in l or 'extinguish' in l: return 'Firefighting robot'
    if 'amphibious' in l or 'patrol' in l: return 'Patrol robot'
    if 'wheel' in l: return 'Wheeled quadruped robot'
    return 'Quadruped robot'
def ri_blurb(n,avail,price):
    l=n.lower()
    av={'LimitedAvailability':'Limited availability','InStock':'In stock','BackOrder':'On backorder','PreOrder':'Pre-order'}.get(avail.split('/')[-1],'')
    if 'fire' in l or 'extinguish' in l:
        core=f'{n}, a remote-operated firefighting robot sold through Robots International. Meant for trained crews at industrial and public-safety sites.'
    elif 'rotunbot' in l:
        core=f'{n}, a spherical amphibious robot that its maker describes for patrol, inspection and detection work. Sold through Robots International.'
    elif 'unitree' in l:
        core=f'{n}, a four-legged robot sold through Robots International. See the store page for specifications, intended use, support and shipping.'
    else:
        core=f'{n}, a four-legged robot sold through Robots International, listed for inspection, patrol or research use. See the store page for specifications, support and shipping.'
    return core+(f' {av} on the store.' if av else '')
for i in RI_SEL:
    x=RI[i]; url=x['url']
    items.append(dict(id='ri-'+slug(url.split('.com/')[1].replace('.htm',''))[:70], title=x['name'].strip(), blurb=ri_blurb(x['name'],x['avail'] or '',x['price']),
      sourceName='Robots International', programId='robots-international', url=url, label=ri_label(x['name']),
      price=f"{usd(x['price'])} on Robots International as of {ASOF}", cta='See price at Robots International', group='robots'))
# ---- RobotShop
for h,t,p,av,b in ROBOTSHOP:
    fire='fire' in t.lower()
    items.append(dict(id='rs-'+h.replace('-us','') if h.endswith('-us') else 'rs-'+h, title=t, blurb=b+f' {av} on RobotShop.', sourceName='RobotShop', programId='robotshop',
      url=f'https://www.robotshop.com/products/{h}', label='Firefighting robot' if fire else 'Quadruped robot',
      price=f'{usd(p)} on RobotShop as of {ASOF}', cta='See price at RobotShop', group='robots'))
# ---- Autel
AB={
 'evo-max-4n-copy':'A professional drone with a starlight low-light camera, listed by Autel for night work. Autel lists a 12.4-mile transmission range.',
 'evo-lite-6k-enterprise-copy':'A compact enterprise drone that pairs a visible-light camera with a 640x512 thermal sensor, which can help with night and search-style work. Comes in three combos.',
 'evo-lite-copy':'A compact 6K enterprise drone with a 1-inch 20MP camera and three-way obstacle sensing. Bundles vary in stock.',
 'evo-max-4t-copy':'An enterprise drone with wide, zoom and thermal cameras plus a laser rangefinder. Autel lists a 12.4-mile transmission range.',
 'evo-alpha':'A large multi-purpose industrial drone with a built-in RTK dual-antenna system and improved obstacle avoidance and video transmission, per Autel. A professional platform.',
 'evo-ii-dual-640t-enterprise-bundle-v3':'A dual-camera drone with a 640x512 thermal sensor, used for inspection and search-style work. Enterprise bundle with a smart controller.',
 'evo-ii-dual-640t-rtk-rugged-bundle-v3':'The EVO II thermal drone with an RTK module and a rugged case. A professional bundle for inspection and mapping work.',
 'evo-ii-pro-6k-rtk-rugged-bundle-v3':'A 6K camera drone with an RTK module and a rugged case, listed for mapping and inspection work.',
 'evo-ii-pro-6k-enterprise-bundle-v3':'A 6K camera drone with a 1-inch 20MP sensor and 360° obstacle sensing, sold as an enterprise bundle.',
 'evo-ii-dual-640t-rugged-bundle-v3':'The EVO II dual-camera thermal drone in a rugged bundle with a hard case. A professional kit for inspection and search-style work.',
 'evo-ii-pro-v3-rugged-bundle-1':'A 6K camera drone in a rugged bundle, with 360° obstacle sensing and about 40 minutes of listed flight time. Colors vary in stock.',
 'drones-evo-lite-plus':'A compact 6K camera drone with obstacle sensing and about 40 minutes of listed flight time. Some colors and bundles are sold out.',
}
for p in AUTEL:
    if p['handle'] not in AUTEL_SEL: continue
    prices=[float(v['price']) for v in p['variants']]
    lo=min(prices); multi=len(set(prices))>1 or len(p['variants'])>1
    items.append(dict(id='autel-'+slug(p['handle'].replace('-copy','').replace('drones-','')), title=('Autel '+p['title']) if not p['title'].startswith('Autel') else p['title'],
      blurb=AB[p['handle']]+' Availability and local rules vary; see the store.', sourceName='Autel Robotics', programId='autel-robotics',
      url=f"https://shop.autelrobotics.com/products/{p['handle']}", label='Drone', price=(('From ' if multi and len(set(prices))>1 else '')+usd(lo)+f' on Autel Robotics’ shop as of {ASOF}'), cta='See price at Autel Robotics', group='drones'))
# ---- HOVERAir
for iid,t,u,b in HOVER:
    items.append(dict(id=iid,title=t,blurb=b,sourceName='HOVERAir',programId='hoverair',url=u,label='Camera drone',price='See price',cta='See price at HOVERAir',group='drones'))
# de-dup ids
seen=set()
for it in items:
    assert it['id'] not in seen,it['id']; seen.add(it['id'])
def q(s): return json.dumps(s,ensure_ascii=False)
out=["/**",
" * Drones & Robotics directory category (generated by scripts/robotics-drones/gen.py, Nov 25, 2026 America/Chicago).",
" * Lineups from RobotShop, Robots International, Autel Robotics and HOVERAir. All four programs are PENDING (applied, not approved),",
" * so every card uses a plain official product link (rel=noopener, no tracking) and an empty `affiliateUrl` placeholder.",
" * TODO(affiliate): when a program is approved, flip its status in packages/catalog/affiliates.ts and paste the verified",
" * tracked URL into `affiliateUrl` on that store's items. Never invent tracking links.",
" * Pending programs are ppcAllowed:false (hidden in paid-search sessions). No weaponized robots, no counter-drone gear,",
" * no parts/accessories/education kits. Representative stock photos only; robot cards stay text-only.",
" */",
"import type { HighTicketItem } from './high-ticket';","",
"export const roboticsDronesItems: HighTicketItem[] = ["]
for it in items:
    groups="['power-tech', 'safety-prep']" if it['group']=='drones' else "['safety-prep']"
    also="['drones']" if it['group']=='drones' else None
    out.append("  {")
    out.append(f"    id: {q(it['id'])},")
    out.append(f"    title: {q(it['title'])},")
    out.append(f"    blurb: {q(it['blurb'])},")
    out.append(f"    sourceName: {q(it['sourceName'])},")
    out.append("    category: 'drones-robotics',")
    if also: out.append(f"    alsoIn: {also},")
    out.append(f"    groups: {groups},")
    out.append("    affiliateUrl: '', // TODO(affiliate): tracked URL once approved")
    out.append(f"    fallbackUrl: {q(it['url'])},")
    out.append(f"    offerLabel: {q(it['label'])},")
    out.append(f"    cta: {q(it['cta'])},")
    out.append(f"    price: {q(it['price'])},")
    out.append("  },")
out.append("];")
out.append("")
out.append("/** Ids per store, used by the catalog guard in full-catalog.ts to keep these off the home page. */")
out.append("export const roboticsDronesIds = new Set(roboticsDronesItems.map((i) => i.id));")
root=os.path.abspath(os.path.join(os.path.dirname(__file__),'..','..'))
open(os.path.join(root,'src/data/robotics-drones.ts'),'w').write('\n'.join(out)+'\n')
json.dump(items,open(os.path.join(os.path.dirname(__file__),'generated-items.json'),'w'),indent=1,ensure_ascii=False)
from collections import Counter
print(Counter(i['sourceName'] for i in items), len(items))
if '--verify' in sys.argv:
    def chk(it):
        if it['sourceName']=='RobotShop': return it['id'],'webfetch-verified'
        for k in range(2):
            try:
                r=urllib.request.urlopen(urllib.request.Request(it['url'],headers={'User-Agent':'Mozilla/5.0'}),timeout=40); return it['id'],r.status
            except Exception as e: err=str(e)
        return it['id'],err
    with ThreadPoolExecutor(6) as ex: res=list(ex.map(chk,items))
    bad=[r for r in res if r[1] not in (200,'webfetch-verified')]
    print('non-200:',bad); json.dump(res,open(os.path.join(os.path.dirname(__file__),'url-check.json'),'w'),indent=1)
