interface TreeNode {
    key: string;
    children?: TreeNode[];
}
interface ListNode {
    key: string;
    children?: string[];
    level: number;
}
interface UseTree {
    expandedKeys: string[];
    setExpandedKeys: (keys: string[]) => void;
    dataSource: ListNode[];
    expandToLevel: (level: number) => void;
}
declare function useTree<T extends TreeNode>(treeData: T[], defaultExpandedKeys?: string[]): UseTree;
export default useTree;
