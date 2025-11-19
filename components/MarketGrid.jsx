const MarketGrid = ({ items, renderItem }) => {
  if (!items?.length) {
    return null;
  }
  return <div className="grid gap-4 md:grid-cols-2">{items.map(renderItem)}</div>;
};

export default MarketGrid;
