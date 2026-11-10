import {describe,it,expect} from 'vitest';import {formatRupees} from './test';
describe('currency display',()=>{it('converts integer paise to rupees',()=>expect(formatRupees('999900')).toBe('₹9,999'));it('handles zero',()=>expect(formatRupees(0)).toBe('₹0'));});
