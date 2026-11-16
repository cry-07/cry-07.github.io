// 标题只在网页渲染时变更；保留原锚点，避免破坏已有笔记互链。
export function courseHeadings(md, chapters) {
  const render = md.renderer.render.bind(md.renderer);
  md.renderer.render = (tokens, options, env) => {
    const html = render(tokens, options, env);
    const titles = new Map();
    for (let i=0;i<tokens.length;i++) if(tokens[i].type==='heading_open') {
      const children = tokens[i+1].children || [];
      // VitePress 默认提取器略过公式 token；目录保留公式的文字表达。
      const text = children.filter(t=>['text','code_inline','math_inline'].includes(t.type)).map(t=>t.content).join('').trim();
      titles.set(tokens[i].attrGet('id'),text);
    }
    const update = headers => { for(const header of headers || []) { if(titles.has(header.slug)) header.title=titles.get(header.slug); update(header.children); } };
    update(env.headers);
    return html;
  };
  md.core.ruler.after('anchor', 'course-heading-numbers', state => {
    const slug = (state.env.relativePath || '').replace(/^notes\//, '').replace(/\.md$/, '');
    const chapter = chapters.find(c => c.slug === slug);
    if (!chapter) return;
    const counters = [0, 0, 0, 0, 0];
    for (let i=0;i<state.tokens.length;i++) {
      const token=state.tokens[i];
      if (token.type!=='heading_open') continue;
      const inline=state.tokens[i+1];
      const level=Number(token.tag.slice(1));
      // 冒号只从标题的普通文字中移除，公式里的符号不动。
      for(const child of inline.children || []) if(child.type==='text') child.content=child.content.replace(/[:：]/g,'');
      inline.content=inline.content.replace(/[:：]/g,'');
      if(level<2) continue;
      const depth=level-2;
      counters[depth]++;
      counters.fill(0,depth+1);
      for(let d=0;d<depth;d++) if(!counters[d]) counters[d]=1;
      const number=String(chapter.no).replace(/^0+(?=\d)/,'')+'.'+counters.slice(0,depth+1).join('.');
      const prefix=new state.Token('text','',0);
      prefix.content=number+' ';
      inline.children.unshift(prefix);
      inline.content=number+' '+inline.content;
      token.attrSet('data-section-number',number);
    }
  });
}
