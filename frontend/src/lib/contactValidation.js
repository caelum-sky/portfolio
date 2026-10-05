/**
 * Shared client-side validation for the contact form.
 * Kept framework-free so it can be unit-tested without a DOM.
 */

export const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;

export const LIMITS = {
  name: { min: 2, max: 120 },
  email: { max: 200 },
  message: { min: 10, max: 5000 },
};

/**
 * Validate the contact form payload.
 * @param {{name: string, email: string, message: string}} form
 * @returns {{name?: string, email?: string, message?: string}} field → error message (empty when valid)
 */
export function validateContact(form) {
  const errors = {};
  const name = (form.name || "").trim();
  const email = (form.email || "").trim();
  const message = (form.message || "").trim();

  if (name.length < LIMITS.name.min) {
    errors.name = `Name must be at least ${LIMITS.name.min} characters.`;
  } else if (name.length > LIMITS.name.max) {
    errors.name = `Name must be under ${LIMITS.name.max} characters.`;
  }

  if (!email) {
    errors.email = "Email is required.";
  } else if (email.length > LIMITS.email.max || !EMAIL_RE.test(email)) {
    errors.email = "Enter a valid email address.";
  }

  if (message.length < LIMITS.message.min) {
    errors.message = `Message must be at least ${LIMITS.message.min} characters.`;
  } else if (message.length > LIMITS.message.max) {
    errors.message = `Message must be under ${LIMITS.message.max} characters.`;
  }

  return errors;
}

/** True when the errors object has no field errors. */
export function isValid(errors) {
  return !errors || Object.keys(errors).length === 0;
}
