const _ = require('lodash');

const getValidIdentifiers = (definitions) => _.map(definitions, (d) => d.identifier);

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

const resolveDefinition = (definition, definitions) => {
  if (_.isString(definition.type)
      && _.includes(getValidIdentifiers(definitions), definition.type)) {
    const innerDefinition = _.find(definitions, { identifier: definition.type });
    return resolveDefinition(innerDefinition, definitions);
  }
  return definition;
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
 * @param  {Object} definitions
 * @param  {string} identifier
 */
const getTypeDefinition = (definitions, identifier) => {
  const definition = _.find(definitions, { identifier });
  const type = resolveType(definition, definitions);
  const typeDefinition = _.isString(type) ? _.find(definitions, { identifier: type }) : definition;
  return typeDefinition;
};

/**
 * @param  {Object} definitions
 * @param  {Object} typeDefinition
 * @param  {string} pathName
 */
const getObjectBasePropName = (definitions, typeDefinition, pathName) => {
  if (typeDefinition && getTypeName(typeDefinition, definitions) === 'Object') {
    let basePropName;
    const baseIdentifierComponents = _.split(typeDefinition.identifier, ':');
    if (pathName) {
      if (_.includes(pathName, _.camelCase(baseIdentifierComponents[1]))) {
        basePropName = `${pathName}.${baseIdentifierComponents[2]}`;
      } else {
        basePropName = `${pathName}.${_.camelCase(baseIdentifierComponents[1])}.${baseIdentifierComponents[2]}`;
      }
    } else {
      basePropName = `${_.camelCase(baseIdentifierComponents[1])}.${baseIdentifierComponents[2]}`;
    }
    return basePropName;
  }
  return undefined;
};

const flagRequeredProps = (requiredArray, props) => (
  _.map(props, (p) => _.merge(p, { required: _.includes(requiredArray, p.name) }))
);

const getObjectTypeDefProps = (definitions, typeDefinition) => {
  if (typeDefinition && getTypeName(typeDefinition, definitions) === 'Object') {
    let typeDefProps;
    if (typeDefinition.type.properties) {
      typeDefProps = typeDefinition.type.properties;
      typeDefProps = flagRequeredProps(typeDefinition.type.required, typeDefProps);
    } else {
      const typeDefDefinition = _.find(definitions, { identifier: typeDefinition.type });
      const resolvedType = resolveType(typeDefDefinition, definitions);
      typeDefProps = resolvedType.properties;
      typeDefProps = flagRequeredProps(resolvedType.required, typeDefProps);
    }
    return typeDefProps;
  }
  return [];
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
  resolveDefinition,
  isValueOfType,
  getTypeName,
  getValidIdentifiers,
  getTypeDefinition,
  getObjectBasePropName,
  getObjectTypeDefProps,
};
