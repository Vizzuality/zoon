export const exceptionToErrors = (e) => ({ error: [e.message] });

export const errorToErrors = (json) => {
  if (json.errors) {
    return json.errors;
  } else if (json.error) {
    return { error: [json.error] };
  }
};
