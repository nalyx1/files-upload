import { Person } from '@/index'

it('should say person name', () => {
  const sut = new Person()
  expect(sut.sayMyName()).toBe('Joao')
})
