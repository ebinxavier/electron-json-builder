const getValues = () => {
  var formData = new FormData(document.form);
  const entries = Array.from(formData.entries());
  const items = Object.values(
    entries
      .filter(([key]) => key.includes("items"))
      .reduce((acc, [key, value]) => {
        const [, keyName, index] = key.split(".");
        if (!acc[index]) acc[index] = {};
        acc[index][keyName] = value;
        return acc;
      }, {})
  );
  const common = entries.reduce((acc, [key, value]) => {
    if (!key.includes("items")) {
      const [root, keyName] = key.split(".");
      if (!acc[root]) acc[root] = {};
      acc[root][keyName] = value;
    }
    return acc;
  }, {});
  const handlers = generateSourceDestinationJSON(items);
  console.log({ items, common, handlers });
  return { common, handlers };
};

const onSubmit = () => {
  // call your main.js function here
  const { common, handlers } = getValues();
  window.api
    .invoke("doJSONConversion", { common, handlers })
    .then(function (res) {
      console.log(res); // will print "This worked!" to the browser console
    })
    .catch(function (err) {
      console.error(err); // will print "This didn't work!" to the browser console.
    });
};
