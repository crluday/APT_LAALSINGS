# zap.sh -daemon \
#   -host 0.0.0.0 \
#   -port 8090 \
#   -config api.disablekey=true
# python3 zap_cli.py http://vulnerable.lab
from zapv2 import ZAPv2
import time
import sys
import json

if len(sys.argv) != 2:
    print("Usage: python3 zap_aggressive_scan.py <target_url>")
    sys.exit(1)

TARGET = sys.argv[1]

ZAP_PROXY = "http://127.0.0.1:8090"

zap = ZAPv2(proxies={
    'http': ZAP_PROXY,
    'https': ZAP_PROXY
})

print("[+] Starting aggressive scan against:", TARGET)

# ------------------------------------
# 1. Access target (adds to Sites tree)
# ------------------------------------
zap.urlopen(TARGET)
time.sleep(2)

# ------------------------------------
# 2. SPIDER (FULL CRAWL)
# ------------------------------------
print("[+] Spidering target...")
spider_id = zap.spider.scan(TARGET, recurse=True)

while int(zap.spider.status(spider_id)) < 100:
    print(f"[+] Spider progress: {zap.spider.status(spider_id)}%")
    time.sleep(2)

print("[+] Spider completed")

# ------------------------------------
# 3. AJAX SPIDER (JS HEAVY APPS)
# ------------------------------------
print("[+] AJAX Spidering...")
zap.ajaxSpider.scan(TARGET)

timeout = 120
while zap.ajaxSpider.status == 'running' and timeout > 0:
    print("[+] AJAX Spider running...")
    time.sleep(5)
    timeout -= 5

zap.ajaxSpider.stop()
print("[+] AJAX Spider completed")

# ------------------------------------
# 4. ENABLE ALL ACTIVE SCANNERS
# ------------------------------------
print("[+] Enabling all active scanners (aggressive mode)")
zap.ascan.enable_all_scanners()

# ------------------------------------
# 5. ACTIVE SCAN (AGGRESSIVE)
# ------------------------------------
print("[+] Starting active scan...")
ascan_id = zap.ascan.scan(
    TARGET,
    recurse=True,
    inscopeonly=False,
    scanpolicyname=None,
    method=None,
    postdata=None
)

while int(zap.ascan.status(ascan_id)) < 100:
    print(f"[+] Active scan progress: {zap.ascan.status(ascan_id)}%")
    time.sleep(5)

print("[+] Active scan completed")

# ------------------------------------
# 6. COLLECT RESULTS
# ------------------------------------
alerts = zap.core.alerts(baseurl=TARGET)

# ------------------------------------
# 7. OUTPUT JSON (GUI FRIENDLY)
# ------------------------------------
results = {
    "target": TARGET,
    "total_alerts": len(alerts),
    "alerts": alerts
}

print(json.dumps(results, indent=2))
#Output filtering
def parse_redteam_output(alerts):
    attack_surface = {
        "endpoints": set(),
        "parameters": set(),
        "technologies": set()
    }

    vulnerabilities = []
    sensitive = {
        "cookies": [],
        "headers": [],
        "files": []
    }

    for alert in alerts:
        url = alert.get("url", "")
        param = alert.get("param", "")
        attack = alert.get("attack", "")
        evidence = alert.get("evidence", "")
        risk = alert.get("risk", "")
        name = alert.get("alert", "")

        # -------------------------
        # Attack Surface Collection
        # -------------------------
        if url:
            attack_surface["endpoints"].add(url)
        if param:
            attack_surface["parameters"].add(param)

        # -------------------------
        # Vulnerability Extraction
        # -------------------------
        if risk in ["High", "Medium"]:
            vulnerabilities.append({
                "name": name,
                "risk": risk,
                "url": url,
                "param": param,
                "payload": attack,
                "evidence": evidence,
                "attack_vector": "parameter" if param else "endpoint"
            })

        # -------------------------
        # Sensitive Info Detection
        # -------------------------
        if "cookie" in name.lower():
            sensitive["cookies"].append({
                "url": url,
                "issue": name,
                "evidence": evidence
            })

        if "header" in name.lower():
            sensitive["headers"].append({
                "url": url,
                "issue": name,
                "evidence": evidence
            })

        if any(x in name.lower() for x in ["file", "path", "directory"]):
            sensitive["files"].append({
                "url": url,
                "issue": name,
                "evidence": evidence
            })

    # Convert sets → lists
    attack_surface["endpoints"] = list(attack_surface["endpoints"])
    attack_surface["parameters"] = list(attack_surface["parameters"])

    return attack_surface, vulnerabilities, sensitive
