#!/bin/bash
# IM168 设计规范 v2.1 · 提交前机械检查
# 用法：./check-design.sh          检查默认文件集
#       ./check-design.sh <文件…>  只检查指定文件
# 规则来源：DESIGN_SYSTEM.md §4.1 / §4.3
#   1) 任何 font-size 不得小于 12px（角标必须用 var(--fs-badge)，不允许裸写 11px）
#   2) font 简写同样不得携带 <12px 字号
#   3) 已废除的 --fs-micro 不得再出现
#   4) 与 token 同值的裸 hex 不得出现（一律 var(--*)）
# 退出码：0 = 全部通过；1 = 存在违规

cd "$(dirname "$0")" || exit 2

if [ $# -gt 0 ]; then
  FILES=("$@")
else
  FILES=(shared/styles.css shared/design-tokens.css shared/app.js views/*.js index.html)
fi

FAIL=0
section() { printf '\n\033[1m%s\033[0m\n' "$1"; }
report() { # $1=标题 $2=grep输出
  if [ -n "$2" ]; then
    FAIL=1
    printf '\033[31m✗ %s\033[0m\n%s\n' "$1" "$2"
  else
    printf '\033[32m✓ %s\033[0m\n' "$1"
  fi
}

section "① 字号底线（<12px 禁止，角标走 var(--fs-badge)）"
OUT=$(grep -nE 'font-size:\s*(([0-9]|1[01])(\.[0-9]+)?)px' "${FILES[@]}" 2>/dev/null)
report "font-size 无 <12px 裸值" "$OUT"

OUT=$(grep -nE 'font:[^;{}]*[^0-9.](([0-9]|1[01])(\.[0-9]+)?)px\s*/' "${FILES[@]}" 2>/dev/null)
report "font 简写无 <12px 字号" "$OUT"

OUT=$(grep -n 'fs-micro' "${FILES[@]}" 2>/dev/null)
report "无已废除的 --fs-micro" "$OUT"

section "② 颜色归一（禁止与 token 同值的裸 hex）"
# token 同值 hex + 已并入的旧色（外壳蓝 #1F6FFF、英雄渐变端色除外——渐变必须整体引用 var(--hero-grad)）
TOKEN_HEX='9CA3AF|6B7280|98A2B3|414141|344054|34373C|126BFF|0B5ADC|1F6FFF|E7F0FF|EEF4FF|BBD4FF|CFE0FF|E8E8E8|D5D9DF|F4F5F7|F5F5F5|16A34A|E6F6EE|EF3939|FDECEC|9A6C00|FFF8E0|C08C38'
CHECK_FILES=()
for f in "${FILES[@]}"; do
  [ "$f" = "shared/design-tokens.css" ] && continue  # token 定义处允许出现
  CHECK_FILES+=("$f")
done
OUT=$(grep -inE "#(${TOKEN_HEX})\b" "${CHECK_FILES[@]}" 2>/dev/null)
report "无 token 同值裸 hex" "$OUT"

section "③ token 文件完整性"
MISSING=""
for t in fs-badge fs-caption fs-body fs-body-lg muted faint fill line-strong hero-grad; do
  grep -q -- "--$t:" shared/design-tokens.css || MISSING="$MISSING --$t"
done
report "design-tokens.css 必备 token 齐全" "$MISSING"

echo
if [ $FAIL -eq 0 ]; then
  printf '\033[32m全部通过 ✔\033[0m\n'
else
  printf '\033[31m存在违规，请按 DESIGN_SYSTEM.md §4.1/§4.3 修正后再提交。\033[0m\n'
fi
exit $FAIL
