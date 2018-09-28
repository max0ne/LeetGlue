class Solution:
    def checkInclusion(self, s1, s2):
        """
        :type s1: str
        :type s2: str
        :rtype: bool
        """
        c1 = collections.Counter(s1)
        c2 = collections.Counter()
        lo = 0
        for hi in range(len(s2)):
            c2[s2[hi]] += 1
            if all(c1[ch] == c2[ch] for ch in 'werqtyuiopasdfghjklzxcvbnm'):
                return True
            while any(c1[key] < c2[key] for key in 'werqtyuiopasdfghjklzxcvbnm'):
                c2[s2[lo]] -= 1
                lo += 1
        return False
