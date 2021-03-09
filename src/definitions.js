/* eslint-disable no-template-curly-in-string */
// ######################################### DEFINITIONS ###########################################

// TODO split definiton of Evidences
const definitions = [
  {
    identifier: 'cvc:Meta:issuer',
    description: 'Credential Issuer',
    version: '1',
    type: 'String',
    attestable: true,
  },
  {
    identifier: 'cvc:Meta:issuanceDate',
    description: 'Credential date of issuance',
    version: '1',
    type: 'String',
    attestable: true,
  },
  {
    identifier: 'cvc:Meta:expirationDate',
    description: 'Credential expiration data',
    version: '1',
    type: 'String',
    attestable: true,
  },
  {
    identifier: 'cvc:Random:node',
    description: 'a random node on the merkleTree, ',
    version: '1',
    type: 'String',
    attestable: true,
  },
  {
    identifier: 'cvc:Domain:name',
    description: 'also known as email address domain',
    version: '1',
    type: 'String',
    credentialItem: false,
  },
  {
    identifier: 'cvc:Domain:tld',
    description: 'also known as email address domain suffix, like .com, .org, .com.br',
    version: '1',
    type: 'String',
    credentialItem: false,
  },
  {
    identifier: 'cvc:Email:username',
    description: 'also known as email user',
    version: '1',
    type: 'String',
    credentialItem: false,
  },
  {
    identifier: 'cvc:Type:domain',
    version: '1',
    type: {
      properties: [
        {
          name: 'tld',
          type: 'cvc:Domain:tld',
        },
        {
          name: 'name',
          type: 'cvc:Domain:name',
        },
      ],
      required: ['name', 'tld'],
    },
    credentialItem: false,
  },
  {
    identifier: 'cvc:Email:domain',
    version: '1',
    type: 'cvc:Type:domain',
    credentialItem: true,
  },
  {
    identifier: 'cvc:Type:email',
    version: '1',
    type: {
      properties: [
        {
          name: 'username',
          type: 'cvc:Email:username',
        },
        {
          name: 'domain',
          type: 'cvc:Email:domain',
        },
      ],
    },
    credentialItem: false,
  },
  {
    identifier: 'cvc:Contact:email',
    version: '1',
    type: 'cvc:Type:email',
    credentialItem: true,
  },
  {
    identifier: 'cvc:User:id',
    version: '1',
    type: 'String',
    credentialItem: true,
  },
  {
    identifier: 'cvc:User:realm',
    version: '1',
    type: 'String',
    credentialItem: true,
  },
  {
    identifier: 'cvc:Type:country',
    version: '1',
    type: 'String',
    credentialItem: false,
  },
  {
    identifier: 'cvc:Phone:countryCode',
    version: '1',
    type: 'String',
    credentialItem: true,
  },
  {
    identifier: 'cvc:Phone:number',
    version: '1',
    type: 'String',
    credentialItem: true,
  },
  {
    identifier: 'cvc:Phone:extension',
    version: '1',
    type: 'String',
    credentialItem: true,
  },
  {
    identifier: 'cvc:Phone:lineType',
    version: '1',
    type: 'String',
    credentialItem: true,
  },

  {
    identifier: 'cvc:PhoneNumber:country',
    type: 'cvc:Type:country',
    version: '1',
    credentialItem: false,
  },
  {
    identifier: 'cvc:PhoneNumber:countryCode',
    type: 'cvc:Phone:countryCode',
    version: '1',
    credentialItem: true,
  },
  {
    identifier: 'cvc:PhoneNumber:number',
    type: 'cvc:Phone:number',
    version: '1',
    credentialItem: true,
  },
  {
    identifier: 'cvc:PhoneNumber:extension',
    type: 'cvc:Phone:extension',
    version: '1',
    credentialItem: true,
  },
  {
    identifier: 'cvc:PhoneNumber:lineType',
    type: 'cvc:Phone:lineType',
    version: '1',
    credentialItem: true,
  },
  {
    identifier: 'cvc:Type:phoneNumber',
    version: '1',
    type: {
      properties: [
        {
          name: 'country',
          type: 'cvc:PhoneNumber:country',
        },
        {
          name: 'countryCode',
          type: 'cvc:PhoneNumber:countryCode',
        },
        {
          name: 'number',
          type: 'cvc:PhoneNumber:number',
        },
        {
          name: 'extension',
          type: 'cvc:PhoneNumber:extension',
        },
        {
          name: 'lineType',
          type: 'cvc:PhoneNumber:lineType',
        },
      ],
      required: ['country', 'countryCode', 'number', 'lineType'],
    },
    credentialItem: false,
  },
  {
    identifier: 'cvc:Contact:phoneNumber',
    version: '1',
    type: 'cvc:Type:phoneNumber',
    credentialItem: true,
  },
  {
    identifier: 'cvc:Name:givenNames',
    version: '1',
    type: 'String',
    credentialItem: true,
  },
  {
    identifier: 'cvc:Name:familyNames',
    version: '1',
    type: 'String',
    credentialItem: true,
  },
  {
    identifier: 'cvc:Name:otherNames',
    version: '1',
    type: 'String',
    credentialItem: true,
  },
  {
    identifier: 'cvc:Type:Name',
    version: '1',
    type: {
      properties: [
        {
          name: 'givenNames',
          type: 'cvc:Name:givenNames',
        },
        {
          name: 'familyNames',
          type: 'cvc:Name:familyNames',
        },
        {
          name: 'otherNames',
          type: 'cvc:Name:otherNames',
        },
      ],
      required: ['givenNames'],
    },
    credentialItem: false,
  },
  {
    identifier: 'cvc:Document:name',
    version: '1',
    type: 'cvc:Type:Name',
    credentialItem: true,
  },
  {
    identifier: 'cvc:Document:flow',
    description: 'Indicates if document image was uploaded',
    version: '1',
    type: 'String',
    attestable: false,
    credentialItem: false,
  },
  {
    identifier: 'cvc:Hash:algorithm',
    version: '1',
    type: 'String',
    enum: {
      SHA256: 'sha256',
      MD5: 'md5',
    },
  },
  {
    identifier: 'cvc:Hash:data',
    version: '1',
    type: 'String',
  },
  {
    identifier: 'cvc:Type:evidence',
    version: '1',
    type: {
      properties: [
        {
          name: 'algorithm',
          type: 'cvc:Hash:algorithm',
        },
        {
          name: 'data',
          type: 'cvc:Hash:data',
        },
      ],
      required: ['algorithm', 'data'],
    },
  },
  {
    identifier: 'cvc:Evidences:idDocumentFront',
    version: '1',
    type: 'cvc:Type:evidence',
  },
  {
    identifier: 'cvc:Evidences:idDocumentBack',
    version: '1',
    type: 'cvc:Type:evidence',
  },
  {
    identifier: 'cvc:Evidences:selfie',
    version: '1',
    type: 'cvc:Type:evidence',
  },
  {
    identifier: 'cvc:Document:evidences',
    version: '1',
    type: {
      properties: [{
        name: 'idDocumentFront',
        type: 'cvc:Evidences:idDocumentFront',
        deambiguify: true,
      },
      {
        name: 'idDocumentBack',
        type: 'cvc:Evidences:idDocumentBack',
        deambiguify: true,
      },
      {
        name: 'selfie',
        type: 'cvc:Evidences:selfie',
        deambiguify: true,
      }],
    },
    credentialItem: true,
  },
  {
    identifier: 'cvc:Validation:evidences',
    version: '1',
    type: 'cvc:Document:evidences',
    alias: true,
    credentialItem: true,
  },
  {
    identifier: 'cvc:Identity:name',
    version: '1',
    type: 'cvc:Type:Name',
    credentialItem: true,
  },
  {
    identifier: 'cvc:Type:shortToken',
    version: '1',
    type: 'String',
    pattern: /^\d{5}$/, // We can specify a constraint to define the type domain
    credentialItem: false,
  },
  {
    identifier: 'cvc:Verify:phoneNumberToken',
    version: '1',
    type: 'cvc:Type:shortToken',
    credentialItem: false, // An example on UCA that only relates with the user in short term
  },
  {
    identifier: 'cvc:Verify:emailToken',
    version: '1',
    type: 'cvc:Type:shortToken',
    credentialItem: false,
  },
  {
    identifier: 'cvc:Document:number',
    version: '1',
    type: 'String',
    credentialItem: true,
  },
  {
    identifier: 'cvc:Document:nationality',
    version: '1',
    type: 'String',
    credentialItem: true,
  },
  {
    identifier: 'cvc:Type:day',
    version: '1',
    type: 'Number',
    minimum: 1,
    maximum: 31,
  },
  {
    identifier: 'cvc:Type:month',
    version: '1',
    type: 'Number',
    minimum: 1,
    maximum: 12,
  },
  {
    identifier: 'cvc:Type:year',
    version: '1',
    type: 'Number',
    minimum: 1900,
  },
  {
    identifier: 'cvc:Type:date',
    version: '1',
    type: {
      properties: [{
        name: 'day',
        type: 'cvc:Type:day',
      },
      {
        name: 'month',
        type: 'cvc:Type:month',
      },
      {
        name: 'year',
        type: 'cvc:Type:year',
      }],
      required: ['day', 'month', 'year'],
    },
  },
  {
    identifier: 'cvc:Identity:dateOfBirth',
    version: '1',
    type: 'cvc:Type:date',
    credentialItem: true,
  },
  {
    identifier: 'cvc:Address:street',
    version: '1',
    type: 'String',
  },

  {
    identifier: 'cvc:Address:unit',
    version: '1',
    type: 'String',
  },

  {
    identifier: 'cvc:Address:city',
    version: '1',
    type: 'String',
    credentialItem: true,
  },

  {
    identifier: 'cvc:Address:postalCode',
    version: '1',
    type: 'String',
    credentialItem: true,
  },

  {
    identifier: 'cvc:Address:state',
    version: '1',
    type: 'String',
    credentialItem: true,
  },
  {
    identifier: 'cvc:Address:county',
    version: '1',
    type: 'String',
    credentialItem: true,
  },

  {
    identifier: 'cvc:Address:country',
    version: '1',
    type: 'cvc:Type:country',
    credentialItem: true,
  },
  {
    identifier: 'cvc:Type:address',
    version: '1',
    type: {
      properties: [
        {
          name: 'country',
          type: 'cvc:Address:country',
        },
        {
          name: 'county',
          type: 'cvc:Address:county',
        },
        {
          name: 'state',
          type: 'cvc:Address:state',
        },
        {
          name: 'street',
          type: 'cvc:Address:street',
        },
        {
          name: 'unit',
          type: 'cvc:Address:unit',
        },
        {
          name: 'city',
          type: 'cvc:Address:city',
        },
        {
          name: 'postalCode',
          type: 'cvc:Address:postalCode',
        },
      ],
      required: ['street', 'city', 'state', 'country'],
    },
    credentialItem: false,
  },
  {
    identifier: 'cvc:Document:address',
    version: '1',
    type: 'cvc:Type:address',
    credentialItem: true,
  },
  {
    identifier: 'cvc:Identity:address',
    version: '1',
    type: 'cvc:Type:address',
    credentialItem: true,
  },
  {
    identifier: 'cvc:Document:dateOfIssue',
    version: '1',
    type: 'cvc:Type:date',
    credentialItem: true,
  },
  {
    identifier: 'cvc:Document:dateOfExpiry',
    version: '1',
    type: 'cvc:Type:date',
    credentialItem: true,
  },
  {
    identifier: 'cvc:Document:dateOfBirth',
    version: '1',
    type: 'cvc:Type:date',
    credentialItem: true,
  },
  {
    identifier: 'cvc:Document:properties',
    version: '1',
    attestable: true,
    type: {
      properties: [
        {
          name: 'dateOfIssue',
          type: 'cvc:Document:dateOfIssue',
        },
        {
          name: 'dateOfExpiry',
          type: 'cvc:Document:dateOfExpiry',
        },
      ],
      required: ['dateOfIssue'],
    },
    credentialItem: false,
  },
  {
    identifier: 'cvc:Type:s3FileBucket',
    version: '1',
    type: 'String',
  },
  {
    identifier: 'cvc:Type:s3FileKey',
    version: '1',
    type: 'String',
  },
  {
    identifier: 'cvc:Type:ContentType',
    version: '1',
    type: 'String',
  },
  {
    identifier: 'cvc:Type:MD5',
    version: '1',
    type: 'String',
  },
  {
    identifier: 'cvc:Type:timestamp',
    version: '1',
    type: 'String',
  },
  {
    identifier: 'cvc:Type:fullName',
    version: '1',
    type: 'String',
  },
  {
    identifier: 'cvc:Type:ImageBase64',
    version: '1',
    type: 'String',
  },
  {
    identifier: 'cvc:Type:S3FileRef',
    version: '1',
    type: {
      properties: [
        {
          name: 's3FileBucket',
          type: 'cvc:Type:s3FileBucket',
        },
        {
          name: 's3FileKey',
          type: 'cvc:Type:s3FileKey',
        },
        {
          name: 'MD5',
          type: 'cvc:Type:MD5',
        },
        {
          name: 'ContentType',
          type: 'cvc:Type:ContentType',
        },
      ],
      required: ['s3FileBucket', 's3FileKey', 'MD5', 'ContentType'],
    },
  },
  {
    identifier: 'cvc:S3Ref:selfie',
    version: '1',
    type: {
      properties: [
        {
          name: 's3FileBucket',
          type: 'cvc:Type:s3FileBucket',
        },
        {
          name: 's3FileKey',
          type: 'cvc:Type:s3FileKey',
        },
        {
          name: 'MD5',
          type: 'cvc:Type:MD5',
        },
        {
          name: 'ContentType',
          type: 'cvc:Type:ContentType',
        },
      ],
      required: ['s3FileBucket', 's3FileKey', 'MD5', 'ContentType'],
    },
  },
  {
    identifier: 'cvc:Type:DocumentFace',
    version: '1',
    type: 'String',
  },
  {
    identifier: 'cvc:Type:S3DocumentImageRef',
    version: '1',
    type: {
      properties: [
        {
          name: 'type',
          type: 'cvc:Type:documentType',
        },
        {
          name: 'face',
          type: 'cvc:Type:DocumentFace',
        },
        {
          name: 'reference',
          type: 'cvc:Type:S3FileRef',
        },
      ],
      required: ['type', 'face', 'reference'],
    },
  },
  {
    identifier: 'cvc:Document:front',
    version: '1',
    type: 'cvc:Type:ImageBase64',
  },
  {
    identifier: 'cvc:Document:frontMD5',
    version: '1',
    type: 'cvc:Type:MD5',
  },
  {
    identifier: 'cvc:Document:back',
    version: '1',
    type: 'cvc:Type:ImageBase64',
  },
  {
    identifier: 'cvc:Document:backMD5',
    version: '1',
    type: 'cvc:Type:MD5',
  },
  {
    identifier: 'cvc:Document:image',
    version: '1',
    attestable: true,
    type: {
      properties: [
        {
          name: 'front',
          type: 'cvc:Document:front',
        },
        {
          name: 'frontMD5',
          type: 'cvc:Document:frontMD5',
        },
        {
          name: 'back',
          type: 'cvc:Document:back',
        },
        {
          name: 'backMD5',
          type: 'cvc:Document:backMD5',
        },
      ],
      required: ['front', 'frontMD5'],
    },
  },
  {
    identifier: 'cvc:Type:documentType',
    version: '1',
    type: 'String',
  },
  {
    identifier: 'cvc:Document:type',
    version: '1',
    type: 'cvc:Type:documentType',
    credentialItem: true,
  },
  {
    identifier: 'cvc:Document:gender',
    version: '1',
    type: 'String',
    credentialItem: true,
  },
  {
    identifier: 'cvc:Document:issueLocation',
    version: '1',
    type: 'String',
    credentialItem: true,
  },
  {
    identifier: 'cvc:Document:issueAuthority',
    version: '1',
    type: 'String',
    credentialItem: true,
  },
  {
    identifier: 'cvc:Document:issueCountry',
    version: '1',
    type: 'cvc:Type:country',
    credentialItem: true,
  },
  {
    identifier: 'cvc:Document:placeOfBirth',
    version: '1',
    type: 'String',
    credentialItem: true,
  },

  {
    identifier: 'cvc:SocialSecurity:number',
    version: '1',
    type: 'cvc:Type:socialSecurityNumber',
    credentialItem: true,
  },
  // Structure of socialSecurityNumber is described here: https://www.ssa.gov/history/ssn/geocard.html
  {
    identifier: 'cvc:Type:socialSecurityNumber',
    version: '1',
    type: {
      properties: [
        {
          name: 'areaNumber',
          type: 'cvc:SocialSecurity:areaNumber',
        },
        {
          name: 'groupNumber',
          type: 'cvc:SocialSecurity:groupNumber',
        },
        {
          name: 'serialNumber',
          type: 'cvc:SocialSecurity:serialNumber',
        },
      ],
      required: ['areaNumber', 'groupNumber', 'serialNumber'],
    },
    credentialItem: false,
  },
  {
    identifier: 'cvc:SocialSecurity:areaNumber',
    version: '1',
    type: 'String',
    pattern: /^\d{3}$/,
  },
  {
    identifier: 'cvc:SocialSecurity:groupNumber',
    version: '1',
    type: 'String',
    pattern: /^\d{2}$/,
  },
  {
    identifier: 'cvc:SocialSecurity:serialNumber', // four last digits of SSN
    version: '1',
    type: 'String',
    pattern: /^\d{4}$/,
    credentialItem: true,
  },
  {
    identifier: 'cvc:Knowledge:question',
    description: 'A question or questionId for an answer',
    version: '1',
    type: 'String',
    credentialItem: false,
  },
  {
    identifier: 'cvc:Knowledge:answer',
    description: 'An answer or answerId for an question',
    version: '1',
    type: 'String',
    credentialItem: false,
  },
  {
    identifier: 'cvc:Type:knowledge',
    version: '1',
    type: {
      properties: [
        {
          name: 'question',
          type: 'cvc:Knowledge:question',
        },
        {
          name: 'answer',
          type: 'cvc:Knowledge:answer',
        },
      ],
      required: ['question', 'answer'],
    },
    credentialItem: false,
  },
  {
    identifier: 'cvc:Kba:Knowledge',
    version: '1',
    type: 'cvc:Type:knowledge',
    credentialItem: false,
  },
  {
    identifier: 'cvc:Vaccination:date',
    version: '1',
    type: 'cvc:Type:timestamp',
    credentialItem: false,
  },
  {
    identifier: 'cvc:Vaccination:name',
    version: '1',
    type: 'String',
    credentialItem: false,
  },
  {
    identifier: 'cvc:Vaccination:recordDetail',
    version: '1',
    type: {
      properties: [
        {
          name: 'createdAt',
          type: 'cvc:Type:date',
        },
        {
          name: 'updatedAt',
          type: 'cvc:Type:date',
        },
      ],
    },
    required: ['createdAt'],
    credentialItem: false,
  },
  {
    identifier: 'cvc:Type:organizationName',
    type: 'String',
    credentialItem: true,
  },
  {
    identifier: 'cvc:Type:organizationId',
    type: 'String',
    credentialItem: true,
  },
  {
    identifier: 'cvc:Type:organization',
    version: '1',
    type: {
      properties: [
        {
          name: 'name',
          type: 'cvc:Type:organizationName',
        },
        {
          name: 'id',
          type: 'cvc:Type:organizationId',
        },
      ],
    },
    required: ['name'],
    credentialItem: false,
  },
  {
    identifier: 'cvc:Type:patient',
    version: '1',
    type: {
      properties: [
        {
          name: 'fullName',
          type: 'cvc:Type:fullName',
        },
        {
          name: 'dateOfBirth',
          type: 'cvc:Identity:dateOfBirth',
        },
      ],
    },
    required: ['name'],
    credentialItem: false,
  },
  {
    identifier: 'cvc:Code:codeSystemName',
    version: '1',
    type: 'String',
    credentialItem: false,
  },
  {
    identifier: 'cvc:Code:name',
    version: '1',
    type: 'String',
    credentialItem: false,
  },
  {
    identifier: 'cvc:Code:code',
    version: '1',
    type: 'String',
    credentialItem: false,
  },
  {
    identifier: 'cvc:Code:codeSystem',
    version: '1',
    type: 'String',
    credentialItem: false,
  },
  {
    identifier: 'cvc:Medical:code',
    version: '1',
    type: {
      properties: [
        {
          name: 'name',
          type: 'cvc:Code:name',
        },
        {
          name: 'code',
          type: 'cvc:Code:code',
        },
        {
          name: 'codeSystem',
          type: 'cvc:Code:codeSystem',
        },
        {
          name: 'codeSystemName',
          type: 'cvc:Code:codeSystemName',
        },
      ],
    },
    required: ['name', 'code'],
    credentialItem: false,
  },
  {
    identifier: 'cvc:Manufacturer:name',
    version: '1',
    type: 'String',
    credentialItem: false,
  },
  {
    identifier: 'cvc:Vaccination:manufacturer',
    version: '1',
    type: {
      properties: [
        {
          name: 'name',
          type: 'cvc:Manufacturer:name',
        },
        {
          name: 'code',
          type: 'cvc:Medical:code',
        },
      ],
      required: ['name'],
    },
    credentialItem: false,
  },
  {
    identifier: 'cvc:Vaccination:id',
    version: '1',
    type: 'String',
    credentialItem: true,
  },
  {
    identifier: 'cvc:Vaccination:record',
    version: '1',
    type: {
      properties: [
        {
          name: 'vaccinationId',
          type: 'cvc:Vaccination:id',
        },
        {
          name: 'dateOfAdministration',
          type: 'cvc:Vaccination:date',
        },
        {
          name: 'manufacturer',
          type: 'cvc:Vaccination:manufacturer',
        },
        {
          name: 'name',
          type: 'cvc:Vaccination:name',
        },
        {
          name: 'detail',
          type: 'cvc:Vaccination:recordDetail',
        },
        {
          name: 'organization',
          type: 'cvc:Type:organization',
        },
        {
          name: 'codes',
          type: 'cvc:Medical:codes',
        },
      ],
      required: ['vaccinationId', 'dateOfAdministration', 'name', 'organization'],
    },
    credentialItem: true,
  },
  {
    identifier: 'cvc:Type:hasConnected',
    version: '1',
    type: 'Boolean',
    credentialItem: false,
  },
  {
    identifier: 'cvc:Type:externalServiceAuth',
    version: '1',
    type: {
      properties: [
        {
          name: 'hasConnected',
          type: 'cvc:Type:hasConnected',
        },
      ],
    },
    credentialItem: false,
  },
  {
    identifier: 'cvc:Test:date',
    version: '1',
    type: 'cvc:Type:timestamp',
    credentialItem: false,
  },
  {
    identifier: 'cvc:Test:type',
    version: '1',
    type: 'String',
    credentialItem: false,
  },
  {
    identifier: 'cvc:Test:result',
    version: '1',
    type: 'String',
    credentialItem: false,
  },
  {
    identifier: 'cvc:Medical:codes',
    version: '1',
    type: 'Array',
    items: {
      type: 'cvc:Medical:code',
    },
    credentialItem: false,
  },
  {
    identifier: 'cvc:Test:id',
    version: '1',
    type: 'String',
    credentialItem: true,
  },
  {
    identifier: 'cvc:Test:record',
    version: '1',
    type: {
      properties: [
        {
          name: 'testId',
          type: 'cvc:Test:id',
        },
        {
          name: 'testDate',
          type: 'cvc:Test:date',
        },
        {
          name: 'resultDate',
          type: 'cvc:Test:date',
        },
        {
          name: 'type',
          type: 'cvc:Test:type',
        },
        {
          name: 'result',
          type: 'cvc:Test:result',
        },
        {
          name: 'organization',
          type: 'cvc:Type:organization',
        },
        {
          name: 'codes',
          type: 'cvc:Medical:codes',
        },
      ],
      required: ['testDate', 'testId', 'type'],
    },
    credentialItem: true,
  },
  {
    identifier: 'cvc:Type:userConfirm',
    version: '1',
    type: 'Boolean',
    credentialItem: true,
  },
  {
    identifier: 'cvc:Vaccination:records',
    version: '1',
    type: 'Array', // the client uses this to know to display the UCA list
    items: {
      type: 'cvc:Vaccination:record', // complex data type defined in UCA
    },
    credentialItem: true,
  },
  {
    identifier: 'cvc:Test:records',
    version: '1',
    type: 'Array', // the client uses this to know to display the UCA list
    items: {
      type: 'cvc:Test:record', // complex data type defined in UCA
    },
    credentialItem: true,
  },
  {
    identifier: 'cvc:Medical:covid19',
    version: '1',
    type: {
      properties: [
        {
          name: 'vaccinations',
          type: 'cvc:Vaccination:records',
        },
        {
          name: 'tests', // used so the client knows how to display this
          type: 'cvc:Test:records', // the client uses this to know to display the UCA list
        },
        {
          name: 'patient',
          type: 'cvc:Type:patient',
        },
      ],
    },
    credentialItem: true,
  },
  {
    identifier: 'cvc:Type:externalClientUserId',
    description: 'External Client User Id',
    version: '1',
    type: 'String',
    attestable: true,
  },
  {
    identifier: 'cvc:Type:identityAuthId',
    description: 'Auth identifier',
    version: '1',
    type: 'String',
    attestable: false,
    credentialItem: false,
  },
  {
    identifier: 'cvc:Type:ImageRefFormat',
    version: '1',
    type: 'String',
    attestable: false,
    credentialItem: false,
  },
  {
    identifier: 'cvc:Type:ImageRef',
    version: '1',
    type: {
      properties: [
        {
          name: 's3FileRef',
          type: 'cvc:Type:S3FileRef',
        },
        {
          name: 'format', // base64 | IDScan
          type: 'cvc:Type:ImageRefFormat',
        },
      ],
    },
  },
  {
    identifier: 'cvc:Type:DocumentImages',
    version: '1',
    type: 'Array',
    items: {
      type: 'cvc:Type:ImageRef',
    },
    credentialItem: false,
  },
  {
    identifier: 'cvc:Type:SelfieImage',
    version: '1',
    type: 'cvc:Type:ImageRef',
    credentialItem: false,
  },
];

module.exports = definitions;
