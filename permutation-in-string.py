class Solution:
    def checkInclusion(self, s1, s2):
        """
        :type s1: str
        :type s2: str
        :rtype: bool
        """
        c1 = collections.Counter(s1)
        return any(collections.Counter(s2[idx : idx + len(s1)]) == c1 for idx in range(len(s2) - len(s1) + 1))
        
        c1 = [0] * 26
        c2 = [0] * 26
        for ch in s1:
            c1[ord(ch) - ord('a')] += 1
        lo = 0
        for hi in range(len(s2)):
            c2[ord(s2[hi]) - ord('a')] += 1
            if c1 == c2:
                return True
            while any(c2[key] > c1[key] for key in range(26)):
                c2[ord(s2[lo]) - ord('a')] -= 1
                lo += 1
        return False
