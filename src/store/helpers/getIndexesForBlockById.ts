export const getIndexesForBlockById = (blockId: string, structure: any[]) => {
  if (blockId) {
    for (let i = 0; i < structure.length; i += 1) {
      for (let q = 0; q < structure[i].row.length; q += 1) {
        const tempIndex = structure[i].row[q].blocs.findIndex((block: any) => block.id === blockId);
        if (tempIndex > -1) {
          return { containerIndex: i, rowIndex: q, blockIndex: tempIndex };
        }
      }
    }
  }
  return { containerIndex: -1, rowIndex: -1, blockIndex: -1 };
};
