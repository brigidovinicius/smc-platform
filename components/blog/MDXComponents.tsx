const MDXComponents = {
  h1: (props: any) => <h1 className="text-4xl font-bold mt-8 mb-4 text-foreground" {...props} />,
  h2: (props: any) => <h2 className="text-3xl font-semibold mt-8 mb-3 text-foreground" {...props} />,
  p: (props: any) => <p className="leading-relaxed text-foreground" {...props} />,
  ul: (props: any) => <ul className="list-disc list-inside text-foreground" {...props} />,
  ol: (props: any) => <ol className="list-decimal list-inside text-foreground" {...props} />,
  a: (props: any) => <a className="text-primary hover:text-primary/80 underline" {...props} />
};

export default MDXComponents;
