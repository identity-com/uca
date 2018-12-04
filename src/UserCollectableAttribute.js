const _ = require('lodash');
const timestamp = require('unix-timestamp');
const uuidv4 = require('uuid/v4');
const definitions = require('./definitions');

const validIdentifiers = _.map(definitions, d => d.identifier);

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

const isValid = (value, type, definition) => {
  switch (type) {
    case 'String':
      return (definition.pattern ? definition.pattern.test(value) : true)
        && (definition.minimumLength ? value.length >= definition.minimumLength : true)
        && (definition.maximumLength ? value.length <= definition.minimumLength : true);
    case 'Number':
      return ((!_.isNil(definition.minimum)
        && definition.exclusiveMinimum ? value > definition.minimum : value >= definition.minimum)
        || _.isNil(definition.minimum))
        && ((!_.isNil(definition.maximum)
          && definition.exclusiveMaximum ? value < definition.maximum : value <= definition.maximum)
          || _.isNil(definition.maximum));
    case 'Boolean':
      return _.isBoolean(value);
    default:
      return false;
  }
};

/**
 * extract the expected Type name for the value when constructing an UCA
 * @param {*} definition
 */
const getTypeName = (definition) => {
  if (_.isString(definition.type)) {
    if (_.includes(validIdentifiers, definition.type)) {
      const innerDefinition = _.find(definitions, { identifier: definition.type });
      return getTypeName(innerDefinition);
    }

    return definition.type;
  }
  return 'Object';
};

const resolveType = (definition) => {
  const typeName = getTypeName(definition);
  if (!(typeName === 'Object')) {
    return typeName;
  }

  if (!_.isString(definition.type)) {
    return definition.type;
  }

  const refDefinition = _.find(definitions, { identifier: definition.type });
  return resolveType(refDefinition);
};

const getAllProperties = (identifier, pathName) => {
  const definition = _.find(definitions, { identifier });
  const properties = [];
  const type = resolveType(definition);
  const typeDefinition = _.isString(type) ? _.find(definitions, { identifier: type }) : definition;

  if (typeDefinition && getTypeName(typeDefinition) === 'Object') {
    let typeDefProps;
    if (typeDefinition.type.properties) {
      typeDefProps = typeDefinition.type.properties;
    } else {
      const typeDefDefinition = _.find(definitions, { identifier: typeDefinition.type });
      typeDefProps = resolveType(typeDefDefinition).properties;
    }

    let basePropName;
    const baseIdentifierComponents = _.split(typeDefinition.identifier, ':');
    if (pathName) {
      if (_.includes(pathName, _.lowerCase(baseIdentifierComponents[1]))) {
        basePropName = `${pathName}.${baseIdentifierComponents[2]}`;
      } else {
        basePropName = `${pathName}.${_.lowerCase(baseIdentifierComponents[1])}.${baseIdentifierComponents[2]}`;
      }
    } else {
      basePropName = `${_.lowerCase(baseIdentifierComponents[1])}.${baseIdentifierComponents[2]}`;
    }

    if (_.includes(['String', 'Number', 'Boolean'], `${typeDefProps.type}`)) {
      // Properties is not an object
      properties.push(`${basePropName}.${typeDefProps.name}`);
    } else {
      _.forEach(typeDefProps, (prop) => {
        const typeSuffix = _.split(prop.type, ':')[2];
        const newBasePropName = prop.name === typeSuffix ? basePropName : `${basePropName}.${prop.name}`;
        const proProperties = getAllProperties(prop.type, newBasePropName);
        _.forEach(proProperties, p => properties.push(p));
      });
    }
  } else if (pathName) {
    const propertiesName = `${pathName}.${_.split(definition.identifier, ':')[2]}`;
    properties.push(propertiesName);
  } else {
    const identifierComponents = _.split(identifier, ':');
    const propertiesName = `${_.lowerCase(identifierComponents[1])}.${identifierComponents[2]}`;
    properties.push(propertiesName);
  }
  return properties;
};

const isAttestableValue = value => (value && value.attestableValue);

/**
 * Creates new UCA instances
 * @param {*} identifier
 * @param {*} value
 */
function UCABaseConstructor(identifier, value, version) {
  if (!_.includes(validIdentifiers, identifier)) {
    throw new Error(`${identifier} is not defined`);
  }

  const definition = version ? _.find(definitions, { identifier, version }) : _.find(definitions, { identifier });

  this.timestamp = null;
  this.id = null;
  this.identifier = identifier;
  this.version = version || definition.version;
  this.type = getTypeName(definition);

  definition.type = resolveType(definition);
  if (isAttestableValue(value)) {
    throw new Error('UserCollectableAttribute must not receive attestable value');
  } else if (isValueOfType(value, this.type)) {
    // Trying to construct UCA with a normal value
    this.timestamp = timestamp.now();
    if (!isValid(value, this.type, definition)) {
      throw new Error(`${JSON.stringify(value)} is not valid for ${identifier}`);
    }
    this.value = value;
  } else if (_.isEmpty(definition.type.properties)) {
    throw new Error(`${JSON.stringify(value)} is not valid for ${identifier}`);
  } else {
    const hasRequireds = _.reduce(definition.type.required, (has, required) => value[required] && has, true);
    if (!hasRequireds) {
      throw new Error(`Missing required fields to ${identifier}`);
    }
    const ucaValue = _.mapValues(_.keyBy(_.map(value, (v, k) => {
      const propertyDef = _.find(definition.type.properties, { name: k });
      const uca = new UCABaseConstructor(propertyDef.type, v, propertyDef.version);
      return { key: k, value: uca };
    }), 'key'), 'value');
    this.value = ucaValue;
  }

  this.getPlainValue = (propName) => {
    const newParent = {};
    const result = [];
    switch (this.type) {
      case 'String':
      case 'Number':
      case 'Boolean':
        if (propName) {
          newParent[propName] = this.value;
        } else {
          if (!this.credentialItem) {
            return this.value;
          }
          newParent[this.identifier] = this.value;
        }
        return newParent;
      default:
        _.forEach(_.sortBy(_.keys(this.value)), (k) => {
          result.push(this.value[k].getPlainValue(k));
        });
        _.forEach(result, (properties) => {
          if (propName) {
            newParent[propName] = newParent[propName] ? newParent[propName] : {};
            _.assign(newParent[propName], properties);
          } else {
            _.assign(newParent, properties);
          }
        });
        return newParent;
    }
  };

  this.toJSON = () => ({
    id: this.id,
    identifier: this.identifier,
    timestamp: this.timestamp,
    version: this.version,
    type: this.type,
    value: this.value,
  });

  this.id = `${this.version}:${this.identifier}:${uuidv4()}`;
  return this;
}

const UCA = UCABaseConstructor;

function convertIdentifierToClassName(identifier) {
  const identifierComponents = _.split(identifier, ':');
  const baseName = identifierComponents[1];
  const detailName = _.upperFirst(_.camelCase(identifierComponents[2]));
  return `${baseName}${detailName}`;
}

// Extend UCA Semantic
_.forEach(_.filter(definitions, d => d.credentialItem), (def) => {
  const name = convertIdentifierToClassName(def.identifier);
  const source = {};
  const { identifier } = def;

  function UCAConstructor(value, version) {
    const self = new UCABaseConstructor(identifier, value, version);
    return self;
  }

  source[name] = UCAConstructor;
  _.mixin(UCA, source);
});

UCA.getTypeName = getTypeName;
UCA.resolveType = resolveType;
UCA.getAllProperties = getAllProperties;

module.exports = UCA;
