import json
import pathlib
import re
import xml.etree.ElementTree as ET

root = pathlib.Path(__file__).resolve().parents[1]
app = json.loads((root / 'app.json').read_text(encoding='utf-8'))
errors = []
if app['window'].get('navigationStyle', 'default') != 'default':
    errors.append('Business pages must use WeChat native navigation')
if 'nav-bar' in app.get('usingComponents', {}):
    errors.append('Custom back navigation must not be registered globally')
for page in app['pages']:
    for suffix in ('.js', '.json', '.wxml', '.wxss'):
        if not (root / (page + suffix)).is_file():
            errors.append('Missing page file: ' + page + suffix)
    config = json.loads((root / (page + '.json')).read_text(encoding='utf-8'))
    if page != 'pages/launch/index' and config.get('navigationStyle', app['window'].get('navigationStyle')) != 'default':
        errors.append(page + ': native navigation is required')
    if '<nav-bar' in (root / (page + '.wxml')).read_text(encoding='utf-8'):
        errors.append(page + ': custom nav-bar must be removed')
for file in root.rglob('*.wxml'):
    content = file.read_text(encoding='utf-8')
    # WXML expressions are parsed before XML entities are decoded. An XML-only
    # check would incorrectly accept &amp;&amp; as a JavaScript logical operator.
    for expression in re.findall(r'{{[\s\S]*?}}', content):
        if re.search(r'&(amp|lt|gt|quot|apos);|&#(?:x[0-9a-fA-F]+|[0-9]+);', expression):
            errors.append(f'{file.relative_to(root)}: XML entity inside WXML expression: {expression}')
    try:
        # Bare wx:else is valid WXML; normalize only for the generic XML parser.
        xml = re.sub(r'\bwx:else(?=\s|/|>)', 'wx:else="true"', content)
        ET.fromstring('<root>' + xml.replace('wx:', 'wx_') + '</root>')
    except ET.ParseError as exc:
        errors.append(f'{file.relative_to(root)}: {exc}')
    for path in re.findall(r'src="(/assets/[^"{]+)"', content):
        if not (root / path.lstrip('/')).is_file():
            errors.append(f'{file.relative_to(root)}: missing asset {path}')
for file in root.rglob('*.js'):
    if 'scripts' in file.relative_to(root).parts:
        continue
    for path in re.findall(r"['\"](/pages/[^?'\"]+)", file.read_text(encoding='utf-8')):
        if path.lstrip('/') not in app['pages']:
            errors.append(f'{file.relative_to(root)}: unregistered route {path}')
for name in ('bayue-floral-cutout.png', 'bubupie-wordmark.png', 'bubupie-avatar.png'):
    if (root / 'assets' / name).stat().st_size == 0:
        errors.append('Empty asset: ' + name)
print('\n'.join(errors) if errors else f"OK: {len(app['pages'])} pages, WXML and local asset references")
raise SystemExit(bool(errors))
