const MarketGrid = ({ items, renderItem }) => {
  if (!items?.length) {
    return null;
  }
  return <div className="grid gap-3 sm:gap-4 grid-cols-1 md:grid-cols-2">{items.map(renderItem)}</div>;
};

export default MarketGrid;
