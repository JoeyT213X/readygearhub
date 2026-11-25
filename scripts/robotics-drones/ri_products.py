import re,json,urllib.request,time
from concurrent.futures import ThreadPoolExecutor
d=json.load(open('ri-cat-products.json'))
cats={}
for c,v in d.items():
    for l in v['links']: cats.setdefault(l,[]).append(c)
print(len(cats))
def get(u):
    for i in range(3):
        try:
            return urllib.request.urlopen(urllib.request.Request(u,headers={'User-Agent':'Mozilla/5.0'}),timeout=60).read().decode('utf8','ignore')
        except Exception as e: err=str(e); time.sleep(2)
    return 'ERR '+err
def one(u):
    t=get(u)
    out={'url':u,'cats':cats[u]}
    for m in re.findall(r'<script[^>]*ld\+json[^>]*>(.*?)</script>',t,re.S):
        try: j=json.loads(m)
        except: continue
        if isinstance(j,dict) and j.get('@type')=='Product':
            out['name']=j.get('name'); out['sku']=j.get('sku'); out['desc']=(j.get('description') or '')[:400]
            out['image']=j.get('image'); o=j.get('offers') or {}
            if isinstance(o,list): o=o[0]
            out['price']=o.get('price'); out['cur']=o.get('priceCurrency'); out['avail']=o.get('availability'); out['brand']=(j.get('brand') or {}).get('name') if isinstance(j.get('brand'),dict) else j.get('brand')
            break
    bc=re.findall(r'"name": "([^"]+)",\s*"image"',t)
    out['bc']=bc
    out['err']=t[:80] if t.startswith('ERR') else ''
    return out
with ThreadPoolExecutor(6) as ex: res=list(ex.map(one,list(cats)))
json.dump(res,open('ri-products.json','w'),indent=1)
print(sum(1 for r in res if r.get('name')),'with JSON-LD')
for r in res: print(r['url'].split('.com/')[1],'|',r.get('name'),'|',r.get('price'),r.get('cur'),'|',(r.get('avail') or '').split('/')[-1],'|',r['cats'][:2])
