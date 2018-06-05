export const getProducts = async () => {
  console.log('fetch products');
  const response = await fetch('http://myapi.com/products');
  const json = await response.json();
  console.log('products', json.products);
  return json.products;
}

