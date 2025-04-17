const { v4: uuidv4 } = require("uuid");

function generateDeviceId() {
  return `device_${uuidv4()}`;
}

module.exports = generateDeviceId;