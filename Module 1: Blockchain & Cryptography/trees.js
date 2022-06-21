/**
 * Temporary hash functions for dev
 *
 */
const testHash = (...input) => {
  return `{${input.join(",")}}`;
};

const NUM_CHILDREN = 2;

/**
 * Maps as key-value storage
 * Maps a Hash to TreeNode | LeafNode | data/string
 */
const treeStorage = new Map();
const dataStorage = new Map();

// interface LeafNode {
//   /** The key used to access our data from storage */
//   value: Hash;
// }

// interface TreeNode {
//   /** The hash of all children */
//   value: Hash;
//   children: Hash[];
// }

let rootHash;

const buildTree = () => {
  const leafNodeHashes = Array.from(dataStorage.keys()).sort();

  let remainingNodes = leafNodeHashes.map((hash) => ({ value: hash }));
  let parentNodes = [];
  for (let i = 0; i < remainingNodes.length; i += NUM_CHILDREN) {
    const siblingNodes = remainingNodes.slice(i, i + NUM_CHILDREN);
    const siblingHashes = siblingNodes.map((node) => node.value);

    const parentNode = {
      value: testHash(...siblingHashes),
      children: siblingHashes,
    };

    parentNodes.push(parentNode);
    treeStorage.set(parentNode.value, parentNode);

    if (i + NUM_CHILDREN >= remainingNodes.length && parentNodes.length > 1) {
      remainingNodes = parentNodes;
      parentNodes = [];
      i = -NUM_CHILDREN;
    }
  }

  rootHash = parentNodes[0].value;
  console.debug(Array.from(treeStorage.entries()).map(([k, v]) => ({ k, v })));
};

const drawTree = (container) => {
  container.textContent = "";
  const queue = [rootHash, null];

  let depth = 0;
  let siblingIndex = 0;

  const treeHeight = Math.ceil(
    Math.log(dataStorage.size) / Math.log(NUM_CHILDREN)
  );

  while (queue.length) {
    const currHash = queue.shift();
    if (currHash == null) {
      if (!queue.length) break;

      queue.push(null);
      depth++;
      siblingIndex = 0;
      continue;
    }

    const currNode = treeStorage.get(currHash);
    const text = currHash;
    // text = currNode.value;
    if (currNode) {
      queue.push(...currNode.children);
    }

    drawNode(container, text, treeHeight, depth, siblingIndex);

    siblingIndex++;
  }
};

/**
 *  Braindead node positioning
 *  Don't look at this, use a library pls
 */
const drawNode = (container, text, treeHeight, depth, siblingIndex) => {
  const node = document.createElement("span");

  node.textContent = text;
  node.style.position = "absolute";

  const invHeight = treeHeight - depth;

  const leftOffsetUnits = invHeight ? Math.pow(2, invHeight - 1) - 1 / 2 : 0;
  const leftOffset = leftOffsetUnits * spacing;

  const siblingOffset = siblingIndex * Math.pow(2, invHeight) * spacing;

  const leftDistance = leftOffset + siblingOffset;

  node.style.transform = `translate(${leftDistance}px, ${
    depth * nodeHeight
  }px)`;
  node.style.width = `${nodeWidth}px`;
  node.style.height = `${nodeHeight}px`;

  node.style.backgroundColor = "red";

  container.appendChild(node);
};

const insertLeaf = (value) => {
  const key = testHash(value);
  dataStorage.set(key, value);

  treeStorage.clear();
  buildTree();

  drawTree(treeBox);
  //storage.set(key, { data: value });

  // const rootKey = storage.keys[0];
};

const updateLeaf = (key) => {
  dataStorage.set(key, value);
};

/**
 * Initializing Stuffs
 */
const el = Object.fromEntries(
  [
    "treeBox",
    "dataInput",
    "dataForm",
    "nodeWidthInput",
    "nodeWidthText",
    "nodeHeightInput",
    "nodeHeightText",
    "spacingInput",
    "spacingText",
  ].map((id) => {
    const element = document.getElementById(id);
    return [id, element];
  })
);

let nodeHeight;
let nodeWidth;
let spacing;

const updateNodeWidth = (width) => {
  nodeWidth = width;
  el.nodeWidthText.textContent = `${nodeWidth} px`;
};
const updateNodeHeight = (height) => {
  nodeHeight = height;
  el.nodeHeightText.textContent = `${nodeHeight} px`;
};
const updateSpacing = (newSpacing) => {
  spacing = newSpacing;
  el.spacingText.textContent = `${spacing} px`;
};

updateNodeWidth(60);
updateNodeHeight(40);
updateSpacing(80);

el.nodeWidthInput.addEventListener("input", (e) =>
  updateNodeWidth(e.target.value)
);
el.nodeHeightInput.addEventListener("input", (e) =>
  updateNodeHeight(e.target.value)
);
el.spacingInput.addEventListener("input", (e) => updateSpacing(e.target.value));

el.nodeWidthInput.addEventListener("change", () => drawTree(treeBox));
el.nodeHeightInput.addEventListener("change", () => drawTree(treeBox));
el.spacingInput.addEventListener("change", () => drawTree(treeBox));

el.dataForm.addEventListener("submit", (e) => {
  e.preventDefault();
  insertLeaf(dataInput.value);
  dataInput.value = "";
});

// addButton.addEventListener("click", () => insertLeaf(dataInput.value));
