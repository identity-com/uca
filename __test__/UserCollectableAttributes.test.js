const UCA = require('../src/UserCollectableAttribute');

describe('UCA Constructions tests', () => {
  test('UCA construction should fails', () => {
    function createUCA() {
      return new UCA('name.first', 'joao');
    }

    expect(createUCA).toThrowError('name.first is not defined');
  });

  test('UCA construction should succeed', () => {
    const v = new UCA('cvc:Name:givenNames', 'joao');
    expect(v).toBeDefined();
  });

  test('UCA should have identifier', () => {
    const identifier = 'cvc:Name:givenNames';
    const v = new UCA(identifier, 'joao');
    expect(v).toBeDefined();
    expect(v.identifier).toEqual(identifier);
    expect(v.version).toBeDefined();
  });

  test('UCA dont construct incomplete objects', () => {
    const identifier = 'cvc:Identity:name';
    const value = {
      familyNames: 'santos',
    };

    function createUCA() {
      return new UCA(identifier, value);
    }

    expect(createUCA).toThrowError('Missing required fields to cvc:Identity:name');
  });

  test('UCA dont construct invalid day', () => {
    const identifier = 'cvc:Identity:dateOfBirth';
    const value = {
      day: 40,
      month: 13,
      year: 1978,
    };

    function createUCA() {
      return new UCA(identifier, value);
    }

    expect(createUCA).toThrow();
  });

  test('UCA dont construct invalid month', () => {
    const identifier = 'cvc:Identity:dateOfBirth';
    const value = {
      day: 20,
      month: 13,
      year: 1978,
    };

    function createUCA() {
      return new UCA(identifier, value);
    }

    expect(createUCA).toThrow();
  });

  test('UCA dont construct invalid year', () => {
    const identifier = 'cvc:Identity:dateOfBirth';
    const value = {
      day: 20,
      month: 3,
      year: -1,
    };

    function createUCA() {
      return new UCA(identifier, value);
    }

    expect(createUCA).toThrow();
  });


  test('UCA has type String', () => {
    const identifier = 'cvc:Verify:phoneNumberToken';
    const value = '12345';
    const v = new UCA(identifier, value);
    expect(v).toBeDefined();
    expect(v.type).toEqual('String');
  });

  test('UCA has type Object:cvc:Identity:name', () => {
    const identifier = 'cvc:Identity:name';
    const value = {
      givenNames: 'joao',
    };
    const v = new UCA(identifier, value);
    expect(v).toBeDefined();
    expect(v.type).toEqual('Object');
  });

  test('UCA has incorrect object value', () => {
    const identifier = 'cvc:Identity:name';
    const value = {
      givenNames: 'Joao Paulo',
      familyNames: 'Barbosa Marques dos Santos',
    };
    const v = new UCA(identifier, value);

    expect(v).toBeDefined();
    expect(v.value).toHaveProperty('givenNames');
    expect(v.value.givenNames.value).toEqual('Joao Paulo');
    expect(v.value).toHaveProperty('familyNames');
    expect(v.value.familyNames.value).toEqual('Barbosa Marques dos Santos');
  });

  test('UCA has incorrect complex object value', () => {
    const identifier = 'cvc:Identity:dateOfBirth';
    const value = {
      day: 20,
      month: 3,
      year: 1978,
    };
    const v = new UCA(identifier, value);
    expect(v).toBeDefined();
  });


  test('Construct NameGivenNames', () => {
    const v = new UCA.NameGivenNames('Joao');
    expect(v).toBeDefined();
  });

  test('Construct NameGivenNames', () => {
    const v = new UCA.IdentityName({ givenNames: 'Joao', otherNames: 'Barbosa', familyNames: 'Santos' });
    expect(v).toBeDefined();
  });


  test('UCA return complex/multiple Attestatble Values', () => {
    const v = new UCA.IdentityName({ givenNames: 'Joao', otherNames: 'Barbosa', familyNames: 'Santos' });
    expect(v).toBeDefined();
  });

  test('UCA should Construct with a complex Attestatble Value: cvc:Identity:name', () => {
    try {
      // eslint-disable-next-line max-len
      const aComplexAttestableValue = 'urn:name.familyNames:c443e0a97a2df34573f910927e25c58e597e211152dfb650e6210facacc1a065:Santos|urn:name.givenNames:f14ab211784a3b3d2f20d423847a775ad56c3be8104a51aa084f0c94756d953b:Joao|urn:name.otherNames:09a31dab0a537ac5330a07df63effd9d2f55e91845956b58119843835f7dd9ed:Barbosa|';
      const v = new UCA.IdentityName({ attestableValue: aComplexAttestableValue });
      expect(v).toBeUndefined();
    } catch (e) {
      expect(e).toBeDefined();
      expect(e.message).toBeDefined();
      expect(e.message.indexOf('UserCollectableAttribute must not receive attestable value') >= 0).toBeTruthy();
    }
  });

  test('Construct a cvc:Meta:expirationDate', () => {
    const identifier = 'cvc:Meta:expirationDate';
    const isoDate = '2018-06-20T13:51:18.640Z';
    const v = new UCA(identifier, isoDate);
    expect(v).toBeDefined();
  });

  test('Construct a cvc:Contact:email UCA', () => {
    const identifier = 'cvc:Contact:email';
    const email = new UCA(identifier, { username: 'joao', domain: { name: 'civic', tld: 'com' } });
    const plain = email.getPlainValue();
    expect(plain.username).toBe('joao');
    expect(plain.domain).toBeDefined();
    expect(plain.domain.name).toBe('civic');
    expect(plain.domain.tld).toBe('com');
  });

  test('Construct a cvc:Contact:phoneNumber', () => {
    const identifier = 'cvc:Contact:phoneNumber';
    const phone = new UCA(identifier, {
      country: 'DE',
      countryCode: '49',
      number: '17225252255',
      lineType: 'mobile',
      extension: '111',
    });
    const plain = phone.getPlainValue();
    expect(plain.country).toBe('DE');
    expect(plain.countryCode).toBe('49');
    expect(plain.number).toBe('17225252255');
    expect(plain.extension).toBe('111');
    expect(plain.lineType).toBe('mobile');
  });

  test('Construct cvc:Type:address', () => {
    const identifier = 'cvc:Type:address';
    const address = new UCA(identifier, {
      country: 'DE',
      state: 'Berlin',
      county: 'Berlin',
      city: 'Berlin',
      postalCode: '15123',
      street: 'Ruthllardstr',
      unit: '12',
    });

    const plain = address.getPlainValue();
    expect(plain.country).toBe('DE');
    expect(plain.state).toBe('Berlin');
    expect(plain.county).toBe('Berlin');
    expect(plain.city).toBe('Berlin');
    expect(plain.unit).toBe('12');
    expect(plain.postalCode).toBe('15123');
    expect(plain.street).toBe('Ruthllardstr');
  });

  test('Should get ALL UCA properties email', () => {
    const properties = UCA.getAllProperties('cvc:Contact:email');
    expect(properties).toHaveLength(3);
    expect(properties).toContain('contact.email.username');
    expect(properties).toContain('contact.email.domain.name');
    expect(properties).toContain('contact.email.domain.tld');
  });

  test('Should get ALL UCA properties name', () => {
    const properties = UCA.getAllProperties('cvc:Identity:name');
    expect(properties).toHaveLength(3);
    expect(properties).toContain('identity.name.givenNames');
    expect(properties).toContain('identity.name.familyNames');
    expect(properties).toContain('identity.name.otherNames');
  });
});
