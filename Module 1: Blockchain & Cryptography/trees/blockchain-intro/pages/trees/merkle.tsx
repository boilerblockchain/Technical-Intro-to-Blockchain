import {
  Box,
  FormControlLabel,
  Paper,
  Switch,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  TextField,
  Typography,
} from "@mui/material";
import type { NextPage } from "next";
import dynamic from "next/dynamic";
import React, { useEffect, useRef, useState } from "react";

import { Layout } from "../../components/Layout";

const Tree = dynamic(() => import("react-d3-tree"), {
  ssr: false,
});

const badHash = (...inputs: string[]) => {
  // const TSH = (s) => {
  //   for (var i = 0, h = 9; i < s.length; )
  //     h = Math.imul(h ^ s.charCodeAt(i++), 9 ** 9);
  //   return h ^ (h >>> 9);
  // };
  const cyrb53 = function (str: string, seed = 0) {
    let h1 = 0xdeadbeef ^ seed,
      h2 = 0x41c6ce57 ^ seed;
    for (let i = 0, ch; i < str.length; i++) {
      ch = str.charCodeAt(i);
      h1 = Math.imul(h1 ^ ch, 2654435761);
      h2 = Math.imul(h2 ^ ch, 1597334677);
    }
    h1 =
      Math.imul(h1 ^ (h1 >>> 16), 2246822507) ^
      Math.imul(h2 ^ (h2 >>> 13), 3266489909);
    h2 =
      Math.imul(h2 ^ (h2 >>> 16), 2246822507) ^
      Math.imul(h1 ^ (h1 >>> 13), 3266489909);
    return 4294967296 * (2097151 & h2) + (h1 >>> 0);
  };
  // function hashCode(str: string) {
  //   let hash = 0;
  //   for (let i = 0, len = str.length; i < len; i++) {
  //     let chr = str.charCodeAt(i);
  //     hash = (hash << 5) - hash + chr;
  //     hash |= 0; // Convert to 32bit integer
  //   }
  //   return hash;
  // }
  return cyrb53(inputs.join("")).toString(16);
};

const clearHash = (...inputs: string[]) => {
  return inputs.join("+");
};

interface TreeNode {
  name: string;
  children: TreeNode[] | LeafNode[];
}

interface LeafNode {
  name: string;
  attributes: {
    value: string;
  };
}
const buildTree = (
  leaves: string[],
  hashFunc: (...input: string[]) => string,
  k: number = 2
) => {
  const leafNodes = leaves.map((leaf) => [
    leaf,
    { name: hashFunc(leaf), attributes: { value: leaf } },
  ]);
  const treeMap = new Map<string, TreeNode | LeafNode>(leafNodes);
  const queue = [null, ...leaves];

  while (true) {
    // This adds a `null` after every "layer" of the tree
    // Since we know we hit a new layer if the top of the queue is a `null`
    if (queue[0] == null) {
      queue.shift();

      // This ends the entire loop once there are not enough nodes for another layer
      if (queue.length < k) {
        break;
      }
      queue.push(null);
    }

    // Grab up to k siblings, without including nodes from the next layer
    let j;
    for (j = 0; j < k; j++) {
      if (queue[j] == null) break;
    }
    const children = queue.splice(0, j) as string[];

    // If we don't have k nodes, simply move leftover nodes to the next layer
    if (children.length < k) {
      queue.push(...children);
      continue;
    }

    // A way to combine k nodes e.g hash functions. This is for show.
    const key = hashFunc(...children);
    queue.push(key);
    const descendants = children.map((child) => treeMap.get(child));
    treeMap.set(key, { name: key, children: descendants });
  }

  if (queue.length !== 1) return { map: null, root: null };

  return { map: treeMap, root: queue[0] as unknown as string };
};

// const convertKeyPairsToObj = (treeMap: Map<string, string[]>, root: string) => {
//   console.log("ckp", treeMap, root);
//   const children = treeMap.get(root) as string[];
//   const node = {
//     name: root,
//     children: children.map((child) => convertKeyPairsToObj(treeMap, child)),
//   };
//   return node;
// };

const DEFAULT_TREE = {
  name: "Add data to the tree",
  // children: [
  //   {
  //     name: "Child One",
  //   },
  //   {
  //     name: "Child Two",
  //   },
  // ],
};
const Merkle: NextPage = () => {
  const [value, setValue] = useState("");
  const [keyValues, setKeyValues] = useState(new Map<string, string>());

  const [treeData, setTreeData] = useState(DEFAULT_TREE);
  const [useClearHash, setUseClearHash] = useState(true);

  const hash = useClearHash ? clearHash : badHash;

  const onFormSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const key = hash(value);
    setKeyValues(new Map(keyValues.set(key, value)));
    setValue("");
  };

  const onChangeAddValue = (e: React.ChangeEvent<HTMLInputElement>) => {
    setValue(e.target.value);
  };

  useEffect(() => {
    const leaves = Array.from(keyValues.values());
    const { map: treeMap, root } = buildTree(leaves, hash);
    if (treeMap == null) {
      return;
    }
    const newTreeData = treeMap.get(root);
    setTreeData(newTreeData);
  }, [hash, keyValues]);

  const treeRef = useRef(null);

  const dimensions = (() => {
    if (treeRef.current == null) return;
    return treeRef.current.getBoundingClientRect();
  })();

  const treeTranslate = dimensions
    ? { x: dimensions.width / 2, y: dimensions.height / 2 }
    : undefined;

  return (
    <Layout title="Merkle Tree">
      <div
        style={{
          display: "flex",
          flexDirection: "row",
          width: "100%",
          height: "100%",
        }}
      >
        <Box sx={{ flexBasis: 250, p: 2 }}>
          <form onSubmit={onFormSubmit}>
            <TextField
              label="Add Data"
              variant="outlined"
              size="small"
              value={value}
              onChange={onChangeAddValue}
            />
          </form>
          <FormControlLabel
            control={<Switch defaultChecked />}
            label="Use Simple Hash"
            value={useClearHash}
            onChange={() => setUseClearHash(!useClearHash)}
          />
          <TableContainer component={Paper}>
            <Table aria-label="simple table">
              <TableHead>
                <TableRow>
                  <TableCell>Hash</TableCell>
                  <TableCell align="right">Data Value</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {Array.from(keyValues.values()).map((value) => (
                  <TableRow
                    key={hash(value)}
                    sx={{ "&:last-child td, &:last-child th": { border: 0 } }}
                  >
                    <TableCell component="th" scope="row">
                      {hash(value)}
                    </TableCell>
                    <TableCell align="right">{value}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
        </Box>
        <div
          style={{
            height: "100vh",
            width: "100%",
            flex: 1,
            border: "2px solid #eee",
            borderRadius: 4,
          }}
          ref={treeRef}
        >
          <Tree
            data={treeData}
            translate={treeTranslate}
            dimensions={dimensions}
            separation={{ siblings: 1.4, nonSiblings: 1.5 }}
            orientation="vertical"
            zoomable={true}
            zoom={1}
            scaleExtent={{ min: 0.1, max: 2 }}
          />
        </div>
      </div>
    </Layout>
  );
};
export default Merkle;
