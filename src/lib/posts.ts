// Add Markdown files to src/content/posts. Required: title, date (YYYY-MM-DD), description.
const files = import.meta.glob('../content/posts/*.md', { eager: true });
export function getPosts() {
  return Object.entries(files).map(([path, module]: [string, any]) => {
    const data = module.frontmatter;
    if (!data?.title || !data?.date || !data?.description || Number.isNaN(Date.parse(data.date))) throw new Error(`文章元信息不完整：${path}`);
    return { slug: path.split('/').at(-1)!.replace(/\.md$/, ''), title: String(data.title), date: new Date(data.date).toISOString().slice(0, 10), description: String(data.description), tags: Array.isArray(data.tags) ? data.tags.map(String) : [], Content: module.Content, headings: module.getHeadings() };
  }).sort((a, b) => b.date.localeCompare(a.date));
}
