class Solution:
    def mostCommonWord(self, paragraph, banned):
        """
        :type paragraph: str
        :type banned: List[str]
        :rtype: str
        """
        banned = set(banned)
        return [word for word, _ in collections.Counter(word.lower() for word in  re.split(r'\W', paragraph)).most_common() if word and word not in banned][0]