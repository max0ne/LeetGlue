# Definition for a binary tree node.
# class TreeNode:
#     def __init__(self, x):
#         self.val = x
#         self.left = None
#         self.right = None

class Solution:
    def flatten(self, root):
        """
        :type root: TreeNode
        :rtype: void Do not return anything, modify root in-place instead.
        """
        dummy = TreeNode(0)
        cur = dummy
        stack = [root] if root else []
        while stack:
            node = stack.pop()
            cur.right = node
            cur = cur.right
            node.right and stack.append(node.right)
            node.left and stack.append(node.left)
            node.left = node.right = None