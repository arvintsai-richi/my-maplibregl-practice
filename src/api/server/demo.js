import http from './';

export const forAdmin = http.defineGet('/Demo/ForAdmin');

export const getError = http.defineGet('/Demo/GetError');

export const sayHi = http.defineGet('/Demo/Hi/{firstName}/{lastName}');

export const getEnvironmentName = http.defineGet('/Demo/GetEnvironmentName');
