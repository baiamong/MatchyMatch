/**
 * Greets a person by name
 * @param {string} name - The name of the person to greet
 * @returns {string} A greeting message
 */
export function greet(name) {
  if (!name) {
    return 'Hello, there!';
  }
  return `Hello, ${name}!`;
}
