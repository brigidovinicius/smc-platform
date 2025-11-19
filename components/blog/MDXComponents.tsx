const MDXComponents = {
  h1: (props: any) => <h1 className="text-4xl font-bold mt-8 mb-4" {...props} />,
  h2: (props: any) => <h2 className="text-3xl font-semibold mt-8 mb-3" {...props} />,
  p: (props: any) => <p className="leading-relaxed text-slate-300" {...props} />,
  ul: (props: any) => <ul className="list-disc list-inside text-slate-300" {...props} />,
  ol: (props: any) => <ol className="list-decimal list-inside text-slate-300" {...props} />,
  a: (props: any) => <a className="text-blue-400 hover:text-blue-200" {...props} />
};

export default MDXComponents;
