import csv
import json
import os
import re
import sys
import time
import urllib.request
import urllib.parse
from concurrent.futures import ThreadPoolExecutor, as_completed

CSV_FILE = 'wc-product-export-17-11-2026-1794918972885.csv'
ASSETS_PRODUCTS_DIR = os.path.join('assets', 'products')
PRODUCTS_JS = os.path.join('js', 'products.js')
PRODUCTS_JSON = 'products.json'

def slugify(text):
    text = text.lower()
    text = re.sub(r'[\'\"’“”]', '', text)
    text = re.sub(r'[^a-z0-9]+', '-', text)
    return text.strip('-')

def url_to_local_filename(url):
    parsed = urllib.parse.urlparse(url)
    path = parsed.path.strip('/')
    parts = path.split('/')
    if 'uploads' in parts:
        idx = parts.index('uploads')
        subparts = parts[idx+1:]
        fname = "_".join(subparts)
    else:
        fname = parts[-1]
    fname = re.sub(r'[^a-zA-Z0-9_\.\-]', '_', fname)
    return fname

def parse_categories(cat_str):
    if not cat_str:
        return []
    raw_cats = [c.strip() for c in cat_str.split(',') if c.strip()]
    cleaned = []
    for c in raw_cats:
        if '>' in c:
            hierarchy = [h.strip() for h in c.split('>') if h.strip()]
            cleaned.extend(hierarchy)
        else:
            cleaned.append(c)
    seen = set()
    result = []
    for c in cleaned:
        if c not in seen:
            seen.add(c)
            result.append(c)
    return result

def clean_description_html(html_str):
    if not html_str:
        return ""
    clean = html_str.replace('\\n', '\n').replace('\\t', '\t').replace('\\r', '')
    return clean

def download_one_image(url, target_path):
    if os.path.exists(target_path) and os.path.getsize(target_path) > 100:
        return url, target_path, True, None
    retries = 3
    for attempt in range(retries):
        try:
            req = urllib.request.Request(url, headers={'User-Agent': 'curl/8.4.0'})
            with urllib.request.urlopen(req, timeout=15) as resp:
                data = resp.read()
                if len(data) > 0:
                    with open(target_path, 'wb') as f:
                        f.write(data)
                    return url, target_path, True, None
                else:
                    return url, url, False, 'Empty response'
        except urllib.error.HTTPError as e:
            if e.code == 429:
                time.sleep(2.0 * (attempt + 1))
                continue
            return url, url, False, f"HTTP Error {e.code}"
        except Exception as e:
            if attempt < retries - 1:
                time.sleep(1.5)
                continue
            return url, url, False, str(e)
    return url, url, False, 'Max retries exceeded (429 rate limit)'

def download_images(urls, max_workers=6):
    os.makedirs(ASSETS_PRODUCTS_DIR, exist_ok=True)
    url_to_path = {}
    failed_downloads = []

    print(f"Checking / downloading {len(urls)} unique images using {max_workers} threads with retry...")
    t0 = time.time()
    
    tasks = []
    with ThreadPoolExecutor(max_workers=max_workers) as executor:
        for url in urls:
            fname = url_to_local_filename(url)
            local_rel_path = f"assets/products/{fname}"
            local_full_path = os.path.join(ASSETS_PRODUCTS_DIR, fname)
            tasks.append((executor.submit(download_one_image, url, local_full_path), url, local_rel_path))

        completed = 0
        for future, url, rel_path in tasks:
            u, path, success, err = future.result()
            completed += 1
            if success:
                url_to_path[u] = rel_path
            else:
                url_to_path[u] = u
                failed_downloads.append((u, err))
            if completed % 100 == 0 or completed == len(tasks):
                print(f"  Processed {completed}/{len(tasks)} images ({(completed/len(tasks))*100:.1f}%) in {time.time()-t0:.1f}s")

    print(f"Done in {time.time()-t0:.1f}s. Successfully mapped: {len(url_to_path) - len(failed_downloads)}, Failed: {len(failed_downloads)}")
    return url_to_path, failed_downloads

def main():
    skip_downloads = '--no-download' in sys.argv

    if not os.path.exists(CSV_FILE):
        print(f"ERROR: {CSV_FILE} not found!")
        sys.exit(1)

    with open(CSV_FILE, mode='r', encoding='utf-8') as f:
        reader = csv.DictReader(f)
        rows = list(reader)

    parents_raw = [r for r in rows if r['Type'] in ('simple', 'variable')]
    variations_raw = [r for r in rows if r['Type'] == 'variation']

    print(f"Loaded {len(rows)} CSV rows:")
    print(f"  - Simple products: {sum(1 for r in parents_raw if r['Type']=='simple')}")
    print(f"  - Variable products: {sum(1 for r in parents_raw if r['Type']=='variable')}")
    print(f"  - Variation rows: {len(variations_raw)}")
    print(f"  - Total parent products: {len(parents_raw)}")

    # Collect all image URLs
    all_image_urls = set()
    for r in rows:
        for u in r.get('Images', '').split(','):
            u = u.strip()
            if u:
                all_image_urls.add(u)

    print(f"Found {len(all_image_urls)} unique image URLs in catalog.")

    if skip_downloads:
        print("Skipping image download (--no-download specified). Checking existing local files.")
        url_map = {}
        failed_downloads = []
        for u in all_image_urls:
            fname = url_to_local_filename(u)
            local_rel = f"assets/products/{fname}"
            local_full = os.path.join(ASSETS_PRODUCTS_DIR, fname)
            if os.path.exists(local_full) and os.path.getsize(local_full) > 100:
                url_map[u] = local_rel
            else:
                url_map[u] = u
    else:
        url_map, failed_downloads = download_images(all_image_urls, max_workers=20)

    # Variations map by Parent SKU
    var_by_parent_sku = {}
    for v in variations_raw:
        p_sku = v['Parent'].strip()
        var_by_parent_sku.setdefault(p_sku, []).append(v)

    # Process all parent products
    used_slugs = set()
    products = []
    
    for r in parents_raw:
        pid = r['\ufeffID'].strip()
        sku = r['SKU'].strip()
        name = r['Name'].strip()
        
        # Unique slug generation
        base_slug = slugify(name)
        if not base_slug:
            base_slug = f"product-{pid}"
        slug = base_slug
        if slug in used_slugs:
            sku_slug = slugify(sku)
            if sku_slug and f"{base_slug}-{sku_slug}" not in used_slugs:
                slug = f"{base_slug}-{sku_slug}"
            else:
                slug = f"{base_slug}-{pid}"
        used_slugs.add(slug)

        raw_categories = parse_categories(r.get('Categories', ''))
        # Filter out internal WordPress layout template categories for clean display
        display_categories = [c for c in raw_categories if not c.lower().startswith('layout')]

        raw_images = [img.strip() for img in r.get('Images', '').split(',') if img.strip()]
        local_images = [url_map.get(u, u) for u in raw_images]

        # Parse attributes
        attributes = []
        for i in range(1, 10):
            name_k = f'Attribute {i} name'
            val_k = f'Attribute {i} value(s)'
            if name_k in r and r[name_k]:
                attributes.append({
                    'name': r[name_k].strip(),
                    'values': [v.strip() for v in r.get(val_k, '').split(',') if v.strip()],
                    'visible': r.get(f'Attribute {i} visible', '').strip() == '1',
                    'global': r.get(f'Attribute {i} global', '').strip() == '1'
                })

        # Child variations
        child_vars = var_by_parent_sku.get(sku, [])
        parsed_vars = []
        var_prices = []
        for cv in child_vars:
            v_reg = cv.get('Regular price', '').strip()
            v_sale = cv.get('Sale price', '').strip()
            if v_sale:
                try: var_prices.append(float(v_sale))
                except: pass
            elif v_reg:
                try: var_prices.append(float(v_reg))
                except: pass

            v_attrs = []
            for i in range(1, 5):
                vn = cv.get(f'Attribute {i} name', '').strip()
                vv = cv.get(f'Attribute {i} value(s)', '').strip()
                if vn and vv:
                    v_attrs.append({'name': vn, 'value': vv})

            v_raw_imgs = [img.strip() for img in cv.get('Images', '').split(',') if img.strip()]
            v_local_imgs = [url_map.get(u, u) for u in v_raw_imgs]

            parsed_vars.append({
                'id': cv['\ufeffID'].strip(),
                'sku': cv['SKU'].strip(),
                'name': cv['Name'].strip(),
                'regularPrice': v_reg,
                'salePrice': v_sale,
                'images': v_local_imgs,
                'rawImages': v_raw_imgs,
                'attributes': v_attrs
            })

        # Calculate price display
        parent_reg = r.get('Regular price', '').strip()
        parent_sale = r.get('Sale price', '').strip()
        
        display_price = None
        min_price = None
        max_price = None

        if parent_sale:
            try: min_price = max_price = float(parent_sale)
            except: pass
        elif parent_reg:
            try: min_price = max_price = float(parent_reg)
            except: pass
        elif var_prices:
            min_price = min(var_prices)
            max_price = max(var_prices)

        if min_price is not None:
            if min_price == max_price:
                display_price = f"${min_price:.2f}"
            else:
                display_price = f"${min_price:.2f} - ${max_price:.2f}"

        products.append({
            'id': pid,
            'sku': sku,
            'name': name,
            'slug': slug,
            'type': r['Type'].strip(),
            'regularPrice': parent_reg,
            'salePrice': parent_sale,
            'price': min_price,
            'displayPrice': display_price,
            'categories': display_categories,
            'rawCategories': raw_categories,
            'images': local_images,
            'rawImages': raw_images,
            'image': local_images[0] if local_images else '',
            'shortDescription': clean_description_html(r.get('Short description', '')),
            'description': clean_description_html(r.get('Description', '')),
            'attributes': attributes,
            'variations': parsed_vars
        })

    # Save to products.json
    with open(PRODUCTS_JSON, 'w', encoding='utf-8') as f:
        json.dump(products, f, indent=2, ensure_ascii=False)
    print(f"Saved {len(products)} products to {PRODUCTS_JSON}")

    # Save to js/products.js
    with open(PRODUCTS_JS, 'w', encoding='utf-8') as f:
        f.write("/**\n * A Reusable Bag - Product Catalog Database\n * Auto-generated from WooCommerce Export by convert_products.py\n */\n")
        f.write("const PRODUCTS_DATA = ")
        json.dump(products, f, indent=2, ensure_ascii=False)
        f.write(";\n\nif (typeof module !== 'undefined' && module.exports) {\n  module.exports = PRODUCTS_DATA;\n}\n")
    print(f"Saved {len(products)} products to {PRODUCTS_JS}")

    # Save failed downloads report if any
    with open('failed_image_downloads.txt', 'w', encoding='utf-8') as f:
        for u, err in failed_downloads:
            f.write(f"{u} | {err}\n")
    if failed_downloads:
        print(f"WARNING: {len(failed_downloads)} images failed to download (saved to failed_image_downloads.txt)")
    else:
        print("SUCCESS: All images successfully downloaded and mapped!")

if __name__ == '__main__':
    main()
