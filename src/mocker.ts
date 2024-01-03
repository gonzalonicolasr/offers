export function mockear(clase: any): any {
  const mock: any = {};

  const nombresDeMetodos: string[] = Object.getOwnPropertyNames(clase['prototype']);

  for (const nombre of nombresDeMetodos) {
    mock[nombre] = jest.fn();
  }

  return mock;
}
