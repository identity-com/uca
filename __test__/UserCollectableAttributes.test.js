const UCA = require('../src/UserCollectableAttribute');
const ucaIndex = require('../src');

describe('UCA Constructions tests', () => {
  test('UCA construction for wrong identifier should fails', () => {
    function createUCA() {
      return new UCA('name.first', 'joao');
    }

    expect(createUCA).toThrowError();
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

  test('UCA dont construct invalid identifier', () => {
    const identifier = 'cvc:Not:exist';
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

  test('Should throw error when constructing UCA with a value not in the enum definition', () => {
    const identifier = 'cvc:Document:type';
    const value = 'invalid-document-type';
    function createUCA() {
      return new UCA(identifier, value);
    }
    expect(createUCA).toThrowError();
  });

  test('Should construct UCA when value is in the enum definition', () => {
    const identifier = 'cvc:Document:type';
    const value = 'passport';
    function createUCA() {
      return new UCA(identifier, value);
    }
    expect(createUCA).not.toThrowError();
  });

  test('Should throw error when constructing UCA with a value not matching the pattern', () => {
    const identifier = 'cvc:Verify:phoneNumberToken';
    const value = '1';
    function createUCA() {
      return new UCA(identifier, value);
    }
    expect(createUCA).toThrowError();
  });

  test('Should construct UCA when value matches the pattern in the definition', () => {
    const identifier = 'cvc:Verify:phoneNumberToken';
    const value = '12345';
    function createUCA() {
      return new UCA(identifier, value);
    }
    expect(createUCA).not.toThrowError();
  });

  test('cvc:Verify:phoneNumberToken must have type equals String', () => {
    const identifier = 'cvc:Verify:phoneNumberToken';
    const value = '12345';
    const v = new UCA(identifier, value);
    expect(v).toBeDefined();
    expect(v.type).toEqual('String');
  });

  test('Creation of Name must return type of object', () => {
    const identifier = 'cvc:Identity:name';
    const value = {
      givenNames: 'joao',
    };
    const v = new UCA(identifier, value);
    expect(v).toBeDefined();
    expect(v.type).toEqual('Object');
  });

  test('Creation of cvc:Identity:name successfuly', () => {
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

  test('Creating date of birth UCA with the minimum valid date', () => {
    const identifier = 'cvc:Identity:dateOfBirth';
    const value = {
      day: 1,
      month: 1,
      year: 1900,
    };
    const v = new UCA(identifier, value);
    expect(v).toBeDefined();
    expect(v.value.day.value).toBe(value.day);
    expect(v.value.month.value).toBe(value.month);
    expect(v.value.year.value).toBe(value.year);
  });

  test('Creating date of birth with invalid day', () => {
    const identifier = 'cvc:Identity:dateOfBirth';
    const value = {
      day: 32,
      month: 2,
      year: 1978,
    };
    function createUCA() {
      return new UCA(identifier, value);
    }

    expect(createUCA).toThrowError('32 is not valid for cvc:Type:day');
  });

  test('Creating date of birth with invalid month', () => {
    const identifier = 'cvc:Identity:dateOfBirth';
    const value = {
      day: 31,
      month: 13,
      year: 1978,
    };
    function createUCA() {
      return new UCA(identifier, value);
    }

    expect(createUCA).toThrowError('13 is not valid for cvc:Type:month');
  });

  test('Creating date of birth with invalid year', () => {
    const identifier = 'cvc:Identity:dateOfBirth';
    const value = {
      day: 31,
      month: 12,
      year: 1899,
    };
    function createUCA() {
      return new UCA(identifier, value);
    }

    expect(createUCA).toThrowError('1899 is not valid for cvc:Type:year');
  });

  test('Construct by NameGivenNames must result successfuly', () => {
    const v = new UCA.NameGivenNames('Joao');
    expect(v).toBeDefined();
    expect(v.value).toBe('Joao');
  });

  test('Construct IdentityName must result successfully', () => {
    const value = { givenNames: 'Joao', otherNames: 'Barbosa', familyNames: 'Santos' };
    const v = new UCA.IdentityName(value);
    expect(v).toBeDefined();
    expect(v.value.givenNames.value).toBe(value.givenNames);
    expect(v.value.otherNames.value).toBe(value.otherNames);
    expect(v.value.familyNames.value).toBe(value.familyNames);
  });

  test('UCA should throw error when constructing with a complex Attestatble Value: cvc:Identity:name', () => {
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
    expect(address.id).toBeDefined();
  });

  test('Construct cvc:Hash:algorithm', () => {
    const identifier = 'cvc:Hash:algorithm';
    const hashAlgorithm = new UCA(identifier, 'md5');

    expect(hashAlgorithm.id).toBeDefined();

    const plain = hashAlgorithm.getPlainValue();
    expect(plain).toBe('md5');
  });

  test('Construct cvc:Type:evidence', () => {
    const identifier = 'cvc:Type:evidence';
    const evidence = new UCA(identifier, {
      algorithm: 'md5',
      data: '8e55a2c4a1f018314c1e8d3bead078fb',
    });

    expect(evidence.id).toBeDefined();

    const plain = evidence.getPlainValue();
    expect(plain.algorithm).toBe('md5');
    expect(plain.data).toBe('8e55a2c4a1f018314c1e8d3bead078fb');
  });

  test('Construct cvc:Validation:evidences', () => {
    const identifier = 'cvc:Validation:evidences';
    const idDocumentFront = { algorithm: 'md5', data: '8e55a2c4a1f018314c1e8d3bead078fb' };
    const idDocumentBack = { algorithm: 'md5', data: 'b698226a9595562690f9121cc6bfa2a1' };
    const selfie = { algorithm: 'md5', data: '0c64397149b22323edcdee35e3507b03' };

    const evidences = new UCA(identifier, { idDocumentFront, idDocumentBack, selfie });

    expect(evidences.id).toBeDefined();

    const plain = evidences.getPlainValue();
    expect(plain.idDocumentFront).toEqual(idDocumentFront);
    expect(plain.idDocumentBack).toEqual(idDocumentBack);
    expect(plain.selfie).toEqual(selfie);
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

  test('Should get ALL UCA properties name', () => {
    const properties = UCA.getAllProperties('cvc:Identity:name');
    expect(properties).toHaveLength(3);
    expect(properties).toContain('identity.name.givenNames');
    expect(properties).toContain('identity.name.familyNames');
    expect(properties).toContain('identity.name.otherNames');
  });

  test('Index initialization', () => {
    expect(ucaIndex).toBeDefined();
    expect(ucaIndex.definitions).toBeDefined();
    expect(ucaIndex.UserCollectableAttribute).toBeDefined();
  });

  test('UCA with attestable value must throw error', () => {
    const identifier = 'cvc:Type:address';
    const attestableValue = {
      country: 'DE',
      state: 'Berlin',
      county: 'Berlin',
      city: 'Berlin',
      postalCode: '15123',
      street: 'Ruthllardstr',
      unit: '12',
      attestableValue: 'Mocked:asdkmalsdqasd',
    };
    try {
      const uca = new UCA(identifier, attestableValue);
      expect(uca).toBe('Should not pass here');
    } catch (e) {
      expect(e).toBeDefined();
      expect(e.message).toBe(
        `UserCollectableAttribute must not receive attestable value: ${JSON.stringify(attestableValue)}`,
      );
    }
  });

  test('Must throw error when it does not find UCA by its identifier and version', () => {
    const identifier = 'cvc:Contact:phoneNumber';
    const badVersion = '1123414';

    function createUCA() {
      return new UCA(identifier, {
        country: 'DE',
        countryCode: '49',
        number: '17225252255',
        lineType: 'mobile',
        extension: '111',
      }, badVersion);
    }

    expect(createUCA).toThrowError(`Version ${badVersion} is not supported for the identifier ${identifier}`);
  });

  test('Construct cvc:SocialSecurity:serialNumber successfully', () => {
    const identifier = 'cvc:SocialSecurity:number';
    const ssn = new UCA(identifier, {
      areaNumber: '123',
      groupNumber: '45',
      serialNumber: '6789',
    });

    const plain = ssn.getPlainValue();
    expect(plain.areaNumber).toBe('123');
    expect(plain.groupNumber).toBe('45');
    expect(plain.serialNumber).toBe('6789');
  });

  test('Must throw error for invalid cvc:SocialSecurity:number', () => {
    const identifier = 'cvc:SocialSecurity:number';

    function createUCA(id, value) {
      return new UCA(id, value);
    }

    expect(createUCA.bind(this, identifier, {
      areaNumber: '1234',
      groupNumber: '45',
      serialNumber: '6789',
    }))
      .toThrowError('"1234" is not valid for cvc:SocialSecurity:areaNumber');

    expect(createUCA.bind(this, identifier, {
      areaNumber: '123',
      groupNumber: '456',
      serialNumber: '6789',
    }))
      .toThrowError('"456" is not valid for cvc:SocialSecurity:groupNumber');

    expect(createUCA.bind(this, identifier, {
      areaNumber: '123',
      groupNumber: '45',
      serialNumber: '67890',
    }))
      .toThrowError('"67890" is not valid for cvc:SocialSecurity:serialNumber');

    expect(createUCA.bind(this, identifier, 'abcde'))
      .toThrowError('Missing required fields to cvc:SocialSecurity:number');
  });

  test('Construct cvc:SocialSecurity:serialNumber', () => {
    const identifier = 'cvc:SocialSecurity:serialNumber';
    const ssn = new UCA(identifier, '1234');
    const plain = ssn.getPlainValue();
    expect(plain).toBe('1234');
  });

  test('Must throw error for invalid cvc:SocialSecurity:serialNumber', () => {
    const identifier = 'cvc:SocialSecurity:serialNumber';

    function createUCA(id, value) {
      return new UCA(id, value);
    }

    expect(createUCA.bind(this, identifier, '123'))
      .toThrowError(`${JSON.stringify('123')} is not valid for ${identifier}`);

    expect(createUCA.bind(this, identifier, '12345'))
      .toThrowError(`${JSON.stringify('12345')} is not valid for ${identifier}`);

    expect(createUCA.bind(this, identifier, 'abc'))
      .toThrowError(`${JSON.stringify('abc')} is not valid for ${identifier}`);

    expect(createUCA.bind(this, identifier, 'abcd'))
      .toThrowError(`${JSON.stringify('abcd')} is not valid for ${identifier}`);

    expect(createUCA.bind(this, identifier, 'abcde'))
      .toThrowError(`${JSON.stringify('abcde')} is not valid for ${identifier}`);
  });

  test('Should construct cvc:Kba:Knowledge', () => {
    const identifier = 'cvc:Kba:Knowledge';
    const question = 'What is the answer to life, the universe and everything';
    const answer = '42';

    const knowledge = new UCA(identifier, {
      question,
      answer,
    });

    const plain = knowledge.getPlainValue();
    expect(plain.question).toBe(question);
    expect(plain.answer).toBe(answer);
  });

  test('Should fail to construct cvc:Kba:Knowledge', () => {
    const identifier = 'cvc:Kba:Knowledge';
    const question = 'What is the answer to life, the universe and everything';

    expect(() => new UCA(identifier, {
      question,
    })).toThrow();
  });

  test('Check credentialItem attribute', () => {
    const uca = new UCA('cvc:Name:givenNames', 'Yan');
    expect(uca.credentialItem).toBeTruthy();

    const uca2 = new UCA('cvc:Meta:expirationDate', '-1');
    expect(uca2.credentialItem).toBeFalsy();
  });

  test('Check isValid with invalid one', () => {
    const isValid = UCA.isValid(1, 'foo');
    expect(isValid).toBeFalsy();
  });

  test('Get template for complex uca', () => {
    const ucaTemplate = UCA.getUCAProps('cvc:Contact:email', '1');
    expect(ucaTemplate).toBeDefined();
    expect(ucaTemplate.name).toEqual('cvc:Contact:email');
    expect(ucaTemplate.version).toEqual('1');
    expect(ucaTemplate.basePropertyName).toEqual('contact.email');
    expect(ucaTemplate.properties.length).toEqual(3);
    expect(ucaTemplate.properties[0].name).toEqual('cvc:Email:username');
    expect(ucaTemplate.properties[0].meta.required).toEqual(false);
    expect(ucaTemplate.properties[0].meta.propertyName).toEqual('contact.email.username');
    expect(ucaTemplate.properties[0].meta.type).toEqual('String');
    expect(ucaTemplate.properties[0].meta.version).toEqual('1');
  });

  test('Get value from template property/value and create UCA', () => {
    const propValues = [
      {
        name: 'cvc:Email:username',
        value: 'savio',
      },
      {
        name: 'cvc:Domain:name',
        value: 'civic',
      },
      {
        name: 'cvc:Domain:tld',
        value: 'com',
      },
      {
        name: 'cvc:Invalid:one',
        value: 'invalid',
      },
    ];

    const ucaValue = UCA.parseValueFromProps('cvc:Contact:email', propValues, '1');
    expect(ucaValue.username).toEqual('savio');
    expect(ucaValue.domain.name).toEqual('civic');
    expect(ucaValue.domain.tld).toEqual('com');
    function createUCA() {
      return new UCA('cvc:Contact:email', ucaValue, '1');
    }
    expect(createUCA).not.toThrowError();
  });

  test('Get template for complex uca 2', () => {
    const ucaTemplate = UCA.getUCAProps('cvc:Identity:dateOfBirth', '1');
    expect(ucaTemplate).toBeDefined();
    expect(ucaTemplate.name).toEqual('cvc:Identity:dateOfBirth');
    expect(ucaTemplate.version).toEqual('1');
    expect(ucaTemplate.basePropertyName).toEqual('identity.dateOfBirth');
    expect(ucaTemplate.properties.length).toEqual(3);
    expect(ucaTemplate.properties[0].name).toEqual('cvc:Type:day');
    expect(ucaTemplate.properties[0].meta.required).toEqual(true);
    expect(ucaTemplate.properties[0].meta.propertyName).toEqual('identity.dateOfBirth.day');
    expect(ucaTemplate.properties[0].meta.type).toEqual('Number');
    expect(ucaTemplate.properties[0].meta.version).toEqual('1');
  });

  test('Get template for complex uca 3', () => {
    const ucaTemplate = UCA.getUCAProps('cvc:Identity:address', '1');
    expect(ucaTemplate).toBeDefined();
    expect(ucaTemplate.name).toEqual('cvc:Identity:address');
    expect(ucaTemplate.version).toEqual('1');
    expect(ucaTemplate.basePropertyName).toEqual('identity.address');
    expect(ucaTemplate.properties.length).toEqual(7);
  });

  test('Get template for complex uca 4', () => {
    const ucaTemplate = UCA.getUCAProps('cvc:SocialSecurity:number', '1');
    expect(ucaTemplate).toBeDefined();
    expect(ucaTemplate.name).toEqual('cvc:SocialSecurity:number');
    expect(ucaTemplate.version).toEqual('1');
    expect(ucaTemplate.basePropertyName).toEqual('socialSecurity.number');
    expect(ucaTemplate.properties.length).toEqual(3);
    expect(ucaTemplate.properties[0].name).toEqual('cvc:SocialSecurity:areaNumber');
    expect(ucaTemplate.properties[0].meta.required).toEqual(true);
    expect(ucaTemplate.properties[0].meta.propertyName).toEqual('socialSecurity.number.areaNumber');
    expect(ucaTemplate.properties[0].meta.type).toEqual('String');
    expect(ucaTemplate.properties[0].meta.version).toEqual('1');
  });

  test('Get template for simple uca', () => {
    const ucaTemplate = UCA.getUCAProps('cvc:Verify:phoneNumberToken', '1');
    expect(ucaTemplate).toBeDefined();
    expect(ucaTemplate.name).toEqual('cvc:Verify:phoneNumberToken');
    expect(ucaTemplate.version).toEqual('1');
    expect(ucaTemplate.basePropertyName).toEqual('verify.phoneNumberToken');
    expect(ucaTemplate.properties.length).toEqual(1);
  });

  test('Get value from template property/value and create simple UCA', () => {
    const propValues = [
      {
        name: 'cvc:Verify:phoneNumberToken',
        value: '12345',
      },
    ];

    const ucaValue = UCA.parseValueFromProps('cvc:Verify:phoneNumberToken', propValues, '1');
    expect(ucaValue).toEqual('12345');
    function createUCA() {
      return new UCA('cvc:Verify:phoneNumberToken', ucaValue, '1');
    }
    expect(createUCA).not.toThrowError();
  });

  test('Construct UCA from PropertyValuePair', () => {
    const ucaTemplate = UCA.getUCAProps('cvc:Verify:phoneNumberToken', '1');
    expect(ucaTemplate).toBeDefined();
    expect(ucaTemplate.name).toEqual('cvc:Verify:phoneNumberToken');
    expect(ucaTemplate.version).toEqual('1');
    expect(ucaTemplate.basePropertyName).toEqual('verify.phoneNumberToken');
    expect(ucaTemplate.properties.length).toEqual(1);
  });

  describe('Flatten UCAs tests', () => {
    it('Handle Arrays in flatten/Unflatten  UCA', () => {
      const identifier = 'cvc:Test:records';
      const value = [
        {
          testDate: '150000',
          testId: 'cccc',
          type: 'ccc',
        },
        {
          testDate: '250000',
          testId: 'cccc2',
          type: 'ccc2',
        },
      ];
      const ucaObject = new UCA(identifier, value);
      const flat = ucaObject.getFlattenValue();
      const unflatten = UCA.fromFlattenValue(identifier, flat);

      expect(unflatten).toBeDefined();
      expect(flat).toBeDefined();
      expect(flat).toHaveLength(6);
      const expected = [
        {
          name: 'cvc:Test:records.0.testDate',
          value: '150000',
        },
        {
          name: 'cvc:Test:records.0.testId',
          value: 'cccc',
        },
        {
          name: 'cvc:Test:records.0.type',
          value: 'ccc',
        },
        {
          name: 'cvc:Test:records.1.testDate',
          value: '250000',
        },
        {
          name: 'cvc:Test:records.1.testId',
          value: 'cccc2',
        },
        {
          name: 'cvc:Test:records.1.type',
          value: 'ccc2',
        },
      ];
      expect(flat).toEqual(expect.arrayContaining(expected));
      const reflat = unflatten.getFlattenValue();
      expect(reflat).toEqual(expect.arrayContaining(expected));
    });

    it('Handle Numbers in flatten/Unflatten  UCA', () => {
      const identifier = 'cvc:Identity:dateOfBirth';
      const value = {
        day: 20,
        month: 3,
        year: 1978,
      };
      const ucaObject = new UCA(identifier, value);
      const flat = ucaObject.getFlattenValue();
      expect(flat).toBeDefined();
      expect(flat).toHaveLength(3);
      const expected = [
        {
          name: 'cvc:Type:day',
          value: '20',
        },
        {
          name: 'cvc:Type:month',
          value: '3',
        },
        {
          name: 'cvc:Type:year',
          value: '1978',
        },
      ];
      expect(flat).toEqual(expect.arrayContaining(expected));

      const newUcaObject = UCA.fromFlattenValue(identifier, flat);
      expect(newUcaObject.value.day.value).toEqual(20);
      expect(newUcaObject.value.month.value).toEqual(3);
      expect(newUcaObject.value.year.value).toEqual(1978);
    });

    it('Should flatten a simple UCA', () => {
      const ucaObject = new UCA('cvc:Document:number', 'a1b2c3-3c2b1a');
      const flat = ucaObject.getFlattenValue();
      expect(flat).toBeDefined();
      expect(flat).toHaveLength(1);
      const expected = [{ name: 'cvc:Document:number', value: 'a1b2c3-3c2b1a' }];
      expect(flat).toEqual(expect.arrayContaining(expected));
    });

    it('Should flatten typedef UCA', () => {
      const ucaObject = new UCA('cvc:Verify:emailToken', '12345');
      const flat = ucaObject.getFlattenValue();
      expect(flat).toBeDefined();
      expect(flat).toHaveLength(1);
      const expected = [{ name: 'cvc:Verify:emailToken', value: '12345' }];
      expect(flat).toEqual(expect.arrayContaining(expected));
    });

    it('Should flatten structure UCA with 1 level', () => {
      const ucaObject = new UCA('cvc:Type:Name', { givenNames: 'Joao', otherNames: 'Barbosa', familyNames: 'Santos' });
      const flat = ucaObject.getFlattenValue();
      expect(flat).toBeDefined();
      expect(flat).toHaveLength(3);
      const expected = [
        { name: 'cvc:Name:givenNames', value: 'Joao' },
        { name: 'cvc:Name:otherNames', value: 'Barbosa' },
        { name: 'cvc:Name:familyNames', value: 'Santos' },
      ];
      expect(flat).toEqual(expect.arrayContaining(expected));
    });

    it('Should flatten structure UCA with 2 level', () => {
      const ucaObject = new UCA('cvc:Type:email', { username: 'joao', domain: { name: 'civic', tld: 'com' } });
      const flat = ucaObject.getFlattenValue();
      expect(flat).toBeDefined();
      expect(flat).toHaveLength(3);
      const expected = [
        { name: 'cvc:Email:username', value: 'joao' },
        { name: 'cvc:Domain:name', value: 'civic' },
        { name: 'cvc:Domain:tld', value: 'com' },
      ];
      expect(flat).toEqual(expect.arrayContaining(expected));
    });

    it('Should flatten structure UCA with 1 level and typedef', () => {
      const ucaObject = new UCA('cvc:Identity:name',
        { givenNames: 'Joao', otherNames: 'Barbosa', familyNames: 'Santos' });
      const flat = ucaObject.getFlattenValue();
      expect(flat).toBeDefined();
      expect(flat).toHaveLength(3);
      const expected = [
        { name: 'cvc:Name:givenNames', value: 'Joao' },
        { name: 'cvc:Name:otherNames', value: 'Barbosa' },
        { name: 'cvc:Name:familyNames', value: 'Santos' }];
      expect(flat).toEqual(expect.arrayContaining(expected));
    });

    it('Should flatten structure UCA with ambiguities', () => {
      const ucaObject = new UCA('cvc:Document:evidences', {
        idDocumentFront: { algorithm: 'sha256', data: 'sha256(idDocumentFront)' },
        idDocumentBack: { algorithm: 'sha256', data: 'sha256(idDocumentBack)' },
        selfie: { algorithm: 'sha256', data: 'sha256(selfie)' },
      });
      const flat = ucaObject.getFlattenValue();
      expect(flat).toBeDefined();
      expect(flat).toHaveLength(6);
      const was = [
        { name: 'cvc:Hash:algorithm', value: 'sha256' },
        { name: 'cvc:Hash:data', value: 'sha256(idDocumentFront)' },
        { name: 'cvc:Hash:algorithm', value: 'sha256' },
        { name: 'cvc:Hash:data', value: 'sha256(idDocumentBack)' },
        { name: 'cvc:Hash:algorithm', value: 'sha256' },
        { name: 'cvc:Hash:data', value: 'sha256(selfie)' },
      ];
      const expected = [
        { name: 'cvc:Hash:algorithm>idDocumentFront', value: 'sha256' },
        { name: 'cvc:Hash:data>idDocumentFront', value: 'sha256(idDocumentFront)' },
        { name: 'cvc:Hash:algorithm>idDocumentBack', value: 'sha256' },
        { name: 'cvc:Hash:data>idDocumentBack', value: 'sha256(idDocumentBack)' },
        { name: 'cvc:Hash:algorithm>selfie', value: 'sha256' },
        { name: 'cvc:Hash:data>selfie', value: 'sha256(selfie)' }];
      expect(flat).toEqual(expect.arrayContaining(expected));
      expect(flat).not.toEqual(expect.arrayContaining(was));
    });

    it('Should flatten an alias to a structure UCA with ambiguities', () => {
      const ucaObject = new UCA('cvc:Validation:evidences', {
        idDocumentFront: { algorithm: 'sha256', data: 'sha256(idDocumentFront)' },
        idDocumentBack: { algorithm: 'sha256', data: 'sha256(idDocumentBack)' },
        selfie: { algorithm: 'sha256', data: 'sha256(selfie)' },
      });
      const flat = ucaObject.getFlattenValue();
      expect(flat).toBeDefined();
      expect(flat).toHaveLength(6);
      const was = [
        { name: 'cvc:Hash:algorithm', value: 'sha256' },
        { name: 'cvc:Hash:data', value: 'sha256(idDocumentFront)' },
        { name: 'cvc:Hash:algorithm', value: 'sha256' },
        { name: 'cvc:Hash:data', value: 'sha256(idDocumentBack)' },
        { name: 'cvc:Hash:algorithm', value: 'sha256' },
        { name: 'cvc:Hash:data', value: 'sha256(selfie)' },
      ];
      const expected = [
        { name: 'cvc:Hash:algorithm>idDocumentFront', value: 'sha256' },
        { name: 'cvc:Hash:data>idDocumentFront', value: 'sha256(idDocumentFront)' },
        { name: 'cvc:Hash:algorithm>idDocumentBack', value: 'sha256' },
        { name: 'cvc:Hash:data>idDocumentBack', value: 'sha256(idDocumentBack)' },
        { name: 'cvc:Hash:algorithm>selfie', value: 'sha256' },
        { name: 'cvc:Hash:data>selfie', value: 'sha256(selfie)' }];
      expect(flat).toEqual(expect.arrayContaining(expected));
      expect(flat).not.toEqual(expect.arrayContaining(was));
    });

    it('Should unflatten a simple UCA', () => {
      const ucaObject = UCA.fromFlattenValue('cvc:Document:number',
        [{ name: 'cvc:Document:number', value: 'a1b2c3-3c2b1a' }]);
      expect(ucaObject).toBeDefined();
      expect(ucaObject.identifier).toBe('cvc:Document:number');
      expect(ucaObject.value).toBe('a1b2c3-3c2b1a');
    });

    it('Should unflatten a typedef UCA', () => {
      const ucaObject = UCA.fromFlattenValue('cvc:Verify:emailToken',
        [{ name: 'cvc:Verify:emailToken', value: '12345' }]);
      expect(ucaObject).toBeDefined();
      expect(ucaObject.identifier).toBe('cvc:Verify:emailToken');
      expect(ucaObject.value).toBe('12345');
    });

    it('Should unflatten structure UCA with 1 level', () => {
      const ucaObject = UCA.fromFlattenValue('cvc:Type:Name',
        [
          { name: 'cvc:Name:givenNames', value: 'Joao' },
          { name: 'cvc:Name:otherNames', value: 'Barbosa' },
          { name: 'cvc:Name:familyNames', value: 'Santos' }]);
      expect(ucaObject).toBeDefined();
      expect(ucaObject.identifier).toBe('cvc:Type:Name');
    });

    it('Should unflatten structure UCA with 2 level', () => {
      const ucaObject = UCA.fromFlattenValue('cvc:Type:email',
        [
          { name: 'cvc:Email:username', value: 'joao' },
          { name: 'cvc:Domain:name', value: 'civic' },
          { name: 'cvc:Domain:tld', value: 'com' },
        ]);
      expect(ucaObject).toBeDefined();
      expect(ucaObject.identifier).toBe('cvc:Type:email');
    });

    it('Should unflatten structure UCA with ambiguity', () => {
      const ucaObject = UCA.fromFlattenValue('cvc:Document:evidences',
        [
          { name: 'cvc:Hash:algorithm>idDocumentFront', value: 'sha256' },
          { name: 'cvc:Hash:data>idDocumentFront', value: 'sha256(idDocumentFront)' },
          { name: 'cvc:Hash:algorithm>idDocumentBack', value: 'sha256' },
          { name: 'cvc:Hash:data>idDocumentBack', value: 'sha256(idDocumentBack)' },
          { name: 'cvc:Hash:algorithm>selfie', value: 'sha256' },
          { name: 'cvc:Hash:data>selfie', value: 'sha256(selfie)' },
        ]);
      expect(ucaObject).toBeDefined();
      expect(ucaObject.identifier).toBe('cvc:Document:evidences');
    });

    it('Should unflatten an alias for a structure UCA with ambiguity', () => {
      const ucaObject = UCA.fromFlattenValue('cvc:Validation:evidences',
        [
          { name: 'cvc:Hash:algorithm>idDocumentFront', value: 'sha256' },
          { name: 'cvc:Hash:data>idDocumentFront', value: 'sha256(idDocumentFront)' },
          { name: 'cvc:Hash:algorithm>idDocumentBack', value: 'sha256' },
          { name: 'cvc:Hash:data>idDocumentBack', value: 'sha256(idDocumentBack)' },
          { name: 'cvc:Hash:algorithm>selfie', value: 'sha256' },
          { name: 'cvc:Hash:data>selfie', value: 'sha256(selfie)' },
        ]);
      expect(ucaObject).toBeDefined();
      expect(ucaObject.identifier).toBe('cvc:Validation:evidences');
    });
  });

  describe('UCA with Boolean value', () => {
    describe('from fromFlattenValue', () => {
      it('set value with boolean', () => {
        expect(UCA.fromFlattenValue(
          'cvc:Type:externalServiceAuth', [{ name: 'cvc:Type:hasConnected', value: true }],
        ).getPlainValue()).toBeTruthy();
      });
    });
    describe('from constructor', () => {
      it('set value with boolean', () => expect(
        new UCA('cvc:Type:externalServiceAuth', { hasConnected: true }),
      ).toBeTruthy());
    });
  });
});
