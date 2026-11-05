#!/usr/bin/env python3
"""Cache busting: reemplaza `?v=...` de los CSS/JS enlazados en los HTML por un hash
corto del contenido del archivo. Ejecutar después de editar css/ o js/.
Uso: python3 tools/cache-bust.py   (desde la raíz del proyecto)"""
import re, glob, hashlib, os
RX = re.compile(r'((?:href|src)="/?)((?:css|js)/[^"?]+)(?:\?v=[^"]*)?(")')
def h(path):
    return hashlib.sha1(open(path, 'rb').read()).hexdigest()[:8]
changed = 0
for f in glob.glob('*.html'):
    s = open(f, encoding='utf-8').read()
    n = RX.sub(lambda m: '%s%s?v=%s%s' % (m.group(1), m.group(2), h(m.group(2)), m.group(3)) if os.path.exists(m.group(2)) else m.group(0), s)
    if n != s:
        open(f, 'w', encoding='utf-8').write(n); changed += 1
print('HTML actualizados:', changed)
