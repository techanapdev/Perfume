-- Read-only assertions for the initial Core baseline. Run after applying ADR 0004.
do $$
declare
  expected record;
  observed record;
  relation regclass;
  role_name text;
begin
  if current_setting('plpgsql.check_asserts') <> 'on' then
    raise exception 'Enable plpgsql.check_asserts before running Core assertions';
  end if;
  for expected in
    select * from (values
      ('customers', 'id', 'uuid', false, ''),
      ('customers', 'auth_user_id', 'uuid', false, ''),
      ('customers', 'created_at', 'timestamp with time zone', false, ''),
      ('products', 'id', 'bigint', false, 'a'),
      ('products', 'created_at', 'timestamp with time zone', false, ''),
      ('product_variants', 'id', 'bigint', false, 'a'),
      ('product_variants', 'product_id', 'bigint', false, ''),
      ('product_variants', 'created_at', 'timestamp with time zone', false, ''),
      ('orders', 'id', 'uuid', false, ''),
      ('orders', 'customer_id', 'uuid', false, ''),
      ('orders', 'created_at', 'timestamp with time zone', false, ''),
      ('order_items', 'id', 'uuid', false, ''),
      ('order_items', 'order_id', 'uuid', false, ''),
      ('order_items', 'variant_id', 'bigint', true, ''),
      ('order_items', 'created_at', 'timestamp with time zone', false, ''),
      ('payments', 'id', 'uuid', false, ''),
      ('payments', 'order_id', 'uuid', false, ''),
      ('payments', 'created_at', 'timestamp with time zone', false, '')
    ) as columns(table_name, column_name, type_name, nullable, identity_kind)
  loop
    select format_type(a.atttypid, a.atttypmod) as type_name,
      not a.attnotnull as nullable, a.attidentity::text as identity_kind,
      pg_get_expr(d.adbin, d.adrelid) as default_value into observed
    from pg_attribute a
    left join pg_attrdef d on d.adrelid = a.attrelid and d.adnum = a.attnum
    where a.attrelid = to_regclass('public.' || expected.table_name)
      and a.attname = expected.column_name and not a.attisdropped;
    assert found, 'Missing Core column: ' || expected.table_name || '.' || expected.column_name;
    assert observed.type_name = expected.type_name
      and observed.nullable = expected.nullable
      and observed.identity_kind = expected.identity_kind, 'Core column contract mismatch';
    if expected.column_name = 'created_at' then
      assert observed.default_value = 'now()', 'Timestamp default mismatch';
    elsif expected.column_name = 'id' and expected.type_name = 'uuid' then
      assert observed.default_value = 'gen_random_uuid()', 'UUID default mismatch';
    end if;
  end loop;

  for expected in
    select * from (values
      ('customers', 'auth_user_id', 'auth.users'),
      ('product_variants', 'product_id', 'public.products'),
      ('orders', 'customer_id', 'public.customers'),
      ('order_items', 'order_id', 'public.orders'),
      ('order_items', 'variant_id', 'public.product_variants'),
      ('payments', 'order_id', 'public.orders')
    ) as links(table_name, column_name, target)
  loop
    relation := to_regclass('public.' || expected.table_name);
    assert exists (
      select 1 from pg_constraint c
      join pg_attribute source on source.attrelid = c.conrelid and source.attnum = c.conkey[1]
      join pg_attribute target on target.attrelid = c.confrelid and target.attnum = c.confkey[1]
      where c.conrelid = relation and c.contype = 'f'
        and source.attname = expected.column_name
        and c.confrelid = to_regclass(expected.target) and target.attname = 'id'
        and c.confdeltype = 'r' and c.convalidated and source.atttypid = target.atttypid
    ), 'FK/delete contract mismatch: ' || expected.table_name || '.' || expected.column_name;
    assert exists (
      select 1 from pg_index i
      join pg_attribute a on a.attrelid = i.indrelid and a.attnum = i.indkey[0]
      where i.indrelid = relation and a.attname = expected.column_name and i.indisvalid
    ), 'Unindexed Core FK';
  end loop;

  foreach relation in array array[
    'public.customers'::regclass, 'public.products'::regclass,
    'public.product_variants'::regclass, 'public.orders'::regclass,
    'public.order_items'::regclass, 'public.payments'::regclass
  ] loop
    assert (select relrowsecurity from pg_class where oid = relation), 'RLS disabled';
    assert not exists (select 1 from pg_policy where polrelid = relation), 'Unexpected Core policy';
    assert exists (select 1 from pg_constraint where conrelid = relation and contype = 'p'), 'Missing PK';
    assert not exists (
      select 1 from pg_class c, lateral aclexplode(c.relacl) acl
      where c.oid = relation and acl.grantee = 0
    ), 'Unexpected PUBLIC privilege';
    foreach role_name in array array['anon', 'authenticated'] loop
      assert not has_table_privilege(role_name, relation,
        'SELECT,INSERT,UPDATE,DELETE,TRUNCATE,REFERENCES,TRIGGER'), 'Unexpected client table privilege';
    end loop;
  end loop;

  foreach role_name in array array['anon', 'authenticated'] loop
    assert not has_sequence_privilege(role_name, 'public.products_id_seq', 'USAGE,SELECT,UPDATE')
      and not has_sequence_privilege(role_name, 'public.product_variants_id_seq', 'USAGE,SELECT,UPDATE'),
      'Unexpected client identity privilege';
  end loop;
  assert exists (select 1 from pg_constraint where conrelid = 'public.customers'::regclass
    and contype = 'u' and conkey = array[(select attnum from pg_attribute
      where attrelid = 'public.customers'::regclass and attname = 'auth_user_id')]::smallint[]),
    'Missing unique Auth linkage';
  assert not exists (select 1 from pg_constraint where conrelid = 'public.payments'::regclass
    and contype = 'u'), 'Payment cardinality prematurely fixed';
end;
$$;

select 'PASS: initial Core columns, identity defaults, FKs, RESTRICT, indexes, RLS and client privileges' as result;
