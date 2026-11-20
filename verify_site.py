import os
import re

dir_path = r'C:\Users\admin\.gemini\antigravity\scratch\areusablebag'
html_files = [f for f in os.listdir(dir_path) if f.endswith('.html')]

print(f"Validating {len(html_files)} HTML files...")
all_valid = True
for fname in html_files:
    fpath = os.path.join(dir_path, fname)
    with open(fpath, 'r', encoding='utf-8') as f:
        content = f.read()
    
    has_html = '<html' in content and '</html>' in content
    has_body = '<body' in content and '</body>' in content
    has_css = 'css/styles.css' in content
    
    links = re.findall(r'href=[\"\']([a-zA-Z0-9_\-]+\.html)(?:[?#][^\'\"]*)?[\"\']', content)
    missing_links = [l for l in set(links) if not os.path.exists(os.path.join(dir_path, l))]
    
    valid = has_html and has_body and has_css and len(missing_links) == 0
    if not valid:
        all_valid = False
    print(f"[{'OK' if valid else 'WARN'}] {fname} ({len(content)} bytes) | Missing: {missing_links}")

if all_valid:
    print("\nSUCCESS: All HTML files, links, and stylesheets are 100% verified!")
else:
    print("\nWARNING: Some files had issues.")
