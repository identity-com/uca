"use strict";

class UCATemplateValue {
  constructor(identifier, type, propertyName, required, version) {
    this.name = identifier;
    this.meta = {
      required,
      propertyName,
      type,
      version
    };
  }
}

module.exports = { UCATemplateValue };