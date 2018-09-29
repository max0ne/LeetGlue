class Solution:
    def moveZeroes(self, nums):
        """
        :type nums: List[int]
        :rtype: void Do not return anything, modify nums in-place instead.
        """
        cursor = 0
        for nn in nums:
            if nn != 0:
                nums[cursor] = nn
                cursor += 1
        while cursor < len(nums):
            nums[cursor] = 0
            cursor += 1