jest.mock('../src/definitions');

const UCA = require('../src/UserCollectableAttribute');

describe('UCA Constructions tests', () => {
  test('Wrong type', () => {
    const identifier = 'myMockedId';
    const value = {
      country: 'DE',
      state: 'Berlin',
      county: 'Berlin',
      city: 'Berlin',
      postalCode: '15123',
      street: 'Ruthllardstr',
      unit: '12',
    };
    try {
      const uca = new UCA(identifier, value);
      expect(uca).toBe('Should not pass here');
    } catch (e) {
      expect(e).toBeDefined();
      expect(e.message).toBe(`${JSON.stringify(value)} is not valid for ${identifier}`);
    }
  });

  test('Get all properties of a String type', () => {
    const properties = UCA.getAllProperties('my:Mocked:Id2');
    expect(properties).toBeInstanceOf(Array);
    expect(properties.length).toBe(1);
    expect(properties[0]).toBe('mocked.Id2');
  });

  test('Creating UCA from a Boolean type', () => {
    const identifier = 'my:Mocked:Id3';
    const value = true;
    const uca = new UCA(identifier, value);
    expect(uca).toBeDefined();
  });

  test('Creating date of birth UCA successfuly', () => {
    const identifier = 'cvc:Identity:dateOfBirth';
    const value = {
      day: 20,
      month: 3,
      year: 1978,
    };
    const v = new UCA(identifier, value);
    expect(v).toBeDefined();
    expect(v.value.day.value).toBe(value.day);
    expect(v.value.month.value).toBe(value.month);
    expect(v.value.year.value).toBe(value.year);
  });

  test('Should construct UCA which type is of another UCA', () => {
    const identifier = 'cvc:Verify:phoneNumberToken';
    const value = '12345';
    const uca = new UCA(identifier, value);
    expect(uca).toBeDefined();
  });

  test('Should construct UCA with array', () => {
    const identifier = 'cvc:Collection.records';
    const value = [
      'Belo Horizonte',
      'Brazil',
      'Minas Gerais',
    ];
    const uca = new UCA(identifier, value);
    expect(uca).toBeDefined();
  });

  test('Should apply constraints when constructing UCA from another UCA type', () => {
    const identifier = 'cvc:Verify:phoneNumberToken';
    const value = 'incorrect-format-token';
    expect(() => (
      new UCA(identifier, value)
    )).toThrow();
  });
});
