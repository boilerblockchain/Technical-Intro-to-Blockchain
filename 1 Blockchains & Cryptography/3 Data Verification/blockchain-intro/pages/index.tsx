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
import { Layout } from "../components/Layout";

const ResizePanel = dynamic(() => import("react-resize-panel"), {
  ssr: false,
});
const Tree = dynamic(() => import("react-d3-tree"), {
  ssr: false,
});

const badHash = (...inputs: string[]) => {
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
  return cyrb53(inputs.join("")).toString(16);
};

const clearHash = (...inputs: string[]) => {
  return inputs.join("+");
};

interface BranchNode {
  name: string;
  children: (BranchNode | LeafNode)[];
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
  leaves.sort();
  const leafNodes = leaves.map((leaf) => [
    leaf,
    { name: hashFunc(leaf), attributes: { value: leaf } },
  ]) as [string, LeafNode][];
  const treeMap = new Map<string, BranchNode | LeafNode>(leafNodes);
  const queue = [null, ...leaves];

  while (true) {
    if (queue[0] == null) {
      queue.shift();

      if (queue.length < k) {
        break;
      }
      queue.push(null);
    }

    let j;
    for (j = 0; j < k; j++) {
      if (queue[j] == null) break;
    }
    const children = queue.splice(0, j) as string[];

    if (children.length < k) {
      queue.push(...children);
      continue;
    }

    const key = hashFunc(...children);
    queue.push(key);
    const descendants = children.map(
      (child) => treeMap.get(child) as BranchNode | LeafNode
    );
    treeMap.set(key, { name: key, children: descendants });
  }

  if (queue.length !== 1) return { map: null, root: null };

  return { map: treeMap, root: queue[0] as unknown as string };
};

const DEFAULT_TREE = {
  name: "Add data to the tree",
  // children: [
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
    keyValues.set(key, value);
    setKeyValues(new Map(Array.from(keyValues).sort()));
    setValue("");
  };

  const onChangeAddValue = (e: React.ChangeEvent<HTMLInputElement>) => {
    setValue(e.target.value);
  };

  const handleChangeValue =
    (oldHash: string) => (e: React.FocusEvent<HTMLInputElement>) => {
      const key = hash(e.target.value);
      if (key === oldHash) return;

      keyValues.delete(oldHash);

      if (key !== "") {
        keyValues.set(key, e.target.value);
      }
      setKeyValues(new Map(Array.from(keyValues).sort()));
    };

  useEffect(() => {
    const leaves = Array.from(keyValues.values());
    const { map: treeMap, root } = buildTree(leaves, hash);
    if (treeMap == null || root == null) {
      return;
    }
    const newTreeData = treeMap.get(root) as BranchNode;
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

  const onTextFieldEnter = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") {
      e.target.blur();
    }
  };

  return (
    <Layout title="Merkle Tree">
      <div
        style={{
          display: "flex",
          flexDirection: "row",
          width: "100%",
          height: "100vh",
        }}
      >
        <ResizePanel direction="e" style={{ minWidth: 200, width: 400 }}>
          <Box sx={{ p: 2, overflowY: "scroll", width: "100%" }}>
            <Paper sx={{ p: 2, mb: 2 }}>
              <Typography variant="h6">Merkle Tree Data</Typography>
              <FormControlLabel
                control={<Switch defaultChecked />}
                label="Use Simple Hash"
                value={useClearHash}
                onChange={() => setUseClearHash(!useClearHash)}
              />
              <form onSubmit={onFormSubmit}>
                <TextField
                  fullWidth
                  label="Add Data Entry"
                  variant="outlined"
                  size="small"
                  value={value}
                  onChange={onChangeAddValue}
                />
              </form>
            </Paper>
            <TableContainer component={Paper}>
              <Table aria-label="simple table">
                <TableHead>
                  <TableRow>
                    <TableCell>Hash</TableCell>
                    <TableCell align="right">Data Value</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {Array.from(keyValues.entries()).map(([key, value]) => {
                    return (
                      <TableRow
                        key={key}
                        sx={{
                          "&:last-child td, &:last-child th": { border: 0 },
                          transition: "ease-in-out",
                        }}
                      >
                        <TableCell component="th" scope="row">
                          {key}
                        </TableCell>
                        <TableCell align="right">
                          <TextField
                            sx={{ flexShrink: 0 }}
                            fullWidth
                            size="small"
                            defaultValue={value}
                            onKeyDown={onTextFieldEnter}
                            onBlur={handleChangeValue(key)}
                          />
                        </TableCell>
                      </TableRow>
                    );
                  })}
                </TableBody>
              </Table>
            </TableContainer>
          </Box>
        </ResizePanel>
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
