import re
p = "client/src/content/blog/long-term-care-snf-screening-civil-money-penalty.ts"
src = open(p).read()
# Drop the chain-ownership section entirely
needle = "## The chain-ownership overlay"
assert needle in src
i = src.index(needle)
# Find the next "## " heading after this one
j = src.index("## A defensible 2026 SNF screening program")
# Delete from needle to j (exclusive)
src = src[:i] + src[j:]
open(p, "w").write(src)

body = re.search(r"body:\s*`(.*?)`,", src, re.DOTALL).group(1)
ws = len(re.findall(r"\S+", body))
print("LTC body words:", ws)
