class Solution:
    def uniquePaths(self, m, n):
        """
        :type m: int
        :type n: int
        :rtype: int
        """
        if not m or not n:
            return 0
        dp = [[1] * n for _ in range(m)]
        for ii in range(1, len(dp)):
            for jj in range(1, len(dp[0])):
                dp[ii][jj] = dp[ii - 1][jj] + dp[ii][jj - 1]
        return dp[-1][-1]