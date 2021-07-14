const getDatabaseUrl = (nodeEnv) => {
  return (
    {
      development: "postgres://postgres:postgres@localhost:5432/nested_forms_with_express_and_objection_development",
      test: "postgres://postgres:postgres@localhost:5432/nested_forms_with_express_and_objection_test",
    }[nodeEnv] || process.env.DATABASE_URL
  )
}

module.exports = getDatabaseUrl
