import { model, Schema } from "mongoose";

const subscriptionSchema = new Schema(
  {
    name: { type: String, trim: true, minLength: 2, maxLength: 100 },
    price: {
      type: Number,
      required: [true, "Price is required"],
      min: [0, "Price must be greather than 0"],
    },
    currency: { type: String, enum: ["USD", "PHP", "EUR"], default: "PHP" },
    frequency: { type: String, enum: ["daily", "weekly", "monthly", "yearly"] },
    category: {
      type: String,
      required: true,
      enum: [
        "sports",
        "news",
        "entertainment",
        "lifestyle",
        "technology",
        "finance",
        "politics",
        "others",
      ],
    },
    paymentMethod: { type: String, required: true, trim: true },
    status: {
      type: String,
      enum: ["active", "cancelled", "expired"],
      default: "active",
    },
    startDate: {
      type: Date,
      required: true,
      validate: {
        validator: (value) => value < new Date(),
        message: "Start date must in the past",
      },
    },
    renewalDate: {
      type: Date,
      validate: {
        validator: function (value) {
          return value > this.startDate;
        },
        message: "Renewal date must be after the start date",
      },
    },
    user: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
  },
  { timestamps: true }
);

subscriptionSchema.pre("save", function (next) {
  if (!this.renewalDate) {
    this.renewalDate = new Date(this.startDate); // Start from startDate

    switch (this.frequency) {
      case "daily":
        this.renewalDate.setDate(this.renewalDate.getDate() + 1);
        break;
      case "weekly":
        this.renewalDate.setDate(this.renewalDate.getDate() + 7);
        break;
      case "monthly":
        this.renewalDate.setMonth(this.renewalDate.getMonth() + 1);
        break;
      case "yearly":
        this.renewalDate.setFullYear(this.renewalDate.getFullYear() + 1);
        break;
      default:
        break;
    }
  }

  // auto-update the status if renewal date has passed
  // This check assumes `this.renewalDate` is now correctly calculated.
  if (this.renewalDate && this.renewalDate < new Date()) {
    // Add null check for renewalDate
    this.status = "expired";
  }

  next();
});

const Subscription = model("Subscription", subscriptionSchema);

export default Subscription;
