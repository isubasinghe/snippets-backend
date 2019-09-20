const loki = require("lokijs");
const beautify = require("js-beautify").js;
const sha256 = require("js-sha256").sha256;
const { NodeVM } = require("vm2");

const db = new loki("source_data.json");
db.loadDatabase();
let sources;
sources = db.getCollection("sources");
if (!sources) {
  sources = db.addCollection("sources", { indices: ["sourceHash"] });
}
db.saveDatabase();

setInterval(() => {
  db.saveDatabase();
}, 1000);

const handleAPIRequest = (req, res) => {
  const { sourceHash } = req.params;
  if (sourceHash === undefined || sourceHash === null) {
    res.status(402).json({ message: "source hash not provided" });
    return;
  }
  const source = sources.findOne({ sourceHash });
  if (source === null) {
    res.status(402).json({ message: "source code not found" });
    return;
  }
  const sandbox = req;
  const vm = new NodeVM({
    console: "redirect",
    sandbox,
    require: {
      builtin: ["http", "net"]
    }
  });
  let logBuffer = [];
  vm.on("console.log", data => {
    logBuffer.push(data);
  });

  try {
    let functionWithCallbackInSandbox = vm.run(source.source);
    functionWithCallbackInSandbox(req, cbValue => {
      const data = cbValue ? cbValue : {};
      const status = cbValue.status ? cbValue.status : 200;
      res.status(status).send({ data, logs: logBuffer });
    });
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};

const createFunction = (req, res) => {
  let source = req.body.source;
  if (source === undefined || source === null) {
    res.status(402).json({ error: "Please provide JavaScript source" });
  }
  source = beautify(source, { preserve_newlines: false });
  const sourceHash = sha256(source);
  const found = sources.findOne({ sourceHash }) !== null;
  if (found) {
    res
      .status(402)
      .json({ error: "Source already exists, function not created" });
    return;
  }
  sources.insert({ sourceHash, source });
  res.status(200).json({ message: `Created function ${sourceHash}` });
};

module.exports = { createFunction, handleAPIRequest };
