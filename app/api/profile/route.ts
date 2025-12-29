import { NextRequest, NextResponse } from 'next/server';
import { getClient, query } from '@/lib/server/db';
import { requireAuth } from '@/lib/server/guards';

export const runtime = 'nodejs';

export async function GET(req: NextRequest) {
  const auth = await requireAuth(req);
  if ('response' in auth) {
    return auth.response;
  }

  const profileResult = await query(
    `SELECT u.name,
            u.email,
            o.name AS org_name,
            p.full_name,
            p.organization_name,
            p.timezone,
            p.language,
            pl.id AS plan_id,
            pl.name AS plan_name,
            pl.slug AS plan_slug,
            pl.token_limit AS plan_token_limit,
            pl.price_cents AS plan_price_cents,
            pl.price_display AS plan_price_display,
            pl.price_suffix AS plan_price_suffix
     FROM users u
     JOIN organizations o ON o.id = u.org_id
     LEFT JOIN user_profiles p ON p.user_id = u.id
     LEFT JOIN pricing_plans pl ON pl.id = u.plan_id
     WHERE u.id = $1`,
    [auth.user.id]
  );

  const usageResult = await query(
    `SELECT tokens_used,
            token_limit,
            cache_savings_gb,
            savings_cents,
            period_start,
            period_end
     FROM ai_usage
     WHERE user_id = $1
     ORDER BY period_end DESC
     LIMIT 1`,
    [auth.user.id]
  );

  const profileRow = profileResult.rows[0];
  const usageRow = usageResult.rows[0];

  return NextResponse.json({
    profile: {
      name: profileRow?.full_name ?? profileRow?.name ?? '',
      email: profileRow?.email ?? '',
      orgName: profileRow?.organization_name ?? profileRow?.org_name ?? '',
      timezone: profileRow?.timezone ?? 'EST',
      language: profileRow?.language ?? 'English',
    },
    plan: profileRow?.plan_id
      ? {
          id: profileRow.plan_id,
          name: profileRow.plan_name,
          slug: profileRow.plan_slug,
          tokenLimit: profileRow.plan_token_limit,
          priceCents: profileRow.plan_price_cents,
          priceDisplay: profileRow.plan_price_display,
          priceSuffix: profileRow.plan_price_suffix,
        }
      : null,
    usage: usageRow
      ? {
          tokensUsed: usageRow.tokens_used,
          tokenLimit: usageRow.token_limit,
          cacheSavingsGb: Number(usageRow.cache_savings_gb),
          savingsCents: usageRow.savings_cents,
          periodStart: usageRow.period_start,
          periodEnd: usageRow.period_end,
        }
      : null,
  });
}

export async function PUT(req: NextRequest) {
  const auth = await requireAuth(req);
  if ('response' in auth) {
    return auth.response;
  }

  const { name, organizationName, timezone, language } = await req.json();

  if (!name || !String(name).trim()) {
    return NextResponse.json({ error: 'Name is required.' }, { status: 400 });
  }

  const client = await getClient();
  try {
    await client.query('BEGIN');

    await client.query(
      `UPDATE users
       SET name = $1, updated_at = now()
       WHERE id = $2`,
      [String(name).trim(), auth.user.id]
    );

    await client.query(
      `INSERT INTO user_profiles (user_id, full_name, organization_name, timezone, language)
       VALUES ($1, $2, $3, $4, $5)
       ON CONFLICT (user_id) DO UPDATE SET
         full_name = EXCLUDED.full_name,
         organization_name = EXCLUDED.organization_name,
         timezone = EXCLUDED.timezone,
         language = EXCLUDED.language,
         updated_at = now()`,
      [
        auth.user.id,
        String(name).trim(),
        organizationName ? String(organizationName).trim() : null,
        timezone ? String(timezone).trim() : null,
        language ? String(language).trim() : null,
      ]
    );

    await client.query('COMMIT');
  } catch (error) {
    await client.query('ROLLBACK');
    return NextResponse.json({ error: 'Unable to update profile.' }, { status: 400 });
  } finally {
    client.release();
  }

  return NextResponse.json({ ok: true });
}
