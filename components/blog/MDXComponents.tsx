const MDXComponents = {
  h1: (props: any) => (
    <h1 className="text-2xl sm:text-3xl md:text-4xl font-bold mt-8 sm:mt-10 mb-4 sm:mb-6 text-foreground leading-tight" {...props} />
  ),
  h2: (props: any) => (
    <h2 className="text-xl sm:text-2xl md:text-3xl font-semibold mt-6 sm:mt-8 mb-3 sm:mb-4 text-foreground leading-tight" {...props} />
  ),
  h3: (props: any) => (
    <h3 className="text-lg sm:text-xl md:text-2xl font-semibold mt-5 sm:mt-6 mb-2 sm:mb-3 text-foreground leading-tight" {...props} />
  ),
  h4: (props: any) => (
    <h4 className="text-base sm:text-lg md:text-xl font-semibold mt-4 sm:mt-5 mb-2 text-foreground leading-tight" {...props} />
  ),
  p: (props: any) => (
    <p className="text-sm sm:text-base leading-6 sm:leading-7 text-foreground mb-3 sm:mb-4" {...props} />
  ),
  ul: (props: any) => (
    <ul className="list-disc list-inside mb-3 sm:mb-4 space-y-1 sm:space-y-2 text-foreground ml-2 sm:ml-4" {...props} />
  ),
  ol: (props: any) => (
    <ol className="list-decimal list-inside mb-3 sm:mb-4 space-y-1 sm:space-y-2 text-foreground ml-2 sm:ml-4" {...props} />
  ),
  li: (props: any) => (
    <li className="text-sm sm:text-base leading-6 sm:leading-7 text-foreground" {...props} />
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
    <code className="bg-muted px-1.5 py-0.5 rounded text-xs sm:text-sm font-mono text-foreground break-words" {...props} />
  ),
  pre: (props: any) => (
    <pre className="bg-muted p-3 sm:p-4 rounded-lg overflow-x-auto mb-3 sm:mb-4 text-xs sm:text-sm" {...props} />
  ),
  blockquote: (props: any) => (
    <blockquote className="border-l-4 border-primary pl-3 sm:pl-4 italic text-muted-foreground my-3 sm:my-4 text-sm sm:text-base" {...props} />
  ),
  hr: (props: any) => (
    <hr className="my-6 sm:my-8 border-border" {...props} />
  ),
  table: (props: any) => (
    <div className="overflow-x-auto my-3 sm:my-4 -mx-2 sm:mx-0">
      <table className="min-w-full border-collapse border border-border text-sm sm:text-base" {...props} />
    </div>
  ),
  th: (props: any) => (
    <th className="border border-border px-2 sm:px-4 py-1.5 sm:py-2 bg-muted font-semibold text-left text-xs sm:text-sm" {...props} />
  ),
  td: (props: any) => (
    <td className="border border-border px-2 sm:px-4 py-1.5 sm:py-2 text-xs sm:text-sm" {...props} />
  ),
};

export default MDXComponents;
