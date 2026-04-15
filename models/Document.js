import mongoose from 'mongoose';

const documentSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
      ref: 'User',
    },
    title: {
      type: String,
      required: [true, 'Document title is required'],
    },
    content: {
      type: String,
      required: [true, 'Document content is required'],
    },
    analysis: {
      type: Object,
      default: {},
    },
    versions: [
      {
        title: String,
        content: String,
        analysis: Object,
        updatedAt: {
          type: Date,
          default: Date.now,
        },
      },
    ],
  },
  {
    timestamps: true,
  }
);

const Document = mongoose.model('Document', documentSchema);
export default Document;
