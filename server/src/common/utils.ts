function filterOutNullOrUndefined(
  obj: Record<string, any>,
): Record<string, any> {
  return Object.entries(obj).reduce(
    (prev: Record<string, any>, [key, value]) => {
      if (typeof value !== "undefined" && value !== null) {
        prev[key] = value;
      }
      return prev;
    },
    {},
  );
}

function buildUpdateQuery(
  data: any,
  conditions: any,
): { query: string; values: any[] } {
  const filterdData = filterOutNullOrUndefined(data);

  const query = ["UPDATE boards SET"];

  const dataKeys = Object.keys(filterdData);
  const updates = dataKeys.map((key, i) => `"${key}" = $${i + 1}`).join(", ");
  const length = dataKeys.length;

  query.push(updates);

  const conditionText = Object.keys(conditions)
    .map((key, i) => `"${key}" = $${i + 1 + length}`)
    .join(" AND ");

  query.push(`WHERE ${conditionText}`);

  const dataValues = Object.values(filterdData);
  const conditionValues = Object.values(conditions);

  const values = [...dataValues, ...conditionValues];

  return { query: query.join(" "), values };
}

export { buildUpdateQuery, filterOutNullOrUndefined };
