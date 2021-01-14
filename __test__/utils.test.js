const definitions = require('../src/definitions');
const {
  getTypeDefinition,
  getObjectBasePropName,
  getObjectTypeDefProps,
  resolveDefinition,
} = require('../src/utils');

describe('Utils tests', () => {
  test('getTypeDefinition', () => {
    const identifier = 'cvc:Contact:email';
    const typeDefinition = getTypeDefinition(definitions, identifier);

    expect(typeDefinition.identifier).toEqual(identifier);
    expect(typeDefinition.version).toEqual('1');
    expect(typeDefinition.type).toEqual('cvc:Type:email');
    expect(typeDefinition.credentialItem).toEqual(true);
  });

  test('getBasePropName', () => {
    let identifier = 'cvc:Contact:email';
    let typeDefinition = getTypeDefinition(definitions, identifier);

    let r = getObjectBasePropName(definitions, typeDefinition);
    expect(r).toEqual('contact.email');

    identifier = 'cvc:Email:domain';
    typeDefinition = getTypeDefinition(definitions, identifier);

    r = getObjectBasePropName(definitions, typeDefinition);
    expect(r).toEqual('email.domain');

    identifier = 'cvc:Email:domain';
    typeDefinition = getTypeDefinition(definitions, identifier);

    r = getObjectBasePropName(definitions, typeDefinition, 'contact.email');
    expect(r).toEqual('contact.email.domain');

    r = getObjectBasePropName(definitions, typeDefinition, 'contact');
    expect(r).toEqual('contact.email.domain');

    identifier = 'cvc:Email:username';
    typeDefinition = getTypeDefinition(definitions, identifier);

    r = getObjectBasePropName(definitions, typeDefinition);
    expect(r).toBeUndefined();
  });

  test('getObjectTypeDefProps', () => {
    let identifier = 'cvc:Contact:email';
    let typeDefinition = getTypeDefinition(definitions, identifier);

    // -
    let r = getObjectTypeDefProps(definitions, typeDefinition);
    expect(r[0].name).toEqual('username');
    expect(r[0].type).toEqual('cvc:Email:username');
    expect(r[1].name).toEqual('domain');
    expect(r[1].type).toEqual('cvc:Email:domain');

    // -
    identifier = 'cvc:Email:domain';
    typeDefinition = getTypeDefinition(definitions, identifier);

    r = getObjectTypeDefProps(definitions, typeDefinition);
    expect(r[0].name).toEqual('tld');
    expect(r[0].type).toEqual('cvc:Domain:tld');
    expect(r[1].name).toEqual('name');
    expect(r[1].type).toEqual('cvc:Domain:name');

    // -
    identifier = 'cvc:Email:domain';
    typeDefinition = getTypeDefinition(definitions, identifier);
    typeDefinition.type = {
      properties: [
        {
          name: 'A',
          type: 'typeA',
        },
      ],
    };

    r = getObjectTypeDefProps(definitions, typeDefinition);
    expect(r[0].name).toEqual('A');
    expect(r[0].type).toEqual('typeA');

    // -
    identifier = 'cvc:Email:username';
    typeDefinition = getTypeDefinition(definitions, identifier);

    r = getObjectTypeDefProps(definitions, typeDefinition);
    expect(r.length).toEqual(0);
  });

  test('resolveDefinition', () => {
    const sampleDefinitions = [
      {
        identifier: 'idA',
        version: '1',
        type: 'String',
      },
      {
        identifier: 'idB',
        version: '1',
        type: 'idA',
      },
      {
        identifier: 'idC',
        version: '1',
        type: 'idB',
      },
    ];
    const resolvedDefinition = resolveDefinition(sampleDefinitions[2], sampleDefinitions);
    expect(resolvedDefinition).toEqual(sampleDefinitions[0]);
  });
});
