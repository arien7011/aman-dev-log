import mongoose, { Document, Schema, Model } from 'mongoose';
import slugify from 'slugify';
import { calculateReadingTime } from '@/lib/utils/reading-time';

// ----------------------------------------------------------------
// Document interface — represents one Blog document in MongoDB.
// ----------------------------------------------------------------
export interface IBlog extends Document {
  title: string;
  slug: string;
  content: string;
  excerpt: string;
  coverImage: string;
  author: string;           // Display name (e.g. "Aman Mishra")
  status: 'draft' | 'published';
  tags: string[];           // Plain string tags
  category: string;         // Plain category slug (e.g. "react")
  readingTime: number;      // Auto-calculated
  featured: boolean;
  views: number;
  likes: number;
  createdAt: Date;
  updatedAt: Date;
}

const blogSchema = new Schema<IBlog>(
  {
    title: {
      type: String,
      required: [true, 'Title is required'],
      trim: true,
      minlength: [5, 'Title must be at least 5 characters'],
      maxlength: [150, 'Title must be at most 150 characters'],
    },
    slug: {
      type: String,
      unique: true,
      lowercase: true,
      trim: true,
    },
    content: {
      type: String,
      required: [true, 'Content is required'],
      default: '',
    },
    excerpt: {
      type: String,
      required: [true, 'Excerpt is required'],
      trim: true,
      maxlength: [300, 'Excerpt must be at most 300 characters'],
    },
    coverImage: {
      type: String,
      default: '',
    },
    author: {
      type: String,
      required: true,
      default: 'Aman Mishra',
    },
    status: {
      type: String,
      enum: ['draft', 'published'],
      default: 'draft',
    },
    tags: {
      type: [String],
      default: [],
    },
    category: {
      type: String,
      default: 'general',
      lowercase: true,
      trim: true,
    },
    readingTime: {
      type: Number,
      default: 1,
    },
    featured: {
      type: Boolean,
      default: false,
    },
    views: {
      type: Number,
      default: 0,
    },
    likes: {
      type: Number,
      default: 0,
    },
  },
  {
    timestamps: true,               // auto-manages createdAt / updatedAt
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
  }
);

// ----------------------------------------------------------------
// Pre-save hook: auto-generate slug + calculate reading time
// ----------------------------------------------------------------
blogSchema.pre<IBlog>('save', async function (next) {
  // Recalculate reading time whenever content changes
  if (this.isModified('content')) {
    this.readingTime = calculateReadingTime(this.content);
  }

  // Only regenerate slug when title changes (or on first create)
  if (this.isModified('title') || !this.slug) {
    const base = slugify(this.title, { lower: true, strict: true, trim: true });

    // Check for slug collision; if exists, append a short timestamp fragment
    const existing = await (this.constructor as Model<IBlog>).findOne({
      slug: base,
      _id: { $ne: this._id },
    });

    this.slug = existing ? `${base}-${Date.now().toString(36)}` : base;
  }

  next();
});

// Also handle findOneAndUpdate so readingTime stays accurate on PUT calls
blogSchema.pre('findOneAndUpdate', function (next) {
  const update = this.getUpdate() as Partial<IBlog> & { $set?: Partial<IBlog> };
  const content = update?.content ?? update?.$set?.content;
  if (content) {
    const rt = calculateReadingTime(content);
    if (update.$set) {
      update.$set.readingTime = rt;
    } else {
      (update as Record<string, unknown>).readingTime = rt;
    }
  }
  next();
});

// ----------------------------------------------------------------
// Prevent model re-registration during Next.js hot-reload
// ----------------------------------------------------------------
const Blog: Model<IBlog> =
  (mongoose.models.Blog as Model<IBlog>) ||
  mongoose.model<IBlog>('Blog', blogSchema);

export default Blog;
