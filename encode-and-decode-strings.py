class Codec:

    def encode(self, strs):
        strs = strs + ['']
        return '-'.join([ss.replace('\\', '\\\\').replace('-', '\\-') for ss in strs])
        
    def decode(self, s):
        if not s:
            return []
        strs = []
        curr = ''
        idx = 0
        while idx < len(s):
            if s[idx] == '\\':
                curr += s[idx : idx + 2].replace('\\\\', '\\').replace('\\-', '-')
                idx += 1
            elif s[idx] == '-':
                strs.append(curr)
                curr = ''
            else:
                curr += s[idx]
            idx += 1
        return strs

# Your Codec object will be instantiated and called as such:
# codec = Codec()
# codec.decode(codec.encode(strs))