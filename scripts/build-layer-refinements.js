// Refine the existing editable vector layers, preserving their shared fitting coordinates.
const fs = require('fs'), path = require('path'), { createRequire } = require('module');
const bundled = createRequire('C:/Program Files/WindowsApps/OpenAI.CodexPrimaryRuntime.v26-1119-907-0_26.1119.907.0_x64__3k8sg7r9htsxt/dependencies/node/node_modules/_.js');
const sharp = bundled('sharp');
const source = path.resolve(__dirname, '../assets/wardrobe/sources');
const out = path.resolve(__dirname, '../assets/wardrobe-v38/layers');
const colors = {
  '#f4e4c9': ['#fff3dc','#efdfc4','#d9c4a2'], '#2e6467': ['#477e7e','#2e6467','#1d464b'],
  '#c86b55': ['#e59277','#c86b55','#984d3e'], '#cb7159': ['#e58e73','#cb7159','#a85944'],
  '#4c7f80': ['#71a09d','#4c7f80','#315d61'], '#f3e4ca': ['#fff2db','#f3e4ca','#d5bf9e'],
  '#34475b': ['#52677c','#34475b','#233448'], '#303c4b': ['#526173','#303c4b','#202d3b'],
  '#dac39d': ['#efddbb','#dac39d','#b29a76'], '#2c686c': ['#4e8c8e','#2c686c','#174d55'],
  '#bb5942': ['#d78164','#bb5942','#8b3d30'], '#527e80': ['#7ba4a0','#527e80','#335f64'],
  '#427174': ['#679594','#427174','#2a555c']
};
async function main() {
  fs.mkdirSync(path.join(out, 'sources'), {recursive:true});
  for (const name of ['base','silk-top','work-top','arcade-top','silk-bottom','work-bottom','arcade-bottom','teal-shoes','brick-shoes','flower-head','hat-head']) {
    let svg = fs.readFileSync(path.join(source,name+'.svg'),'utf8');
    let defs = '<filter id="material" x="-10%" y="-10%" width="120%" height="125%"><feTurbulence type="fractalNoise" baseFrequency="1.1 .55" numOctaves="2" seed="8" result="grain"/><feColorMatrix in="grain" type="saturate" values="0"/><feComponentTransfer><feFuncA type="linear" slope=".18"/></feComponentTransfer><feComposite in2="SourceGraphic" operator="in" result="cloth"/><feBlend in="SourceGraphic" in2="cloth" mode="soft-light"/></filter><filter id="lift" x="-10%" y="-10%" width="120%" height="125%"><feDropShadow dx="0" dy="1.4" stdDeviation="1.4" flood-color="#30271e" flood-opacity=".17"/></filter>';
    Object.entries(colors).forEach(([color,stops],i)=>{
      const id = 'fabric'+i;
      defs += '<linearGradient id="'+id+'" x1="0" y1="0" x2=".9" y2="1">'+stops.map((c,j)=>'<stop offset="'+[0,.45,1][j]+'" stop-color="'+c+'"/>').join('')+'</linearGradient>';
      svg=svg.replaceAll('fill="'+color+'"','fill="url(#'+id+')"');
    });
    svg=svg.replace('</defs>',defs+'</defs><g filter="url(#material)">').replace('</svg>','</g></svg>');
    if(name!=='base') svg=svg.replace('<g filter="url(#material)">','<g filter="url(#lift)"><g filter="url(#material)">').replace('</svg>','</g></svg>');
    fs.writeFileSync(path.join(out,'sources',name+'.svg'),svg);
    await sharp(Buffer.from(svg)).resize(600,750).png().toFile(path.join(out,name+'.png'));
  }
  console.log('Refined 11 editable vector layers: fabric shading, subtle weave and contact shadows; fitting coordinates preserved.');
}
main().catch(e=>{console.error(e);process.exitCode=1;});
