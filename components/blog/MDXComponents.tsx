const MDXComponents = {
  h1: (props: any) => (
    <h1 className="text-4xl font-bold mt-10 mb-6 text-foreground leading-tight" {...props} />
  ),
  h2: (props: any) => (
    <h2 className="text-3xl font-semibold mt-8 mb-4 text-foreground leading-tight" {...props} />
  ),
  h3: (props: any) => (
    <h3 className="text-2xl font-semibold mt-6 mb-3 text-foreground leading-tight" {...props} />
  ),
  h4: (props: any) => (
    <h4 className="text-xl font-semibold mt-5 mb-2 text-foreground leading-tight" {...props} />
  ),
  p: (props: any) => (
    <p className="text-base leading-7 text-foreground mb-4" {...props} />
  ),
  ul: (props: any) => (
    <ul className="list-disc list-inside mb-4 space-y-2 text-foreground ml-4" {...props} />
  ),
  ol: (props: any) => (
    <ol className="list-decimal list-inside mb-4 space-y-2 text-foreground ml-4" {...props} />
  ),
  li: (props: any) => (
    <li className="text-base leading-7 text-foreground" {...props} />
  ),
  a: (props: any) => (
    <a className="text-primary hover:text-primary/80 underline font-medium" {...props} />
  ),
  strong: (props: any) => (
    <strong className="font-semibold text-foreground" {...props} />
  ),
  em: (props: any) => (
    <em className="italic text-foreground" {...props} />
  ),
  code: (props: any) => (
    <code className="bg-muted px-1.5 py-0.5 rounded text-sm font-mono text-foreground" {...props} />
  ),
  pre: (props: any) => (
    <pre className="bg-muted p-4 rounded-lg overflow-x-auto mb-4" {...props} />
  ),
  blockquote: (props: any) => (
    <blockquote className="border-l-4 border-primary pl-4 italic text-muted-foreground my-4" {...props} />
  ),
  hr: (props: any) => (
    <hr className="my-8 border-border" {...props} />
  ),
  table: (props: any) => (
    <div className="overflow-x-auto my-4">
      <table className="min-w-full border-collapse border border-border" {...props} />
    </div>
  ),
  th: (props: any) => (
    <th className="border border-border px-4 py-2 bg-muted font-semibold text-left" {...props} />
  ),
  td: (props: any) => (
    <td className="border border-border px-4 py-2" {...props} />
  ),
};

export default MDXComponents;
