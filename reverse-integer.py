class Solution(object):
    def reverse(self, x):
        """
        :type x: int
        :rtype: int
        """
        neg = x < 0
        res = 0
        x = abs(x)
        while x:
            res = res * 10 + x % 10
            x //= 10
        res *= (-1 if neg else 1)
        return res if -2 ** 31 <= res <= 2**31 - 1 else 0