import 'dotenv/config';
import { Pool } from 'pg';
import bcrypt from 'bcryptjs';

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
});

const DEFAULT_ORG_NAME = process.env.LEXDRAFT_DEFAULT_ORG_NAME || 'LexDraft';
const SUPER_ADMIN_EMAIL = process.env.LEXDRAFT_SUPER_ADMIN_EMAIL || 'admin@lexdraft.local';
const SUPER_ADMIN_PASSWORD = process.env.LEXDRAFT_SUPER_ADMIN_PASSWORD || 'lexdraft_admin';
const SUPER_ADMIN_NAME = process.env.LEXDRAFT_SUPER_ADMIN_NAME || 'LexDraft Admin';

const entities = ['users', 'roles', 'projects', 'files', 'orgs', 'audit_logs', 'providers'];
const actions = ['create', 'read', 'update', 'delete', 'manage'];

const permissions = entities.flatMap((entity) =>
  actions.map((action) => ({
    key: `${entity}:${action}`,
    description: `${action} ${entity}`,
  }))
);

const roleDefinitions = [
  {
    name: 'Admin',
    description: 'Full access to organization settings and data.',
    permissionKeys: permissions.map((permission) => permission.key),
  },
  {
    name: 'Attorney',
    description: 'Manage legal work and view operational data.',
    permissionKeys: [
      'projects:create',
      'projects:read',
      'projects:update',
      'projects:delete',
      'files:create',
      'files:read',
      'files:update',
      'files:delete',
      'users:read',
      'roles:read',
      'orgs:read',
      'audit_logs:read',
      'providers:read',
    ],
  },
  {
    name: 'Paralegal',
    description: 'Draft and update documents with limited admin access.',
    permissionKeys: [
      'projects:create',
      'projects:read',
      'projects:update',
      'files:create',
      'files:read',
      'files:update',
      'users:read',
      'roles:read',
    ],
  },
  {
    name: 'Viewer',
    description: 'Read-only access to projects and files.',
    permissionKeys: [
      'projects:read',
      'files:read',
    ],
  },
];

const pricingPlans = [
  {
    name: 'Starter',
    slug: 'starter',
    description: 'Perfect for solo practitioners exploring AI drafting.',
    priceCents: 0,
    priceSuffix: '/mo',
    ctaLabel: 'Get Started',
    ctaHref: '/app',
    isFeatured: false,
    sortOrder: 1,
    features: ['5 Projects', 'Basic Templates', 'Community Support'],
    tokenLimit: 20000,
  },
  {
    name: 'Team',
    slug: 'team',
    description: 'For small firms needing collaboration and advanced models.',
    priceCents: 4900,
    priceSuffix: '/user/mo',
    ctaLabel: 'Start Free Trial',
    ctaHref: '/app',
    isFeatured: true,
    sortOrder: 2,
    features: ['Unlimited Projects', 'Advanced AI Models', 'Collaborative Editing', 'Priority Support'],
    tokenLimit: 20000,
  },
  {
    name: 'On-Premise',
    slug: 'on-premise',
    description: 'Full control for enterprise compliance requirements.',
    priceDisplay: 'Custom',
    ctaLabel: 'Contact Sales',
    ctaHref: '/contact',
    isFeatured: false,
    sortOrder: 3,
    features: ['Self-hosted Deployment', 'Local LLM (Ollama) Support', 'SSO / SAML', 'Dedicated Account Manager'],
    tokenLimit: 0,
  },
];

const ensurePermissions = async (client) => {
  for (const permission of permissions) {
    await client.query(
      `INSERT INTO permissions (key, description)
       VALUES ($1, $2)
       ON CONFLICT (key) DO UPDATE SET description = EXCLUDED.description`,
      [permission.key, permission.description]
    );
  }
};

const ensurePricingPlans = async (client) => {
  for (const plan of pricingPlans) {
    await client.query(
      `INSERT INTO pricing_plans
        (name, slug, description, price_cents, price_display, price_suffix, cta_label, cta_href, is_featured, sort_order, features, token_limit)
       VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12)
       ON CONFLICT (slug) DO UPDATE SET
         name = EXCLUDED.name,
         description = EXCLUDED.description,
         price_cents = EXCLUDED.price_cents,
         price_display = EXCLUDED.price_display,
         price_suffix = EXCLUDED.price_suffix,
         cta_label = EXCLUDED.cta_label,
         cta_href = EXCLUDED.cta_href,
         is_featured = EXCLUDED.is_featured,
         sort_order = EXCLUDED.sort_order,
         features = EXCLUDED.features,
         token_limit = EXCLUDED.token_limit,
         updated_at = now()`,
      [
        plan.name,
        plan.slug,
        plan.description,
        plan.priceCents ?? null,
        plan.priceDisplay ?? null,
        plan.priceSuffix ?? null,
        plan.ctaLabel,
        plan.ctaHref,
        plan.isFeatured,
        plan.sortOrder ?? 0,
        plan.features,
        plan.tokenLimit ?? null,
      ]
    );
  }
};

const getOrganizationId = async (client) => {
  const result = await client.query(
    `INSERT INTO organizations (name)
     VALUES ($1)
     ON CONFLICT (name) DO UPDATE SET name = EXCLUDED.name
     RETURNING id`,
    [DEFAULT_ORG_NAME]
  );
  return result.rows[0].id;
};

const ensureRoles = async (client, orgId) => {
  const permissionRows = await client.query('SELECT id, key FROM permissions');
  const permissionIdByKey = new Map(permissionRows.rows.map((row) => [row.key, row.id]));

  for (const role of roleDefinitions) {
    const roleResult = await client.query(
      `INSERT INTO roles (org_id, name, description)
       VALUES ($1, $2, $3)
       ON CONFLICT (org_id, name) DO UPDATE SET description = EXCLUDED.description
       RETURNING id`,
      [orgId, role.name, role.description]
    );
    const roleId = roleResult.rows[0].id;

    await client.query('DELETE FROM role_permissions WHERE role_id = $1', [roleId]);

    const permissionIds = role.permissionKeys
      .map((key) => permissionIdByKey.get(key))
      .filter(Boolean);

    for (const permissionId of permissionIds) {
      await client.query(
        `INSERT INTO role_permissions (role_id, permission_id)
         VALUES ($1, $2)
         ON CONFLICT DO NOTHING`,
        [roleId, permissionId]
      );
    }
  }
};

const ensureSuperAdmin = async (client, orgId) => {
  const passwordHash = await bcrypt.hash(SUPER_ADMIN_PASSWORD, 10);
  const userResult = await client.query(
    `INSERT INTO users (org_id, name, email, password_hash, status, is_super_admin)
     VALUES ($1, $2, $3, $4, 'active', true)
     ON CONFLICT (email) DO UPDATE SET
       org_id = EXCLUDED.org_id,
       name = EXCLUDED.name,
       password_hash = EXCLUDED.password_hash,
       status = 'active',
       is_super_admin = true
     RETURNING id`,
    [orgId, SUPER_ADMIN_NAME, SUPER_ADMIN_EMAIL, passwordHash]
  );

  const adminRole = await client.query(
    'SELECT id FROM roles WHERE org_id = $1 AND name = $2',
    [orgId, 'Admin']
  );
  if (adminRole.rows[0]) {
    await client.query(
      `INSERT INTO user_roles (user_id, role_id)
       VALUES ($1, $2)
       ON CONFLICT DO NOTHING`,
      [userResult.rows[0].id, adminRole.rows[0].id]
    );
  }

  return userResult.rows[0].id;
};

const ensureUserProfile = async (client, userId) => {
  await client.query(
    `INSERT INTO user_profiles (user_id, full_name, organization_name, timezone, language)
     VALUES ($1, $2, $3, $4, $5)
     ON CONFLICT (user_id) DO UPDATE SET
       full_name = EXCLUDED.full_name,
       organization_name = EXCLUDED.organization_name,
       timezone = EXCLUDED.timezone,
       language = EXCLUDED.language,
       updated_at = now()`,
    [userId, SUPER_ADMIN_NAME, 'LexDraft Law Firm', 'EST', 'English']
  );
};

const ensureUserPlan = async (client, userId, planSlug) => {
  const planResult = await client.query('SELECT id FROM pricing_plans WHERE slug = $1', [planSlug]);
  if (!planResult.rows[0]) {
    return;
  }
  await client.query(
    `UPDATE users SET plan_id = $1, updated_at = now()
     WHERE id = $2`,
    [planResult.rows[0].id, userId]
  );
};

const ensureUsage = async (client, userId) => {
  const now = new Date();
  const periodStart = new Date(now.getFullYear(), now.getMonth(), 1);
  const periodEnd = new Date(now.getFullYear(), now.getMonth() + 1, 0);
  await client.query(
    `INSERT INTO ai_usage
      (user_id, period_start, period_end, tokens_used, token_limit, cache_savings_gb, savings_cents)
     VALUES ($1, $2, $3, $4, $5, $6, $7)
     ON CONFLICT (user_id, period_start, period_end) DO UPDATE SET
       tokens_used = EXCLUDED.tokens_used,
       token_limit = EXCLUDED.token_limit,
       cache_savings_gb = EXCLUDED.cache_savings_gb,
       savings_cents = EXCLUDED.savings_cents,
       updated_at = now()`,
    [userId, periodStart, periodEnd, 13000, 20000, 4.2, 12400]
  );
};

const run = async () => {
  if (!process.env.DATABASE_URL) {
    throw new Error('DATABASE_URL is required to seed the database.');
  }

  const client = await pool.connect();
  try {
    await client.query('BEGIN');
    await ensurePermissions(client);
    const orgId = await getOrganizationId(client);
    await ensureRoles(client, orgId);
    await ensurePricingPlans(client);
    const superAdminId = await ensureSuperAdmin(client, orgId);
    await ensureUserProfile(client, superAdminId);
    await ensureUserPlan(client, superAdminId, 'team');
    await ensureUsage(client, superAdminId);
    await client.query('COMMIT');
    console.log('RBAC seed completed successfully.');
  } catch (error) {
    await client.query('ROLLBACK');
    console.error('RBAC seed failed:', error);
    process.exitCode = 1;
  } finally {
    client.release();
    await pool.end();
  }
};

run();
