import re,json,urllib.request,time
def get(u):
    for i in range(3):
        try:
            return urllib.request.urlopen(urllib.request.Request(u,headers={'User-Agent':'Mozilla/5.0'}),timeout=60).read().decode('utf8','ignore')
        except Exception as e: err=e; time.sleep(2)
    print('ERR',u,err); return ''
cats=['Quadruped-Robots','Robot-Dogs','Security-Robots','Firefighting-Robots','Emergency-Response-Robots','Inspection-Robots','Drones','Government-Robots','SIASUN-Special-Robots','Unitree-Quadruped-Robots','FF-Quadruped-Robots','Standard-Quadrupeds','Wheeled-Quadrupeds','Unitree-Go2','Unitree-B2','Unitree-B1','Unitree-A2','Unitree-Go1','Unitree-Go2-W','Unitree-AlienGo-Quadruped']
res={}
for c in cats:
    p=1; links=[]; total=None
    while True:
        t=get(f'https://www.robotsinternational.com/{c}.htm?p={p}')
        i=t.find('id="toolbar-amount"')
        seg=t[i:i+500] if i>0 else ''
        nums=re.findall(r'toolbar-number">(\d+)',seg)
        k=t.find('class="products wrapper')
        grid=t[k:] if k>0 else ''
        # stop at related/slider sections: take until 2nd toolbar
        found=re.findall(r'<a class="product-item-link"\s+href="([^"]+)"',grid)
        if not found: found=re.findall(r'product-item-link"[^>]*href="([^"]+)"',grid)
        if total is None: total=int(nums[-1]) if nums else len(found)
        links+= [f for f in found if f not in links]
        if len(links)>=total or not found or p>12: break
        p+=1
    res[c]={'total':total,'links':links}
    print(c,total,len(links))
json.dump(res,open('ri-cat-products.json','w'),indent=1)
