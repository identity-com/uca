'use strict';

const _ = require('lodash');
const timestamp = require('unix-timestamp');
const { v4: uuidv4 } = require('uuid');
const flatten = require('flat');
const definitions = require('./definitions');
const {
  resolveType,
  isValueOfType,
  getTypeName,
  resolveDefinition,
  getTypeDefinition,
  getObjectBasePropName,
  getObjectTypeDefProps
} = require('./utils');
const { UCATemplateValue } = require('./UCATemplateValue');

const isAttestableValue = value => value && value.attestableValue;

const handleNotFoundDefinition = (myDefinitions, identifier, version) => {
  if (version != null) {
    const definition = _.find(myDefinitions, { identifier });
    if (definition) {
      throw new Error(`Version ${version} is not supported for the identifier ${identifier}`);
    }
  }

  throw new Error(`${identifier} is not defined`);
};

const getUCATemplateProperties = (identifier, required, version, pathName) => {
  const definition = version ? _.find(definitions, { identifier, version }) : _.find(definitions, { identifier });
  if (!definition) {
    return handleNotFoundDefinition(definitions, identifier, version);
  }
  const typeDefinition = getTypeDefinition(definitions, identifier);

  const properties = [];

  if (typeDefinition && getTypeName(typeDefinition, definitions) === 'Object') {
    const typeDefProps = getObjectTypeDefProps(definitions, typeDefinition);
    const basePropName = getObjectBasePropName(definitions, typeDefinition, pathName);

    _.forEach(typeDefProps, prop => {
      const typeSuffix = _.split(prop.type, ':')[2];
      const newBasePropName = prop.name === typeSuffix ? basePropName : `${basePropName}.${prop.name}`;
      const proProperties = getUCATemplateProperties(prop.type, prop.required, version, newBasePropName);
      _.forEach(proProperties, p => {
        properties.push(p);
      });
    });
  } else if (pathName) {
    const propertyName = `${pathName}.${_.split(definition.identifier, ':')[2]}`;
    const p = new UCATemplateValue(definition.identifier, definition.type, propertyName, required, version);
    properties.push(JSON.parse(JSON.stringify(p)));
  } else {
    const identifierComponents = _.split(identifier, ':');
    const propertyName = `${_.camelCase(identifierComponents[1])}.${identifierComponents[2]}`;
    const p = new UCATemplateValue(definition.identifier, definition.type, propertyName, required, version);
    properties.push(JSON.parse(JSON.stringify(p)));
  }
  return properties;
};

/**
 * Creates new UCA instances
 * @param {*} identifier
 * @param {*} value
 */
class UserCollectableAttribute {
  constructor(identifier, value, version, customDefinitions) {
    this.id = null;
    this.identifier = null;
    this.timestamp = null;
    this.version = null;
    this.type = null;
    this.value = null;
    this.credentialItem = null;
    this.definitions = customDefinitions || definitions;

    this.initialize(identifier, value, version);
  }

  initialize(identifier, value, version) {
    const definition = UserCollectableAttribute.getDefinition(identifier, version, this.definitions);

    this.timestamp = null;
    this.id = null;
    this.identifier = identifier;
    this.version = version || definition.version;
    this.type = getTypeName(definition, this.definitions);

    const originalDefinition = _.clone(definition);
    definition.type = resolveType(definition, this.definitions);

    if (this.type === 'Array') {
      this.initializeValuesWithArrayItems(identifier, value, version);
    } else if (isAttestableValue(value)) {
      this.value = value;
      this.initializeAttestableValue();
    } else if (isValueOfType(value, this.type)) {
      const resolvedDefinition = resolveDefinition(originalDefinition, this.definitions);

      this.timestamp = timestamp.now();
      if (!UserCollectableAttribute.isValid(value, this.type, resolvedDefinition)) {
        throw new Error(`${JSON.stringify(value)} is not valid for ${identifier}`);
      }
      this.value = value;
    } else if (_.isEmpty(definition.type.properties)) {
      throw new Error(`${JSON.stringify(value)} is not valid for ${identifier}`);
    } else {
      this.initializeValuesWithProperties(identifier, definition, value);
    }

    this.credentialItem = definition.credentialItem;
    this.id = `${this.version}:${this.identifier}:${uuidv4()}`;
    return this;
  }

  initializeValuesWithArrayItems(identifier, values, version) {
    const definition = UserCollectableAttribute.getDefinition(identifier, version, this.definitions);

    if (!_.isArray(values)) throw new Error(`Value for ${identifier}-${version} should be an array`);

    const ucaArray = _.map(values, value => new UserCollectableAttribute(_.get(definition, 'items.type'), value));

    this.value = ucaArray;
  }

  initializeValuesWithProperties(identifier, definition, value) {
    const hasRequireds = _.reduce(definition.type.required, (has, required) => value[required] && has, true);
    if (!hasRequireds) {
      throw new Error(`Missing required fields to ${identifier}`);
    }
    const ucaValue = _.mapValues(_.keyBy(_.map(value, (v, k) => {
      const propertyDef = _.find(definition.type.properties, { name: k });
      const uca = new this.constructor(propertyDef.type, v, propertyDef.version);
      return { key: k, value: uca };
    }), 'key'), 'value');
    this.value = ucaValue;
  }

  initializeAttestableValue() {
    throw new Error(`UserCollectableAttribute must not receive attestable value: ${JSON.stringify(this.value)}`);
  }

  static getDefinition(identifier, version, customDefinitions) {
    const definitionsList = customDefinitions || definitions;
    const definition = version ? _.find(definitionsList, { identifier, version }) : _.find(definitionsList, { identifier });
    if (!definition) {
      return handleNotFoundDefinition(definitionsList, identifier, version);
    }
    return _.clone(definition);
  }

  static fromFlattenValue(identifier, values) {
    const meta = UserCollectableAttribute.getUCAProps(identifier);
    const fixedValues = _.map(values, item => {
      const fixedValue = _.cloneDeep(item);
      const nameComponents = _.split(item.name, '>');
      const name = nameComponents[0];
      const sufix = nameComponents[1];
      const property = _.find(meta.properties, o => o.name === name && (!sufix || _.includes(o.meta.propertyName, sufix)));

      if (_.get(property, 'meta.type') === 'Number') {
        fixedValue.value = _.toNumber(item.value);
      }
      if (_.get(property, 'meta.type') === 'Boolean') {
        fixedValue.value = _.toString(item.value) === 'true';
      }

      fixedValue.name = _.get(property, 'meta.propertyName');

      return fixedValue;
    });

    const flattenObject = _.reduce(fixedValues, (obj, item) => {
      // eslint-disable-next-line no-param-reassign
      obj[item.name] = item.value;
      return obj;
    }, {});
    const structedObject = flatten.unflatten(flattenObject);

    return new UserCollectableAttribute(identifier, _.get(structedObject, meta.basePropertyName));
  }

  getFlattenValue(accumulator = [], suffix = null, prefix = null) {
    if (this.type === 'Object') {
      const definition = UserCollectableAttribute.getDefinition(this.identifier, this.version);
      const resolvedType = resolveType(definition, this.definitions);

      _.each(_.keys(this.value), key => {
        const deambiguify = _.get(_.find(resolvedType.properties, { name: key }), 'deambiguify');
        this.value[key].getFlattenValue(accumulator, deambiguify ? `>${key}` : suffix, prefix);
      });
    } else if (this.type === 'Array') {
      const parentIdentifier = `${this.identifier}`;
      _.each(this.value, (item, index) => {
        item.getFlattenValue(accumulator, suffix, `${parentIdentifier}.${index}.`);
      });
    } else {
      accumulator.push({
        name: `${prefix || ''}${this.identifier}${suffix || ''}`,
        value: _.toString(this.value)
      });
    }
    return accumulator;
  }

  getPlainValue(propName) {
    const newParent = {};
    const result = [];
    switch (this.type) {
      case 'String':
      case 'Number':
      case 'Boolean':
        if (propName) {
          newParent[propName] = this.value;
        } else {
          return this.value;
        }
        return newParent;
      case 'Array':
        _.forEach(this.value, item => {
          result.push(item.getPlainValue());
        });
        if (propName) {
          newParent[propName] = result;
          return newParent;
        }
        return result;

      default:
        _.forEach(_.sortBy(_.keys(this.value)), k => {
          result.push(this.value[k].getPlainValue(k));
        });
        _.forEach(result, properties => {
          if (propName) {
            newParent[propName] = newParent[propName] ? newParent[propName] : {};
            _.assign(newParent[propName], properties);
          } else {
            _.assign(newParent, properties);
          }
        });
        return newParent;
    }
  }

  static getAllProperties(identifier, pathName) {
    const definition = _.find(definitions, { identifier });
    const properties = [];
    const typeDefinition = getTypeDefinition(definitions, identifier);

    if (typeDefinition && getTypeName(typeDefinition, definitions) === 'Object') {
      const typeDefProps = getObjectTypeDefProps(definitions, typeDefinition);
      const basePropName = getObjectBasePropName(definitions, typeDefinition, pathName);

      if (_.includes(['String', 'Number', 'Boolean'], `${typeDefProps.type}`)) {
        // Properties is not an object
        properties.push(`${basePropName}.${typeDefProps.name}`);
      } else {
        _.forEach(typeDefProps, prop => {
          const typeSuffix = _.split(prop.type, ':')[2];
          const newBasePropName = prop.name === typeSuffix ? basePropName : `${basePropName}.${prop.name}`;
          const proProperties = UserCollectableAttribute.getAllProperties(prop.type, newBasePropName);
          _.forEach(proProperties, p => properties.push(p));
        });
      }
    } else if (pathName) {
      const propertiesName = `${pathName}.${_.split(definition.identifier, ':')[2]}`;
      properties.push(propertiesName);
    } else {
      const identifierComponents = _.split(identifier, ':');
      const propertiesName = `${_.camelCase(identifierComponents[1])}.${identifierComponents[2]}`;
      properties.push(propertiesName);
    }
    return properties;
  }

  static getUCAProps(identifier, version) {
    const definition = version ? _.find(definitions, { identifier, version }) : _.find(definitions, { identifier });
    if (!definition) {
      return handleNotFoundDefinition(definitions, identifier, version);
    }

    const ucaTemplate = {
      name: identifier,
      version: definition.version,
      basePropertyName: '',
      properties: []
    };

    const typeDefinition = getTypeDefinition(definitions, identifier);

    // If Object
    if (typeDefinition && getTypeName(typeDefinition, definitions) === 'Object') {
      const basePropertyName = getObjectBasePropName(definitions, typeDefinition);
      ucaTemplate.basePropertyName = basePropertyName;
    } else {
      const identifierComponents = _.split(identifier, ':');
      const basePropertyName = `${_.camelCase(identifierComponents[1])}.${identifierComponents[2]}`;
      ucaTemplate.basePropertyName = basePropertyName;
    }

    const isSimplePropertiesRequired = true;
    ucaTemplate.properties = getUCATemplateProperties(identifier, isSimplePropertiesRequired, version);

    return ucaTemplate;
  }

  static parseValueFromProps(identifier, props, ucaVersion) {
    const ucaProps = UserCollectableAttribute.getUCAProps(identifier, ucaVersion);

    const flattenProps = {};
    _.each(ucaProps.properties, p => {
      const fProp = _.find(props, { name: p.name });
      if (fProp) {
        flattenProps[p.meta.propertyName] = fProp.value;
      }
    });

    const value = flatten.unflatten(flattenProps);
    const stripedValue = _.get(value, ucaProps.basePropertyName);

    return stripedValue;
  }

  static isValid(value, type, definition) {
    switch (type) {
      case 'String':
        return (definition.pattern ? definition.pattern.test(value) : true) && (definition.minimumLength ? value.length >= definition.minimumLength : true) && (definition.maximumLength ? value.length <= definition.minimumLength : true) && (definition.enum ? _.indexOf(_.values(definition.enum), value) >= 0 : true);
      case 'Number':
        return ((!_.isNil(definition.minimum) && definition.exclusiveMinimum ? value > definition.minimum : value >= definition.minimum) || _.isNil(definition.minimum)) && ((!_.isNil(definition.maximum) && definition.exclusiveMaximum ? value < definition.maximum : value <= definition.maximum) || _.isNil(definition.maximum));
      case 'Boolean':
        return _.isBoolean(value);
      default:
        return false;
    }
  }
}

function convertIdentifierToClassName(identifier) {
  const identifierComponents = _.split(identifier, ':');
  const baseName = identifierComponents[1];
  const detailName = _.upperFirst(_.camelCase(identifierComponents[2]));
  return `${baseName}${detailName}`;
}

function mixinIdentifiers(UCA) {
  // Extend UCA Semantic
  _.forEach(_.filter(definitions, d => d.credentialItem), def => {
    const name = convertIdentifierToClassName(def.identifier);
    const source = {};
    const { identifier } = def;

    function UCAConstructor(value, version) {
      const self = new UserCollectableAttribute(identifier, value, version);
      return self;
    }

    source[name] = UCAConstructor;
    _.mixin(UserCollectableAttribute, source);
  });
  return UCA;
}

const UserCollectableAttributeToExport = mixinIdentifiers(UserCollectableAttribute);
UserCollectableAttributeToExport.resolveType = resolveType;

module.exports = UserCollectableAttributeToExport;