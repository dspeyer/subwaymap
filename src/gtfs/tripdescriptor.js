// source: gtfs-realtime.proto
/**
 * @fileoverview
 * @enhanceable
 * @suppress {messageConventions} JS Compiler reports an error if a variable or
 *     field starts with 'MSG_' and isn't a translatable message.
 * @public
 */
// GENERATED CODE -- DO NOT EDIT!

goog.provide('proto.transit_realtime.TripDescriptor');
goog.provide('proto.transit_realtime.TripDescriptor.ScheduleRelationship');

goog.require('jspb.BinaryReader');
goog.require('jspb.BinaryWriter');
goog.require('jspb.Message');

/**
 * Generated by JsPbCodeGenerator.
 * @param {Array=} opt_data Optional initial data array, typically from a
 * server response, or constructed directly in Javascript. The array is used
 * in place and becomes part of the constructed object. It is not cloned.
 * If no data is provided, the constructed object will be empty, but still
 * valid.
 * @extends {jspb.Message}
 * @constructor
 */
proto.transit_realtime.TripDescriptor = function(opt_data) {
  jspb.Message.initialize(this, opt_data, 0, 7, null, null);
};
goog.inherits(proto.transit_realtime.TripDescriptor, jspb.Message);
if (goog.DEBUG && !COMPILED) {
  /**
   * @public
   * @override
   */
  proto.transit_realtime.TripDescriptor.displayName = 'proto.transit_realtime.TripDescriptor';
}

/**
 * The extensions registered with this message class. This is a map of
 * extension field number to fieldInfo object.
 *
 * For example:
 *     { 123: {fieldIndex: 123, fieldName: {my_field_name: 0}, ctor: proto.example.MyMessage} }
 *
 * fieldName contains the JsCompiler renamed field name property so that it
 * works in OPTIMIZED mode.
 *
 * @type {!Object<number, jspb.ExtensionFieldInfo>}
 */
proto.transit_realtime.TripDescriptor.extensions = {};


/**
 * The extensions registered with this message class. This is a map of
 * extension field number to fieldInfo object.
 *
 * For example:
 *     { 123: {fieldIndex: 123, fieldName: {my_field_name: 0}, ctor: proto.example.MyMessage} }
 *
 * fieldName contains the JsCompiler renamed field name property so that it
 * works in OPTIMIZED mode.
 *
 * @type {!Object<number, jspb.ExtensionFieldBinaryInfo>}
 */
proto.transit_realtime.TripDescriptor.extensionsBinary = {};




if (jspb.Message.GENERATE_TO_OBJECT) {
/**
 * Creates an object representation of this proto.
 * Field names that are reserved in JavaScript and will be renamed to pb_name.
 * Optional fields that are not set will be set to undefined.
 * To access a reserved field use, foo.pb_<name>, eg, foo.pb_default.
 * For the list of reserved names please see:
 *     net/proto2/compiler/js/internal/generator.cc#kKeyword.
 * @param {boolean=} opt_includeInstance Deprecated. whether to include the
 *     JSPB instance for transitional soy proto support:
 *     http://goto/soy-param-migration
 * @return {!Object}
 */
proto.transit_realtime.TripDescriptor.prototype.toObject = function(opt_includeInstance) {
  return proto.transit_realtime.TripDescriptor.toObject(opt_includeInstance, this);
};


/**
 * Static version of the {@see toObject} method.
 * @param {boolean|undefined} includeInstance Deprecated. Whether to include
 *     the JSPB instance for transitional soy proto support:
 *     http://goto/soy-param-migration
 * @param {!proto.transit_realtime.TripDescriptor} msg The msg instance to transform.
 * @return {!Object}
 * @suppress {unusedLocalVariables} f is only used for nested messages
 */
proto.transit_realtime.TripDescriptor.toObject = function(includeInstance, msg) {
  var f, obj = {
    tripId: (f = jspb.Message.getField(msg, 1)) == null ? undefined : f,
    routeId: (f = jspb.Message.getField(msg, 5)) == null ? undefined : f,
    directionId: (f = jspb.Message.getField(msg, 6)) == null ? undefined : f,
    startTime: (f = jspb.Message.getField(msg, 2)) == null ? undefined : f,
    startDate: (f = jspb.Message.getField(msg, 3)) == null ? undefined : f,
    scheduleRelationship: (f = jspb.Message.getField(msg, 4)) == null ? undefined : f
  };

  jspb.Message.toObjectExtension(/** @type {!jspb.Message} */ (msg), obj,
      proto.transit_realtime.TripDescriptor.extensions, proto.transit_realtime.TripDescriptor.prototype.getExtension,
      includeInstance);
  if (includeInstance) {
    obj.$jspbMessageInstance = msg;
  }
  return obj;
};
}


/**
 * Deserializes binary data (in protobuf wire format).
 * @param {jspb.ByteSource} bytes The bytes to deserialize.
 * @return {!proto.transit_realtime.TripDescriptor}
 */
proto.transit_realtime.TripDescriptor.deserializeBinary = function(bytes) {
  var reader = new jspb.BinaryReader(bytes);
  var msg = new proto.transit_realtime.TripDescriptor;
  return proto.transit_realtime.TripDescriptor.deserializeBinaryFromReader(msg, reader);
};


/**
 * Deserializes binary data (in protobuf wire format) from the
 * given reader into the given message object.
 * @param {!proto.transit_realtime.TripDescriptor} msg The message object to deserialize into.
 * @param {!jspb.BinaryReader} reader The BinaryReader to use.
 * @return {!proto.transit_realtime.TripDescriptor}
 */
proto.transit_realtime.TripDescriptor.deserializeBinaryFromReader = function(msg, reader) {
  while (reader.nextField()) {
    if (reader.isEndGroup()) {
      break;
    }
    var field = reader.getFieldNumber();
    switch (field) {
    case 1:
      var value = /** @type {string} */ (reader.readString());
      msg.setTripId(value);
      break;
    case 5:
      var value = /** @type {string} */ (reader.readString());
      msg.setRouteId(value);
      break;
    case 6:
      var value = /** @type {number} */ (reader.readUint32());
      msg.setDirectionId(value);
      break;
    case 2:
      var value = /** @type {string} */ (reader.readString());
      msg.setStartTime(value);
      break;
    case 3:
      var value = /** @type {string} */ (reader.readString());
      msg.setStartDate(value);
      break;
    case 4:
      var value = /** @type {!proto.transit_realtime.TripDescriptor.ScheduleRelationship} */ (reader.readEnum());
      msg.setScheduleRelationship(value);
      break;
    default:
      jspb.Message.readBinaryExtension(msg, reader,
        proto.transit_realtime.TripDescriptor.extensionsBinary,
        proto.transit_realtime.TripDescriptor.prototype.getExtension,
        proto.transit_realtime.TripDescriptor.prototype.setExtension);
      break;
    }
  }
  return msg;
};


/**
 * Serializes the message to binary data (in protobuf wire format).
 * @return {!Uint8Array}
 */
proto.transit_realtime.TripDescriptor.prototype.serializeBinary = function() {
  var writer = new jspb.BinaryWriter();
  proto.transit_realtime.TripDescriptor.serializeBinaryToWriter(this, writer);
  return writer.getResultBuffer();
};


/**
 * Serializes the given message to binary data (in protobuf wire
 * format), writing to the given BinaryWriter.
 * @param {!proto.transit_realtime.TripDescriptor} message
 * @param {!jspb.BinaryWriter} writer
 * @suppress {unusedLocalVariables} f is only used for nested messages
 */
proto.transit_realtime.TripDescriptor.serializeBinaryToWriter = function(message, writer) {
  var f = undefined;
  f = /** @type {string} */ (jspb.Message.getField(message, 1));
  if (f != null) {
    writer.writeString(
      1,
      f
    );
  }
  f = /** @type {string} */ (jspb.Message.getField(message, 5));
  if (f != null) {
    writer.writeString(
      5,
      f
    );
  }
  f = /** @type {number} */ (jspb.Message.getField(message, 6));
  if (f != null) {
    writer.writeUint32(
      6,
      f
    );
  }
  f = /** @type {string} */ (jspb.Message.getField(message, 2));
  if (f != null) {
    writer.writeString(
      2,
      f
    );
  }
  f = /** @type {string} */ (jspb.Message.getField(message, 3));
  if (f != null) {
    writer.writeString(
      3,
      f
    );
  }
  f = /** @type {!proto.transit_realtime.TripDescriptor.ScheduleRelationship} */ (jspb.Message.getField(message, 4));
  if (f != null) {
    writer.writeEnum(
      4,
      f
    );
  }
  jspb.Message.serializeBinaryExtensions(message, writer,
    proto.transit_realtime.TripDescriptor.extensionsBinary, proto.transit_realtime.TripDescriptor.prototype.getExtension);
};


/**
 * @enum {number}
 */
proto.transit_realtime.TripDescriptor.ScheduleRelationship = {
  SCHEDULED: 0,
  ADDED: 1,
  UNSCHEDULED: 2,
  CANCELED: 3,
  REPLACEMENT: 5,
  DUPLICATED: 6,
  DELETED: 7
};

/**
 * optional string trip_id = 1;
 * @return {string}
 */
proto.transit_realtime.TripDescriptor.prototype.getTripId = function() {
  return /** @type {string} */ (jspb.Message.getFieldWithDefault(this, 1, ""));
};


/**
 * @param {string} value
 * @return {!proto.transit_realtime.TripDescriptor} returns this
 */
proto.transit_realtime.TripDescriptor.prototype.setTripId = function(value) {
  return jspb.Message.setField(this, 1, value);
};


/**
 * Clears the field making it undefined.
 * @return {!proto.transit_realtime.TripDescriptor} returns this
 */
proto.transit_realtime.TripDescriptor.prototype.clearTripId = function() {
  return jspb.Message.setField(this, 1, undefined);
};


/**
 * Returns whether this field is set.
 * @return {boolean}
 */
proto.transit_realtime.TripDescriptor.prototype.hasTripId = function() {
  return jspb.Message.getField(this, 1) != null;
};


/**
 * optional string route_id = 5;
 * @return {string}
 */
proto.transit_realtime.TripDescriptor.prototype.getRouteId = function() {
  return /** @type {string} */ (jspb.Message.getFieldWithDefault(this, 5, ""));
};


/**
 * @param {string} value
 * @return {!proto.transit_realtime.TripDescriptor} returns this
 */
proto.transit_realtime.TripDescriptor.prototype.setRouteId = function(value) {
  return jspb.Message.setField(this, 5, value);
};


/**
 * Clears the field making it undefined.
 * @return {!proto.transit_realtime.TripDescriptor} returns this
 */
proto.transit_realtime.TripDescriptor.prototype.clearRouteId = function() {
  return jspb.Message.setField(this, 5, undefined);
};


/**
 * Returns whether this field is set.
 * @return {boolean}
 */
proto.transit_realtime.TripDescriptor.prototype.hasRouteId = function() {
  return jspb.Message.getField(this, 5) != null;
};


/**
 * optional uint32 direction_id = 6;
 * @return {number}
 */
proto.transit_realtime.TripDescriptor.prototype.getDirectionId = function() {
  return /** @type {number} */ (jspb.Message.getFieldWithDefault(this, 6, 0));
};


/**
 * @param {number} value
 * @return {!proto.transit_realtime.TripDescriptor} returns this
 */
proto.transit_realtime.TripDescriptor.prototype.setDirectionId = function(value) {
  return jspb.Message.setField(this, 6, value);
};


/**
 * Clears the field making it undefined.
 * @return {!proto.transit_realtime.TripDescriptor} returns this
 */
proto.transit_realtime.TripDescriptor.prototype.clearDirectionId = function() {
  return jspb.Message.setField(this, 6, undefined);
};


/**
 * Returns whether this field is set.
 * @return {boolean}
 */
proto.transit_realtime.TripDescriptor.prototype.hasDirectionId = function() {
  return jspb.Message.getField(this, 6) != null;
};


/**
 * optional string start_time = 2;
 * @return {string}
 */
proto.transit_realtime.TripDescriptor.prototype.getStartTime = function() {
  return /** @type {string} */ (jspb.Message.getFieldWithDefault(this, 2, ""));
};


/**
 * @param {string} value
 * @return {!proto.transit_realtime.TripDescriptor} returns this
 */
proto.transit_realtime.TripDescriptor.prototype.setStartTime = function(value) {
  return jspb.Message.setField(this, 2, value);
};


/**
 * Clears the field making it undefined.
 * @return {!proto.transit_realtime.TripDescriptor} returns this
 */
proto.transit_realtime.TripDescriptor.prototype.clearStartTime = function() {
  return jspb.Message.setField(this, 2, undefined);
};


/**
 * Returns whether this field is set.
 * @return {boolean}
 */
proto.transit_realtime.TripDescriptor.prototype.hasStartTime = function() {
  return jspb.Message.getField(this, 2) != null;
};


/**
 * optional string start_date = 3;
 * @return {string}
 */
proto.transit_realtime.TripDescriptor.prototype.getStartDate = function() {
  return /** @type {string} */ (jspb.Message.getFieldWithDefault(this, 3, ""));
};


/**
 * @param {string} value
 * @return {!proto.transit_realtime.TripDescriptor} returns this
 */
proto.transit_realtime.TripDescriptor.prototype.setStartDate = function(value) {
  return jspb.Message.setField(this, 3, value);
};


/**
 * Clears the field making it undefined.
 * @return {!proto.transit_realtime.TripDescriptor} returns this
 */
proto.transit_realtime.TripDescriptor.prototype.clearStartDate = function() {
  return jspb.Message.setField(this, 3, undefined);
};


/**
 * Returns whether this field is set.
 * @return {boolean}
 */
proto.transit_realtime.TripDescriptor.prototype.hasStartDate = function() {
  return jspb.Message.getField(this, 3) != null;
};


/**
 * optional ScheduleRelationship schedule_relationship = 4;
 * @return {!proto.transit_realtime.TripDescriptor.ScheduleRelationship}
 */
proto.transit_realtime.TripDescriptor.prototype.getScheduleRelationship = function() {
  return /** @type {!proto.transit_realtime.TripDescriptor.ScheduleRelationship} */ (jspb.Message.getFieldWithDefault(this, 4, 0));
};


/**
 * @param {!proto.transit_realtime.TripDescriptor.ScheduleRelationship} value
 * @return {!proto.transit_realtime.TripDescriptor} returns this
 */
proto.transit_realtime.TripDescriptor.prototype.setScheduleRelationship = function(value) {
  return jspb.Message.setField(this, 4, value);
};


/**
 * Clears the field making it undefined.
 * @return {!proto.transit_realtime.TripDescriptor} returns this
 */
proto.transit_realtime.TripDescriptor.prototype.clearScheduleRelationship = function() {
  return jspb.Message.setField(this, 4, undefined);
};


/**
 * Returns whether this field is set.
 * @return {boolean}
 */
proto.transit_realtime.TripDescriptor.prototype.hasScheduleRelationship = function() {
  return jspb.Message.getField(this, 4) != null;
};


