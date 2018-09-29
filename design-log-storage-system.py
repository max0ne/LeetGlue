class LogSystem:

    def __init__(self):
        self.storage = []

    def put(self, id, timestamp):
        """
        :type id: int
        :type timestamp: str
        :rtype: void
        """
        ts = tuple(map(int, timestamp.split(':'))) + (id,)
        self.storage.insert(bisect.bisect(self.storage, ts), ts)

    def retrieve(self, s, e, gra):
        """
        :type s: str
        :type e: str
        :type gra: str
        :rtype: List[int]
        """
        gra_idx = {
            'Year': 1,
            'Month': 2,
            'Day': 3,
            'Hour': 4,
            'Minute': 5,
            'Second': 6,
        }[gra]
        lo = list(map(int, s.split(':')))[:gra_idx] + [0] * (7 - gra_idx)
        hi = list(map(int, e.split(':')))[:gra_idx] + [0] * (7 - gra_idx)
        hi[gra_idx - 1] += 1
        lo, hi = tuple(lo), tuple(hi)
        return [ts[-1] for ts in self.storage[bisect.bisect_left(self.storage, lo) : bisect.bisect_left(self.storage, hi)]]


# Your LogSystem object will be instantiated and called as such:
# obj = LogSystem()
# obj.put(id,timestamp)
# param_2 = obj.retrieve(s,e,gra)