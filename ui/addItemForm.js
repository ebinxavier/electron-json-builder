function htmlToElement(html) {
  var template = document.createElement("template");
  html = html.trim(); // Never return a text node of whitespace as the result
  template.innerHTML = html;
  return template.content.firstChild;
}

const addItemForm = (index = 0) => {
  const root = document.getElementById("items");
  const element = htmlToElement(`
    <div id="card${index}">
        <div class="card">
            <button id="remove${index}" type="button" class="btn btn-danger removeBtn">Remove</button>
            <div class="form-row card-body">
                <div class="form-group col-md-4">
                    <label for="componentName">Component Name</label>
                    <input
                    class="form-control"
                    name="items.componentName.${index}"
                    placeholder="Enter Component Name"
                    />
                </div>
                <div class="form-group col-md-4">
                    <label for="select">Select</label>
                    <input class="form-control" name="items.select.${index}" placeholder="Select" />
                </div>
                <div class="form-group col-md-4">
                    <label for="from">From</label>
                    <input class="form-control" name="items.from.${index}" placeholder="From" />
                </div>
                <div class="form-group col-md-4">
                    <label for="where">Where</label>
                    <input class="form-control" name="items.where.${index}" placeholder="Where" />
                </div>
                <div class="form-group col-md-4">
                    <label for="responseAttribute">Response Attribute</label>
                    <input
                    class="form-control"
                    name="items.responseAttribute.${index}"
                    placeholder="Response Attribute"
                    />
                </div>
                <div class="form-group col-md-4">
                    <label for="responseAttribute">Src/Dest</label>
                    <select name="items.srcDest.${index}" class="custom-select" required>
                    <option value="">Open this select menu</option>
                    <option value="source">Source</option>
                    <option value="destination">Destination</option>
                    </select>
                </div>
            </div>
        </div>
    </div>
`);

  root.appendChild(element);
};

let index = 0;
document.getElementById("addItem").onclick = () => addItemForm(index++);

const handleRemove = (event) => {
  const id = event.target.id;
  if (id.includes("remove")) {
    const index = id.split("remove")[1];
    document.getElementById(`card${index}`).remove();
  }
};
document.getElementById("items").onclick = handleRemove;
