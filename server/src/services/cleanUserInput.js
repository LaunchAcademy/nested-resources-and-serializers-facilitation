const cleanUserInput = (formInput) => {
  Object.keys(formInput).forEach((field) => {
    // MODIFIED FOR THIS APPLICATION
    if (formInput[field].length === 0) {
      delete formInput[field]
    }
  })
  return formInput
}

export default cleanUserInput
