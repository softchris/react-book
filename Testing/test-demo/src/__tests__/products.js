import nock from 'nock';
import { getProducts } from '../products';
nock.disableNetConnect();

describe('products', () => {
  it('should return a list', async() => {
    const scope = nock('http://myapi.com')
      .get('/products')
      .reply(200, {
        products: [{ id: 1, name: 'test' }]
      }, {
        'Access-Control-Allow-Origin': '*',
        'Content-type': 'application/json'
      });

    const products = await getProducts();
    expect(products.length).toBe(1);
    scope.done();
  })
})
