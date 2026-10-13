import { pgTable, text, timestamp, boolean, serial, integer, unique, jsonb, index } from 'drizzle-orm/pg-core'

// --- Better Auth required tables -------------------------------------------
// Column names are camelCase to match Better Auth's defaults. Do not rename.

export const user = pgTable('user', {
  id: text('id').primaryKey(),
  name: text('name').notNull(),
  email: text('email').notNull().unique(),
  emailVerified: boolean('emailVerified').notNull().default(false),
  image: text('image'),
  createdAt: timestamp('createdAt').notNull().defaultNow(),
  updatedAt: timestamp('updatedAt').notNull().defaultNow(),
})

export const session = pgTable('session', {
  id: text('id').primaryKey(),
  expiresAt: timestamp('expiresAt').notNull(),
  token: text('token').notNull().unique(),
  createdAt: timestamp('createdAt').notNull().defaultNow(),
  updatedAt: timestamp('updatedAt').notNull().defaultNow(),
  ipAddress: text('ipAddress'),
  userAgent: text('userAgent'),
  userId: text('userId')
    .notNull()
    .references(() => user.id, { onDelete: 'cascade' }),
})

export const account = pgTable('account', {
  id: text('id').primaryKey(),
  accountId: text('accountId').notNull(),
  providerId: text('providerId').notNull(),
  userId: text('userId')
    .notNull()
    .references(() => user.id, { onDelete: 'cascade' }),
  accessToken: text('accessToken'),
  refreshToken: text('refreshToken'),
  idToken: text('idToken'),
  accessTokenExpiresAt: timestamp('accessTokenExpiresAt'),
  refreshTokenExpiresAt: timestamp('refreshTokenExpiresAt'),
  scope: text('scope'),
  password: text('password'),
  createdAt: timestamp('createdAt').notNull().defaultNow(),
  updatedAt: timestamp('updatedAt').notNull().defaultNow(),
})

export const verification = pgTable('verification', {
  id: text('id').primaryKey(),
  identifier: text('identifier').notNull(),
  value: text('value').notNull(),
  expiresAt: timestamp('expiresAt').notNull(),
  createdAt: timestamp('createdAt').defaultNow(),
  updatedAt: timestamp('updatedAt').defaultNow(),
})

// --- App tables ------------------------------------------------------------
// This is a shared, collaborative trip-planning hub. Reads are intentionally
// shared across all signed-in family members; writes are scoped to the owner
// (a member can only change their own vote/comment/contribution). Tasks are
// collaborative: the creator or the assignee can update them.

// Per-member profile carrying the app role. The first member to sign up
// becomes the admin (handled in the server action layer).
export const member = pgTable('member', {
  id: serial('id').primaryKey(),
  userId: text('userId').notNull().unique(),
  role: text('role').notNull().default('member'), // 'admin' | 'member'
  createdAt: timestamp('createdAt').notNull().defaultNow(),
})

// One vote per member per item. itemId is a stable key like
// "activity:whale-watching", "decision:timing:early", or "concept:saomiguel-only".
export const vote = pgTable(
  'vote',
  {
    id: serial('id').primaryKey(),
    userId: text('userId').notNull(),
    authorName: text('authorName').notNull(),
    itemId: text('itemId').notNull(),
    choice: text('choice').notNull(), // 'must' | 'interested' | 'skip' | 'no'
    updatedAt: timestamp('updatedAt').notNull().defaultNow(),
  },
  (t) => ({
    uniqueVote: unique('vote_user_item_unique').on(t.userId, t.itemId),
  }),
)

// Shared comments attached to any activity/decision/concept thread.
export const comment = pgTable('comment', {
  id: serial('id').primaryKey(),
  userId: text('userId').notNull(),
  authorName: text('authorName').notNull(),
  threadId: text('threadId').notNull(),
  body: text('body').notNull(),
  createdAt: timestamp('createdAt').notNull().defaultNow(),
})

// Collaborative follow-up tasks. Assignable, with due dates, status and findings.
export const task = pgTable('task', {
  id: serial('id').primaryKey(),
  creatorId: text('creatorId').notNull(),
  creatorName: text('creatorName').notNull(),
  title: text('title').notNull(),
  detail: text('detail'),
  // Optional link back to an activity/decision/concept.
  itemRef: text('itemRef'),
  itemLabel: text('itemLabel'),
  assigneeId: text('assigneeId'),
  assigneeName: text('assigneeName'),
  status: text('status').notNull().default('todo'), // 'todo' | 'in-progress' | 'blocked' | 'done'
  dueDate: timestamp('dueDate'),
  findings: text('findings'),
  createdAt: timestamp('createdAt').notNull().defaultNow(),
  updatedAt: timestamp('updatedAt').notNull().defaultNow(),
})

// Shared contributions: notes, links, and photos that add to the trip.
export const activityProgress = pgTable(
  'activity_progress',
  {
    id: serial('id').primaryKey(),
    userId: text('userId').notNull(),
    activityId: text('activityId').notNull(),
    state: text('state').notNull().default('unseen'), // 'unseen' | 'reviewed'
    lastViewedAt: timestamp('lastViewedAt').notNull().defaultNow(),
    updatedAt: timestamp('updatedAt').notNull().defaultNow(),
  },
  (t) => ({
    uniqueUserActivity: unique('activity_progress_user_activity_unique').on(t.userId, t.activityId),
  }),
)

export const accommodation = pgTable('accommodation', {
  id: serial('id').primaryKey(), name: text('name').notNull(), slug: text('slug').notNull().unique(), sourceUrl: text('sourceUrl').notNull(), kpis: jsonb('kpis').$type<import('@/lib/accommodation-kpis').AccommodationKpis>().notNull().default({} as import('@/lib/accommodation-kpis').AccommodationKpis), kpiVerifiedAt: timestamp('kpiVerifiedAt'), sourceDomain: text('sourceDomain'), location: text('location'), island: text('island').notNull().default('São Miguel'), summary: text('summary'), capacity: integer('capacity'), bedrooms: integer('bedrooms'), bathrooms: text('bathrooms'), bedConfiguration: text('bedConfiguration'), propertyType: text('propertyType'), amenities: jsonb('amenities').$type<Record<string, boolean | string[]>>().notNull().default({}), rating: text('rating'), reviewCount: integer('reviewCount'), reviewHighlights: text('reviewHighlights'), reviewConcerns: text('reviewConcerns'), agentMaxSummary: text('agentMaxSummary'), unresolvedQuestions: text('unresolvedQuestions'), status: text('status').notNull().default('submitted'), researchStatus: text('researchStatus').notNull().default('research-needed'), submittedByUserId: text('submittedByUserId').notNull(), submittedByName: text('submittedByName').notNull(), lastResearchedAt: timestamp('lastResearchedAt'), publishedAt: timestamp('publishedAt'), archivedAt: timestamp('archivedAt'), createdAt: timestamp('createdAt').notNull().defaultNow(), updatedAt: timestamp('updatedAt').notNull().defaultNow(),
}, (t) => ({ statusIdx: index('accommodation_status_idx').on(t.status), researchIdx: index('accommodation_research_status_idx').on(t.researchStatus), sourceIdx: index('accommodation_source_url_idx').on(t.sourceUrl) }))

export const accommodationBedroomDetail = pgTable('accommodation_bedroom_detail', { id: serial('id').primaryKey(), accommodationId: integer('accommodationId').notNull().references(() => accommodation.id, { onDelete: 'cascade' }), roomName: text('roomName').notNull(), bedType: text('bedType'), bedQuantity: integer('bedQuantity'), sleepingCapacity: integer('sleepingCapacity'), ensuiteStatus: text('ensuiteStatus'), notes: text('notes'), createdAt: timestamp('createdAt').notNull().defaultNow() })

export const accommodationAvailability = pgTable('accommodation_availability', {
  id: serial('id').primaryKey(), accommodationId: integer('accommodationId').notNull().references(() => accommodation.id, { onDelete: 'cascade' }), startDate: timestamp('startDate'), endDate: timestamp('endDate'), nights: integer('nights'), availability: text('availability').notNull().default('unknown'), currency: text('currency'), nightlyRate: text('nightlyRate'), fees: text('fees'), taxes: text('taxes'), totalPrice: text('totalPrice'), cancellationPolicy: text('cancellationPolicy'), sourceUrl: text('sourceUrl'), verificationMethod: text('verificationMethod').notNull().default('listing'), confidence: text('confidence').notNull().default('unconfirmed'), notes: text('notes'), checkedByUserId: text('checkedByUserId').notNull(), checkedByName: text('checkedByName').notNull(), checkedAt: timestamp('checkedAt').notNull().defaultNow(), createdAt: timestamp('createdAt').notNull().defaultNow(),
}, (t) => ({ lookupIdx: index('accommodation_availability_lookup_idx').on(t.accommodationId, t.checkedAt) }))

export const accommodationResearchNote = pgTable('accommodation_research_note', {
  id: serial('id').primaryKey(), accommodationId: integer('accommodationId').notNull().references(() => accommodation.id, { onDelete: 'cascade' }), kind: text('kind').notNull().default('finding'), title: text('title'), body: text('body').notNull(), sourceUrl: text('sourceUrl'), createdByUserId: text('createdByUserId').notNull(), createdByName: text('createdByName').notNull(), isAgentMax: boolean('isAgentMax').notNull().default(false), createdAt: timestamp('createdAt').notNull().defaultNow(),
}, (t) => ({ lookupIdx: index('accommodation_notes_lookup_idx').on(t.accommodationId, t.createdAt) }))

export const accommodationImportBackup = pgTable('accommodation_import_backup', { id: integer('id').primaryKey().default(1), payload: jsonb('payload').notNull(), importedAt: timestamp('importedAt').notNull().defaultNow(), importedByUserId: text('importedByUserId').notNull(), importedByName: text('importedByName').notNull() })

export const accommodationRevision = pgTable('accommodation_revision', {
  id: serial('id').primaryKey(), accommodationId: integer('accommodationId').notNull().references(() => accommodation.id, { onDelete: 'cascade' }), action: text('action').notNull(), beforeData: jsonb('beforeData'), afterData: jsonb('afterData'), actorUserId: text('actorUserId').notNull(), actorName: text('actorName').notNull(), createdAt: timestamp('createdAt').notNull().defaultNow(),
}, (t) => ({ lookupIdx: index('accommodation_revisions_lookup_idx').on(t.accommodationId, t.createdAt) }))

export const contribution = pgTable('contribution', {
  id: serial('id').primaryKey(),
  userId: text('userId').notNull(),
  authorName: text('authorName').notNull(),
  kind: text('kind').notNull(), // 'note' | 'link' | 'photo'
  title: text('title'),
  body: text('body'), // note text or link URL
  // For photos: the private Blob pathname served through /api/file.
  photoPathname: text('photoPathname'),
  // Optional links back to a task or an activity/decision/concept.
  taskId: integer('taskId'),
  itemRef: text('itemRef'),
  itemLabel: text('itemLabel'),
  createdAt: timestamp('createdAt').notNull().defaultNow(),
})
