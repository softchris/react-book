export const getProducts = async () => {
  const products = await Promise.resolve([{ name: 'test' }]);
  return products;
}
