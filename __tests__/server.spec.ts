import * as Koa from 'koa';
import server from '../src/server';
import 'jest';
describe('index', () => {
  it('should create an instance of a Koa server', () => {
    const instance = server();
    expect(instance).toBeInstanceOf(Koa);
  });
});
