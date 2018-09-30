class Solution:
    def robotSim(self, commands, obstacles):
        """
        :type commands: List[int]
        :type obstacles: List[List[int]]
        :rtype: int
        """
        dirs = [
            [0, 1],
            [1, 0],
            [0, -1],
            [-1, 0],
        ]
        
        curpos = [0, 0]
        curdir = 0
        res = 0
        obstacles = set((r, c) for r, c in obstacles)
        
        for cmd in commands:
            if cmd < 0:
                curdir = (curdir + (1 if cmd == -1 else -1) + 4) % 4
                continue
            
            for step in range(cmd):
                nextpos = tuple(a + b for a, b in zip(curpos, dirs[curdir]))
                if nextpos in obstacles:
                    break
                curpos = nextpos
            res = max(res, curpos[0] ** 2 + curpos[1] ** 2)
        return res