"""Curated selection for the Drones & Robotics directory category (Nov 25, 2026, America/Chicago).
Sources: Robots International = Product JSON-LD on each product page; Autel = shop.autelrobotics.com/products.json;
RobotShop = product pages + collection pages read Nov 25, 2026 (store is behind a Cloudflare challenge for plain curl);
HOVERAir = hoverair.com landing pages (no products.json; prices not published in machine-readable form, so none shown).
Skipped on purpose: parts, accessories, chassis, batteries, education/EDU kits and dev editions, toys, humanoids,
agricultural drones, EOD/bomb-disposal, counter-drone gear, anything weaponized, sold-out or $0/placeholder-price items."""
import json,re,os
HERE=os.path.dirname(os.path.abspath(__file__))
RI=json.load(open(os.path.join(HERE,'ri-products.json')))
AUTEL=json.load(open(os.path.join(HERE,'autel-products.json')))
RI_SEL=[0,1,2,3,4,5,13,14,15,16,17,19,20,21,30,35,36,37,42,43,44,45,47,48,49,52,53,54,55,56,63,64,65,66,67,68,73,75,76,78,79,80,81,83,89,90,91,92,93,94,98,99,101,103,104,111,114,147,179,186,187,188,189]
AUTEL_SEL=['evo-max-4n-copy','evo-lite-6k-enterprise-copy','evo-lite-copy','evo-max-4t-copy','evo-alpha','evo-ii-dual-640t-enterprise-bundle-v3','evo-ii-dual-640t-rtk-rugged-bundle-v3','evo-ii-pro-6k-rtk-rugged-bundle-v3','evo-ii-pro-6k-enterprise-bundle-v3','evo-ii-dual-640t-rugged-bundle-v3','evo-ii-pro-v3-rugged-bundle-1','drones-evo-lite-plus']
# RobotShop: (handle, title, price, availability, short factual blurb)
ROBOTSHOP=[
 ('unitree-go2-air-robotic-dog-us','Unitree Go2 AIR Robotic Dog',2688.00,'In stock','The entry model in the Go2 line: a four-legged robot with a 4D LiDAR and HD camera, driven from a phone app. RobotShop lists about 2.5 m/s top speed and 1 to 2 hours per charge.'),
 ('unitree-go2-pro-robotic-dog','Unitree Go2 PRO Robotic Dog',3706.00,'In stock','Adds voice commands, follow-me and built-in 4G and GPS to the Go2 AIR, per RobotShop. About 3.5 m/s top speed and 1 to 2 hours per charge.'),
 ('unitree-go2-x-robotic-dog','Unitree Go2 X Robotic Dog',5990.00,'In stock','The top consumer Go2 tier on RobotShop: voice control, follow-me, charging-pile docking and a handheld controller. The Unitree SDK and ROS2 need an optional onboard computer, sold separately.'),
 ('unitree-a2-robotic-dog','Unitree A2 Robotic Dog',31900.00,'Special order','An industrial-class quadruped with dual hot-swappable batteries, LiDAR and an HD camera. RobotShop lists up to 100 kg standing load and 45° slopes. Sold for inspection, logistics and research work.'),
 ('unitree-a2-pro-robotic-dog','Unitree A2 PRO Robotic Dog',40900.00,'Special order','The A2 with dual LiDAR units and optional GPS, 4G and a compute dock, per RobotShop. Aimed at inspection, logistics and research users.'),
 ('unitree-as2-air-quadruped-robot','Unitree As2 AIR Quadruped Robot',15000.00,'Special order','A compact quadruped with a LiDAR and HD camera for facility patrol and inspection. RobotShop lists about 2 hours unloaded and a -20°C to 50°C operating range.'),
 ('unitree-as2-x-quadruped-robot','Unitree As2 X Quadruped Robot',9500.00,'Special order','A compact industrial-capability quadruped with LiDAR, HD camera and a larger battery. RobotShop lists IP54 and -20°C to 50°C, with 4+ hours unloaded.'),
 ('deep-robotics-lite3-basic-quadruped-robot','Deep Robotics Lite3 Basic Quadruped Robot',6600.00,'Special order','Deep Robotics positions the Lite3 as an entertainment, education and research quadruped. The Basic tier has a camera and ultrasonic radar and is controlled from an Android app.'),
 ('deep-robotics-lite3-venture-quadruped-robot','Deep Robotics Lite3 Venture Quadruped Robot',7986.00,'Special order','The Lite3 with dual Ethernet ports and an external power interface for developers who want to add their own hardware. Android app control.'),
 ('deep-robotics-lite3-pro-quadruped-robot','Deep Robotics Lite3 Pro Quadruped Robot',15290.00,'Special order','The Lite3 with a depth camera and an onboard NVIDIA Jetson computer for perception development. Android app control.'),
 ('deep-robotics-lite3-lidar-quadruped-robot','Deep Robotics Lite3 Lidar Quadruped Robot',22990.00,'Special order','The Lite3 with LiDAR and an onboard computer, built for navigation and mapping development.'),
 ('deep-robotics-x30-pro-industrial-quadruped-robot','Deep Robotics X30 Pro Industrial Quadruped Robot',138600.00,'Special order','An IP67 industrial quadruped that RobotShop describes for inspection, investigation and security work in hazardous sites. Listed range is -20°C to 55°C with swappable batteries.'),
 ('dagu-crawler-fire-fighting-robot','Dagu Crawler Fire Fighting Robot',36395.00,'Special order','A remote-controlled tracked robot with a water and foam cannon, described for petrochemical sites, tank areas and warehouses. Meant for trained operators.'),
]
HOVER=[
 ('hoverair-x1-pro-promax','HOVERAir X1 PRO and PROMAX','https://hoverair.com/pages/x1-pro-and-promax','A small self-flying camera drone, with the PROMAX adding 8K video per HOVERAir. A way to get a quick look over a property or trail. It is a camera drone, not a search-and-rescue tool.'),
 ('hoverair-aqua','HOVERAir AQUA','https://hoverair.com/pages/aqua','HOVERAir describes the AQUA as a waterproof self-flying camera for water sports. Check the official page for the waterproof rating and limits before relying on it near water.'),
 ('hoverair-x1-smart','HOVERAir X1 Smart','https://hoverair.com/pages/x1-smart','A 99 g self-flying camera, per HOVERAir. A very light pocket option for casual aerial shots.'),
 ('hoverair-x1','HOVERAir X1','https://hoverair.com/pages/x1','The original pocket-size self-flying camera for hands-free shots. Check the official page for current availability.'),
 ('hoverair-versa','HOVERAir Versa','https://hoverair.com/pages/versa','A pocket camera that can also fly, aimed at vlogging. Check the official page for specs and local flying rules.'),
]
