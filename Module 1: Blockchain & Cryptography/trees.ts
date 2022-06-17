/**
 * Temporary hash functions for dev
 */
const testHash = (...input: string[]) => {
  return `{${input.join(",")}}`;
};

const NUM_CHILDREN = 2;

/** Create an Hash type for clarity, but it's all just strings */
type Hash = string;

/**
 * Key-Value storage, our poor man's database
 */
const storage = new Map<Hash, TreeNode | LeafNode | string>();

interface LeafNode {
  /** The key used to access our data from storage */
  data: Hash;
}

interface TreeNode {
  /** The hash of all children */
  data: Hash;
  children: Hash[];
}

const insertLeaf = (value: string) => {
  const key = testHash(value);
  storage.set(key, { data: value });

  // TODO which parent?
  //TODO update parents recursively
};
