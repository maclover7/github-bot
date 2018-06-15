// order of entries in this map *does* matter for the resolved teams
// earlier entries override later entries
const subSystemLabelsMap = new Map([
  /* src subsystems */
  [/^benchmark\//, ['@nodejs/benchmarking', '@mscdex']],
  [/^doc\//, ['@nodejs/documentation']],

  /* Dependencies */

  /* JS subsystems */
  [/^lib\/assert/, '@nodejs/testing'],
  [/^lib\/async_hooks/, ['@nodejs/async_hooks', '@nodejs/diagnostics'],
  [/^lib\/buffer/, '@nodejs/buffer'],
  [/^lib\/child_process/, '@nodejs/child_process'],
  [/^lib\/cluster/, '@nodejs/cluster'],
  [/^lib\/(crypto|tls|https)/, '@nodejs/crypto'],
  [/^lib\/dgram/, '@nodejs/dgram'],
  [/^lib\/domains/, '@nodejs/domains'],
  [/^lib\/fs/, '@nodejs/fs'],
  [/^lib\/inspector/, '@nodejs/v8-inspector'],
  [/^lib\/internal\/bootstrap/, '@nodejs/process'],
  [/^lib\/internal\/url/, '@nodejs/url'],
  [/^lib\/net/, ['bnoordhuis', 'indutny']],
  [/^lib\/repl/, '@nodejs/repl'],
  [/^lib\/timers/, '@nodejs/timers'],
  [/^lib\/util/, '@nodejs/util'],
  [/^lib\/zlib/, '@nodejs/zlib'],
])
