export { default as registerValidator } from "./register.validator";
export { default as loginValidator } from "./login.validator";
export { default as verifyValidator } from "./verify.validator";
export { forgotPasswordValidator, resetPasswordValidator } from "./password.validator";
export { updateProfileValidator, updateProfileImageValidator } from "./profile.validator";

// Admin validators
export * from "./admin";
