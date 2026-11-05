#!/usr/bin/env python3
"""Genera css/icons.css con SOLO los iconos de Font Awesome usados en el sitio.
Escanea *.html y js/app.js buscando `fa-<estilo> fa-<nombre>`, descarga cada SVG
(Font Awesome Free 6.5.1) y los incrusta como máscara CSS. Requiere internet.
Uso: python3 tools/build-icons.py   (ejecutar desde la raíz del proyecto)"""
import re, glob, urllib.request, urllib.parse
BASE = 'https://cdn.jsdelivr.net/npm/@fortawesome/fontawesome-free@6.5.1/svgs/%s/%s.svg'
STYLE = {'fa-solid': 'solid', 'fa-regular': 'regular', 'fa-brands': 'brands'}
used = set()
for f in glob.glob('*.html') + ['js/app.js']:
    for st, name in re.findall(r'(fa-solid|fa-regular|fa-brands) fa-([a-z0-9-]+)', open(f, encoding='utf-8').read()):
        if name not in ('spin',): used.add((STYLE[st], name))
css = ['/* Generado por tools/build-icons.py — no editar a mano. */',
 '.fa-solid,.fa-regular,.fa-brands{display:inline-block;width:1em;height:1em;vertical-align:-.125em;'
 'background-color:currentColor;-webkit-mask:var(--i) center/contain no-repeat;mask:var(--i) center/contain no-repeat;flex-shrink:0;}',
 '.fa-spin{animation:fa-spin 1s linear infinite;}@keyframes fa-spin{to{transform:rotate(360deg);}}']
for st, name in sorted(used):
    svg = urllib.request.urlopen(BASE % (st, name), timeout=15).read().decode()
    svg = re.sub(r'<!--.*?-->', '', svg, flags=re.S).strip()
    data = urllib.parse.quote(svg, safe="/:=,'()- ")
    css.append('.fa-%s.fa-%s{--i:url("data:image/svg+xml,%s");}' % (st, name, data))
open('css/icons.css', 'w', encoding='utf-8').write('\n'.join(css) + '\n')
print(len(used), 'iconos ->', 'css/icons.css')
