const _ = require('lodash');

const getValidIdentifiers = definitions => _.map(definitions, d => d.identifier);

/**
 * extract the expected Type name for the value when constructing an UCA
 * @param {*} definition
 */
const getTypeName = (definition, definitions) => {
  if (_.isString(definition.type)) {
    if (_.includes(getValidIdentifiers(definitions), definition.type)) {
      const innerDefinition = _.find(definitions, { identifier: definition.type });
      return getTypeName(innerDefinition, definitions);
    }

    return definition.type;
  }
  return 'Object';
};

const resolveType = (definition, definitions) => {
  const typeName = getTypeName(definition, definitions);
  if (!(typeName === 'Object')) {
    return typeName;
  }

  if (!_.isString(definition.type)) {
    return definition.type;
  }

  const refDefinition = _.find(definitions, { identifier: definition.type });
  return resolveType(refDefinition, definitions);
};

/**
 * validate the value type
 * @param {*} value
 * @param {*} type
 */
const isValueOfType = (value, type) => {
  switch (type) {
    case 'String':
      return _.isString(value);
    case 'Number':
      return _.isNumber(value);
    case 'Boolean':
      return _.isBoolean(value);
    default:
      return false;
  }
};

module.exports = {
  resolveType,
  isValueOfType,
  getTypeName,
  getValidIdentifiers,
};
