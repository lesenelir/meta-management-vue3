export function checkPhoneValidator (rule, value, callback) {
  if (!value) {
    return callback(new Error('Mobile phone number cannot be empty'))
  } else {
    const reg = /^1[3|4|5|7|8][0-9]\d{8}$/
    if (reg.test(value)) {
      callback()
    } else {
      return callback(new Error('Please enter the correct mobile phone number'))
    }
  }
}
