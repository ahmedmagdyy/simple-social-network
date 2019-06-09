const validator = require("validator");
const isEmpty = require("./is-empty");

module.exports = function ValidateProfileData(data) {
  let errors = {};

  data.handle = !isEmpty(data.handle) ? data.handle : "";
  data.status = !isEmpty(data.status) ? data.status : "";
  data.skills = !isEmpty(data.skills) ? data.skills : "";


  if (!validator.isLength(data.handle, { min: 6, max: 30 })) {
    errors.handle = "Handle needs to between 6 and 30 characters";
  }

  if (validator.isEmpty(data.handle)) {
    errors.handle = "Profile handle is required";
  }

  if (validator.isEmpty(data.status)) {
    errors.status = "status field is required";
  }

  if (validator.isEmpty(data.skills)) {
    errors.skills = "skills field is required";
  }

  if(!isEmpty(data.website)) {
    if(!validator.isURL(data.website)) {
      errors.website = "URL is invalid"
    }
  }

  if (!isEmpty(data.youtube)) {
    if (!validator.isURL(data.youtube)) {
      errors.youtube = "URL is invalid";
    }
  }

  if (!isEmpty(data.twitter)) {
    if (!validator.isURL(data.twitter)) {
      errors.twitter = "URL is invalid";
    }
  }

  if (!isEmpty(data.facebook)) {
    if (!validator.isURL(data.facebook)) {
      errors.facebook = "URL is invalid";
    }
  }

  if (!isEmpty(data.linkedin)) {
    if (!validator.isURL(data.linkedin)) {
      errors.linkedin = "URL is invalid";
    }
  }

  if (!isEmpty(data.instagram)) {
    if (!validator.isURL(data.instagram)) {
      errors.instagram = "URL is invalid";
    }
  }

  return {
    errors,
    isValid: isEmpty(errors),
  };
};
